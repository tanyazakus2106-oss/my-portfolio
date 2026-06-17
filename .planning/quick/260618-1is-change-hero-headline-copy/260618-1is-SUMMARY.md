---
quick_id: 260618-1is
slug: change-hero-headline-copy
description: Change hero headline copy
date: 2026-06-17
status: complete
commit: 5f3c5f1
---

# Quick Task 260618-1is: Change hero headline copy — Summary

## What changed

Updated the homepage hero headline (`headlineText` constant in `src/pages/index.astro`).

**Before:**
> Designing humanist AI experiences

**After:**
> Designing clarity into complex software products

## Files touched

- `src/pages/index.astro` — single-line string constant swap.

## Why it was a one-line change

`headlineText` is the single source of truth: it renders directly and feeds `headlineWordsList = headlineText.split(" ")`, which drives the per-word hero entrance animation. No markup or animation code needed editing.

## Verification

- `npm run typecheck` → 0 errors.
- `npx prettier --check src/pages/index.astro` → clean.

## Commit

- `5f3c5f1` — feat(quick-260618-1is): change hero headline copy
