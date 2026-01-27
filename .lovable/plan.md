

## Homepage Alert Banner for Private Events (Updated)

### Overview
Create an alert banner that appears directly below the hero video section on the homepage for the **January 31st, 2026** Private Event closure, with proper Pacific Time handling.

---

### Date Handling Clarification

| Storage | Display |
|---------|---------|
| `2026-02-01 00:00:00+00` (UTC) | **Saturday, January 31, 2026** (Pacific Time) |

The banner will use the same Pacific Time conversion logic as the calendar (`date-fns-tz` with `formatInTimeZone`).

---

### Architecture

```text
New/Modified Files:
├── src/components/HomepageAlertBanner.tsx    # New banner component
├── src/hooks/useClosureEvents.ts             # New hook to fetch closure events
├── src/pages/Index.tsx                       # Modified to include banner
├── src/components/admin/EventForm.tsx        # Add banner toggle
└── supabase/migrations/                      # Add show_as_homepage_banner column
```

---

### Implementation Details

#### 1. Database Enhancement

Add a new column to flag events for homepage banner display:

```sql
ALTER TABLE events 
ADD COLUMN show_as_homepage_banner boolean DEFAULT false;

-- Enable banner for the private event
UPDATE events 
SET show_as_homepage_banner = true 
WHERE id = '3dd511f0-106a-488e-a7b8-7547f5225e6e';
```

---

#### 2. New Hook: `useClosureEvents.ts`

Fetches upcoming events marked for homepage banner display:

```typescript
const { data } = useQuery({
  queryKey: ['homepage-banner-events'],
  queryFn: async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('show_as_homepage_banner', true)
      .eq('status', 'published')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });
    return data;
  }
});
```

---

#### 3. New Component: `HomepageAlertBanner.tsx`

**Visual Design:**
```text
┌──────────────────────────────────────────────────────────────────┐
│  ⚠️  Private Event - Closed to Public                           │
│  Saturday, January 31, 2026                                      │
│                                                                  │
│  Closing early to honor and celebrate a member of our community. │
│  Thank you for your understanding & support.                     │
└──────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Uses `formatInTimeZone(date, 'America/Los_Angeles', 'EEEE, MMMM d, yyyy')` for correct Pacific Time display
- Warning/alert styling with amber accent color
- `AlertTriangle` icon from Lucide
- Responsive design
- Fade-in animation

---

#### 4. Homepage Integration

**File: `src/pages/Index.tsx`**

Insert immediately after the hero section:

```text
Hero Section (video + CTAs)
    ↓
<HomepageAlertBanner />    ← NEW (only renders if banner events exist)
    ↓
"A Bar for Champions" Section
```

---

#### 5. Admin Event Form Enhancement

**File: `src/components/admin/EventForm.tsx`**

Add toggle switch:

| Field | UI | Position |
|-------|-----|----------|
| "Show as Homepage Banner" | Switch | Near the `is_featured` toggle |

Helper text: *"Display this event as an alert banner on the homepage"*

---

### Date Display Example

Using the existing event:

**Input (UTC):** `2026-02-01T00:00:00+00:00`

**Output (Pacific Time):** `Saturday, January 31, 2026`

This matches the calendar display logic already in use.

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/migrations/...` | **Create** - Add `show_as_homepage_banner` column |
| `src/hooks/useClosureEvents.ts` | **Create** - Fetch banner events |
| `src/components/HomepageAlertBanner.tsx` | **Create** - Banner UI |
| `src/pages/Index.tsx` | **Modify** - Add banner below hero |
| `src/components/admin/EventForm.tsx` | **Modify** - Add toggle field |

---

### Admin Workflow

1. Edit the event "Private Event - Closed to Public"
2. Toggle ON "Show as Homepage Banner"  
3. Banner appears on homepage showing "Saturday, January 31, 2026"
4. After the event passes, toggle OFF or banner auto-hides (date filter)

