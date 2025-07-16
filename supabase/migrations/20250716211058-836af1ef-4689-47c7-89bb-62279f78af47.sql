-- Move kids categories from Food section to Kids section
UPDATE menu_categories 
SET section_id = 'f7d87bab-909a-4370-8a1d-e31454461823'
WHERE id IN (
  'afc61166-bc5b-40b8-8ad4-4320f6378772', -- Kids Breakfast Menu
  'bf275414-d23c-4758-8de7-c0a5a91b4b91'  -- Champs Kids Bites
);