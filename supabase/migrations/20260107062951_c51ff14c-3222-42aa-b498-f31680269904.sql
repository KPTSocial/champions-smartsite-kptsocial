-- Delete all incorrectly imported sports events created today
DELETE FROM public.events 
WHERE event_type IN ('NBA', 'MLS', 'NWSL', 'Olympics', 'World Cup')
  AND created_at >= '2026-01-07'::date;