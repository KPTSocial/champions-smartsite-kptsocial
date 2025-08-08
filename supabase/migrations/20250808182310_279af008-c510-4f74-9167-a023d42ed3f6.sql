-- Update Oregon State Beavers football events to include mascot "The Beavers"
UPDATE events 
SET description = CASE 
  WHEN description IS NULL OR description = '' THEN 'The Beavers take on ' || REPLACE(event_title, 'vs ', '') || '!'
  ELSE description || ' Go Beavers!'
END,
event_title = CASE
  WHEN event_title LIKE 'vs %' THEN 'Beavers ' || event_title
  WHEN event_title LIKE '@ %' THEN 'Beavers ' || event_title
  ELSE event_title
END
WHERE event_type = 'NCAA FB' AND event_title LIKE '%California%' 
   OR event_title LIKE '%Fresno State%'
   OR event_title LIKE '%Texas Tech%' 
   OR event_title LIKE '%Oregon%'
   OR event_title LIKE '%Houston%'
   OR event_title LIKE '%Appalachian State%'
   OR event_title LIKE '%Wake Forest%'
   OR event_title LIKE '%Lafayette%'
   OR event_title LIKE '%Washington State%'
   OR event_title LIKE '%Sam Houston%'
   OR event_title LIKE '%Tulsa%';