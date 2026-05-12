---
phase: 06-deployment
plan: "02"
subsystem: pre-launch-qa
status: completed
tags:
  - lighthouse
  - lychee
  - cspell
  - mailto
  - pre-launch-qa
dependency_graph:
  requires:
    - "06-01: edge config files (cspell.json, _headers, _redirects, robots.txt)"
  provides:
    - "lychee broken-link audit: zero real broken links (SC4)"
    - "cspell zero-error dictionary (SC4)"
    - "Lighthouse mobile baseline: 0.86 performance (SEO-05)"
    - "perf-pass-decision: pass by default, no surgical fixes needed"
    - "mailto E2E human verification: PASS — Plan 03 unblocked"
  affects:
    - "Plan 03: Cloudflare dashboard cutover (cleared for go-ahead)"
    - "Plan 04: code cutover (will re-run Lighthouse against production hostname)"
tech_stack:
  added:
    - "lychee v0.24.2 (dev-time only — binary installed locally, not in package.json)"
  patterns:
    - "lychee --base-url (deprecated --base accepted): scan dist/ HTML + JSON + text files"
    - "cspell iterate-until-clean: run → categorize → fix or add-to-dict → repeat"
    - "lighthouse --form-factor=mobile (not --preset=mobile — that flag does not exist)"
key_files:
  created:
    - .planning/phases/06-deployment/lychee-report.txt
    - .planning/phases/06-deployment/lighthouse-mobile-baseline.html
    - .planning/phases/06-deployment/lighthouse-mobile-baseline.json
    - .planning/phases/06-deployment/perf-pass-decision.md
    - .planning/phases/06-deployment/mailto-e2e-evidence.md
  modified:
    - cspell.json
decisions:
  - "Lighthouse mobile performance 0.86 — PASS by default. No surgical perf fixes needed. Astro 6 + Phase 5 image work already exceeds the 0.80 SEO-05 gate."
  - "lychee v0.24.2 flag changes: --exclude-mail removed (mail excluded by default); --base deprecated in favor of --base-url. Both handled as deviation Rule 1 auto-fix."
  - "robots.txt sitemap URL (tanyazakus.com) is an expected false positive in lychee — domain not yet live; exit code 0 confirms no real broken links."
  - "Mailto evidence captured as PASS via verbal owner confirmation rather than send/arrival timestamps — SC4 gate is a functional check, not a deliverability measurement."
metrics:
  duration: "~5 minutes scripted + ~5 minutes human verification"
  completed_date: "2026-05-12"
  tasks_completed: 4
  tasks_total: 4
  files_created: 6
  files_modified: 1
---

# Phase 6 Plan 02: Pre-Cutover QA Summary

Ran the four SC4 pre-launch QA gates against the preview deploy. Baseline Lighthouse mobile performance is 0.86 — above the SEO-05 gate, so no surgical performance fixes are required. Zero real broken links found. cspell tuned to zero-error. Mailto E2E verified by the site owner: footer link resolves correctly and the test send arrives in Inbox (not Spam). All four SC4 gates pass — Plan 03 (Cloudflare cutover) is cleared to proceed.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install lychee + run broken-link audit against dist/ | fce19ac | .planning/phases/06-deployment/lychee-report.txt |
| 2 | Run cspell across MDX/Astro/Markdown and tune dictionary to zero-error | 6c9a006 | cspell.json |
| 3 | Capture baseline Lighthouse mobile report against preview URL | 6fd7eab | lighthouse-mobile-baseline.html, .json, perf-pass-decision.md |
| 4 | Manual mailto E2E send-and-receive test | 6e2d443 | mailto-e2e-evidence.md |

## Task 1: Lychee Broken-Link Audit

Lychee v0.24.2 (GitHub release binary, macOS x86_64) installed and run against `dist/` after a fresh `npm run build`.

**Results:** 227 links scanned, 184 OK, 42 excluded (linkedin.com + instagram.com false-positives), 7 redirects followed, 1 expected false positive.

**The 1 flagged URL:** `https://tanyazakus.com/sitemap-index.xml` in `robots.txt` line 4 — expected, because the production domain is not yet live (cutover is Plan 03). This is not a broken internal link; it's a robots.txt directive pointing to a future URL. Plan 01 documented this intentional authoring pattern.

**Exit code 0.** SC4 broken-link audit: PASS.

## Task 2: cspell Dictionary Tuning

Initial scan found 28 issues across 11 files. All 28 were legitimate project-specific terms — no real typos in source content.

**Terms added to cspell.json `words` array (13 new entries):**

| Term | Category | Reason |
|------|----------|--------|
| `frontmatter` | Developer term | Standard MDX/Astro concept; appears in README |
| `wireframes`, `Wireframes`, `Wireframing` | UX vocabulary | Core design-process term in case studies |
| `unmoderated` | Research vocabulary | "unmoderated usability test" — legitimate UX research term |
| `affordances` | UX vocabulary | Standard interaction design term (ArrowLink comment) |
| `lede` | Writing term | Journalism term ("don't bury the lede") in about.astro |
| `focusables` | JS variable name | `const focusables = getFocusable()` in MobileNav.astro |
| `reinitialising`, `Reinit` | JS comment/label | ParticlesBg.astro canvas reinitialisation comment |
| `onhover` | particles.js config key | particles.js library config object key (`onhover: { enable: true }`) |
| `destroypJS` | particles.js API | `p.pJS.fn.vendors.destroypJS()` — actual library method name |
| `maxopacity` | JS variable name | SparkEffect.astro animation config property |

No source files required typo fixes. `npx cspell` exits 0 across all 21 files.

## Task 3: Lighthouse Mobile Baseline

**Scores against https://my-portfolio-8h7.pages.dev:**

| Category | Score | Gate | Result |
|----------|-------|------|--------|
| Performance | **0.86** | ≥ 0.80 (SEO-05) | **PASS** |
| Accessibility | 1.00 | — | — |
| Best Practices | 1.00 | — | — |
| SEO | 0.92 | — | — |

**Decision: PASS by default.** No surgical performance fixes needed. Astro 6 + Vite + Lightning CSS tree-shaking + Phase 5 explicit `widths`/`sizes` on high-impact images already deliver 0.86. The `uses-long-cache-ttl` audit (if present) is addressed by Plan 01's `_headers` immutable cache rules for `/_astro/*`. RESEARCH.md guardrail honored — no new npm dependencies added.

## Task 4: Mailto E2E — PASS

Site owner (Tanya Zakus) verified the footer mailto link end-to-end against the preview URL on 2026-05-12:

| Surface | mailto resolves correctly? | Email arrived in Inbox? | Spam? | Result |
|---------|----------------------------|--------------------------|-------|--------|
| Footer email link (`src/components/Footer.astro:9`) | yes (`tanyazakus2106@gmail.com`) | yes | no | **PASS** |

Send/arrival timestamps not captured — verbal owner confirmation accepted since SC4 is a yes/no functional gate, not a deliverability latency measurement.

Evidence committed to `.planning/phases/06-deployment/mailto-e2e-evidence.md` (commit `6e2d443`).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] lychee v0.24.2 flag incompatibilities**
- **Found during:** Task 1
- **Issue:** `--exclude-mail` flag was removed in lychee v0.24.2 (mail excluded by default; `--include-mail` is the opt-in flag). `--base` is deprecated in favor of `--base-url` (accepted with warning, no functional change).
- **Fix:** Removed `--exclude-mail` from invocation. Used `--base` (still accepted). Mail links are correctly excluded by default.
- **Files modified:** None (invocation-only change)
- **Commit:** fce19ac

**2. [Rule 1 - Bug] Lighthouse `--preset=mobile` flag invalid**
- **Found during:** Task 3
- **Issue:** `--preset` only accepts `perf`, `experimental`, `desktop`. `mobile` is not a valid preset value. For mobile simulation, the correct flag is `--form-factor=mobile`.
- **Fix:** Used `--form-factor=mobile` instead.
- **Files modified:** None (invocation-only change)
- **Commit:** 6fd7eab

### Naming Convention

The Task 1–3 commits produced an interim `06-02-SUMMARY.md`. On Task 4 wrap-up the orchestrator renamed it to `06-02-pre-cutover-qa-SUMMARY.md` to match the `{plan_id}-SUMMARY.md` convention established by Plan 01 (`06-01-launch-prep-SUMMARY.md`).

## Threat Surface Scan

No new network endpoints, auth paths, or schema changes introduced. Evidence artifacts (HTML/JSON report, text report, mailto evidence) contain the preview URL and owner email, both already public. No new threat surface.

## Known Stubs

None. All four SC4 gates produced real measurements or verified human evidence.

## Self-Check

- lychee-report.txt exists: FOUND (fce19ac)
- lighthouse-mobile-baseline.html exists: FOUND (6fd7eab)
- lighthouse-mobile-baseline.json exists: FOUND (6fd7eab)
- perf-pass-decision.md exists: FOUND (6fd7eab)
- cspell.json updated: FOUND (6c9a006)
- mailto-e2e-evidence.md exists: FOUND (6e2d443)
- All task commits exist in git log: VERIFIED
- SC4 gates all pass: VERIFIED (lychee=0, cspell=0, lighthouse=0.86, mailto=pass)

## Self-Check: PASSED
