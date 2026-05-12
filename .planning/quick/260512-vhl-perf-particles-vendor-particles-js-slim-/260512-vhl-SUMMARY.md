---
quick_id: 260512-vhl
description: "perf(particles): vendor particles.js, slim count, drop line-linking, drop touch interactivity"
date: 2026-05-12
status: complete
commits:
  - 6c69b0f
files_changed:
  - public/js/particles.min.js
  - public/_headers
  - src/components/ParticlesBg.astro
---

# Quick Task 260512-vhl — Summary

Hero particles layer optimized for mobile. One atomic commit, four changes united by a single concern (mobile perf).

## Changes (`6c69b0f`)

### Vendor `particles.js` locally

- Downloaded `particles.min.js` v2.0.0 (MIT, Vincent Garreau) from `cdn.jsdelivr.net` to `public/js/particles.min.js` (23,364 bytes, 8 lines).
- Updated `src/components/ParticlesBg.astro` to load from `/js/particles.min.js` instead of the CDN URL.
- Added `/js/*` cache header (`max-age=604800`) to `public/_headers`, matching the policy for `/images/*`. Cloudflare Pages serves the file from the same edge as the HTML — single connection, no third-party DNS/TLS.

### Slim runtime config

| Setting | Before | After | Why |
|---|---|---|---|
| `number.value` | 100 | 30 | ~70% fewer dots to render and animate per frame. |
| `line_linked.enable` | `true` | `false` | This was the dominant per-frame cost (O(n²) nearest-neighbor scan + line draw). Affects desktop too. |
| `onhover.enable` | `true` | `!isTouch` | Hover has no meaning on touch; skip the event-listener cost. |
| `onclick.enable` | `true` | `!isTouch` | Click-to-push particles also dropped on touch. |

`isTouch` is detected once at init via `window.matchMedia('(hover: none) and (pointer: coarse)').matches`. Desktop and tablets-with-mouse still get the click-to-push effect; phones/touch tablets get pure ambient drift.

The `line_linked` block keeps its color/distance/opacity fields — only `enable` was flipped, so re-enabling for desktop later is a one-line change.

## Verification

- `npm run typecheck` — 0 errors, 0 warnings (13 pre-existing `z` deprecation hints in `content.config.ts`).
- TSC watcher log: clean.
- Manual: visit `http://localhost:4321` — particles drift, no connecting lines; on a mobile-emulation viewport, hero loads with no perceptible JS hitch.

## Tradeoffs

- **Desktop loses connecting lines.** User chose the "optimize" path over "disable on mobile only" — applied globally per the request wording ("disable line_linked"). If the desktop visual is missed, gate with `enable: !isTouch` instead. One-line follow-up.
- **Vendored library is bundled into the repo.** 23KB committed binary-ish file. Acceptable for a versioned dependency; if you ever bump the version, replace the file and update `_headers` if the path changes.

## Live-site visual checks (after deploy)

1. DevTools → Network → reload home → confirm `particles.min.js` is served from `tanyazakus.com/js/particles.min.js`, not `cdn.jsdelivr.net`.
2. DevTools → Performance → record 5s of the home page → per-frame scripting time on the hero should be noticeably lower than before.
3. Mobile real-device: open the home page on iPhone Safari → particles appear with no waiting period after first paint.
4. Desktop: confirm dots still drift; clicking the hero spawns 3 new particles (push mode still wired).

## Remaining items from the original triage

User raised three mobile issues. This task addresses item 1 only. Still open:

- **Item 2** — Hero text not vertically centered on iPhone Safari (`min-h-screen` → `min-h-svh` swap)
- **Item 3** — ✦ sparkle glyph rendering tiny on iPhone (inline SVG replacement recommended)

Both are independent of this task and can be addressed as a follow-up quick task.
