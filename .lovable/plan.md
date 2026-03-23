

# Fix: Event Image Upload RLS Policy

## Problem
The EventForm uploads images to `event-images/` path in the `photos` storage bucket, but storage RLS policies only allow authenticated uploads to the `photobooth` folder. This causes a 403 "new row violates row-level security policy" error.

## Solution
Add a storage policy on the `photos` bucket that allows authenticated admin users to upload files to the `event-images/` folder.

## Migration
```sql
CREATE POLICY "Admins can upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos'
  AND (storage.foldername(name))[1] = 'event-images'
  AND public.is_admin(auth.uid())
);
```

This keeps the bucket secure — only authenticated admins can upload to `event-images/`, matching the pattern already used for the `photobooth` folder.

## Files to Modify
None — this is a database-only migration.

