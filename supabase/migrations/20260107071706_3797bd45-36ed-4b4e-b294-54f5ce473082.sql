-- Delete existing MLS placeholder events
DELETE FROM events WHERE event_type = 'MLS';

-- Insert complete 2026 Portland Timbers schedule (34 matches)
INSERT INTO events (event_title, description, event_date, location, event_type, status) VALUES
-- February (PST: +8 hours to UTC)
('Timbers vs. Columbus Crew', 'MLS Regular Season - Home Opener', '2026-02-22T03:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers @ Colorado Rapids', 'MLS Regular Season', '2026-02-28T21:30:00Z', 'Dick''s Sporting Goods Park', 'MLS', 'published'),

-- March (PST until Mar 8, then PDT: +7 hours)
('Timbers vs. Vancouver Whitecaps FC', 'MLS Regular Season', '2026-03-08T03:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers @ Houston Dynamo FC', 'MLS Regular Season', '2026-03-15T00:30:00Z', 'Shell Energy Stadium', 'MLS', 'published'),
('Timbers vs. LA Galaxy', 'MLS Regular Season', '2026-03-22T20:30:00Z', 'Providence Park', 'MLS', 'published'),

-- April (PDT: +7 hours)
('Timbers @ Vancouver Whitecaps FC', 'MLS Regular Season', '2026-04-05T02:30:00Z', 'BC Place', 'MLS', 'published'),
('Timbers vs. Los Angeles FC', 'MLS Regular Season', '2026-04-11T20:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers @ Minnesota United FC', 'MLS Regular Season', '2026-04-19T00:30:00Z', 'Allianz Field', 'MLS', 'published'),
('Timbers @ San Diego FC', 'MLS Regular Season', '2026-04-26T01:30:00Z', 'Snapdragon Stadium', 'MLS', 'published'),

-- May (PDT: +7 hours)
('Timbers @ Real Salt Lake', 'MLS Regular Season', '2026-05-02T20:30:00Z', 'America First Field', 'MLS', 'published'),
('Timbers vs. Sporting Kansas City', 'MLS Regular Season', '2026-05-10T02:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers @ CF Montréal', 'MLS Regular Season', '2026-05-13T23:30:00Z', 'Stade Saputo', 'MLS', 'published'),
('Timbers @ Inter Miami CF', 'MLS Regular Season', '2026-05-17T22:00:00Z', 'Chase Stadium', 'MLS', 'published'),
('Timbers vs. San Jose Earthquakes', 'MLS Regular Season', '2026-05-24T01:30:00Z', 'Providence Park', 'MLS', 'published'),

-- July (PDT: +7 hours) - After World Cup break
('Timbers @ Seattle Sounders FC', 'MLS Regular Season - Cascadia Cup', '2026-07-17T02:30:00Z', 'Lumen Field', 'MLS', 'published'),
('Timbers vs. FC Dallas', 'MLS Regular Season', '2026-07-23T02:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers vs. Real Salt Lake', 'MLS Regular Season', '2026-07-26T02:30:00Z', 'Providence Park', 'MLS', 'published'),

-- August (PDT: +7 hours)
('Timbers vs. Seattle Sounders FC', 'MLS Regular Season - Cascadia Cup', '2026-08-02T02:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers @ Chicago Fire FC', 'MLS Regular Season', '2026-08-16T22:30:00Z', 'Soldier Field', 'MLS', 'published'),
('Timbers vs. San Diego FC', 'MLS Regular Season', '2026-08-20T02:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers @ Los Angeles FC', 'MLS Regular Season', '2026-08-23T02:30:00Z', 'BMO Stadium', 'MLS', 'published'),
('Timbers vs. Austin FC', 'MLS Regular Season', '2026-08-30T02:30:00Z', 'Providence Park', 'MLS', 'published'),

-- September (PDT: +7 hours)
('Timbers vs. Minnesota United FC', 'MLS Regular Season', '2026-09-06T02:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers vs. St. Louis CITY SC', 'MLS Regular Season', '2026-09-10T02:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers @ FC Dallas', 'MLS Regular Season', '2026-09-13T00:30:00Z', 'Toyota Stadium', 'MLS', 'published'),
('Timbers vs. Atlanta United FC', 'MLS Regular Season', '2026-09-20T02:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers @ San Jose Earthquakes', 'MLS Regular Season', '2026-09-27T02:30:00Z', 'PayPal Park', 'MLS', 'published'),

-- October (PDT: +7 hours)
('Timbers @ Sporting Kansas City', 'MLS Regular Season', '2026-10-11T00:30:00Z', 'Children''s Mercy Park', 'MLS', 'published'),
('Timbers @ LA Galaxy', 'MLS Regular Season', '2026-10-15T02:30:00Z', 'Dignity Health Sports Park', 'MLS', 'published'),
('Timbers vs. Colorado Rapids', 'MLS Regular Season', '2026-10-18T02:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers vs. Charlotte FC', 'MLS Regular Season', '2026-10-25T02:30:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers @ St. Louis CITY SC', 'MLS Regular Season', '2026-10-29T00:30:00Z', 'CityPark', 'MLS', 'published'),

-- November (PST: +8 hours after Nov 1)
('Timbers vs. Houston Dynamo FC', 'MLS Regular Season - Home Finale', '2026-11-02T02:00:00Z', 'Providence Park', 'MLS', 'published'),
('Timbers @ Austin FC', 'MLS Regular Season - Season Finale', '2026-11-08T00:00:00Z', 'Q2 Stadium', 'MLS', 'published');