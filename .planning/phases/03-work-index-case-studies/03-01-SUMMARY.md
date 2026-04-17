---
phase: "03-work-index-case-studies"
plan: "01"
subsystem: "homepage"
tags: ["homepage", "hero", "featured-projects", "astro", "tailwind"]
dependency_graph:
  requires: []
  provides: ["src/pages/index.astro", "src/components/FeaturedCard.astro"]
  affects: ["src/pages/work.astro (Plan 03-02)", "src/pages/projects/[slug].astro (Plan 03-03)"]
tech_stack:
  added: []
  patterns:
    - "CollectionEntry<'projects'> typed FeaturedCard props"
    - "getCollection filter + sort pattern for featured projects"
    - "entry.id for case study URLs (not entry.data.slug)"
    - "Astro <Image> with format=webp, widths + sizes for responsive srcset"
key_files:
  created:
    - src/components/FeaturedCard.astro
  modified:
    - src/pages/index.astro
decisions:
  - "URL generation uses entry.id throughout — never entry.data.slug or hardcoded paths"
  - "Availability badge rendered as inline Label text above H1 (not pill), per UI-SPEC discretion note"
  - "Featured grid uses Tailwind responsive grid-cols-1/2/3 matching D-05 2-3 column compact preview"
metrics:
  duration_minutes: 15
  completed_date: "2026-04-17"
  tasks_completed: 2
  files_changed: 2
---

# Phase 03 Plan 01: Homepage & Featured Work Section Summary

**One-liner:** Homepage hero (Display-scale name, availability badge, product design sub-line) with a Featured Work grid filtered from the Content Collection by `featured: true`.

---

## What Was Built

### FeaturedCard.astro

Compact card component accepting a typed `CollectionEntry<'projects'>` entry prop.

**Props signature:**
```ts
import type { CollectionEntry } from 'astro:content';
interface Props {
  entry: CollectionEntry<'projects'>;
}
```

**Usage pattern (from index.astro):**
```astro
import FeaturedCard from '../components/FeaturedCard.astro';
// ...
{featured.map((entry) => <FeaturedCard entry={entry} />)}
```

Structure: anchor wrapper (href built from `entry.id`) → aspect-[4/3] thumbnail (`<Image>` webp, widths=[400,800]) → text block (h3 title at 24px/600, role tag at 13px uppercase).

### src/pages/index.astro

Homepage delivering HERO-01, HERO-02, HERO-03:

**Hero copy committed verbatim:**
- Availability: `Open to full-time & freelance`
- H1: `Tanya Zakus`
- Headline: `Product designer who shapes ideas into usable experiences.`
- Sub-line: `UX research, wireframes, prototyping, and handoff — end to end.`

**Featured projects rendered:** 1 — Project Alpha (only project with `featured: true` in current placeholder content).

---

## Commits

| Task | Commit | Files |
|------|--------|-------|
| Task 1: FeaturedCard.astro | 1026882 | src/components/FeaturedCard.astro |
| Task 2: Rewrite index.astro | ee578c9 | src/pages/index.astro |

---

## Deviations from Plan

None — plan executed exactly as written.

All acceptance criteria met:
- `import { Image } from 'astro:assets'` present in FeaturedCard.astro
- `import type { CollectionEntry }` present in FeaturedCard.astro
- `entry.id` used for all URL generation
- `format="webp"` and `group-hover:scale-105` present
- `aria-label` on anchor for accessibility
- No hardcoded hex colors outside of comments
- Hero copy exact per UI-SPEC Copywriting Contract
- `TODO: Tanya` comment present
- `Hi, I'm` greeting absent
- `npm run build` exits 0
- `dist/index.html` contains all required copy strings

---

## Known Stubs

- **Project Alpha thumbnail** (`src/content/projects/thumbnail-alpha.png`): Placeholder PNG from Phase 1. Real project imagery to be added when Tanya has final case study assets.
- **Hero copy** marked with `{/* TODO: Tanya — refine hero copy here */}` — the draft copy from UI-SPEC D-04 is in place; Tanya edits `src/pages/index.astro` directly to finalize.
- **Featured count**: Only 1 project rendered (Project Alpha, `featured: true`). Project Beta has `featured: false` in placeholder content. Grid will expand when real projects are added.

---

## Threat Flags

None. This plan introduces no new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries.

---

## Self-Check: PASSED

- [x] `src/components/FeaturedCard.astro` exists
- [x] `src/pages/index.astro` exists and contains all required copy
- [x] Commit 1026882 exists (FeaturedCard)
- [x] Commit ee578c9 exists (homepage)
- [x] `dist/index.html` contains "Open to full-time" (verified via grep -c returning 1)
- [x] `npm run build` exits 0
