

## Add Drag-and-Drop Reordering for Menu Items

### Overview
Add drag-and-drop functionality to the Menu Items manager so users can easily reorder items within a category by dragging them to their desired position. This follows the same pattern already implemented for menu categories.

---

### Current Behavior

Menu items are displayed in a flat grid/list filtered by search and category, with no ability to reorder:

```text
┌─────────────────────────────────────────────────────────────┐
│  Menu Items                              [Add Menu Item]    │
├─────────────────────────────────────────────────────────────┤
│  🔍 Search...                    [Category Filter ▼]        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Buffalo Wings                            $13.00     │    │
│  │ Shareables                    [👁️] [✏️] [🗑️]        │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Basket of Fries                          $8.00      │    │
│  │ Shareables                    [👁️] [✏️] [🗑️]        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

### Proposed Behavior

Add a drag handle and group items by category when a specific category is selected:

```text
┌─────────────────────────────────────────────────────────────┐
│  Menu Items                              [Add Menu Item]    │
├─────────────────────────────────────────────────────────────┤
│  🔍 Search...                    [Shareables ▼]             │
├─────────────────────────────────────────────────────────────┤
│  📂 Shareables (drag to reorder)                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ⋮⋮ Basket of Fries                       $8.00      │ ←─ drag handle
│  │    Cajun seasoning available  [👁️] [✏️] [🗑️]        │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ⋮⋮ Buffalo Wings                         $13.00     │    │
│  │    Served with ranch          [👁️] [✏️] [🗑️]        │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ⋮⋮ Onion Rings                           $12.00     │    │
│  │                               [👁️] [✏️] [🗑️]        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Drag handle (grip icon) on the left side of each item
- Items grouped by category with droppable zones
- Visual feedback when dragging (shadow, opacity)
- Automatic sort_order update in database after drop
- Works when viewing "All Categories" (grouped sections) or a single category

---

### Implementation Details

#### File to Modify

**`src/components/admin/MenuItemManager.tsx`**

#### Changes

1. **Add imports** (line 14):
   ```typescript
   import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
   import { GripVertical } from 'lucide-react';
   ```

2. **Add reorder mutation** (~line 173):
   ```typescript
   const reorderMutation = useMutation({
     mutationFn: async (updates: { id: string; sort_order: number }[]) => {
       for (const update of updates) {
         const { error } = await supabase
           .from('menu_items')
           .update({ sort_order: update.sort_order })
           .eq('id', update.id);
         
         if (error) throw error;
       }
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['menu-items'] });
       queryClient.invalidateQueries({ queryKey: ['menuData'] });
       toast.success('Items reordered successfully');
     },
     onError: (error: any) => {
       toast.error(`Error reordering items: ${error.message}`);
     }
   });
   ```

3. **Add drag end handler** (~line 260):
   ```typescript
   const handleDragEnd = (result: DropResult) => {
     const { destination, source } = result;

     if (!destination || 
         (destination.droppableId === source.droppableId && 
          destination.index === source.index)) {
       return;
     }

     // Only allow reordering within the same category
     if (destination.droppableId !== source.droppableId) {
       toast.error('Items can only be reordered within the same category');
       return;
     }

     const categoryId = source.droppableId;
     const categoryItems = filteredItems?.filter(
       item => item.category_id === categoryId
     ) || [];
     
     const reordered = Array.from(categoryItems);
     const [movedItem] = reordered.splice(source.index, 1);
     reordered.splice(destination.index, 0, movedItem);

     const updates = reordered.map((item, index) => ({
       id: item.id,
       sort_order: index + 1
     }));

     reorderMutation.mutate(updates);
   };
   ```

4. **Group items by category** (~line 260):
   ```typescript
   const itemsByCategory = filteredItems?.reduce((acc, item) => {
     const categoryId = item.category_id;
     if (!acc[categoryId]) {
       acc[categoryId] = [];
     }
     acc[categoryId].push(item);
     return acc;
   }, {} as Record<string, MenuItem[]>) || {};
   ```

5. **Replace items grid with DragDropContext** (lines 483-566):
   Wrap the items display in a `DragDropContext` with `Droppable` zones per category and `Draggable` items:

   ```typescript
   <DragDropContext onDragEnd={handleDragEnd}>
     <div className="space-y-6">
       {Object.entries(itemsByCategory).map(([categoryId, categoryItems]) => {
         const categoryInfo = categories?.find(c => c.id === categoryId);
         return (
           <div key={categoryId}>
             <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
               {categoryInfo?.section.name} - {categoryInfo?.name}
             </h3>
             <Droppable droppableId={categoryId}>
               {(provided, snapshot) => (
                 <div
                   ref={provided.innerRef}
                   {...provided.droppableProps}
                   className={`grid gap-4 min-h-[50px] rounded-lg transition-colors ${
                     snapshot.isDraggingOver ? 'bg-accent/50' : ''
                   }`}
                 >
                   {categoryItems.map((item, index) => (
                     <Draggable key={item.id} draggableId={item.id} index={index}>
                       {(provided, snapshot) => (
                         <Card
                           ref={provided.innerRef}
                           {...provided.draggableProps}
                           className={`${!item.is_available ? 'opacity-60' : ''} ${
                             snapshot.isDragging ? 'shadow-lg opacity-90' : ''
                           }`}
                         >
                           <CardHeader>
                             <div className="flex items-start justify-between">
                               <div className="flex items-start gap-2">
                                 <div
                                   {...provided.dragHandleProps}
                                   className="cursor-grab active:cursor-grabbing mt-1"
                                 >
                                   <GripVertical className="h-4 w-4 text-muted-foreground" />
                                 </div>
                                 {/* ... rest of item content ... */}
                               </div>
                               {/* ... action buttons ... */}
                             </div>
                           </CardHeader>
                         </Card>
                       )}
                     </Draggable>
                   ))}
                   {provided.placeholder}
                 </div>
               )}
             </Droppable>
           </div>
         );
       })}
     </div>
   </DragDropContext>
   ```

---

### Visual Guide

```text
BEFORE (flat list):
┌──────────────────────────┐
│ Buffalo Wings     $13.00 │
│ Basket of Fries    $8.00 │
│ Onion Rings       $12.00 │
│ Caesar Salad      $10.50 │  ← Different category mixed in
└──────────────────────────┘

AFTER (grouped with drag):
┌──────────────────────────┐
│ 📂 Shareables            │
│ ├─ ⋮⋮ Basket of Fries    │  ← Drag up/down
│ ├─ ⋮⋮ Buffalo Wings      │
│ └─ ⋮⋮ Onion Rings        │
│                          │
│ 📂 Salads & Wraps        │
│ └─ ⋮⋮ Caesar Salad       │
└──────────────────────────┘
```

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/MenuItemManager.tsx` | Add DnD imports, reorder mutation, drag handler, group items by category, wrap in DragDropContext |

---

### Technical Notes

- Uses existing `@hello-pangea/dnd` library (already installed and used for categories)
- Follows exact same pattern as `MenuCategoryManager.tsx`
- Items are sorted by `sort_order` field in database (already exists)
- Drag-and-drop only works within the same category (no cross-category moves)
- Visual feedback: shadow on drag, highlight on drop zone
- Search filter still works - just filters which items appear in each category group

---

### No Database Changes Required

The `menu_items` table already has a `sort_order` column that this feature will update.

