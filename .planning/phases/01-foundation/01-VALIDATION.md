---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-12
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro's built-in build check (`astro build`) + `astro check` (TypeScript) |
| **Config file** | `astro.config.mjs` (created in Wave 1) |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npx astro check` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npx astro check`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| scaffold | 01 | 1 | FOUND-01 | — | N/A — static site, no auth surface | build | `npm run dev -- --host 0.0.0.0 && curl -s http://localhost:4321/ \| grep -q 'Tanya'` | ❌ W0 | ⬜ pending |
| schema | 01 | 1 | FOUND-02 | — | N/A | build | `npm run build` | ❌ W0 | ⬜ pending |
| layout | 01 | 2 | FOUND-03 | — | N/A | build | `npm run build && npx astro check` | ❌ W0 | ⬜ pending |
| deploy | 01 | 3 | FOUND-04 | — | N/A — static CDN deployment | manual | N/A (manual verification via Cloudflare Pages URL) | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Astro project scaffolded with `npm run build` script in `package.json`
- [ ] `astro.config.mjs` present and valid

*All verification in this phase relies on Astro's built-in build + type checking. No additional test framework installation required.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cloudflare Pages preview deploy live | FOUND-04 | Requires external Cloudflare account setup; cannot be automated locally | Push to main branch, confirm deploy succeeds in Cloudflare Pages dashboard, confirm URL is publicly accessible |
| `npm run dev` starts with no errors | FOUND-01 | Requires browser check for visual confirmation | Run `npm run dev`, open http://localhost:4321, confirm no console errors |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
