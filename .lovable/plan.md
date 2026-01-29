
## Add "Sponsored By" and "Theme" Fields to Bingo & Trivia Events

### Overview
Add two new optional fields to events: **Sponsored By** (for vendor sponsorships) and **Theme** (for special themed events). These fields are per-event/per-date specific, allowing owners to assign different sponsors or themes to individual Bingo and Trivia nights. The display only changes when these fields have values.

---

### How It Works

```text
┌─────────────────────────────────────────────────────────────────┐
│  Example: 3 Different Bingo Nights                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Jan 15 - Bingo Night                                           │
│  Sponsored By: Stickmen Brewing                                 │
│  Theme: (empty - not displayed)                                 │
│                                                                 │
│  Jan 29 - Bingo Night                                           │
│  Sponsored By: Rugged Winery                                    │
│  Theme: Valentine's Day Special                                 │
│                                                                 │
│  Feb 12 - Bingo Night                                           │
│  Sponsored By: (empty - not displayed)                          │
│  Theme: (empty - not displayed)                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Database Changes

Add two new nullable columns to the `events` table:

```sql
ALTER TABLE events
ADD COLUMN sponsored_by TEXT DEFAULT NULL,
ADD COLUMN theme TEXT DEFAULT NULL;
```

| Column | Type | Description |
|--------|------|-------------|
| `sponsored_by` | TEXT | Vendor/sponsor name (e.g., "Stickmen Brewing", "Rugged Winery") |
| `theme` | TEXT | Special theme name (e.g., "Valentine's Day Special", "St. Patrick's Day") |

---

### Admin Form Updates

Add new input fields in the Event Form for Bingo and Trivia events:

```text
┌─────────────────────────────────────────────────────────────────┐
│  Event Form                                                     │
├─────────────────────────────────────────────────────────────────┤
│  Event Title: [Bingo Night                              ]       │
│  Date & Time: [2026-02-12 18:00                        ]       │
│  Event Type:  [Game Night ▼]                                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Sponsorship & Theme (Optional)                         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Sponsored By: [Stickmen Brewing              ]         │   │
│  │  Hint: Brewery, winery, or vendor sponsoring this event │   │
│  │                                                         │   │
│  │  Theme: [Valentine's Day Special              ]         │   │
│  │  Hint: Special theme for this event                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Description: [Join us for Bingo Night!                 ]       │
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

### Public Calendar Display

When a user views an event on the public calendar, sponsor/theme info appears below the title:

**Without Sponsor/Theme (current behavior):**
```text
┌─────────────────────────────────────────────────────────────────┐
│  Bingo Night                                                    │
│  6:00 PM PT • Game Night                                        │
│  Bingo with a twist—hosted by local breweries...                │
└─────────────────────────────────────────────────────────────────┘
```

**With Sponsor:**
```text
┌─────────────────────────────────────────────────────────────────┐
│  Bingo Night                                                    │
│  🍺 Sponsored by Stickmen Brewing                               │
│  6:00 PM PT • Game Night                                        │
│  Bingo with a twist—hosted by local breweries...                │
└─────────────────────────────────────────────────────────────────┘
```

**With Theme:**
```text
┌─────────────────────────────────────────────────────────────────┐
│  Bingo Night                                                    │
│  💕 Valentine's Day Special                                     │
│  6:00 PM PT • Game Night                                        │
│  Bingo with a twist—hosted by local breweries...                │
└─────────────────────────────────────────────────────────────────┘
```

**With Both:**
```text
┌─────────────────────────────────────────────────────────────────┐
│  Bingo Night                                                    │
│  🍺 Sponsored by Stickmen Brewing                               │
│  💕 Valentine's Day Special                                     │
│  6:00 PM PT • Game Night                                        │
│  Bingo with a twist—hosted by local breweries...                │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation Details

#### 1. Database Migration

**New columns for events table:**
- `sponsored_by` - nullable text field for vendor name
- `theme` - nullable text field for theme name

#### 2. Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/EventForm.tsx` | Add sponsored_by and theme input fields to the form schema and UI |
| `src/components/ui/calendar-with-event-slots.tsx` | Display sponsor and theme info when present on an event |
| `src/components/admin/EventCalendarAdmin.tsx` | Show sponsor/theme badges in admin event cards |

#### 3. EventForm.tsx Changes

**Update form schema:**
```typescript
const eventFormSchema = z.object({
  // ... existing fields
  sponsored_by: z.string().optional(),
  theme: z.string().optional(),
});
```

**Add new form fields:**
```typescript
<FormField
  control={form.control}
  name="sponsored_by"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Sponsored By</FormLabel>
      <FormControl>
        <Input placeholder="e.g., Stickmen Brewing" {...field} />
      </FormControl>
      <FormDescription>
        Brewery, winery, or vendor sponsoring this event (optional)
      </FormDescription>
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="theme"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Theme</FormLabel>
      <FormControl>
        <Input placeholder="e.g., Valentine's Day Special" {...field} />
      </FormControl>
      <FormDescription>
        Special theme for this event (optional)
      </FormDescription>
    </FormItem>
  )}
/>
```

#### 4. calendar-with-event-slots.tsx Changes

**Update event display:**
```typescript
<div className="flex-1 min-w-0">
  <div className="font-medium">{event.event_title}</div>
  
  {/* NEW: Sponsored By */}
  {event.sponsored_by && (
    <div className="text-primary text-xs font-medium">
      🍺 Sponsored by {event.sponsored_by}
    </div>
  )}
  
  {/* NEW: Theme */}
  {event.theme && (
    <div className="text-accent-foreground text-xs font-medium">
      ✨ {event.theme}
    </div>
  )}
  
  <div className="text-muted-foreground text-xs">
    {formatEventTime(event.event_date)} • {event.event_type}
  </div>
</div>
```

---

### Use Case Example

**Scenario:** The owners have 30 different vendors wanting to sponsor Bingo nights throughout the year.

1. **Setup:**
   - Create individual Bingo Night events for each Wednesday
   - Each event has its own date in the database

2. **Assigning Sponsors:**
   - Open Event Form for "Bingo Night - Jan 15"
   - Enter "Stickmen Brewing" in Sponsored By field
   - Save

3. **Assigning Themes:**
   - Open Event Form for "Bingo Night - Feb 12"
   - Enter "Valentine's Day Special" in Theme field
   - Enter "Local Winery" in Sponsored By field
   - Save

4. **Result:**
   - Each Bingo Night displays its unique sponsor/theme
   - Events without sponsors show normal display
   - Public calendar shows the extra info when available

---

### Technical Notes

- Both fields are optional and nullable
- Display only changes when fields have non-empty values
- Works with existing event duplication workflow
- No changes needed to the recurring events logic
- TypeScript types will auto-update after migration
