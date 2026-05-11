---
phase: 05-responsive-design
plan: 05
subsystem: ui
tags: [responsive, images, mdx, astro-image, component]

requires:
  - phase: 05-responsive-design
    provides: 05-AUDIT.md scaffold; RESEARCH §2 Surface 3 (Path A vs B) and §6 Option A (CaseImage wrapper)
  - phase: 03-home-projects
    provides: existing FullBleedImage component + MDX content collection setup
provides:
  - CaseImage MDX wrapper component baking responsive widths/sizes for the 720px prose column
  - FullBleedImage <img> with sizes="100vw" hint (Path A — minimal interpretation)
  - <Content components={{ FullBleedImage, CaseImage }}> registration in case study render route
  - CaseImage usage pattern documented in project-alpha.mdx top-of-file comment
affects: [05-06]

tech-stack:
  added: []
  patterns:
    - "MDX wrapper components encapsulate responsive props so content authors never type widths/sizes"
    - "Path A image-responsive minimum: sizes hint on plain <img> tags as canonical practice when only one variant exists"

key-files:
  created:
    - src/components/CaseImage.astro
  modified:
    - src/components/FullBleedImage.astro
    - src/pages/projects/[id].astro
    - src/content/projects/project-alpha.mdx
    - .planning/phases/05-responsive-design/05-AUDIT.md

key-decisions:
  - "Path A for FullBleedImage (not Path B): kept Props.src as `string` and did NOT migrate sources from public/ to src/assets/. Per RESEARCH Open Question 1, Path A is the explicit Phase 5 recommendation; Path B is a follow-up task that gains nothing for the single-asset full-bleed surface that currently exists."
  - "Bundled all four code tasks into one commit (4ed2e7d) — same rationale as 05-04. The four edits wire the CaseImage pattern end-to-end (component + sizes hint + registration + doc-comment); splitting would produce 4 commits with overlapping descriptions and no diagnostic value."
  - "Doc-comment lives only in project-alpha.mdx (not all 5 MDX files): per the plan, project-alpha is the canonical template. Five copies of the same comment would be churn."

patterns-established:
  - "Preparedness audit rows: when a plan ships infrastructure that has no current usage (e.g., a wrapper component awaiting real content), the audit row reads PASS (preparedness) rather than blocking on usage that does not yet exist"

requirements-completed: [RESP-02, CASE-06]

duration: 11min
completed: 2026-05-12
---

# Phase 5 — Plan 05 Summary

**Closed out the D-06 image-pipeline surface set: added a CaseImage MDX wrapper that bakes responsive widths/sizes into a single `<CaseImage src={img} alt="...">` invocation, applied the Path A sizes hint to FullBleedImage, and documented the pattern in the canonical MDX template — without rewriting any existing case study content.**

## Performance

- **Duration:** ~11 min
- **Started:** 2026-05-12
- **Completed:** 2026-05-12
- **Tasks:** 5
- **Files modified:** 5 (1 created)

## Accomplishments
- `src/components/CaseImage.astro` created with the exact RESEARCH §6 Option A template: `ImageMetadata`-typed `src`, `widths={[400, 720, 1440]}`, `sizes="(min-width: 768px) 720px, calc(100vw - 3rem)"`, optional caption via `{caption && <figcaption>...}` short-circuit, no scoped `<style>` block.
- `src/components/FullBleedImage.astro` `<img>` tag now declares `sizes="100vw"` and `class="w-full h-auto block"`. Props.src remains `string` (Path A); the scoped CSS overflow-x guard from 05-02 is untouched.
- `src/pages/projects/[id].astro` imports CaseImage and registers `{ FullBleedImage, CaseImage }` on the `<Content>` components prop.
- `src/content/projects/project-alpha.mdx` now carries a parallel JSX-style `{/* CASE BODY IMAGE PATTERN ... */}` documentation comment alongside the existing FullBleedImage comment. No real `<CaseImage>` JSX added (per plan; no body images exist).
- Audit matrix: FullBleedImage row's Image column upgraded with the Path A annotation + new commit SHA; a new `CaseImage component (MDX wrapper)` row added marked PASS (preparedness) across all 4 breakpoints.
- `npm run typecheck` → 0 errors / 0 warnings (now 21 files; the new CaseImage.astro participates in type-checking).
- `npm run build` → 7 pages in 2.72s, MDX parses cleanly, components prop registration compiles.

## Task Commits

1. **Tasks 1–4 (bundled): CaseImage component + FullBleedImage sizes + components-prop registration + MDX doc-comment** — `4ed2e7d` (feat) — see decision below
2. **Task 5: Audit-matrix update** — bundled with this summary commit

## Files Created/Modified
- `src/components/CaseImage.astro` — **created**; figure-wrapped Astro `<Image>` with prose-column responsive props
- `src/components/FullBleedImage.astro` — `<img>` expanded to multi-line form with `sizes="100vw"` + utility class
- `src/pages/projects/[id].astro` — import + components-prop addition
- `src/content/projects/project-alpha.mdx` — JSX doc-comment added at the top of file
- `.planning/phases/05-responsive-design/05-AUDIT.md` — FullBleedImage row Image column upgraded; new CaseImage preparedness row appended

## Decisions Made
- **Path A over Path B for FullBleedImage:** the plan and RESEARCH §2 explicitly recommend Path A for Phase 5. `sizes="100vw"` on a single-asset `<img>` produces no srcset variety but correctly hints the browser about rendered size — canonical responsive-image practice when only one variant exists. Migrating the 1 known asset (`/images/project-alpha-process.jpg`) to `src/assets/` would gain nothing because there are no other surfaces to fan out and Tanya's authoring habit is to drop files into `public/`. Path B is documented as deferred in the audit Notes.
- **One doc-comment in `project-alpha.mdx`, not all 5 MDX files:** per the plan. Future case studies will read this canonical template; duplicating the comment 5× would be a maintenance smell.
- **Bundled commit (Tasks 1–4):** atomic-per-task would yield 4 commits whose messages would all reference the same plan, the same `D-06`, and the same RESEARCH section. The bundle reads better in git log and remains trivially revertable as one unit if the wrapper pattern ever needs to be rolled back. Same rationale as 05-04.

## Deviations from Plan
**Bundled Tasks 1–4 into a single commit** (atomic-per-task would have produced 4 nearly-identical commit messages). Audit matrix Notes column cites the single SHA. Behavioral change: none — same code lands, just consolidated. Rule-0 ergonomic deviation per executor deviation rules.

## Issues Encountered
None. The plan's hard-coded file references (FullBleedImage line 21, `[id].astro` line 91 area, project-alpha.mdx comment lines 13–15) were accurate. The 05-02 `overflow-x: hidden` addition to `.full-bleed` scoped CSS is untouched by this plan, as required.

## User Setup Required
None.

## Next Phase Readiness
- All four D-06 image surfaces are now addressed: About hero (05-04), case study cover (05-04), FullBleedImage `<img>` sizes (this plan), MDX inline images (this plan via CaseImage wrapper).
- 05-06 (DevTools audit walkthrough) is unblocked. It must now fill the 4 breakpoint cells for every remaining empty row, plus verify in DevTools Network panel that 375px DPR-2 fetches:
  - About hero: 600–800 px variant (not 1120 px)
  - Case study cover: 800 px variant (not 1800 px)
  - FullBleedImage: served file (still single-variant; record size)
- 05-07 (real-iPhone verification) gates the 375 column.
- When Tanya adds a real case body image, she now has `<CaseImage src={importedImg} alt="..." caption="..." />` — the responsive props are baked in.

---
*Phase: 05-responsive-design*
*Completed: 2026-05-12*
