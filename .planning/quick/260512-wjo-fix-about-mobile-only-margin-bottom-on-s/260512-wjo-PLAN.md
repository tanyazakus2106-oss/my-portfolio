---
quick_id: 260512-wjo
description: "fix(about): mobile-only margin-bottom on section titles (How I work / Beyond work) — reduce 48px grid gap to 24px margin"
date: 2026-05-12
mode: quick
---

# Quick Plan 260512-wjo

About page, two stacked sections (How I work, Beyond work). On mobile (`<lg`) the grid is single-column with the h2 above the body div, separated by the section's `gap-[var(--spacing-2xl)]` (48px). User wants this gap reduced to 24px on mobile, expressed as `margin-bottom: var(--spacing-lg)` on the title.

## Change

**File:** `src/pages/about.astro` (both How I work and Beyond work sections — same pattern).

Two class swaps per section:

1. `gap-[var(--spacing-2xl)]` → `lg:gap-[var(--spacing-2xl)]` (scope the grid gap to lg+ only).
2. Add `mb-[var(--spacing-lg)] lg:mb-0` to the h2 (24px below on mobile, 0 on desktop).

## Why this structure (not just changing the gap to spacing-lg on mobile)

The user explicitly asked for `margin-bottom: var(--spacing-lg)` on the title. Expressing the spacing as a margin on the h2 (rather than a grid row-gap) makes the rule local to the title element — clearer at a glance that the title carries the spacing rule. The `lg:mb-0` prevents the mobile margin from compounding with the lg+ column gap.

## Why `lg` is the correct breakpoint

The grid switches from 1-column (mobile) to 4-column (lg+) at the `lg:` breakpoint (`grid-cols-1 lg:grid-cols-4`). Below lg, the title and body are stacked vertically; above lg, they sit side-by-side. The new margin-bottom only makes sense when stacked, so `lg:mb-0` cancels it where it would interfere.

## Verification

- Mobile (DevTools <1024px): 24px between "How I work" and the first paragraph, same for "Beyond work".
- Desktop (≥1024px): h2 in column 1, body in columns 2-4, separated by the 48px column gap. No vertical gap between them (they share the same row).
- `npm run typecheck` — 0 errors.
