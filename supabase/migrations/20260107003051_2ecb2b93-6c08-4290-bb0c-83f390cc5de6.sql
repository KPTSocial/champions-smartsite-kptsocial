-- Drop the self-referencing RLS policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;

-- Recreate the is_admin function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = user_uuid AND active = true
  );
END;
$$;

-- The remaining policy "Authenticated admins can view admin users" already uses is_admin() 
-- which now has SECURITY DEFINER, so it won't cause recursion