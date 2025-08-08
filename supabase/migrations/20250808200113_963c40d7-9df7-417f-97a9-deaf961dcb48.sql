-- Fix Bingo Night back to proper evening time (7:00 PM PT)
UPDATE events 
SET event_date = '2025-06-13 02:00:00+00'::timestamptz 
WHERE id = 'c377e70a-d58d-4ea0-9ee4-521958df5d75' AND event_title = 'Bingo Night';

-- Fix Northwestern game: 7:00 AM PT → 9:00 AM PT
UPDATE events 
SET event_date = '2025-09-13 16:00:00+00'::timestamptz 
WHERE event_title = 'Oregon Ducks vs Northwestern' AND event_date::date = '2025-09-13';

-- Fix Texas Tech game: 10:30 AM PT → 12:30 PM PT  
UPDATE events 
SET event_date = '2025-09-13 19:30:00+00'::timestamptz 
WHERE event_title = 'Oregon State Beavers vs Texas Tech' AND event_date::date = '2025-09-13';

-- Fix Penn State game: 1:30 PM PT → 4:30 PM PT
UPDATE events 
SET event_date = '2025-09-27 23:30:00+00'::timestamptz 
WHERE event_title = 'Oregon Ducks vs Penn State' AND event_date::date = '2025-09-27';