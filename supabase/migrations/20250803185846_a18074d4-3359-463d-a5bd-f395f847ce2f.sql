-- Enable RLS on menu_item_variants table
ALTER TABLE menu_item_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_item_variants
CREATE POLICY "Admin can manage menu_item_variants" 
ON menu_item_variants 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE admin_users.user_id = auth.uid() AND admin_users.active = true
));

CREATE POLICY "Allow public read access to menu_item_variants" 
ON menu_item_variants 
FOR SELECT 
USING (true);