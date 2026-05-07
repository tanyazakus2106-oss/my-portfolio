---
quick_id: 260507-r2f
slug: refactor-about-apply-animate-on-scroll-f
status: complete
completed: 2026-05-07
files:
  modified:
    - src/pages/about.astro
---

# 260507-r2f — About: apply scroll fade-up animation

## What changed

`src/pages/about.astro`:
- Added `animate-on-scroll` to 3 elements: hero grid div, "How I work" section, "Beyond work" section
- Added `<script>import '../scripts/scroll-animation.ts';</script>` after `</BaseLayout>`

## Why

User feedback: "use same animation for sections as here: https://www.tushar.work/about". Tushar's pattern is `opacity:0 + translateY(40px)` → `opacity:1 + translateY(0)` — a fade-up entrance triggered by scroll position. The project already has the same pattern via the shared `animate-on-scroll` utility (already used on home page project cards). This task just applies that existing utility to the About page sections.

## Animation contract (existing project utility, no changes)

- Initial: `opacity:0` + `translateY(24px)`
- Triggered: at 5% viewport visibility via IntersectionObserver
- Final: `opacity:1` + `translateY(0)`
- Duration: 500ms ease-out
- Stagger: 70ms between siblings (`calc(var(--stagger-index) * 70ms)`)
- `prefers-reduced-motion`: reveals immediately, no transition
- Safety fallback: 2.5s timeout reveals any non-fired elements (high-zoom edge case)

## Verification

- `npm run build`: 7 pages built in 2.15s, no warnings
- HTML inspection: `animate-on-scroll` class present on the 3 target elements; script tag present at file end

## Awaiting human verification

Hard-refresh `http://localhost:4321/about` in incognito and scroll the page. The hero grid should fade up first, then "How I work" as it enters viewport, then "Beyond work" — all with the same 500ms ease-out cadence used elsewhere on the site.
