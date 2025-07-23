-- Enable RLS on tables that need it
ALTER TABLE public.menu_item_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sauces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_addons ENABLE ROW LEVEL SECURITY;

-- Add basic policies for these tables
CREATE POLICY "Allow public read access to menu_item_variants" 
ON public.menu_item_variants 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage menu_item_variants" 
ON public.menu_item_variants 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "Allow public read access to sauces" 
ON public.sauces 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage sauces" 
ON public.sauces 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "Allow public read access to menu_item_addons" 
ON public.menu_item_addons 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage menu_item_addons" 
ON public.menu_item_addons 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid AND active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_admin_role(user_uuid uuid)
RETURNS admin_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.admin_users 
  WHERE user_id = user_uuid AND active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.generate_recurring_events()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-create Trivia Night for Taco Tuesday events
  IF NEW.event_title ILIKE '%taco tuesday%' AND NEW.recurring_pattern = 'weekly' THEN
    INSERT INTO public.events (
      event_title,
      event_date,
      event_type,
      description,
      location,
      parent_event_id,
      status,
      allow_rsvp
    ) VALUES (
      'Trivia Night',
      NEW.event_date,
      'Game Night',
      'Join us for Trivia Night during Taco Tuesday!',
      NEW.location,
      NEW.id,
      NEW.status,
      true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = '';