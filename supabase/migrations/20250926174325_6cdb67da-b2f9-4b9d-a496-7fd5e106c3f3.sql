-- Fix admin_users table security with proper RLS policies

-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Only authenticated admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Only super admins can manage admin users" ON public.admin_users;

-- Recreate policies using the existing security definer functions (is_admin and get_admin_role)
-- These functions prevent circular references and are more secure

-- Policy 1: Only authenticated admins can view the admin users list
CREATE POLICY "Authenticated admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  is_admin(auth.uid()) = true
);

-- Policy 2: Only super admins can insert new admin users
CREATE POLICY "Super admins can insert admin users" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  is_admin(auth.uid()) = true AND 
  get_admin_role(auth.uid()) = 'super_admin'::admin_role
);

-- Policy 3: Only super admins can update admin users
CREATE POLICY "Super admins can update admin users" 
ON public.admin_users 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  is_admin(auth.uid()) = true AND 
  get_admin_role(auth.uid()) = 'super_admin'::admin_role
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  is_admin(auth.uid()) = true AND 
  get_admin_role(auth.uid()) = 'super_admin'::admin_role
);

-- Policy 4: Only super admins can delete admin users
CREATE POLICY "Super admins can delete admin users" 
ON public.admin_users 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  is_admin(auth.uid()) = true AND 
  get_admin_role(auth.uid()) = 'super_admin'::admin_role
);

-- Ensure the security definer functions have proper search_path set (if not already)
-- This prevents search_path attacks
ALTER FUNCTION public.is_admin(uuid) SET search_path = public;
ALTER FUNCTION public.get_admin_role(uuid) SET search_path = public;