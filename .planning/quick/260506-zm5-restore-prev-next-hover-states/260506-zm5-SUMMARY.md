---
quick_id: 260506-zm5
description: Restore prev/next nav sweep-underline hover states
date: 2026-05-06
status: complete
commits:
  - 5664d2f
files_changed:
  - src/pages/projects/[id].astro
---

# Quick Task 260506-zm5 — Summary

## What changed

`src/pages/projects/[id].astro` (+4 / −4) — surgical 4-line restoration on the prev/next case-study navigation:

1. Hover color: `hover:text-[var(--color-text-primary)]` → `hover:text-[var(--color-accent)]` (both anchors).
2. Wrapped "Previous project" / "Next project" label text in a `<span class="relative">` with `::after` underline-sweep on `group-hover` (300ms ease-in-out, `origin-bottom-right` → `origin-bottom-left`). Arrows (`←`, `→`) stay *outside* the relative span so the underline never sweeps under them.

## Why

zm4's structural redesign correctly preserved the prev/next functionality but dropped two micro-interactions in the simplification: (a) hover color shifted to text-primary instead of accent, and (b) the sweep-underline animation around the label text was lost.

Both were the same pattern used on the homepage `ProjectCard` "View project" affordance, so dropping them broke visual consistency between the project list and the case study footer nav. Restoring them re-aligns the two surfaces.

## Verification

- `grep -c "hover:text-\[var(--color-accent)\]" src/pages/projects/[id].astro` → 2.
- `grep -c "group-hover:after:scale-x-100" src/pages/projects/[id].astro` → 2.
- `grep -c "after:origin-bottom-right" src/pages/projects/[id].astro` → 2.
- Diff: +4 / −4 — minimal-surface restoration.

## Notes for future sessions

- The sweep-underline pattern is reused in three places now: ProjectCard "View project", Footer link styles (similar structure), and case-study prev/next. If a fourth use appears, consider extracting a small utility class to global.css to keep the markup tidy. Not yet warranted at three.
- Layout, typography, container widths, and font sizes from zm4 are untouched — this task is purely interaction restoration.
