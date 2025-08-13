-- Add approved boolean column to photo_booth_posts table
ALTER TABLE public.photo_booth_posts 
ADD COLUMN approved boolean NOT NULL DEFAULT false;

-- Create index for performance when querying approved posts
CREATE INDEX idx_photo_booth_posts_approved ON public.photo_booth_posts(approved);

-- Update existing approved posts to have approved = true
UPDATE public.photo_booth_posts 
SET approved = true 
WHERE status = 'approved';