-- Reorder items in Full Plates category: Move Coho Salmon Salad to position 1 and Chopped Brisket Mac above Fish & Chips
UPDATE menu_items 
SET sort_order = CASE 
    WHEN name = 'Coho Salmon Salad' THEN 1
    WHEN name = 'Steak & Fries' THEN 2
    WHEN name = 'New York Steak' THEN 3
    WHEN name = 'Shrimp & Lobster Linguine' THEN 4
    WHEN name = 'Chopped Brisket Mac' THEN 5
    WHEN name = 'Uncle Steve''s Mac' THEN 6
    WHEN name = 'Fish & Chips' THEN 7
END
WHERE name IN ('Coho Salmon Salad', 'Steak & Fries', 'New York Steak', 'Shrimp & Lobster Linguine', 
               'Chopped Brisket Mac', 'Uncle Steve''s Mac', 'Fish & Chips')
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Full Plates');