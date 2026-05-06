---
quick_id: 260506-cur
slug: cursor-effect
description: Add custom cursor (dot + hover blob) inspired by cedricith.com/work
date: 2026-05-06
status: planned
must_haves:
  - src/components/CustomCursor.astro renders three fixed divs and ships scoped styles
  - src/scripts/cursor.ts attaches mousemove + rAF lerp loop only when (hover:fine) and motion is allowed
  - body[data-cursor-state="hover"] toggled when entering a/button/[role=button]/.featured-card/.project-card
  - Cursor hidden until body[data-cursor-ready] is set (no FOUC, no broken state for non-JS users)
  - Single <CustomCursor /> render line in BaseLayout.astro is the only integration point
  - npm run typecheck and npm run build both clean
---

# Quick Task 260506-cur: Add Custom Cursor

## Goal

Add an opt-in custom cursor effect inspired by cedricith.com/work — a small ringed dot that follows the mouse on desktop, with a larger filled blob that fades in over interactive targets. Replaces nothing; the native cursor stays for users on touch devices or with reduced motion.

## Tasks

1. **Component** — `src/components/CustomCursor.astro`
   - Two `<div>`s: `.cursor-dot` (12px ringed circle, `--color-accent` border, transparent fill) and `.cursor-blob` (48px filled disc, `--color-accent` background, `opacity:0` until hover)
   - Container `<div class="custom-cursor">` is `position:fixed; inset:0; pointer-events:none; z-index:1000; opacity:0`
   - Reveal via `body[data-cursor-ready] .custom-cursor { opacity: 1 }` so JS-disabled visitors never see a stuck cursor element
   - Hover state: `body[data-cursor-state="hover"] .cursor-blob { opacity: 0.85; transform: ... scale(1) }`, dot shrinks slightly
   - Hard-hide via `@media (prefers-reduced-motion: reduce), (hover: none), (pointer: coarse) { .custom-cursor { display: none } }`
   - Scoped `<script>import '../scripts/cursor.ts'</script>` at the bottom — Astro bundles + dedupes

2. **Script** — `src/scripts/cursor.ts`
   - `init()` mirrors `scroll-animation.ts` shape: bail on missing matchMedia conditions, attach listeners only on capable devices
   - State: `target = {x, y}` (latest mousemove), `dot = {x, y}` (lerped), `blob = {x, y}` (slower lerp)
   - rAF loop: `dot.x += (target.x - dot.x) * 0.35`; blob uses `0.18`. Write `transform: translate3d(${x}px, ${y}px, 0)` directly via element.style.transform
   - Hover toggling via single document-level `pointerover`/`pointerout` listener (event delegation) checking `e.target.closest(SELECTORS)`
   - First mousemove: set `body[data-cursor-ready]` and seed both positions to avoid initial fly-in from origin
   - Pointer leaves window → fade out (clear `data-cursor-ready`)

3. **Integration** — `src/layouts/BaseLayout.astro`
   - Add import: `import CustomCursor from "../components/CustomCursor.astro";`
   - Add render: `<CustomCursor />` after `<Footer />`
   - Reverse path = delete those two lines + the two new files

## Reverse Path

```bash
# Option A: revert the commit
git revert <hash>

# Option B: surgical removal
rm src/components/CustomCursor.astro src/scripts/cursor.ts
# Then remove the import + <CustomCursor /> lines from src/layouts/BaseLayout.astro
```

## Out of Scope

- The "DRAG" variant from the reference site (no horizontal drag galleries yet)
- `mix-blend-mode: difference` (the accent token's contrast across both themes is acceptable; revisit if the cursor disappears over hero-like accent surfaces)
- Customizing per-page cursor states (e.g. magnetic snap on case-study cards) — could be a follow-up
