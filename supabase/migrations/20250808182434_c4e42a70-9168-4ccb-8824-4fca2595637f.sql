-- Add NCAA FB to event_type enum
ALTER TYPE event_type ADD VALUE 'NCAA FB';

-- Insert Oregon State Beavers 2024 football schedule with "The Beavers" mascot
INSERT INTO events (event_title, event_date, event_type, description, location, status) VALUES
('Beavers vs California', '2024-08-30 19:30:00-07:00', 'NCAA FB', 'The Beavers take on California at home! Go Beavers!', 'Reser Stadium, Corvallis', 'published'),
('Beavers vs Fresno State', '2024-09-06 12:30:00-07:00', 'NCAA FB', 'The Beavers take on Fresno State at home! Go Beavers!', 'Reser Stadium, Corvallis', 'published'),
('Beavers @ Texas Tech', '2024-09-13 12:30:00-05:00', 'NCAA FB', 'The Beavers take on Texas Tech on the road! Go Beavers!', 'Lubbock, TX', 'published'),
('Beavers @ Oregon', '2024-09-20 15:00:00-07:00', 'NCAA FB', 'The Beavers face Oregon in the rivalry game! Go Beavers!', 'Autzen Stadium, Eugene', 'published'),
('Beavers vs Houston', '2024-09-26 19:30:00-07:00', 'NCAA FB', 'The Beavers take on Houston at home! Go Beavers!', 'Reser Stadium, Corvallis', 'published'),
('Beavers @ Appalachian State', '2024-10-04 15:00:00-04:00', 'NCAA FB', 'The Beavers take on Appalachian State on the road! Go Beavers!', 'Boone, NC', 'published'),
('Beavers vs Wake Forest', '2024-10-11 12:30:00-07:00', 'NCAA FB', 'The Beavers take on Wake Forest at home! Go Beavers!', 'Reser Stadium, Corvallis', 'published'),
('Beavers vs Lafayette', '2024-10-18 19:00:00-07:00', 'NCAA FB', 'The Beavers take on Lafayette at home! Go Beavers!', 'Reser Stadium, Corvallis', 'published'),
('Beavers vs Washington State', '2024-11-01 16:30:00-07:00', 'NCAA FB', 'The Beavers take on Washington State at home! Go Beavers!', 'Reser Stadium, Corvallis', 'published'),
('Beavers vs Sam Houston', '2024-11-08 19:00:00-08:00', 'NCAA FB', 'The Beavers take on Sam Houston at home! Go Beavers!', 'Reser Stadium, Corvallis', 'published'),
('Beavers @ Tulsa', '2024-11-15 15:00:00-06:00', 'NCAA FB', 'The Beavers take on Tulsa on the road! Go Beavers!', 'Tulsa, OK', 'published'),
('Beavers @ Washington State', '2024-11-29 15:30:00-08:00', 'NCAA FB', 'The Beavers take on Washington State on the road! Go Beavers!', 'Pullman, WA', 'published');