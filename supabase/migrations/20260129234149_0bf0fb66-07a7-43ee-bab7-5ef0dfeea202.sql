-- Add homepage text columns to site_settings
ALTER TABLE site_settings
ADD COLUMN hero_title TEXT DEFAULT 'Hillsboro''s Sports Bar & Flavor Hub',
ADD COLUMN hero_subtitle TEXT DEFAULT 'Experience the thrill of the game and the taste of locally-sourced, PNW cuisine. Welcome to your new favorite spot.',
ADD COLUMN about_title TEXT DEFAULT 'A Bar for Champions',
ADD COLUMN about_text TEXT DEFAULT 'We''re more than just a sports bar. We''re a family friendly, community hub with a passion for fresh ingredients and unforgettable moments.';