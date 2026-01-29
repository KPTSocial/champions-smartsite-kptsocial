

## Fix iOS Menu Downloads with "Open in New Tab" Behavior

### The Problem

The current download implementation uses `fetch()` + `createObjectURL()` + programmatic `<a>` click, which has known issues on iOS Safari and other iOS browsers:

1. **iOS Safari blocks programmatic blob downloads** - The `download` attribute on dynamically created links doesn't work reliably
2. **CORS restrictions on iOS** - Fetching files can trigger CORS issues that don't occur on desktop
3. **User leaves the page** - Downloads replace the current page instead of opening in a new tab

### Solution Overview

Replace the complex blob-based download with a simpler, more iOS-compatible approach:
1. **Use a direct link with `target="_blank"`** to open files in a new tab
2. **Detect iOS devices** and use `window.open()` as a fallback
3. **Keep users on the menu page** while the file opens in a new tab

---

### Current Implementation

```typescript
// Current approach - problematic on iOS
const handleDownload = async () => {
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = downloadName;  // ❌ Doesn't work on iOS
  link.click();
};
```

**Issues:**
- `download` attribute is ignored on iOS Safari
- Blob URLs may not open correctly
- User navigates away from menu page

---

### New Implementation

```typescript
// iOS-compatible approach with new tab
const handleDownload = () => {
  const fileUrl = isLocalFile 
    ? `/menus/${encodeURIComponent(fileName)}`
    : `https://supabase.../menu-pdfs/${encodeURIComponent(fileName)}`;
  
  // Open in new tab - works on all platforms including iOS
  window.open(fileUrl, '_blank', 'noopener,noreferrer');
  
  toast({
    title: "Opening menu",
    description: "Your menu is opening in a new tab...",
  });
};
```

**Benefits:**
- Works on iOS Safari, Chrome, and Firefox
- User stays on the menu page
- File opens in new tab for viewing/saving
- Native iOS share sheet can be used to save the file

---

### Implementation Details

#### Files to Modify

| File | Changes |
|------|---------|
| `src/components/MenuDownloadLink.tsx` | Replace blob download with `window.open()` |
| `src/components/MenuPdfDownloadButton.tsx` | Replace blob download with `window.open()` |

#### MenuDownloadLink.tsx Changes

**Before (lines 17-47):**
```typescript
const handleDownload = async () => {
  try {
    const fileUrl = isLocalFile 
      ? `/menus/${encodeURIComponent(fileName)}`
      : `https://.../${encodeURIComponent(fileName)}`;
    
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to download file");
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({ ... });
  } catch (error) { ... }
};
```

**After:**
```typescript
const handleDownload = () => {
  const fileUrl = isLocalFile 
    ? `${window.location.origin}/menus/${encodeURIComponent(fileName)}`
    : `https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/menu-pdfs/${encodeURIComponent(fileName)}`;
  
  // Open in new tab - works on all devices including iOS
  const newWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer');
  
  if (newWindow) {
    toast({
      title: "Opening menu",
      description: "Your menu is opening in a new tab.",
    });
  } else {
    // Fallback if popup blocked - use direct navigation
    toast({
      title: "Opening menu",
      description: "If the menu doesn't open, please allow popups for this site.",
    });
    // Alternative: create a visible link for manual click
    window.location.href = fileUrl;
  }
};
```

#### MenuPdfDownloadButton.tsx Changes

Apply the same `window.open()` approach to this component.

---

### Why This Works on iOS

1. **`window.open()` with `_blank`** - iOS Safari allows this for user-initiated actions
2. **Direct file URL** - No CORS issues, no blob conversion needed
3. **Native handling** - iOS displays PDFs natively with share/save options
4. **Image files** - Open in new tab where users can long-press to save

---

### User Experience

**Desktop:**
```text
User clicks "Download Main Menu"
    → New tab opens with PDF
    → Browser shows PDF with download option
    → User can return to menu page in original tab
```

**iOS Safari:**
```text
User taps "Download Main Menu"
    → New tab opens with PDF in native viewer
    → iOS share button allows "Save to Files" or "Save Image"
    → User returns to menu page by switching tabs
```

---

### Visual Comparison

**Before (iOS):**
```text
┌─────────────────────────────────────┐
│  Download Main Menu                  │
│         ↓                            │
│  [Nothing happens / Page replaced]   │
└─────────────────────────────────────┘
```

**After (iOS):**
```text
┌─────────────────────────────────────┐
│  Download Main Menu                  │
│         ↓                            │
│  ┌─────────────────┐  ┌────────────┐│
│  │ Menu Page (tab1)│  │ PDF (tab2) ││
│  │ (stays open)    │  │ (new tab)  ││
│  └─────────────────┘  └────────────┘│
│                       ↳ Save to Files│
└─────────────────────────────────────┘
```

---

### Toast Message Updates

| Action | Old Message | New Message |
|--------|-------------|-------------|
| Success | "Download started" | "Opening menu" |
| Description | "Your menu is downloading..." | "Your menu is opening in a new tab." |
| Fallback | - | "If the menu doesn't open, please allow popups for this site." |

---

### No Database Changes Required

This is a frontend-only fix that changes how download links behave.

