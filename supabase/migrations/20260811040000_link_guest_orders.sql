-- Migration to update handle_new_user to link guest orders

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_phone text;
BEGIN
  -- 1. Insert profile
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');

  -- 2. Automatically link guest orders by email
  -- Try to find the most recent guest order with a verified phone to auto-verify profile
  SELECT guest_phone INTO v_phone
  FROM public.orders
  WHERE guest_email = new.email AND user_id IS NULL AND guest_phone_verified = true
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_phone IS NOT NULL THEN
      UPDATE public.profiles
      SET phone = v_phone, phone_verified = true
      WHERE id = new.id;
  END IF;

  -- Link orders
  UPDATE public.orders
  SET user_id = new.id
  WHERE guest_email = new.email AND user_id IS NULL;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
