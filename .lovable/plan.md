

## Add Homepage Text Editor to Admin Settings

### Overview
Enable the owner to edit homepage text from the Admin Settings page. This will allow updating:

1. **Hero Section Title**: "Hillsboro's Sports Bar & Flavor Hub"
2. **Hero Section Subtitle**: "Experience the thrill of the game and the taste of locally-sourced, PNW cuisine. Welcome to your new favorite spot."
3. **About Section Title**: "A Bar for Champions"
4. **About Section Subtitle**: "We're more than just a sports bar. We're a family friendly, community hub with a passion for fresh ingredients and unforgettable moments."

---

### Current vs New Flow

```text
CURRENT STATE:
┌─────────────────────────────────────────────────────────────────┐
│  Homepage (Index.tsx)                                           │
├─────────────────────────────────────────────────────────────────┤
│  Hero Section:                                                  │
│    "Hillsboro's Sports Bar & Flavor Hub"       ← HARDCODED     │
│    "Experience the thrill of..."                ← HARDCODED     │
│                                                                 │
│  About Section:                                                 │
│    "A Bar for Champions"                        ← HARDCODED     │
│    "We're more than just..."                    ← HARDCODED     │
└─────────────────────────────────────────────────────────────────┘

NEW STATE:
┌─────────────────────────────────────────────────────────────────┐
│  Admin Settings > Homepage Text                                 │
├─────────────────────────────────────────────────────────────────┤
│  Hero Title:    [Hillsboro's Sports Bar & Flavor Hub    ]       │
│  Hero Subtitle: [Experience the thrill of the game...   ]       │
│                                                                 │
│  About Title:   [A Bar for Champions                     ]       │
│  About Text:    [We're more than just a sports bar...    ]       │
│                                                                 │
│                                         [Save All Changes]       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Homepage (Index.tsx)                                           │
├─────────────────────────────────────────────────────────────────┤
│  Hero Section:                                                  │
│    {heroTitle from database}                    ← DYNAMIC       │
│    {heroSubtitle from database}                 ← DYNAMIC       │
│                                                                 │
│  About Section:                                                 │
│    {aboutTitle from database}                   ← DYNAMIC       │
│    {aboutText from database}                    ← DYNAMIC       │
└─────────────────────────────────────────────────────────────────┘
```

---

### Database Changes

Add 4 new columns to the existing `site_settings` table:

```sql
ALTER TABLE site_settings
ADD COLUMN hero_title TEXT DEFAULT 'Hillsboro''s Sports Bar & Flavor Hub',
ADD COLUMN hero_subtitle TEXT DEFAULT 'Experience the thrill of the game and the taste of locally-sourced, PNW cuisine. Welcome to your new favorite spot.',
ADD COLUMN about_title TEXT DEFAULT 'A Bar for Champions',
ADD COLUMN about_text TEXT DEFAULT 'We''re more than just a sports bar. We''re a family friendly, community hub with a passion for fresh ingredients and unforgettable moments.';
```

| Column | Type | Default Value | Purpose |
|--------|------|---------------|---------|
| `hero_title` | TEXT | "Hillsboro's Sports Bar & Flavor Hub" | Main headline in hero section |
| `hero_subtitle` | TEXT | "Experience the thrill..." | Subheadline in hero section |
| `about_title` | TEXT | "A Bar for Champions" | Section heading below hero |
| `about_text` | TEXT | "We're more than just..." | Section description below hero |

---

### Implementation Details

#### 1. New Admin Component

Create `src/components/admin/HomepageTextManager.tsx`:

```text
┌─────────────────────────────────────────────────────────────────┐
│  Homepage Text                                                  │
│  Edit the text displayed on the homepage                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Hero Section                                               ││
│  │  The main banner area visitors see first                    ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  Hero Title                                                 ││
│  │  [Hillsboro's Sports Bar & Flavor Hub                 ]     ││
│  │  The main headline (recommended: 5-8 words)                 ││
│  │                                                             ││
│  │  Hero Subtitle                                              ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │ Experience the thrill of the game and the taste of │   ││
│  │  │ locally-sourced, PNW cuisine. Welcome to your new  │   ││
│  │  │ favorite spot.                                      │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │  Welcoming message below the title (1-2 sentences)          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  About Section                                              ││
│  │  The section below the hero with feature cards              ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  Section Title                                              ││
│  │  [A Bar for Champions                                 ]     ││
│  │  Headline for the feature cards section                     ││
│  │                                                             ││
│  │  Section Description                                        ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │ We're more than just a sports bar. We're a family  │   ││
│  │  │ friendly, community hub with a passion for fresh   │   ││
│  │  │ ingredients and unforgettable moments.              │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │  Description that appears under the section title           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│                                         [Save All Changes]       │
└─────────────────────────────────────────────────────────────────┘
```

Features:
- Input field for Hero Title
- Textarea for Hero Subtitle
- Input field for About Title
- Textarea for About Description
- Single "Save All Changes" button
- Loading states and success/error toasts
- Character recommendations for optimal display

#### 2. Update Settings Dashboard

Add new tab/section to `src/components/admin/SettingsDashboard.tsx`:

```typescript
const sections = [
  {
    value: 'hours',
    label: 'Hours of Operation',
    icon: Clock,
    content: <HoursOfOperationManager />,
  },
  {
    value: 'homepage',
    label: 'Homepage Text',
    icon: Home,
    content: <HomepageTextManager />,
  },
];
```

#### 3. New Custom Hook

Create `src/hooks/useHomepageSettings.ts`:

```typescript
export interface HomepageSettings {
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_text: string;
}

export const useHomepageSettings = () => {
  return useQuery({
    queryKey: ['homepage-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('hero_title, hero_subtitle, about_title, about_text')
        .eq('id', 1)
        .single();
      // Return with fallback defaults
    },
    staleTime: 1000 * 60 * 5,
  });
};
```

#### 4. Update Homepage

Update `src/pages/Index.tsx` to fetch and display dynamic text:

```typescript
const { data: homepageSettings } = useHomepageSettings();

// Hero Section
<h1>{homepageSettings?.hero_title || "Hillsboro's Sports Bar & Flavor Hub"}</h1>
<p>{homepageSettings?.hero_subtitle || "Experience the thrill..."}</p>

// About Section
<h2>{homepageSettings?.about_title || "A Bar for Champions"}</h2>
<p>{homepageSettings?.about_text || "We're more than just..."}</p>
```

---

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/migrations/...` | Create | Add 4 columns to site_settings |
| `src/components/admin/HomepageTextManager.tsx` | Create | New admin component for editing text |
| `src/hooks/useHomepageSettings.ts` | Create | Hook to fetch homepage settings |
| `src/components/admin/SettingsDashboard.tsx` | Modify | Add "Homepage Text" tab/section |
| `src/pages/Index.tsx` | Modify | Use dynamic text from database |
| `src/integrations/supabase/types.ts` | Auto-update | Types regenerated after migration |

---

### User Experience

1. Owner navigates to **Admin > Settings**
2. Clicks on **"Homepage Text"** tab
3. Edits any of the 4 text fields
4. Clicks **"Save All Changes"**
5. Homepage immediately shows updated text

---

### Fallback Behavior

If database values are empty or null, the homepage will display the original hardcoded text. This ensures the site never shows blank content.

