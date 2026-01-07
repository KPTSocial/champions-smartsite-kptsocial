UPDATE events 
SET image_url = 'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Sports%20Events/Timbers.jpg'
WHERE event_title ILIKE '%timbers%'
  AND event_date >= '2026-01-01'
  AND (image_url IS NULL OR image_url = '');