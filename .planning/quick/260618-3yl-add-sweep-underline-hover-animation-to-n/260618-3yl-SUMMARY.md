---
quick_id: 260618-3yl
slug: add-sweep-underline-hover-animation-to-n
description: Add sweep-underline hover animation to nav tabs
date: 2026-06-17
status: complete
commit: 1ad9316
---

# Quick Task 260618-3yl: Add sweep-underline hover animation to nav tabs — Summary

## What changed

The desktop nav tab underline (`src/components/Header.astro`) now uses the same hover
sweep as the `ArrowLink` component instead of a simple opacity toggle.

- **Inactive tabs (About, Resume, LinkedIn):** accent underline rests at `scale-x-0`
  (`origin-bottom-right`) and sweeps in left-to-right on hover
  (`group-hover:scale-x-100` + `origin-bottom-left`), animating `transform` over
  300ms ease-in-out — mirroring `ArrowLink`.
- **Active tab (Work):** persistent underline via `scale-x-100` (was opacity-100).
  Visually identical at rest.

## Files touched

- `src/components/Header.astro` — nav underline `<span>` `class:list`.

## Verification

- `npm run typecheck` → 0 errors.
- `npx prettier --check src/components/Header.astro` → clean.

## Notes

- Active/inactive kept in separate `class:list` branches to avoid conflicting
  `after:scale-x-*` utilities on one element.
- Matched `ArrowLink` exactly; like it, there is no `prefers-reduced-motion` guard on the
  sweep (chosen for consistency with the referenced button). A reduced-motion fallback for
  both could be a future task.

## Commit

- `1ad9316` — feat(quick-260618-3yl): add sweep-underline hover animation to nav tabs
