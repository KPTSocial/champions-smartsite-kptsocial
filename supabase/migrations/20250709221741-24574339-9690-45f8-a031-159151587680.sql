-- Update the active header media to use the Cloudinary video URL
UPDATE header_media 
SET video_url = 'https://res.cloudinary.com/de3djsvlk/video/upload/v1752084740/Champion_Highlight_7_7_2025_gsuhzu.mp4',
    title = 'Champion Highlight 7/7/2025 - Cloudinary'
WHERE is_active = true;