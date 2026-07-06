---
quick_id: 260706-j1c
title: Slightly decrease project card gaps on Work page (132->112px ceiling)
status: complete
date: 2026-07-06
commit: 74c3c91
---

# Quick Task 260706-j1c — Summary

## What changed

`src/pages/index.astro` line 97, +1/-1:

```
- <div class="flex flex-col gap-[var(--spacing-section)]">
+ <div class="flex flex-col gap-[clamp(64px,40px+6.39vw,112px)]">
```

## Effect

- Vertical gap between project cards: desktop ceiling **132px -> 112px**
  (~15% slight decrease); mobile floor **64px unchanged**; stays fluid.
- Decoupled the inter-card gap from the shared `--spacing-section` token, so the
  section's outer pt/pb (line 89) still uses `--spacing-section` (132px) and is
  unchanged — cards are now spaced tighter than the whole section, as intended.

## Verification

- `npm run build`: **OK**. Generated CSS is valid: `gap:clamp(64px,40px + 6.39vw,112px)`
  (Tailwind added the whitespace around `+` that CSS calc requires — confirmed by
  grepping dist CSS, since typecheck alone would not catch a malformed clamp).
- `npm run typecheck`: **0 errors**.
- Section pt/pb (`--spacing-section`) untouched; token unchanged in global.css.
- `prettier` on changed file (unchanged).
- dev server localhost:4321 (HMR) reflects it live.

## Note

112px was chosen as a modest "slight" reduction. Trivially tunable — lower the
max further (e.g. 104/96px) to tighten more, or raise it toward 132 to loosen.

## Not committed

Staged, awaiting owner approval.
