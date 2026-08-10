-- ============================================================
-- Guest Checkout Migration
-- ============================================================

-- 1. Relax NOT NULL constraint on orders and addresses for guests
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.addresses ALTER COLUMN user_id DROP NOT NULL;

-- 2. Update increment_coupon_usage_for_user RPC to skip per-user limits for guests
-- Guests are effectively allowed to use non-per-user-limit coupons infinitely,
-- but the global used_count still increments and respects usage_limit.
CREATE OR REPLACE FUNCTION public.increment_coupon_usage_for_user(
  p_coupon_id uuid,
  p_user_id   uuid
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
  -- If p_user_id is null (Guest), they can only use coupons that have no per-user limit
  IF v_per_user_limit IS NOT NULL THEN
    IF p_user_id IS NULL THEN
      -- In validateCouponServer we fail fast, but here we strictly deny.
      RETURN false;
    END IF;

    SELECT usage_count INTO v_user_usage_count
      FROM public.coupon_usages
      WHERE coupon_id = p_coupon_id AND user_id = p_user_id FOR UPDATE;
      
    IF FOUND AND v_user_usage_count >= v_per_user_limit THEN
      RETURN false;
    END IF;
  END IF;

  -- Increment global used_count
  UPDATE public.coupons
    SET used_count = used_count + 1
    WHERE id = p_coupon_id;

  -- Upsert per-user usage row only if not guest
  IF p_user_id IS NOT NULL THEN
    INSERT INTO public.coupon_usages (coupon_id, user_id, usage_count)
      VALUES (p_coupon_id, p_user_id, 1)
      ON CONFLICT (coupon_id, user_id)
      DO UPDATE SET
        usage_count = public.coupon_usages.usage_count + 1,
        updated_at  = now();
  END IF;

  RETURN true;
END;
$$;

-- 3. Update decrement_coupon_usage_for_user RPC to handle guests
CREATE OR REPLACE FUNCTION public.decrement_coupon_usage_for_user(
  p_coupon_id uuid,
  p_user_id   uuid
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Lock the row to match the locking discipline
  PERFORM id FROM public.coupons WHERE id = p_coupon_id FOR UPDATE;
  IF p_user_id IS NOT NULL THEN
    PERFORM id FROM public.coupon_usages WHERE coupon_id = p_coupon_id AND user_id = p_user_id FOR UPDATE;
  END IF;

  -- Decrement global used_count safely
  UPDATE public.coupons
    SET used_count = greatest(used_count - 1, 0)
    WHERE id = p_coupon_id;

  -- Decrement per-user usage safely if not guest
  IF p_user_id IS NOT NULL THEN
    UPDATE public.coupon_usages
      SET usage_count = greatest(usage_count - 1, 0),
          updated_at = now()
      WHERE coupon_id = p_coupon_id AND user_id = p_user_id;
  END IF;
END;
$$;
