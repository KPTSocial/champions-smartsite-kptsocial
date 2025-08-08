-- Add Soccer to event_type enum
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'Soccer';

-- Insert Portland Timbers 2025 MLS Schedule
INSERT INTO public.events (event_title, event_date, event_type, description, location, status, allow_rsvp) VALUES
('Portland Timbers vs FC Dallas', '2025-08-10 00:30:00+00', 'Soccer', 'MLS Match - Away at FC Dallas', 'off-site', 'published', false),
('Portland Timbers vs FC Cincinnati', '2025-08-17 02:30:00+00', 'Soccer', 'MLS Match - Home vs FC Cincinnati', 'on-site', 'published', false),
('Portland Timbers vs San Diego FC', '2025-08-24 05:30:00+00', 'Soccer', 'MLS Match - Away at San Diego FC', 'off-site', 'published', false),
('Portland Timbers vs Minnesota United FC', '2025-08-31 03:30:00+00', 'Soccer', 'MLS Match - Away at Minnesota United FC', 'off-site', 'published', false),
('Portland Timbers vs New York Red Bulls', '2025-09-14 02:30:00+00', 'Soccer', 'MLS Match - Home vs New York Red Bulls', 'on-site', 'published', false),
('Portland Timbers vs Houston Dynamo FC', '2025-09-21 03:30:00+00', 'Soccer', 'MLS Match - Away at Houston Dynamo FC', 'off-site', 'published', false),
('Portland Timbers vs Vancouver Whitecaps', '2025-09-25 05:30:00+00', 'Soccer', 'MLS Match - Home vs Vancouver Whitecaps', 'on-site', 'published', false),
('Portland Timbers vs FC Dallas', '2025-09-28 05:30:00+00', 'Soccer', 'MLS Match - Home vs FC Dallas', 'on-site', 'published', false),
('Portland Timbers vs Seattle Sounders FC', '2025-10-05 05:30:00+00', 'Soccer', 'MLS Match - Away at Seattle Sounders FC', 'off-site', 'published', false),
('Portland Timbers vs San Diego FC', '2025-10-19 04:00:00+00', 'Soccer', 'MLS Match - Home vs San Diego FC', 'on-site', 'published', false);

-- Insert Portland Thorns 2025 NWSL Schedule  
INSERT INTO public.events (event_title, event_date, event_type, description, location, status, allow_rsvp) VALUES
('Portland Thorns vs Seattle Reign', '2025-08-10 23:00:00+00', 'Soccer', 'NWSL Match - Home vs Seattle Reign (CBS/Paramount+)', 'on-site', 'published', false),
('Portland Thorns vs North Carolina Courage', '2025-08-17 02:30:00+00', 'Soccer', 'NWSL Match - Away at North Carolina Courage (ION)', 'off-site', 'published', false),
('Portland Thorns vs Kansas City Current', '2025-08-24 05:00:00+00', 'Soccer', 'NWSL Match - Home vs Kansas City Current (ION)', 'on-site', 'published', false),
('Portland Thorns vs Utah Royals', '2025-08-30 05:30:00+00', 'Soccer', 'NWSL Match - Home vs Utah Royals (NWSL+/Paramount+)', 'on-site', 'published', false),
('Portland Thorns vs Racing Louisville FC', '2025-09-06 03:00:00+00', 'Soccer', 'NWSL Match - Away at Racing Louisville FC (Prime Video)', 'off-site', 'published', false),
('Portland Thorns vs Chicago Stars FC', '2025-09-14 22:00:00+00', 'Soccer', 'NWSL Match - Away at Chicago Stars FC (ESPN+/Disney+)', 'off-site', 'published', false),
('Portland Thorns vs San Diego Wave FC', '2025-09-21 05:00:00+00', 'Soccer', 'NWSL Match - Home vs San Diego Wave FC (ION)', 'on-site', 'published', false),
('Portland Thorns vs Gotham FC', '2025-09-27 03:00:00+00', 'Soccer', 'NWSL Match - Away at Gotham FC (NWSL+)', 'off-site', 'published', false),
('Portland Thorns vs Bay FC', '2025-10-05 05:00:00+00', 'Soccer', 'NWSL Match - Home vs Bay FC (ION)', 'on-site', 'published', false),
('Portland Thorns vs Orlando Pride', '2025-10-11 03:00:00+00', 'Soccer', 'NWSL Match - Away at Orlando Pride (Prime Video)', 'off-site', 'published', false),
('Portland Thorns vs Angel City FC', '2025-10-20 00:00:00+00', 'Soccer', 'NWSL Match - Away at Angel City FC (ESPN/ESPN Deportes/Disney+)', 'off-site', 'published', false);