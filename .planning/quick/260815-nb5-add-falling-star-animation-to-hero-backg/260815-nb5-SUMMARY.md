---
quick_id: 260815-nb5
description: Add falling-star animation to hero background
date: 2026-08-15
status: complete
---

# Quick Task 260815-nb5 — Summary

Added an intermittent shooting-star layer to the hero, sitting above
`ParticlesBg` and below the hero copy. Reference was meganyap.me.

## Changes

- **New** `src/components/ShootingStars.astro` — 5 CSS-animated stars, no JS.
  Each `<span>` is the trail (gradient into `--color-accent`), its `::after` is
  the glowing head. One `@keyframes shoot` moves the star down-left along a
  `rotate(135deg)` local axis.
- **Edited** `src/pages/index.astro` — import plus `<ShootingStars />`
  immediately after `<ParticlesBg />` in the hero section (2 lines).

## Design notes

Intermittency is encoded in the keyframes, not scheduled: the streak runs
between 0% and 6% of the cycle and the star sits invisible at its end position
for the remaining 94%. Cost is five composited `transform`/`opacity` animations
and zero JavaScript.

### Timing matched to meganyap.me

The reference numbers were measured live from that site's running animations
rather than eyeballed. It spawns one-shot `shoot` animations from JS:

| | meganyap.me (measured) | this implementation |
|---|---|---|
| streak duration | 1.37–1.99s (mean 1.76s) | 1.68–1.92s |
| travel distance | 830–1150px | 958–1094px |
| speed | ~570px/s | 570px/s (all five) |
| gap between stars | 5.0–6.9s | 5.8s, drifting |
| angle | 153–161deg | 154deg |
| trail length | 56–66px | 56–66px |
| concurrent stars | 1 | 1 |

Their spawn interval is randomized in JS. CSS can't randomize, so cadence comes
from geometry instead: five stars on ~30s cycles with delays a fifth of a cycle
apart put exactly one star on screen every ~5.8s. Cycle lengths are staggered
28/29/30/31/32s so the relative phases drift apart over time and the sequence
stops sounding like a metronome. Each star's `--travel` is set so
`travel ÷ streak duration` lands on 570px/s regardless of its cycle length.

## Verification

- `npm run typecheck` — 0 errors (30 files)
- Prettier — clean
- Browser, light mode: streaks render in `#553ee5`, visible against the
  near-white hero
- Browser, dark mode: color follows the theme toggle to `#8776f9` with no JS
  (token-driven), verified by toggling `.dark` on `<html>`
- Animation timeline sampled by pinning `currentTime`: every star measured at
  570px/s, 154deg, streak 1.68–1.92s, then invisible through the rest of its
  cycle
- `prefers-reduced-motion: reduce` rule confirmed present in the compiled
  stylesheet: `.shooting-stars { display: none; }`

## Known / follow-ups

- Dark mode reads noticeably fainter than light mode. Accurate to the
  "restrained" design preference, but if more presence is wanted the single
  dial is the `0.55` opacity in the keyframes.
- Unrelated pre-existing issue observed while testing: the hero word-entrance
  animation never applies `is-ready` in dev, so hero text sits at `opacity: 0`.
  Confirmed against unmodified `HEAD` — not caused by this task. Untouched.
