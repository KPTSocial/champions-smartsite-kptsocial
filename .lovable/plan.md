

# Plan: Hero Badge for Community Awards

## What We're Building

A "Hero Badge" feature that displays community awards/accolades (e.g., "Best Sports Bar 2026 - Voted by the Community") as a badge in the top-right corner of the homepage hero section. Admins control it from a new "Hero Badge" tab in Settings, with an optional end date (or "no end date" for permanent display).

## Database

### New table: `hero_badges`

```sql
CREATE TABLE public.hero_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,              -- e.g. "Best Sports Bar 2026"
  subtitle text,                    -- e.g. "Voted by the Community"
  image_url text,                   -- optional badge/award image
  is_active boolean NOT NULL DEFAULT true,
  has_end_date boolean NOT NULL DEFAULT false,
  end_date date,                    -- null if no end date
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
```

This keeps things simple — one active badge at a time (enforced in the UI, not the schema, so they could have multiple if desired later).

## Files to Create

### 1. `src/components/admin/HeroBadgeManager.tsx`
Admin form with:
- **Title** (text input) — the award name
- **Subtitle** (text input) — secondary line like "Voted by the Community"
- **Image** (upload + preview) — optional award logo/seal image, uploaded to `photos/hero-badges/`
- **Active toggle** (switch) — turn display on/off
- **End Date toggle** — "Has end date" checkbox; if checked, show a date picker; if unchecked, badge displays indefinitely
- **Save** button with dirty-state tracking
- Shows the current badge if one exists, or a "Create Badge" form if none

### 2. `src/components/HeroBadge.tsx`
Frontend display component:
- Positioned absolute top-right of the hero section (`absolute top-24 right-4 z-30`)
- Shows the badge image (if any), title, and subtitle
- Styled as a semi-transparent card with a subtle gold/amber accent (award feel)
- Subtle entrance animation using framer-motion
- Responsive: slightly smaller on mobile

### 3. `src/hooks/useHeroBadge.ts`
React Query hook to fetch the active badge. Queries `hero_badges` where `is_active = true` and (no end date OR end_date >= today). Returns the first match.

## Files to Modify

### 4. `src/components/admin/SettingsDashboard.tsx`
- Add a 4th tab: "Hero Badge" with an `Award` icon from Lucide
- Renders `HeroBadgeManager`

### 5. `src/pages/Index.tsx`
- Import and render `<HeroBadge />` inside the hero `<section>`, positioned top-right
- Only renders if the hook returns an active badge

## Storage Policy

Add an RLS policy for uploading badge images to `photos/hero-badges/`:

```sql
CREATE POLICY "Admins can upload hero badge images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'photos'
  AND (storage.foldername(name))[1] = 'hero-badges'
  AND public.is_admin(auth.uid())
);
```

## Summary of Changes

| Area | Change |
|------|--------|
| Database | New `hero_badges` table + RLS + storage policy |
| `HeroBadgeManager.tsx` | New admin component for managing the badge |
| `HeroBadge.tsx` | New frontend badge display component |
| `useHeroBadge.ts` | New hook to fetch active badge |
| `SettingsDashboard.tsx` | Add "Hero Badge" tab |
| `Index.tsx` | Render `<HeroBadge />` in hero section |

