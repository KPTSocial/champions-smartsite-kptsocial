-- Update Classic Reuben tag from C to CF
UPDATE menu_items 
SET tags = ARRAY['CF'] 
WHERE id = 'bf50a2ee-01c0-483d-a470-6a31687bfd30' AND name = 'Classic Reuben';

-- Update Clubhouse tag from C to CF
UPDATE menu_items 
SET tags = ARRAY['CF'] 
WHERE id = '1bc3bd13-ef91-4706-b22f-08f3e45e4482' AND name = 'Clubhouse';