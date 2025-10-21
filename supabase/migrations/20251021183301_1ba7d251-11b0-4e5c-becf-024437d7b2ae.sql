-- Rename the PDF file in storage to a professional, URL-friendly name
UPDATE storage.objects
SET name = 'champions-menu-fall-2025.pdf'
WHERE bucket_id = 'menu-pdfs' 
  AND name = 'Champions - Main Menu Pg.2 Final Fall 2025.pdf';