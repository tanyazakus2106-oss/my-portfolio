---
phase: 05-responsive-design
plan: 03
subsystem: ui
tags: [responsive, mobile-nav, ios-safari, scroll-lock]

requires:
  - phase: 05-responsive-design
    provides: 05-AUDIT.md scaffold + MobileNav pre-identified failure row
  - phase: 02-navigation-design-system
    provides: D-09 (close gestures), D-10 (backdrop), D-11 (focus trap), D-12 (animations) — preserved unchanged
provides:
  - iOS-Safari-reliable scroll lock on MobileNav (position-fixed + scroll-position capture/restore)
  - MobileNav trigger + overlay audit-matrix rows filled with PROVISIONAL-PASS at 375 (pending real-iPhone verify in 05-07)
affects: [05-07]

tech-stack:
  added: []
  patterns:
    - "iOS Safari scroll lock: set body to position:fixed + top:-scrollY on open; restore via window.scrollTo on close (CSS-Tricks pattern, RESEARCH §4)"

key-files:
  created: []
  modified:
    - src/components/MobileNav.astro
    - .planning/phases/05-responsive-design/05-AUDIT.md

key-decisions:
  - "Stored scroll position in document.body.style.top (negative px string) as the single source of truth — no separate variable needed because the body inline style survives across closures (RESEARCH §4 pattern)"
  - "1024+ columns marked N/A: overlay nav is hidden at md+ per Phase 2 D-07 (Header md:hidden), so there is nothing to verify at desktop breakpoints"

patterns-established:
  - "PROVISIONAL-PASS audit-matrix value: when DevTools verifies a fix but the real-device gate is owed to a downstream plan, record PROVISIONAL-PASS rather than PASS to signal the matrix is not yet sign-off ready"

requirements-completed: [NAV-05, RESP-03]

duration: 8min
completed: 2026-05-12
---

# Phase 5 — Plan 03 Summary

**Replaced MobileNav's body-overflow:hidden scroll lock (ineffective on iOS Safari) with the position-fixed + scroll-position capture/restore pattern. All Phase 2 overlay UX behaviors preserved verbatim.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-12
- **Completed:** 2026-05-12
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- `src/components/MobileNav.astro` `open()` now captures `window.scrollY`, sets `body.style.position = 'fixed'`, `top = '-${scrollY}px'`, `width = '100%'`. `close()` parses the stored `top`, clears all three inline styles, and restores via `window.scrollTo(0, scrollY)`.
- Zero references to `body.style.overflow` remain in the file.
- All Phase 2 D-09 to D-12 locked behaviors (Esc, backdrop, focus trap, animations, ARIA, focus restore, `requestAnimationFrame` initial-focus) are byte-identical.
- Audit matrix: MobileNav trigger row → PASS×2 + N/A×2; MobileNav overlay row → PROVISIONAL-PASS (375) / PASS (768) / N/A×2; Pre-Identified Failures row annotated `RESOLVED in b2716b3`.
- `npm run typecheck` → 0 errors / 0 warnings (same 13 zod-deprecation hints, unrelated).
- `npm run build` → 7 pages in 2.54s, clean.

## Task Commits

1. **Task 1: Replace overflow scroll-lock with position-fixed + scroll capture** — `b2716b3` (fix)
2. **Task 2: Audit-matrix update** — bundled with this summary commit

## Files Created/Modified
- `src/components/MobileNav.astro` — `open()` and `close()` script blocks rewritten; surrounding overlay behaviors untouched
- `.planning/phases/05-responsive-design/05-AUDIT.md` — two matrix rows filled + pre-identified-failure row annotated

## Decisions Made
- **Used inline `document.body.style.top` as the scroll-position store** rather than a closure variable: the inline style is observable on the DOM, debuggable in DevTools, and the parseInt round-trip is cheap. Matches the canonical CSS-Tricks pattern verbatim.
- **`PROVISIONAL-PASS` semantics added to the audit matrix:** the iOS momentum-scroll bug is only discoverable on a real iPhone (RESEARCH §7 Pitfall 2), so DevTools cannot fully sign off the 375 column. The audit row carries this nuance explicitly so 05-07 knows the gate is open.

## Deviations from Plan
None — plan executed exactly as written. The plan's hard-coded line numbers (~92 / ~108) for the two replaced statements matched the file exactly.

## Issues Encountered
None.

## User Setup Required
None.

## Next Phase Readiness
- 05-04 (about/cover image srcset refinement) and 05-05 (FullBleedImage / MDX image migration) are unblocked — neither shares source files with this plan beyond `05-AUDIT.md`.
- 05-07 owns the real-iPhone verification gate. Before sign-off, plan 05-07 must: (1) open MobileNav, (2) attempt to scroll the background, (3) close MobileNav, (4) confirm scroll position is restored without visible jump.

---
*Phase: 05-responsive-design*
*Completed: 2026-05-12*
