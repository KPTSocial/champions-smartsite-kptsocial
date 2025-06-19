
-- Create the photos storage bucket for photo booth uploads and wall of fame
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);

-- Create policy to allow public access to view images in the photos bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'photos' AND auth.role() = 'authenticated');
