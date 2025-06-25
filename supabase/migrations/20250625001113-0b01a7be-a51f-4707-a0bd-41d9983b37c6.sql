
-- Add admin role enum and admin_users table for role management
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create admin_users table for role management
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'moderator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to manage other admin users
CREATE POLICY "Super admins can manage all admin users" 
ON public.admin_users 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.user_id = auth.uid() AND au.role = 'super_admin' AND au.active = true
  )
);

-- Create policy for users to view their own admin record
CREATE POLICY "Users can view their own admin record" 
ON public.admin_users 
FOR SELECT 
USING (user_id = auth.uid());

-- Enhance photo_booth_posts table with admin features
ALTER TABLE public.photo_booth_posts 
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.admin_users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid AND active = true
  );
$$;

-- Create function to get user admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_uuid UUID)
RETURNS admin_role
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT role FROM public.admin_users 
  WHERE user_id = user_uuid AND active = true
  LIMIT 1;
$$;
