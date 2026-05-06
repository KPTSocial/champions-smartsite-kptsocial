
-- guest_feedback: replace overly-permissive update policy with admin-only
DROP POLICY IF EXISTS "Service role can update feedback" ON public.guest_feedback;
CREATE POLICY "Admins can update feedback"
ON public.guest_feedback
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- menu_sections: drop overly-broad authenticated policy (admin policy already exists)
DROP POLICY IF EXISTS "Allow authenticated users to manage menu_sections" ON public.menu_sections;

-- menu_item_options: replace authenticated-all policy with admin-only
DROP POLICY IF EXISTS "Allow authenticated users to manage menu_item_options" ON public.menu_item_options;
CREATE POLICY "Admin can manage menu_item_options"
ON public.menu_item_options
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- events: remove duplicate unfiltered SELECT policy that exposed unpublished events
DROP POLICY IF EXISTS "Public can view published events" ON public.events;

-- events: remove legacy admin policy that didn't check active
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;

-- menu_items: remove legacy admin policy that didn't check active
DROP POLICY IF EXISTS "Admins can manage menu_items" ON public.menu_items;

-- Harden the timestamp trigger function
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
