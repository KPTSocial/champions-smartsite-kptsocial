-- Update Bacon N Bleu Cheese Wedge description to include sirloin add-on option
UPDATE menu_items 
SET description = 'Iceberg wedge with bleu cheese dressing topped with house crispy bacon, diced tomato, red onion, fresh herbs and a drizzle of balsamic glaze **add 8oz top sirloin 14**'
WHERE name = 'Bacon N Bleu Cheese Wedge' 
  AND category_id IN (SELECT id FROM menu_categories WHERE name = 'Salads & Wraps');