---
quick_id: 260706-gvb
title: Align About page content container with unified .container (1200/24px)
status: complete
date: 2026-07-06
commit: b38309f
---

# Quick Task 260706-gvb — Summary

## What changed

`src/pages/about.astro` — the top-level `<article>` wrapper switched from the
bespoke `max-w-[1120px] mx-auto px-[var(--spacing-lg)]` to `class="container"`,
keeping all vertical padding (`pt-*`, `pb-*`, `md:*`). One line, +1/−1.

## Effect

- About content cap goes 1120px → **1200px**; the About page now aligns with the
  home/work page, project detail pages, and its own header/footer.
- Side padding is unchanged (was already `var(--spacing-lg)` = 24px — the "align
  paddings" ask was really a max-width mismatch).
- Section dividers ("How I work" / "Beyond work") now span the same width as the
  header divider.
- This makes About the last page on the shared `.container`; no bespoke
  page-level layout wrappers remain in `src/pages/`.

## Verification

- `npm run typecheck` (astro check): **0 errors**.
- `.container` is pre-existing and proven (task 260706-glv) — no new token or CSS,
  so no full build required beyond typecheck.
- Grep: no `max-w-[1120px]` remains; inner `max-w-[600px]` intro cap preserved.
- `prettier` on the changed file only (already conformant).
- dev server localhost:4321 (HMR) reflects the change live.

## Deferred (not in scope)

Hero `<Image>` `sizes="(min-width:1024px) 560px, ..."` is now a slight
over-estimate (lg column ≈ 544px at 1200 container). 560 ≥ 544 → still resolves a
safe source; left untouched.

## Not committed

Source + docs staged, **not committed** — awaiting owner approval per standing
repo rule.
