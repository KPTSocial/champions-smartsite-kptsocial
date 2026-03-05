

# Plan: Menu Management Overview Cards

## What We're Building

Replace the current MenuStats overview page with three action cards that provide the owner with clear workflows for managing menus:

1. **Monthly Specials Card** — "Upload Menu Image for Customers" + "Upload New Menu" (parses items from PDF/image, updates pricing/descriptions, saves file for customer download)
2. **Main Menu Card** — "Upload Menu Image for Customers" + "Upload New Menu" (section-by-section verification workflow) + "Upload Bulk Items"
3. Keep the existing stats row above the cards for context

## Card Details

### Card 1: Monthly Specials
- **"Upload Menu Image for Customers"** — Upload a PDF/image that goes straight to Supabase storage (`menu-pdfs` bucket) and updates `site_settings.monthly_specials_url`. No parsing. This is the file customers download.
- **"Upload New Menu"** — Opens the existing `PdfMenuUploadDialog` with `autoMarkAsSpecial=true` to parse items, update pricing/descriptions in the database, AND save the file for customer download.

### Card 2: Main Menu
- **"Upload Menu Image for Customers"** — Upload a PDF/image to storage for customers to download as the main menu. Updates a new `main_menu_url` field in `site_settings`.
- **"Upload New Menu"** — A new **section-by-section verification workflow**:
  1. Upload PDF/image, parse all items via the existing edge function
  2. Group parsed items by detected section headers
  3. Present one section at a time for the owner to review/edit (name, price, description)
  4. Owner confirms each section before moving to the next
  5. After all sections are reviewed, show a final summary for approval
  6. Only after final approval does the data publish to the database
- **"Upload Bulk Items"** — Opens the existing `PdfMenuUploadDialog` without `autoMarkAsSpecial`, letting the owner pick any category and import items directly (the current behavior).

## Technical Approach

### Database Change
Add `main_menu_url` column to `site_settings` table to store the main menu download filename (mirrors how `monthly_specials_url` works).

### New Components
1. **`src/components/admin/MenuOverviewCards.tsx`** — The two cards with action buttons, replacing the stats-only view on the Overview tab.
2. **`src/components/admin/MenuImageUploadDialog.tsx`** — Simple dialog for "Upload Menu Image for Customers" (no parsing, just upload to storage and update `site_settings`). Works for both monthly specials and main menu via a `target` prop.
3. **`src/components/admin/MainMenuUploadWizard.tsx`** — Multi-step wizard dialog for "Upload New Menu" on the Main Menu card with section-by-section review and final approval.

### Modified Components
- **`MenuStats.tsx`** — Integrate the new cards below the existing stats row, or replace the overview content in `MenuDashboard.tsx` to render `MenuOverviewCards` alongside `MenuStats`.
- **`MenuDashboard.tsx`** — Update the overview tab content to include both stats and the new action cards.

### Workflow: Main Menu Section-by-Section Verification
1. **Upload step**: Owner uploads PDF/image
2. **Parse step**: Send to `parse-menu-pdf` edge function (already detects section headers)
3. **Section review step**: Display sections one at a time. For each section:
   - Show section name (editable)
   - Map to existing menu category (searchable combobox)
   - List all items with editable name, price, description, tags
   - "Confirm Section" button to lock it in and move to next
4. **Final review step**: Show all confirmed sections in summary view
   - "Approve & Publish" button to write everything to the database
   - "Back" to revisit any section

### Customer Download Integration
- The main menu page already has `MenuDownloadLink` and `MenuPdfDownloadButton` components
- These will be updated to also check `main_menu_url` from `site_settings` for the main menu download
- Monthly specials download already works via `monthly_specials_url`

## Files to Create
1. `src/components/admin/MenuOverviewCards.tsx`
2. `src/components/admin/MenuImageUploadDialog.tsx`
3. `src/components/admin/MainMenuUploadWizard.tsx`

## Files to Modify
1. `src/components/admin/MenuDashboard.tsx` — Update overview tab content
2. `src/pages/Menu.tsx` — Add main menu download link using `main_menu_url`

## Migration
```sql
ALTER TABLE site_settings ADD COLUMN main_menu_url text;
```

