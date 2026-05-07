---
phase: quick-260507-qab
plan: 01
subsystem: about-page-layout
tags: [astro, tailwind, layout, about, responsive]
requires: []
provides:
  - About page hero rendered as 2-column (image-left 40% / text-right 60%) at md+ and stacked on mobile
affects:
  - src/pages/about.astro
tech-stack:
  added: []
  patterns:
    - "Tailwind v4 grid pattern: `grid grid-cols-1 md:grid-cols-[2fr_3fr] items-start gap-[var(--spacing-2xl)]` for mobile-stack-then-desktop-2-col"
    - "Astro <Image> widths/sizes retuned for narrower column geometry (448 / 896)"
key-files:
  created: []
  modified:
    - src/pages/about.astro
decisions:
  - "Used `grid-cols-[2fr_3fr]` (40/60 fractional split) rather than fixed widths so the columns scale fluidly as the article container resizes."
  - "Dropped `mb-[var(--spacing-2xl)]` from image card — the grid `gap-[var(--spacing-2xl)]` provides equivalent spacing on mobile and is the right choice on desktop where the columns are side-by-side."
  - "Removed `max-w-[20ch]` from `<h1>` because the right column itself is now ~672px (60% of 1120px), making the 20ch cap counter-productive."
metrics:
  duration: ~3min
  completed: 2026-05-07
---

# Phase quick-260507-qab Plan 01: Refactor about — split top hero into 2-col Summary

Split the About page top hero (portrait photo + eyebrow/headline/intro) into a CSS-grid 2-column layout (image 40% left / text 60% right at ≥768px) that stacks image-above-text on mobile, while leaving the "How I work" and "Beyond work" sections single-column and copy-byte-identical.

## Final classes & props

**Hero grid wrapper (single new `<div>`):**
```
grid grid-cols-1 md:grid-cols-[2fr_3fr] items-start gap-[var(--spacing-2xl)]
```

**Image card (now without bottom margin):**
```
rounded-2xl overflow-hidden bg-[var(--color-secondary)]
```

**Astro `<Image>` props (retuned for narrower column geometry):**
```
widths={[448, 896]}
sizes="(min-width: 768px) 448px, calc(100vw - 3rem)"
```

**Article container width:**
```
max-w-[1120px]   (was max-w-[760px])
```

**`<h1>`:** `max-w-[20ch]` removed; all other classes (`mt-[var(--spacing-md)]`, `text-[clamp(2.5rem,5vw,4.5rem)]`, `leading-[1.05]`, `text-[var(--color-text-primary)]`) preserved.

## Verification

- `npm run typecheck` → 0 errors, 0 warnings (13 pre-existing hints in `src/content.config.ts` about deprecated `z` from `astro:content` — unrelated to this task, out of scope)
- `npm run build` → Complete in 3.59s; `dist/about/index.html` emitted (21181 bytes); 3 about-hero WebP variants emitted at the new widths in `dist/_astro/`
- All copy preserved verbatim: eyebrow "Now — Open to full-time & freelance", h1 "Tanya Zakus, UX/UI designer for humanist AI products and complex SaaS.", intro paragraph, both "How I work" paragraphs, both "Beyond work" paragraphs

## Deviations from Plan

None — plan executed exactly as written. Every step (1-7) of Task 1 applied verbatim, including the "no other changes" constraint.

## Out-of-scope observations (logged, not fixed)

- Build emitted one CSS optimization warning: `.bg-\[var\(--color-\*\)\] { background-color: var(--color-*); }` "Unexpected token Delim('*')". This originates from a Tailwind utility class containing a literal `*`, somewhere outside `about.astro`. Pre-existing, untouched by this change. Out of scope per the deviation-rule scope boundary.
- `src/content.config.ts` has 13 ts(6385) hints about deprecated `z` symbols from `astro:content`. Pre-existing. Out of scope.

## Commits

- `4494777` — refactor(quick-260507-qab): split about hero into 2-col grid

## Status

**Task 1 (auto): COMPLETE.** Edit applied, typecheck + build green, committed.

**Task 2 (checkpoint:human-verify): AWAITING HUMAN VERIFICATION.** This task requires the owner to:
1. Run `npm run dev` from project root
2. Open http://localhost:4321/about at ~1440px viewport — confirm image-left/text-right side-by-side, eyebrow top-aligned with image top edge, headline wrapping naturally, "How I work" / "Beyond work" unchanged below
3. Resize to 375px — confirm image stacks on top, text below, ~48px gap, no horizontal scroll
4. Toggle dark mode — confirm both layouts still correct

Resume signal: type "approved" if both desktop and mobile render correctly; otherwise describe what looks off.

## Self-Check: PASSED

- File `src/pages/about.astro` exists and contains the new grid wrapper class string `md:grid-cols-[2fr_3fr]` ✓
- Commit `4494777` exists in `git log --oneline` ✓
- Build artifact `dist/about/index.html` (21181 bytes) emitted ✓
- About-hero WebP variants `about-hero-placeholder.6DHgxBzL_163cVG.webp` and `about-hero-placeholder.6DHgxBzL_Zff2Kz.webp` emitted in `dist/_astro/` ✓
