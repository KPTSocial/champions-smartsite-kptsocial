

## Add Portland Fire (WNBA) Team Support

### Overview
Add WNBA as a new event type category and include the Portland Fire as a pre-configured team in the Season Schedule Uploader feature.

---

### Changes Required

#### 1. Database Migration - Add WNBA to Event Type Enum

```sql
ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'WNBA';
```

This adds WNBA alongside the existing categories:
- Live Music, Game Night, Specials
- NCAA FB, Soccer
- NBA, MLS, NWSL, Olympics, World Cup
- **WNBA** (new)

#### 2. Update EventForm.tsx - Add WNBA Option

Update the Zod schema and dropdown selects to include WNBA:

```text
Current enum in EventForm.tsx (line 31):
['Live Music', 'Game Night', 'Specials', 'Soccer', 'NCAA FB', 
 'NBA', 'MLS', 'NWSL', 'Olympics', 'World Cup']

Updated to include:
['Live Music', 'Game Night', 'Specials', 'Soccer', 'NCAA FB', 
 'NBA', 'WNBA', 'MLS', 'NWSL', 'Olympics', 'World Cup']
```

Also update:
- Mobile dropdown (around line 395-406)
- Desktop dropdown (need to locate in file)

#### 3. Update Team Schedules Table Seed Data

Add Portland Fire to the pre-configured teams:

```sql
INSERT INTO team_schedules (team_name, event_type, default_image_url) VALUES
('Portland Fire', 'WNBA', NULL);
```

---

### Complete Team List After Update

| Team | League | Notes |
|------|--------|-------|
| Portland Trail Blazers | NBA | Existing |
| **Portland Fire** | **WNBA** | **New - Inaugural 2026 Season** |
| Portland Timbers | MLS | Existing |
| Portland Thorns | NWSL | Existing |
| Oregon Ducks | NCAA FB | Existing |
| Oregon State Beavers | NCAA FB | Existing |

---

### Files to Modify

| File | Change |
|------|--------|
| `supabase/migrations/...` | Add WNBA to event_type enum |
| `src/components/admin/EventForm.tsx` | Add WNBA to Zod schema + dropdowns |
| `src/integrations/supabase/types.ts` | Auto-regenerated after migration |
| `supabase/migrations/...` (team_schedules) | Include Portland Fire in seed data |

---

### Implementation Note

The Season Schedule Uploader component (from the previous plan) will automatically support WNBA/Portland Fire once:
1. The WNBA enum value is added to the database
2. Portland Fire is inserted into the team_schedules table

This ensures the Portland Fire appears as a selectable team when uploading their inaugural 2026 season schedule.

