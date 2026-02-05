
# Plan: Center Menu Item Titles and Descriptions

## Overview
Update all menu item components to center-align the item names (titles) and descriptions, creating a more elegant and traditional menu appearance per the owner's request.

## Components to Update

### 1. MenuItemDisplay.tsx
The primary menu item component used in `EnhancedMenuCategorySection`.

**Changes:**
- Center the item name heading with `text-center`
- Center the tags/badges row using `justify-center`
- Center the description text with `text-center`
- Center the price display
- Center variant rows

### 2. ModernMenuItem.tsx
Used in `ModernMenuCategory` for an alternate layout.

**Changes:**
- Center the item name heading with `text-center`
- Center the tags section using `justify-center`
- Center the description and inline price with `text-center`
- Center variant pills using `justify-center`

### 3. MenuItemCard.tsx
Card-based layout component.

**Changes:**
- Center the card title content
- Center the card description
- Center the price display

### 4. MenuItemAccordion.tsx
Accordion-style layout component.

**Changes:**
- Center the accordion trigger content
- Center the expanded description and price content

## Technical Details

### MenuItemDisplay Changes
```text
Before: <div className="flex items-start justify-between gap-4">
After:  <div className="flex flex-col items-center text-center">

Before: <h4 className="text-lg font-semibold...">
After:  <h4 className="text-lg font-semibold... text-center">

Before: <p className="text-base text-muted-foreground mt-2 leading-relaxed">
After:  <p className="text-base text-muted-foreground mt-2 leading-relaxed text-center">
```

### ModernMenuItem Changes
```text
Before: <h4 className="text-lg font-semibold text-foreground...">
After:  <h4 className="text-lg font-semibold text-foreground... text-center">

Before: <div className="flex flex-wrap gap-1.5 mt-2">
After:  <div className="flex flex-wrap gap-1.5 mt-2 justify-center">

Before: <p className="text-sm text-muted-foreground leading-relaxed">
After:  <p className="text-sm text-muted-foreground leading-relaxed text-center">
```

## Visual Result
- Item names will be prominently centered
- Tags/badges will appear centered below or inline with names
- Descriptions will flow as centered paragraphs
- Prices will be centered (standalone or after description)
- Variants will display as centered pill groups

## Files Modified
1. `src/components/MenuItemDisplay.tsx`
2. `src/components/ModernMenuItem.tsx`
3. `src/components/MenuItemCard.tsx`
4. `src/components/MenuItemAccordion.tsx`
