---
phase: 03-work-index-case-studies
verified: 2026-04-17T12:00:00Z
status: gaps_found
score: 28/29 must-haves verified
overrides_applied: 0
overrides: []
re_verification: null
gaps:
  - truth: "Case study pages use the project's accent color for headings and highlights (ROADMAP SC #5 / CASE-03)"
    status: failed
    reason: "ROADMAP.md Phase 3 Success Criterion #5 states 'Case study pages use the project's accent color for headings and highlights'. The codebase deliberately contradicts this — D-15 (documented in 03-CONTEXT.md §D-15 and confirmed by Tanya in 03-DISCUSSION-LOG.md) overrides CASE-03: no accent color appears anywhere on case study pages. The implementation is intentional and Tanya-approved, but the ROADMAP has not been updated to reflect this design decision, creating a discrepancy between the stated success criterion and the actual shipped behavior."
    artifacts:
      - path: "src/pages/projects/[id].astro"
        issue: "No entry.data.accentColor usage — intentional D-15 override. Section headings use var(--color-text-secondary) only."
      - path: ".planning/ROADMAP.md"
        issue: "Phase 3 SC #5 still reads 'Case study pages use the project's accent color for headings and highlights' — should be updated to reflect D-15 decision."
    missing:
      - "Update ROADMAP.md Phase 3 SC #5 to reflect D-15: remove 'project's accent color' language, replace with 'global design tokens only (muted uppercase label style)'"
      - "OR: add an override entry to this VERIFICATION.md frontmatter if the ROADMAP update is deferred to a later phase"
deferred: []
human_verification:
  - test: "Hover over a FeaturedCard on the homepage"
    expected: "Image scales to 1.05 inside the rounded wrapper (no overflow), 250ms ease-out transition"
    why_human: "CSS transform animations cannot be verified from static HTML output"
  - test: "Hover over a ProjectCard on /work"
    expected: "Image scales to 1.05, card row receives a subtle box shadow (0 4px 24px rgba(0,0,0,0.08)); project number remains static; 250ms ease-out"
    why_human: "Hover state requires a browser interaction"
  - test: "Scroll the /work page from the top"
    expected: "Cards fade up from opacity:0 + translateY:24px to fully visible with approximately 60ms stagger between each card"
    why_human: "IntersectionObserver scroll-entrance animation requires real viewport scrolling to verify"
  - test: "Open DevTools > Rendering > prefers-reduced-motion: reduce, then load /work and /projects/project-alpha"
    expected: "All cards and section headings are immediately visible with no opacity or transform transition"
    why_human: "Requires browser DevTools override to test the reduced-motion code path"
  - test: "Scroll down a case study page to the Problem / My Role / Process / Outcome sections"
    expected: "Each section heading fades up into view as it enters the viewport, with the same stagger behavior as work-index cards"
    why_human: "Requires scrolling interaction in a real browser to verify the per-page IntersectionObserver for .case-prose h2"
---

# Phase 03: Work Index & Case Studies — Verification Report

**Phase Goal:** The homepage establishes Tanya's identity with a warm hero and featured projects, the /work page lists all case studies as visually distinct numbered cards with scroll animations, and each project has a full dedicated case study page that tells the complete design story with imagery.

**Verified:** 2026-04-17T12:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

#### Plan 01: Homepage & Featured Work (HERO-01, HERO-02, HERO-03)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visiting `/` shows 'Tanya Zakus' as the primary H1 at Display scale (48px / 600) | VERIFIED | `src/pages/index.astro` line 19: `<h1 class="... text-5xl font-semibold ...">Tanya Zakus</h1>`. `grep -c "Tanya Zakus" dist/index.html` = 2 (H1 + title). |
| 2 | Hero shows a confident, specific sub-line about product design (end-to-end UX) — not a generic tagline | VERIFIED | "Product designer who shapes ideas into usable experiences." + "UX research, wireframes, prototyping, and handoff — end to end." Both present in `dist/index.html`. |
| 3 | Hero shows the exact availability string 'Open to full-time & freelance' in uppercase Label style | VERIFIED | `src/pages/index.astro` line 18: `text-[13px] uppercase tracking-[0.08em]` with text "Open to full-time &amp; freelance". `grep -c "Open to full-time" dist/index.html` = 1. |
| 4 | Below the hero, a 'Selected Work' section renders 2–3 featured project cards filtered by `featured: true` | VERIFIED | `getCollection('projects').filter((p) => p.data.featured)` in index.astro. "Selected Work" heading confirmed in dist/index.html. 1 card rendered (only project-alpha has `featured: true`). |
| 5 | Featured cards link to `/projects/{entry.id}` using `entry.id` (not hardcoded strings, not `entry.data.slug`) | VERIFIED | `FeaturedCard.astro` line 13: `href={\`/projects/${entry.id}\`}`. No `entry.data.slug` anywhere in FeaturedCard.astro. |
| 6 | A 'View all work →' link below the featured grid points to `/work` | VERIFIED | `src/pages/index.astro` line 31: `<a href="/work" ...>View all work →</a>`. Confirmed in `dist/index.html`. |
| 7 | `npm run build` exits 0 with no TypeScript or schema errors | VERIFIED | Build completed in 64.20s, exit 0. 4 pages built: /, /work, /projects/project-alpha, /projects/project-beta. |

**Plan 01 Score: 7/7**

#### Plan 02: Work Index Page (WORK-01 through WORK-06, POL-01)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 8 | Visiting /work lists every project as a numbered card (01, 02…) sorted by publishDate descending | VERIFIED | `work.astro`: `getCollection('projects').sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())`. `grep -c "<article" dist/work/index.html` = 2. |
| 9 | Each card row uses a 60% image / 40% text column split; image is left on odd rows, right on even rows | VERIFIED | `ProjectCard.astro`: `md:basis-[60%]` image column, `md:basis-[40%]` text column, `isReversed = index % 2 === 1` toggles `md:flex-row-reverse`. |
| 10 | Each card's large project number is rendered in that project's accentColor via inline style (NOT a Tailwind class) | VERIFIED | `ProjectCard.astro` line 62: `style={\`color: ${entry.data.accentColor}\`}`. No `text-[${}]` dynamic Tailwind class present. |
| 11 | Hovering a card scales the image thumbnail to 1.05 (inside overflow-hidden wrapper) and applies a subtle box-shadow; transition is 250ms ease-out | VERIFIED (code) | `group-hover:scale-105` on Image within `overflow-hidden rounded-lg` wrapper; `hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]` on article; `duration-[250ms] ease-out` on both. Requires human browser verification (see Human Verification section). |
| 12 | Card rows fade up on scroll (opacity:0 + translateY:24px → opacity:1 + translateY:0) with a 50–80ms stagger delay | VERIFIED (code) | `animate-on-scroll` class on every `<article>` in ProjectCard. CSS in `global.css` lines 54–76. `scroll-animation.ts` sets `--stagger-index`. `grep -c "animate-on-scroll" dist/work/index.html` = 2. Requires human scroll verification. |
| 13 | Users with `prefers-reduced-motion: reduce` see cards visible immediately with no transition | VERIFIED (code) | `scroll-animation.ts` lines 8–18: early exit adds `is-visible` immediately. CSS `@media (prefers-reduced-motion: reduce)` block in `global.css` lines 69–76. Requires human DevTools verification. |
| 14 | Clicking anywhere on a card row navigates to `/projects/{entry.id}` | VERIFIED | `ProjectCard.astro`: outer `<article>` contains `<a href={\`/projects/${entry.id}\`}>`. `grep -c "/projects/project-alpha" dist/work/index.html` = 1; `grep -c "/projects/project-beta" dist/work/index.html` = 1. |
| 15 | `npm run build` exits 0 | VERIFIED | Build exits 0. |

**Plan 02 Score: 8/8**

#### Plan 03: Dynamic Case Study Route (CASE-01 through CASE-05, POL-01)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 16 | Visiting /projects/project-alpha renders a full case study page wrapped in BaseLayout | VERIFIED | `dist/projects/project-alpha/index.html` produced. `render(entry)` from `astro:content` (Astro 6 API). |
| 17 | Visiting /projects/project-beta renders a full case study page wrapped in BaseLayout | VERIFIED | `dist/projects/project-beta/index.html` produced. |
| 18 | Each case study page has a '← Back to work' link at the top that navigates to /work on click | VERIFIED | `[id].astro` line 49-53: `<a href="/work" ...>← Back to work</a>`. Confirmed in built HTML for both pages. |
| 19 | Category labels (role + skills) appear in uppercase small-caps Label style | VERIFIED | `[id].astro` line 56-58: `text-[13px] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]`. Content: `{[entry.data.role, ...entry.data.skills].join(' · ')}`. |
| 20 | Exactly one `<h1>` per page, containing the project title | VERIFIED | `grep -c "<h1" dist/projects/project-alpha/index.html` = 1; same for beta. H1 contains `{entry.data.title}`. |
| 21 | A summary tagline (from frontmatter) appears below the title | VERIFIED | `[id].astro` line 66-68: `<p ...>{entry.data.summary}</p>`. Both MDX files have `summary` in frontmatter. |
| 22 | A metadata block shows Timeline (from publishDate), Team/Company, and My Role | VERIFIED (partial stub) | Timeline (`toLocaleDateString`), Team ("Placeholder — update in MDX" — documented known stub), My Role (`entry.data.role`). All three rendered in `<dl>` block. |
| 23 | The first project image appears below the header, constrained to the 760px column, rendered as WebP via Astro `<Image>` | VERIFIED | `[id].astro` lines 90-98: `<Image src={entry.data.thumbnail} format="webp" ...>` inside `max-w-[760px]` column. Images produced at `dist/_astro/*.webp`. |
| 24 | Four section headings — Problem, My Role, Process, Outcome — appear in muted uppercase Label style | VERIFIED | Both MDX files contain `## Problem`, `## My Role`, `## Process`, `## Outcome`. CSS `.case-prose h2` in `[id].astro` `<style is:global>` applies `font-size: 13px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-secondary)`. Built HTML confirmed. |
| 25 | At least one `<FullBleedImage>` usage in each placeholder MDX breaks out to full viewport width | VERIFIED | `project-alpha.mdx` line 27 and `project-beta.mdx` line 29 both contain `<FullBleedImage ...>`. `grep -c "full-bleed" dist/projects/project-alpha/index.html` = 2 (class on figure, CSS data attr). |
| 26 | Next/prev navigation wraps around — the oldest project's Next links to the newest, and the newest's Previous links to the oldest | VERIFIED | With 2 projects, both prev and next for each page point to the other project. This is correct wrap-around behavior: `all[(i - 1 + len) % len]` and `all[(i + 1) % len]`. `project-alpha` (index 0): prev = `project-beta` (index 1), next = `project-beta` (wrap). `project-beta` (index 1): prev = `project-alpha`, next = `project-alpha` (wrap). |
| 27 | Users with `prefers-reduced-motion: reduce` see section blocks render visibly immediately (no fade) | VERIFIED (code) | Inline script in `[id].astro` lines 138-141: `if (prefersReducedMotion) { h2s.forEach((el) => el.classList.add('is-visible')); }`. CSS `@media (prefers-reduced-motion: reduce)` on `.case-prose h2` sets `opacity: 1; transform: none; transition: none`. Requires human DevTools verification. |
| 28 | Case study pages use NO per-project accent color (D-15 override — global tokens only) | VERIFIED | `grep` for `accentColor` in `[id].astro` returns nothing. No hex colors from project data in built output. All colors via `var(--color-*)` tokens only. |
| **29** | **Case study pages use the project's accent color for headings and highlights (ROADMAP SC #5 / CASE-03)** | **FAILED** | **ROADMAP.md SC #5 states this requirement. The implementation deliberately does NOT use accent color on case study pages (D-15 override, Tanya-approved per 03-DISCUSSION-LOG.md). The ROADMAP has not been updated to reflect this decision.** |
| 30 | `npm run build` produces `dist/projects/project-alpha/index.html` and `dist/projects/project-beta/index.html` | VERIFIED | Build output confirmed at both paths. |

**Plan 03 Score: 13/14** (ROADMAP SC #5 / CASE-03 fails due to undocumented ROADMAP discrepancy)

**Overall Score: 28/29 truths verified**

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pages/index.astro` | Homepage with hero and featured projects grid | VERIFIED | 36 lines, substantive. Contains all required copy and FeaturedCard usage. |
| `src/components/FeaturedCard.astro` | Compact featured project card: thumbnail + title + role tag | VERIFIED | 36 lines. `Image` from `astro:assets`, `CollectionEntry<'projects'>` typed, `entry.id` URL, WebP format, `group-hover:scale-105`, `aria-label`. |
| `src/pages/work.astro` | /work index page wrapping BaseLayout, H1 'Work', loops ProjectCard over sorted projects | VERIFIED | Contains `getCollection`, sort by `publishDate`, `<ProjectCard>` iteration, script import. |
| `src/components/ProjectCard.astro` | Single card row — number, thumbnail (60%), text column (40%), hover interaction, animate-on-scroll class | VERIFIED | Contains `animate-on-scroll`, `group-hover:scale-105`, `md:flex-row-reverse`, `padStart`, `accentColor` via inline style. |
| `src/scripts/scroll-animation.ts` | IntersectionObserver that adds .is-visible and sets --stagger-index | VERIFIED | Contains `IntersectionObserver`, `animate-on-scroll`, `is-visible`, `prefers-reduced-motion`, `--stagger-index`, `threshold: 0.1`, `rootMargin: '0px 0px -40px 0px'`. |
| `src/styles/global.css` | Global .animate-on-scroll CSS with prefers-reduced-motion handling | VERIFIED | Lines 53–76: `.animate-on-scroll`, `.is-visible`, `transition-delay: calc(var(--stagger-index, 0) * 60ms)`, `@media (prefers-reduced-motion: reduce)` block. Existing tokens untouched. |
| `src/pages/projects/[id].astro` | Dynamic route with getStaticPaths; renders MDX body; displays next/prev | VERIFIED | Contains `getStaticPaths`, `render(entry)` (Astro 6 API), wrap-around math, `<Content components={{ FullBleedImage }} />`, scroll-animation import. |
| `src/components/FullBleedImage.astro` | MDX-facing component that breaks out of 760px column to span 100vw | VERIFIED | Contains `margin-left: calc(-50vw + 50%)`, `width: 100vw`, `loading="lazy"`, `decoding="async"`. |
| `src/content/projects/project-alpha.mdx` | Enriched placeholder demonstrating all four sections + one FullBleedImage usage | VERIFIED | Contains `## Problem`, `## My Role`, `## Process`, `## Outcome`, and `<FullBleedImage>` usage. |
| `src/content/projects/project-beta.mdx` | Enriched placeholder demonstrating all four sections + one FullBleedImage usage | VERIFIED | Same structure confirmed. |
| `public/images/project-alpha-process.jpg` | Placeholder full-bleed image | VERIFIED (placeholder) | 69-byte 1×1 PNG stub — documented known placeholder in SUMMARY. |
| `public/images/project-beta-process.jpg` | Placeholder full-bleed image | VERIFIED (placeholder) | 69-byte 1×1 PNG stub — documented known placeholder in SUMMARY. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/pages/index.astro` | `src/content/projects/*.mdx (featured: true)` | `getCollection('projects').filter(p => p.data.featured)` | WIRED | Pattern confirmed in index.astro line 6–8. |
| `src/pages/index.astro` | `src/components/FeaturedCard.astro` | `import FeaturedCard` + map iteration | WIRED | Lines 2 and 29. |
| `src/components/FeaturedCard.astro` | `/projects/{entry.id}` | `href={\`/projects/${entry.id}\`}` | WIRED | Line 13. |
| `src/pages/work.astro` | `src/content/projects/*.mdx` | `getCollection('projects').sort(...)` | WIRED | Lines 6–7. |
| `src/pages/work.astro` | `src/components/ProjectCard.astro` | `<ProjectCard entry={entry} index={index} />` | WIRED | Lines 15–17. |
| `src/pages/work.astro` | `src/scripts/scroll-animation.ts` | `<script src="../scripts/scroll-animation.ts">` | WIRED | Line 21. No `is:inline`. |
| `src/components/ProjectCard.astro` | per-project `accentColor` | `style={\`color: ${entry.data.accentColor}\`}` on number span | WIRED | Line 62. |
| `src/styles/global.css` | `src/components/ProjectCard.astro` | `.animate-on-scroll` class defined globally, applied via `class:list` | WIRED | global.css lines 54–62; ProjectCard line 29. |
| `src/pages/projects/[id].astro` | `src/content/projects/*.mdx` | `getCollection('projects')` + `render(entry)` | WIRED | Lines 9–10 and 31. |
| `src/pages/projects/[id].astro` | `src/components/FullBleedImage.astro` | `<Content components={{ FullBleedImage }} />` | WIRED | Line 104. |
| `src/pages/projects/[id].astro` | `src/scripts/scroll-animation.ts` | `import '../../scripts/scroll-animation.ts'` in inline `<script>` | WIRED | Line 133. |
| `src/pages/projects/[id].astro` | prev/next case study pages | `prevEntry.id` / `nextEntry.id` with wrap-around math | WIRED | Lines 18–19, 113–125. |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/pages/index.astro` | `featured` (array) | `getCollection('projects').filter(featured)` | Yes — MDX collection filtered by `featured: true` | FLOWING |
| `src/pages/work.astro` | `projects` (array) | `getCollection('projects').sort(...)` | Yes — all MDX files from collection | FLOWING |
| `src/pages/projects/[id].astro` | `entry`, `Content`, `timeline` | `getStaticPaths` + `render(entry)` | Yes — per-project MDX entry, all fields live | FLOWING |
| Team metadata field | hardcoded string | N/A | "Placeholder — update in MDX" | HOLLOW_PROP (documented known stub) |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build exits 0 | `npm run build` | Exit 0, 4 pages generated | PASS |
| /index.html contains hero copy | `grep -c "Open to full-time" dist/index.html` | 1 | PASS |
| /work/index.html contains article elements | `grep -c "<article" dist/work/index.html` | 2 | PASS |
| /work/index.html contains animate-on-scroll | `grep -c "animate-on-scroll" dist/work/index.html` | 2 | PASS |
| /work links to both project slugs | `grep -c "/projects/project-alpha" dist/work/index.html` + beta | 1 each | PASS |
| /projects/project-alpha/index.html has exactly 1 H1 | `grep -c "<h1" dist/projects/project-alpha/index.html` | 1 | PASS |
| /projects/project-alpha/index.html has full-bleed figure | `grep -c "full-bleed" dist/projects/project-alpha/index.html` | 2 | PASS |
| Case study pages have all 4 section headings | grep for Problem/My Role/Process/Outcome in dist | Present in both pages | PASS |
| No accentColor on case study pages | `grep -i "accentColor\|#2563EB\|#7C3AED" dist/projects/project-alpha/index.html` | 0 matches | PASS |
| FeaturedCard uses entry.id not entry.data.slug | grep in FeaturedCard.astro | entry.id used | PASS |
| scroll-animation.ts has IntersectionObserver | grep in file | Present | PASS |
| Hover animation (image scale, shadow) | Requires browser | n/a | SKIP (human needed) |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| HERO-01 | 03-01 | Personal intro with name, role, availability | SATISFIED | H1 "Tanya Zakus", "Open to full-time & freelance", "Product designer" present. |
| HERO-02 | 03-01 | Confident, non-generic copy communicating UX focus | SATISFIED | "Product designer who shapes ideas into usable experiences." + "UX research, wireframes, prototyping, and handoff — end to end." |
| HERO-03 | 03-01 | Featured projects preview on homepage | SATISFIED | `featured: true` filter, 1 card rendered (Project Alpha), "View all work →" link. |
| WORK-01 | 03-02 | Numbered cards (01, 02…) on /work | SATISFIED | `padStart(2, '0')` in ProjectCard, both cards rendered. |
| WORK-02 | 03-02 | Card anatomy: number, thumbnail, role, skills, summary, CTA | SATISFIED | All fields rendered in ProjectCard's text column. |
| WORK-03 | 03-02 | Alternating image+text layout | SATISFIED | `isReversed = index % 2 === 1` + `md:flex-row-reverse`. |
| WORK-04 | 03-02 | Per-project accent color on work index cards | SATISFIED | `style={\`color: ${entry.data.accentColor}\`}` on number span only. |
| WORK-05 | 03-02 | Hover: image scale + card shadow | SATISFIED (code) | `group-hover:scale-105`, `hover:shadow-[...]`. Requires browser verification. |
| WORK-06 | 03-02 | Scroll-entrance fade-up animation | SATISFIED (code) | `.animate-on-scroll` on cards, IntersectionObserver in script. Requires browser verification. |
| CASE-01 | 03-03 | Dedicated page per project at `/projects/[id]` | SATISFIED | `getStaticPaths` generates routes for all projects. Both built. |
| CASE-02 | 03-03 | Problem, My Role, Process, Outcome sections | SATISFIED | All four `## headings` in both MDX files. `.case-prose h2` styled appropriately. |
| CASE-03 | 03-03 | Accent color on case study headings | FAILED / OVERRIDDEN | D-15 deliberate override (Tanya-approved per discussion log) — no accent on case study pages. ROADMAP SC #5 not updated. See Gaps. |
| CASE-04 | 03-03 | Full-bleed image sections | SATISFIED | `FullBleedImage.astro` with `calc(-50vw + 50%)` break-out, used in both MDX files. |
| CASE-05 | 03-03 | WebP images, max 200KB, Astro `<Image>` | SATISFIED | `format="webp"` on `<Image>` in both `[id].astro` (cover) and ProjectCard/FeaturedCard. Thumbnails are placeholder PNGs (68 bytes as WebP — well under 200KB). Full-bleed images use plain `<img>` (documented exception: string src from MDX authoring, not ImageMetadata). |
| POL-01 | 03-02, 03-03 | `prefers-reduced-motion` respected | SATISFIED (code) | Belt-and-suspenders: JS early-exit + CSS `@media` block in both global.css and `[id].astro` `<style is:global>`. Requires browser DevTools verification. |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/pages/projects/[id].astro` | 78 | `"Placeholder — update in MDX"` hardcoded in Team metadata | Info | Expected known stub — documented in 03-03-SUMMARY.md Known Stubs. Not blocking. Tanya adds real team info in MDX body. |
| `public/images/project-alpha-process.jpg` | — | 1×1 PNG passed off as a JPG | Info | Known placeholder (69 bytes). Used only for full-bleed layout testing. Tanya replaces with real images. |
| `public/images/project-beta-process.jpg` | — | 1×1 PNG passed off as a JPG | Info | Same as above. |
| `src/pages/index.astro` | 17 | `{/* TODO: Tanya — refine hero copy here */}` | Info | Intentional — required by Plan 01 spec. Copy is a draft scaffold. |

No blockers found. All stubs are documented and acknowledged.

---

### Human Verification Required

#### 1. FeaturedCard hover animation

**Test:** On the homepage, hover over a featured project card.
**Expected:** Image scales to 1.05 inside the rounded wrapper (no overflow past the card border), card receives a soft box shadow; 250ms ease-out transition.
**Why human:** CSS transform animations cannot be verified from static HTML; requires a browser interaction.

#### 2. ProjectCard hover animation (work index)

**Test:** On /work, hover over each project card.
**Expected:** Image thumbnail scales to 1.05 inside `overflow-hidden` wrapper; project card row receives `shadow-[0_4px_24px_rgba(0,0,0,0.08)]`; the large project number (01, 02) remains static — does NOT animate. Transition duration feels smooth (250ms ease-out).
**Why human:** Hover state requires a live browser.

#### 3. Scroll-entrance animation on /work

**Test:** Load /work and scroll from the top.
**Expected:** Cards fade up from invisible (opacity 0, 24px below final position) to fully visible with an approximately 60ms stagger between cards — not all at once.
**Why human:** IntersectionObserver fires on scroll; cannot trigger from static output.

#### 4. prefers-reduced-motion on /work and /projects/*

**Test:** Open DevTools > Rendering > Enable "Emulate CSS media feature prefers-reduced-motion: reduce". Load /work and any case study page.
**Expected:** All cards and section headings are immediately visible at full opacity with no transform. No fade-up animation occurs.
**Why human:** Requires DevTools emulation of a media query.

#### 5. Case study section heading scroll animations

**Test:** Load /projects/project-alpha and scroll down past the MDX body.
**Expected:** Each section heading (Problem, My Role, Process, Outcome) fades up into view as it enters the viewport, independent of the shared `.animate-on-scroll` class (these headings are observed by the per-page inline script targeting `.case-prose h2`).
**Why human:** Requires scrolling in a real browser to trigger the IntersectionObserver.

---

### Gaps Summary

**One gap blocks full phase closure:**

**ROADMAP vs. implementation discrepancy on CASE-03 / accent color:**

ROADMAP.md Phase 3 Success Criterion #5 reads: *"Case study pages use the project's accent color for headings and highlights, and support full-bleed image sections with WebP images under 200KB via Astro's Image component."*

The implementation deliberately omits accent color from case study pages. This was explicitly decided by Tanya in the Phase 3 discussion session (03-DISCUSSION-LOG.md, Area 3, "Accent color on detail page" row: *"No accent color on case study pages. Accent applies to work index cards only. Overrides CASE-03/WORK-04 (detail page portion)."*) and encoded as D-15 in 03-CONTEXT.md.

The decision is sound — muted label style on case study section headings matches the reference screenshot and provides cleaner reading. However, the ROADMAP success criterion has not been updated, leaving a contractual gap: the roadmap says one thing, the shipped code does another.

**Resolution options:**
1. Update ROADMAP.md Phase 3 SC #5 to reflect D-15: remove accent-color language from the case study half; the full-bleed/WebP requirement remains unchanged.
2. Accept the deviation with an override entry in this VERIFICATION.md (if the ROADMAP update is out of scope right now).

This is the only blocking issue. All other phase goals, artifacts, links, and requirements are fully satisfied.

---

_Verified: 2026-04-17T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
