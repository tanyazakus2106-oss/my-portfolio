---
phase: 2
slug: navigation-design-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-15
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro Check (`astro check`) — TypeScript type-checking only |
| **Config file** | No dedicated test config; `@astrojs/check` reads `tsconfig.json` |
| **Quick run command** | `npm run typecheck` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~10–20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run typecheck`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** Full build green + manual browser smoke checklist passed
- **Max feedback latency:** ~20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-FOUC | TBD | 1 | POL-02 | — | N/A | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 02-dark-toggle | TBD | 1 | POL-02 | — | N/A | manual | — | ❌ W0 | ⬜ pending |
| 02-header-nav | TBD | 1 | NAV-01, NAV-04 | — | N/A | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 02-hamburger | TBD | 2 | NAV-03 | — | N/A | manual | — | ❌ W0 | ⬜ pending |
| 02-overlay | TBD | 2 | NAV-03 | — | N/A | manual | — | ❌ W0 | ⬜ pending |
| 02-footer | TBD | 2 | FOOT-01, FOOT-02, FOOT-03 | — | `rel="noopener noreferrer"` on external links | smoke + manual | `npm run build` | ❌ W0 | ⬜ pending |
| 02-tokens | TBD | 3 | POL-03, POL-04 | — | N/A | manual | — | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- No new test infrastructure needed — `npm run typecheck` and `npm run build` use already-installed `@astrojs/check` (in devDependencies from Phase 1).

*Existing infrastructure covers all automated validation for Phase 2.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark mode toggle persists across refresh | NAV-02, POL-02 | Requires browser localStorage interaction | 1. Open site. 2. Click dark toggle. 3. Hard refresh (`Cmd+Shift+R`). 4. Verify `.dark` class on `<html>` and correct theme applied. |
| No FOUC on hard reload (dark mode) | POL-02 | Requires visual verification of flash timing | 1. Set theme to dark in localStorage. 2. Hard refresh. 3. Confirm no white flash before dark styles render. |
| Hamburger opens full-screen overlay | NAV-03 | Requires viewport resize + click | 1. Resize to <768px. 2. Click hamburger. 3. Verify full-screen overlay appears with nav links centered. |
| Overlay closes on X, backdrop, Esc | NAV-03 | Requires user interaction testing | Test all three close mechanisms individually. Verify body scroll unlocks after each close. |
| Active nav link highlighted | NAV-04 | Requires navigating between pages | Visit each page (/, /work, /about). Verify accent underline on correct nav link. |
| Footer "Get in touch" mailto | FOOT-03 | Requires click and email client check | Click "Get in touch →". Verify `mailto:tanyazakus2106@gmail.com` opens email client. |
| Typography scale consistent | POL-03 | Visual inspection only | Check heading/body text sizing is uniform across all pages in both light and dark modes. |
| Spacing rhythm consistent | POL-04 | Visual inspection only | Check padding/gap between sections is uniform across all page sections. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
