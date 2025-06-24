
-- Add policy to allow anonymous inserts for Make.com automation
CREATE POLICY "Allow anonymous inserts for automation" 
ON public.photo_booth_posts 
FOR INSERT 
TO public 
WITH CHECK (true);
