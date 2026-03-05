

# Plan: Scope Bulk Publish to Same Sport/Team Only

## Problem
The current "Publish All" button publishes every draft event at once, regardless of type. The user wants bulk publish restricted to sporting team schedules, grouped by team name (e.g., publish all Thorns drafts, or all Timbers drafts — not everything at once).

## Approach

### Changes to `EventCalendarAdmin.tsx`

1. **Group draft events by `event_title` pattern or `event_type`**: Instead of one "Publish All" button, group the draft events by their sport/team. The `event_title` already contains the team name (e.g., "Thorns vs.", "Timbers vs.", "Blazers vs."). We can extract the team name from the title or use `parent_event_id` / `event_type` to group.

2. **Replace the single "Publish All" button** with per-team "Publish All [Team Name]" buttons. For example:
   - "Publish All Thorns (12)" 
   - "Publish All Timbers (17)"
   - "Publish All Blazers (22)"

3. **Detection logic**: Group drafts by checking the event title against known team keywords (Thorns, Timbers, Blazers, Fire, World Cup, etc.) or by using the `event_type` field. Since sporting events use `event_type` values like `'Game Night'` which may overlap with non-sport events, the most reliable approach is to match team names from the title. Events that don't match any team get excluded from bulk publish (they can still be published individually).

4. **Update the confirmation dialog** to show which team's events are being published and how many.

### Implementation Detail

In `EventCalendarAdmin.tsx`:
- Create a helper that groups `filteredStatusEvents` by detected team name
- Render a "Publish All [Team] (count)" button for each team group that has draft events
- Each button triggers the bulk publish confirmation with only that team's event IDs
- Non-sport draft events retain individual publish buttons but no bulk option

### Files to Modify
- `src/components/admin/EventCalendarAdmin.tsx` — Replace single "Publish All" with per-team grouped bulk publish buttons and update the confirmation dialog to be team-aware

No new files or database changes needed.

