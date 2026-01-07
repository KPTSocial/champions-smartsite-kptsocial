-- Update the Current Specials section description to January (current month)
UPDATE menu_sections 
SET description = 'January' 
WHERE name = 'Current Specials';