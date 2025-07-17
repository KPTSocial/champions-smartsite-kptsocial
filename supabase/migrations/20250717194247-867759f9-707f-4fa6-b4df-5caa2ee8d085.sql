-- Move Happy Hour category from Specials section to Drinks section
UPDATE menu_categories 
SET section_id = '8ae0e99a-741f-4a06-93d4-f19a3b5fe7a3'
WHERE id = '41a9a15b-a37b-4ba5-adc0-2dc690cb4a0c' AND name = 'Happy Hour';