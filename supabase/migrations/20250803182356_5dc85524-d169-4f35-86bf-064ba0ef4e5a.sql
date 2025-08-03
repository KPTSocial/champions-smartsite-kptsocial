-- Remove outdated Monthly Specials items
DELETE FROM menu_items 
WHERE category_id = '9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2' 
AND name IN (
  'Mai Tai',
  'Coconut Shrimp',
  'Summer BBQ Chicken Chopped Salad',
  'Cajun Chicken Rice Bowl',
  'Tangy BBQ Chicken Wrap',
  'Auntie TT''s Wrap'
);

-- Update existing items
UPDATE menu_items 
SET description = 'Bright & lively cocktail with Aviation Gin, grapefruit, lime & pineapple juices, topped with a champagne float'
WHERE category_id = '9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2' 
AND name = 'Mrs. Robinson';

UPDATE menu_items 
SET description = 'Grilled teriyaki-glazed chicken thigh & sautéed green beans over jasmine rice, side of extra glaze for dipping or drizzling — sweet, savory & satisfying'
WHERE category_id = '9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2' 
AND name = 'Teriyaki Chicken Rice Bowl';

-- Add new Monthly Specials items
INSERT INTO menu_items (category_id, name, description, price, sort_order, is_available, is_featured, is_special) VALUES
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Ranch Water', 'Effervescent, thirst-quenching mix of El Jimador Blanco, fresh-pressed lime & Topo Chico mineral water for the fizz', 12.00, 2, true, false, true),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Golden Fried Pickle Chips', 'Crispy, tangy pickle slices fried to golden perfection; served with dipping sauce of your choice', 11.00, 3, true, false, true),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Chef Salad', 'Crisp romaine with turkey, ham, egg, crumbled bacon, Swiss & cheddar, avocado, cherry tomatoes, cucumber, croutons & choice of dressing', 17.00, 4, true, false, true),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Kālua Pork Rice Bowl', 'Scratch kālua pork on jasmine rice with avocado, julienned carrots & red cabbage, sweet pineapple, green onions, lime wedge & teriyaki glaze — island-style comfort', 18.00, 6, true, false, true),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', '🌶️ Kālua Pork Sliders', 'Three mini buns piled with tender kālua pork & tangy pineapple sambal slaw — perfectly balanced, full-flavor bite', 16.00, 7, true, false, true),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Loco Moco', 'Hawaiian classic: juicy all-beef patty (medium-well) over jasmine rice, rich brown gravy, topped with a fried egg & fresh green onions', 16.00, 8, true, false, true);

-- Update sort orders for existing items to match table order
UPDATE menu_items SET sort_order = 1 WHERE category_id = '9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2' AND name = 'Mrs. Robinson';
UPDATE menu_items SET sort_order = 5 WHERE category_id = '9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2' AND name = 'Teriyaki Chicken Rice Bowl';
UPDATE menu_items SET sort_order = 9 WHERE category_id = '9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2' AND name = 'Desserts';