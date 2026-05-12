---
quick_id: 260512-vhl
description: "perf(particles): vendor particles.js, slim count, drop line-linking, drop touch interactivity"
date: 2026-05-12
mode: quick
---

# Quick Plan 260512-vhl

Optimize the hero particles layer for mobile performance without removing it. Four targeted changes, all in one atomic commit since they share a single concern.

## Task 1 — Vendor `particles.js` locally

**Done in working tree:** downloaded `particles.min.js` v2.0.0 from `cdn.jsdelivr.net` (Vincent Garreau, MIT, ~23KB minified) to `public/js/particles.min.js`. Same-origin load = no third-party DNS/TLS, eliminates CDN-outage failure mode, served from the same Cloudflare edge as the HTML.

**Header rule:** add a `/js/*` block to `public/_headers` with `Cache-Control: public, max-age=604800` (1 week — same policy as `/images/*`). The vendored library is small and effectively immutable until we explicitly update the version.

## Task 2 — Slim the particle config

**File:** `src/components/ParticlesBg.astro`

Three runtime config changes:

1. **`number.value: 100` → `30`.** Cuts per-frame work by ~70%. With the existing `value_area: 800`, density is still visually full (3-4 visible at any moment); the heavy lift was the line-linked O(n²) work, not the dot count.
2. **`line_linked.enable: true` → `false`.** The dominant cost in the original config (drawing lines between every nearby pair, every frame). Visual cost: no more connecting lines anywhere — including desktop. The `interactivity.modes.grab` mode (lines-on-hover) becomes a no-op as a result; left in config in case future tuning re-enables `line_linked` for desktop.
3. **Touch-device interactivity gate.** Wrap `onhover` and `onclick` events with `!isTouch` where `isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches`. Saves the event-listener bookkeeping cost on phones/tablets, where these events were meaningless anyway. `resize: true` stays — the canvas needs to respond to viewport changes.

**Script source change:** `script.src = '/js/particles.min.js'` (was `https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js`).

## Verification

- Mobile (real device or DevTools emulation, <768px): hero loads faster, no connecting lines, no perceptible JS hitch.
- Desktop: still see drifting dots (now ~30, no lines). Mouse hover does nothing visually (since line-linked is off). Click still spawns new particles (push mode).
- DevTools Network panel: `particles.min.js` should load from `tanyazakus.com/js/particles.min.js` (not from `cdn.jsdelivr.net`).
- DevTools Performance recording: per-frame scripting time on the hero should drop noticeably (was the dominant cost on the home page).

## Tradeoff acknowledged

Desktop also loses connecting lines. User explicitly requested `disable line_linked` without qualifying as mobile-only, so applying globally. Re-enabling for desktop would require a `!isTouch` gate on the `enable` flag itself — easy to do in a follow-up if the desktop visual is missed.
