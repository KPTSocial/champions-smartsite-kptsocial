
-- Move Happy Hour category from Drinks section to Specials section
UPDATE menu_categories 
SET section_id = 'de2ef338-ab9a-43ef-8332-c95cb0d549b9'
WHERE id = '41a9a15b-a37b-4ba5-adc0-2dc690cb4a0c' AND name = 'Happy Hour';
