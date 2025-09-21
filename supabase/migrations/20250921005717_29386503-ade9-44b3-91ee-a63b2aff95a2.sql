-- Swap positions of Cajun Chicken and Aloha Chicken in the Charbroiled Burgers category
UPDATE menu_items 
SET sort_order = CASE 
    WHEN name = 'Cajun Chicken' THEN 9
    WHEN name = 'Aloha Chicken' THEN 8
END
WHERE name IN ('Cajun Chicken', 'Aloha Chicken')
  AND category_id IN (SELECT id FROM menu_categories WHERE name = '*Charbroiled Burgers');