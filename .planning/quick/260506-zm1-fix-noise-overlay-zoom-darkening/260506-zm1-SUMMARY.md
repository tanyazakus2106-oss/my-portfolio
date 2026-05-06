---
quick_id: 260506-zm1
description: Fix dark rectangular regions appearing on zoom+scroll
date: 2026-05-06
status: complete
commits:
  - 8a9aa88
files_changed:
  - src/styles/global.css
---

# Quick Task 260506-zm1 — Summary

## What changed

`src/styles/global.css`:

- Added `position: relative` to the `body` rule so it acts as the containing block for the noise overlay.
- Changed `body::after` from `position: fixed` to `position: absolute`. Other declarations (`inset`, `opacity: 0.035`, `z-index: 9999`, the SVG `background-image`, repeat, size) are unchanged.
- Added a one-line comment explaining the `absolute` choice so a future reader doesn't "fix" it back to `fixed`.

Net diff: +3 / -1.

## Why

The fixed-positioned pseudo-element was sized to the layout viewport. When the user zoomed the browser in (Cmd+) and scrolled, regions outside that rectangle never received the +3.5% noise lightening and read as darker bands against the noise-painted area. Switching to `absolute` anchored to body sizes the overlay to the full document height and scales correctly under zoom.

## Verification

- `git diff` shows exactly the 3 expected lines changed.
- `grep` confirms no remaining `position: fixed` in the noise overlay block.
- Visual intent preserved: noise still sits above content (`z-index: 9999`, `pointer-events: none`).

## Notes for future sessions

- A second, smaller contributor to perceived darker bands on zoom is the particles canvas in `src/components/ParticlesBg.astro` — it re-initializes on `visualViewport.resize` with a 200ms debounce, leaving a brief unpainted strip during that window. Not addressed in this task; revisit if it remains visible after this fix.
- `body { position: relative }` is now load-bearing for any future absolute pseudo-elements anchored to body. Don't remove it without auditing.
