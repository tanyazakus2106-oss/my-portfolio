---
quick_id: 260507-r5q
slug: refactor-about-remove-max-w-600px-cap-fr
status: complete
completed: 2026-05-07
files:
  modified:
    - src/pages/about.astro
---

# 260507-r5q — Body text aligns with grid 3-col span

## What changed

Removed `max-w-[600px]` from 4 paragraph elements in the "How I work" and "Beyond work" sections of `src/pages/about.astro`. Body text now fills the full `lg:col-span-3` grid column (~840px wide on lg+ instead of capped at 600px), matching tushar.work/about's reference behavior.

## Why

User feedback: "body text width - align with the grid" with screenshot showing body copy filling the full right-side 3-col span of the 1/4+3/4 grid. The previous per-paragraph cap was a holdover from the original single-column layout where 600px was the comfortable reading measure for a 760px article. Now that the grid itself constrains line length (3/4 of 1120px ≈ 840px), the per-paragraph cap is redundant and visually misaligns with the grid.

## Edit detail

| Line | Before | After |
|------|--------|-------|
| 52 | `text-[18px] leading-[1.625] text-[var(--color-text-secondary)] max-w-[600px]` | `text-[18px] leading-[1.625] text-[var(--color-text-secondary)]` |
| 55 | (same) | (same) |
| 67 | (same) | (same) |
| 70 | (same) | (same) |

Hero intro paragraph (line 39) keeps its `max-w-[600px]` — sits in the 50/50 hero column (~528px wide max at lg+), so the cap is a no-op there.

## Verification

- `npm run build`: 7 pages built in 2.11s
- HTML inspection: 4 paragraphs in `<section>` elements no longer have max-w; hero intro retains it
