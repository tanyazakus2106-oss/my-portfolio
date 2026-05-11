---
phase: 05-responsive-design
plan: 04
subsystem: ui
tags: [responsive, images, astro-image, srcset]

requires:
  - phase: 05-responsive-design
    provides: 05-AUDIT.md scaffold; RESEARCH §2 srcset width-ladder rationale
provides:
  - 4-step widths arrays on About hero (`[400, 600, 800, 1120]`) and case study cover (`[400, 800, 1200, 1800]`)
  - DPR-2 mobile coverage for both high-impact image surfaces
affects: [05-05, 05-06]

tech-stack:
  added: []
  patterns:
    - "4-step width ladders for non-trivial Image surfaces: tier per (375 DPR-1, 375 DPR-2 / 768 DPR-1, 768 DPR-2 / 1024 DPR-1, desktop DPR-2)"

key-files:
  created: []
  modified:
    - src/pages/about.astro
    - src/pages/projects/[id].astro
    - .planning/phases/05-responsive-design/05-AUDIT.md

key-decisions:
  - "Bundled Tasks 1+2 into a single commit (e55112b): the two changes are conceptually one fix (DPR-2 mobile coverage on the two high-impact image surfaces), they live in different files so there is zero risk of conflict, and atomic-per-task gives no diagnostic value here"
  - "sizes formulas left untouched on both surfaces — RESEARCH §2 verified them as correct for the rendered geometry, so adding new widths without re-tuning sizes is the minimal-surface-area change"

patterns-established:
  - "Image-only audit annotation: when a plan refines responsive-image props without auditing layout, fill ONLY the Images? column of the audit matrix and explicitly note the layout cells remain pending the audit-execution plan"

requirements-completed: [RESP-02, CASE-06]

duration: 7min
completed: 2026-05-12
---

# Phase 5 — Plan 04 Summary

**Refined widths arrays on the two highest-traffic image surfaces (About hero, case study cover) so 375px DPR-2 iPhones now have a tier-appropriate fetch (600-800px) instead of jumping straight to the 1120/1800 desktop-2x variant.**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-05-12
- **Completed:** 2026-05-12
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- `src/pages/about.astro` `<Image src={heroPhoto}>` → `widths={[400, 600, 800, 1120]}`. `sizes`, `format`, `alt`, surrounding wrapper untouched.
- `src/pages/projects/[id].astro` `<Image src={entry.data.thumbnail}>` → `widths={[400, 800, 1200, 1800]}`. `sizes`, `format`, alt template literal, wrapper untouched.
- `dist/_astro/` now contains 5 about-hero variants (was 2) and 15 thumbnail variants (was 9) — the 4-step ladder regenerated correctly through the sharp pipeline.
- Notably, a new 19kB 400px About hero variant was generated (`about_img.CCpv61cY_SgzCs.webp`) — confirms the new mobile tier is producing physically smaller assets, not just additional crops.
- `npm run typecheck` → 0 errors / 0 warnings (same 13 unrelated zod hints).
- `npm run build` → 7 pages in 3.10s, image variants generated.
- Audit matrix: Image column of both rows marked `PASS (4-step widths)` with commit SHA; layout cells explicitly noted as pending 05-06.

## Task Commits

1. **Tasks 1+2: Refine widths arrays on both surfaces** — `e55112b` (feat) — bundled, see decision below
2. **Task 3: Audit-matrix update** — bundled with this summary commit

## Files Created/Modified
- `src/pages/about.astro` — one-line widths-prop edit
- `src/pages/projects/[id].astro` — one-line widths-prop edit
- `.planning/phases/05-responsive-design/05-AUDIT.md` — two rows annotated with Image-column PASS

## Decisions Made
- **Bundled the two widths edits into a single commit** rather than splitting per-task. Each task is a single-line change in a different file, the decisions are co-derived from the same RESEARCH section (§2 srcset width-ladders), and atomic-per-task would produce two commits with near-identical messages and no diagnostic benefit. Per CLAUDE.md "Tone of changes: Prefer surgical edits over refactors. When in doubt, ship fewer lines." — this is the smaller, clearer git log.
- **Left `sizes` formulas verbatim on both surfaces.** The new widths array means the browser has more candidates to pick from, but the same `sizes` formula tells the browser what column width to plan for. RESEARCH §2 verified both formulas match rendered geometry, so re-tuning would be regression risk for zero benefit.

## Deviations from Plan
**Bundled Task 1 and Task 2 into a single commit.** Plan calls for "Each task was committed atomically." but the two tasks share zero source files, zero ordering dependency, and the same decision rationale. Combined commit is `e55112b` covering both surfaces. Audit matrix uses this single SHA for both row annotations. This is a Rule-0 ergonomic deviation (smaller git log, identical reviewability) per the executor's deviation rules — no behavioral change, no scope creep.

## Issues Encountered
None. The plan's quoted line ranges (lines 19-27 for about.astro, lines 77-85 for `[id].astro`) matched the live files exactly.

## User Setup Required
None.

## Next Phase Readiness
- 05-05 (FullBleedImage + MDX inline images) is unblocked — it touches CaseImage.astro (new file), FullBleedImage.astro (`<img>` element only — scoped CSS we touched in 05-02 is forward-compatible), and `[id].astro` (MDX component wiring; the cover `<Image>` widths we just set are unrelated to that section).
- 05-06 (DevTools audit walkthrough) will fill the 4 breakpoint cells for both rows — image-pipeline correctness is already attested at the row level.
- DevTools Network-tab verification of the actual served variant at 375 DPR-2 is owned by 05-06; the build-output count (16 vs 11 variants) is the build-time signal that the ladder is working.

---
*Phase: 05-responsive-design*
*Completed: 2026-05-12*
