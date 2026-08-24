-- Add email column to addresses table for guest checkout
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS email TEXT;
