UPDATE events 
SET image_url = 'https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Sports%20Events/Blazers..png'
WHERE (event_title ILIKE '%trail blazers%' OR event_title ILIKE '%blazers%')
  AND event_type = 'NBA';