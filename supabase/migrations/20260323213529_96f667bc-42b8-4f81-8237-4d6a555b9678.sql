CREATE POLICY "Admins can upload seasonal card images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'photos'
  AND (storage.foldername(name))[1] = 'Special Events'
  AND public.is_admin(auth.uid())
);