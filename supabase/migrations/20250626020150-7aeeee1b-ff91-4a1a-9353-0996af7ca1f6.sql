
-- Add requires_confirmation field to reservations table
ALTER TABLE public.reservations 
ADD COLUMN requires_confirmation boolean DEFAULT false;
