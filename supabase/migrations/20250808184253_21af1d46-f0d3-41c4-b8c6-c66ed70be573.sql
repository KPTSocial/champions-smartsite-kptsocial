-- Fix infinite recursion in events RLS policies
-- Drop existing policies that are causing circular dependency
DROP POLICY IF EXISTS "Admin can manage all events" ON public.events;
DROP POLICY IF EXISTS "Allow public read access for published events" ON public.events;

-- Create new policies that don't cause circular dependency
-- Public read access for published events (no admin check needed)
CREATE POLICY "Public can read published events" 
ON public.events 
FOR SELECT 
USING (status = 'published');

-- Admin management policy using security definer function to avoid recursion
CREATE POLICY "Admins can manage all events" 
ON public.events 
FOR ALL 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));