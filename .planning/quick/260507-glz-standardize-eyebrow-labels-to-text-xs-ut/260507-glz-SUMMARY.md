---
phase: 260507-glz
plan: 01
subsystem: typography / design-system
tags: [refactor, typography, tailwind-v4, eyebrow, design-tokens]
requires: []
provides:
  - "Eyebrow label utility: `text-xs uppercase tracking-[0.08em]`"
affects:
  - src/pages/index.astro
  - src/components/ProjectCard.astro
  - src/components/FeaturedCard.astro
tech-stack:
  added: []
  patterns:
    - "Tailwind v4 named utilities (`text-xs`) preferred over arbitrary recipes (`text-[14px] leading-[20px]`)"
key-files:
  created: []
  modified:
    - src/pages/index.astro
    - src/components/ProjectCard.astro
    - src/components/FeaturedCard.astro
decisions:
  - "Drop explicit `leading-[20px]`: Tailwind v4 `.text-xs` ships its own default line-height via `var(--text-xs--line-height)`, owner-verified in DevTools."
  - "Use Tailwind named utility instead of arbitrary value to align with prior body-text standardization (260507-g17)."
metrics:
  duration: ~2 min
  completed: 2026-05-07
  tasks: 1
  files: 3
  commits: 1
---

# Phase 260507-glz Plan 01: Standardize Eyebrow Labels to text-xs Utility — Summary

Replaced the arbitrary `text-[14px] leading-[20px]` recipe with the Tailwind v4 named `text-xs` utility across all 3 eyebrow `<p>` elements (home hero, ProjectCard, FeaturedCard) for design-system coherence — net visual shift 14px/20px → 12px/16px.

## What Changed

Three single-line class-attribute edits, no other modifications:

| File | Line | Before | After |
| ---- | ---- | ------ | ----- |
| `src/pages/index.astro` | 26 | `text-[14px] leading-[20px] uppercase tracking-[0.08em] font-normal text-[var(--color-text-secondary)]` | `text-xs uppercase tracking-[0.08em] font-normal text-[var(--color-text-secondary)]` |
| `src/components/ProjectCard.astro` | 51 | `text-[14px] leading-[20px] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]` | `text-xs uppercase tracking-[0.08em] text-[var(--color-text-secondary)]` |
| `src/components/FeaturedCard.astro` | 50 | `text-[14px] leading-[20px] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]` | `text-xs uppercase tracking-[0.08em] text-[var(--color-text-secondary)]` |

All other typography surfaces — hero H1, hero lede, card titles (`text-[36px]`), case-study `<dd>` labels (`text-sm`), and footer/header microcopy — were intentionally left untouched.

## Verification Gate Results

- **`npm run typecheck`** — clean: 0 errors, 0 warnings, 15 hints. (The hints are pre-existing in `content.config.ts` and `BaseLayout.astro`; not introduced by this change.)
- **`grep -rn "text-\[14px\] leading-\[20px\] uppercase" src/`** — 0 matches (old recipe fully retired).
- **`grep -rn "text-xs uppercase tracking-\[0.08em\]" src/`** — exactly 3 matches, one per file above.
- **`git diff --name-only HEAD~1 HEAD`** — exactly the 3 expected files.
- Post-commit deletion check — no files deleted.

## Commits

| Task | Description | Commit |
| ---- | ----------- | ------ |
| 1 | refactor(typography): standardize eyebrow labels to text-xs utility | `ef6c419` |

## Deviations from Plan

None — plan executed exactly as written. All three substitutions applied verbatim, all guardrails respected, all verification gates passed first try.

## Decisions Made

- **Drop `leading-[20px]` explicitly.** Tailwind v4's `.text-xs` ships both `font-size: var(--text-xs)` and a default line-height via `var(--text-xs--line-height)`. Owner DevTools-verified before authoring the plan. Keeping `leading-[20px]` would have re-introduced the arbitrary value the refactor exists to remove.
- **No font-family changes.** The known `--font-sans: "Satoshi"` vs intended Inter divergence (per CLAUDE.md "Design Preferences") is out of scope; this plan only swaps the size/leading recipe.

## Self-Check: PASSED

- FOUND: src/pages/index.astro (line 26 contains `text-xs uppercase tracking-[0.08em] font-normal text-[var(--color-text-secondary)]`)
- FOUND: src/components/ProjectCard.astro (line 51 contains `text-xs uppercase tracking-[0.08em] text-[var(--color-text-secondary)]`)
- FOUND: src/components/FeaturedCard.astro (line 50 contains `text-xs uppercase tracking-[0.08em] text-[var(--color-text-secondary)]`)
- FOUND: commit `ef6c419` in `git log --oneline`
