
-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Policies for banners
CREATE POLICY "Public read access for banners" ON banners
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Admin full access for banners" ON banners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket policy for 'banners' (if using a separate bucket)
-- Assumes 'banners' bucket exists. If reusing 'image-storage', these policies might already be covered or need adjustment.
-- Here we define policies for a 'banners' bucket just in case.

-- INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true);

-- CREATE POLICY "Banners Public View" ON storage.objects FOR SELECT TO public USING (bucket_id = 'banners');
-- CREATE POLICY "Banners Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'banners');
-- CREATE POLICY "Banners Admin Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'banners');
-- CREATE POLICY "Banners Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'banners');
