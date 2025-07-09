-- Add RLS policy to allow public read access to active header media
CREATE POLICY "Allow public read access to active header media" 
ON public.header_media 
FOR SELECT 
USING (is_active = true);