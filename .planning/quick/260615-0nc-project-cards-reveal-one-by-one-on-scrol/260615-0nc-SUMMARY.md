---
quick_id: 260615-0nc
status: complete
date: 2026-06-14
---

# Quick Task 260615-0nc: Project cards reveal one-by-one on scroll — Summary

## What changed

`src/scripts/scroll-animation.ts` (shared by ProjectCard, FeaturedCard, and
About-page sections):

- **Stagger now scoped to the initial viewport.** A read pass records which
  `.animate-on-scroll` targets are on-screen at load; only those get an
  incrementing `--stagger-index` (so the first screen still cascades).
  Below-fold targets get `--stagger-index: 0`.
- **Below-fold cards reveal immediately on entry.** With no accrued
  `transition-delay`, each card fades+rises as it scrolls in — the scroll
  position provides the one-by-one rhythm. On the home page (full-height hero),
  every project card is below the fold, so all reveal individually.
- **Observer tuned:** `threshold: 0` + `rootMargin: '0px 0px -12% 0px'` so a card
  triggers as it comfortably enters rather than at a 5%-visible sliver.
- Read/write DOM phases separated to avoid layout thrash.
- Removed unused `STAGGER_STEP_MS` constant (the 70ms cadence lives in
  `global.css`).

Untouched: CSS timing (500ms ease-out, 24px translateY), reduced-motion path,
and the 2.5s zoom fallback.

## Verification

- `npm run typecheck` → 0 errors.
- `prettier --write` applied.
- Logic review: reduced-motion reveals all immediately; initial-view cluster
  cascades; below-fold reveals per-card on scroll; fallback still fires.

## Notes / follow-up

- Visual confirmation is best done in the browser (`npm run dev`) — the change
  is behavioral timing, not type-checkable. Scroll the home page: each project
  card should fade up as it enters, with no lag on lower cards.
