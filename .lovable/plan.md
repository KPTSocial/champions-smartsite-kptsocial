

# Plan: Fix OpenAI Key Not Refreshing + Surface Real Errors

## Problem
The OPENAI_API_KEY secret was updated, but the edge function still returns a 429 "insufficient_quota" error. Edge Functions cache environment variables and may need redeployment to pick up new secret values. Additionally, the UI shows a vague "No items found" message instead of the actual OpenAI error.

## Changes

### 1. `supabase/functions/parse-menu-pdf/index.ts`
- Add a safe debug log showing the key prefix/suffix (first 4 + last 4 chars) so we can confirm which key is being used
- When OpenAI returns a 429/401/403, include the actual error message in the function response so the client can display it
- Redeploy the function (this also forces it to re-read the updated secret)

### 2. `src/components/admin/PdfMenuUploadDialog.tsx`
- When the edge function response contains an error message from OpenAI (quota, auth), show that specific message in the toast instead of the generic "No items found"

### 3. `src/components/admin/MainMenuUploadWizard.tsx`
- Same error surfacing fix

## Why This Should Work
Redeploying the edge function forces Supabase to reload environment variables, picking up the new OPENAI_API_KEY. The debug log will confirm which key is active. If the key still fails, the admin will now see the actual OpenAI error (e.g., "insufficient_quota") so they can take action.

## Summary

| File | Change |
|------|--------|
| `parse-menu-pdf/index.ts` | Debug log for key prefix, surface OpenAI errors in response, redeploy |
| `PdfMenuUploadDialog.tsx` | Show real error messages from edge function |
| `MainMenuUploadWizard.tsx` | Show real error messages from edge function |

