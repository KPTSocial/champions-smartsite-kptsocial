-- Create the update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create business_hours table for regular operating hours
CREATE TABLE public.business_hours (
  id SERIAL PRIMARY KEY,
  day_label TEXT NOT NULL,
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create special_hours table for brunch, happy hour, etc.
CREATE TABLE public.special_hours (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_hours ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can read, only admins can modify
CREATE POLICY "Anyone can view business hours"
ON public.business_hours FOR SELECT
USING (true);

CREATE POLICY "Admins can manage business hours"
ON public.business_hours FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view special hours"
ON public.special_hours FOR SELECT
USING (true);

CREATE POLICY "Admins can manage special hours"
ON public.special_hours FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_business_hours_updated_at
BEFORE UPDATE ON public.business_hours
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_special_hours_updated_at
BEFORE UPDATE ON public.special_hours
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial business hours (matching current hardcoded values)
INSERT INTO public.business_hours (day_label, open_time, close_time, is_closed, sort_order) VALUES
('Mon - Tue', '11:00', '22:00', false, 1),
('Wed - Sat', '11:00', '00:00', false, 2),
('Sunday', '09:00', '22:00', false, 3);

-- Seed initial special hours
INSERT INTO public.special_hours (label, description, is_active, sort_order) VALUES
('Brunch', 'Sunday 9AM - 2PM', true, 1),
('Happy Hour', 'Mon - Fri 3PM - 6PM', true, 2);