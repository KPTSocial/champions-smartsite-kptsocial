-- Fix critical security issues: Protect admin_users and reservations tables from public access

-- PART 1: Fix admin_users table security
-- Drop existing policies on admin_users
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

-- Create new restrictive policies for admin_users

-- Policy 1: Only authenticated admins can view admin users
CREATE POLICY "Only authenticated admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid() 
    AND au.active = true
  )
);

-- Policy 2: Only super admins can manage admin users
CREATE POLICY "Only super admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid() 
    AND au.active = true
    AND au.role = 'super_admin'
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid() 
    AND au.active = true
    AND au.role = 'super_admin'
  )
);

-- PART 2: Fix reservations table security
-- Drop any existing public SELECT policy if it exists
DROP POLICY IF EXISTS "Users can view their own reservations" ON public.reservations;

-- Add policy to prevent public SELECT access
-- Only the person who made the reservation can view it (based on email)
CREATE POLICY "Users can view their own reservations" 
ON public.reservations 
FOR SELECT 
USING (
  -- Either you're an admin
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() 
    AND active = true
  )
  OR
  -- Or you're viewing your own reservation (authenticated and email matches)
  (
    auth.uid() IS NOT NULL 
    AND email = auth.jwt()->>'email'
  )
);