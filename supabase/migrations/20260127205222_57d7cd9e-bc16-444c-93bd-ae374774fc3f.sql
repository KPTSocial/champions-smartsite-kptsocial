-- Add column to flag events for homepage banner display
ALTER TABLE events 
ADD COLUMN show_as_homepage_banner boolean DEFAULT false;

-- Enable banner for the existing private event
UPDATE events 
SET show_as_homepage_banner = true 
WHERE id = '3dd511f0-106a-488e-a7b8-7547f5225e6e';