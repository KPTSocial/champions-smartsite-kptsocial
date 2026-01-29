

## Add Paginated Events List for Draft/Cancelled/Archived Status Filters

### Overview
When the admin selects "Draft", "Cancelled", or "Archived" from the status filter dropdown, display a paginated list of those events in the right sidebar, positioned between the selected date's event card and the Status Guide card. This makes it easy to find and manage events in these statuses without scrolling through the calendar month by month.

---

### Current Layout

```text
┌─────────────────────────────────────────────────────────────────┐
│  [Status ▼] [Type ▼] [Location ▼] [Date ▼]    [Calendar] [List] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────┐  ┌───────────────────────┐ │
│  │                                 │  │ Wed, Jan 29, 2026     │ │
│  │        Events Calendar          │  │                       │ │
│  │       (with date picker)        │  │ No events for today   │ │
│  │                                 │  │                       │ │
│  │                                 │  └───────────────────────┘ │
│  │                                 │                            │
│  │     [Create New Event]          │  ┌───────────────────────┐ │
│  │                                 │  │ Status Guide          │ │
│  └─────────────────────────────────┘  │ • Published           │ │
│                                       │ • Draft               │ │
│                                       │ • Cancelled           │ │
│                                       └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

### Proposed Layout (when Draft/Cancelled/Archived filter is active)

```text
┌─────────────────────────────────────────────────────────────────┐
│  [Draft ▼] [Type ▼] [Location ▼] [Date ▼]     [Calendar] [List] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────┐  ┌───────────────────────┐ │
│  │                                 │  │ Wed, Jan 29, 2026     │ │
│  │        Events Calendar          │  │ No events for today   │ │
│  │       (with date picker)        │  └───────────────────────┘ │
│  │                                 │                            │
│  │                                 │  ┌───────────────────────┐ │
│  │                                 │  │ Draft Events (34)     │ │
│  │     [Create New Event]          │  ├───────────────────────┤ │
│  │                                 │  │ Trivia Night          │ │
│  └─────────────────────────────────┘  │ Jan 15 • Game Night   │ │
│                                       │ [Edit] [Publish] [Del]│ │
│                                       ├───────────────────────┤ │
│                                       │ Super Bowl Party      │ │
│                                       │ Feb 9 • Specials      │ │
│                                       │ [Edit] [Publish] [Del]│ │
│                                       ├───────────────────────┤ │
│                                       │ ... 8 more items ...  │ │
│                                       ├───────────────────────┤ │
│                                       │  ◀ Page 1 of 4  ▶     │ │
│                                       └───────────────────────┘ │
│                                                                 │
│                                       ┌───────────────────────┐ │
│                                       │ Status Guide          │ │
│                                       └───────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

### Features

1. **Conditional Display**: Only shows when filter is set to `draft`, `cancelled`, or `archived`
2. **Paginated List**: 10 events per page with page navigation
3. **Event Cards**: Each event shows:
   - Title
   - Date and event type
   - Action buttons (Edit, Publish for drafts, Delete)
4. **Page Controls**: Shows "Page X of Y" with previous/next buttons
5. **Empty State**: Message when no events match the filter

---

### Implementation Details

#### File to Modify

**`src/components/admin/EventCalendarAdmin.tsx`**

#### Changes

1. **Add new props** to receive filter status and event handlers:
   ```typescript
   interface EventCalendarAdminProps {
     events: Event[];
     onEditEvent: (event: Event) => void;
     onDeleteEvent: (eventId: string) => void;
     onPublishEvent: (eventId: string) => void;
     onCreateEvent: () => void;
     statusFilter?: string; // NEW: current status filter value
   }
   ```

2. **Add pagination state** inside the component:
   ```typescript
   const [filteredPage, setFilteredPage] = useState(1);
   const ITEMS_PER_PAGE = 10;
   ```

3. **Reset page when filter changes**:
   ```typescript
   useEffect(() => {
     setFilteredPage(1);
   }, [statusFilter]);
   ```

4. **Calculate filtered events list**:
   ```typescript
   const showFilteredList = statusFilter === 'draft' || 
                            statusFilter === 'cancelled' || 
                            statusFilter === 'archived';
   
   const filteredEvents = showFilteredList 
     ? events.filter(e => e.status === statusFilter)
       .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
     : [];
   
   const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
   const paginatedEvents = filteredEvents.slice(
     (filteredPage - 1) * ITEMS_PER_PAGE,
     filteredPage * ITEMS_PER_PAGE
   );
   ```

5. **Add the filtered events list card** between the selected date card and Status Guide card:
   ```typescript
   {showFilteredList && (
     <Card>
       <CardHeader className="pb-3">
         <CardTitle className="text-base capitalize flex items-center justify-between">
           <span>{statusFilter} Events ({filteredEvents.length})</span>
         </CardTitle>
       </CardHeader>
       <CardContent className="space-y-3">
         {paginatedEvents.length === 0 ? (
           <p className="text-muted-foreground text-sm text-center py-4">
             No {statusFilter} events found
           </p>
         ) : (
           <>
             {paginatedEvents.map((event) => (
               <div key={event.id} className="p-3 border rounded-lg">
                 <div className="flex items-start justify-between gap-2 mb-2">
                   <h4 className="font-medium text-sm">{event.event_title}</h4>
                   <Badge variant={getStatusVariant(event.status || 'draft')}>
                     {event.status}
                   </Badge>
                 </div>
                 <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                   <span>{format(new Date(event.event_date), 'MMM d, yyyy')}</span>
                   <span>•</span>
                   <span>{event.event_type}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" onClick={() => onEditEvent(event)}>
                     Edit
                   </Button>
                   {event.status === 'draft' && (
                     <Button size="sm" onClick={() => onPublishEvent(event.id)}>
                       Publish
                     </Button>
                   )}
                   <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(event.id)}>
                     Delete
                   </Button>
                 </div>
               </div>
             ))}
             
             {/* Pagination */}
             {totalPages > 1 && (
               <div className="flex items-center justify-center gap-2 pt-3 border-t">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setFilteredPage(p => Math.max(1, p - 1))}
                   disabled={filteredPage === 1}
                 >
                   <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <span className="text-sm text-muted-foreground">
                   Page {filteredPage} of {totalPages}
                 </span>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setFilteredPage(p => Math.min(totalPages, p + 1))}
                   disabled={filteredPage === totalPages}
                 >
                   <ChevronRight className="h-4 w-4" />
                 </Button>
               </div>
             )}
           </>
         )}
       </CardContent>
     </Card>
   )}
   ```

#### File to Modify

**`src/components/admin/EventsDashboard.tsx`**

Pass the status filter to EventCalendarAdmin:
```typescript
<EventCalendarAdmin
  events={events}
  onEditEvent={handleEditEvent}
  onDeleteEvent={handleDeleteEvent}
  onPublishEvent={handlePublishEvent}
  onCreateEvent={handleCreateEvent}
  statusFilter={filters.status}  // NEW
/>
```

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/EventCalendarAdmin.tsx` | Add pagination state, filtered events logic, and new list card UI |
| `src/components/admin/EventsDashboard.tsx` | Pass `filters.status` prop to EventCalendarAdmin |

---

### Pagination Example

For 34 draft events:
- **Page 1**: Events 1-10
- **Page 2**: Events 11-20
- **Page 3**: Events 21-30
- **Page 4**: Events 31-34

```text
┌─────────────────────────────────────┐
│ Draft Events (34)                   │
├─────────────────────────────────────┤
│ • Trivia Night - Jan 15             │
│ • Super Bowl Party - Feb 9          │
│ • ... (8 more)                      │
├─────────────────────────────────────┤
│   [◀]  Page 1 of 4  [▶]             │
└─────────────────────────────────────┘
```

---

### No Database Changes Required

This is a frontend-only feature that uses the existing events data.

