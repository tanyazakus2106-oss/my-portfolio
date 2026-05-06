---
phase: quick
plan: 260506-cur
subsystem: ui-cursor
status: complete
tags: [cursor, animation, accessibility, vanilla-ts]
dependency_graph:
  requires: []
  provides: ["custom cursor singleton overlay"]
  affects: [BaseLayout.astro]
tech_stack:
  added: []
  patterns: ["vanilla TS init function (mirrors src/scripts/scroll-animation.ts)"]
key_files:
  created:
    - src/components/CustomCursor.astro
    - src/scripts/cursor.ts
  modified:
    - src/layouts/BaseLayout.astro
decisions:
  - "Style block uses is:global because selectors target body[data-cursor-ready]/[data-cursor-state] — Astro scoping would rewrite those and break the selector"
  - "z-index: 10000 (one above the body::after noise overlay at 9999) so the cursor renders crisp over the texture"
  - "Hover state shrinks the dot via width/height (not transform: scale()) to avoid fighting the JS-written translate3d"
  - "Hard-disable on (hover: none), (pointer: coarse), and prefers-reduced-motion via CSS media query AND JS bail — defense in depth"
  - "Skipped mix-blend-mode: difference — --color-accent (#6F5FD5 light / #8776F9 dark) reads cleanly on both themes; revisit if cursor disappears over accent surfaces"
  - "Skipped the DRAG variant from the reference site — no horizontal drag galleries exist yet"
metrics:
  duration: "~15 minutes"
  completed_date: "2026-05-06"
  tasks_completed: 7
  tasks_total: 7
  files_created: 2
  files_modified: 1
  bundle_cost: "~1.7KB inline JS + ~700B CSS (Astro inlined the script under its hoisting threshold)"
---

# Quick Task 260506-cur — Custom Cursor Effect

## Outcome

Added a desktop-only custom cursor inspired by [cedricith.com/work](https://www.cedricith.com/work):

- A 12px ringed dot follows the mouse with a fast lerp (`0.35`)
- A 56px filled accent-colored blob trails behind with a slower lerp (`0.18`), invisible by default
- Hovering any `a`, `button`, `[role="button"]`, `.featured-card`, or `.project-card` fades the blob in to `0.85` opacity and shrinks the dot to 6px

Disabled entirely (no listeners attached, `display: none` on the markup) when any of:
- `prefers-reduced-motion: reduce`
- `(hover: none)` (touch devices)
- `(pointer: coarse)` (stylus / TV remote)

## Reverse Path

Two equivalent options:

```bash
# A — full revert
git revert <commit-hash>
```

```bash
# B — surgical removal
rm src/components/CustomCursor.astro src/scripts/cursor.ts
```
Then in `src/layouts/BaseLayout.astro`, delete:
- `import CustomCursor from "../components/CustomCursor.astro";`
- `<CustomCursor />`

## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | 0 errors, 0 warnings (13 pre-existing hints unrelated) |
| `npm run build` | 7 pages built in 4.4s, no errors |
| Cursor markup in `dist/index.html` | Present after `</footer>` |
| Cursor JS shipped | Inlined in HTML (~1.7KB minified) |
| Reverse path lines counted | 2 in BaseLayout + 2 new files = single-commit revert |

## Manual Test Plan (run in browser)

1. `npm run dev`
2. Hover header nav links, project cards on `/work`, footer icons → blob fades in, dot shrinks
3. Toggle dark mode → cursor still visible (uses `--color-accent` token)
4. DevTools → Rendering → emulate "prefers-reduced-motion: reduce" → cursor hidden
5. Resize to mobile width OR DevTools "responsive" mode → cursor hidden (`(hover: none)` matches)
6. Tab away from window → cursor fades; tab back → cursor reappears
