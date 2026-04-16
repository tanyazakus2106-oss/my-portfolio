# Phase 3: Work Index & Case Studies — Research

**Researched:** 2026-04-16
**Domain:** Astro 6 Content Collections, MDX custom components, IntersectionObserver animation, CSS full-bleed layout
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Availability: "Open to full-time & freelance" — surface on homepage hero.
- **D-02:** Hero tone: Confident and professional. No greeting. Direct statement of what Tanya does.
- **D-03:** Specialty: Product design (end-to-end UX) — research → wireframes → prototyping → handoff.
- **D-04:** Claude drafts hero headline/sub-line; Tanya refines by editing the component.
- **D-05:** Featured projects: 2–3 column compact grid filtered by `featured: true`, "View all work →" link.
- **D-06:** Work cards: 60% image / 40% text, image left on odd rows, right on even rows.
- **D-07:** Hover: image thumbnail scales to ~1.05 + card box-shadow elevation. Image only (inside overflow:hidden). Project number is static.
- **D-08:** Hover transition: 250–300ms ease-out.
- **D-09:** Card CTA: "View case study →" always visible. Entire card also wrapped in anchor.
- **D-10:** Card anatomy: project number, thumbnail (60%), text column (40%) with title, role tag, skills tags, summary, CTA.
- **D-11:** Case study page structure: back link → skills/role labels → H1 title → summary tagline → metadata block → first image → 4 sections.
- **D-12:** Layout: single centered column, ~760–800px, within 1200px shell.
- **D-13:** First image constrained to column width. Full-bleed via custom MDX component (Claude picks name/pattern).
- **D-14:** Section headings (Problem / My Role / Process / Outcome): muted label style — small-caps/uppercase, text-secondary. Not accent color.
- **D-15:** Project accent color NOT used on case study detail pages (overrides CASE-03 and WORK-04 detail-page portion). Global tokens only throughout case study pages.
- **D-16:** Next/prev navigation sorted by `publishDate` descending. Wraps at ends (last → first, first → last).
- **D-17:** Placeholder MDX files enriched with all template sections; real content added by Tanya post-phase.
- **D-18:** Animation: fade-up — opacity:0 + translateY:24px → opacity:1 + translateY:0.
- **D-19:** Animation library: vanilla IntersectionObserver + CSS transitions. Zero runtime dependency.
- **D-20:** What animates: (a) work index card rows, (b) case study 4 section blocks.
- **D-21:** Stagger: 50–80ms delay per item index.
- **D-22:** Animation duration: 500–600ms ease-out.
- **D-23:** prefers-reduced-motion: all animations disabled — elements render in final visible state.

### Claude's Discretion

- Exact hero component structure (badge vs inline text for availability)
- Featured projects display approach (grid layout, card size)
- Full-bleed image authoring pattern in MDX (component name, props, wrapper approach)
- IntersectionObserver implementation details (threshold, rootMargin, shared component vs inline script)
- Easing curve for fade-up (ease-out or cubic-bezier)
- `/work` page route file name and location

### Deferred Ideas (OUT OF SCOPE)

- None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-01 | Homepage opens with personal intro (name, role/specialty, availability) | Hero component pattern — single centered column, display typography, `featured: true` query |
| HERO-02 | Hero communicates current role/focus with personality — not generic tagline | Copywriting contract from UI-SPEC; D-04 draft copy |
| HERO-03 | Featured projects section below hero — 2–3 selected works | `getCollection` with `.filter(p => p.data.featured)`, compact grid pattern |
| WORK-01 | /work page lists all case studies as numbered cards (01, 02…) | `getCollection('projects')` sorted by publishDate descending, page at `src/pages/work.astro` |
| WORK-02 | Each card shows: number, thumbnail, title, role/skills tags, short description | Card component anatomy, `<Image>` with `entry.data.thumbnail` |
| WORK-03 | Cards use alternating image + text layout | CSS `flex-row-reverse` on even-index cards, or `order` utility |
| WORK-04 | Each project has distinct accent color applied to card | `style={{ color: entry.data.accentColor }}` inline style on project number — dynamic Tailwind classes do not work |
| WORK-05 | Card hover state — subtle interaction | CSS transitions on image scale + box-shadow; `overflow:hidden` wrapper required |
| WORK-06 | Scroll-entrance animations on cards as they enter viewport | IntersectionObserver adds `.is-visible` class; CSS handles transition |
| CASE-01 | Each project has dedicated page at `/projects/[slug]` | Dynamic route `src/pages/projects/[id].astro`, getStaticPaths with `getCollection` |
| CASE-02 | Case study sections: Problem, My Role, Process, Outcome | MDX body sections; heading elements in content + animate-on-scroll wrapper |
| CASE-03 | Case study uses accent color for headings/highlights (OVERRIDDEN by D-15) | D-15 override: global tokens only on case study pages |
| CASE-04 | Full-bleed image sections supported between text blocks | `<FullBleedImage>` MDX component with negative margin break-out technique |
| CASE-05 | Images are WebP, max 200KB, using Astro `<Image>` | `<Image src={...} format="webp" />` from `astro:assets`; `image()` schema field provides metadata |
| POL-01 | prefers-reduced-motion respected; scroll animations disabled when set | `@media (prefers-reduced-motion: reduce)` CSS block in animate-on-scroll style definitions |

</phase_requirements>

---

## Summary

Phase 3 builds the three pages that define the portfolio's value: the homepage hero, the `/work` index, and individual `/projects/[slug]` case study pages. All three depend on the same data pipeline — `getCollection('projects')` sorted by `publishDate` descending — and share a common animation system built on vanilla IntersectionObserver.

The most technically nuanced areas are: (1) the Content Layer API's `id` vs `slug` field behavior with the glob loader (the existing frontmatter `slug` field acts as an `id` override — a critical detail for `getStaticPaths`), (2) the MDX custom component pattern for `<FullBleedImage>` (import-in-MDX is the correct approach for Astro 6, not `components` prop injection), and (3) the IntersectionObserver stagger approach (a `--stagger-index` CSS custom property set in script, consumed by CSS `transition-delay`, is the cleanest zero-dependency implementation).

The project's existing foundation is solid: `content.config.ts` schema with `image()` field, two placeholder MDX files with correct frontmatter, `BaseLayout.astro` wrapping all pages, and complete design tokens in `global.css`. Phase 3 extends this without modifying any Phase 1/2 work.

**Primary recommendation:** Use `entry.id` (not `entry.data.slug`) for all URL params in `getStaticPaths`. Because the existing MDX files already have `slug` frontmatter matching their filename, `entry.id` equals the filename stem — they are the same value. Use `[id].astro` as the route file, not `[slug].astro`.

---

## Project Constraints (from CLAUDE.md)

| Directive | Rule |
|-----------|------|
| No CMS | Static content only — MDX files edited directly |
| Astro 6.1.5 | Confirmed in `package.json` — all patterns must use Astro 6 / Content Layer API |
| Tailwind CSS v4 | `@theme` in CSS, no `tailwind.config.js`, no PostCSS plugin, Vite plugin only |
| No hardcoded values | All styles via `var(--color-*)` and `var(--spacing-*)` tokens |
| No React / UI frameworks | `.astro` components only — no `client:load` for static content |
| `<Image>` component | Required for all images — WebP optimization via `sharp` |
| Dynamic Tailwind classes prohibited | Per-project `accentColor` must use `style` attribute, not dynamically constructed Tailwind class names |
| `output: 'static'` | Set in `astro.config.mjs` — confirmed. No SSR. |
| DM Sans 400/600 only | Existing Google Fonts URL `wght@400;600` is sufficient — do not change it |

---

## Standard Stack

### Core (already installed — confirmed from `package.json`)

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| `astro` | ^6.1.5 | Framework, static site generation, Content Layer | Installed [VERIFIED: package.json] |
| `@astrojs/mdx` | ^5.0.3 | MDX support for case study pages | Installed [VERIFIED: package.json] |
| `tailwindcss` | ^4.2.2 | Utility-first styling | Installed [VERIFIED: package.json] |
| `@tailwindcss/vite` | ^4.2.2 | Tailwind v4 Vite plugin | Installed [VERIFIED: package.json] |

**No new packages needed for Phase 3.** All required libraries are already installed.

### What Is Already In Place

| Asset | Location | State |
|-------|----------|-------|
| Content schema | `src/content.config.ts` | Complete — all 9 fields typed including `image()`, `featured`, `accentColor` |
| Placeholder projects | `src/content/projects/project-alpha.mdx`, `project-beta.mdx` | Minimal — need enrichment with 4 template sections |
| Thumbnail images | `src/content/projects/thumbnail-alpha.png`, `thumbnail-beta.png` | Present |
| BaseLayout | `src/layouts/BaseLayout.astro` | Complete — wraps `<main>`, imports `global.css` |
| Design tokens | `src/styles/global.css` | Complete — all `var(--color-*)`, `var(--spacing-*)` tokens defined |
| Header + Footer | `src/components/` | Complete from Phase 2 |

---

## Architecture Patterns

### Recommended Project Structure (Phase 3 additions)

```
src/
├── pages/
│   ├── index.astro              # REPLACE existing placeholder — homepage hero + featured projects
│   ├── work.astro               # NEW — work index with numbered alternating cards
│   └── projects/
│       └── [id].astro           # NEW — dynamic case study route
├── components/
│   ├── ProjectCard.astro        # NEW — work index card (60/40, hover, animation)
│   ├── FeaturedCard.astro       # NEW — compact featured card for homepage grid
│   └── FullBleedImage.astro     # NEW — MDX component that breaks out of column
├── scripts/
│   └── scroll-animation.ts      # NEW — shared IntersectionObserver script
└── content/
    └── projects/
        ├── project-alpha.mdx    # ENRICH — add 4 sections + FullBleedImage usage
        └── project-beta.mdx     # ENRICH — same
```

### Pattern 1: Dynamic Route with Content Layer (getStaticPaths)

**What:** Generate one page per project using Astro's file-system routing.
**When to use:** All `[id].astro` case study pages.

```astro
---
// src/pages/projects/[id].astro
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import FullBleedImage from '../../components/FullBleedImage.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  // Sort by publishDate descending — matches /work page order
  const sorted = projects.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
  return sorted.map((entry, index) => {
    const prev = index > 0 ? sorted[index - 1] : sorted[sorted.length - 1];    // wrap
    const next = index < sorted.length - 1 ? sorted[index + 1] : sorted[0];    // wrap
    return {
      params: { id: entry.id },   // entry.id = filename stem OR slug frontmatter value
      props: { entry, prev, next },
    };
  });
}

const { entry, prev, next } = Astro.props;
const { Content } = await render(entry);
---
<BaseLayout title={`${entry.data.title} — Tanya Zakus`}>
  <Content components={{ FullBleedImage }} />
</BaseLayout>
```

**Critical detail:** `entry.id` is used for `params`, not `entry.data.slug`. The glob loader uses filename stem as the id by default. When frontmatter contains a `slug` field, that value overrides the generated id [VERIFIED: docs.astro.build/en/guides/content-collections, confirmed by migration guides]. Because both placeholder files already have `slug` frontmatter matching their filename, `entry.id === "project-alpha"` etc. No mismatch.

### Pattern 2: Work Index Page

```astro
---
// src/pages/work.astro
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';

const projects = (await getCollection('projects'))
  .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
---
<BaseLayout title="Work — Tanya Zakus">
  <main>
    {projects.map((project, index) => (
      <ProjectCard entry={project} index={index} />
    ))}
  </main>
</BaseLayout>
```

**Sort must be explicit.** `getCollection` order is non-deterministic and platform-dependent [VERIFIED: Astro docs, community migration guides]. Always sort before rendering or computing next/prev.

### Pattern 3: Astro `<Image>` with Content Collection Thumbnails

```astro
---
import { Image } from 'astro:assets';
// entry.data.thumbnail is a resolved ImageMetadata object (from image() schema field)
---
<Image
  src={entry.data.thumbnail}
  alt={`Project thumbnail for ${entry.data.title}`}
  format="webp"
  width={800}
  height={500}
  class="w-full h-full object-cover"
/>
```

The `image()` schema field in `content.config.ts` processes the image at build time, returning an `ImageMetadata` object with `src`, `width`, `height`. Passing this to `<Image>` enables automatic WebP conversion and `srcset` generation via `sharp`. Do not pass a string path — pass `entry.data.thumbnail` directly [VERIFIED: docs.astro.build/en/guides/images].

### Pattern 4: MDX Custom Component (`<FullBleedImage>`)

Two approaches for using custom components in MDX files:

**Approach A — Import in MDX (recommended for author control):**
```mdx
import FullBleedImage from '../../components/FullBleedImage.astro';

<FullBleedImage src="/images/process-map.png" alt="Process map for Project Alpha" />
```

**Approach B — Inject via `components` prop at render site:**
```astro
// In [id].astro
const { Content } = await render(entry);
---
<Content components={{ FullBleedImage }} />
```

**Use Approach B.** It does not require the MDX author to know the component's import path — the executor provides `FullBleedImage` in the `components` map and it's available automatically in all MDX files [VERIFIED: docs.astro.build/en/guides/integrations-guide/mdx]. The MDX file uses `<FullBleedImage src="..." alt="..." />` as if it were imported. This is the pattern the UI-SPEC note 5 describes.

### Pattern 5: Full-Bleed Image CSS Break-Out

The `<FullBleedImage>` component must break a 760px centered column to fill the viewport:

```astro
---
interface Props {
  src: string;
  alt: string;
}
const { src, alt } = Astro.props;
---
<figure class="full-bleed">
  <img src={src} alt={alt} />
</figure>

<style>
  .full-bleed {
    /* Negative margin break-out technique */
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    margin-top: var(--spacing-2xl);
    margin-bottom: var(--spacing-2xl);
  }
  .full-bleed img {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
```

**Known pitfall:** `100vw` includes the scrollbar width on Windows/Linux, which can cause a ~15px horizontal overflow. The modern alternative uses a CSS Grid parent (`grid-template-columns: 1fr min(760px, 100%) 1fr`) where full-bleed children use `grid-column: 1 / -1`. The negative margin technique is simpler for an MDX component and acceptable for this portfolio context [CITED: css-tricks.com/full-bleed, frontendmasters.com/blog/full-bleed-layout-with-modern-css].

### Pattern 6: IntersectionObserver Stagger Animation

```typescript
// src/scripts/scroll-animation.ts
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add('is-visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  }
);

// Assign stagger index to each element in each batch group
document.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
  (el as HTMLElement).style.setProperty('--stagger-index', String(i));
  observer.observe(el);
});
```

```css
/* In a component <style> block or global.css */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 500ms ease-out,
    transform 500ms ease-out;
  transition-delay: calc(var(--stagger-index, 0) * 60ms);
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
```

**Astro script model:** The script file is imported via Astro's `<script>` tag (not `is:inline`) so Astro processes it as a module, bundles it, and deduplicates it if the component is used on multiple pages [VERIFIED: docs.astro.build/en/guides/client-side-scripts]. Place `<script src="../../scripts/scroll-animation.ts"></script>` in both `work.astro` and the case study layout, or in a shared `AnimationInit.astro` component.

### Pattern 7: Per-Project Accent Color (Dynamic Inline Style)

Tailwind cannot generate utility classes from runtime values. The `accentColor` field holds a hex string (e.g., `"#2563EB"`). Apply via the `style` attribute:

```astro
<!-- ProjectCard.astro -->
<span
  class="text-6xl font-semibold opacity-40"
  style={`color: ${entry.data.accentColor}`}
>
  {String(index + 1).padStart(2, '0')}
</span>
```

This is the only correct approach for dynamic color values in this stack [VERIFIED: CLAUDE.md constraint, UI-SPEC note 3].

### Pattern 8: Next/Prev Navigation with Wrap-Around

D-16 specifies wrapping at the ends (last → first, first → last). The standard no-wrap pattern found in documentation must be extended. Use modular arithmetic in `getStaticPaths`:

```astro
// In getStaticPaths()
return sorted.map((entry, index) => {
  const prevIndex = (index + 1) % sorted.length;      // older project, wraps to newest
  const nextIndex = (index - 1 + sorted.length) % sorted.length;  // newer project, wraps to oldest
  return {
    params: { id: entry.id },
    props: {
      entry,
      prevEntry: sorted[prevIndex],
      nextEntry: sorted[nextIndex],
    },
  };
});
```

**Ordering note:** With `publishDate` descending, `sorted[0]` is the newest project. "Next project →" means newer (lower index), "← Previous project" means older (higher index). When there is only one project, both prev and next point to the same entry — acceptable for placeholder content.

### Anti-Patterns to Avoid

- **Do not use `entry.data.slug` as the route param.** Always use `entry.id`. The `slug` frontmatter field in these files becomes the `id` via the glob loader override, so they are the same value currently — but relying on `entry.data.slug` in params would be semantically wrong and fragile if frontmatter ever diverges from filenames.
- **Do not dynamically construct Tailwind classes** like `text-[${accentColor}]` — Tailwind's JIT engine cannot generate classes for runtime strings. Use `style` attribute instead.
- **Do not use `is:inline` for the scroll animation script.** The default `<script>` (module mode) gets bundled, TypeScript-checked, and deduplicated. `is:inline` would duplicate the script on every page.
- **Do not sort `getCollection` results without `.valueOf()`.** JavaScript Date comparison without `.valueOf()` uses reference equality, not chronological order.
- **Do not skip the `overflow: hidden` wrapper on card thumbnails.** The `scale(1.05)` hover effect requires it — without `overflow: hidden`, the scaled image visibly overflows the card boundary.
- **Do not use `history.back()` for the back link.** Use `<a href="/work">` — predictable navigation that works on direct page load (D-11, CONTEXT Specifics).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization + WebP conversion | Custom build script | `<Image>` from `astro:assets` + `image()` schema field | Handles `srcset`, format conversion, lazy loading, dimension inference automatically |
| Scroll animation library | Custom JS library | Vanilla `IntersectionObserver` + CSS | Already decided (D-19); no runtime dependency needed |
| Slug generation / URL safety | Custom slugify function | `entry.id` from glob loader | Automatically slugified from filename; overridable via frontmatter `slug` |
| MDX component registry | Custom component injection system | `components` prop on `<Content />` | Native Astro/MDX API — passes component map at render time |
| Image dimensions in `<img>` | Reading file metadata manually | `image()` schema field + `<Image>` | `image()` returns `ImageMetadata` with width/height already resolved at build time |

---

## Common Pitfalls

### Pitfall 1: `getCollection` Returns Non-Deterministic Order
**What goes wrong:** Projects render in random order between builds. Next/prev nav points to wrong projects.
**Why it happens:** `getCollection` does not guarantee sort order — it depends on filesystem enumeration which varies by OS and Node version.
**How to avoid:** Always explicitly sort after `getCollection`. Sort by `b.data.publishDate.valueOf() - a.data.publishDate.valueOf()` for descending order. Apply the same sort in `getStaticPaths` and on the `/work` page so order is consistent.
**Warning signs:** Works on macOS but fails on Linux/Cloudflare Pages build environment.

### Pitfall 2: Dynamic Tailwind Classes Silently Fail
**What goes wrong:** `text-[${entry.data.accentColor}]` renders the element with no color applied.
**Why it happens:** Tailwind's JIT scanner reads source files at build time to generate classes. Runtime template strings are not scanned — the class is never generated.
**How to avoid:** Use `style={`color: ${entry.data.accentColor}`}` for any value that comes from frontmatter or runtime data.
**Warning signs:** Color shows as inherited/default rather than the project's accent color. No build error or warning.

### Pitfall 3: Scroll Animation `opacity:0` Elements Stuck Hidden on Unsupported Browsers
**What goes wrong:** On very old browsers or if JS is disabled, elements with `.animate-on-scroll` never receive `.is-visible` and remain invisible.
**Why it happens:** The initial CSS state is `opacity: 0`; the class flip requires JavaScript.
**How to avoid:** The `prefers-reduced-motion` CSS block already handles the accessible case (renders elements visible). For JS-disabled fallback, consider wrapping the initial `opacity: 0` state in a `.js-enabled` check, or add a `<noscript>` style block that sets `.animate-on-scroll { opacity: 1; transform: none; }`.
**Warning signs:** Content not visible after page load when animations aren't firing.

### Pitfall 4: `100vw` Full-Bleed Causes Horizontal Scrollbar
**What goes wrong:** The full-bleed image creates a horizontal scroll on Windows/Linux where the scrollbar occupies ~15px inside the viewport.
**Why it happens:** `100vw` always equals the full viewport width including space where the scrollbar would be. On systems with visible scrollbars, `100vw > 100%` of the available content area.
**How to avoid:** Keep `overflow-x: hidden` on `<body>` (standard for most sites). Or use the CSS Grid approach instead. For a portfolio viewed primarily by designers and recruiters on macOS (where scrollbars are hidden by default), the `100vw` approach is acceptable.
**Warning signs:** Horizontal scrollbar appears on any page with a `<FullBleedImage>` component.

### Pitfall 5: `render()` vs `entry.render()` API Confusion
**What goes wrong:** Using the old `entry.render()` method (Astro 4 pattern) in Astro 6 code causes a runtime error.
**Why it happens:** In Astro 5+, `render()` was moved from an instance method to a standalone import from `astro:content`.
**How to avoid:** Always import `render` from `astro:content` and call `await render(entry)` — not `await entry.render()`.
**Warning signs:** Build fails with "entry.render is not a function" or similar.

### Pitfall 6: `<Image>` Requires `alt` Text — Empty String for Decorative Images
**What goes wrong:** Omitting `alt` causes a build-time TypeScript error with the `@astrojs/check` script.
**Why it happens:** Astro's `<Image>` component enforces `alt` as a required prop.
**How to avoid:** Always provide `alt`. For thumbnails: `alt={`Project thumbnail for ${entry.data.title}`}`. For truly decorative images: `alt=""`.

### Pitfall 7: Case Study Page URL Depends on `entry.id`
**What goes wrong:** Links to `/projects/project-alpha` break if someone changes the MDX filename without updating any `href` attributes (there are none yet — links are generated from `entry.id`).
**Why it happens:** The glob loader derives `id` from filename. Renaming `project-alpha.mdx` to `product-alpha.mdx` changes the id and thus the URL.
**How to avoid:** All internal links to case study pages should be generated from `entry.id`, not hardcoded. Example: `href={`/projects/${entry.id}`}`. Never hardcode `/projects/project-alpha` in component code.

---

## Code Examples

### Work Index: getCollection + Sort

```astro
---
// src/pages/work.astro
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../layouts/BaseLayout.astro';

const projects = (await getCollection('projects'))
  .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
---
```
[VERIFIED: docs.astro.build/en/guides/content-collections]

### Case Study: getStaticPaths with Wrap-Around Next/Prev

```astro
---
// src/pages/projects/[id].astro
import { getCollection, render } from 'astro:content';
import FullBleedImage from '../../components/FullBleedImage.astro';

export async function getStaticPaths() {
  const all = (await getCollection('projects'))
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  return all.map((entry, i) => ({
    params: { id: entry.id },
    props: {
      entry,
      prevEntry: all[(i + 1) % all.length],   // older (wraps to newest)
      nextEntry: all[(i - 1 + all.length) % all.length], // newer (wraps to oldest)
    },
  }));
}

const { entry, prevEntry, nextEntry } = Astro.props;
const { Content } = await render(entry);
---
<Content components={{ FullBleedImage }} />
```
[VERIFIED: docs.astro.build/en/guides/content-collections, docs.astro.build/en/guides/integrations-guide/mdx]

### Featured Projects on Homepage

```astro
---
import { getCollection } from 'astro:content';
const featured = (await getCollection('projects'))
  .filter(p => p.data.featured)
  .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
---
```
[VERIFIED: docs.astro.build/en/guides/content-collections]

### IntersectionObserver Script (Astro Module Script Tag)

```astro
<!-- In work.astro or a shared AnimationInit.astro component -->
<script>
  import '../scripts/scroll-animation.ts';
</script>
```

Or with direct path reference:
```astro
<script src="../scripts/scroll-animation.ts"></script>
```
[VERIFIED: docs.astro.build/en/guides/client-side-scripts]

### Alternating Card Layout (Tailwind v4)

```astro
<!-- ProjectCard.astro — odd = image left, even = image right -->
<article
  class:list={[
    'flex gap-[var(--spacing-xl)]',
    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
  ]}
>
  <div class="w-[60%] overflow-hidden">
    <Image src={entry.data.thumbnail} alt={`Project thumbnail for ${entry.data.title}`}
           format="webp" class="w-full h-full object-cover transition-transform
           duration-[250ms] ease-out group-hover:scale-105" />
  </div>
  <div class="w-[40%]"><!-- text column --></div>
</article>
```
[ASSUMED — Tailwind v4 class syntax; pattern is standard CSS flex approach]

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| `entry.render()` (Astro 4) | `render(entry)` imported from `astro:content` | Breaking change in Astro 5 [VERIFIED: upgrade guide] |
| `entry.slug` (Astro 4 legacy collections) | `entry.id` (Content Layer) | `slug` is now a data field that can override `id` in glob loader [VERIFIED: docs.astro.build] |
| `src/content/config.ts` (Astro 4) | `src/content.config.ts` (Astro 5/6) | File is already at correct location in this project [VERIFIED: codebase] |
| `getEntryBySlug()` | `getEntry('collection', id)` | Old API removed in Astro 5 [VERIFIED: upgrade guide] |
| Legacy collection type detection | Explicit `loader:` in `defineCollection` | Already using glob loader in this project [VERIFIED: content.config.ts] |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Tailwind v4 class `flex-row-reverse` works as expected for alternating layout | Code Examples — Alternating Card | Would need explicit CSS; low risk, standard CSS |
| A2 | `entry.id` equals `"project-alpha"` for a file `project-alpha.mdx` with `slug: "project-alpha"` frontmatter | Pattern 1, Architecture | If id includes path prefix (e.g., `projects/project-alpha`), route params and internal links break. Should be verified by running `astro dev` and inspecting collection output. |
| A3 | `transition-delay: calc(var(--stagger-index, 0) * 60ms)` works correctly across browsers for the stagger effect | Pattern 6 — scroll animation | CSS custom property in `calc()` is widely supported (all modern browsers) — low risk |
| A4 | `<script src="../scripts/scroll-animation.ts">` deduplication across two pages (work.astro + [id].astro) | Pattern 6 | Astro docs say scripts deduplicate per-page, not cross-page. Each page will bundle its own copy, which is acceptable — not a shared global bundle issue since it's a small utility script. |

**Assumption A2 requires validation:** Run `console.log(projects.map(p => p.id))` in `work.astro` during `npm run dev` to confirm id values before building the route param. The placeholder files have matching filename/slug so this should be fine, but should be confirmed at Wave 0.

---

## Open Questions

1. **Entry ID format with glob loader**
   - What we know: The glob loader sets `id` = slugified filename by default. Frontmatter `slug` field overrides the generated id per official docs.
   - What's unclear: Whether the id includes any path prefix for nested directories (e.g., `projects/project-alpha` vs `project-alpha`). The content is in `src/content/projects/` and the loader base is `./src/content/projects` — so the id should be just `project-alpha` without a prefix.
   - Recommendation: Verify with a quick `console.log` at Wave 0 start before writing route logic.

2. **`<FullBleedImage>` with Astro `<Image>` component vs plain `<img>`**
   - What we know: `<FullBleedImage>` is a custom MDX component. Its `src` prop in MDX context will be a string path provided by the author.
   - What's unclear: Whether Astro's `<Image>` can optimize a string path inside an MDX-used component, or whether it requires a pre-imported image module.
   - Recommendation: Implement `<FullBleedImage>` with a plain `<img>` tag initially (the full-bleed visual effect doesn't require Astro optimization — it's a layout concern). CASE-05 requires WebP for content images (first project image), which uses `entry.data.thumbnail` with `<Image>`. Full-bleed images can be pre-optimized WebP files placed in `public/` and referenced by string path. Document this approach in the placeholder MDX.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Astro build | Yes | >=22.12.0 (engines field) | — |
| `sharp` (peer dep) | `<Image>` WebP optimization | Implicit via Astro | Bundled with Astro | — |
| `astro dev` / `astro build` | All development | Yes | ^6.1.5 | — |
| No additional external dependencies required | — | — | — | — |

Phase 3 is entirely code-driven with no external service dependencies. No environment audit gaps.

---

## Validation Architecture

`nyquist_validation` is enabled in `.planning/config.json`.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — Astro build + manual browser verification |
| Config file | n/a |
| Quick run command | `npm run build && npm run preview` |
| Full suite command | `npm run typecheck && npm run build` |

This is a static Astro site with no automated test runner. Validation is via build-time checks (`astro check` for TypeScript, `astro build` for schema validation) and browser verification against acceptance criteria.

### Phase Requirements — Acceptance Criteria

| Req ID | Behavior | Verification Method | Automated? |
|--------|----------|---------------------|-----------|
| HERO-01 | Homepage opens with name, role, availability text | `npm run build` passes; browser: `localhost:4321/` shows Tanya Zakus display heading + availability text | Manual + build |
| HERO-02 | Hero copy is specific, non-generic | Code review of hero copy in `index.astro` against D-02/D-04 spec | Manual code review |
| HERO-03 | 2–3 featured projects shown below hero | Browser: verify featured cards appear; `project-alpha.mdx` has `featured: true` | Manual + build |
| WORK-01 | `/work` page lists all projects as numbered cards | `npm run build` + browser: `/work` renders 01, 02... cards | Manual + build |
| WORK-02 | Cards show number, thumbnail, title, role/skills tags, summary | Browser inspection of card anatomy | Manual |
| WORK-03 | Alternating layout — image left odd, right even | Browser: card 1 has image left, card 2 has image right | Manual |
| WORK-04 | Per-project accent color on card number | Browser: project-alpha number is `#2563EB`, project-beta number is `#7C3AED` | Manual |
| WORK-05 | Hover: image scales 1.05 + card shadow | Browser: hover over card, verify scale + shadow; check `overflow:hidden` clips scaled image | Manual |
| WORK-06 | Scroll animation fires on cards entering viewport | Browser: scroll `/work`; cards fade up; confirm `is-visible` class added via DevTools | Manual |
| CASE-01 | `/projects/project-alpha` and `/projects/project-beta` routes exist | `npm run build` produces `dist/projects/project-alpha/index.html` and `project-beta/index.html` | Build verification |
| CASE-02 | Case study page has Problem/My Role/Process/Outcome sections | Browser: visit case study; verify 4 sections present | Manual |
| CASE-03 | Case study uses global tokens only (D-15 override) | Code review: no `accentColor` usage in `[id].astro` or case study layout | Manual code review |
| CASE-04 | Full-bleed image breaks out of 760px column | Browser: `<FullBleedImage>` spans full viewport width | Manual |
| CASE-05 | Images are WebP via Astro `<Image>` | `npm run build` + verify `dist/_astro/*.webp` files exist; DevTools Network tab shows WebP | Build + Manual |
| POL-01 | prefers-reduced-motion disables animations | Browser DevTools: force `prefers-reduced-motion: reduce`; verify elements render visible without transition | Manual DevTools |

### Wave 0 Gaps

- [ ] `src/scripts/scroll-animation.ts` — covers WORK-06, POL-01, CASE-02 animation
- [ ] `src/components/FullBleedImage.astro` — covers CASE-04
- [ ] `src/pages/projects/[id].astro` — covers CASE-01 through CASE-05
- [ ] `src/pages/work.astro` — covers WORK-01 through WORK-06
- [ ] Enrich `project-alpha.mdx` and `project-beta.mdx` — covers CASE-02, D-17

*(No existing test infrastructure — all files are Wave 0 creates)*

---

## Sources

### Primary (HIGH confidence)
- [docs.astro.build/en/guides/content-collections](https://docs.astro.build/en/guides/content-collections/) — Content Layer API, glob loader, id/slug behavior, getStaticPaths pattern, render() function
- [docs.astro.build/en/guides/integrations-guide/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/) — MDX components prop, content collection render, custom component injection
- [docs.astro.build/en/guides/images](https://docs.astro.build/en/guides/images/) — Image component usage with image() schema field, WebP format, responsive srcset
- [docs.astro.build/en/guides/client-side-scripts](https://docs.astro.build/en/guides/client-side-scripts/) — Script module behavior, deduplication, TypeScript support, is:inline vs default
- `src/content.config.ts` — Confirmed schema shape [VERIFIED: codebase read]
- `src/styles/global.css` — Confirmed all design tokens [VERIFIED: codebase read]
- `package.json` — Confirmed installed versions [VERIFIED: codebase read]
- `astro.config.mjs` — Confirmed output:static, no adapter [VERIFIED: codebase read]

### Secondary (MEDIUM confidence)
- [johndalesandro.com — Astro next/prev navigation pattern](https://johndalesandro.com/blog/astro-adding-previous-and-next-post-navigation-links-to-blog/) — Sort + index pattern for prev/next; wrap-around logic extended from this base
- [css-tricks.com/full-bleed](https://css-tricks.com/full-bleed/) — Negative margin full-bleed technique
- [frontendmasters.com/blog/full-bleed-layout-with-modern-css](https://frontendmasters.com/blog/full-bleed-layout-with-modern-css/) — Modern CSS approaches for full-bleed within constrained layout
- Astro upgrade guide / migration guides (multiple sources) — Confirmed render() API change from Astro 4 to 5

### Tertiary (LOW confidence — verified via multiple sources)
- Entry id = filename stem confirmed via multiple migration guides and community posts; the `slug` frontmatter → id override confirmed via official docs quote and community issue reports

---

## Metadata

**Confidence breakdown:**
- Content Layer API patterns: HIGH — verified against official Astro 6 docs
- Image optimization: HIGH — verified against official Astro docs
- IntersectionObserver + CSS: HIGH — standard browser API, no library dependency
- MDX components prop: HIGH — verified against official @astrojs/mdx docs
- Full-bleed technique: MEDIUM — multiple credible sources; `100vw` scrollbar edge case documented
- Alternating layout Tailwind classes: MEDIUM — standard CSS, Tailwind v4 class names assumed stable

**Research date:** 2026-04-16
**Valid until:** 2026-07-01 (Astro stable releases; check for 6.x breaking changes if significant time passes)
