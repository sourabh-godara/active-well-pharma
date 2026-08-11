-- Add phone fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS phone_verified boolean not null default false;

-- Add guest_phone_verified to orders
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS guest_phone_verified boolean not null default false;
