ALTER TABLE public.homepage_content ADD COLUMN default_image_url text;

UPDATE public.homepage_content SET default_image_url = image_url WHERE image_url IS NOT NULL;