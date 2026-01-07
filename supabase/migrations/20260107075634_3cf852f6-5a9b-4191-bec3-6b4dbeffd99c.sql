-- Insert Trivia Night events for every Tuesday in 2026 at 6 PM Pacific Time
-- PST (UTC-8): Jan 1 - Mar 7, Nov 1 - Dec 31 → 6 PM = 02:00 UTC next day
-- PDT (UTC-7): Mar 8 - Oct 31 → 6 PM = 01:00 UTC next day

INSERT INTO public.events (event_title, description, event_date, event_type, location, status)
VALUES
  -- January (PST)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-01-06T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-01-13T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-01-20T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-01-27T02:00:00Z', 'Game Night', 'on-site', 'published'),
  -- February (PST)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-02-03T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-02-10T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-02-17T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-02-24T02:00:00Z', 'Game Night', 'on-site', 'published'),
  -- March (PST until Mar 8, then PDT)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-03-03T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-03-10T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-03-17T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-03-24T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-03-31T01:00:00Z', 'Game Night', 'on-site', 'published'),
  -- April (PDT)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-04-07T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-04-14T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-04-21T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-04-28T01:00:00Z', 'Game Night', 'on-site', 'published'),
  -- May (PDT)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-05-05T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-05-12T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-05-19T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-05-26T01:00:00Z', 'Game Night', 'on-site', 'published'),
  -- June (PDT)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-06-02T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-06-09T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-06-16T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-06-23T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-06-30T01:00:00Z', 'Game Night', 'on-site', 'published'),
  -- July (PDT)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-07-07T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-07-14T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-07-21T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-07-28T01:00:00Z', 'Game Night', 'on-site', 'published'),
  -- August (PDT)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-08-04T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-08-11T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-08-18T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-08-25T01:00:00Z', 'Game Night', 'on-site', 'published'),
  -- September (PDT)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-09-01T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-09-08T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-09-15T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-09-22T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-09-29T01:00:00Z', 'Game Night', 'on-site', 'published'),
  -- October (PDT)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-10-06T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-10-13T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-10-20T01:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-10-27T01:00:00Z', 'Game Night', 'on-site', 'published'),
  -- November (PST after Nov 1)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-11-03T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-11-10T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-11-17T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-11-24T02:00:00Z', 'Game Night', 'on-site', 'published'),
  -- December (PST)
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-12-01T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-12-08T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-12-15T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-12-22T02:00:00Z', 'Game Night', 'on-site', 'published'),
  ('Trivia Night', 'Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!', '2026-12-29T02:00:00Z', 'Game Night', 'on-site', 'published');