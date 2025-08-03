-- Add size variants for SO-HI Nachos
-- First, find the SO-HI Nachos item ID and add variants
WITH sohi_nachos AS (
  SELECT id FROM menu_items WHERE name = 'SO-HI Nachos' LIMIT 1
)
INSERT INTO menu_item_variants (menu_item_id, name, price)
SELECT 
  sohi_nachos.id,
  variant_data.name,
  variant_data.price
FROM sohi_nachos
CROSS JOIN (
  VALUES 
    ('Regular', 13.25),
    ('Table Size', 23.25)
) AS variant_data(name, price);