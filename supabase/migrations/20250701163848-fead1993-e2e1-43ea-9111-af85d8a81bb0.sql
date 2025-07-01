
-- Fix the RLS policy for reservations table
-- Drop the existing policy and recreate it properly
DROP POLICY IF EXISTS "Allow public reservations" ON public.reservations;

-- Create a new policy that allows anyone to insert reservations
CREATE POLICY "Allow public reservation inserts" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

-- Ensure the table has RLS enabled
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
