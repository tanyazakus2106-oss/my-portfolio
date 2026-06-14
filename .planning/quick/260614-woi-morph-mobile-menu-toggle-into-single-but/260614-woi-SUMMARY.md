---
quick_id: 260614-woi
description: Morph the mobile menu toggle into a single persistent button (hamburger ⇄ X)
date: 2026-06-14
status: complete
commit: ff17bcd
---

# Quick Task 260614-woi — Summary

## What changed

Unified the mobile navigation's two separate icons (header hamburger +
overlay close X) into **one persistent toggle button** that morphs in place,
matching the transform animation on mariajoaoabrantes.work (mobile).

### `src/components/MobileNav.astro` (rewritten)
- Single `#mobile-nav-trigger` button inside a fixed bar
  (`fixed top-0 inset-x-0 h-20 z-[70] pointer-events-none`) whose inner
  `.container flex items-center justify-end` mirrors the header — so the icon
  lands at the **24px** (`--spacing-lg`) container padding, vertically centered
  in the 80px header, with no magic numbers.
- Removed the separate `#mobile-nav-close` button; the one toggle opens/closes.
- Icon is three CSS `<span>` bars; `.is-open` collapses them to center and
  rotates the outer two ±45° into an X (middle fades). ~250ms ease-out,
  `prefers-reduced-motion` snaps with no transition.
- JS hoists BOTH the bar and the overlay to `<body>` (escapes the scrolled
  header's backdrop-filter containing block + stacking context). Preserved:
  body scroll-lock, Esc-to-close, backdrop click-to-close, link-click close.
  Focus trap now spans [toggle button, …overlay links].

### `src/components/Header.astro`
- Mobile slot is now a 44px spacer (`md:hidden ml-6 w-11 h-11`) so the theme
  toggle keeps its position once the real button is hoisted out of flow.

## Decisions

- Aligned to the real **24px** mobile container padding (not 16px). The
  container token was **not** changed (user-confirmed).

## Verification

- `npm run typecheck` → 0 errors.
- `npm run build` → success (7 pages).
- Confirmed in built CSS: `.w-11` resolves to 44px (`--spacing` = .25rem is
  defined) and the morph transforms (`translateY(±5px) rotate(±45deg)`) emit.

## Follow-up for owner

- Visually confirm in `npm run dev` at a mobile width: tap should morph
  hamburger → X in place; X should sit exactly where the hamburger was; theme
  toggle should not move; reduced-motion should snap. Not pushed yet — live
  deploy waits on `git push` (Cloudflare Pages auto-builds on push to main).
