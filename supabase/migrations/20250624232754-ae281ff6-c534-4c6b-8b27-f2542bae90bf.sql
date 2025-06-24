
-- Temporarily disable RLS on photo_booth_posts table for Make.com testing
ALTER TABLE public.photo_booth_posts DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on photo_booth_posts to clean slate
DROP POLICY IF EXISTS "Allow anonymous inserts for automation" ON public.photo_booth_posts;
DROP POLICY IF EXISTS "Users can view their own posts" ON public.photo_booth_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.photo_booth_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.photo_booth_posts;
