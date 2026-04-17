---
phase: "03-work-index-case-studies"
plan: "02"
subsystem: "work-index"
tags: ["work-index", "project-card", "scroll-animation", "intersection-observer", "astro", "tailwind", "accessibility"]
dependency_graph:
  requires: ["src/content/projects/*.mdx", "src/layouts/BaseLayout.astro", "src/content.config.ts", "src/styles/global.css"]
  provides:
    - "src/pages/work.astro"
    - "src/components/ProjectCard.astro"
    - "src/scripts/scroll-animation.ts"
    - ".animate-on-scroll CSS rules in src/styles/global.css"
  affects:
    - "src/pages/projects/[slug].astro (Plan 03-03 — imports scroll-animation.ts for section animations)"
tech_stack:
  added: []
  patterns:
    - "IntersectionObserver with unobserve-after-fire (fire once) pattern"
    - "CSS custom property --stagger-index for stagger delay via calc()"
    - "prefers-reduced-motion: belt-and-suspenders (JS early-exit + CSS @media fallback)"
    - "Per-project accentColor applied via style attribute (NOT Tailwind dynamic class)"
    - "Alternating card layout via index % 2 === 1 toggling md:flex-row-reverse"
    - "group / group-hover Tailwind pattern for image-only hover scale"
key_files:
  created:
    - src/scripts/scroll-animation.ts
    - src/components/ProjectCard.astro
    - src/pages/work.astro
  modified:
    - src/styles/global.css
decisions:
  - "Per-project accent color applied to project number span ONLY (not title, CTA, or pills) — one consistent application per card per UI-SPEC"
  - "scroll-animation.ts loaded via <script src> module mode (no is:inline) so Astro bundles and TypeScript-checks it"
  - "Card is a single <a> with aria-label; inner CTA and number are aria-hidden to prevent screen reader double-reading"
metrics:
  duration_minutes: 10
  completed_date: "2026-04-17"
  tasks_completed: 3
  files_changed: 4
---

# Phase 03 Plan 02: Work Index Page (/work) Summary

**One-liner:** Numbered alternating-layout project card list at /work with per-project accent numbers, image-hover scale, and IntersectionObserver scroll-entrance animation respecting prefers-reduced-motion.

---

## What Was Built

### src/scripts/scroll-animation.ts (NEW — authoritative creator)

Shared scroll-entrance animation module used by /work and (Plan 03-03) case study pages.

**Import syntax for Plan 03-03 to mirror:**
```astro
<script src="../scripts/scroll-animation.ts"></script>
```
(Path is relative to the consuming page. Adjust `../` depth as needed for pages in subdirectories — e.g., `src/pages/projects/[slug].astro` uses `../../scripts/scroll-animation.ts`.)

**Behavior:**
- Queries all `.animate-on-scroll` elements on page load
- Sets `--stagger-index` CSS custom property on each in DOM order
- IntersectionObserver with `threshold: 0.1`, `rootMargin: '0px 0px -40px 0px'`; fires once per element (unobserves after trigger)
- `prefers-reduced-motion` early exit: immediately adds `is-visible` to all targets, skips observer entirely

### src/styles/global.css (EXTENDED — .animate-on-scroll rules appended)

Animation CSS added at the bottom of the file, after the `:root.dark` block.

**Location:** Lines 53–83 of `src/styles/global.css`.

Plan 03-03 does NOT need to add these rules — they are already globally available.

```css
/* ─── Scroll entrance animation — Phase 3 D-18..D-23, WORK-06, POL-01 ─── */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 500ms ease-out, transform 500ms ease-out;
  transition-delay: calc(var(--stagger-index, 0) * 60ms);
  will-change: opacity, transform;
}
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll, .animate-on-scroll.is-visible { opacity: 1; transform: none; transition: none; }
}
```

### src/components/ProjectCard.astro (NEW)

**Props signature (for Plan 03-03 reference if needed):**
```ts
interface Props {
  entry: CollectionEntry<'projects'>;
  index: number; // 0-based position in sorted list
}
```

**Key implementation details:**
- `displayNumber = String(index + 1).padStart(2, '0')` → "01", "02", …
- `isReversed = index % 2 === 1` → toggles `md:flex-row-reverse`
- `style={`color: ${entry.data.accentColor}`}` on number span (NOT Tailwind dynamic class)
- Image column: `md:basis-[60%] overflow-hidden rounded-lg` → `group-hover:scale-105` on `<Image>`
- Text column: `md:basis-[40%]` → number → h2 title → role → skills pills → summary → "View case study →"
- Card shadow on hover: `hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]` / `dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.24)]`
- Transition duration: `duration-[250ms] ease-out` on both image transform and card shadow

### src/pages/work.astro (NEW)

**Route:** `/work`

- `getCollection('projects').sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())` — mandatory descending sort
- H1 copy: `Work` (exact per UI-SPEC Copywriting Contract)
- Layout shell: `max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-[var(--spacing-4xl)] pb-[var(--spacing-3xl)]`
- Card list gap: `gap-[var(--spacing-xl)]` (32px)

---

## Commits

| Task | Commit | Files |
|------|--------|-------|
| Task 1: scroll-animation.ts + global.css | 1558de6 | src/scripts/scroll-animation.ts, src/styles/global.css |
| Task 2: ProjectCard.astro | 5ff6cd7 | src/components/ProjectCard.astro |
| Task 3: work.astro | 0e6afef | src/pages/work.astro |

---

## Deviations from Plan

None — plan executed exactly as written.

All acceptance criteria met across Tasks 1, 2, and 3.

---

## Known Stubs

- **Project thumbnails**: Both `thumbnail-alpha.png` and `thumbnail-beta.png` are placeholder PNGs from Phase 1. Real project imagery to be added when Tanya has final case study assets.
- **Project content**: `project-alpha.mdx` and `project-beta.mdx` contain placeholder copy. The card summaries, roles, and skills are draft content only.

---

## Threat Flags

None. This plan introduces no new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries. The /work page is a fully static Astro route with no user input or data mutation.

---

## Self-Check: PASSED

- [x] `src/scripts/scroll-animation.ts` exists
- [x] `src/components/ProjectCard.astro` exists
- [x] `src/pages/work.astro` exists
- [x] `src/styles/global.css` contains `.animate-on-scroll` rules
- [x] Commit 1558de6 exists (scroll-animation.ts + global.css)
- [x] Commit 5ff6cd7 exists (ProjectCard.astro)
- [x] Commit 0e6afef exists (work.astro)
- [x] `dist/work/index.html` produced at build time
- [x] `dist/work/index.html` contains 2 `<article>` elements
- [x] `dist/work/index.html` contains links to /projects/project-alpha and /projects/project-beta
- [x] `npm run build` exits 0
