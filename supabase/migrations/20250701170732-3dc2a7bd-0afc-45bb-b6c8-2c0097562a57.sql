-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow public reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow public reservation inserts" ON public.reservations;
DROP POLICY IF EXISTS "Enable public reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow admin users to view reservations" ON public.reservations;

-- Create a simple, explicit policy for public inserts
CREATE POLICY "public_insert_reservations" 
ON public.reservations 
FOR INSERT 
TO public
WITH CHECK (true);

-- Create admin view policy
CREATE POLICY "admin_view_reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);

-- Ensure RLS is enabled
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;