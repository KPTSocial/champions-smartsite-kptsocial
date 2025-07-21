
-- Create homepage_content table for managing dynamic homepage sections
CREATE TABLE public.homepage_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  alt_text TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active content
CREATE POLICY "Allow public read access to active homepage content"
  ON public.homepage_content
  FOR SELECT
  USING (is_active = true);

-- Create policy for admin management
CREATE POLICY "Admin can manage homepage content"
  ON public.homepage_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND active = true
    )
  );

-- Insert initial homepage content data
INSERT INTO public.homepage_content (section_name, title, description, image_url, alt_text, sort_order) VALUES
(
  'farm_to_table',
  'Scratch-Made Goodness',
  'Taste the care in every bite—crafted with fresh, locally-sourced ingredients, made from scratch the way it should be.',
  'https://res.cloudinary.com/de3djsvlk/image/upload/v1753116413/champions_home_page_image_gk7qvc.jpg',
  'Fresh farm to table dish with locally sourced ingredients',
  1
),
(
  'big_screens',
  'Every Game, Every Screen',
  'With dozens of HD screens, you won''t miss a second of the action.',
  '/lovable-uploads/0244eda9-ff87-475e-8b3e-c16841a8594f.jpg',
  'Big screen TVs showing sports games',
  2
),
(
  'qr_codes',
  'Scan for Our Lists',
  'Scan the QR code for bottle or draft list.',
  NULL,
  NULL,
  3
);
