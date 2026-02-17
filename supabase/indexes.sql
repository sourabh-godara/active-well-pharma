
-- Index for orders user_id (for "My Orders")
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);

-- Index for order_items joining
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON order_items(product_id);

-- Index for user_promotions lookups
CREATE INDEX IF NOT EXISTS user_promotions_user_id_idx ON user_promotions(user_id);
CREATE INDEX IF NOT EXISTS user_promotions_promotion_id_idx ON user_promotions(promotion_id);

-- Index for products filtering (future proofing)
CREATE INDEX IF NOT EXISTS products_is_active_idx ON products(is_active);
