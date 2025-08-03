-- First, find the Bone-In Wings item ID
DO $$
DECLARE
    wings_item_id uuid;
BEGIN
    -- Get the Bone-In Wings item ID
    SELECT id INTO wings_item_id 
    FROM menu_items 
    WHERE name = 'Bone-In Wings';
    
    -- Add the two variants
    INSERT INTO menu_item_variants (menu_item_id, name, price) VALUES 
    (wings_item_id, 'Six Wings', 12.50),
    (wings_item_id, 'Twelve Wings', 21.25);
    
    -- Update the base item price to null since variants handle pricing
    UPDATE menu_items 
    SET price = NULL 
    WHERE id = wings_item_id;
END $$;