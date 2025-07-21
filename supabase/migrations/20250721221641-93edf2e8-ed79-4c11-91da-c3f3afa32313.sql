
-- Update Taco Tuesday events to start at 11:00 AM PT (6:00 PM UTC during PDT)
-- This ensures they display at the correct opening time
UPDATE events 
SET event_date = DATE_TRUNC('day', event_date) + INTERVAL '18 hours'
WHERE (event_title ILIKE '%taco%' OR event_title ILIKE '%tuesday%')
AND event_type = 'Weekly Special';

-- Also update any Taco Tuesday events that might be in other event types
UPDATE events 
SET event_date = DATE_TRUNC('day', event_date) + INTERVAL '18 hours'
WHERE event_title ILIKE '%taco tuesday%';
