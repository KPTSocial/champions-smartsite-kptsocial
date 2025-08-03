-- Enable realtime on menu tables for real-time synchronization
-- This allows the public menu to update immediately when admin changes are made

-- Enable replica identity for menu tables to capture complete row data during updates
ALTER TABLE public.menu_sections REPLICA IDENTITY FULL;
ALTER TABLE public.menu_categories REPLICA IDENTITY FULL;
ALTER TABLE public.menu_items REPLICA IDENTITY FULL;
ALTER TABLE public.menu_item_variants REPLICA IDENTITY FULL;

-- Add menu tables to the supabase_realtime publication
-- This enables real-time functionality for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_sections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_item_variants;