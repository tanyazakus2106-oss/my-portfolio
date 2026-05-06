---
quick_id: 260506-zm3
description: Rename --color-dominant to --color-background
date: 2026-05-06
status: complete
commits:
  - 7f3c3cc
files_changed:
  - src/styles/global.css
  - src/components/Header.astro
  - src/components/MobileNav.astro
  - src/layouts/BaseLayout.astro
---

# Quick Task 260506-zm3 — Summary

## What changed

Pure rename refactor — `--color-dominant` → `--color-background` across all live source. **Values unchanged.**

Sites touched (7 total):
- `src/styles/global.css` — 4 token definitions (light `@theme`, `@media (prefers-color-scheme: dark)`, `:root.dark`, `:root.light`)
- `src/layouts/BaseLayout.astro` — body bg utility
- `src/components/Header.astro` — sticky-scrolled bg via `color-mix`
- `src/components/MobileNav.astro` — full-screen overlay bg utility

Net diff: +7 / −7.

## Why

`--color-dominant` was idiosyncratic naming. `--color-background` is the standard, immediately-readable name for a page-bg token. Aligns with how every other CSS framework / design system in the wild names this concept, and removes a minor cognitive tax for anyone reading the codebase fresh.

## Out of scope (intentional)

Historical planning docs in `.planning/phases/` reference `--color-dominant` as a record of what was implemented at the time. They are frozen records and were not modified — `git blame`/`git log` will surface the rename for any future reader who searches those docs.

## Verification

- `grep -rn "color-dominant" src/` → 0 matches.
- `grep -rn "color-background" src/` → 7 matches (4 defs + 3 references).
- Diff is exactly +7/−7 — no incidental changes.

## Notes for future sessions

- The four `--color-*` tokens that remain in the palette (`--color-background`, `--color-secondary`, `--color-text-primary/secondary`, `--color-border`, `--color-accent`, `--color-destructive`) now follow a consistent semantic naming pattern.
- If any future doc adds a new color tier (e.g., a third surface level), `--color-surface` or `--color-elevated` would slot in cleanly alongside the existing names.
