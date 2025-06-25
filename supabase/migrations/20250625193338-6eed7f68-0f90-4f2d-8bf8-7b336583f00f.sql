
-- Add columns to menu_items for better management
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS is_special BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS special_start_date DATE,
ADD COLUMN IF NOT EXISTS special_end_date DATE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Create index for better performance on special queries
CREATE INDEX IF NOT EXISTS idx_menu_items_specials ON public.menu_items(is_special, special_start_date, special_end_date);
CREATE INDEX IF NOT EXISTS idx_menu_items_availability ON public.menu_items(is_available);

-- Add RLS policies for admin menu management
CREATE POLICY "Admin can manage menu items" ON public.menu_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "Admin can manage menu categories" ON public.menu_categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "Admin can manage menu sections" ON public.menu_sections
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);
