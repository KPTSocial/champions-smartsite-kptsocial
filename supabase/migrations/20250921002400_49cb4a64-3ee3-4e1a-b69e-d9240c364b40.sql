-- Update sort_order for menu items in Shareables category
-- Moving NEW items (Steak Medallions and Crispy Fried Calamari) to positions 4 and 5

-- Update Steak Medallions from position 11 to 4
UPDATE menu_items 
SET sort_order = 4
WHERE name = 'Steak Medallions' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Shareables');

-- Update Crispy Fried Calamari from position 12 to 5
UPDATE menu_items 
SET sort_order = 5
WHERE name = 'Crispy Fried Calamari' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Shareables');

-- Update other items that need to shift down
UPDATE menu_items 
SET sort_order = 6
WHERE name = 'Warm Pretzel Sticks' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Shareables');

UPDATE menu_items 
SET sort_order = 7
WHERE name = 'Hummus Plate' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Shareables');

UPDATE menu_items 
SET sort_order = 8
WHERE name = 'Tempura Fried Cauliflower Bites' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Shareables');

UPDATE menu_items 
SET sort_order = 9
WHERE name = 'Homestyle Chicken Tenders and Fries' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Shareables');

UPDATE menu_items 
SET sort_order = 10
WHERE name = 'Bone-In Wings' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Shareables');

UPDATE menu_items 
SET sort_order = 11
WHERE name = 'Garlic Breaded Cheese Curds' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Shareables');

UPDATE menu_items 
SET sort_order = 12
WHERE name = 'Santa Fe Chicken Egg Rolls' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Shareables');