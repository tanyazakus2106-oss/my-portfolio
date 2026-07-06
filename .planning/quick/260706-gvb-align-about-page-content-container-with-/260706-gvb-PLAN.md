---
quick_id: 260706-gvb
title: Align About page content container with unified .container (1200/24px)
status: complete
date: 2026-07-06
---

# Quick Task 260706-gvb — Align About page onto the unified `.container`

## Goal

Bring the About page's content shell into line with the home/work and project
detail pages (and its own header/footer), all of which now use the shared
`.container` (1200px cap, fixed 24px gutter). About was the last page still on a
bespoke wrapper.

## Context / prior art

- Follows `260706-glv`, which unified `.container` to 1200/24px and de-duplicated
  the project detail page onto it.
- About's wrapper was `max-w-[1120px] mx-auto px-[var(--spacing-lg)]` — the side
  padding (24px) already matched `.container`; only the **max-width differed**
  (1120 vs 1200), leaving About ~40px more inset per side and 80px narrower than
  the rest of the site, and misaligned with its own chrome.

## Tasks

### Task 1 — Swap the About article wrapper to `.container`

**Files:** `src/pages/about.astro`

**Action:** On the top-level `<article>` (line 11), replace
`max-w-[1120px] mx-auto px-[var(--spacing-lg)]` with `container`, preserving the
vertical padding classes:
`pt-[var(--spacing-2xl)] pb-[var(--spacing-4xl)] md:pt-[var(--spacing-3xl)] md:pb-[148px]`.

**Do NOT change:** the hero grid, the hero `<Image>` `sizes` attribute, the
`max-w-[600px]` intro paragraph cap, or any vertical spacing.

**Verify:** About content cap is now 1200px / 24px; renders aligned with header,
footer, home, and project pages; section dividers span the same width as the
header divider.

**Done:** No bespoke `max-w-[1120px]` wrapper remains on the About page.

## Note (deferred, not in scope)

The hero `<Image>` `sizes="(min-width: 1024px) 560px, ..."` hint is now a slight
over-estimate (real lg column ≈ 544px at the 1200px container). 560 ≥ 544, so it
still resolves a safe (slightly larger) source — no correctness issue. Left
untouched per task boundary.

## Post-execution

- `npm run typecheck` — clean
- `npm run format` on the changed file only (full-repo format avoided per repo memory)
- HOLD before commit — owner approval required (standing repo rule).
