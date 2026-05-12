---
quick_id: 260512-uy8
description: "Polish: about hero corner radius, mobile project card spacing, remove touch focus states"
date: 2026-05-12
status: complete
commits:
  - cd5eeed
  - b95fb78
  - 424b2eb
files_changed:
  - src/pages/about.astro
  - src/pages/index.astro
  - src/styles/global.css
---

# Quick Task 260512-uy8 — Summary

Three surgical visual-polish fixes across About, home, and global styles. Net diff: ~13 lines across 3 files.

## Changes

### 1. About hero — corner radius (`cd5eeed`)

Added `rounded-lg` to the hero image wrapper in `src/pages/about.astro`. The wrapper already had `overflow-hidden`, so the inner `<Image>` clips cleanly. Matches the radius used by `ProjectCard` thumbnails — the About page now sits in the same visual family as the home project grid.

### 2. Mobile project section spacing (`b95fb78`)

In `src/pages/index.astro`, replaced the hard-coded `pt-[132px] pb-[132px]` on `<section id="projects">` and `gap-[132px]` on the card flex container with mobile-first responsive values:

- `pt-[var(--spacing-3xl)] md:pt-[132px]`
- `pb-[var(--spacing-3xl)] md:pb-[132px]`
- `gap-[var(--spacing-3xl)] md:gap-[132px]`

Mobile (<768px) now uses 64px in three places: divider→first card, inter-card, last card→footer. Tablet+ keeps the established 132px rhythm.

### 3. Suppress touch-device focus state (`424b2eb`)

Appended a `@media (hover: none) and (pointer: coarse)` rule to `src/styles/global.css` that strips `outline` from `:focus` and `:focus-visible`. Targets touch-primary devices (phones, tablets without an attached pointing device). Desktop keyboard navigation remains unaffected because the media query won't match. Resolves the iOS Safari quirk where `:focus-visible` matches after a tap on `<a>`/`<button>` and leaves a stray accent outline.

## Verification

- `npm run typecheck` — 0 errors, 0 warnings (13 pre-existing deprecation hints in `src/content.config.ts`, unrelated).
- TSC watcher (`/tmp/claude/.../dev-watch.log`) — last full run: 0 errors.
- Each change is wrapped in conventional commits (`style(about)`, `style(home)`, `style(global)`) and labelled with quick task id for traceability.

## Notes

- Did **not** run `npm run format` because the project's `format` script is `prettier --write .` — it would have reformatted ~150 unrelated files (quote style and line wrapping drift in pre-existing code). Files I touched were either already formatted to the project's Prettier config or only had single-line additions; a future repo-wide format pass should be a separate, dedicated commit.
- Did **not** commit a `--validate` verifier run because this is default quick mode (`--full` and `--validate` were not flagged). Manual visual verification via the live site is the intended check.

## Manual visual check (recommended)

1. About page — confirm hero photo has rounded corners matching project card thumbnails on home.
2. Home page at <768px viewport — confirm gaps around the projects section are 64px (top, between cards, bottom).
3. Tap any project card or footer link on a phone — confirm no accent outline persists after the tap.
4. Desktop keyboard `Tab` through the home page — confirm the accent focus ring still appears on links and buttons (proves keyboard accessibility intact).
