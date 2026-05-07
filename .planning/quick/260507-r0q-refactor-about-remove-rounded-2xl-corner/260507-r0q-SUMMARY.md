---
quick_id: 260507-r0q
slug: refactor-about-remove-rounded-2xl-corner
status: complete
completed: 2026-05-07
files:
  modified:
    - src/pages/about.astro
---

# 260507-r0q — Remove about hero image corner radius

## What changed

`src/pages/about.astro:18` — removed `rounded-2xl` from the image container's class list. The image now has flat corners, matching the tushar.work/about reference where the hero photo has straight edges.

## Verification

- `npm run build`: 7 pages built in 2.79s, dist/about/index.html regenerated
- Other classes preserved: `relative order-2 lg:order-1 overflow-hidden bg-[var(--color-secondary)] aspect-[4/5] [&>img]:object-cover [&>img]:h-full [&>img]:w-full`

Note: `overflow-hidden` retained because it's still needed by `[&>img]:object-cover` to clip any image overflow at the container's hard edges.
