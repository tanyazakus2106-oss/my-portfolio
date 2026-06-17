---
quick_id: 260618-1jh
slug: set-hero-headline-max-width-to-580px
description: Set hero headline max-width to 580px
date: 2026-06-17
status: complete
commit: 1d8c4f6
---

# Quick Task 260618-1jh: Set hero headline max-width to 580px — Summary

## What changed

The homepage hero headline `<h1>` max-width: `max-w-[600px]` → `max-w-[580px]` (`src/pages/index.astro`).

## Files touched

- `src/pages/index.astro` — single Tailwind arbitrary-value swap on the headline `<h1>`.

## Result

Headline and subtext now share the same 580px measure, giving the hero a single consistent text column.

## Verification

- `npm run typecheck` → 0 errors.
- `npx prettier --check src/pages/index.astro` → clean.

## Commit

- `1d8c4f6` — style(quick-260618-1jh): set hero headline max-width to 580px
