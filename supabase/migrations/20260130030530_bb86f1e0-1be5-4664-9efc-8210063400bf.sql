-- Create team_schedules table for storing pre-configured teams
CREATE TABLE public.team_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  default_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_schedules ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view team schedules"
  ON public.team_schedules
  FOR SELECT
  USING (true);

-- Allow admins to manage team schedules
CREATE POLICY "Admins can manage team schedules"
  ON public.team_schedules
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Insert default teams
INSERT INTO public.team_schedules (team_name, event_type, default_image_url) VALUES
  ('Portland Timbers', 'MLS', 'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Sports%20Events/Timbers.jpg'),
  ('Portland Thorns', 'NWSL', 'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Sports%20Events/Thorns.jpg'),
  ('Portland Trail Blazers', 'NBA', NULL),
  ('Portland Fire', 'WNBA', NULL),
  ('Oregon Ducks', 'NCAA FB', 'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Sports%20Events/Go%20ducks.jpg'),
  ('Oregon State Beavers', 'NCAA FB', NULL);