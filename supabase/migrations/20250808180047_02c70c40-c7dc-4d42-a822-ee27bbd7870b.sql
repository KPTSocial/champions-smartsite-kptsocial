-- Add visibility column to menu_categories table
ALTER TABLE menu_categories 
ADD COLUMN is_visible boolean NOT NULL DEFAULT true;

-- Hide the Kids Breakfast Menu category
UPDATE menu_categories 
SET is_visible = false 
WHERE id = 'afc61166-bc5b-40b8-8ad4-4320f6378772';