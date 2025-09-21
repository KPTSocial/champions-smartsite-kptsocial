-- Reposition BBQ Chicken Chopped Salad to position 4 in Salads & Wraps category

-- Move BBQ Chicken Chopped Salad from position 6 to 4
UPDATE menu_items 
SET sort_order = 4
WHERE name = 'BBQ Chicken Chopped Salad' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Salads & Wraps');

-- Move Reed's Crossing Cobb from position 4 to 5
UPDATE menu_items 
SET sort_order = 5
WHERE name = 'Reed''s Crossing Cobb' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Salads & Wraps');

-- Move Buffalo Chicken from position 5 to 6
UPDATE menu_items 
SET sort_order = 6
WHERE name = 'Buffalo Chicken' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Salads & Wraps');