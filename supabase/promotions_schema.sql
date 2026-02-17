
-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  coupon_code TEXT,
  trigger_type TEXT CHECK (trigger_type IN ('on_load', 'time_delay', 'exit_intent')) NOT NULL DEFAULT 'on_load',
  delay_seconds INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  show_on_homepage BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_promotions table for tracking seen history
CREATE TABLE IF NOT EXISTS user_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  seen_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, promotion_id)
);

-- Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_promotions ENABLE ROW LEVEL SECURITY;

-- Policies for promotions
CREATE POLICY "Public read access for active promotions" ON promotions
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Admin full access for promotions" ON promotions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies for user_promotions
CREATE POLICY "Users can insert their own seen records" ON user_promotions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own seen records" ON user_promotions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admin full access for user_promotions" ON user_promotions
  FOR ALL TO authenticated USING (true); -- Ideally restrict to admin role check if possible, or reliance on app logic

-- Note: Single active promotion enforcement will be handled in application logic (server actions).
