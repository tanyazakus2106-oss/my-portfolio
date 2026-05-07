---
phase: 04-about-contact-seo
plan: 02
subsystem: about-page
tags: [about, page, content, seo]
requires:
  - BaseLayout (src/layouts/BaseLayout.astro) — title + description props
  - astro:assets <Image> component — for hero optimization
  - Design tokens in src/styles/global.css — spacing scale, color tokens
provides:
  - /about route — rendered HTML page (no longer 404s)
  - src/assets/about-hero-placeholder.svg — importable hero asset (D-03)
affects:
  - Header.astro nav link `/about` — now resolves
  - Footer.astro nav link `/about` — now resolves
  - MobileNav.astro nav link `/about` — now resolves
tech-stack:
  added: []
  patterns:
    - "Astro <Image> for the hero — copies the projects/[id].astro pattern but tightened to 760px column widths={[760, 1520]}"
    - "Single 760px centered article column (max-w-[760px] mx-auto) for body copy"
    - "Token-only styling — every color and spacing value is var(--*) or scale-derived"
key-files:
  created:
    - src/pages/about.astro (73 lines)
    - src/assets/about-hero-placeholder.svg (10 lines)
  modified: []
decisions:
  - "Hero asset placed in src/assets/ (not public/) so Astro <Image> can optimize it (D-03 requirement)"
  - "Hero <Image> widths tightened to [760, 1520] — column is 760px max, no need for the projects-page [900, 1800] variant"
  - "Section headings use text-[28px] md:text-[32px] font-medium — distinct from homepage 48px Projects heading and from case-study serif h2 (30px)"
  - "max-w-[760px] for the article (matches Phase 3 D-12 spec value), with body paragraphs further constrained to max-w-[600px] for readable line lengths"
  - "Word count target ~150-250 met at 183 words (intro + How I work + Beyond work)"
metrics:
  duration: "~2m 21s"
  tasks_completed: 2
  files_created: 2
  files_modified: 0
  completed_at: "2026-05-07T12:21:20Z"
---

# Phase 4 Plan 02: About Page Summary

**One-liner:** Built `/about` route with Astro `<Image>`-optimized hero, "Now" availability eyebrow, confident bio headline, and "How I work" + "Beyond work" sections — resolving the 404 that Header/Footer/MobileNav were producing.

## What Got Built

A full About page at `src/pages/about.astro` (73 lines) wrapped in `BaseLayout` with both `title` and `description` props so SEO meta is correct. The page lays out four blocks vertically inside a centered 760px column:

1. **Hero photo** — rendered through `<Image>` from `astro:assets`, sourced from a placeholder SVG at `src/assets/about-hero-placeholder.svg`. Astro's pipeline emits two WebP variants (760w and 1520w) with a `srcset`, so the page satisfies D-03 (responsive next-gen image) the moment Tanya replaces the placeholder file with a real photo.
2. **Eyebrow + headline + intro** — "Now — Open to full-time & freelance" eyebrow above a confident clamp-sized headline ("Tanya Zakus, UX/UI designer for humanist AI products and complex SaaS.") and a 2-sentence intro paragraph.
3. **How I work** — title-case `font-medium` heading, two short paragraphs of warm, designer voice.
4. **Beyond work** — same treatment, two paragraphs of personality copy.

Total visible body word count (measured against the rendered `dist/about/index.html` `<article>`): **183 words** — inside the D-04 target of 150-250.

## Files

| File | Status | Lines | Notes |
|------|--------|-------|-------|
| `src/pages/about.astro` | created | 73 | Page route + BaseLayout wrapper + 4-block layout |
| `src/assets/about-hero-placeholder.svg` | created | 10 | Placeholder hero photo. **Replace this file** with Tanya's real photo to ship final hero. |

## Hero Photo Status

- **Currently in use:** the placeholder SVG at `src/assets/about-hero-placeholder.svg` (a neutral grey card with "Hero photo placeholder" copy and a person silhouette)
- **Confirmed location:** `src/assets/` — verified that `public/about-hero-placeholder.svg` does NOT exist
- **D-03 confirmation:** the build output (`dist/about/index.html`) references `_astro/about-hero-placeholder.6DHgxBzL_*.webp` — Astro's `<Image>` pipeline ran and emitted optimized WebP assets with a `srcset`, not a verbatim copy of the SVG
- **Replacement path for Tanya:** drop a `.jpg`/`.png`/`.webp`/`.svg` at `src/assets/about-hero-placeholder.svg` (or rename and update the single `import heroPhoto from '../assets/...'` line). `<Image>` keeps optimizing — no markup change needed.

## Token-Only Check

Pattern 2 (token-only styling — hard rule) compliance:

- **Colors:** every color reference is `var(--color-text-primary)`, `var(--color-text-secondary)`, or `var(--color-secondary)`. No hex literals. Verified: `grep -cE '#[0-9a-fA-F]{3,6}' src/pages/about.astro` returns 0.
- **Spacing:** every spacing value uses the `--spacing-*` scale tokens (md, lg, 2xl, 3xl, 4xl). No magic-number values like `p-[13px]`.
- **Typography:** clamp value `text-[clamp(2.5rem,5vw,4.5rem)]` was copied verbatim from the case-study analog (`projects/[id].astro:53`), and the eyebrow tracking `tracking-[0.08em]` was copied from `index.astro:26`. Section heading sizes `text-[28px] md:text-[32px]` are the only new sizing values — they fit the 4px scale and were chosen to differentiate from the homepage 48px Projects heading and the case-study serif h2 (30px), per D-07.
- **Typography intent note:** CLAUDE.md flags that `--font-sans` is currently "Satoshi" while the design intent is Inter. This plan honored the existing token (`font-sans` is inherited from `BaseLayout`) — no font-family override was introduced inline. A future token swap is the right tool for that change.

**Deviations from Pattern 2:** 0.

## Navigation Resolution

The `/about` link in `Header.astro`, `Footer.astro`, and `MobileNav.astro` previously routed to a non-existent page (404). After this plan:

- Build emits `dist/about/index.html`
- Astro's static file server picks it up at the `/about` URL
- All three nav surfaces now resolve to a real page

Verified by: `test -f dist/about/index.html` exits 0 after `npm run build`.

## Must-Haves Truths Verification

All 9 truths from the plan's `must_haves.truths` block are satisfied:

| # | Truth | Status |
|---|-------|--------|
| 1 | /about returns rendered HTML (not 404) | ✓ dist/about/index.html present |
| 2 | Hero photo rendered through Astro `<Image>` (D-03) | ✓ `_astro/about-hero-*.webp` in dist |
| 3 | "Now" availability eyebrow above headline | ✓ "Now — Open to full-time & freelance" |
| 4 | Hero headline names Tanya + role confidently, no greeting | ✓ "Tanya Zakus, UX/UI designer..." |
| 5 | "How I Work" section with title-case medium-weight heading | ✓ `text-[28px] md:text-[32px] font-medium` |
| 6 | "Beyond Work" section with same treatment | ✓ same heading styling |
| 7 | Availability communicated (full-time + freelance) | ✓ in eyebrow |
| 8 | Personality — warm human voice in body copy | ✓ "clarity problems wearing a costume", "small studios that stay small on purpose" |
| 9 | ~150-250 word total | ✓ 183 words measured against dist HTML |

## Verification Run

| Check | Command | Result |
|-------|---------|--------|
| Typecheck | `npm run typecheck` | 0 errors, 0 warnings (only pre-existing `z` deprecation hints in `src/content.config.ts`, out of scope) |
| Build | `npm run build` | Completed in 4.58s — 7 pages built, including `/about/index.html` |
| Image pipeline | grep `_astro/about-hero` in dist HTML | Match — `<Image>` ran |
| Body length | counted visible `<article>` words in dist | 183 |

## Deviations from Plan

None — plan executed exactly as written. Both tasks completed with the exact file contents specified in the plan.

## Threat Surface Scan

The plan's `<threat_model>` covered both files added by this plan (`src/pages/about.astro`, `src/assets/about-hero-placeholder.svg`) with `accept` dispositions. No new security-relevant surface was introduced beyond what the threat model already characterized:

- No new network endpoints
- No auth paths
- No file access patterns
- No schema changes
- The SVG asset is hardcoded and inert (no scripts, no event handlers, no external refs), and is re-encoded to WebP by Astro's image pipeline at build time

No threat flags raised.

## Commits

- `76c7243` — `feat(04-02): add About hero photo placeholder SVG in src/assets/`
- `3d8d449` — `feat(04-02): add /about page with hero photo, availability, and bio`

## Self-Check: PASSED

- `src/pages/about.astro` — FOUND
- `src/assets/about-hero-placeholder.svg` — FOUND
- Commit `76c7243` — FOUND in git log
- Commit `3d8d449` — FOUND in git log
- `dist/about/index.html` — FOUND (build artifact, regenerated each build)
