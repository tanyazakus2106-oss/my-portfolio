---
quick_id: 260512-vss
description: "fix(hero): swap min-h-screen to layered min-h-screen + min-h-svh for iOS vertical centering"
date: 2026-05-12
mode: quick
---

# Quick Plan 260512-vss

One-line fix. The hero section on the home page appears vertically off-center on iPhone Safari because `min-h-screen` resolves to `100vh`, which iOS treats as the *largest* viewport (URL bar collapsed). When the URL bar is visible the section is taller than the visible window — `flex items-center` centers within the full section box, leaving content visually below the visible center.

## Change

**File:** `src/pages/index.astro`
**Line 28** — append `min-h-svh` to the hero section:

```diff
- class="relative min-h-screen -mt-20 pt-20 flex items-center overflow-hidden"
+ class="relative min-h-screen min-h-svh -mt-20 pt-20 flex items-center overflow-hidden"
```

## Why layered, not replaced

`min-h-screen min-h-svh` (rather than `min-h-svh` alone) is belt-and-suspenders:

- `svh` (small viewport height) is Safari 15.4+ / Chrome 108+ / Firefox 101+ — fine for a 2026 portfolio.
- On any older browser that doesn't recognize `min-h-svh`, the `min-h-screen` declaration earlier in the cascade still applies as a fallback. Modern browsers see both and the later `min-h-svh` wins.
- Zero cost: one extra Tailwind class, no JS, no runtime check, no breakage path.

## What stays the same

- The `-mt-20 pt-20` sticky-header overlap pattern is unchanged. The section still visually starts at the viewport top (because `-mt-20` pulls it under the 80px sticky header) and reserves 80px of internal padding for header overlap. With `svh`, the section height is just bound to the *visible* viewport instead of the *full* viewport — the overlap math is unaffected.
- `flex items-center` still centers the content block within the bounded height.

## Verification

- Desktop: no visible change. `vh` and `svh` are equivalent when there's no shrinking browser chrome.
- iPhone Safari, page first load (URL bar visible): hero content block should now sit at the visible window center.
- iPhone Safari, after scrolling slightly (URL bar collapses): hero is still svh-tall (which equals the small viewport — content stays put rather than shifting on URL bar collapse).
