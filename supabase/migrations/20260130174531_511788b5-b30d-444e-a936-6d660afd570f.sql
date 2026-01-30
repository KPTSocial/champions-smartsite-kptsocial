-- Fix MISSING_RLS: Enable RLS on AI-related tables and add admin-only policies

-- Enable RLS on ai_content table
ALTER TABLE public.ai_content ENABLE ROW LEVEL SECURITY;

-- Enable RLS on ai_usage_tracking table  
ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Enable RLS on niche_configurations table
ALTER TABLE public.niche_configurations ENABLE ROW LEVEL SECURITY;

-- Add admin-only policies for ai_content
CREATE POLICY "Admins can manage ai_content" 
ON public.ai_content FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Add admin-only policies for ai_usage_tracking
CREATE POLICY "Admins can manage ai_usage_tracking" 
ON public.ai_usage_tracking FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Add admin-only policies for niche_configurations
CREATE POLICY "Admins can manage niche_configurations" 
ON public.niche_configurations FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Fix STORAGE_EXPOSURE: Tighten photo booth storage policies
-- Drop the overly permissive anonymous upload policy
DROP POLICY IF EXISTS "Allow anonymous uploads to photobooth folder" ON storage.objects;

-- Drop the anonymous update policy (users shouldn't update after upload)
DROP POLICY IF EXISTS "Allow updates to photobooth uploads" ON storage.objects;

-- Create a more restrictive policy - require authenticated users for uploads
CREATE POLICY "Authenticated users can upload to photobooth folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos' 
  AND (storage.foldername(name))[1] = 'photobooth'
);