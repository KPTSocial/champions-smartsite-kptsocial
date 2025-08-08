-- Enable RLS on admin_users table and create security policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy to allow admin users to view other admin users
CREATE POLICY "Admins can view admin users" ON admin_users
  FOR SELECT USING (is_admin(auth.uid()));

-- Policy to allow admin users to manage other admin users (super admin role only)
CREATE POLICY "Admins can manage admin users" ON admin_users
  FOR ALL USING (
    is_admin(auth.uid()) AND 
    get_admin_role(auth.uid()) = 'super_admin'
  );