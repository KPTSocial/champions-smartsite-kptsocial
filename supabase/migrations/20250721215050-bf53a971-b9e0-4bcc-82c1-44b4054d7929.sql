
-- Update existing events to have correct UTC timestamps that represent Pacific Time
-- Note: These updates assume the current times in the database are meant to be Pacific Time
-- but are stored incorrectly as UTC

-- Update Bingo Night events to 6:30 PM PT (convert to UTC)
-- 6:30 PM PT = 1:30 AM UTC next day (during PST) or 2:30 AM UTC next day (during PDT)
-- Using a conservative approach with PST conversion
UPDATE events 
SET event_date = event_date + INTERVAL '9 hours 30 minutes'
WHERE event_title ILIKE '%bingo%' 
AND event_type = 'Game Night';

-- Update Trivia Night events to 6:00 PM PT (convert to UTC)  
-- 6:00 PM PT = 1:00 AM UTC next day (during PST) or 2:00 AM UTC next day (during PDT)
-- Using a conservative approach with PST conversion
UPDATE events 
SET event_date = event_date + INTERVAL '9 hours'
WHERE event_title ILIKE '%trivia%' 
AND event_type = 'Game Night';

-- Update any Taco Tuesday events to 11:00 AM PT (convert to UTC)
-- 11:00 AM PT = 7:00 PM UTC same day (during PST) or 6:00 PM UTC same day (during PDT)
-- Using a conservative approach with PST conversion  
UPDATE events 
SET event_date = event_date + INTERVAL '8 hours'
WHERE event_title ILIKE '%taco%' OR event_title ILIKE '%tuesday%';

-- Update Summer Cornhole League events to 1:00 PM PT (convert to UTC)
-- 1:00 PM PT = 9:00 PM UTC same day (during PST) or 8:00 PM UTC same day (during PDT)
-- Using a conservative approach with PST conversion
UPDATE events 
SET event_date = event_date + INTERVAL '8 hours'
WHERE event_title ILIKE '%cornhole%' OR event_title ILIKE '%league%';

-- Add a comment to document the timezone handling
COMMENT ON TABLE events IS 'Event times are stored in UTC. Display times should be converted to Pacific Time (America/Los_Angeles) for user interface.';
