# Phase 1 Launch Build: Demo Notes

## Overview
This branch (`feature/phase-1-launch-build`) demonstrates a **static-first architectural approach**. 

By decoupling the site's critical content (Menu, Specials, Events) from the live Supabase database, we achieve:
1.  **Zero-Latency Loads**: Content is bundled at build time. No loading spinners.
2.  **Unbreakable Reliability**: The site functions perfectly even if the database is down API keys expire.
3.  **Simplified Maintenance**: Updates are made via simple file edits (JSON/Markdown), which can be managed via a CMS later if desired.

## Key Changes
-   **Menu System**: Now reads from `src/data/menu.json`.
-   **Events Calendar**: Sources from `src/data/events.json`.
-   **Specials**: Renders markdown from `src/content/specials.md`.
-   **Dependencies**: Explicit Supabase dependency removed for these public-facing pages.

## Verification
1.  Navigate to `/menu` -> Loads instantly from local JSON.
2.  Navigate to `/happenings` -> Shows "Weekly Specials" rendered from Markdown.
3.  `npm run dev` works without any Supabase environment variables configured.
