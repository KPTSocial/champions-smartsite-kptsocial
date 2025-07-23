-- Add new columns to events table for enhanced admin management
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'on-site',
ADD COLUMN IF NOT EXISTS recurring_pattern TEXT,
ADD COLUMN IF NOT EXISTS parent_event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'archived'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_events_parent_event_id ON public.events(parent_event_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_location ON public.events(location);

-- Add RLS policies for admin users to manage events
CREATE POLICY "Admin can manage all events" 
ON public.events 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND active = true
  )
);

-- Update the existing public read policy to only show published events
DROP POLICY IF EXISTS "Allow public read access for events" ON public.events;
CREATE POLICY "Allow public read access for published events" 
ON public.events 
FOR SELECT 
USING (status = 'published');

-- Create function to auto-generate recurring events
CREATE OR REPLACE FUNCTION public.generate_recurring_events()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-create Trivia Night for Taco Tuesday events
  IF NEW.event_title ILIKE '%taco tuesday%' AND NEW.recurring_pattern = 'weekly' THEN
    INSERT INTO public.events (
      event_title,
      event_date,
      event_type,
      description,
      location,
      parent_event_id,
      status,
      allow_rsvp
    ) VALUES (
      'Trivia Night',
      NEW.event_date,
      'Game Night',
      'Join us for Trivia Night during Taco Tuesday!',
      NEW.location,
      NEW.id,
      NEW.status,
      true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-generating recurring events
DROP TRIGGER IF EXISTS trigger_generate_recurring_events ON public.events;
CREATE TRIGGER trigger_generate_recurring_events
  AFTER INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_recurring_events();