---
quick_id: 260706-glv
title: Unify horizontal layout onto token-driven .container (1200/24px)
status: complete
date: 2026-07-06
commit: d23a0ed
---

# Quick Task 260706-glv — Summary

## What changed

Collapsed the site's two competing horizontal-layout systems into one
token-driven `.container`. The home/"work" page (and all site chrome that uses
`.container`) now shares the project detail page's inset: **max-width 1200px,
fixed 24px side gutter** — previously 1440px with a fluid `clamp(24px→80px)`
gutter.

### Files

- **`src/styles/global.css`**
  - Added `@theme` token `--layout-max: 1200px` (named `--layout-*`, not
    `--container-*`, to sidestep Tailwind v4's reserved `--container-*`
    namespace).
  - Rewrote `.container`: `max-width: var(--layout-max)` (was `1440px`) and
    fixed `padding-left/right: var(--spacing-lg)` (was the fluid `clamp()`).
- **`src/pages/projects/[id].astro`**
  - Replaced the bespoke `max-w-[1200px] mx-auto px-[var(--spacing-lg)]` wrapper
    with `class="container"` on the back-link, header, and hero-image sections
    (other classes + `--entry-index` preserved).
  - Left the 720px `.case-prose` article reading column untouched (intentional).

## Effect

- Home page and project detail pages now align to the same left edge on every
  desktop viewport (the previous constant ~64px offset at ≥1440px is gone).
- Each page's body now aligns with its own header/footer (they were 1440/fluid
  vs. the body's 1200/24px).
- The project detail page's rendered output is unchanged (it was already
  1200/24px) — this half of the change is pure de-duplication.
- Trade-off (accepted by owner): the whole site loses the wide-screen
  breathing room from the fluid 24→80px gutter; the gutter is now a flat 24px.
  This deliberately reverses quick task `260615-1js`.

## Verification

- `npm run typecheck` (astro check): **0 errors** (pre-existing `z is
  deprecated` hints in content.config.ts are unrelated).
- `npm run build`: **passes**, 7 pages built.
- Built CSS confirmed: `.container{...max-width:var(--layout-max);
  padding-left:var(--spacing-lg);padding-right:var(--spacing-lg)...}`; old
  `clamp(24px…)` gutter fully removed.
- Cascade: custom `.container` (char 39060) is emitted after Tailwind's built-in
  container utility (char 8819) → same specificity, later source wins at all
  breakpoints. Confirmed against pre-change behavior (site rendered at 1440px
  cap above the 1536px `2xl` breakpoint, proving the custom rule already won).
- Formatting: `prettier` run on the two changed files only (both already
  conformant) — full-repo `format` deliberately avoided.
- Visual: dev server on localhost:4321 (HMR) reflects the change live; automated
  browser screenshot skipped (extension not connected).

## Not committed

Per standing repo rule (no commit without explicit owner approval), source +
docs are staged in the working tree but **not committed**. Awaiting go-ahead.
