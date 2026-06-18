---
quick_id: 260618-rd4
slug: reduce-nav-tab-underline-height-to-1px
description: Reduce nav tab underline height to 1px
date: 2026-06-18
status: complete
commit: 1510145
---

# Quick Task 260618-rd4: Reduce nav tab underline height to 1px — Summary

## What changed

Nav tab accent underline height: `after:h-[2px]` → `after:h-px` (`src/components/Header.astro`).
Applies to both the active tab's persistent underline and the inactive tabs' hover sweep.

## Files touched

- `src/components/Header.astro` — nav underline `<span>` `class:list`.

## Result

The tab underline is now a 1px hairline, matching the `ArrowLink` ("View project →") underline weight.

## Verification

- `npm run typecheck` → 0 errors.
- `npx prettier --check src/components/Header.astro` → clean.

## Commit

- `1510145` — style(quick-260618-rd4): reduce nav tab underline height to 1px
