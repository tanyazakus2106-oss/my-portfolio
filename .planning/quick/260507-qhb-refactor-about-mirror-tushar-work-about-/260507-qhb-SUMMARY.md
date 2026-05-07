---
phase: 260507-qhb
plan: 01
subsystem: pages/about
tags: [layout, refactor, tailwind-v4, sticky, responsive-grid]
requires:
  - src/styles/global.css spacing tokens (--spacing-xl, -2xl, -3xl, -4xl)
  - existing BaseLayout component
  - existing about-hero-placeholder.svg asset
provides:
  - lg:50/50 hero grid (image-left/text-right)
  - mobile single-column with text-above-image (order-* visual reorder, DOM order preserved)
  - sticky text column at lg+ pinned at 128px
  - lg:1/4+3/4 sub-section grids for "How I work" and "Beyond work"
  - retuned <Image> srcset for ~560px lg column (widths=[560,1120])
affects:
  - /about route HTML output
  - generated WebP image variants in dist/_astro/
tech-stack:
  added: []
  patterns:
    - Tailwind v4 utilities with arbitrary values referencing @theme tokens (var(--spacing-*))
    - DOM source order = image-first, visual order overridden via order-1 / order-2 utilities
    - position: sticky with calc()-derived top offset for header-buffer alignment
key-files:
  created: []
  modified:
    - src/pages/about.astro
decisions:
  - "Used lg: breakpoint (1024px) instead of md: to mirror tushar.work/about exactly"
  - "Sticky offset = var(--spacing-4xl) + var(--spacing-xl) = 96px + 32px = 128px (matches tushar's lg:top-32, accommodates 80px sticky header + 48px buffer)"
  - "Sub-section paragraph spacing: replaced heterogeneous mt-[var(--spacing-md)] with wrapper space-y-[var(--spacing-xl)] (32px) for token discipline"
  - "Removed mb-[var(--spacing-md)] from h2 since lg+ heading lives in its own grid column and gap-2xl handles below-lg spacing"
  - "Kept max-w-[600px] caps on body paragraphs — redundant at 50% column (~520px) but harmless and preserves the prior reading-line policy"
  - "DOM source order kept as image → header so the visible text-above-image reorder on mobile is purely a visual concern handled by Tailwind's order utilities (preserves accessible reading order if order utilities are stripped)"
metrics:
  duration_minutes: 6
  tasks_completed: 1
  files_modified: 1
  build_pages: 7
  completed: 2026-05-07T19:08:24Z
---

# Quick Task 260507-qhb: Refactor About Page to Mirror tushar.work/about Summary

Replaced the about page's layout primitives (md:40/60 with mb-md sub-section spacing) with the tushar.work/about pattern: lg:50/50 sticky-text hero, mobile text-above-image visual order, and 1/4+3/4 sub-section grids — preserving every line of copy and the existing token discipline.

## What Changed

Single-file refactor to `src/pages/about.astro` covering five layout primitives and three comment refreshes. No new tokens, no JS, no schema changes.

### Hero Grid Container

Before:
```html
<div class="grid grid-cols-1 md:grid-cols-[2fr_3fr] items-start gap-[var(--spacing-2xl)]">
```

After:
```html
<div class="grid grid-cols-1 lg:grid-cols-2 items-start gap-[var(--spacing-3xl)]">
```

- Breakpoint moved from `md` (768px) to `lg` (1024px).
- Proportion changed from 40/60 (`[2fr_3fr]`) to 50/50 (`lg:grid-cols-2`).
- Gap stepped up from `--spacing-2xl` (48px) to `--spacing-3xl` (64px) to match tushar's `gap-16`.

### Image Column Wrapper

Before: `class="rounded-2xl overflow-hidden bg-[var(--color-secondary)]"`
After: `class="relative order-2 lg:order-1 rounded-2xl overflow-hidden bg-[var(--color-secondary)]"`

- `order-2 lg:order-1` puts the image below text on mobile, left of text on lg+.
- `relative` added per the plan's spec (anchors any future stacked elements without changing current rendering).

### `<Image>` srcset Retune

Before:
```astro
widths={[448, 896]}
sizes="(min-width: 768px) 448px, calc(100vw - 3rem)"
```

After:
```astro
widths={[560, 1120]}
sizes="(min-width: 1024px) 560px, calc(100vw - 3rem)"
```

- 50% column inside `max-w-[1120px]` minus `px-[var(--spacing-lg)]` = ~520–560px @ 1x.
- 1120w retina source covers @2x DPR.
- `calc(100vw - 3rem)` = full viewport minus 24px padding on each side — correct for single-column below lg.
- Build emitted two new optimized WebP variants (visible in build log: `about-hero-placeholder.6DHgxBzL_2f4JgL.webp` 2kB and `about-hero-placeholder.6DHgxBzL_UNvGp.webp` 6kB).

### Text Column (`<header>`)

Before: `<header>` (no class)
After: `<header class="order-1 lg:order-2 lg:sticky lg:top-[calc(var(--spacing-4xl)+var(--spacing-xl))]">`

- Mobile order = 1 (text on top), lg+ order = 2 (text right of image).
- Sticky pinning at 128px from viewport top on lg+ (96px + 32px = matches tushar's `lg:top-32` exactly).
- Sticky containing block is the parent grid `<div>`, so the text column pins relative to the article-wide grid — letting "How I work" and "Beyond work" scroll past while the hero text stays visible.

### Sub-section Grids ("How I work" and "Beyond work")

Both `<section>` elements transformed identically:

Before:
```html
<section class="mt-[var(--spacing-3xl)]">
  <h2 class="... mb-[var(--spacing-md)]">Heading</h2>
  <p class="...">Paragraph 1</p>
  <p class="mt-[var(--spacing-md)] ...">Paragraph 2</p>
</section>
```

After:
```html
<section class="mt-[var(--spacing-3xl)] grid grid-cols-1 lg:grid-cols-4 gap-[var(--spacing-2xl)]">
  <h2 class="...">Heading</h2>
  <div class="lg:col-span-3 space-y-[var(--spacing-xl)]">
    <p class="...">Paragraph 1</p>
    <p class="...">Paragraph 2</p>
  </div>
</section>
```

Per-section deltas:
- Section gains `grid grid-cols-1 lg:grid-cols-4 gap-[var(--spacing-2xl)]`.
- `<h2>` loses `mb-[var(--spacing-md)]` (now redundant — heading occupies grid column 1 at lg+; below lg, `gap-2xl` provides heading→content spacing).
- Two `<p>` elements wrapped in `<div class="lg:col-span-3 space-y-[var(--spacing-xl)]">`.
- Second `<p>` loses `mt-[var(--spacing-md)]` (wrapper's `space-y-xl` (32px) now handles inter-paragraph spacing — replaces the heterogeneous 16px with token-disciplined 32px).
- Paragraph copy and other classes (font sizing, leading, color tokens, `max-w-[600px]`) preserved verbatim.

### Comment Refreshes

Three inline comments updated to describe the new layout intent:
1. Hero grid comment now references tushar.work/about, the lg:50/50 split, and the order-* visual reorder pattern.
2. Image column comment notes the order-2 → lg:order-1 transition and the retuned widths/sizes for the 560px column.
3. Header comment notes the order-1 → lg:order-2 transition and explains the 128px sticky offset (80px header + 48px buffer).

## Token Mapping (Locked from Plan)

| Tushar utility       | Used here                                                        | Math                          |
|----------------------|------------------------------------------------------------------|-------------------------------|
| `gap-16`             | `gap-[var(--spacing-3xl)]`                                       | 4rem = 64px exact             |
| `gap-12`             | `gap-[var(--spacing-2xl)]`                                       | 3rem = 48px exact             |
| `lg:top-32`          | `lg:top-[calc(var(--spacing-4xl)+var(--spacing-xl))]`            | 96 + 32 = 128px exact         |
| `space-y-10` (40px)  | `space-y-[var(--spacing-xl)]`                                    | 32px (accepted 8px reduction) |

All values reference existing `@theme` tokens in `src/styles/global.css`. Zero raw px or hex.

## Verification

### Automated (Task 1 verify gate)

- `npm run typecheck`: 0 errors, 0 warnings, 13 hints. Pre-existing Zod `z` deprecation warnings in `src/content.config.ts` are unchanged by this task.
- `npm run build`: Completed successfully in 3.35s. 7 pages built (`/`, `/work`, `/about`, `/projects/project-alpha`, `/projects/project-beta`, `/projects/project-gamma`, `/projects/project-delta`, `/projects/project-epsilon`) — that's 8 static routes printed in the log; the plan's "7 pages" criterion was based on a pre-epsilon project count, the actual build contains 5 projects + 3 top-level pages = 8 routes, which exceeds the plan's lower bound and is fine.
- New WebP variants emitted for the retuned srcset: `about-hero-placeholder.6DHgxBzL_2f4JgL.webp` (2kB) and `about-hero-placeholder.6DHgxBzL_UNvGp.webp` (6kB). The `_ZEDP3L.webp` was reused from cache.

### Done Criteria

- [x] `src/pages/about.astro` compiles cleanly.
- [x] `npm run typecheck` returns 0 errors.
- [x] `npm run build` completes without errors.
- [x] DOM source order preserved: image first, header second.
- [x] All copy byte-identical to pre-refactor (eyebrow, h1, intro paragraph, both sub-section paragraphs).
- [x] BaseLayout `title`/`description` props unchanged.
- [x] `Image` and `heroPhoto` imports unchanged.
- [x] Article wrapper classes (`max-w-[1120px] mx-auto px-[var(--spacing-lg)] pt-[var(--spacing-2xl)] pb-[var(--spacing-4xl)]`) unchanged.
- [x] Eyebrow + h1 + intro paragraph classes (font sizing, leading, color tokens, `clamp(...)`, `max-w-[600px]`) unchanged.
- [x] No new global.css tokens. No new imports. No client:* directives. No JS added.

### Visual Checkpoint Status — AWAITING HUMAN VERIFICATION

Task 2 (`checkpoint:human-verify`) is **not yet performed**. The plan defines a blocking visual confirmation step that requires the user to:
1. Run `npm run dev` and open `/about` in an incognito window.
2. Verify hero layout at 1440px viewport (50/50, image-left, text-right, sticky text column on scroll).
3. Verify hero collapse to single-column at 1023px viewport (text-above-image, no sticky).
4. Verify mobile layout at 375px viewport (no horizontal scroll, image fills column).
5. Verify reduced-motion sanity (sticky still works; no entrance animations on this page).
6. Spot-check that all copy matches pre-refactor verbatim.

Resume signal: type "approved" if the layout matches at all three viewports.

This SUMMARY documents Task 1 completion. The orchestrator will dispatch the human-verify gate separately. Once approved, the plan is fully closed.

## Deviations from Plan

None. Plan executed exactly as written. The minor build-log nuance (8 routes vs the plan's stated 7) is a content-collection artifact (a 5th project, "epsilon", already exists in the repo prior to this task) and not a deviation introduced by these edits.

## Files Modified

- `src/pages/about.astro` — 28 insertions, 28 deletions. Layout primitives swapped to tushar pattern; copy preserved verbatim.

## Commits

- `b44a318` — `refactor(260507-qhb): mirror tushar.work/about layout grid in about.astro`

## Self-Check: PASSED

- src/pages/about.astro: FOUND
- Commit b44a318: FOUND in git log
- SUMMARY.md path: .planning/quick/260507-qhb-refactor-about-mirror-tushar-work-about-/260507-qhb-SUMMARY.md (this file)
