-- Add sponsored_by and theme columns to events table
ALTER TABLE events
ADD COLUMN sponsored_by TEXT DEFAULT NULL,
ADD COLUMN theme TEXT DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN events.sponsored_by IS 'Vendor/sponsor name for this specific event date (e.g., Stickmen Brewing)';
COMMENT ON COLUMN events.theme IS 'Special theme for this specific event date (e.g., Valentine''s Day Special)';