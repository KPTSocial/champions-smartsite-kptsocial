-- UPDATE policies for photos bucket folders
CREATE POLICY "Admins can update event images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'photos' AND (storage.foldername(name))[1] = 'event-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update hero badge images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'photos' AND (storage.foldername(name))[1] = 'hero-badges' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update seasonal card images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'photos' AND (storage.foldername(name))[1] = 'Special Events' AND public.is_admin(auth.uid()));

-- DELETE policies for photos bucket folders
CREATE POLICY "Admins can delete event images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'photos' AND (storage.foldername(name))[1] = 'event-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete hero badge images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'photos' AND (storage.foldername(name))[1] = 'hero-badges' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete seasonal card images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'photos' AND (storage.foldername(name))[1] = 'Special Events' AND public.is_admin(auth.uid()));