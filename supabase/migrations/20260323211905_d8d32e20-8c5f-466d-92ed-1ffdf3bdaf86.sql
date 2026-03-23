-- Hero badges table (image-only, top-left hero placement)
CREATE TABLE public.hero_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  has_end_date boolean NOT NULL DEFAULT false,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_badges ENABLE ROW LEVEL SECURITY;

-- Public can view active, non-expired badges
CREATE POLICY "Public can view active badges"
ON public.hero_badges FOR SELECT TO public
USING (
  is_active = true 
  AND (has_end_date = false OR end_date >= CURRENT_DATE)
);

-- Admins can manage all badges
CREATE POLICY "Admins can manage badges"
ON public.hero_badges FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Storage policy for hero badge image uploads
CREATE POLICY "Admins can upload hero badge images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'photos'
  AND (storage.foldername(name))[1] = 'hero-badges'
  AND public.is_admin(auth.uid())
);