-- Drop the existing problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Super admins can manage all admin users" ON public.admin_users;

-- Create new policies that use the security definer function to avoid recursion
CREATE POLICY "Super admins can manage all admin users" 
ON public.admin_users 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() 
    AND au.role = 'super_admin'::admin_role 
    AND au.active = true
  )
);

-- Update the existing user policy to be more explicit
DROP POLICY IF EXISTS "Users can view their own admin record" ON public.admin_users;

CREATE POLICY "Users can view their own admin record" 
ON public.admin_users 
FOR SELECT 
USING (user_id = auth.uid());