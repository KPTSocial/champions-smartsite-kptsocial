-- Delete all menu item variants for items in Monthly Specials category first (foreign key constraint)
DELETE FROM menu_item_variants 
WHERE menu_item_id IN (
  SELECT id FROM menu_items WHERE category_id = '9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2'
);

-- Delete all menu item addons for items in Monthly Specials category
DELETE FROM menu_item_addons 
WHERE menu_item_id IN (
  SELECT id FROM menu_items WHERE category_id = '9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2'
);

-- Delete all menu items in Monthly Specials category
DELETE FROM menu_items WHERE category_id = '9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2';