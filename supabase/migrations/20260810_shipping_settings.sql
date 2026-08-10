-- Create singleton store_settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id integer PRIMARY KEY CHECK (id = 1),
    shipping_charge numeric(10, 2) NOT NULL DEFAULT 49.00,
    free_shipping_threshold numeric(10, 2) NOT NULL DEFAULT 499.00,
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access on store_settings"
ON public.store_settings
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin write access on store_settings"
ON public.store_settings
FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');

-- Insert default row
INSERT INTO public.store_settings (id, shipping_charge, free_shipping_threshold)
VALUES (1, 49.00, 499.00)
ON CONFLICT (id) DO NOTHING;

-- Add shipping_amount to orders if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='orders' AND column_name='shipping_amount') THEN
        ALTER TABLE public.orders ADD COLUMN shipping_amount numeric(10, 2) NOT NULL DEFAULT 0.00;
    END IF;
END $$;
