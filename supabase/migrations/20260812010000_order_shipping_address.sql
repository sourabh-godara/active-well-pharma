-- supabase/migrations/20260812010000_order_shipping_address.sql

-- Add JSONB snapshot column for delivery address
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Backfill existing orders with specific allowlisted fields from addresses table
UPDATE orders o
SET shipping_address = jsonb_build_object(
    'name', a.name,
    'phone', a.phone,
    'address_line', a.address_line,
    'locality', a.locality,
    'city', a.city,
    'state', a.state,
    'pincode', a.pincode,
    'landmark', a.landmark,
    'address_type', a.address_type
)
FROM addresses a
WHERE o.delivery_address_id = a.id
  AND o.shipping_address IS NULL;
