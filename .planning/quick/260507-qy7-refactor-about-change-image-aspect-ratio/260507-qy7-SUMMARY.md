---
quick_id: 260507-qy7
slug: refactor-about-change-image-aspect-ratio
status: complete
completed: 2026-05-07
files:
  modified:
    - src/pages/about.astro
---

# 260507-qy7 — About hero aspect ratio: 3/2 → 4/5

## What changed

`src/pages/about.astro:18` — image container aspect ratio swapped from `aspect-[3/2]` (landscape, 1.5:1) to `aspect-[4/5]` (portrait, 0.8:1). This matches the portrait orientation seen in the visual reference at tushar.work/about.

## Why

The previous task (260507-qnz) locked the image to 3/2 because the placeholder SVG happened to be 1200×800. But the design intent (revealed by user feedback "image height" + tushar.work screenshot) is portrait orientation. The `[&>img]:object-cover` pattern already in place crops the placeholder to fit gracefully, and real headshot photos (typically portrait) will fit naturally when swapped in.

## Verification

- `npm run typecheck`: 0 errors / 0 warnings (pre-existing zod hints in content.config.ts unchanged)
- `npm run build`: 7 pages built in 2.16s; `dist/about/index.html` rendered with new aspect class
- DOM intact, all copy preserved verbatim, no other changes

## Awaiting human verification

Hard-refresh `http://localhost:4321/about` in incognito at 1440px desktop. Confirm the image now appears as a portrait rectangle (taller than wide) on the left column, matching tushar.work/about's hero photo proportions. If 4/5 is too short or too tall, easy follow-up swap to `3/4` (taller) or `1/1` (square) or any other ratio.
