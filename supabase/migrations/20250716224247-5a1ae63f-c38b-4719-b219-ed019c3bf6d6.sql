-- Step 1: Remove duplicate Seasonal Cocktails category from Specials section
-- (Keep the one in Drinks section: 31e0a590-55b9-4192-b55a-92444eb106fa)
-- Delete the duplicate from Specials: 99402a27-2fb5-4fcc-8b30-a84ac0707aad

-- First delete all items in the duplicate Seasonal Cocktails category
DELETE FROM menu_items WHERE category_id = '99402a27-2fb5-4fcc-8b30-a84ac0707aad';

-- Then delete the duplicate category itself
DELETE FROM menu_categories WHERE id = '99402a27-2fb5-4fcc-8b30-a84ac0707aad';

-- Step 2: Clear existing items in Monthly Specials category (9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2)
DELETE FROM menu_items WHERE category_id = '9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2';

-- Step 3: Add new Monthly Specials items
-- Cocktails (sort_order 1-2)
INSERT INTO menu_items (category_id, name, description, price, sort_order) VALUES
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Paloma', 'Champs house favorite! Tequila reposado, grapefruit juice, fresh pressed lime juice & a splash of soda over ice. Bright, crisp, and refreshingly citrus-forward', 12.00, 1),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Mai Tai', 'A true tiki legend! A punchy blend of rums; white, coconut & dark with fresh pineapple and orange juice - paradise in a glass', 12.00, 2);

-- Food Items (sort_order 3-8)
INSERT INTO menu_items (category_id, name, description, price, sort_order) VALUES
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Coconut Shrimp', 'Six golden fried coconut shrimp served with side of sweet chili sauce', 12.00, 3),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Summer BBQ Chicken Chopped Salad', 'Grilled BBQ chicken breast on a bed of chopped romaine, with roasted corn, shredded cheddar-jack, black beans, cherry tomatoes, pickled onions, and crunchy tortilla strips. Served with side of house honey mustard vinaigrette', 17.00, 4),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Teriyaki Chicken Rice Bowl', 'Grilled teriyaki-glazed chicken thigh and sautéed green beans served over jasmine rice, with a side of extra teriyaki glaze for dipping or drizzling. Sweet, savory, & satisfying', 14.00, 5),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', '🌶️Cajun Chicken Rice Bowl', 'A bed of jasmine rice topped with a rich Cajun-inspired cream sauce, loaded with tender chicken, sautéed mushrooms, onions, red bell peppers, jalapeños, & fresh cilantro - Bold, creamy, and full of flavor', 17.00, 6),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Tangy BBQ Chicken Wrap', 'Grilled chicken breast tossed in our tangy BBQ sauce, wrapped in a large flour tortilla with chopped romaine, roasted corn, cheddar-jack cheese, black beans, cherry tomatoes, red onions & crunchy flour tortilla strips - pick your side', 17.00, 7),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Auntie TT''s Wrap', 'Crunchy, pickle-brined fried chicken with chopped romaine, roasted corn, cheddar-jack, black beans, cherry tomatoes, and crispy tortilla strips, all tossed in zesty house dressing & wrapped in a large flour tortilla - Pick your side', 18.00, 8);

-- Desserts (sort_order 9-11)
INSERT INTO menu_items (category_id, name, description, price, sort_order) VALUES
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Dulce De Leche Churro Cake A La Mode', '', 11.00, 9),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Carrot Cake', '', 12.00, 10),
('9f6ac222-afc3-4dc9-8ecb-ca1db4d62be2', 'Raspberry Donut Cheesecake', '', 11.00, 11);