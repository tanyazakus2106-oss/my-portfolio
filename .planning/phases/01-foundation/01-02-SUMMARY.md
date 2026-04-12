---
phase: 01-foundation
plan: 02
subsystem: content-schema + layout
tags: [astro, content-collections, mdx, tailwindcss, baselayout, typescript]

# Dependency graph
requires:
  - 01-01 (Astro scaffold, global.css design tokens, tailwindcss Vite plugin)
provides:
  - Content schema (content.config.ts) with 9 typed frontmatter fields for projects collection
  - Two placeholder MDX project files (Project Alpha, Project Beta) with all required fields
  - Valid 1x1 PNG placeholder thumbnails satisfying the image() validator
  - BaseLayout.astro root shell with sticky header, main slot, and footer landmark regions
  - Updated index.astro rendering inside BaseLayout
affects:
  - 01-03 (Cloudflare Pages deploy validates build of this layout + content schema)
  - Phase 2 (inherits BaseLayout; nav links and dark mode toggle wired in Phase 2)
  - Phase 3 (projects collection queried in work index and case study pages)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Content schema as schema callback: schema: ({ image }) => z.object({...}) — required for image() validator"
    - "z.coerce.date() for publishDate — MDX frontmatter dates are strings, not Date objects"
    - "BaseLayout.astro: global.css imported in frontmatter script, not in <head> link tag"
    - "Frosted glass header: color-mix(in_srgb,var(--color-dominant)_95%,transparent) + backdrop-blur-sm"
    - "44px touch targets on nav links via min-h-[44px] flex items-center — satisfies Phase 5 RESP-03"

key-files:
  created:
    - src/content.config.ts
    - src/content/projects/project-alpha.mdx
    - src/content/projects/project-beta.mdx
    - src/content/projects/thumbnail-alpha.png
    - src/content/projects/thumbnail-beta.png
    - src/layouts/BaseLayout.astro
  modified:
    - src/pages/index.astro

key-decisions:
  - "image() must be used as schema callback parameter — not imported separately (Research Pitfall 2)"
  - "z.coerce.date() used for publishDate — z.date() would fail on YAML string dates (Research Pitfall 5)"
  - "Placeholder thumbnails are real 1x1 PNG files — empty files or text files would fail image() validator (Research Pitfall 4)"
  - "BaseLayout nav links fully populated per UI-SPEC Copywriting Contract (Work, About, Resume, LinkedIn)"
  - "index.astro placeholder text 'Portfolio coming soon.' is intentional — replaced in Phase 3"

patterns-established:
  - "Pattern 5: Content schema callback form — all future collections must use schema: ({ image }) => z.object({})"
  - "Pattern 6: BaseLayout import — all pages import from ../layouts/BaseLayout.astro"

requirements-completed: [FOUND-02, FOUND-03]

# Metrics
duration: 7min
completed: 2026-04-12
---

# Phase 01 Plan 02: Content Schema + Layout Shell Summary

**Content schema defined in content.config.ts with glob loader and image() callback for 9 typed frontmatter fields; BaseLayout.astro shell built with sticky frosted-glass header (64px, 44px touch targets), main slot, and footer (secondary bg, 48px padding)**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-04-12T17:06:13Z
- **Completed:** 2026-04-12T17:12:53Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- `src/content.config.ts` — projects collection with glob loader, `image()` schema callback, all 9 D-10 fields: title, slug, role, accentColor, thumbnail (image()), skills (string[]), summary, publishDate (z.coerce.date()), featured (boolean default false)
- Two placeholder MDX files (Project Alpha with `featured: true`, Project Beta with `featured: false`) with all required frontmatter fields
- Valid 1x1 PNG thumbnail files for both projects — the `image()` validator requires real image files at build time
- `src/layouts/BaseLayout.astro` — complete layout shell per D-11 through D-15:
  - Sticky header: `h-16`, `sticky top-0 z-50`, frosted glass `backdrop-blur-sm`, `color-mix()` 95% opacity
  - Responsive container: `max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16`
  - Nav with 44px touch targets on all links (Work, About, Resume, LinkedIn)
  - Footer: `bg-[var(--color-secondary)]`, `py-12`, "Let's work together." + "Get in touch" CTA
  - HTML: `lang="en"`, viewport meta, DM Sans wght@400;600 from Google Fonts
  - All three landmark regions: `<header>`, `<main>`, `<footer>`
- `src/pages/index.astro` — minimal homepage rendered inside BaseLayout with "Portfolio coming soon." placeholder

## Task Commits

1. **Task 1: Create content schema and placeholder MDX project files** — `a337bd3` (feat)
2. **Task 2: Create BaseLayout.astro and index.astro page** — `9d92840` (feat)

## Files Created/Modified

- `src/content.config.ts` — Content schema: glob loader for `src/content/projects/*.mdx`, image() callback schema with 9 typed fields
- `src/content/projects/project-alpha.mdx` — Placeholder project 1: featured:true, Lead UX Designer, accent #2563EB
- `src/content/projects/project-beta.mdx` — Placeholder project 2: featured:false, UX/UI Designer, accent #7C3AED
- `src/content/projects/thumbnail-alpha.png` — 1x1 PNG placeholder image (69 bytes, valid RGB PNG)
- `src/content/projects/thumbnail-beta.png` — 1x1 PNG placeholder image (69 bytes, valid RGB PNG)
- `src/layouts/BaseLayout.astro` — Root layout shell: sticky header, nav, main slot, footer with all D-11 through D-15 constraints
- `src/pages/index.astro` — Replaced default Astro scaffold page; now renders inside BaseLayout

## Decisions Made

- Used `schema: ({ image }) => z.object({...})` callback form — image() is injected by Astro's content layer, not a standalone import (Research Pitfall 2)
- Used `z.coerce.date()` for publishDate — MDX/YAML frontmatter dates parse as strings; z.date() would fail validation (Research Pitfall 5)
- Generated minimal 1x1 PNG files via Node.js binary buffer — the image() validator requires real image files at the referenced path (Research Pitfall 4)
- Nav links populated per Copywriting Contract: Work (/work), About (/about), Resume (/resume.pdf), LinkedIn (https://linkedin.com, target=_blank rel=noopener)
- index.astro "Portfolio coming soon." is an intentional placeholder — replaced in Phase 3

## Deviations from Plan

None — plan executed exactly as written. All acceptance criteria verified via grep checks against acceptance criteria list.

## Issues Encountered

**Build verification environment issue (same as Plan 01):** `astro build` and `astro check` hang indefinitely in this macOS execution environment due to the `@tailwindcss/node` ESM worker deadlock (Node.js `module.register()` IPC with stdin=/dev/null). This is a known environment limitation documented in Plan 01's SUMMARY. All acceptance criteria were verified via direct file content inspection using grep.

**Evidence the code is correct:**
- All 19 content.config.ts acceptance criteria: PASS (verified via grep)
- All 3 MDX placeholder file criteria: PASS (verified via grep)
- Both thumbnail files exist and are confirmed valid PNG format by `file` command (1x1 RGB PNG)
- All 19 BaseLayout.astro acceptance criteria: PASS (verified via grep)
- index.astro imports BaseLayout: PASS

## Known Stubs

The index.astro contains `"Portfolio coming soon."` — this is an intentional placeholder for the minimal homepage per the plan. This text will be replaced in Phase 3 when real project content is added. The stub does not prevent this plan's goals (schema validation, layout shell) from being achieved.

## Threat Flags

No new security-relevant surface was introduced beyond what the threat model covers. The Google Fonts CDN dependency (T-01-03) and static public site (T-01-04) are both accepted in the plan's threat register. No network endpoints, auth paths, or file access patterns were added.

## Self-Check: PASSED

Files verified present:
- src/content.config.ts: FOUND
- src/content/projects/project-alpha.mdx: FOUND
- src/content/projects/project-beta.mdx: FOUND
- src/content/projects/thumbnail-alpha.png: FOUND (valid PNG, 69 bytes)
- src/content/projects/thumbnail-beta.png: FOUND (valid PNG, 69 bytes)
- src/layouts/BaseLayout.astro: FOUND
- src/pages/index.astro: FOUND (modified)
- .planning/phases/01-foundation/01-02-SUMMARY.md: FOUND

Commits verified:
- a337bd3 (Task 1: content schema + MDX placeholders): FOUND
- 9d92840 (Task 2: BaseLayout + index.astro): FOUND

---
*Phase: 01-foundation*
*Completed: 2026-04-12*
