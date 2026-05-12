---
quick_id: 260512-wpa
description: "fix(about): mobile-only 24px gap above and below the hero image"
date: 2026-05-12
status: complete
commits:
  - d2d217d
files_changed:
  - src/pages/about.astro
---

# Quick Task 260512-wpa — Summary

Two responsive class swaps on the About page to tighten the spacing around the hero image on mobile.

## Change (`d2d217d`)

`src/pages/about.astro` — 2 class strings updated:

1. Hero grid: `gap-[var(--spacing-3xl)]` → `gap-[var(--spacing-lg)] lg:gap-[var(--spacing-3xl)]`
2. "How I work" section: `mt-[var(--spacing-3xl)]` → `mt-[var(--spacing-lg)] lg:mt-[var(--spacing-3xl)]`

## Why not the image wrapper directly

Could have added `my-[var(--spacing-lg)] lg:my-0` on the image div, but that would compound with the existing grid gap (64px + 24px = 88px on mobile). To get a clean 24px total, the gap and mt had to be the things changed. Modifying them is also one fewer DOM element touched.

## Why "Beyond work" stays at 64px mt

The user asked specifically about space around the image. "Beyond work" sits below "How I work" content (paragraphs), not below the image — a section-to-section relationship, not image-adjacent. Leaving it at 64px keeps consistent breathing room between content blocks below the fold.

## Verification

- `npm run typecheck` — 0 errors.
- Manual: pending user visual check on `localhost:4321/about` or after push.
