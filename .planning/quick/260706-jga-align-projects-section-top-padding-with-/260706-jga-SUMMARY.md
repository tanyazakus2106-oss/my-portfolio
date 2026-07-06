---
quick_id: 260706-jga
title: Align Projects section top padding with card gap via --spacing-rhythm token
status: complete
date: 2026-07-06
commit: 6a53521
---

# Quick Task 260706-jga — Summary

## What changed (2 files, +3 / −2)

- **global.css:** added `--spacing-rhythm: clamp(64px, 40px + 6.39vw, 112px)` to
  `@theme` (the work-section rhythm token).
- **index.astro:89:** `pt-[var(--spacing-section)]` → `pt-[var(--spacing-rhythm)]`
  (bottom `pb-[var(--spacing-section)]` kept).
- **index.astro:97:** card gap inline clamp → `gap-[var(--spacing-rhythm)]`.

## Effect

- Projects section **top padding** now equals the **card gap** (both
  `--spacing-rhythm`, up to 112px) — aligned by a single shared token, so they
  stay in sync going forward.
- Card gap value is unchanged (112px ceiling); it just references the token now
  instead of a duplicated inline clamp (DRY).
- Section **bottom padding** unchanged: `--spacing-section` (132px). The section
  is now vertically asymmetric by design (top 112 / bottom 132) — matches the
  "align the TOP padding" request; aligning the bottom is an easy follow-up.

## Verification

- `npm run build`: **OK**. dist CSS has valid
  `--spacing-rhythm:clamp(64px, 40px + 6.39vw, 112px)` and both
  `padding-top:var(--spacing-rhythm)` and `gap:var(--spacing-rhythm)` (verified by
  grepping output — a malformed clamp would pass typecheck but render 0).
- `npm run typecheck`: **0 errors**.
- `prettier` on both changed files (unchanged).
- dev server localhost:4321 (HMR) reflects it live.

## Not committed

Staged, awaiting owner approval.
