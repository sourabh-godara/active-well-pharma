-- ============================================================
-- Migration: Razorpay payments, audit log, atomic stock deduction
-- Run in Supabase SQL Editor after reviewing.
-- ============================================================

-- ── 1. Extend the orders table ───────────────────────────────

-- Drop existing CHECK, add expanded one with Razorpay lifecycle statuses
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'pending',      -- legacy: created before Razorpay integration
    'created',      -- Razorpay order created, awaiting payment
    'paid',         -- payment captured (Razorpay confirmed)
    'confirmed',    -- admin confirmed for fulfillment (also used by placeOrderFree)
    'failed',       -- payment failed
    'shipped',
    'delivered',
    'cancelled'
  ));

-- New columns for Razorpay integration
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS razorpay_order_id text,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS receipt text,
  ADD COLUMN IF NOT EXISTS notes jsonb,
  ADD COLUMN IF NOT EXISTS idempotency_key text;

-- razorpay_order_id: unique among non-null values
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_razorpay_order_id
  ON orders (razorpay_order_id)
  WHERE razorpay_order_id IS NOT NULL;

-- idempotency_key: unique only among 'created' (unpaid) orders.
-- Once an order resolves (paid/failed/cancelled), it drops out of the index
-- and a fresh purchase of the same cart gets a new row.
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_idempotency_key_pending
  ON orders (idempotency_key)
  WHERE idempotency_key IS NOT NULL AND status = 'created';


-- ── 2. Auto-update updated_at on orders ──────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── 3. Payments table ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS payments (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             uuid NOT NULL REFERENCES orders(id),
  razorpay_payment_id  text UNIQUE NOT NULL,
  razorpay_signature   text NOT NULL DEFAULT '',
  amount               integer NOT NULL,         -- paise (Razorpay's native unit; internal only)
  currency             text NOT NULL DEFAULT 'INR',
  status               text NOT NULL CHECK (status IN ('captured', 'failed', 'refunded')),
  method               text,                     -- 'card', 'upi', 'netbanking', etc.
  verified_via         text NOT NULL CHECK (verified_via IN ('checkout_handler', 'webhook')),
  created_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments (via join to orders)
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- No INSERT/UPDATE/DELETE policies for authenticated/anon.
-- All writes go through service-role (admin client) only.


-- ── 4. Payment events (append-only audit log) ───────────────

CREATE TABLE IF NOT EXISTS payment_events (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid REFERENCES orders(id),         -- nullable (sig failures may not have an order)
  payment_id          uuid REFERENCES payments(id),       -- nullable (events before payment exists)
  event_type          text NOT NULL,
  razorpay_event_id   text,                               -- for dedup; null for non-webhook events
  raw_payload         jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address          text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- DB-level dedup: unique among non-null razorpay_event_id values.
-- Application code silently ignores 23505 violations on this index.
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_events_razorpay_event_id
  ON payment_events (razorpay_event_id)
  WHERE razorpay_event_id IS NOT NULL;

ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- No permissive policies → default deny for all client roles.
-- All access via service-role (admin client) only.


-- ── 5. Atomic stock deduction RPC ────────────────────────────
-- All-or-nothing: if any item has insufficient stock, raises EXCEPTION
-- which the caller catches without rolling back the payment confirmation.

CREATE OR REPLACE FUNCTION public.deduct_stock_for_cart(
  p_items jsonb  -- [{"product_id": "uuid-string", "quantity": 2}, ...]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item       jsonb;
  v_product_id uuid;
  v_quantity   int;
  v_updated    int;
  v_failures   jsonb := '[]'::jsonb;
  v_product    record;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item ->> 'product_id')::uuid;
    v_quantity   := (v_item ->> 'quantity')::int;

    -- Atomic conditional deduction: only succeeds if enough stock
    UPDATE products
    SET stock_quantity = stock_quantity - v_quantity,
        updated_at = now()
    WHERE id = v_product_id
      AND stock_quantity >= v_quantity;

    GET DIAGNOSTICS v_updated = ROW_COUNT;

    IF v_updated = 0 THEN
      SELECT name, stock_quantity INTO v_product
      FROM products WHERE id = v_product_id;

      v_failures := v_failures || jsonb_build_object(
        'product_id',   v_product_id,
        'product_name', COALESCE(v_product.name, 'Unknown'),
        'requested',    v_quantity,
        'available',    COALESCE(v_product.stock_quantity, 0)
      );
    ELSE
      INSERT INTO inventory_logs (product_id, change_type, quantity_changed)
      VALUES (v_product_id, 'order_deduction', -v_quantity);
    END IF;
  END LOOP;

  IF jsonb_array_length(v_failures) > 0 THEN
    RAISE EXCEPTION 'INSUFFICIENT_STOCK:%', v_failures::text;
  END IF;

  RETURN '[]'::jsonb;
END;
$$;


-- ── 6. Atomic payment confirmation RPC ───────────────────────
-- Called by both verify-payment and the webhook. First-confirmer-wins:
-- only the caller whose UPDATE transitions status from 'created' to 'paid'
-- proceeds to insert the payment record and deduct stock.
-- Stock failure is caught and logged without rolling back the payment.

CREATE OR REPLACE FUNCTION public.confirm_order_payment(
  p_order_id             uuid,
  p_razorpay_payment_id  text,
  p_razorpay_signature   text,
  p_amount               integer,      -- paise
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
BEGIN
  -- Step 1: Atomic status gate — exactly one concurrent caller wins
  UPDATE orders
  SET status = 'paid'
  WHERE id = p_order_id AND status = 'created'
  RETURNING id INTO v_transitioned_id;

  IF v_transitioned_id IS NULL THEN
    RETURN jsonb_build_object('won', false);
  END IF;

  -- Step 2: Upsert payment record
  INSERT INTO payments (
    order_id, razorpay_payment_id, razorpay_signature,
    amount, currency, status, method, verified_via
  )
  VALUES (
    p_order_id, p_razorpay_payment_id, p_razorpay_signature,
    p_amount, 'INR', 'captured', p_method, p_verified_via
  )
  ON CONFLICT (razorpay_payment_id) DO UPDATE SET
    verified_via = EXCLUDED.verified_via,
    method       = COALESCE(EXCLUDED.method, payments.method);

  -- Step 3: Atomic stock deduction — nested block so failure
  -- does NOT roll back steps 1–2 (a charged payment stays confirmed)
  BEGIN
    FOR v_item IN
      SELECT product_id, quantity FROM order_items
      WHERE order_id = p_order_id
    LOOP
      UPDATE products
      SET stock_quantity = stock_quantity - v_item.quantity,
          updated_at = now()
      WHERE id = v_item.product_id
        AND stock_quantity >= v_item.quantity;

      GET DIAGNOSTICS v_updated = ROW_COUNT;

      IF v_updated = 0 THEN
        v_stock_ok := false;

        SELECT name, stock_quantity INTO v_product
        FROM products WHERE id = v_item.product_id;

        v_failures := v_failures || jsonb_build_object(
          'product_id',   v_item.product_id,
          'product_name', COALESCE(v_product.name, 'Unknown'),
          'requested',    v_item.quantity,
          'available',    COALESCE(v_product.stock_quantity, 0)
        );
      ELSE
        INSERT INTO inventory_logs (product_id, change_type, quantity_changed)
        VALUES (v_item.product_id, 'order_deduction', -v_item.quantity);
      END IF;
    END LOOP;

    -- Stock shortfall: log it but don't roll back payment confirmation
    IF NOT v_stock_ok THEN
      INSERT INTO payment_events (order_id, event_type, raw_payload)
      VALUES (
        p_order_id,
        'stock.oversold',
        jsonb_build_object('failures', v_failures)
      );
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Unexpected error — log without rolling back payment confirmation
    v_stock_ok := false;
    INSERT INTO payment_events (order_id, event_type, raw_payload)
    VALUES (
      p_order_id,
      'stock.deduction_error',
      jsonb_build_object('error', SQLERRM, 'detail', SQLSTATE)
    );
  END;

  RETURN jsonb_build_object(
    'won',            true,
    'stock_ok',       v_stock_ok,
    'stock_failures', v_failures
  );
END;
$$;
