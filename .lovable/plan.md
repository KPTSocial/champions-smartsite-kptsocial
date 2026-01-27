

## Searchable Category Input for PDF Menu Upload

### Overview
Replace the current static dropdown in the PDF upload dialog's "category" step with a searchable combobox that allows users to type to filter and find categories quickly. This makes it much easier to locate the correct category, especially when there are many options.

---

### Current Behavior

The category selection step (Step 2) uses a basic `<Select>` dropdown:

```text
┌─────────────────────────────────────────────┐
│  Select Target Category                     │
│  ┌───────────────────────────────────────┐  │
│  │ Select a category              ▼      │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

Users must scroll through all categories to find the one they want.

---

### Proposed Behavior

Replace with a searchable combobox using `cmdk` (Command):

```text
┌─────────────────────────────────────────────┐
│  Select Target Category                     │
│  ┌───────────────────────────────────────┐  │
│  │ 🔍 Type to search categories...       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ Main Menu                             │  │
│  │   ○ Shareables                        │  │
│  │   ○ Salads & Wraps                    │  │
│  │   ○ Full Plates                       │  │
│  │ Current Specials                      │  │
│  │   ● Monthly Specials                  │  │
│  │ Happy Hour                            │  │
│  │   ○ Happy Hour                        │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Features:**
- Type to filter categories instantly
- Categories grouped by section (Main Menu, Current Specials, etc.)
- Shows selected category clearly
- Keyboard navigation support (arrow keys, enter)
- "No results found" message when search doesn't match

---

### Implementation Details

#### File to Modify

**`src/components/admin/PdfMenuUploadDialog.tsx`**

#### Changes

1. **Import combobox components** (lines 1-16):
   - Add imports for `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`
   - Add `Popover`, `PopoverContent`, `PopoverTrigger` (already imported)
   - Add `Check` and `ChevronsUpDown` icons

2. **Add combobox state** (~line 77):
   ```typescript
   const [categorySearchOpen, setCategorySearchOpen] = useState(false);
   ```

3. **Replace category Select with Combobox** (lines 512-540):
   
   Replace the current `<Select>` component with a Popover-based combobox:
   
   ```typescript
   <Popover open={categorySearchOpen} onOpenChange={setCategorySearchOpen}>
     <PopoverTrigger asChild>
       <Button variant="outline" role="combobox" className="w-full justify-between">
         {selectedCategory
           ? categories?.find(c => c.id === selectedCategory)
               ? `${categories.find(c => c.id === selectedCategory)?.section.name} - ${categories.find(c => c.id === selectedCategory)?.name}`
               : "Select a category"
           : "Type to search categories..."}
         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
       </Button>
     </PopoverTrigger>
     <PopoverContent className="w-full p-0">
       <Command>
         <CommandInput placeholder="Search categories..." />
         <CommandList>
           <CommandEmpty>No category found.</CommandEmpty>
           {/* Group categories by section */}
           {Object.entries(groupedCategories).map(([sectionName, cats]) => (
             <CommandGroup key={sectionName} heading={sectionName}>
               {cats.map((category) => (
                 <CommandItem
                   key={category.id}
                   value={`${category.section.name} ${category.name}`}
                   onSelect={() => {
                     setSelectedCategory(category.id);
                     setCategorySearchOpen(false);
                   }}
                 >
                   <Check className={cn(
                     "mr-2 h-4 w-4",
                     selectedCategory === category.id ? "opacity-100" : "opacity-0"
                   )} />
                   {category.name}
                 </CommandItem>
               ))}
             </CommandGroup>
           ))}
         </CommandList>
       </Command>
     </PopoverContent>
   </Popover>
   ```

4. **Add grouping helper** (~line 150):
   ```typescript
   // Group categories by section for better organization
   const groupedCategories = categories?.reduce((acc, category) => {
     const sectionName = category.section.name;
     if (!acc[sectionName]) {
       acc[sectionName] = [];
     }
     acc[sectionName].push(category);
     return acc;
   }, {} as Record<string, MenuCategory[]>) || {};
   ```

---

### Visual Comparison

**Before:**
```text
┌─────────────────────────────────┐
│ Main Menu - Shareables      ▼  │
└─────────────────────────────────┘
(Must scroll through long list)
```

**After:**
```text
┌─────────────────────────────────┐
│ 🔍 Type "monthly"...            │
├─────────────────────────────────┤
│ Current Specials                │
│   ✓ Monthly Specials            │
└─────────────────────────────────┘
(Instantly filtered results)
```

---

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/PdfMenuUploadDialog.tsx` | Replace Select with searchable Combobox |

---

### Benefits

1. **Faster category selection** - Type a few characters to find the right category
2. **Better organization** - Categories grouped by section name
3. **Keyboard-friendly** - Full keyboard navigation support
4. **Familiar UX** - Same pattern used in many modern apps

---

### No Database Changes Required

This is a frontend-only UI enhancement.

