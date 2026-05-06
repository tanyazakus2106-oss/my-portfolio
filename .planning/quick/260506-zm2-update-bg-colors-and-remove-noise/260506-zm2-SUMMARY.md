---
quick_id: 260506-zm2
description: Update dominant bg colors and remove noise overlay
date: 2026-05-06
status: complete
commits:
  - 48c7a3c
files_changed:
  - src/styles/global.css
---

# Quick Task 260506-zm2 — Summary

## What changed

`src/styles/global.css`:

- `--color-dominant` updated in all four locations:
  - Default `@theme` (light): `#FFFFFF` → `#fcfcfc`
  - `@media (prefers-color-scheme: dark) :root`: `#0F0F0F` → `#141414`
  - `:root.dark`: `#0F0F0F` → `#141414`
  - `:root.light`: `#FFFFFF` → `#fcfcfc`
- Removed `body::after` noise overlay block (and its two-line comment).
- Removed `position: relative` from the `body` rule — was load-bearing only for the absolute pseudo-element introduced in 260506-zm1, now unused.

Net diff: +4 / -19.

## Why

The noise overlay produced visible horizontal banding under browser zoom because `feTurbulence`-based SVGs are re-rasterized at every zoom step, and at fractional zoom scales (1.5×, 1.75×) the noise tile boundaries fell on non-pixel-aligned coordinates — neighboring tiles rendered with subtly different luminance and the eye perceived ~338px-tall stripes.

Removing the overlay is the surgical root-cause fix; CLAUDE.md's "minimal aesthetic / fewer decorative flourishes" guidance also supports it.

The new dark `#141414` and light `#fcfcfc` are slight off-blacks/off-whites — gentler than pure `#0F0F0F`/`#FFFFFF` and easier on the eye.

## What was kept

Per user instruction, everything else stays:
- Particles network in the hero (`ParticlesBg.astro`) — unchanged.
- All other color tokens (secondary, text, border, accent, destructive) — unchanged.
- Scroll animations, hero word entrance, dividers, container layout — unchanged.

## Verification

- `grep` on `global.css` shows two occurrences each of `#141414` and `#fcfcfc`, zero of `#0F0F0F` or `#FFFFFF`.
- `body::after` and the `position: relative` declaration on `body` are absent.
- Diff is +4 / -19 — matches expectation.

## Notes for future sessions

- If the particles seam between hero and projects becomes objectionable, options A–C from the prior conversation still apply (extend particles to full document, mask-fade, or remove). User chose to keep particles for now.
- Previous quick task 260506-zm1 introduced and then this task removes both `position: relative` on body and the absolute `body::after` — they were a paired addition/removal. The `body::after` overlay is fully gone from history-of-current-state.
