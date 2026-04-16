---
phase: 3
slug: work-index-case-studies
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-16
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro build (`astro build`) + `astro check` (TypeScript) |
| **Config file** | `astro.config.mjs` (existing) |
| **Quick run command** | `npm run dev` (verify in browser at localhost:4321) |
| **Full suite command** | `npm run build && npx astro check` |
| **Estimated runtime** | ~15–30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` to confirm no build errors
- **After every plan wave:** Run `npm run build && npx astro check` full suite
- **Before `/gsd-verify-work`:** Full suite must be green + all routes manually verified in browser
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 0 | HERO-01 | — | N/A | build | `npm run build` | ✅ W0 | ⬜ pending |
| 3-01-02 | 01 | 1 | HERO-02, HERO-03 | — | N/A | build+manual | `npm run build` + browser check | ✅ W0 | ⬜ pending |
| 3-02-01 | 02 | 1 | WORK-01, WORK-02, WORK-03 | — | N/A | build | `npm run build` | ✅ W0 | ⬜ pending |
| 3-02-02 | 02 | 1 | WORK-04, WORK-05 | — | N/A | build+manual | `npm run build` + browser hover check | ✅ W0 | ⬜ pending |
| 3-02-03 | 02 | 2 | WORK-06, POL-01 | — | N/A | build+manual | `npm run build` + scroll check | ✅ W0 | ⬜ pending |
| 3-03-01 | 03 | 1 | CASE-01, CASE-02 | — | N/A | build | `npm run build` | ✅ W0 | ⬜ pending |
| 3-03-02 | 03 | 1 | CASE-03, CASE-04 | — | N/A | build+manual | `npm run build` + route check | ✅ W0 | ⬜ pending |
| 3-03-03 | 03 | 2 | CASE-05 | — | N/A | build+manual | `npm run build` + image check | ✅ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Verify `entry.id` values by logging `getCollection('projects')` output during `npm run dev` — confirms slug frontmatter overrides id correctly before route logic is written
- [ ] Confirm `npm run build` passes from Phase 2 baseline (clean slate before Phase 3 changes)

*Existing infrastructure: No test framework required — Astro build + TypeScript check are the validation tools for a static portfolio site.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero copy reads as confident and non-generic | HERO-02 | Subjective copy quality | Read hero text — should not start with "Hi, I'm" and should state role/specialty directly |
| Hover animation on work cards (scale + shadow) | WORK-05 | CSS animation requires browser | Hover over each card at /work — image should scale ~1.05, shadow appears, 250–300ms |
| Scroll fade-up animation timing feels subtle | WORK-06 | Animation feel is subjective | Scroll down /work and /projects/[slug] — cards should fade up smoothly, not jarring |
| `prefers-reduced-motion` disables animations | POL-01 | Requires browser devtools override | In DevTools, enable "Prefer reduced motion" emulation — elements should be visible immediately with no animation |
| Next/prev navigation wraps correctly | CASE-04 | Logic correctness + UX | On first project, "Previous" wraps to last. On last project, "Next" wraps to first |
| Full-bleed image breaks out of content column | CASE-05 | CSS layout requires visual check | In a case study MDX, use `<FullBleedImage>` — image should extend to viewport edges |
| Featured projects on homepage show only `featured: true` | HERO-03 | Data filter correctness | Only projects with `featured: true` in frontmatter appear in homepage preview grid |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
