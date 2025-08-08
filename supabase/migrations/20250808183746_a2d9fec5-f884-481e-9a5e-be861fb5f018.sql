-- Update all Oregon State Beavers games from 2024 to 2025
UPDATE public.events 
SET event_date = event_date + INTERVAL '1 year'
WHERE event_title ILIKE '%oregon state%' 
  OR event_title ILIKE '%beavers%'
  AND EXTRACT(YEAR FROM event_date) = 2024;