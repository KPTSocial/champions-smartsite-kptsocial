-- Create seasonal_event_cards table
CREATE TABLE public.seasonal_event_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🎉',
  description TEXT NOT NULL,
  details TEXT[] DEFAULT '{}',
  cta_text TEXT NOT NULL DEFAULT 'Learn More',
  cta_href TEXT NOT NULL DEFAULT '/',
  cta_icon TEXT NOT NULL DEFAULT 'calendar',
  cta_external BOOLEAN NOT NULL DEFAULT false,
  background_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seasonal_event_cards ENABLE ROW LEVEL SECURITY;

-- Public can view visible cards
CREATE POLICY "Public can view visible seasonal cards"
  ON public.seasonal_event_cards
  FOR SELECT
  USING (is_visible = true);

-- Admins can view all cards
CREATE POLICY "Admins can view all seasonal cards"
  ON public.seasonal_event_cards
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Admins can insert cards
CREATE POLICY "Admins can insert seasonal cards"
  ON public.seasonal_event_cards
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- Admins can update cards
CREATE POLICY "Admins can update seasonal cards"
  ON public.seasonal_event_cards
  FOR UPDATE
  USING (is_admin(auth.uid()));

-- Admins can delete cards
CREATE POLICY "Admins can delete seasonal cards"
  ON public.seasonal_event_cards
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_seasonal_event_cards_updated_at
  BEFORE UPDATE ON public.seasonal_event_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the 4 existing seasonal event cards
INSERT INTO public.seasonal_event_cards (title, emoji, description, details, cta_text, cta_href, cta_icon, cta_external, background_image_url, sort_order, is_visible) VALUES
(
  'Winter Olympics 2026',
  '🥇',
  'The Winter Olympics are almost here, and Champions is ready for every medal moment. From opening ceremonies to gold-medal finals, this is where Hillsboro gathers to watch the world compete. Table reservations will open soon, so plan ahead and secure your spot.',
  ARRAY['February 6 - 22, 2026', 'Milano Cortina, Italy'],
  'Reserve Your Table',
  '/reservations',
  'calendar',
  false,
  'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Special%20Events/Wolympics2026.jpeg',
  0,
  true
),
(
  'Summer Cornhole League',
  '🏆',
  'Swing into summer competition! Our league runs on Sunday afternoons. Games start at 1 PM.',
  ARRAY['Starts Back Up June 2026'],
  'Email to Join',
  'mailto:champions.sportsbar.grill@gmail.com',
  'mail',
  true,
  'https://res.cloudinary.com/de3djsvlk/image/upload/v1753120007/summer_cornhole_xbikfm.jpg',
  1,
  true
),
(
  'Sunday Breakfast & NFL Games',
  '🏈',
  'Join us for Sunday breakfast from 9am-12pm throughout football season! Start your game day right with a hearty breakfast.',
  ARRAY['Every Sunday during Football Season', 'Breakfast: 9am - 12pm', 'All Packers games with sound'],
  'Call for Game Placement',
  'tel:+15037476063',
  'phone',
  false,
  'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Special%20Events/Gemini_Generated_Image_mjg6qomjg6qomjg6.png',
  2,
  true
),
(
  'FIFA World Cup 2026',
  '⚽',
  'The FIFA World Cup is coming, and Champions is where the world meets in Hillsboro. Every match. Every goal. Every unforgettable moment. Planning to watch with a group? World Cup table reservations open soon. Claim your spot early and be part of the action.',
  ARRAY['June 11 - July 19, 2026', 'All matches shown live'],
  'Reservations Coming Soon',
  '/reservations',
  'calendar',
  false,
  'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Special%20Events/FIFA2026.jpeg',
  3,
  true
);