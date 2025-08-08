-- Fix NCAA Football game times using correct event titles from database

-- Fix Northwestern game: 7:00 AM PT → 9:00 AM PT
UPDATE events 
SET event_date = '2025-09-13 16:00:00+00'::timestamptz 
WHERE event_title = 'Ducks @ Northwestern' AND event_date::date = '2025-09-13';

-- Fix Texas Tech game: 10:30 AM PT → 12:30 PM PT  
UPDATE events 
SET event_date = '2025-09-13 19:30:00+00'::timestamptz 
WHERE event_title = 'Beavers @ Texas Tech' AND event_date::date = '2025-09-13';

-- Fix Penn State game: 1:30 PM PT → 4:30 PM PT
UPDATE events 
SET event_date = '2025-09-27 23:30:00+00'::timestamptz 
WHERE event_title = 'Ducks @ Penn State' AND event_date::date = '2025-09-27';