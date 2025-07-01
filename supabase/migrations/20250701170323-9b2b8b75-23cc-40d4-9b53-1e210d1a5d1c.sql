
-- First, let's see what policies exist and clean them up
DROP POLICY IF EXISTS "Allow public reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow public reservation inserts" ON public.reservations;
DROP POLICY IF EXISTS "Allow admin users to view reservations" ON public.reservations;

-- Create a single, comprehensive policy for public inserts
CREATE POLICY "Enable public reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

-- Keep the admin view policy
CREATE POLICY "Allow admin users to view reservations"
ON public.reservations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);

-- Ensure RLS is enabled
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
