
-- Create RLS policy to allow public reservations
CREATE POLICY "Allow public reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admin users to view reservations (optional but useful)
CREATE POLICY "Allow admin users to view reservations"
ON public.reservations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);
