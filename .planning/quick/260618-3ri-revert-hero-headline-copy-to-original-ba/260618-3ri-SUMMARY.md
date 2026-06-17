---
quick_id: 260618-3ri
slug: revert-hero-headline-copy-to-original-ba
description: Revert hero headline copy to original baseline
date: 2026-06-17
status: complete
commit: 00572ab
---

# Quick Task 260618-3ri: Revert hero headline copy to original baseline — Summary

## What changed

Restored the hero headline (`headlineText` in `src/pages/index.astro`) to its original wording.

**Before (from task 260618-1is):**
> Designing clarity into complex software products

**After (original baseline):**
> Designing humanist AI experiences

## Why

A long interactive tuning loop explored many headline copy and title-width variations (all held uncommitted per the user's "don't commit without permission" instruction). The user settled on the original headline wording, so the 260618-1is copy change is reverted.

## History reconciliation

- The orphaned commit `6c7f6f2` (set headline max-width to 620px, quick-id 260618-1mb) was dropped via `git reset --mixed HEAD~1` — it was local-only, had no PLAN/SUMMARY/STATE, and recorded an abandoned value. Its empty stray docs dir was removed.
- The final title width (580px) was already committed in `1d8c4f6` (task 260618-1jh), so no width change remained to commit here — only the copy revert.

## Verification

- `npm run typecheck` → 0 errors.
- `npx prettier --check src/pages/index.astro` → clean.

## Commit

- `00572ab` — revert(quick-260618-3ri): restore original hero headline copy
