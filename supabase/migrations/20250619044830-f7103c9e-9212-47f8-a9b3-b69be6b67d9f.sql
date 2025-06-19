
-- Drop the existing restrictive policy for uploads
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;

-- Create a new policy that allows anonymous uploads to the photobooth folder
CREATE POLICY "Allow anonymous uploads to photobooth folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos' 
  AND (storage.foldername(name))[1] = 'photobooth'
);

-- Update the existing policy to be more permissive for updates
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;

-- Create a new policy for updates that allows anonymous updates to photobooth folder
CREATE POLICY "Allow updates to photobooth uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'photos' 
  AND (storage.foldername(name))[1] = 'photobooth'
);
