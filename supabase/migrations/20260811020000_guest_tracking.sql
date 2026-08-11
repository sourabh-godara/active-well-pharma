-- ============================================================
-- Guest Checkout — Edge Case Hardening + Order Tracking
-- ============================================================

-- 1. Guest contact info on orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS guest_name text,
  ADD COLUMN IF NOT EXISTS guest_email text,
  ADD COLUMN IF NOT EXISTS guest_phone text,
  ADD COLUMN IF NOT EXISTS guest_tracking_token text;

-- Unique, unguessable token per order for the guest tracking link
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_guest_tracking_token
  ON public.orders (guest_tracking_token)
  WHERE guest_tracking_token IS NOT NULL;

-- Constraint: an order is either tied to a user OR has guest contact info
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_has_identity;
ALTER TABLE public.orders ADD CONSTRAINT orders_has_identity
  CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);

-- 2. Update coupon_usages to support guest_email
ALTER TABLE public.coupon_usages ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.coupon_usages ADD COLUMN IF NOT EXISTS guest_email text;

ALTER TABLE public.coupon_usages DROP CONSTRAINT IF EXISTS coupon_usages_user_or_guest;
ALTER TABLE public.coupon_usages ADD CONSTRAINT coupon_usages_user_or_guest
  CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);

-- Drop old unique constraint. We need to identify its name. It is likely `coupon_usages_coupon_id_user_id_key` or just `coupon_usages_coupon_id_user_id_key`.
-- Let's just drop it if it exists by its name. The actual name is usually implicit, wait. In coupons_per_user_migration.sql, it was defined as `unique (coupon_id, user_id)`.
ALTER TABLE public.coupon_usages DROP CONSTRAINT IF EXISTS coupon_usages_coupon_id_user_id_key;

-- We also have an index `idx_coupon_usages_coupon_user`, let's drop that.
DROP INDEX IF EXISTS public.idx_coupon_usages_coupon_user;

-- Create partial unique indexes for user_id and guest_email
CREATE UNIQUE INDEX IF NOT EXISTS idx_coupon_usages_user 
  ON public.coupon_usages (coupon_id, user_id) 
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_coupon_usages_email 
  ON public.coupon_usages (coupon_id, guest_email) 
  WHERE guest_email IS NOT NULL;

-- 3. Update increment_coupon_usage_for_user RPC to track by identifier (user_id or guest_email)
DROP FUNCTION IF EXISTS public.increment_coupon_usage_for_user(uuid, uuid);
DROP FUNCTION IF EXISTS public.increment_coupon_usage_for_user(uuid, uuid, text);

CREATE OR REPLACE FUNCTION public.increment_coupon_usage_for_user(
  p_coupon_id uuid,
  p_user_id   uuid,
  p_guest_email text DEFAULT NULL
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_usage_limit int;
  v_per_user_limit int;
  v_used_count int;
  v_user_usage_count int;
BEGIN
  -- Lock the row and read limits
  SELECT usage_limit, per_user_limit, used_count
    INTO v_usage_limit, v_per_user_limit, v_used_count
    FROM public.coupons
    WHERE id = p_coupon_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check global limit
  IF v_usage_limit IS NOT NULL AND v_used_count >= v_usage_limit THEN
    RETURN false;
  END IF;

  -- Check per-user limit
  IF v_per_user_limit IS NOT NULL THEN
    IF p_user_id IS NOT NULL THEN
      SELECT usage_count INTO v_user_usage_count
        FROM public.coupon_usages
        WHERE coupon_id = p_coupon_id AND user_id = p_user_id FOR UPDATE;
    ELSIF p_guest_email IS NOT NULL THEN
      SELECT usage_count INTO v_user_usage_count
        FROM public.coupon_usages
        WHERE coupon_id = p_coupon_id AND guest_email = p_guest_email FOR UPDATE;
    ELSE
      -- Should not happen with valid orders, but if both are null, deny.
      RETURN false;
    END IF;
      
    IF FOUND AND v_user_usage_count >= v_per_user_limit THEN
      RETURN false;
    END IF;
  END IF;

  -- Increment global used_count
  UPDATE public.coupons
    SET used_count = used_count + 1
    WHERE id = p_coupon_id;

  -- Upsert per-user/email usage row
  IF p_user_id IS NOT NULL THEN
    INSERT INTO public.coupon_usages (coupon_id, user_id, usage_count)
      VALUES (p_coupon_id, p_user_id, 1)
      ON CONFLICT (coupon_id, user_id) WHERE user_id IS NOT NULL
      DO UPDATE SET
        usage_count = public.coupon_usages.usage_count + 1,
        updated_at  = now();
  ELSIF p_guest_email IS NOT NULL THEN
    INSERT INTO public.coupon_usages (coupon_id, guest_email, usage_count)
      VALUES (p_coupon_id, p_guest_email, 1)
      ON CONFLICT (coupon_id, guest_email) WHERE guest_email IS NOT NULL
      DO UPDATE SET
        usage_count = public.coupon_usages.usage_count + 1,
        updated_at  = now();
  END IF;

  RETURN true;
END;
$$;

-- 4. Update decrement_coupon_usage_for_user RPC to handle guest_email
DROP FUNCTION IF EXISTS public.decrement_coupon_usage_for_user(uuid, uuid);
DROP FUNCTION IF EXISTS public.decrement_coupon_usage_for_user(uuid, uuid, text);

CREATE OR REPLACE FUNCTION public.decrement_coupon_usage_for_user(
  p_coupon_id uuid,
  p_user_id   uuid,
  p_guest_email text DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Lock the row to match the locking discipline
  PERFORM id FROM public.coupons WHERE id = p_coupon_id FOR UPDATE;
  
  IF p_user_id IS NOT NULL THEN
    PERFORM id FROM public.coupon_usages WHERE coupon_id = p_coupon_id AND user_id = p_user_id FOR UPDATE;
  ELSIF p_guest_email IS NOT NULL THEN
    PERFORM id FROM public.coupon_usages WHERE coupon_id = p_coupon_id AND guest_email = p_guest_email FOR UPDATE;
  END IF;

  -- Decrement global used_count safely
  UPDATE public.coupons
    SET used_count = greatest(used_count - 1, 0)
    WHERE id = p_coupon_id;

  -- Decrement per-user usage safely
  IF p_user_id IS NOT NULL THEN
    UPDATE public.coupon_usages
      SET usage_count = greatest(usage_count - 1, 0),
          updated_at = now()
      WHERE coupon_id = p_coupon_id AND user_id = p_user_id;
  ELSIF p_guest_email IS NOT NULL THEN
    UPDATE public.coupon_usages
      SET usage_count = greatest(usage_count - 1, 0),
          updated_at = now()
      WHERE coupon_id = p_coupon_id AND guest_email = p_guest_email;
  END IF;
END;
$$;
