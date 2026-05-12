---
quick_id: 260512-wjo
description: "fix(about): mobile-only margin-bottom on section titles (How I work / Beyond work) — reduce 48px grid gap to 24px margin"
date: 2026-05-12
status: complete
commits:
  - e92ff1a
files_changed:
  - src/pages/about.astro
---

# Quick Task 260512-wjo — Summary

Tightened mobile spacing between section titles and their bodies in About. Two sections affected (How I work, Beyond work), same class change to each.

## Change (`e92ff1a`)

`src/pages/about.astro` — 4 lines changed, 4 lines added:

- Section: `gap-[var(--spacing-2xl)]` → `lg:gap-[var(--spacing-2xl)]`
- h2: appended `mb-[var(--spacing-lg)] lg:mb-0`

Net: on mobile the title now sits 24px above the body (instead of 48px); desktop layout (lg+ column gap) unchanged.

## Verification

- `npm run typecheck` — 0 errors.
- The TSC watcher in the background was already running; no rebuild errors.
- Manual visual: pending user reload on `localhost:4321` or live site after push.
