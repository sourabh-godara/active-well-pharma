
-- Enable RLS on storage.objects (if not already enabled, though usually is)
-- storage.buckets and storage.objects are managed by Supabase Storage

-- Allow authenticated users (like admins) to upload to 'image-storage' bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'image-storage'
);

-- Allow public access to view images
CREATE POLICY "Allow public view"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'image-storage'
);

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'image-storage'
);

-- Allow authenticated users to update images
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'image-storage'
);
