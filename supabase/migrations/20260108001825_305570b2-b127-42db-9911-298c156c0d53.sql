UPDATE events 
SET event_date = event_date + INTERVAL '1 day'
WHERE event_title ILIKE '%trivia%';