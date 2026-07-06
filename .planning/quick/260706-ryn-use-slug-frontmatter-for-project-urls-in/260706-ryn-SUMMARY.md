---
phase: quick-260706-ryn
plan: 01
subsystem: routing
tags: [routing, content-collections, seo, redirects]
status: complete-uncommitted
requires: []
provides:
  - "slug-based project routing"
affects:
  - "src/pages/projects/[id].astro"
  - "src/components/ProjectCard.astro"
  - "src/components/FeaturedCard.astro"
  - "src/content/projects/project-alpha.mdx"
  - "src/content/projects/project-beta.mdx"
  - "public/_redirects"
tech-stack:
  added: []
  patterns:
    - "Route dynamic segments on `entry.data.slug` (content-defined) rather than `entry.id` (filename-derived)"
key-files:
  created: []
  modified:
    - src/pages/projects/[id].astro
    - src/components/ProjectCard.astro
    - src/components/FeaturedCard.astro
    - src/content/projects/project-alpha.mdx
    - src/content/projects/project-beta.mdx
    - src/content/projects/project-delta.mdx
    - src/pages/index.astro
    - public/_redirects
decisions:
  - "Only the two real, featured case studies (project-alpha, project-beta) got descriptive slugs; the three placeholder projects (gamma/delta/epsilon) were left untouched since their slugs already equal their filenames"
metrics:
  duration: "~10 minutes"
  completed: "2026-07-06"
---

# Phase quick-260706-ryn Plan 01: Use slug frontmatter for project URLs Summary

Routed the `/projects/[id]` dynamic page and all internal link generators off the existing `slug` frontmatter field instead of the filename-derived `entry.id`, then renamed the two real case studies to descriptive slugs (`apollo-design-system`, `team-time-tracker`) with 301 redirects preserving their old URLs.

**IMPORTANT: All changes below are uncommitted.** Per explicit repo-owner instruction, the executor made no `git add` / `git commit` calls. The orchestrator (or the user directly) must review and commit after sign-off. Run `git status --short` / `git diff` to inspect before committing.

## What Was Built

**Task 1 — Route on `entry.data.slug` across route + card components**
- `src/pages/projects/[id].astro`: `getStaticPaths` now emits `params: { id: entry.data.slug }`; prev/next nav links (`${prevEntry.data.slug}`, `${nextEntry.data.slug}`) updated to match.
- `src/components/ProjectCard.astro` and `src/components/FeaturedCard.astro`: card `href` now reads `/projects/${entry.data.slug}`.
- No changes to `src/content.config.ts` — `slug` was already a required schema field, unused by routing until now.

**Task 2 — Descriptive slugs for real case studies + 301 redirects**
- `src/content/projects/project-alpha.mdx`: `slug: "project-alpha"` → `slug: "apollo-design-system"` (title, thumbnail, all other frontmatter untouched).
- `src/content/projects/project-beta.mdx`: `slug: "project-beta"` → `slug: "team-time-tracker"`.
- `public/_redirects`: appended two 301 rules below the existing `/work` rules, with a comment noting origin:
  ```
  # Project slug rename (quick task 260706-ryn): keep old case-study URLs alive.
  /projects/project-alpha   /projects/apollo-design-system   301
  /projects/project-beta    /projects/team-time-tracker      301
  ```
- Placeholder projects (project-gamma, project-delta, project-epsilon) were left completely unchanged — their slugs still equal their filenames, so their routing is identical to before this plan.

## Verification Results

All verification steps from the plan were run and passed:

| Check | Result |
|---|---|
| `npm run typecheck` | Passed — 0 errors, 0 warnings, 13 hints (pre-existing `z.` deprecation hints in `src/content.config.ts`, unrelated to this change — that file was not touched) |
| Grep guard: no `(entry\|prevEntry\|nextEntry)\.id` in the 3 routing files | Passed — no matches |
| `npm run build` | Passed — 7 pages built successfully |
| `dist/projects/apollo-design-system/index.html` exists | Passed |
| `dist/projects/team-time-tracker/index.html` exists | Passed |
| `dist/projects/project-alpha/index.html` does NOT exist | Passed (confirmed absent) |
| `dist/projects/project-beta/index.html` does NOT exist | Passed (confirmed absent) |
| `grep "apollo-design-system"` / `"team-time-tracker"` in `public/_redirects` | Passed — both present |
| `npx prettier --check` on the 5 formattable changed files (`.astro` × 3, `.mdx` × 2) | Passed — all use Prettier code style, no reformatting needed. (`public/_redirects` has no Prettier parser — expected, it's a plain-text Cloudflare directives file, not reformatted.) |

Build log showed one pre-existing, unrelated CSS-optimizer warning (`bg-\[var\(--color-\*\)\]` unexpected token) from a different component's Tailwind arbitrary-value class — out of scope for this task, not touched, and not a build failure.

## Deviations from Plan

One post-execution fix (applied by orchestrator after user reported card reordering):

- **Card-order regression from publishDate tie.** `project-beta.mdx` and `project-delta.mdx` shared `publishDate: "2024-03-10"`, and the sorts in `src/pages/index.astro` / `src/pages/projects/[id].astro` had no tie-breaker — order fell back to the collection store's internal order, which reshuffled when the dev server hot-reloaded the edited files (Project Delta jumped ahead of Team Time Tracker).
- **Fix 1:** Added a deterministic tie-breaker (`|| a.id.localeCompare(b.id)`) to both sorts.
- **Fix 2:** Bumped `project-delta.mdx` `publishDate` to `"2024-03-09"` to break the tie explicitly and restore the original order (Team Time Tracker before Project Delta).
- **Learning:** With the Astro glob loader, a frontmatter `slug` field overrides the generated `entry.id` — so beta's id is now `"team-time-tracker"`, meaning id-alphabetical tie-breaking alone would NOT have restored the original order; the date bump was required.
- Verified: homepage card order restored (`apollo-design-system`, `team-time-tracker`, `project-delta`, `project-gamma`, `project-epsilon`); `npm run typecheck` 0 errors; Prettier clean on the three additionally-touched files.

## Known Stubs

None introduced by this plan. The placeholder body content in `project-alpha.mdx` / `project-beta.mdx` (marked "Placeholder ... per D-17") pre-existed and was not touched — only the `slug` frontmatter line changed in each file.

## Threat Flags

None. This change is routing-only: no new endpoints, no auth paths, no schema changes, no new user-facing input surface. The 301 redirects are static Cloudflare Pages rules with fixed source/destination paths (no user input reflected).

## Self-Check: PASSED

Verified file existence and diff presence for every file the plan claims to modify:

- FOUND: src/pages/projects/[id].astro (diff present: `getStaticPaths` + 2 nav links)
- FOUND: src/components/ProjectCard.astro (diff present)
- FOUND: src/components/FeaturedCard.astro (diff present)
- FOUND: src/content/projects/project-alpha.mdx (diff present: slug line)
- FOUND: src/content/projects/project-beta.mdx (diff present: slug line)
- FOUND: public/_redirects (diff present: 2 new rules + comment)

No commits were made (by design, per constraint) — verified via `git status --short`, which shows all 6 files as modified (`M`) in the working tree, none staged, and no new commit hash in `git log`.
