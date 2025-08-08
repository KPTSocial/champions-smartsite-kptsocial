-- Add holiday closure events for Thanksgiving and Christmas 2025
INSERT INTO events (
  event_title,
  event_date,
  event_type,
  description,
  location,
  status,
  allow_rsvp,
  is_featured
) VALUES 
(
  'Restaurant Closed - Thanksgiving',
  '2025-11-27 17:00:00+00'::timestamptz, -- 9:00 AM PT (Standard Time)
  'Holiday',
  'Champions Sports Bar & Grill is closed for Thanksgiving. We''ll be back the next day to serve you!',
  'on-site',
  'published',
  false,
  true
),
(
  'Restaurant Closed - Christmas Day',
  '2025-12-25 17:00:00+00'::timestamptz, -- 9:00 AM PT (Standard Time)
  'Holiday',
  'Champions Sports Bar & Grill is closed for Christmas Day. Happy Holidays from our family to yours!',
  'on-site',
  'published',
  false,
  true
);