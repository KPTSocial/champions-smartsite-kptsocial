
# Plan: Fix menu item ordering after PDF import

## Root cause

1. Default import mode is "Update existing" with `clearExisting` off. The upsert (`onConflict: name,category_id`) merges new rows into old ones and assigns `sort_order: 0,1,2…` from the new file, but old items not in the new PDF keep their original sort_order. Many rows end up sharing the same `sort_order`, so the public menu (sorted by `sort_order ASC`) renders them in an unpredictable order.
2. OpenAI doesn't reliably return items in strict top-to-bottom reading order, especially across multi-column layouts and across batches of 2 pages.

## Changes

### 1. `supabase/functions/parse-menu-pdf/index.ts`
- Strengthen the prompt: items must be returned in strict visual top-to-bottom, left-to-right reading order. No alphabetical/price sorting or grouping.
- Have the model emit `position_index` per item (its order within the page).
- Server tags each item with `page_index` (the absolute page number in the upload) before returning.

### 2. `src/components/admin/PdfMenuUploadDialog.tsx`
- After collecting `allItems` from all batches, stable-sort by `(page_index, position_index)` so batch boundaries don't reshuffle order.
- Add up/down arrow buttons on each row in the Review step so the admin can lock final order.
- When `autoMarkAsSpecial` is true (Monthly Specials), default `clearExisting` to `true`. Keep the checkbox visible so the admin can override.
- Write `sort_order` in gaps of 10 (0, 10, 20, 30…) so future single-item moves don't require renumbering everything.
- New optional checkbox: "Reset sort order for this category". When `clearExisting` is false but this is checked, after the upsert run a follow-up update that sets `sort_order` for every existing row in that category by name match against `editedItems` order, with unmatched rows pushed to the end.

### 3. `src/components/admin/MainMenuUploadWizard.tsx`
- Same `(page_index, position_index)` stable sort before grouping into sections.
- Same gap-of-10 sort_order on publish.

### 4. Public display
- `src/services/menuService.ts` already sorts by `sort_order`. No change needed.

## One-time recovery for the menu just uploaded

After deploy: re-open the upload dialog, re-upload the same PDF, check **Replace existing items in selected category**, adjust order in Review if needed, and import. That single clean re-import will overwrite the scrambled rows.
