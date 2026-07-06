---
quick_id: 260706-hm5
title: Match About body typography to tushar.work reference (text-lg leading-relaxed)
status: complete
date: 2026-07-06
commit: 38383fb
---

# Quick Task 260706-hm5 — Summary

## What changed

`src/pages/about.astro` — the About body copy now uses Tailwind's `text-lg` +
`leading-relaxed`, matching the tushar.work/about reference:

- Intro lede `<p>`: `text-[20px] leading-[30px]` → `text-lg leading-relaxed`
  (muted color + `max-w-[600px]` kept).
- Four "How I work" / "Beyond work" body `<p>`: `text-[18px] leading-[1.625]`
  → `text-lg leading-relaxed` (muted color kept).

Prettier reflowed the four body `<p>` tags to single lines (the shorter class
string now fits the print width) — cosmetic, no content change.

## Effect (verified sizes)

- `text-lg` = `1.125rem`, `leading-relaxed` = `1.625` (stock Tailwind v4, not
  overridden in global.css — confirmed).
- With the repo's `16px → 17px` root bump at `min-width: 1200px`:
  - **Intro:** 20px (fixed) → **18px**, ~**19.125px** at ≥1200px; line-height
    30px → 1.625 ratio.
  - **Section bodies:** unchanged below 1200px (18px, lh 1.625) but now
    **rem-scale to ~19.125px** on desktop.
- Both blocks are now the same size (like the reference), and both re-enter the
  site's responsive root-size scaling instead of being locked in px.

## Left untouched (deliberate)

- Section headings `text-[28px] md:text-[32px]` (intentionally larger than the
  reference's `text-2xl md:text-3xl`).
- Hero grid, image `sizes`, `max-w-[600px]` intro cap, all spacing.

## Verification

- `npm run typecheck` (astro check): **0 errors**.
- Grep: 0 old fixed-px body sizes; 5 `text-lg leading-relaxed` (1 intro + 4
  body); 2 headings still `text-[28px] md:text-[32px]`.
- `prettier` on changed file only.
- dev server localhost:4321 (HMR) reflects it live.

## Not committed

Source + docs staged, **not committed** — awaiting owner approval.
