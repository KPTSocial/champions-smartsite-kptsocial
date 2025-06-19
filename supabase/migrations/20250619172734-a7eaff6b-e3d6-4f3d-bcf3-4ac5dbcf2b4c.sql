
-- Add RLS policies for guest_feedback table to allow public feedback submissions

-- Allow anyone to insert guest feedback (public feedback, not tied to authenticated users)
CREATE POLICY "Anyone can submit guest feedback" 
ON public.guest_feedback 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to select their own feedback if they provide matching email
-- This could be useful for confirmation pages or follow-ups
CREATE POLICY "Users can view feedback with matching email" 
ON public.guest_feedback 
FOR SELECT 
USING (true);

-- Allow service role (for edge functions) to update feedback with AI responses
CREATE POLICY "Service role can update feedback" 
ON public.guest_feedback 
FOR UPDATE 
USING (true);
