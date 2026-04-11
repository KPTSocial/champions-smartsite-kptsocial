

# Plan: Fix PDF Menu Upload Errors

## Problem
Champions is getting a "format not correct" error when uploading a PDF of spring/summer cocktail items. The upload feature exists and accepts PDFs, but the processing pipeline has technical bottlenecks that cause failures.

## Root Causes
1. **Oversized payloads** — PDF pages are rendered at 2x scale as uncompressed PNG base64 (~2-5MB per page). Multi-page PDFs exceed the Supabase Edge Function ~6MB request body limit.
2. **No image compression** — `canvas.toDataURL('image/png')` produces the largest possible output.
3. **pdfjs-dist worker version** — Hardcoded CDN URL `4.0.379` must exactly match the installed npm version or PDF rendering silently fails.
4. **Vague error messages** — Users see generic "Could not process files" instead of actionable feedback.

## Changes

### 1. `src/components/admin/PdfMenuUploadDialog.tsx`
- Change `convertPdfPageToImage` to use JPEG at 0.7 quality and scale 1.5 instead of PNG at scale 2.0
- Add batch processing: send images to the edge function in groups of 2 pages, merge results client-side
- Dynamically set the pdfjs worker URL from the installed package version
- Add specific error messages for payload-too-large and PDF parsing failures

### 2. `src/components/admin/MainMenuUploadWizard.tsx`
- Same compression fix: JPEG 0.7 quality, scale 1.5
- Same batch processing logic (2 pages per request)
- Same dynamic pdfjs worker version alignment
- Same improved error messages

### 3. `supabase/functions/parse-menu-pdf/index.ts`
- Add `section` field to the OpenAI prompt so items are returned with their section header (e.g., "Seasonal Cocktails") — the MainMenuUploadWizard already expects this field but the prompt doesn't request it
- No other changes needed

## Technical Details

**Image compression (both files):**
```typescript
// Before
const viewport = page.getViewport({ scale: 2.0 });
return canvas.toDataURL('image/png');

// After
const viewport = page.getViewport({ scale: 1.5 });
return canvas.toDataURL('image/jpeg', 0.7);
```

**Batch processing (both files):**
```typescript
const BATCH_SIZE = 2;
const allItems = [];
for (let i = 0; i < pageImages.length; i += BATCH_SIZE) {
  const batch = pageImages.slice(i, i + BATCH_SIZE);
  const { data } = await supabase.functions.invoke('parse-menu-pdf', {
    body: { images: batch }
  });
  allItems.push(...(data?.items || []));
}
```

**Worker version fix:**
```typescript
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();
```

## Summary

| File | Change |
|------|--------|
| `PdfMenuUploadDialog.tsx` | JPEG compression, batching, worker fix, better errors |
| `MainMenuUploadWizard.tsx` | Same fixes |
| `parse-menu-pdf/index.ts` | Add `section` to prompt |

