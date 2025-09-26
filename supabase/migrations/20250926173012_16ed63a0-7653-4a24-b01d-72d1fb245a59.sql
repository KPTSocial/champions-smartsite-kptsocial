-- Fix guest_feedback table security: Remove public access to sensitive customer data

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view feedback with matching email" ON public.guest_feedback;

-- Create new restrictive SELECT policies

-- Policy 1: Admins can view all feedback
CREATE POLICY "Admins can view all feedback" 
ON public.guest_feedback 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() 
    AND active = true
  )
);

-- Policy 2: Authenticated users can view their own feedback (based on email)
CREATE POLICY "Users can view their own feedback" 
ON public.guest_feedback 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND email = auth.jwt()->>'email'
);

-- The INSERT and UPDATE policies remain unchanged as they are correctly configured
-- INSERT: Anyone can submit feedback (public form)
-- UPDATE: Service role can update (for AI responses)