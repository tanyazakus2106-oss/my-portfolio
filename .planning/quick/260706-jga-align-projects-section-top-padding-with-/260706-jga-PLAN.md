---
quick_id: 260706-jga
title: Align Projects section top padding with card gap via --spacing-rhythm token
status: complete
date: 2026-07-06
---

# Quick Task 260706-jga — Align section top padding with card gap

## Goal

Make the Work (home) page "Projects" section TOP padding equal the inter-card
gap, and keep them aligned by promoting the shared value to a token.

## Context

- Prior task `260706-j1c` set the card gap to an inline
  `clamp(64px,40px+6.39vw,112px)`. This is its second usage (now section top
  padding too), so it graduates to a named `@theme` token per repo convention
  ("spacing lives in @theme, don't hardcode literals in components").
- `--spacing-section` (clamp → 132px) was used only on `index.astro:89`
  (pt + pb).

## Tasks

1. **global.css @theme:** add
   `--spacing-rhythm: clamp(64px, 40px + 6.39vw, 112px);` (comment noting it's
   the work-section rhythm, tighter than --spacing-section).
2. **index.astro:89:** `pt-[var(--spacing-section)]` → `pt-[var(--spacing-rhythm)]`;
   KEEP `pb-[var(--spacing-section)]` (bottom stays 132px) and `scroll-mt-20`.
3. **index.astro:97:** card gap `gap-[clamp(64px,40px+6.39vw,112px)]` →
   `gap-[var(--spacing-rhythm)]` (same value, now via token — DRY).

## Result

- Section top padding + card gap both reference `--spacing-rhythm` (up to 112px)
  → structurally aligned, single source of truth.
- Section bottom padding unchanged: `--spacing-section` (132px).
- Note: section is now vertically asymmetric (top 112 / bottom 132) — deliberate
  per the "top padding" scope; offered to align bottom separately.

## Verify

- `npm run build`: dist CSS has valid `--spacing-rhythm:clamp(64px, 40px + 6.39vw, 112px)`
  and both `padding-top:var(--spacing-rhythm)` + `gap:var(--spacing-rhythm)`.
- `npm run typecheck`: 0 errors.
- HOLD before commit — owner approval required.
