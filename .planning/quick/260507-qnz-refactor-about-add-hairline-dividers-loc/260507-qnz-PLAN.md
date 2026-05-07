---
quick_id: 260507-qnz
slug: refactor-about-add-hairline-dividers-loc
description: refactor(about) — add hairline dividers between major sections + lock image aspect ratio
files_modified:
  - src/pages/about.astro
estimated_tasks: 1
autonomous: true
---

# Quick Task 260507-qnz: About page polish — dividers + image aspect ratio

## Objective

Two surgical class additions in `src/pages/about.astro`:

1. **Lock image aspect ratio** — preserve the placeholder's native 1200×800 (3:2) ratio explicitly so the layout doesn't shift when Tanya swaps in a real photo of different dimensions.
2. **Add hairline dividers** between the lower content sections (between hero ↔ "How I work", between "How I work" ↔ "Beyond work") to add visual rhythm.

Reference: tushar.work/about uses `border-b border-border last:border-0` between items inside its sub-section lists. Same `--color-border` token approach.

## Task 1 — Add aspect-ratio + dividers

**File:** `src/pages/about.astro`

### Edit A — Image container (line 21 area)

Find the image-wrapping div (currently `<div class="rounded-2xl overflow-hidden bg-[var(--color-secondary)] relative order-2 lg:order-1">`).

**Add:** `aspect-[3/2]` to the class list. The Astro `<Image>` inside already has `w-full h-auto` — adding `aspect-[3/2]` to the wrapper locks the container's aspect ratio so any future photo swap renders at the same proportions.

The image div may also need `[&>img]:object-cover [&>img]:w-full [&>img]:h-full` (or similar object-cover treatment on the inner img) so when a photo's natural ratio differs from 3:2, it covers the container without distortion. **Use `[&>img]:object-cover [&>img]:h-full [&>img]:w-full`** — Tailwind v4's arbitrary child selector — to apply `object-cover w-full h-full` to the inner `<img>` rendered by Astro's `<Image>` component.

### Edit B — "How I work" section divider

Find the "How I work" section (`<section class="mt-[var(--spacing-3xl)] grid grid-cols-1 lg:grid-cols-4 gap-[var(--spacing-2xl)]">`).

**Add:** `border-t border-[var(--color-border)] pt-[var(--spacing-3xl)]` to the existing class list. Place these BEFORE the existing `mt-[var(--spacing-3xl)]` so the order reads naturally:
```
border-t border-[var(--color-border)] pt-[var(--spacing-3xl)] mt-[var(--spacing-3xl)] grid grid-cols-1 lg:grid-cols-4 gap-[var(--spacing-2xl)]
```

Result: existing `mt-3xl` is the gap between hero and divider; new `border-t` is the hairline; new `pt-3xl` is the gap between hairline and section heading.

### Edit C — "Beyond work" section divider

Find the "Beyond work" section (same pattern as Edit B).

**Add:** `border-t border-[var(--color-border)] pt-[var(--spacing-3xl)]` in the same place. Result: hairline divider between "How I work" and "Beyond work" too.

## Verification

- `npm run typecheck` → 0 errors
- `npm run build` → 7-8 pages built, dist/about/index.html present
- Visual (post-merge, awaiting human eyes): a hairline divider appears above each of "How I work" and "Beyond work" headings; the image renders at exact 3:2 ratio at all viewport widths

## Constraints

- Tailwind v4 utility classes only. No new `@theme` tokens. No `global.css` edits.
- Preserve all copy verbatim (eyebrow, h1, intro, How I work paragraphs, Beyond work paragraphs).
- Preserve all existing classes — only ADD the new ones documented above.
- DOM structure unchanged. Single-file edit.
