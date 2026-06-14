---
quick_id: 260614-woi
description: Morph the mobile menu toggle into a single persistent button (hamburger ⇄ X)
date: 2026-06-14
status: planned
---

# Quick Task 260614-woi: Single morphing mobile menu toggle

## Goal

On mobile, unify the two separate icons (header hamburger `#mobile-nav-trigger` +
overlay close `#mobile-nav-close`) into ONE persistent toggle button that morphs
between the hamburger and the X in place — matching the transform animation on
mariajoaoabrantes.work (mobile). This guarantees the open and closed icons occupy
the exact same screen position and adds a true transform animation rather than a
cross-fade between two elements.

## Decisions (locked)

- **Alignment:** Icon aligns to the real mobile container side padding = `--spacing-lg`
  (24px), NOT 16px. The container token is NOT changed (user confirmed).
- **Animation:** Classic 3-line → X morph. Top line rotates +45° and slides to center,
  middle line fades out, bottom line rotates −45° to center. ~250ms ease-out. Reverse
  on close. `prefers-reduced-motion` → snap with no transition.
- **Architecture:** Single button hoisted to `<body>` above the overlay (z ≥ 70). The
  header (sticky, z-50, backdrop-filter) creates a stacking context that traps children
  below the overlay (z-60), so the button must live above the overlay to stay
  visible/clickable while morphing.

## Tasks

1. **MobileNav.astro** — Replace the two-button structure with one morphing toggle.
   - Render a fixed bar `fixed top-0 inset-x-0 h-20 z-[70] pointer-events-none` whose
     inner `.container flex items-center justify-end` holds the single toggle button
     (`pointer-events-auto`). This mirrors the header's container (24px padding) + 80px
     height + vertical centering, so the icon lands exactly where the hamburger was and
     aligns to 24px with no magic numbers.
   - Button contains a 3-line SVG; each line animated via `transform` + `transform-origin`
     center, toggled by an `.is-open` class on the button.
   - Remove `#mobile-nav-close`. The one button toggles open/close.
   - Update JS: hoist both the fixed bar and the overlay to `<body>`; toggle `is-open`,
     `aria-expanded`, and `aria-label`; preserve body scroll-lock, Esc-to-close,
     backdrop click-to-close, link-click close. Focus trap spans [toggle button, …links].
   - Keep min 44×44 target, focus-visible ring, `@media (hover:none)` no-stuck-hover.

2. **Header.astro** — Replace the mobile slot's `<MobileNav />` content position with a
   44px spacer (`md:hidden ml-6 w-11 h-11`) so the ThemeToggle does not shift right when
   the real button is hoisted out of flow. `<MobileNav />` still renders (it emits the
   hoisted bar + overlay), but its in-header footprint is a reserved spacer.

## Verify

- `npm run typecheck` → 0 errors.
- Closed state visually identical to current; theme toggle does not shift.
- Tap morphs hamburger → X in place, 24px from right edge, vertically centered in 80px header.
- X sits exactly where the hamburger was.
- `prefers-reduced-motion` snaps without animating.
