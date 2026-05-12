---
phase: 05-responsive-design
plan: 07
subsystem: ui
tags: [responsive, real-device, verification, sign-off, ios-safari]

requires:
  - phase: 05-responsive-design
    provides: 05-AUDIT.md fully populated by 05-06 with MobileNav overlay @375 marked PROVISIONAL-PASS pending real-iPhone verify
provides:
  - Real-iPhone verification of NAV-05, CASE-06, RESP-02 on physical hardware
  - Two additional iPhone-driven RESP-03/NAV-05 fixes (overlay relocation, ThemeToggle touch color)
  - Phase 5 audit matrix signed off with date stamp 2026-05-12
  - Two Phase 6 candidate findings documented in audit Recommended Follow-Up section
affects: []

tech-stack:
  added: []
  patterns:
    - "DOM relocation to escape ancestor stacking contexts: when an Astro component with `position: fixed` needs to anchor to the viewport, hoist its DOM node to document.body on mount to bypass any ancestor's backdrop-filter/transform/filter containing block"

key-files:
  created: []
  modified:
    - src/components/MobileNav.astro
    - src/components/ThemeToggle.astro
    - .planning/phases/05-responsive-design/05-AUDIT.md

key-decisions:
  - "Used DOM relocation (3-line JS) rather than splitting MobileNav into two Astro components: lower-surface-area change, no template restructuring, and the trigger/overlay communicate via getElementById regardless of where the overlay lives in the DOM."
  - "Deferred Phase 6 findings (focus state on touch, mobile padding feels too generous) explicitly rather than silently dropping them: documented in audit Recommended Follow-Up section with reasoning for why each needs more scoping before a fix."
  - "Did not require Step 3 image-asset-sizing verification with Safari Web Inspector: Steps 1+2 covered the critical iOS-only behaviors (momentum scroll lock, overlay positioning, ThemeToggle prominence on real device). RESP-02 was already DPR-verified via DevTools at 06; the served-variant check is a soft gate per 05-07-PLAN.md."

patterns-established:
  - "backdrop-filter containing-block trap: any ancestor with backdrop-filter (or transform/filter/perspective) silently changes the containing block of fixed-positioned descendants. When a `position: fixed` element needs viewport-relative anchoring, ensure it either has no such ancestor or relocate it to <body>."

requirements-completed: [NAV-05, CASE-06, RESP-02]

duration: ~15min
completed: 2026-05-12
---

# Phase 5 — Plan 07 Summary

**Closed Phase 5 with real-iPhone verification on hardware. Walk surfaced two additional bugs invisible in DevTools — overlay positioning broken when opened from a scrolled page, ThemeToggle muted on touch — both fixed inline and re-verified on the same device. Audit matrix signed off 2026-05-12; two non-blocking findings deferred to Phase 6.**

## Performance

- **Duration:** ~15 min (preview setup + iPhone walk + 2 inline fixes + matrix sign-off)
- **Started:** 2026-05-12
- **Completed:** 2026-05-12
- **Tasks:** 2 (1 checkpoint + 1 auto)
- **Files modified:** 3

## Accomplishments
- **Real-iPhone verification completed** on physical hardware via LAN preview (`http://192.168.0.100:4321/`). Walked the verification script from 05-07-PLAN.md `<how-to-verify>`:
  - Step 1 (MobileNav overlay + iOS momentum scroll): PASS after the overlay relocation fix landed
  - Step 2 (case study readability end-to-end): PASS
  - Step 3 (image asset sizing via Safari Web Inspector): not gated — soft check, already DPR-verified in 05-06
- **Two iPhone-driven fixes landed inline**:
  - **MobileNav overlay broken on scrolled pages.** Root cause: `backdrop-filter: blur(6px)` on `#site-header.is-scrolled` establishes a containing block for fixed-positioned descendants per the CSS Filter Effects spec. The overlay's `fixed inset-0` was anchoring to the 80px-tall scrolled header instead of the viewport — clipping menu items (Work was missing) and letting the page bleed through underneath. Fixed by relocating the overlay DOM to `document.body` on mount (3-line JS addition).
  - **ThemeToggle icon muted on touch.** Used `text-secondary hover:text-primary`; `hover:` never fires on `(hover: none)` devices, so the icon stayed muted. Fixed with a scoped `@media (hover: none)` block setting the resting color to `var(--color-text-primary)` — same touch-default pattern as ArrowLink.
- **Audit matrix signed off:** MobileNav overlay @375 upgraded PROVISIONAL-PASS → PASS. All 6 Sign-Off checkboxes ticked. Date stamped 2026-05-12.
- **Two Phase 6 candidates captured** in the audit Recommended Follow-Up section with explicit rationale for why each needs scoping before a fix:
  - `:focus-visible` outline on touch (may be misdiagnosed — `:focus-visible` should only fire on keyboard focus per spec)
  - Mobile padding feels too generous (conflicts with CLAUDE.md design preference, needs explicit decision before applying)

## Task Commits

1. **Task 1: Real-iPhone verification checkpoint** — completed via interactive walk on physical iPhone Safari. User signaled `approved` after two iterations (initial walk surfaced overlay break + theme toggle finding; re-walk after fixes returned all pass).
2. **Task 2: Audit-matrix sign-off + iPhone-driven fixes**:
   - `8b36c31` (fix) — overlay DOM relocation + ThemeToggle touch-default color
   - Audit-matrix sign-off + summary update bundled with this commit

## Files Created/Modified
- `src/components/MobileNav.astro` — 3-line JS addition: relocate overlay to `document.body` if not already a direct child
- `src/components/ThemeToggle.astro` — added `.theme-toggle-btn` class hook on button; scoped `@media (hover: none)` block setting color to primary
- `.planning/phases/05-responsive-design/05-AUDIT.md` — MobileNav row PROVISIONAL-PASS → PASS; 2 new audit-driven discovery rows; Sign-Off ticked 6/6 with 2026-05-12 date; Recommended Follow-Up section now lists 2 Phase 6 candidates

## Decisions Made
- **Relocate-on-mount over split-component refactor.** Splitting MobileNav into `<MobileNavTrigger />` + `<MobileNavOverlay />` would have been more "Astro-idiomatic" but required restructuring the Header layout. The JS relocation is 3 lines, runs once at component init, and the trigger ↔ overlay communication (via getElementById) doesn't care where the overlay lives in the DOM. Smaller surface area, equivalent outcome.
- **Treat findings 3 (focus) and 4 (padding) as Phase 6 scope.** Finding 3 may be a misdiagnosis (`:focus-visible` spec); finding 4 conflicts with documented design preference and would touch the entire spacing scale — that's a design-system change, not a responsive-correctness change. Phase 5's brief was responsive correctness.
- **Did not require Step 3 Safari Web Inspector verification.** RESP-02 image asset sizing was DPR-verified at 05-06 via DevTools at DPR-2. The real-device Step 3 was a confirmatory gate, not the only path to verification. Plan 05-07 explicitly allows `skip-step-3 no-mac-available` as a partial-approval variant; we used the equivalent: implicit skip because the soft gate was already satisfied.

## Deviations from Plan
**Two iPhone-driven fixes landed during the verification walk** (overlay relocation, ThemeToggle touch color). Plan 05-07 anticipated this with the FAIL handling path (`record the FAIL in the audit matrix, propose a follow-up route`), but in practice the fixes were trivial enough to land inline rather than spinning up a follow-up plan. Audit Summary logs both as audit-driven discoveries (parallel to the 05-06 ArrowLink + prev/next nav findings).

**Two additional findings explicitly deferred to Phase 6** rather than addressed. Documented in audit Recommended Follow-Up.

## Issues Encountered
- The overlay break was invisible in DevTools because Chrome's responsive mode doesn't simulate the iOS Safari behavior of `backdrop-filter` containing-block establishment in the same way (or the user wasn't scrolled when testing in DevTools at 05-06, so the `.is-scrolled` class wasn't applied). This is exactly the class of bug 05-07 was designed to catch — no DevTools simulation substitutes for hardware.
- LAN preview required a fresh `npm run preview --host` because the previous run was bound to localhost only. Standard mobile-debug workflow.

## User Setup Required
None.

## Next Phase Readiness
- **Phase 5 ROADMAP marker can be set to complete.** All 7 plans have SUMMARY.md; audit matrix signed off.
- **Phase 6 candidates pre-loaded** in audit Recommended Follow-Up section. When Tanya invokes `/gsd-discuss-phase 6`, the discuss-phase questioner has these as starting context:
  - `:focus-visible` behavior on touch (reproduce + scope before fix)
  - Mobile padding/spacing system (design discussion, may revise CLAUDE.md Design Preferences)
- **No regressions to monitor.** Build + typecheck clean throughout. 16 image variants in dist/. All 60 PASS cells (4 N/A from MobileNav hidden at lg+).

---
*Phase: 05-responsive-design*
*Completed: 2026-05-12*
