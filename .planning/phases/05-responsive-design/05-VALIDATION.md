---
phase: 5
slug: responsive-design
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-12
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `05-RESEARCH.md` §8 Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual audit + DevTools console snippets. No automated test runner introduced (audit-first phase, see RESEARCH §8 "Why No Automated Test Runner"). |
| **Config file** | None — audit record is `05-AUDIT.md` produced by Wave 0. |
| **Quick run command** | `npm run build && npm run preview` → open DevTools at the target viewport width → run the audit console snippets from RESEARCH §1 + §5. |
| **Full suite command** | All breakpoints (375 / 768 / 1024 / 1440) × all audit rows in `05-AUDIT.md` filled with PASS / COSMETIC / FAIL; every FAIL has a linked fix commit; real-iPhone 375 column verified by Tanya. |
| **Estimated runtime** | ~15 min initial audit per page × 3 pages ≈ 45 min full pass. Re-audit after fixes: ~20 min. |

---

## Sampling Rate

- **After every task commit:** Run `npm run build && npm run preview`, re-verify the specific audit row(s) the commit addresses at the affected breakpoint(s).
- **After every plan wave:** Re-run the overflow console snippet and touch-target getBoundingClientRect snippet on all three pages at all four breakpoints.
- **Before `/gsd-verify-work`:** Full audit suite complete, no FAIL cells open, real-iPhone 375 column verified.
- **Max feedback latency:** ~60 seconds (preview build + DevTools resize + console snippet run).

---

## Per-Task Verification Map

> Filled by the planner after PLAN.md files are drafted. Each row maps a planned task back to a phase requirement and names the reproducible verification method.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 0 | NAV-05, CASE-06, RESP-01, RESP-02, RESP-03 | — | Audit matrix file created with all rows × 4 breakpoint columns and explicit pass/fail criteria per cell. | manual | View `05-AUDIT.md` exists; matrix table present | ❌ W0 | ⬜ pending |
| 05-XX-XX | XX | N | REQ-XX | — | (planner fills) | manual / console-snippet / DevTools | (planner fills) | ❌ W0 / ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Note:** Phase 5 has no unit-test-friendly business logic — every task verifies via the audit matrix or a DevTools console snippet, not a `jest` / `vitest` runner. The planner must put concrete console-snippet commands in each task's `<acceptance_criteria>` so executor can copy-paste-verify.

---

## Wave 0 Requirements

- [ ] `05-AUDIT.md` — audit matrix file (pages × breakpoints × component rows) with empty cells to fill during Wave 1+. Required by every downstream fix task as the verification artifact.
- [ ] Optional: `tests/touch-targets.spec.ts` (Playwright) — only if planner elects to add the lightweight bounding-box verification snippet from RESEARCH §3. Low-cost, high-reproducibility for RESP-03. Treat as opt-in, not blocking.
- [ ] Inventory of existing `<FullBleedImage>` usages and `public/` image paths in `src/content/projects/*.mdx`. Drives the D-06 image-pipeline scope decision.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual layout reflow at 4 breakpoints | RESP-01 | Visual judgment for "cosmetic-awkward-but-functional" 3-state cell semantics requires human eyes. Cannot be automated reliably for a designer's portfolio without a snapshot baseline. | DevTools responsive mode → set viewport to 375 / 768 / 1024 / 1440 → walk every page section → record PASS / COSMETIC / FAIL in `05-AUDIT.md` row. |
| Mobile overlay nav usability on real iOS Safari | NAV-05 | iOS Safari momentum scroll, address-bar collapse, viewport unit behavior, and touch responsiveness differ from desktop emulation. CLS-on-open and scroll-lock can pass in DevTools but fail on device. | Build & deploy preview to a Cloudflare Pages branch deploy → open on real iPhone Safari → exercise hamburger open/close, scroll lock, every overlay link tap. Pass = no scroll bleed, no layout shift, every target tappable on first try. |
| Case study readability on mobile | CASE-06 | Reading-comfort judgment (line length, vertical rhythm, image break placement) is subjective. | Read one full case study end-to-end on a real iPhone. Note any line that wraps awkwardly, any image that crops the wrong part, any prev/next that requires zooming. |
| Real-device image asset selection | RESP-02 | DevTools emulation can lie about DPR-aware srcset selection. | On real iPhone Safari → open `/about` and one case study → Network tab via remote inspector → verify Image responses are ≤800px wide for cover image, ≤1000px for About hero. |
| Horizontal overflow at each breakpoint | RESP-01 | Console snippet is reproducible but the *cause* of overflow needs visual inspection to fix. | Run RESEARCH §5 overflow snippet at each width on each page. If `true`, switch to the visual outline technique to find offender. |
| Touch-target measurement (if no Playwright) | RESP-03 | `getBoundingClientRect()` console snippet from RESEARCH §3 is reproducible without infrastructure. | Run snippet at 375px on every page. Any element returning width or height < 44 is a FAIL row in `05-AUDIT.md`. |

---

## Validation Sign-Off

- [ ] All tasks in 05-XX-PLAN.md files have `<acceptance_criteria>` that name a concrete verification (audit row reference, console snippet, or DevTools step)
- [ ] Sampling continuity: every fix task names the audit row it addresses; no orphaned commits
- [ ] Wave 0 produces `05-AUDIT.md` before any fix tasks begin
- [ ] No watch-mode flags introduced (audit-first phase doesn't need them)
- [ ] Feedback latency < 60s for any single audit cell re-verification
- [ ] `nyquist_compliant: true` set in frontmatter once planner fills in the Per-Task Verification Map

**Approval:** pending
