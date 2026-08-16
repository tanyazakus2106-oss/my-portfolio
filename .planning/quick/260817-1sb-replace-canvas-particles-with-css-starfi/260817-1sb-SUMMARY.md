---
quick_id: 260817-1sb
description: "Replace canvas particles with CSS starfield: glow halos, 4-point sparkles, meganyap timings"
date: 2026-08-17
status: complete
---

# Quick Task 260817-1sb — Summary

Replaced the particles.js canvas in the hero with a DOM starfield carrying glow
halos, twinkle, parallax drift and 4-point sparkles.

## Changes

- **New** `src/components/Starfield.astro` — 116 dots across three rotating
  layers, generated at build time, zero runtime JS
- **Edited** `src/styles/global.css` — added `--color-star` to all four theme
  blocks (`#553ee5` light, `#ffffff` dark)
- **Edited** `src/pages/index.astro` — `ParticlesBg` → `Starfield` (2 lines)
- **Edited** `src/components/ShootingStars.astro` — colour source switched from
  `--color-accent` to `--color-star` so streaks match the dots

`ParticlesBg.astro` and `public/js/particles.min.js` remain in the repo but are
no longer referenced by any page. Reverting is a one-line import change.

## Fidelity revision (final)

After two rounds of custom tweaks (density inflation, accent-flash dots,
halos on every dot), the owner asked to mirror the reference outright. A
deeper extraction of meganyap.me's live CSS found the pieces the first
measurement missed:

- Their big stars are **text glyphs** whose halo is a double
  `text-shadow: 0 0 8px + 0 0 20px @60%` and whose twinkle is a distinct 13s
  flicker (`1 → .5 → .95 → .65 → 1` burst late in the cycle) — not scaled-up
  dots.
- Their **shooting star is monospace text** `──────·` at 13px with
  `letter-spacing .12em`, colour @85%, `text-shadow 0 0 12px @50%`, easing
  `cubic-bezier(.16,.84,.44,1)` (fast launch, decelerating glide) — not a
  gradient line, and not linear.
- Plain dots carry only the small 3–4px glow — no wide halo.

Final state mirrors all of that. Reverted: accent-flash dots, per-dot wide
halos, inflated dot sizes and opacity. Kept: 186 total dots (the owner's −20%
instruction; on-screen density matches the reference's hero), the
`--color-star` token (white dark / accent light — their literal white would
vanish on this site's light hero), the background untouched, and mask-SVG
sparkles rather than font glyphs (shape control; carries the reference's halo
and flicker). Sparkles: 8. The shooting star keeps the CSS-only cadence
mechanism with their in-streak fade points (8% / 90%) mapped to the 6% active
window (0.5% / 5.4%).

Verified on a production preview (dev-server HMR pinned a stale style module;
`npm run build` + `astro preview` served the real thing): 186 dots at
82×1px / 67×1.5px / 24×2px / 13×2.5px-class, opacity 0.26–0.89, glow tiers
`0 0 3px @70%` / `0 0 4px @80%`, sparkle flicker `star-glyph-twinkle` 13s with
50px halo, shooting star text/easing/shadow all reading back exactly.

## Earlier density revision (superseded)

First pass copied the reference counts literally and read far too sparse and
small on the owner's screen. The cause is that only a fraction of the field is
ever on screen: the layer is a fixed square and the viewport is a window onto
it, so a 2160px layer at a 1440px viewport shows roughly a quarter of the dots.
The reference numbers came from a much wider window.

| | first pass | now |
|---|---|---|
| total dots | 116 | 232 |
| dots in a 1440×822 viewport | 29 | 84 |
| sizes | 1 / 1.5 / 2 / 2.5px | 1.5 / 2 / 2.5px + 10px sparkles |
| opacity | 0.25–0.90 | 0.35–1.0 |
| glow | 3px / 4px | 4px / 5px |
| layer size | 2160px | 1800px |
| sparkles | 8 | 16 |

The four dials (`SIZES`, `SPARKLE_PX`, `OPACITY_RANGE`, layer counts) are named
constants at the top of the component's frontmatter for future tuning.

The shooting stars were also switched from `--color-accent` to `--color-star`,
so a streak is always the same colour as the dots — white in dark, accent in
light — reading as a dot breaking loose rather than a separate accent element.

## Original parity with meganyap.me (first pass, superseded above)

| | reference | this implementation |
|---|---|---|
| dot count | 116 | 116 |
| size histogram | 51×1px, 42×1.5px, 15×2px, 8×2.5px | 51×1px, 42×1.5px, 15×2px, 8×**8px** (sparkles) |
| base opacity | 0.25–0.90, median 0.47 | 0.25–0.90, median 0.53 |
| twinkle | 9s, opacity 0.7↔1, random delay | identical |
| glow | `0 0 3px` / `0 0 4px` at 2px+ | identical, `color-mix` off the token |
| layer periods | 360s / 260s / 190s, linear | 360s / 260s / 190s, linear |
| layer size / split | 2160px, 70 / 30 / 16 | 2160px, 70 / 30 / 16 |

The one deliberate deviation is sparkle size, agreed with the owner: a curved
4-point star is not legible at the reference's 2.5px.

## Implementation notes

- **Two opacities on one node.** The span holds the dot's randomised base
  brightness; its `::after` runs the shared twinkle. The compositor multiplies
  them, so 116 dots get individual brightness and a common twinkle without
  doubling the DOM or registering an `@property`.
- **Drift is three transforms, not 116.** Rotating a 2160px layer moves every
  dot inside it, and dots near the centre travel less than those at the rim —
  parallax with no per-dot animation.
- **Sparkles counter-rotate.** A circle doesn't care how its layer is rotated;
  a 4-point star at 45° reads as an X. Each sparkle runs its layer's rotation in
  reverse at the same period. Verified: layer at −90°, sparkle at +90°, net 0.
- **`drop-shadow`, not `box-shadow`, on sparkles.** `box-shadow` follows the
  square border box and would halo a rectangle around the star; `drop-shadow`
  follows the mask's alpha.
- **Seeded PRNG** (mulberry32, fixed seed) so the field is identical on every
  build rather than reshuffling.
- Dropped `will-change: transform` from the layers — with three 2160px squares
  it would pin large textures even when the animation is off under reduced
  motion, and the compositor promotes them during animation anyway.

## Verification

- `npm run build` — clean, 7 pages
- `npm run typecheck` — 0 errors (31 files); prettier clean
- `dist/index.html` contains no reference to `particles.min.js` — the 23KB
  library and its canvas RAF loop no longer load on the home page
- Browser: dot count, size histogram, opacity spread and all three layer periods
  read back exactly as tabled above
- Light mode `#553ee5`, dark mode `#ffffff`, verified through the manual toggle
- Sparkle orientation verified upright at a rotated layer position; shape
  confirmed by zoomed screenshot
- `prefers-reduced-motion`: rotation and twinkle stop, dots stay visible

## Known / follow-ups

- Hover-grab and click-push are gone with the canvas, as agreed.
- Pre-existing and untouched: the hero word-entrance animation never applies
  `is-ready` in dev, so hero text sits at `opacity: 0`. Confirmed against
  unmodified `HEAD` in an earlier task.
