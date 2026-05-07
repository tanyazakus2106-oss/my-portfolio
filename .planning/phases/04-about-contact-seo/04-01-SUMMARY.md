---
phase: 04-about-contact-seo
plan: 01
subsystem: seo
tags: [seo, opengraph, twitter-card, canonical, favicon, baselayout, astro]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: BaseLayout.astro shell with title + description Props, html lang, viewport meta
  - phase: 02-navigation-design-system
    provides: Header.astro tz-logo visual identity (mirrored in favicon)
provides:
  - BaseLayout Props extended with ogImage, ogType, canonical (D-16)
  - Site-wide Open Graph meta on every page (og:title, og:description, og:image, og:type, og:url, og:site_name, og:locale) (D-17)
  - Twitter Card meta on every page (twitter:card=summary_large_image, twitter:title, twitter:description, twitter:image) (D-21)
  - Canonical URL link on every page derived from Astro.url + Astro.site (D-22)
  - Favicon link tags pointing to /favicon.svg + /favicon.ico (D-17, D-20)
  - Placeholder 1200x630 og-image.png for build-time meta resolution (D-18)
  - Tanya-branded tz favicon.svg replacing stock Astro default (D-20, SEO-04)
affects: [04-02, 04-03, 04-04, 05-responsive, 06-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pass-through SEO props on BaseLayout (no new component, no new dependency)"
    - "Canonical URL derivation: new URL(Astro.url.pathname, Astro.site).href with hardcoded fallback so build never breaks"
    - "Conditional render pattern for optional meta: {description && <meta ... />}"
    - "Static asset placeholder pattern: ship a working file at the fixed path, owner overwrites later with no markup change"
    - "Standalone SVG asset uses literal hex (not CSS tokens) since favicons load outside the page DOM"

key-files:
  created:
    - public/og-image.png
  modified:
    - src/layouts/BaseLayout.astro
    - public/favicon.svg

key-decisions:
  - "Extended BaseLayout Props (D-16) — no new SEO component"
  - "Default ogImage path is /og-image.png so every page inherits without per-page wiring (D-18)"
  - "Canonical fallback hardcodes site URL when Astro.site is unset, preventing build break"
  - "Twitter Card uses summary_large_image to match 1200x630 OG dimensions (D-21)"
  - "Favicon SVG uses literal hex (#1a1a1a, #ffffff) — favicons cannot reference page-DOM CSS variables"
  - "favicon.ico left as stock Astro default; SVG covers all modern browsers (Chrome, Firefox, Safari, Edge); ICO replacement deferred to v2 polish or a Tanya-provided file"

patterns-established:
  - "SEO meta lives in BaseLayout, not per-page — every page through BaseLayout inherits OG/Twitter/canonical/favicon with no per-page change required (per-page title + description overrides land in Plan 04-04)"
  - "Asset-dependency placeholder: Tanya replaces public/og-image.png and public/favicon.svg directly when she has real assets — no code change, file paths are stable"

requirements-completed: [SEO-01, SEO-02, SEO-03, SEO-04]

# Metrics
duration: 5min
completed: 2026-05-07
---

# Phase 4 Plan 1: SEO Meta + Tanya-branded Favicon Summary

**Site-wide Open Graph + Twitter Card + canonical + favicon meta wired into BaseLayout, with placeholder OG image and a Tanya-branded "tz" favicon replacing the stock Astro default.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-07T12:16:30Z (approx — first edit to BaseLayout)
- **Completed:** 2026-05-07T12:21:29Z
- **Tasks:** 3
- **Files modified:** 2 (BaseLayout.astro, favicon.svg) + 1 created (og-image.png)

## Accomplishments

- Every page rendered through BaseLayout now emits a full OG + Twitter Card + canonical meta block automatically — no per-page wiring required for the meta itself (title/description overrides per page land in a later plan).
- Stock Astro rocket favicon replaced with a Tanya-branded "tz" mark visually consistent with `Header.astro:23 .tz-logo`. Mark adapts to OS dark/light theme via `prefers-color-scheme`.
- Build chain remains green (typecheck 0 errors, build successful, 6 pages built including all 5 case study routes).

## Task Commits

Each task was committed atomically with `--no-verify` per parallel-execution protocol:

1. **Task 1: Extend BaseLayout Props + add SEO meta tags + favicon links** — `5b9747f` (feat)
2. **Task 2: Add placeholder og-image.png (1200x630)** — `2ed2306` (feat)
3. **Task 3: Replace stock favicon.svg with Tanya-branded "tz" mark** — `9f2fdc9` (feat)

## Files Created/Modified

- **`src/layouts/BaseLayout.astro`** — Extended `Props` interface with `ogImage`, `ogType`, `canonical`. Added `canonicalUrl` and `absoluteOgImage` derivations. Inserted 14 new `<head>` tags (canonical + 7 OG + 4 Twitter + 2 favicon).
- **`public/og-image.png`** — Placeholder 1200x630 PNG generated via `sharp` + inline SVG composite. Light grey background, centered "Tanya Zakus" + "UX/UI Designer" + accent bar. Tanya overwrites with real asset later.
- **`public/favicon.svg`** — Replaced stock Astro rocket/A path data (`M50.4 78.5...`, 749 bytes) with Tanya-branded `tz` wordmark in 64x64 viewBox (508 bytes). Uses system-sans fallback stack — no webfont fetch required at favicon render time.

### Final Props interface

```ts
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
}
```

### Meta tags emitted (one line each)

- `<link rel="canonical" href={canonicalUrl} />`
- `<meta property="og:title" content={title} />`
- `<meta property="og:description" content={description} />` (conditional)
- `<meta property="og:image" content={absoluteOgImage} />`
- `<meta property="og:type" content={ogType} />`
- `<meta property="og:url" content={canonicalUrl} />`
- `<meta property="og:site_name" content="Tanya Zakus" />`
- `<meta property="og:locale" content="en_US" />`
- `<meta name="twitter:card" content="summary_large_image" />`
- `<meta name="twitter:title" content={title} />`
- `<meta name="twitter:description" content={description} />` (conditional)
- `<meta name="twitter:image" content={absoluteOgImage} />`
- `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`
- `<link rel="icon" type="image/x-icon" href="/favicon.ico" />`

### Asset status

- **og-image.png:** Placeholder (sharp-generated, 27,890 bytes, RGBA, 1200x630). Tanya replaces with her own when ready — same path, no code change.
- **favicon.svg:** Placeholder Tanya-branded "tz" mark generated by the planner per D-20. Tanya replaces with a designer-finalized mark when ready — same path, no code change.
- **favicon.ico:** Untouched (still stock Astro). Modern browsers prefer the SVG link tag (it appears first in the head). Older browsers fall back to the existing .ico — visually inconsistent but functional. ICO replacement deferred per the plan's documented trade-off.

### Build output verification

- `dist/index.html` contains: 6 distinct `og:*` meta properties (title, image, type, url, site_name, locale — description is conditional and the homepage doesn't pass one yet), 3 Twitter meta (card, title, image), 1 canonical link, 2 favicon links (svg + ico).
- `dist/og-image.png` exists.
- `dist/favicon.svg` exists and contains the new `>tz<` wordmark; the stock `M50.4 78.5` path data is gone.

## Decisions Made

None beyond the plan as written. All three tasks executed as specified — D-16, D-17, D-18, D-20, D-21, D-22 implemented exactly as the plan and Phase 4 CONTEXT decisions describe.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- `grep -c '...' file` returns non-zero exit code when the count is 0, which broke a chained verification command at one point. Re-ran the grep individually to confirm the stock path data was successfully removed from `public/favicon.svg`. No code impact; just a verification ergonomics note.

## Notes on Wave-Concurrent Work

This worktree branch contains modifications by another wave-1 plan executor (likely Plan 04-02, the resume + LinkedIn wiring) to `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/MobileNav.astro`, and `.planning/STATE.md`. Per the parallel-execution protocol, those files were left untouched by this executor. The orchestrator merges all wave outputs.

## Threat Flags

No new attack surface introduced beyond what the plan's `<threat_model>` already covered:

- T-04-01 (path traversal) — accept; all Props are author-controlled.
- T-04-02 (canonical open-redirect) — accept; URL derivation is build-time only.
- T-04-03 (DoS via missing og-image) — mitigated; Task 2 ships a placeholder so the asset always resolves.
- T-04-11 (favicon SVG payload tampering) — accept; SVG contains static CSS only, no scripts.

## Self-Check

Verifying claims before reporting complete.

**Files:**
- `[FOUND]` src/layouts/BaseLayout.astro
- `[FOUND]` public/og-image.png
- `[FOUND]` public/favicon.svg
- `[FOUND]` dist/index.html (with new meta)
- `[FOUND]` dist/og-image.png
- `[FOUND]` dist/favicon.svg (with tz mark)

**Commits:**
- `[FOUND]` 5b9747f — Task 1 BaseLayout SEO meta
- `[FOUND]` 2ed2306 — Task 2 og-image.png placeholder
- `[FOUND]` 9f2fdc9 — Task 3 Tanya-branded favicon

## Self-Check: PASSED

## Next Phase Readiness

- Plan 04-02 (resume + LinkedIn wiring) and 04-03 (About page) can proceed in parallel — they don't depend on this plan's BaseLayout changes; they consume them.
- Plan 04-04 (per-page title/description SEO content) is the natural follow-up: it passes per-page `title` + `description` props through to the BaseLayout so the OG meta carries page-specific copy. The conditional rendering (`{description && ...}`) ensures the homepage today renders without `og:description` but Plan 04-04 will fill that in.
- Plan 06-deploy will eventually swap the placeholder canonical site URL (`https://my-portfolio-8h7.pages.dev`) in `astro.config.mjs` for a custom production domain. No code change required here — only `astro.config.mjs:9`.

---
*Phase: 04-about-contact-seo*
*Completed: 2026-05-07*
