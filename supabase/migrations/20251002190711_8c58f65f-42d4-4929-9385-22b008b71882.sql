-- Function to automatically activate/deactivate menu items based on special dates
CREATE OR REPLACE FUNCTION public.activate_scheduled_menu_items()
RETURNS void AS $$
BEGIN
  -- Activate items that should start today or have already started
  UPDATE public.menu_items
  SET is_available = true
  WHERE special_start_date <= CURRENT_DATE
    AND is_available = false
    AND is_special = true;
    
  -- Deactivate items that expired yesterday or earlier
  UPDATE public.menu_items
  SET is_available = false
  WHERE special_end_date < CURRENT_DATE
    AND is_available = true
    AND is_special = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for PDF menus if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-pdfs', 'menu-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for menu-pdfs bucket
CREATE POLICY "Admins can upload PDFs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'menu-pdfs' AND
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "Admins can read PDFs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'menu-pdfs' AND
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "Public can read PDFs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'menu-pdfs');