

# Fix: Incorrect Thorns Game Times on Events Display

## Problem
Both `EventCalendarAdmin.tsx` (admin) and `calendar-with-event-slots.tsx` (public) contain a hardcoded hack that subtracts 3 hours from any event with "thorns" in the title. This was likely added when Thorns games were initially imported with incorrect UTC offsets, but the actual database times are now correct (as confirmed by the Edit Event form showing 7:00 PM).

The hack causes Thorns games to display 3 hours early (e.g., 4:00 PM instead of 7:00 PM).

## Fix
Remove the Thorns-specific time adjustment from both `formatEventTime` functions. The `formatInTimeZone` call with `America/Los_Angeles` already correctly converts UTC to Pacific Time — no manual offset is needed.

### Files to change

**1. `src/components/admin/EventCalendarAdmin.tsx` (lines 83-88)**
Remove the `isThorns` check and 3-hour subtraction. Keep only the standard `formatInTimeZone` conversion.

**2. `src/components/ui/calendar-with-event-slots.tsx` (lines 75-80)**
Same fix — remove the identical Thorns hack.

Both functions will simplify to:
```typescript
const formatEventTime = (dateString: string, eventTitle?: string) => {
  try {
    if (eventTitle && eventTitle.toLowerCase().includes('taco tuesday')) {
      return '11:00 AM - 10:00 PM PT';
    }
    const date = new Date(dateString);
    const timeStr = formatInTimeZone(date, 'America/Los_Angeles', 'h:mm a');
    return timeStr.toUpperCase() + ' PT';
  } catch { return ''; }
};
```

This ensures all sports events (Thorns, Timbers, Blazers, etc.) use the same consistent UTC-to-Pacific conversion with no special-case hacks.

