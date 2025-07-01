-- Drop ALL existing policies to ensure clean slate
DROP POLICY IF EXISTS "Allow public reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow public reservation inserts" ON public.reservations;
DROP POLICY IF EXISTS "Enable public reservations" ON public.reservations;
DROP POLICY IF EXISTS "public_insert_reservations" ON public.reservations;
DROP POLICY IF EXISTS "admin_view_reservations" ON public.reservations;

-- Temporarily disable RLS to test if that's the issue
ALTER TABLE public.reservations DISABLE ROW LEVEL SECURITY;

-- Create a completely permissive policy for inserts
CREATE POLICY "allow_all_reservation_inserts" 
ON public.reservations 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

-- Create admin view policy
CREATE POLICY "admin_view_all_reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);

-- Re-enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;