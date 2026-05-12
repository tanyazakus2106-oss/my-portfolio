---
quick_id: 260512-vss
description: "fix(hero): swap min-h-screen to layered min-h-screen + min-h-svh for iOS vertical centering"
date: 2026-05-12
status: complete
commits:
  - aee3755
files_changed:
  - src/pages/index.astro
---

# Quick Task 260512-vss — Summary

One-line fix to the home page hero section for iOS Safari vertical-centering. `min-h-svh` layered after `min-h-screen` so modern browsers bound the hero to the *visible* viewport while older browsers retain the `vh` fallback.

## Change (`aee3755`)

`src/pages/index.astro` line 28 — one class added:

```diff
- class="relative min-h-screen -mt-20 pt-20 flex items-center overflow-hidden"
+ class="relative min-h-screen min-h-svh -mt-20 pt-20 flex items-center overflow-hidden"
```

## Verification

- `npm run typecheck` — 0 errors.
- TSC watcher: clean.
- Manual mobile verification pending after deploy.

## Why this works

- `100vh` on iOS Safari = the *largest* viewport (URL bar collapsed). When the URL bar is visible at first page load, the hero section is taller than the visible window, and `flex items-center` centers within the full section. The block ends up below the visible center.
- `100svh` (small viewport height, mid-2022 spec) = the *smallest* viewport — the visible area when browser chrome is at its largest. Centering within this puts the block at the visible window center, where the user expects.
- Layering both classes means modern browsers use the later `min-h-svh` (cascade order), and older browsers without `svh` support silently fall back to `min-h-screen`.

## Tradeoffs

None of practical concern for this project.

- Browser support floor: Safari 15.4 / Chrome 108 / Firefox 101 (mid-2022). Below those versions, behavior is identical to before this change (the `min-h-screen` fallback applies).
- Layout viewport behavior on URL bar collapse: with `svh`, the hero stays the same height when the URL bar collapses, rather than expanding (which `100vh` would do). User experience is unchanged unless you tracked the section height during scroll — visually, the eye sees content stay put.

## Remaining items from the original triage

- **Item 3** — ✦ sparkle glyph rendering tiny on iPhone (inline SVG replacement recommended). Independent and small. Can be done as the next quick task.
