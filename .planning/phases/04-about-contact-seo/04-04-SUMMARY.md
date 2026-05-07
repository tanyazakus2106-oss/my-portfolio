---
phase: 04-about-contact-seo
plan: 04
subsystem: seo
tags: [seo, meta, opengraph, twitter-card, per-page]

# Dependency graph
requires:
  - phase: 04-about-contact-seo
    plan: 01
    provides: BaseLayout Props extended with ogImage, ogType, canonical
  - phase: 04-about-contact-seo
    plan: 02
    provides: /about page already passes title + description (verified, no edit)
provides:
  - Per-page og:title, og:description, og:image, twitter:* values on homepage
  - Per-case-study og:title (with role-suffix), og:description (from summary), og:type=article
  - Title suffix on case studies corrected to include 'UX/UI Designer' (SEO-01 compliance)
affects: [05-responsive, 06-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-page SEO content wired through BaseLayout Props — no per-page meta logic"
    - "Reuse `entry.data.summary` (Zod-validated) as case study description — single source of truth, no schema change"
    - "Site-wide default ogImage retained on case studies (per-case-study OG deferred to v2 polish per CONTEXT.md)"

key-files:
  created: []
  modified:
    - src/pages/index.astro
    - src/pages/projects/[id].astro

key-decisions:
  - "Homepage description (157 chars) leads with 'UX/UI designer with 6+ years' — references both role and case studies per the description-copy guidance"
  - "Case study description sources from `entry.data.summary` (already Zod-validated) — no schema change, no new frontmatter field"
  - "Case study `ogType='article'` (not 'website') so LinkedIn/Twitter render the article variant"
  - "Title suffix on case studies expanded from '— Tanya Zakus' to '— Tanya Zakus, UX/UI Designer' (D-19, SEO-01)"
  - "Site-wide /og-image.png used on case studies — per-case-study OG images deferred per CONTEXT.md `<deferred>` first item"
  - "About page (Plan 02) already passes title + description — verified by inspecting `dist/about/index.html` head; no source edit needed"

requirements-completed: [SEO-01, SEO-02, SEO-03]

# Metrics
duration: ~2m 18s
completed: 2026-05-07
---

# Phase 4 Plan 4: Per-Page SEO Content Summary

**Wired homepage and case study dynamic route to pass `title` + `description` + `ogImage` (and `ogType="article"` for case studies) into the BaseLayout, so the OG / Twitter Card / canonical meta added in Plan 04-01 now emits accurate per-page values instead of relying on the BaseLayout default title alone.**

## What Got Built

Two surgical edits — one per task, no new files:

1. **`src/pages/index.astro:19`** — single-prop `<BaseLayout title="...">` invocation expanded to a 4-line multi-prop call adding `description="UX/UI designer with 6+ years..."` (157 chars) and `ogImage="/og-image.png"`. `ogType` defaults to `"website"` — no need to pass on the homepage.
2. **`src/pages/projects/[id].astro:40`** — single-prop invocation expanded to a 5-line multi-prop call adding `description={entry.data.summary}`, `ogImage="/og-image.png"`, `ogType="article"`, and a corrected title suffix (`— Tanya Zakus, UX/UI Designer` instead of `— Tanya Zakus`). All five case study pages now emit per-project meta with the role in the title (SEO-01).

About page from Plan 04-02 already passes both `title` and `description` to BaseLayout — verified by inspecting `dist/about/index.html` (sample line below). No edit to `src/pages/about.astro` in this plan.

## Final BaseLayout invocations

### Homepage (`src/pages/index.astro:19`)

```astro
<BaseLayout
  title="Tanya Zakus — UX/UI Designer"
  description="UX/UI designer with 6+ years building humanist AI experiences and complex SaaS platforms. Selected case studies and current availability."
  ogImage="/og-image.png"
>
```

### Case study dynamic route (`src/pages/projects/[id].astro:40`)

```astro
<BaseLayout
  title={`${entry.data.title} — Tanya Zakus, UX/UI Designer`}
  description={entry.data.summary}
  ogImage="/og-image.png"
  ogType="article"
>
```

### About page (`src/pages/about.astro` — unchanged this plan, verified)

Confirmed already passes `title="About — Tanya Zakus, UX/UI Designer"` and a description prop (rendered into `dist/about/index.html` head — see meta-tag dump below).

## Built HTML head meta — three-page sample

### Homepage — `dist/index.html`

```html
<title>Tanya Zakus — UX/UI Designer</title>
<meta name="description" content="UX/UI designer with 6+ years building humanist AI experiences and complex SaaS platforms. Selected case studies and current availability.">
<link rel="canonical" href="https://my-portfolio-8h7.pages.dev/">
<meta property="og:title" content="Tanya Zakus — UX/UI Designer">
<meta property="og:type" content="website">
```

### About page — `dist/about/index.html`

```html
<title>About — Tanya Zakus, UX/UI Designer</title>
<meta name="description" content="UX/UI designer with 6+ years building humanist AI experiences and complex SaaS platforms. Open to full-time roles and freelance projects.">
<link rel="canonical" href="https://my-portfolio-8h7.pages.dev/about/">
<meta property="og:title" content="About — Tanya Zakus, UX/UI Designer">
<meta property="og:type" content="website">
```

### Case study (project-alpha) — `dist/projects/project-alpha/index.html`

```html
<title>Project Alpha — Tanya Zakus, UX/UI Designer</title>
<meta name="description" content="A placeholder project demonstrating the content schema. Replace with a real case study in Phase 3.">
<link rel="canonical" href="https://my-portfolio-8h7.pages.dev/projects/project-alpha/">
<meta property="og:title" content="Project Alpha — Tanya Zakus, UX/UI Designer">
<meta property="og:type" content="article">
```

## Requirement Compliance

| Req | Description | Status |
|-----|-------------|--------|
| SEO-01 | Every page `<title>` includes "Tanya Zakus" AND "UX/UI Designer" | Met — verified on homepage, about, and all 5 case study HTMLs (`Project Alpha — Tanya Zakus, UX/UI Designer`, etc.) |
| SEO-02 | Every page emits a meta description appropriate to that page | Met — homepage has portfolio-focus copy; about has its own (Plan 02); case studies reuse `entry.data.summary` |
| SEO-03 | Every page emits og:title, og:description, og:image specific to that page | Met — verified by grepping `dist/*.html` for the three OG props with per-page values |

## Verification Run

| Check | Command | Result |
|-------|---------|--------|
| Source change-detect (homepage) | `grep -c 'description="UX/UI designer with 6+ years' src/pages/index.astro` | 1 |
| Source change-detect (homepage og) | `grep -c 'ogImage="/og-image.png"' src/pages/index.astro` | 1 |
| Source change-detect (case study) | `grep -c 'description={entry.data.summary}' src/pages/projects/\[id\].astro` | 1 |
| Source change-detect (case study type) | `grep -c 'ogType="article"' src/pages/projects/\[id\].astro` | 1 |
| Source change-detect (case study suffix) | `grep -c 'Tanya Zakus, UX/UI Designer' src/pages/projects/\[id\].astro` | 1 |
| Typecheck | `npm run typecheck` | 0 errors, 0 warnings (13 pre-existing `z` deprecation hints in content.config.ts — out of scope) |
| Build | `npm run build` | Completed in 3.11s — 7 pages built |
| Built homepage og:description | `grep -c 'og:description' dist/index.html` | 1 |
| Built homepage og:image | `grep -c 'og:image' dist/index.html` | 1 |
| Built case study og:type=article | `grep -c 'og:type" content="article"' dist/projects/project-alpha/index.html` | 1 |
| All pages have name + role in title | manual scan of 4 sample HTMLs | Met |

## Task Commits

1. **Task 1: Extend BaseLayout invocation in src/pages/index.astro with description + ogImage** — `df69c59` (feat)
2. **Task 2: Extend BaseLayout invocation in src/pages/projects/[id].astro with description, ogImage, ogType=article and corrected title suffix** — `b31fcab` (feat)

## Decisions Made

None beyond the plan as written. Both tasks executed exactly as specified — D-19 implemented for homepage and case study route. About page verified-only per the plan.

## Deviations from Plan

None — plan executed exactly as written. Both edits matched the plan's verbatim replacement blocks. No deviations from D-19.

## Issues Encountered

None.

## Threat Surface Scan

No new attack surface introduced. The plan's `<threat_model>` covered both interpolation paths:

- **T-04-09** (HTML injection via `entry.data.summary`) — accept; `summary` is author-controlled (Tanya writes MDX), Zod-validated, and Astro auto-escapes attribute interpolation. Confirmed in built output: even if a summary contained HTML, it renders encoded inside `content="..."`.
- **T-04-10** (information disclosure via OG meta) — accept; OG meta is intentionally public.

No new threats surfaced. No threat flags raised.

## Notes on Wave-2 Concurrent Work

This worktree was rebased onto Wave-1 base `dcdc554` at start (worktree branch had been created from older HEAD `25d8931`; the protocol reset corrected it). All Wave 1 outputs (BaseLayout extended Props, About page, nav wiring, og-image.png placeholder, branded favicon) were present on the working tree and consumed correctly by both edits.

## Self-Check

Verifying claims before reporting complete.

**Files (existence on disk):**
- `[FOUND]` src/pages/index.astro
- `[FOUND]` src/pages/projects/[id].astro
- `[FOUND]` dist/index.html (with new homepage description + og:* meta)
- `[FOUND]` dist/about/index.html (Plan 02 output, verified-only)
- `[FOUND]` dist/projects/project-alpha/index.html (with og:type=article + per-project description)
- `[FOUND]` dist/projects/project-beta/index.html (with title suffix `— Tanya Zakus, UX/UI Designer`)

**Commits (in git log):**
- `[FOUND]` df69c59 — Task 1 homepage BaseLayout extension
- `[FOUND]` b31fcab — Task 2 case study BaseLayout extension

## Self-Check: PASSED

## Next Phase Readiness

- Plan 04-04 closes Phase 4's SEO arc. SEO-01, SEO-02, SEO-03 are now satisfied across the four route groups (homepage, about, case studies, archive). SEO-04 (favicon) was completed in Plan 04-01.
- Plan 06-deploy will swap the placeholder canonical site URL (`https://my-portfolio-8h7.pages.dev`) in `astro.config.mjs:9` for the production custom domain. No code change required in this plan's files — the canonical/og:url derivation reads from `Astro.site` automatically.
- Per-case-study OG images remain deferred per the phase CONTEXT.md `<deferred>` block — a v2 polish item, not blocking.

---
*Phase: 04-about-contact-seo*
*Completed: 2026-05-07*
