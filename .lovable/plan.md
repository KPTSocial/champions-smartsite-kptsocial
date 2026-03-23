

# Plan: Default Homepage Card Images

## Overview

Add a `default_image_url` column to the `homepage_content` table so each card has a fallback image. The current images will be copied into this column as the initial defaults. On the frontend, if `image_url` fails to load, the `default_image_url` is used instead. Admins get a "Set as Default" button to save the current image as the default.

## Database

### Migration: Add `default_image_url` column

```sql
ALTER TABLE public.homepage_content
ADD COLUMN default_image_url text;

-- Copy current images as the initial defaults
UPDATE public.homepage_content
SET default_image_url = image_url
WHERE image_url IS NOT NULL;
```

No new RLS needed — existing policies already cover this table.

## Files to Modify

### 1. `src/components/admin/HomepageCardsManager.tsx`

- Add `default_image_url` to the `CardData` interface
- Add a "Set Current as Default" button next to "Upload Image" — saves the current `image_url` into `default_image_url`
- Show the default image thumbnail with a label "Default (fallback) image" so admins can see what's set
- Add a "Restore Default Image" button that copies `default_image_url` back into `image_url`
- Include `default_image_url` in the save logic when "Set as Default" is clicked

### 2. `src/pages/Index.tsx`

- For the non-QR cards, use an `onError` handler on the `<img>` tag to swap to `content.default_image_url` if the primary `image_url` fails to load
- If neither URL exists, hide the image entirely (current behavior)

### 3. `src/hooks/useHomepageContent.ts`

- Add `default_image_url: string | null` to the `HomepageContentItem` interface

## Summary

| Area | Change |
|------|--------|
| Database | Add `default_image_url` column, seed with current images |
| `HomepageCardsManager.tsx` | "Set as Default" + "Restore Default" buttons, show default thumbnail |
| `Index.tsx` | `onError` fallback to `default_image_url` |
| `useHomepageContent.ts` | Add field to interface |

