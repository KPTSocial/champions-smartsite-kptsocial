
-- Fix the 3-hour offset by correcting the UTC timestamps for events
-- The previous migration added too many hours, so we need to subtract the excess

-- Fix Bingo Night events - reduce by 2.5 hours (was +9.5, should be +7)
-- 6:30 PM PT should be 1:30 AM UTC next day during PDT
UPDATE events 
SET event_date = event_date - INTERVAL '2 hours 30 minutes'
WHERE event_title ILIKE '%bingo%' 
AND event_type = 'Game Night';

-- Fix Trivia Night events - reduce by 2 hours (was +9, should be +7) 
-- 6:00 PM PT should be 1:00 AM UTC next day during PDT
UPDATE events 
SET event_date = event_date - INTERVAL '2 hours'
WHERE event_title ILIKE '%trivia%' 
AND event_type = 'Game Night';

-- Fix Taco Tuesday events - no change needed if they were correctly set to +8 hours
-- 11:00 AM PT should be 6:00 PM UTC same day during PDT (7 hour difference)
-- But if they were set to all-day events, we need to set a specific time
UPDATE events 
SET event_date = DATE_TRUNC('day', event_date) + INTERVAL '18 hours'
WHERE (event_title ILIKE '%taco%' OR event_title ILIKE '%tuesday%')
AND EXTRACT(hour FROM event_date) = 8; -- Only update if currently at 8 AM (incorrect)

-- Fix Summer Cornhole League events - no change needed if correctly at 1 PM PT
-- 1:00 PM PT should be 8:00 PM UTC same day during PDT (7 hour difference)  
UPDATE events 
SET event_date = DATE_TRUNC('day', event_date) + INTERVAL '20 hours'
WHERE (event_title ILIKE '%cornhole%' OR event_title ILIKE '%league%')
AND EXTRACT(hour FROM event_date) = 21; -- Only update if currently at 9 PM (incorrect)
