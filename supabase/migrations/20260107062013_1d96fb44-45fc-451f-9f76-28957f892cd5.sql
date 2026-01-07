-- Bulk import sporting events from 2026 Major Sports Event Schedules
-- All times converted from PST to UTC (PST + 8 hours)

-- =====================================================
-- WINTER OLYMPICS 2026 (Key Events)
-- February 6-22, 2026 - Milan-Cortina, Italy
-- =====================================================
INSERT INTO events (event_title, event_date, event_type, description, location, is_featured, allow_rsvp, status) VALUES
('Winter Olympics Opening Ceremony', '2026-02-06T19:00:00Z', 'Olympics', 'Watch the Opening Ceremony of the 2026 Winter Olympics from Milan-Cortina, Italy.', 'on-site', true, true, 'published'),
('Winter Olympics - Women''s Hockey Gold Medal', '2026-02-19T18:10:00Z', 'Olympics', 'Women''s Hockey Gold Medal Game - USA vs Canada rivalry continues!', 'on-site', true, true, 'published'),
('Winter Olympics - Men''s Hockey Gold Medal', '2026-02-22T13:10:00Z', 'Olympics', 'Men''s Hockey Gold Medal Game at the 2026 Winter Olympics.', 'on-site', true, true, 'published'),
('Winter Olympics Closing Ceremony', '2026-02-22T19:30:00Z', 'Olympics', 'Watch the Closing Ceremony of the 2026 Winter Olympics.', 'on-site', false, true, 'published');

-- =====================================================
-- PORTLAND TRAIL BLAZERS 2025-26 (Remaining Games Jan-Apr)
-- All times converted from PST to UTC
-- =====================================================
INSERT INTO events (event_title, event_date, event_type, description, location, is_featured, allow_rsvp, status) VALUES
-- January 2026
('Trail Blazers vs Pacers', '2026-01-08T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Indiana Pacers at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers @ Heat', '2026-01-10T00:30:00Z', 'NBA', 'Portland Trail Blazers visit the Miami Heat.', 'off-site', false, true, 'published'),
('Trail Blazers @ Magic', '2026-01-12T01:00:00Z', 'NBA', 'Portland Trail Blazers visit the Orlando Magic.', 'off-site', false, true, 'published'),
('Trail Blazers vs Warriors', '2026-01-14T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Golden State Warriors at Moda Center.', 'on-site', true, true, 'published'),
('Trail Blazers @ Mavericks', '2026-01-17T01:30:00Z', 'NBA', 'Portland Trail Blazers visit the Dallas Mavericks.', 'off-site', false, true, 'published'),
('Trail Blazers @ Spurs', '2026-01-19T02:00:00Z', 'NBA', 'Portland Trail Blazers visit the San Antonio Spurs.', 'off-site', false, true, 'published'),
('Trail Blazers vs Nets', '2026-01-21T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Brooklyn Nets at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers vs Jazz', '2026-01-23T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Utah Jazz at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers @ Thunder', '2026-01-25T01:00:00Z', 'NBA', 'Portland Trail Blazers visit the Oklahoma City Thunder.', 'off-site', false, true, 'published'),
('Trail Blazers vs Timberwolves', '2026-01-27T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Minnesota Timberwolves at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers @ Lakers', '2026-01-29T03:30:00Z', 'NBA', 'Portland Trail Blazers visit the Los Angeles Lakers.', 'off-site', true, true, 'published'),
('Trail Blazers vs Suns', '2026-01-31T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Phoenix Suns at Moda Center.', 'on-site', false, true, 'published'),
-- February 2026
('Trail Blazers @ Clippers', '2026-02-02T03:30:00Z', 'NBA', 'Portland Trail Blazers visit the LA Clippers.', 'off-site', false, true, 'published'),
('Trail Blazers vs Nuggets', '2026-02-04T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Denver Nuggets at Moda Center.', 'on-site', true, true, 'published'),
('Trail Blazers @ Kings', '2026-02-06T03:00:00Z', 'NBA', 'Portland Trail Blazers visit the Sacramento Kings.', 'off-site', false, true, 'published'),
('Trail Blazers vs Cavaliers', '2026-02-08T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Cleveland Cavaliers at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers vs Celtics', '2026-02-10T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Boston Celtics at Moda Center.', 'on-site', true, true, 'published'),
('Trail Blazers @ Grizzlies', '2026-02-24T01:00:00Z', 'NBA', 'Portland Trail Blazers visit the Memphis Grizzlies.', 'off-site', false, true, 'published'),
('Trail Blazers @ Pelicans', '2026-02-26T01:00:00Z', 'NBA', 'Portland Trail Blazers visit the New Orleans Pelicans.', 'off-site', false, true, 'published'),
('Trail Blazers vs Rockets', '2026-02-28T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Houston Rockets at Moda Center.', 'on-site', false, true, 'published'),
-- March 2026
('Trail Blazers @ Wizards', '2026-03-02T00:00:00Z', 'NBA', 'Portland Trail Blazers visit the Washington Wizards.', 'off-site', false, true, 'published'),
('Trail Blazers @ 76ers', '2026-03-04T00:00:00Z', 'NBA', 'Portland Trail Blazers visit the Philadelphia 76ers.', 'off-site', false, true, 'published'),
('Trail Blazers @ Knicks', '2026-03-06T00:30:00Z', 'NBA', 'Portland Trail Blazers visit the New York Knicks.', 'off-site', false, true, 'published'),
('Trail Blazers vs Hawks', '2026-03-10T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Atlanta Hawks at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers vs Hornets', '2026-03-12T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Charlotte Hornets at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers @ Bulls', '2026-03-14T00:00:00Z', 'NBA', 'Portland Trail Blazers visit the Chicago Bulls.', 'off-site', false, true, 'published'),
('Trail Blazers @ Bucks', '2026-03-16T00:00:00Z', 'NBA', 'Portland Trail Blazers visit the Milwaukee Bucks.', 'off-site', false, true, 'published'),
('Trail Blazers vs Raptors', '2026-03-18T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Toronto Raptors at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers vs Pistons', '2026-03-20T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Detroit Pistons at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers @ Warriors', '2026-03-22T03:30:00Z', 'NBA', 'Portland Trail Blazers visit the Golden State Warriors.', 'off-site', true, true, 'published'),
('Trail Blazers vs Lakers', '2026-03-25T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Los Angeles Lakers at Moda Center.', 'on-site', true, true, 'published'),
('Trail Blazers @ Nuggets', '2026-03-27T02:00:00Z', 'NBA', 'Portland Trail Blazers visit the Denver Nuggets.', 'off-site', false, true, 'published'),
('Trail Blazers vs Thunder', '2026-03-29T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Oklahoma City Thunder at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers vs Kings', '2026-03-31T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Sacramento Kings at Moda Center.', 'on-site', false, true, 'published'),
-- April 2026
('Trail Blazers @ Suns', '2026-04-02T02:00:00Z', 'NBA', 'Portland Trail Blazers visit the Phoenix Suns.', 'off-site', false, true, 'published'),
('Trail Blazers vs Clippers', '2026-04-04T03:00:00Z', 'NBA', 'Portland Trail Blazers host the LA Clippers at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers @ Jazz', '2026-04-06T02:00:00Z', 'NBA', 'Portland Trail Blazers visit the Utah Jazz.', 'off-site', false, true, 'published'),
('Trail Blazers vs Spurs', '2026-04-08T03:00:00Z', 'NBA', 'Portland Trail Blazers host the San Antonio Spurs at Moda Center.', 'on-site', false, true, 'published'),
('Trail Blazers @ Timberwolves', '2026-04-10T01:00:00Z', 'NBA', 'Portland Trail Blazers visit the Minnesota Timberwolves.', 'off-site', false, true, 'published'),
('Trail Blazers vs Mavericks', '2026-04-12T03:00:00Z', 'NBA', 'Portland Trail Blazers host the Dallas Mavericks - Regular Season Finale!', 'on-site', false, true, 'published');

-- =====================================================
-- PORTLAND TIMBERS 2026 MLS SEASON
-- Providence Park Home Games & Away Matches
-- =====================================================
INSERT INTO events (event_title, event_date, event_type, description, location, is_featured, allow_rsvp, status) VALUES
-- February/March 2026
('Timbers vs LA Galaxy', '2026-02-22T03:30:00Z', 'MLS', 'Portland Timbers kick off the 2026 MLS season at Providence Park!', 'on-site', true, true, 'published'),
('Timbers @ Seattle Sounders', '2026-03-01T03:00:00Z', 'MLS', 'Cascadia Cup rivalry match! Portland Timbers visit Seattle Sounders.', 'off-site', true, true, 'published'),
('Timbers vs Vancouver Whitecaps', '2026-03-08T03:00:00Z', 'MLS', 'Cascadia Cup match! Portland Timbers host Vancouver at Providence Park.', 'on-site', true, true, 'published'),
('Timbers @ LAFC', '2026-03-15T03:00:00Z', 'MLS', 'Portland Timbers visit LAFC at BMO Stadium.', 'off-site', false, true, 'published'),
('Timbers vs Austin FC', '2026-03-22T02:00:00Z', 'MLS', 'Portland Timbers host Austin FC at Providence Park.', 'on-site', false, true, 'published'),
('Timbers @ Colorado Rapids', '2026-03-29T02:00:00Z', 'MLS', 'Portland Timbers visit Colorado Rapids.', 'off-site', false, true, 'published'),
-- April 2026
('Timbers vs Real Salt Lake', '2026-04-05T02:00:00Z', 'MLS', 'Portland Timbers host Real Salt Lake at Providence Park.', 'on-site', false, true, 'published'),
('Timbers @ San Jose Earthquakes', '2026-04-12T02:00:00Z', 'MLS', 'Portland Timbers visit San Jose Earthquakes.', 'off-site', false, true, 'published'),
('Timbers vs Minnesota United', '2026-04-19T02:00:00Z', 'MLS', 'Portland Timbers host Minnesota United at Providence Park.', 'on-site', false, true, 'published'),
('Timbers @ Houston Dynamo', '2026-04-26T00:30:00Z', 'MLS', 'Portland Timbers visit Houston Dynamo.', 'off-site', false, true, 'published'),
-- May 2026
('Timbers vs FC Dallas', '2026-05-03T02:00:00Z', 'MLS', 'Portland Timbers host FC Dallas at Providence Park.', 'on-site', false, true, 'published'),
('Timbers @ Sporting KC', '2026-05-10T00:30:00Z', 'MLS', 'Portland Timbers visit Sporting Kansas City.', 'off-site', false, true, 'published'),
('Timbers vs Seattle Sounders', '2026-05-17T02:00:00Z', 'MLS', 'Cascadia Cup rivalry! Portland Timbers host Seattle at Providence Park.', 'on-site', true, true, 'published'),
('Timbers @ Nashville SC', '2026-05-24T00:30:00Z', 'MLS', 'Portland Timbers visit Nashville SC.', 'off-site', false, true, 'published'),
('Timbers vs Sporting KC', '2026-05-31T02:00:00Z', 'MLS', 'Portland Timbers host Sporting KC at Providence Park.', 'on-site', false, true, 'published'),
-- August 2026 (After World Cup Break)
('Timbers @ Vancouver Whitecaps', '2026-08-02T02:00:00Z', 'MLS', 'Cascadia Cup rivalry resumes! Portland visits Vancouver.', 'off-site', true, true, 'published'),
('Timbers vs LAFC', '2026-08-09T02:00:00Z', 'MLS', 'Portland Timbers host LAFC at Providence Park.', 'on-site', true, true, 'published'),
('Timbers @ Austin FC', '2026-08-16T00:30:00Z', 'MLS', 'Portland Timbers visit Austin FC.', 'off-site', false, true, 'published'),
('Timbers vs Colorado Rapids', '2026-08-23T02:00:00Z', 'MLS', 'Portland Timbers host Colorado Rapids at Providence Park.', 'on-site', false, true, 'published'),
('Timbers @ Real Salt Lake', '2026-08-30T02:30:00Z', 'MLS', 'Portland Timbers visit Real Salt Lake.', 'off-site', false, true, 'published'),
-- September 2026
('Timbers vs San Jose Earthquakes', '2026-09-06T02:00:00Z', 'MLS', 'Portland Timbers host San Jose Earthquakes at Providence Park.', 'on-site', false, true, 'published'),
('Timbers @ LA Galaxy', '2026-09-13T02:30:00Z', 'MLS', 'Portland Timbers visit LA Galaxy.', 'off-site', false, true, 'published'),
('Timbers vs Houston Dynamo', '2026-09-20T02:00:00Z', 'MLS', 'Portland Timbers host Houston Dynamo at Providence Park.', 'on-site', false, true, 'published'),
('Timbers @ Minnesota United', '2026-09-27T00:00:00Z', 'MLS', 'Portland Timbers visit Minnesota United.', 'off-site', false, true, 'published'),
-- October 2026
('Timbers vs Nashville SC', '2026-10-04T02:00:00Z', 'MLS', 'Portland Timbers host Nashville SC at Providence Park.', 'on-site', false, true, 'published'),
('Timbers @ FC Dallas', '2026-10-11T00:30:00Z', 'MLS', 'Portland Timbers visit FC Dallas.', 'off-site', false, true, 'published'),
('Timbers vs St. Louis City SC', '2026-10-18T02:00:00Z', 'MLS', 'Portland Timbers host St. Louis City SC at Providence Park.', 'on-site', false, true, 'published'),
('Timbers @ Atlanta United', '2026-10-25T00:00:00Z', 'MLS', 'Portland Timbers visit Atlanta United.', 'off-site', false, true, 'published'),
-- November 2026
('Timbers vs Inter Miami', '2026-11-01T02:00:00Z', 'MLS', 'Portland Timbers host Inter Miami at Providence Park.', 'on-site', true, true, 'published'),
('Timbers @ Seattle Sounders', '2026-11-08T03:00:00Z', 'MLS', 'Decision Day! Cascadia Cup finale at Seattle.', 'off-site', true, true, 'published');

-- =====================================================
-- PORTLAND THORNS 2026 NWSL SEASON (Placeholder Events)
-- Full schedule not yet released
-- =====================================================
INSERT INTO events (event_title, event_date, event_type, description, location, is_featured, allow_rsvp, status) VALUES
('Thorns - NWSL Challenge Cup', '2026-02-20T03:00:00Z', 'NWSL', 'Portland Thorns begin their 2026 campaign in the NWSL Challenge Cup at Providence Park.', 'on-site', true, true, 'published'),
('Thorns - NWSL Season Opener', '2026-03-13T03:00:00Z', 'NWSL', 'Portland Thorns 2026 NWSL regular season opener at Providence Park.', 'on-site', true, true, 'published');

-- =====================================================
-- FIFA WORLD CUP 2026 - USA, CANADA, MEXICO
-- All USA Games (Featured)
-- =====================================================
INSERT INTO events (event_title, event_date, event_type, description, location, is_featured, allow_rsvp, status) VALUES
-- USA Group Stage Games
('World Cup: USA vs Paraguay', '2026-06-13T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - USA kicks off their home World Cup campaign against Paraguay!', 'on-site', true, true, 'published'),
('World Cup: USA vs Australia', '2026-06-19T20:00:00Z', 'World Cup', 'FIFA World Cup 2026 - USA vs Australia in Group Stage Match 2.', 'on-site', true, true, 'published'),
('World Cup: USA vs UEFA Playoff C Winner', '2026-06-26T03:00:00Z', 'World Cup', 'FIFA World Cup 2026 - USA completes group stage vs UEFA Playoff C winner.', 'on-site', true, true, 'published');

-- World Cup Key Matches
INSERT INTO events (event_title, event_date, event_type, description, location, is_featured, allow_rsvp, status) VALUES
-- Opening & Group Stage Highlights
('World Cup: Opening Match', '2026-06-12T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 Opening Match! The tournament kicks off in North America.', 'on-site', true, true, 'published'),
('World Cup: Mexico vs TBD', '2026-06-14T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Mexico''s opening match at their home World Cup.', 'on-site', true, true, 'published'),
('World Cup: Canada vs TBD', '2026-06-15T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Canada''s first ever World Cup match as a host nation.', 'on-site', true, true, 'published'),
('World Cup: Brazil vs TBD', '2026-06-16T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - 5-time champions Brazil begin their campaign.', 'on-site', true, true, 'published'),
('World Cup: Argentina vs TBD', '2026-06-17T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Defending champions Argentina open their title defense.', 'on-site', true, true, 'published'),
('World Cup: England vs TBD', '2026-06-18T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - England opens their World Cup campaign.', 'on-site', false, true, 'published'),
('World Cup: France vs TBD', '2026-06-20T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - France opens their World Cup campaign.', 'on-site', false, true, 'published'),
('World Cup: Germany vs TBD', '2026-06-21T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Germany opens their World Cup campaign.', 'on-site', false, true, 'published'),
('World Cup: Spain vs TBD', '2026-06-22T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Spain opens their World Cup campaign.', 'on-site', false, true, 'published'),
('World Cup: Portugal vs TBD', '2026-06-23T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Portugal opens their World Cup campaign.', 'on-site', false, true, 'published'),
-- Knockout Rounds
('World Cup: Round of 32 - Day 1', '2026-06-29T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Knockout stage begins! Round of 32 matches.', 'on-site', false, true, 'published'),
('World Cup: Round of 32 - Day 2', '2026-06-30T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Round of 32 continues.', 'on-site', false, true, 'published'),
('World Cup: Round of 32 - Day 3', '2026-07-01T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Round of 32 continues.', 'on-site', false, true, 'published'),
('World Cup: Round of 32 - Day 4', '2026-07-02T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Round of 32 concludes.', 'on-site', false, true, 'published'),
('World Cup: Round of 16 - Day 1', '2026-07-04T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Round of 16 begins!', 'on-site', true, true, 'published'),
('World Cup: Round of 16 - Day 2', '2026-07-05T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Round of 16 continues.', 'on-site', true, true, 'published'),
('World Cup: Round of 16 - Day 3', '2026-07-06T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Round of 16 continues.', 'on-site', true, true, 'published'),
('World Cup: Round of 16 - Day 4', '2026-07-07T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Round of 16 concludes.', 'on-site', true, true, 'published'),
('World Cup: Quarterfinal 1', '2026-07-10T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Quarterfinal Match 1.', 'on-site', true, true, 'published'),
('World Cup: Quarterfinal 2', '2026-07-10T22:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Quarterfinal Match 2.', 'on-site', true, true, 'published'),
('World Cup: Quarterfinal 3', '2026-07-11T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Quarterfinal Match 3.', 'on-site', true, true, 'published'),
('World Cup: Quarterfinal 4', '2026-07-11T22:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Quarterfinal Match 4.', 'on-site', true, true, 'published'),
('World Cup: Semifinal 1', '2026-07-15T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Semifinal 1! Who advances to the Final?', 'on-site', true, true, 'published'),
('World Cup: Semifinal 2', '2026-07-16T02:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Semifinal 2! Who advances to the Final?', 'on-site', true, true, 'published'),
('World Cup: Third Place Match', '2026-07-18T22:00:00Z', 'World Cup', 'FIFA World Cup 2026 - Third Place Match.', 'on-site', false, true, 'published'),
('World Cup: FINAL', '2026-07-19T20:00:00Z', 'World Cup', 'FIFA World Cup 2026 FINAL! Watch the biggest sporting event in the world at Champions!', 'on-site', true, true, 'published');