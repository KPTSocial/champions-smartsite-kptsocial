-- Delete existing World Cup events
DELETE FROM events WHERE event_title ILIKE '%World Cup%' OR event_title ILIKE '%FIFA%';

-- Insert complete FIFA World Cup 2026 schedule (Pacific Time + 7 hours = UTC for June/July)
INSERT INTO events (event_title, event_date, event_type, status, location, description) VALUES
-- GROUP A
('World Cup: Mexico vs South Africa (Opening)', '2026-06-11 19:00:00+00', 'World Cup', 'published', 'off-site', 'FIFA World Cup 2026 Opening Ceremony & Match - Group A'),
('World Cup: South Korea vs UEFA Playoff D', '2026-06-12 02:00:00+00', 'World Cup', 'published', 'off-site', 'Group A Match'),
('World Cup: UEFA Playoff D vs South Africa', '2026-06-18 16:00:00+00', 'World Cup', 'published', 'off-site', 'Group A Match'),
('World Cup: Mexico vs South Korea', '2026-06-19 01:00:00+00', 'World Cup', 'published', 'off-site', 'Group A Match'),
('World Cup: UEFA Playoff D vs Mexico', '2026-06-25 01:00:00+00', 'World Cup', 'published', 'off-site', 'Group A Match'),
('World Cup: South Africa vs South Korea', '2026-06-25 01:00:00+00', 'World Cup', 'published', 'off-site', 'Group A Match'),

-- GROUP B
('World Cup: Canada vs UEFA Playoff A', '2026-06-12 19:00:00+00', 'World Cup', 'published', 'off-site', 'Group B Match'),
('World Cup: Qatar vs Switzerland', '2026-06-13 19:00:00+00', 'World Cup', 'published', 'off-site', 'Group B Match'),
('World Cup: Switzerland vs UEFA Playoff A', '2026-06-18 19:00:00+00', 'World Cup', 'published', 'off-site', 'Group B Match'),
('World Cup: Canada vs Qatar', '2026-06-18 22:00:00+00', 'World Cup', 'published', 'off-site', 'Group B Match'),
('World Cup: Switzerland vs Canada', '2026-06-24 19:00:00+00', 'World Cup', 'published', 'off-site', 'Group B Match'),
('World Cup: UEFA Playoff A vs Qatar', '2026-06-24 19:00:00+00', 'World Cup', 'published', 'off-site', 'Group B Match'),

-- GROUP C
('World Cup: Brazil vs Morocco', '2026-06-13 22:00:00+00', 'World Cup', 'published', 'off-site', 'Group C Match'),
('World Cup: Haiti vs Scotland', '2026-06-14 01:00:00+00', 'World Cup', 'published', 'off-site', 'Group C Match'),
('World Cup: Scotland vs Morocco', '2026-06-19 22:00:00+00', 'World Cup', 'published', 'off-site', 'Group C Match'),
('World Cup: Brazil vs Haiti', '2026-06-20 01:00:00+00', 'World Cup', 'published', 'off-site', 'Group C Match'),
('World Cup: Scotland vs Brazil', '2026-06-24 22:00:00+00', 'World Cup', 'published', 'off-site', 'Group C Match'),
('World Cup: Morocco vs Haiti', '2026-06-24 22:00:00+00', 'World Cup', 'published', 'off-site', 'Group C Match'),

-- GROUP D (USA)
('World Cup: USA vs Paraguay', '2026-06-13 01:00:00+00', 'World Cup', 'published', 'off-site', 'USA Group Stage Match 1 - Group D'),
('World Cup: Australia vs UEFA Playoff C', '2026-06-14 04:00:00+00', 'World Cup', 'published', 'off-site', 'Group D Match'),
('World Cup: USA vs Australia', '2026-06-19 19:00:00+00', 'World Cup', 'published', 'off-site', 'USA Group Stage Match 2 - Group D'),
('World Cup: UEFA Playoff C vs Paraguay', '2026-06-20 04:00:00+00', 'World Cup', 'published', 'off-site', 'Group D Match'),
('World Cup: UEFA Playoff C vs USA', '2026-06-26 02:00:00+00', 'World Cup', 'published', 'off-site', 'USA Group Stage Match 3 - Group D'),
('World Cup: Paraguay vs Australia', '2026-06-26 02:00:00+00', 'World Cup', 'published', 'off-site', 'Group D Match'),

-- GROUP E
('World Cup: Germany vs Curaçao', '2026-06-14 17:00:00+00', 'World Cup', 'published', 'off-site', 'Group E Match'),
('World Cup: Ivory Coast vs Ecuador', '2026-06-14 23:00:00+00', 'World Cup', 'published', 'off-site', 'Group E Match'),
('World Cup: Germany vs Ivory Coast', '2026-06-20 20:00:00+00', 'World Cup', 'published', 'off-site', 'Group E Match'),
('World Cup: Ecuador vs Curaçao', '2026-06-21 00:00:00+00', 'World Cup', 'published', 'off-site', 'Group E Match'),
('World Cup: Ecuador vs Germany', '2026-06-25 20:00:00+00', 'World Cup', 'published', 'off-site', 'Group E Match'),
('World Cup: Curaçao vs Ivory Coast', '2026-06-25 20:00:00+00', 'World Cup', 'published', 'off-site', 'Group E Match'),

-- GROUP F
('World Cup: Netherlands vs Japan', '2026-06-14 20:00:00+00', 'World Cup', 'published', 'off-site', 'Group F Match'),
('World Cup: UEFA Playoff B vs Tunisia', '2026-06-15 02:00:00+00', 'World Cup', 'published', 'off-site', 'Group F Match'),
('World Cup: Netherlands vs Playoff B', '2026-06-20 17:00:00+00', 'World Cup', 'published', 'off-site', 'Group F Match'),
('World Cup: Tunisia vs Japan', '2026-06-21 04:00:00+00', 'World Cup', 'published', 'off-site', 'Group F Match'),
('World Cup: Japan vs Playoff B', '2026-06-25 23:00:00+00', 'World Cup', 'published', 'off-site', 'Group F Match'),
('World Cup: Tunisia vs Netherlands', '2026-06-25 23:00:00+00', 'World Cup', 'published', 'off-site', 'Group F Match'),

-- GROUP G
('World Cup: Belgium vs Egypt', '2026-06-15 19:00:00+00', 'World Cup', 'published', 'off-site', 'Group G Match'),
('World Cup: Iran vs New Zealand', '2026-06-16 01:00:00+00', 'World Cup', 'published', 'off-site', 'Group G Match'),
('World Cup: Belgium vs Iran', '2026-06-21 19:00:00+00', 'World Cup', 'published', 'off-site', 'Group G Match'),
('World Cup: New Zealand vs Egypt', '2026-06-22 01:00:00+00', 'World Cup', 'published', 'off-site', 'Group G Match'),
('World Cup: Egypt vs Iran', '2026-06-27 03:00:00+00', 'World Cup', 'published', 'off-site', 'Group G Match'),
('World Cup: New Zealand vs Belgium', '2026-06-27 03:00:00+00', 'World Cup', 'published', 'off-site', 'Group G Match'),

-- GROUP H
('World Cup: Spain vs Cape Verde', '2026-06-15 16:00:00+00', 'World Cup', 'published', 'off-site', 'Group H Match'),
('World Cup: Saudi Arabia vs Uruguay', '2026-06-15 22:00:00+00', 'World Cup', 'published', 'off-site', 'Group H Match'),
('World Cup: Spain vs Saudi Arabia', '2026-06-21 16:00:00+00', 'World Cup', 'published', 'off-site', 'Group H Match'),
('World Cup: Uruguay vs Cape Verde', '2026-06-21 22:00:00+00', 'World Cup', 'published', 'off-site', 'Group H Match'),
('World Cup: Cape Verde vs Saudi Arabia', '2026-06-27 00:00:00+00', 'World Cup', 'published', 'off-site', 'Group H Match'),
('World Cup: Uruguay vs Spain', '2026-06-27 00:00:00+00', 'World Cup', 'published', 'off-site', 'Group H Match'),

-- GROUP I
('World Cup: France vs Senegal', '2026-06-16 19:00:00+00', 'World Cup', 'published', 'off-site', 'Group I Match'),
('World Cup: Inter-confed Playoff 2 vs Norway', '2026-06-16 22:00:00+00', 'World Cup', 'published', 'off-site', 'Group I Match'),
('World Cup: France vs Playoff 2', '2026-06-22 21:00:00+00', 'World Cup', 'published', 'off-site', 'Group I Match'),
('World Cup: Norway vs Senegal', '2026-06-23 00:00:00+00', 'World Cup', 'published', 'off-site', 'Group I Match'),
('World Cup: Norway vs France', '2026-06-26 19:00:00+00', 'World Cup', 'published', 'off-site', 'Group I Match'),
('World Cup: Senegal vs Playoff 2', '2026-06-26 19:00:00+00', 'World Cup', 'published', 'off-site', 'Group I Match'),

-- GROUP J
('World Cup: Argentina vs Algeria', '2026-06-17 01:00:00+00', 'World Cup', 'published', 'off-site', 'Group J Match'),
('World Cup: Austria vs Jordan', '2026-06-17 04:00:00+00', 'World Cup', 'published', 'off-site', 'Group J Match'),
('World Cup: Argentina vs Austria', '2026-06-22 17:00:00+00', 'World Cup', 'published', 'off-site', 'Group J Match'),
('World Cup: Jordan vs Algeria', '2026-06-23 03:00:00+00', 'World Cup', 'published', 'off-site', 'Group J Match'),
('World Cup: Algeria vs Austria', '2026-06-28 02:00:00+00', 'World Cup', 'published', 'off-site', 'Group J Match'),
('World Cup: Jordan vs Argentina', '2026-06-28 02:00:00+00', 'World Cup', 'published', 'off-site', 'Group J Match'),

-- GROUP K
('World Cup: Portugal vs Playoff 1', '2026-06-17 17:00:00+00', 'World Cup', 'published', 'off-site', 'Group K Match'),
('World Cup: Uzbekistan vs Colombia', '2026-06-18 02:00:00+00', 'World Cup', 'published', 'off-site', 'Group K Match'),
('World Cup: Portugal vs Uzbekistan', '2026-06-23 17:00:00+00', 'World Cup', 'published', 'off-site', 'Group K Match'),
('World Cup: Colombia vs Playoff 1', '2026-06-24 02:00:00+00', 'World Cup', 'published', 'off-site', 'Group K Match'),
('World Cup: Colombia vs Portugal', '2026-06-27 23:30:00+00', 'World Cup', 'published', 'off-site', 'Group K Match'),
('World Cup: Playoff 1 vs Uzbekistan', '2026-06-27 23:30:00+00', 'World Cup', 'published', 'off-site', 'Group K Match'),

-- GROUP L
('World Cup: England vs Croatia', '2026-06-17 20:00:00+00', 'World Cup', 'published', 'off-site', 'Group L Match'),
('World Cup: Ghana vs Panama', '2026-06-17 23:00:00+00', 'World Cup', 'published', 'off-site', 'Group L Match'),
('World Cup: England vs Ghana', '2026-06-23 20:00:00+00', 'World Cup', 'published', 'off-site', 'Group L Match'),
('World Cup: Panama vs Croatia', '2026-06-23 23:00:00+00', 'World Cup', 'published', 'off-site', 'Group L Match'),
('World Cup: Panama vs England', '2026-06-27 21:00:00+00', 'World Cup', 'published', 'off-site', 'Group L Match'),
('World Cup: Croatia vs Ghana', '2026-06-27 21:00:00+00', 'World Cup', 'published', 'off-site', 'Group L Match'),

-- ROUND OF 32
('World Cup: Round of 32 - Match 73', '2026-06-28 19:00:00+00', 'World Cup', 'published', 'off-site', 'Runner-up A vs Runner-up B'),
('World Cup: Round of 32 - Match 76', '2026-06-29 17:00:00+00', 'World Cup', 'published', 'off-site', 'Winner C vs Runner-up F'),
('World Cup: Round of 32 - Match 74', '2026-06-29 20:30:00+00', 'World Cup', 'published', 'off-site', 'Winner E vs 3rd A/B/C/D/F'),
('World Cup: Round of 32 - Match 75', '2026-06-30 01:00:00+00', 'World Cup', 'published', 'off-site', 'Winner F vs Runner-up C'),
('World Cup: Round of 32 - Match 78', '2026-06-30 17:00:00+00', 'World Cup', 'published', 'off-site', 'Runner-up E vs Runner-up I'),
('World Cup: Round of 32 - Match 77', '2026-06-30 21:00:00+00', 'World Cup', 'published', 'off-site', 'Winner I vs 3rd C/D/F/G/H'),
('World Cup: Round of 32 - Match 79', '2026-07-01 01:00:00+00', 'World Cup', 'published', 'off-site', 'Winner A vs 3rd C/E/F/H/I'),
('World Cup: Round of 32 - Match 80', '2026-07-01 16:00:00+00', 'World Cup', 'published', 'off-site', 'Winner L vs 3rd E/H/I/J/K'),
('World Cup: Round of 32 - Match 82', '2026-07-01 20:00:00+00', 'World Cup', 'published', 'off-site', 'Winner G vs 3rd A/E/H/I/J'),
('World Cup: Round of 32 - Match 81', '2026-07-02 00:00:00+00', 'World Cup', 'published', 'off-site', 'Winner D vs 3rd B/E/F/I/J'),
('World Cup: Round of 32 - Match 84', '2026-07-02 19:00:00+00', 'World Cup', 'published', 'off-site', 'Winner H vs Runner-up J'),
('World Cup: Round of 32 - Match 83', '2026-07-02 23:00:00+00', 'World Cup', 'published', 'off-site', 'Runner-up K vs Runner-up L'),
('World Cup: Round of 32 - Match 85', '2026-07-03 03:00:00+00', 'World Cup', 'published', 'off-site', 'Winner B vs 3rd E/F/G/I/J'),
('World Cup: Round of 32 - Match 88', '2026-07-03 18:00:00+00', 'World Cup', 'published', 'off-site', 'Runner-up D vs Runner-up G'),
('World Cup: Round of 32 - Match 86', '2026-07-03 22:00:00+00', 'World Cup', 'published', 'off-site', 'Winner J vs Runner-up H'),
('World Cup: Round of 32 - Match 87', '2026-07-04 01:30:00+00', 'World Cup', 'published', 'off-site', 'Winner K vs 3rd D/E/I/J/L'),

-- ROUND OF 16
('World Cup: Round of 16 - Match 90', '2026-07-04 17:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 73 vs 75'),
('World Cup: Round of 16 - Match 89', '2026-07-04 21:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 74 vs 77'),
('World Cup: Round of 16 - Match 91', '2026-07-05 20:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 76 vs 78'),
('World Cup: Round of 16 - Match 92', '2026-07-06 00:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 79 vs 80'),
('World Cup: Round of 16 - Match 93', '2026-07-06 19:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 83 vs 84'),
('World Cup: Round of 16 - Match 94', '2026-07-07 00:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 81 vs 82'),
('World Cup: Round of 16 - Match 95', '2026-07-07 16:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 86 vs 88'),
('World Cup: Round of 16 - Match 96', '2026-07-07 20:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 85 vs 87'),

-- QUARTERFINALS
('World Cup: Quarterfinal - Match 97', '2026-07-09 20:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 89 vs 90'),
('World Cup: Quarterfinal - Match 98', '2026-07-10 19:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 93 vs 94'),
('World Cup: Quarterfinal - Match 99', '2026-07-11 21:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 91 vs 92'),
('World Cup: Quarterfinal - Match 100', '2026-07-12 01:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 95 vs 96'),

-- SEMIFINALS
('World Cup: Semifinal - Match 101', '2026-07-14 19:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 97 vs 98'),
('World Cup: Semifinal - Match 102', '2026-07-15 19:00:00+00', 'World Cup', 'published', 'off-site', 'Winners of Match 99 vs 100'),

-- THIRD PLACE
('World Cup: Third-Place Match', '2026-07-18 21:00:00+00', 'World Cup', 'published', 'off-site', 'Losers of Match 101 vs 102'),

-- FINAL
('World Cup: Final', '2026-07-19 19:00:00+00', 'World Cup', 'published', 'off-site', 'FIFA World Cup 2026 Final - Winners of Match 101 vs 102');