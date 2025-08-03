-- Enable Row Level Security on menu tables that are missing it
-- This is required for the security policies to work properly

-- Enable RLS on menu_item_addons and menu_item_options which appear to be missing RLS
ALTER TABLE public.menu_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_options ENABLE ROW LEVEL SECURITY;