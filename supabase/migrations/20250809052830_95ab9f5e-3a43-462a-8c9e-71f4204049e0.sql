-- Update the Civil War event on Sept 20, 2025
UPDATE events 
SET 
  event_title = 'Civil War: Beavers vs Oregon Ducks',
  description = 'The ultimate Oregon rivalry game! Join us as the Oregon State Beavers take on the Oregon Ducks in the legendary Civil War matchup. This is THE game of the season!',
  image_url = 'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Sports%20Events/Civil%20War.jpg',
  is_featured = true,
  allow_rsvp = true
WHERE event_date::date = '2025-09-20' 
  AND event_title = 'Beavers @ Oregon';

-- Update Timbers events with team image
UPDATE events 
SET image_url = 'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Sports%20Events/Timbers.jpg'
WHERE event_title ILIKE '%timbers%' AND image_url IS NULL;

-- Update Thorns events with team image  
UPDATE events 
SET image_url = 'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Sports%20Events/Thorns.jpg'
WHERE event_title ILIKE '%thorns%' AND image_url IS NULL;

-- Update Ducks events with team image
UPDATE events 
SET image_url = 'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Sports%20Events/Go%20ducks.jpg'
WHERE event_title ILIKE '%ducks%' AND image_url IS NULL;

-- Update Beavers events (except Civil War) with team image
UPDATE events 
SET image_url = 'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Sports%20Events/Beavers.jpg'
WHERE event_title ILIKE '%beavers%' 
  AND image_url IS NULL 
  AND event_title != 'Civil War: Beavers vs Oregon Ducks';