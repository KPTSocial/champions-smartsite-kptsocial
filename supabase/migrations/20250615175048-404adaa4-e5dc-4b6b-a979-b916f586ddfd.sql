
-- Create custom type for event categories
CREATE TYPE public.event_type AS ENUM ('Live Music', 'Game Night', 'Specials');

-- Create table to store events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  event_type public.event_type NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  allow_rsvp BOOLEAN NOT NULL DEFAULT false,
  rsvp_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to all events
CREATE POLICY "Allow public read access for events"
  ON public.events
  FOR SELECT
  USING (true);


-- Create custom type for reservation categories
CREATE TYPE public.reservation_type AS ENUM ('Event', 'Table');

-- Create table to store reservations
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  reservation_type public.reservation_type NOT NULL,
  reservation_date TIMESTAMPTZ NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  party_size INT NOT NULL CHECK (party_size > 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Note: No RLS is applied to the reservations table yet.
-- This data is currently accessible via the public API key.
-- It should be secured with RLS policies once user authentication
-- and an admin role system are implemented.
