---
slug: scroll-reveal-batch-stagger-data-reveal
date: 2026-08-15
mode: quick
status: complete
---

# Scroll-triggered reveal animations on the case study page

Content sections animate in one by one as the user scrolls — Framer-style
"appear on scroll". Subtle, once-only, no layout shift.

## Decision: upgrade the existing system, do not build a parallel one

`.animate-on-scroll` was audited against the spec before writing code:

- `prefers-reduced-motion` — already correct (early bail + CSS backstop).
- Batch-scoped stagger — **absent**. The old model staggered only the cluster of
  elements already inside the viewport at load; everything below the fold got
  `--stagger-index: 0`. Since the entire case-study body is below the fold, its
  siblings would have revealed simultaneously — precisely the behaviour the
  feature exists to fix.

Not a 100ms retune, so the single system was upgraded rather than duplicated.
`.animate-on-scroll` remains a valid selector, so `FeaturedCard`, `ProjectCard`,
and `about.astro` needed no edits and inherit the new timing and stagger.

## Motion spec

| Property | Value |
| --- | --- |
| Initial | `opacity: 0`, `translateY(24px)` |
| Revealed | `opacity: 1`, `translateY(0)` |
| Duration | 600ms |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Stagger | 80ms, batch-scoped |
| Trigger | `threshold: 0` + `rootMargin: "0px 0px -15% 0px"` |
| Repeat | once — `unobserve` on reveal, never re-hidden |

`threshold: 0` plus a bottom rootMargin trim is used instead of an element-ratio
threshold: a ratio can never be reached by targets taller than the viewport
(full-bleed images), and the margin form handles them for free.

## API

```html
<figure data-reveal>…</figure>              <!-- one element -->
<div class="case-prose" data-reveal-group>  <!-- children chunked into sections -->
```

`data-reveal-group` chunks its direct children into **sections**, and a section
reveals as one unit. A section is a run of siblings starting at a boundary and
continuing until the next: `h2, h3, h4, details, [data-reveal]`.

Sections, not elements: "Main Pain Points" plus its paragraph plus its three
cards appear together rather than trickling in. `<details>` is a boundary
because `CaseAccordion` renders one and carries its own heading, so each
accordion is its own section — no component edit needed. `CaseCardGrid`,
`CaseImage`, and `ProcessDiagram` are deliberately NOT boundaries, so they stay
attached to the heading above them.

Stagger applies BETWEEN sections, never inside one — all members of a section
share a single `--stagger-index`.

No wrapper elements: `.case-prose` is a CSS grid relying on auto-placement over
flat MDX output (`h2` → col 1, everything else → col 2), so wrapping runs in
divs would break the layout. `display: contents` would preserve the grid but
cannot be animated — `opacity` and `transform` do not apply to contents boxes.
A section is therefore just an array of siblings sharing one observed leader.

## Files

| File | Change |
| --- | --- |
| `src/scripts/scroll-animation.ts` | Batch-scoped stagger, `[data-reveal]` + `[data-reveal-group]` collection, idempotent init, `astro:page-load`, `will-change` release, `data-reveal-ready` flag |
| `src/styles/global.css` | Retimed to 600ms / `cubic-bezier(0.16,1,0.3,1)` / 80ms; attribute selectors; hidden state scoped under `.js-reveal` |
| `src/layouts/BaseLayout.astro` | Inline head script adds `.js-reveal`, 1s failsafe removes it if the module never reported ready |
| `src/pages/projects/[id].astro` | Dropped `animate-page-entry` from `<article>`, added `data-reveal-group`, imported the script |

`animate-page-entry` had to leave the `<article>`: it faded the whole body in at
load, and its `transform` created a containing block that prevented children
from revealing individually. Indexes 0–2 (back link, header, hero) keep the
quick above-the-fold entrance. The prev/next `<nav>` is a sibling of
`.case-prose`, so it stays unanimated, as does the header and footer.

## Incidental fix

`.animate-on-scroll` previously set `opacity: 0` in CSS with no JS guard — a
module load failure left the home and about pages permanently blank. Scoping the
hidden state under `.js-reveal` plus the 1s failsafe fixes that for every page.

## Verification

Ran against `npm run dev` in a real browser, on the Apollo case study (the
longest, and the only one exercising every block component).

- Section split: 56 direct children → 28 sections. Spot-checked against the
  reference screenshots — `h3 + p + CaseCardGrid` ("Main Pain Points"),
  `h3 + p + ProcessDiagram` ("Iterative Design"), `h3 + p + figure` ("UI
  Direction Workshops"), each `<details>` alone ("Layout and grid"), and
  `h2 + p + ul + figure` ("Takeaways"). All five match.
- Progressive scroll: 0 revealed at load and still 0 after 3.3s parked at the
  top; reveals then arrive in chunks of 2–4 elements (whole sections) as the
  page scrolls; 56/56 by the bottom with none stranded.
- Stagger indexes observed across the whole page: only 0, 1, 2 — at most three
  sections land in one batch, so the worst-case delay is 160ms.
- Computed transition `0.6s cubic-bezier(0.16, 1, 0.3, 1)`; article free of
  `animate-page-entry`.
- Home page: 5 `.animate-on-scroll` cards, 0 visible at top, 5 after scroll —
  no regression.
- Reduced-motion rule confirmed present in compiled CSS.
- Failsafe branch: clearing the ready flag and running the timer removes
  `.js-reveal` and returns hidden elements to `opacity: 1`.
- `npm run build` — 7 pages, clean. `astro check` — 0 errors.

Testing note: an accessibility snapshot walks the document and trips the
observer, which made an early reading report everything already revealed. Real
load state has to be sampled before any snapshot on that page instance.

Known limits, both pre-existing and shared with any scroll-reveal
implementation: an instant scroll jump (anchor, restored position) skips
elements it passes over — they reveal on scroll-up rather than never. The 2.5s
IntersectionObserver zoom fallback from quick task `260506-zm1` is preserved.
The failsafe was exercised as an isolated branch, not under a genuine module
load failure.
