
-- Enable Row Level Security for all menu-related tables
ALTER TABLE public.menu_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access, so anyone can see the menu
CREATE POLICY "Allow public read access to menu sections" ON public.menu_sections FOR SELECT USING (true);
CREATE POLICY "Allow public read access to menu categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to menu items" ON public.menu_items FOR SELECT USING (true);

-- Add a column to store image URLs for menu items
ALTER TABLE public.menu_items ADD COLUMN image_url TEXT NULL;
