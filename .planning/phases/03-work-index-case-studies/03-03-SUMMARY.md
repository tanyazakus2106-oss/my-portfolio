---
phase: "03-work-index-case-studies"
plan: "03"
subsystem: "case-study-pages"
tags: ["case-study", "dynamic-route", "mdx", "full-bleed", "scroll-animation", "astro", "tailwind", "accessibility"]
dependency_graph:
  requires:
    - "src/scripts/scroll-animation.ts (Plan 03-02)"
    - ".animate-on-scroll CSS rules in src/styles/global.css (Plan 03-02)"
    - "src/layouts/BaseLayout.astro (Phase 01)"
    - "src/content.config.ts (Phase 01)"
    - "src/content/projects/*.mdx (Phase 01)"
  provides:
    - "src/pages/projects/[id].astro"
    - "src/components/FullBleedImage.astro"
    - "public/images/project-alpha-process.jpg"
    - "public/images/project-beta-process.jpg"
  affects:
    - "src/content/projects/project-alpha.mdx (enriched)"
    - "src/content/projects/project-beta.mdx (enriched)"
tech_stack:
  added: []
  patterns:
    - "getStaticPaths with wrap-around next/prev (modulo index arithmetic)"
    - "render(entry) from astro:content (Astro 6 API — not entry.render())"
    - "MDX custom component injection via <Content components={{ FullBleedImage }} />"
    - "Negative margin full-bleed break-out: width 100vw + calc(-50vw + 50%) margins"
    - "Per-page IntersectionObserver extending shared scroll-animation.ts for MDX h2 elements"
    - "is:global scoped style block for MDX-rendered elements (.case-prose h2)"
key_files:
  created:
    - src/components/FullBleedImage.astro
    - src/pages/projects/[id].astro
    - public/images/project-alpha-process.jpg
    - public/images/project-beta-process.jpg
  modified:
    - src/content/projects/project-alpha.mdx
    - src/content/projects/project-beta.mdx
decisions:
  - "FullBleedImage uses plain <img> (not Astro <Image>) — MDX authors pass string paths to public/ files; Astro <Image> requires ImageMetadata objects from imports"
  - "Component-scoped <style> in FullBleedImage.astro is an accepted exception (UI-SPEC Note 7) — negative margin break-out cannot be expressed in Tailwind utilities cleanly"
  - "case-prose h2 animation implemented via is:global style + per-page inline script rather than adding .animate-on-scroll class in MDX — keeps MDX authoring friction-free"
  - "D-15 override enforced: no entry.data.accentColor reference anywhere in [id].astro; section headings use var(--color-text-secondary) only"
  - "Wrap-around math: nextEntry = newer = (i-1+len)%len; prevEntry = older = (i+1)%len with sort descending by publishDate"
metrics:
  duration_minutes: 15
  completed_date: "2026-04-17"
  tasks_completed: 3
  files_changed: 6
---

# Phase 03 Plan 03: Dynamic Case Study Route /projects/[id] Summary

**One-liner:** Dynamic Astro route rendering each MDX project as a structured case study page with header, metadata block, WebP cover image, four MDX sections, full-bleed image break-out, scroll-entrance animations, and wrap-around next/prev navigation — all using global tokens only (D-15).

---

## What Was Built

### src/components/FullBleedImage.astro (NEW)

MDX-facing custom component that breaks out of the 760px column to span 100vw.

**Props signature:**
```ts
interface Props {
  src: string;
  alt: string;
}
```

**Break-out technique:**
```css
.full-bleed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}
```

**Usage in MDX (no import required):**
```mdx
<FullBleedImage src="/images/my-process.jpg" alt="Process overview" />
```

The component is injected by `[id].astro` via `<Content components={{ FullBleedImage }} />`. MDX authors write the tag directly without any import statement.

### src/pages/projects/[id].astro (NEW)

Dynamic Astro route generating one static page per project entry.

**getStaticPaths output (2 entries with current placeholder content):**
- `{ params: { id: "project-alpha" }, props: { entry, nextEntry: project-beta, prevEntry: project-beta } }`
- `{ params: { id: "project-beta" }, props: { entry, nextEntry: project-alpha, prevEntry: project-alpha } }`

**D-11 page order (exact):**
1. Back link ("← Back to work" → /work)
2. Category labels (role + skills joined by " · ", uppercase, 13px)
3. H1 title (from entry.data.title)
4. Summary tagline (from entry.data.summary)
5. Metadata block: Timeline / Team / My Role (dl/dt/dd)
6. Divider (hr)
7. First image — constrained 760px, Astro `<Image>` with `format="webp"` (CASE-05)
8. MDX body inside `.case-prose` wrapper with FullBleedImage injected
9. Next/prev navigation with wrap-around

**Astro 6 render API used (RESEARCH Pitfall 5):**
```ts
import { getCollection, render } from 'astro:content';
const { Content } = await render(entry);
```

**No accent color used (D-15 compliance):** `entry.data.accentColor` is never read or applied anywhere in this file. Section headings use `var(--color-text-secondary)` only.

### MDX Section Headings — .case-prose h2 Style

Section headings from MDX `##` markers render inside `.case-prose h2`:

```css
.case-prose h2 {
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);  /* NOT accent color — D-15 */
  margin-top: var(--spacing-2xl);
  margin-bottom: var(--spacing-md);
  /* Animate-on-scroll — D-20 */
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 500ms ease-out, transform 500ms ease-out;
}
```

These styles live in a `<style is:global>` block inside `[id].astro`, scoped to `.case-prose` so they don't affect h2 usage elsewhere (e.g., work.astro).

### Per-Page IntersectionObserver for MDX h2 (D-20, POL-01)

The shared `scroll-animation.ts` observes `.animate-on-scroll` elements. MDX h2 elements don't carry that class (to keep MDX authoring friction-free), so `[id].astro` extends the behavior with an inline module script:

```ts
import '../../scripts/scroll-animation.ts';

const h2s = document.querySelectorAll<HTMLElement>('.case-prose h2');
// prefers-reduced-motion: add is-visible immediately, skip observer
// otherwise: set --stagger-index, observe with IntersectionObserver
```

**prefers-reduced-motion behavior:** If `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, all `.case-prose h2` elements immediately receive `is-visible` class, bypassing the IntersectionObserver entirely. Belt-and-suspenders: the `@media (prefers-reduced-motion: reduce)` CSS block also sets `opacity: 1; transform: none; transition: none`.

### Enriched MDX Section Headings (confirms CASE-02)

Both MDX files now contain these verbatim section headings:

```markdown
## Problem
## My Role
## Process
## Outcome
```

HTML rendered from `dist/projects/project-alpha/index.html`:
```html
<h2 id="problem">Problem</h2>
<h2 id="my-role">My Role</h2>
<h2 id="process">Process</h2>
<h2 id="outcome">Outcome</h2>
```

### Placeholder Full-Bleed Images

Located at:
- `public/images/project-alpha-process.jpg` — copied from thumbnail-alpha.png (placeholder)
- `public/images/project-beta-process.jpg` — copied from thumbnail-beta.png (placeholder)

Referenced in MDX as:
```mdx
<FullBleedImage src="/images/project-alpha-process.jpg" alt="Process overview for Project Alpha — placeholder" />
```

Tanya replaces these with real process/hero imagery when finalizing case study content.

---

## Commits

| Task | Commit | Files |
|------|--------|-------|
| Task 1: FullBleedImage.astro | 67f1862 | src/components/FullBleedImage.astro |
| Task 2: [id].astro dynamic route | 5eedc30 | src/pages/projects/[id].astro |
| Task 3: Enrich MDX + placeholder images | 6360357 | src/content/projects/project-alpha.mdx, src/content/projects/project-beta.mdx, public/images/project-alpha-process.jpg, public/images/project-beta-process.jpg |

---

## Deviations from Plan

None — plan executed exactly as written.

All acceptance criteria met across all three tasks:
- FullBleedImage.astro: interface Props, margin-left: calc(-50vw + 50%), width: 100vw, loading="lazy", decoding="async"
- [id].astro: getStaticPaths, render(entry) (not entry.render()), params.id = entry.id, wrap-around math, back link, Timeline/Team/My Role, format="webp", Content components={{ FullBleedImage }}, no accentColor, prev/next with min-h-[44px]
- MDX files: all four sections, FullBleedImage usage, no H1, no import statement, frontmatter preserved, featured: true on project-alpha
- Both dist/projects/project-alpha/index.html and dist/projects/project-beta/index.html produced
- Exactly one `<h1>` per page
- `npm run build` exits 0

---

## Known Stubs

- **Metadata "Team" field**: Rendered as hardcoded "Placeholder — update in MDX" text. No `team` field exists in the content schema. Tanya adds team information in the MDX body prose for real case studies. Future enhancement: add a `team` frontmatter field to the schema if consistent metadata display is desired.
- **Placeholder images** (`public/images/project-alpha-process.jpg`, `public/images/project-beta-process.jpg`): Copies of thumbnail PNGs used as stand-ins. Real case study process imagery to be added by Tanya.
- **MDX body copy**: All four sections contain placeholder text per D-17. Real case study content added post-Phase 3.

---

## Threat Flags

None. This plan introduces no new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries. The /projects/[id] pages are fully static Astro routes with no user input or data mutation.

---

## Self-Check: PASSED

- [x] `src/components/FullBleedImage.astro` exists
- [x] `src/pages/projects/[id].astro` exists
- [x] `public/images/project-alpha-process.jpg` exists (non-empty)
- [x] `public/images/project-beta-process.jpg` exists (non-empty)
- [x] `dist/projects/project-alpha/index.html` produced at build time
- [x] `dist/projects/project-beta/index.html` produced at build time
- [x] Exactly 1 `<h1>` in dist/projects/project-alpha/index.html
- [x] Exactly 1 `<h1>` in dist/projects/project-beta/index.html
- [x] `class="full-bleed"` present in dist/projects/project-alpha/index.html (FullBleedImage rendered)
- [x] Commit 67f1862 exists (FullBleedImage.astro)
- [x] Commit 5eedc30 exists ([id].astro)
- [x] Commit 6360357 exists (MDX enrichment + images)
- [x] `npm run build` exits 0
