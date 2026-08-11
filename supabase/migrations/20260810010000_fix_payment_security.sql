-- ============================================================
-- 1. Lock down RLS (ID-1)
-- ============================================================

-- Drop permissive INSERT policies on orders and order_items
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can insert order items" ON order_items;

-- Lock down profiles UPDATE policy to prevent role escalation
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    -- Users can only update their own profile and cannot change their role
    auth.uid() = id AND 
    role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- ============================================================
-- 2. Add Coupon Constraint (ID-6)
-- ============================================================

ALTER TABLE public.coupons
ADD CONSTRAINT check_percentage_discount_cap
CHECK (discount_type != 'percentage' OR discount_value < 100 OR max_discount_amount IS NOT NULL);

-- ============================================================
-- 3. Rewrite confirm_order_payment RPC (ID-2 + ID-3)
-- ============================================================

DROP FUNCTION IF EXISTS public.confirm_order_payment;

CREATE OR REPLACE FUNCTION public.confirm_order_payment(
  p_order_id             uuid,
  p_razorpay_payment_id  text,
  p_razorpay_signature   text,
  p_amount               integer,      -- paise
  p_status               text,         -- 'captured', 'authorized', etc.
  p_method               text,
  p_verified_via         text          -- 'checkout_handler' | 'webhook'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transitioned_id uuid;
  v_item            record;
  v_updated         int;
  v_product         record;
  v_failures        jsonb := '[]'::jsonb;
  v_stock_ok        boolean := true;
  v_expected_paise  integer;
BEGIN
  -- Step 1: Upsert payment record unconditionally (saves it even if amount is wrong or order already paid)
  INSERT INTO payments (
    order_id, razorpay_payment_id, razorpay_signature,
    amount, currency, status, method, verified_via
  )
  VALUES (
    p_order_id, p_razorpay_payment_id, p_razorpay_signature,
    p_amount, 'INR', p_status, p_method, p_verified_via
  )
  ON CONFLICT (razorpay_payment_id) DO UPDATE SET
    verified_via = EXCLUDED.verified_via,
    method       = COALESCE(EXCLUDED.method, payments.method),
    status       = EXCLUDED.status;

  -- Step 2: Amount Verification
  SELECT round(total_amount * 100)::integer INTO v_expected_paise FROM orders WHERE id = p_order_id;
  
  IF v_expected_paise IS NULL THEN
    RETURN jsonb_build_object('won', false, 'error', 'Order not found');
  END IF;

  IF p_amount != v_expected_paise THEN
    -- Mismatch: flag as failed internally, insert event, return distinct mismatch response
    UPDATE orders
    SET status = 'failed'
    WHERE id = p_order_id AND status = 'created'
    RETURNING id INTO v_transitioned_id;

    IF v_transitioned_id IS NOT NULL THEN
      INSERT INTO payment_events (order_id, event_type, raw_payload)
      VALUES (
        p_order_id, 
        'payment.amount_mismatch', 
        jsonb_build_object('expected', v_expected_paise, 'received', p_amount, 'payment_id', p_razorpay_payment_id)
      );
    END IF;

    RETURN jsonb_build_object('won', true, 'amount_mismatch', true);
  END IF;

  -- Step 3: Atomic status gate — exactly one concurrent caller wins for normal confirmation
  UPDATE orders
  SET status = 'paid'
  WHERE id = p_order_id AND status = 'created'
  RETURNING id INTO v_transitioned_id;

  IF v_transitioned_id IS NULL THEN
    RETURN jsonb_build_object('won', false);
  END IF;

  -- Step 4: Atomic Stock Deduction (Line-by-line lock)
  FOR v_item IN (
    SELECT product_id, quantity 
    FROM order_items 
    WHERE order_id = p_order_id 
    ORDER BY product_id
  ) LOOP
    SELECT id, stock_quantity, name INTO v_product
    FROM products
    WHERE id = v_item.product_id
    FOR UPDATE;

    IF v_product IS NULL OR v_product.stock_quantity < v_item.quantity THEN
      v_failures := v_failures || jsonb_build_object(
        'product_id', v_item.product_id,
        'requested', v_item.quantity,
        'available', COALESCE(v_product.stock_quantity, 0)
      );
      v_stock_ok := false;
    ELSE
      UPDATE products
      SET stock_quantity = stock_quantity - v_item.quantity
      WHERE id = v_item.product_id;
      
      INSERT INTO inventory_logs (product_id, change_type, quantity_changed)
      VALUES (v_item.product_id, 'order_deduction', -v_item.quantity);
    END IF;
  END LOOP;

  IF NOT v_stock_ok THEN
    UPDATE orders SET status = 'failed' WHERE id = p_order_id;
    INSERT INTO payment_events (order_id, event_type, raw_payload)
    VALUES (p_order_id, 'checkout.stock_failed', v_failures);
  ELSE
    INSERT INTO payment_events (order_id, event_type, raw_payload)
    VALUES (
      p_order_id, 
      'checkout.success', 
      jsonb_build_object('razorpay_payment_id', p_razorpay_payment_id)
    );
  END IF;

  RETURN jsonb_build_object('won', true, 'stock_ok', v_stock_ok);
END;
$$;
