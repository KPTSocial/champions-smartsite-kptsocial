-- Fix Sunday Breakfast Service event times to show 9:00 AM PT
UPDATE events 
SET event_date = CASE 
  WHEN DATE(event_date) = '2025-08-31' THEN '2025-08-31 16:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-09-07' THEN '2025-09-07 16:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-09-14' THEN '2025-09-14 16:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-09-21' THEN '2025-09-21 16:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-09-28' THEN '2025-09-28 16:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-10-05' THEN '2025-10-05 16:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-10-12' THEN '2025-10-12 16:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-10-19' THEN '2025-10-19 16:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-10-26' THEN '2025-10-26 16:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-11-02' THEN '2025-11-02 17:00:00+00'::timestamptz -- Standard Time starts
  WHEN DATE(event_date) = '2025-11-09' THEN '2025-11-09 17:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-11-16' THEN '2025-11-16 17:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-11-23' THEN '2025-11-23 17:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-11-30' THEN '2025-11-30 17:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-12-07' THEN '2025-12-07 17:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-12-14' THEN '2025-12-14 17:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-12-21' THEN '2025-12-21 17:00:00+00'::timestamptz
  WHEN DATE(event_date) = '2025-12-28' THEN '2025-12-28 17:00:00+00'::timestamptz
END
WHERE event_title = 'Sunday Breakfast Service';