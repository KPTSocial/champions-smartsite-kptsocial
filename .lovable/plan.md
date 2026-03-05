

# Plan: Homepage Cards Editor in Admin Settings

## What We're Building

A new "Homepage Cards" tab in the Settings dashboard (after "Homepage Text") that lets the owner edit the title, description, and image for the two content cards: "Seasonally Inspired Flavors" and "Every Game, Every Screen."

## Current State

- The two cards are stored in the `homepage_content` table (`farm_to_table` and `big_screens` rows)
- Index.tsx has **hardcoded overrides** for the "Scratch-Made Goodness" card — it forces the title to "Seasonally Inspired Flavors" and replaces the description in code. These overrides need to be removed so the database values are the source of truth.
- Images are stored as URLs (one Cloudinary, one local upload)

## Technical Approach

### New Component: `HomepageCardsManager.tsx`
- Fetches the two `homepage_content` rows (`farm_to_table`, `big_screens`)
- Displays an editable card for each with:
  - **Title** (text input)
  - **Description** (textarea)
  - **Image** (current image preview + file upload button)
  - **Alt Text** (text input)
- Image uploads go to Supabase storage (`menu-pdfs` bucket or a dedicated `homepage-images` bucket) and the URL is saved to `image_url`
- Single "Save All Changes" button with dirty-state tracking (same pattern as `HomepageTextManager`)

### Modify: `SettingsDashboard.tsx`
- Add a third tab/accordion section: "Homepage Cards" with an `Image` icon from Lucide
- Renders `HomepageCardsManager`

### Modify: `Index.tsx`
- Remove the hardcoded title/description overrides for "Scratch-Made Goodness" — use `content.title` and `content.description` directly from the database
- Update the database row to have the correct current values ("Seasonally Inspired Flavors" + the seasonal description) via a migration

### Migration
```sql
UPDATE homepage_content 
SET title = 'Seasonally Inspired Flavors',
    description = 'Fresh, seasonal ingredients and bold flavors—curated in-house and crafted with care, no matter the season.'
WHERE section_name = 'farm_to_table';
```

## Files to Create
1. `src/components/admin/HomepageCardsManager.tsx`

## Files to Modify
1. `src/components/admin/SettingsDashboard.tsx` — Add "Homepage Cards" tab
2. `src/pages/Index.tsx` — Remove hardcoded overrides, use DB values directly

## Migration
One migration to update the `farm_to_table` row with the currently-hardcoded values so removing the overrides doesn't change what users see.

