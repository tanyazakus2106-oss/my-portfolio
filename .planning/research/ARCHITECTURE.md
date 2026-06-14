# Architecture Research

> **STATUS: Frozen pre-implementation research (2026-04-11). Superseded by actual implementation.**
>
> This document explores a **Next.js + `src/data/projects.ts`** architecture. The shipped v1.0 took a different path: **Astro 6 + MDX Content Collections** (see `.planning/PROJECT.md` and the **Architecture** section of `/CLAUDE.md` for current reality).
>
> Kept on disk for historical context — it captures the road not taken and the reasoning that led to choosing Astro. Do **not** treat its component names, file paths, or data-flow diagrams as current. Do not use this file as a source for regenerating CLAUDE.md's Architecture section; that section is now maintained manually against the actual codebase.

**Domain:** Personal UX/UI designer portfolio site (static, no CMS)
**Researched:** 2026-04-11
**Confidence:** HIGH (at time of writing — see status callout above)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Pages (Routes)                        │
├───────────────┬─────────────────────┬───────────────────────┤
│  / (Home)     │  /work (Project     │  /work/[slug]         │
│               │   Index)            │  (Case Study)         │
│  /about       │                     │                        │
│  /contact     │                     │                        │
└───────┬───────┴──────────┬──────────┴───────────┬───────────┘
        │                  │                       │
┌───────▼──────────────────▼───────────────────────▼──────────┐
│                    Shared UI Components                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐   │
│  │   Nav    │  │  Footer  │  │ProjectCard│  │CaseStudy   │   │
│  │          │  │          │  │          │  │Section     │   │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                  Data Layer (static TypeScript)              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  src/data/projects.ts  (array of Project objects)    │    │
│  └──────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                  Build / Deploy                               │
│  Next.js static export  →  CDN (Vercel / Netlify)            │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `Nav` | Site-wide navigation, current-page indicator | Server component with active-link logic |
| `Footer` | Contact nudge, social links | Simple server component |
| `ProjectCard` | Thumbnail + title + tags on the index page | Accepts a `Project` object as prop |
| `CaseStudyHero` | Title, role, timeline, brief at top of case study | Reads from project metadata |
| `CaseStudySection` | Reusable content block (text + image pair, full-width image, callout) | Polymorphic via variant prop |
| `ContactBlock` | Email link or mailto CTA, possibly a simple form | Can be a standalone component or section |
| `AboutHero` | Photo + bio intro | Static content, no data dependency |

### Data Layer (no CMS pattern)

All project content lives in a single TypeScript data file. Each project is a typed object. Pages import and consume this array directly. No build-time API calls, no external data source.

```typescript
// src/data/projects.ts
export type Project = {
  slug: string;           // URL: /work/[slug]
  title: string;
  category: "case-study" | "visual";
  tagline: string;
  thumbnail: string;      // path to image in /public
  year: number;
  role: string;
  tags: string[];
  sections: Section[];    // ordered content blocks for the case study page
  featured: boolean;      // controls home page prominence
};

export type Section = {
  type: "text" | "image" | "image-text" | "callout" | "full-bleed";
  heading?: string;
  body?: string;
  imageSrc?: string;
  imageAlt?: string;
  caption?: string;
};

export const projects: Project[] = [ /* ... */ ];
```

This is the single source of truth. The owner edits this file to add or update work.

## Recommended Project Structure

```
my-portfolio/
├── public/
│   └── work/               # Project images, organized by slug
│       └── [slug]/
│           ├── thumbnail.jpg
│           └── [image-name].jpg
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Root layout: Nav + Footer wrapper
│   │   ├── page.tsx        # Home — hero + featured projects
│   │   ├── work/
│   │   │   ├── page.tsx    # Project index (all projects)
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # Dynamic case study page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── components/
│   │   ├── nav/
│   │   │   └── Nav.tsx
│   │   ├── footer/
│   │   │   └── Footer.tsx
│   │   ├── project-card/
│   │   │   └── ProjectCard.tsx
│   │   └── case-study/
│   │       ├── CaseStudyHero.tsx
│   │       └── CaseStudySection.tsx
│   ├── data/
│   │   └── projects.ts     # All project content — only file owner edits
│   └── lib/
│       └── projects.ts     # Helper: getBySlug(), getFeatured(), etc.
```

### Structure Rationale

- **`src/data/projects.ts`:** Single-file content store. Owner adds new work here only. No scattered markdown files to track.
- **`src/lib/projects.ts`:** Keeps data-access logic (filtering, slug lookup) out of page components. Pages stay thin.
- **`src/components/case-study/`:** Case study sections are reusable across all project pages. New project = new data entry, not new component code.
- **`public/work/[slug]/`:** Co-locating images by slug makes it obvious which assets belong to which project.
- **`src/app/work/[slug]/page.tsx`:** Next.js dynamic route. `generateStaticParams()` reads the projects array and pre-renders one page per slug at build time.

## Architectural Patterns

### Pattern 1: Static Data File as Content Store

**What:** All project content (metadata + case study sections) lives in a typed TypeScript array. Pages import and render from this array. No database, no API, no CMS.

**When to use:** When the owner edits code directly, project count is under ~50, and content does not change more than a few times per month.

**Trade-offs:**
- Pro: Zero infrastructure, instant builds, trivially deployable to any CDN
- Pro: Type safety catches structural errors at compile time
- Con: No live preview without running `npm run dev`
- Con: Images must be managed manually in `/public`

**Example:**
```typescript
// src/app/work/[slug]/page.tsx
import { projects } from "@/data/projects";
import { getBySlug } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = getBySlug(params.slug);
  if (!project) notFound();
  return <CaseStudyLayout project={project} />;
}
```

### Pattern 2: Polymorphic CaseStudySection

**What:** A single component renders all case study content blocks via a `type` discriminator. New section layouts are added as new variants, not new components.

**When to use:** When case studies have varied layouts (text blocks, full-bleed images, side-by-side image+text, callout quotes) but the structure is consistent across projects.

**Trade-offs:**
- Pro: One component to style and maintain; visual consistency guaranteed
- Pro: Reordering sections in data reorders them on the page automatically
- Con: Very unusual one-off layouts require a new variant

**Example:**
```typescript
export function CaseStudySection({ section }: { section: Section }) {
  switch (section.type) {
    case "text":      return <TextBlock {...section} />;
    case "image":     return <ImageBlock {...section} />;
    case "full-bleed": return <FullBleedImage {...section} />;
    case "callout":   return <Callout {...section} />;
  }
}
```

### Pattern 3: Root Layout as Shell

**What:** `src/app/layout.tsx` wraps all pages with `<Nav>` and `<Footer>`. Individual pages only render their own content — never re-declare navigation.

**When to use:** Always, for a multi-page site. Prevents nav/footer duplication and ensures consistent chrome.

**Trade-offs:**
- Pro: Change nav once, it updates everywhere
- Con: Pages that need full-bleed layouts (no nav chrome) require a nested layout override

## Data Flow

### Page Render Flow (static generation)

```
Build time:
projects.ts (data) → generateStaticParams() → pre-render /work/[slug] for each slug

Request time (CDN served):
Browser request → CDN serves pre-built HTML → React hydrates → interactive
```

### Case Study Page Data Flow

```
projects.ts
    ↓ import
src/lib/projects.ts  (getBySlug)
    ↓
/work/[slug]/page.tsx
    ↓ props
CaseStudyHero  ←── project.title, role, year, tagline
CaseStudySection[] ←── project.sections (ordered array, rendered in sequence)
```

### Project Index Data Flow

```
projects.ts
    ↓ import
src/lib/projects.ts  (all | getFeatured)
    ↓
/work/page.tsx
    ↓ props
ProjectCard[]  ←── project.slug, thumbnail, title, tags, category
```

### Home Page Data Flow

```
projects.ts
    ↓ getFeatured()
/page.tsx
    ↓
HeroSection (static copy)
FeaturedProjects ←── featured subset of projects (2-4 cards)
ContactCTA (static)
```

### Key Data Flows

1. **Adding a new project:** Owner edits `projects.ts` → adds images to `public/work/[slug]/` → runs `npm run build` → deploys. Nothing else changes.
2. **Updating site copy (bio, contact):** Owner edits the relevant page component directly (`about/page.tsx`, `contact/page.tsx`). These pages have no data dependency.

## Build Order (Dependency Chain)

Build phases must respect these dependencies:

```
1. Data model (Project type, Section type in projects.ts)
        ↓ required by
2. Data file (projects array populated)
        ↓ required by
3. lib/projects.ts helpers (getBySlug, getFeatured)
        ↓ required by
4. Dynamic case study route (/work/[slug])
        ↓ can be built after
5. Project index (/work)
        ↓ after nav is stable
6. Root layout (Nav + Footer)
        ↓ wraps
7. Home, About, Contact pages
```

**Practical implication:** Establish the `Project` type and at least one real project entry before building any page. Page components are thin wrappers; the data shape drives everything.

## Anti-Patterns

### Anti-Pattern 1: One Component File Per Case Study

**What people do:** Create `src/app/work/brand-redesign/page.tsx` with hardcoded JSX for every case study, duplicating layout code.

**Why it's wrong:** Adding a new project requires writing new component code, not just data. Restyling any layout element requires touching N files. The site becomes harder to maintain as work grows.

**Do this instead:** Use the dynamic `[slug]` route + data-driven `CaseStudySection`. New work = new data entry only.

### Anti-Pattern 2: Fetching Project Data at Runtime

**What people do:** Hit an API route or external service to load project content on each request.

**Why it's wrong:** Adds latency, requires server infrastructure, and is entirely unnecessary for content that changes only when the owner deploys. A portfolio is inherently static.

**Do this instead:** Import data directly from `projects.ts`. Build-time static generation means zero runtime data fetching.

### Anti-Pattern 3: Burying Images in `src/` Instead of `public/`

**What people do:** Co-locate project images with component files using import paths.

**Why it's wrong:** Next.js `<Image>` optimization works best with `/public` paths or remote URLs. Importing from `src/` adds complexity and limits optimization options.

**Do this instead:** Store all project images under `public/work/[slug]/` and reference them as string paths in the data file.

### Anti-Pattern 4: Scattered Contact State

**What people do:** Manage contact form submission state inside the page-level component, mixing UI and network logic.

**Why it's wrong:** Harder to test, harder to swap the submission mechanism (e.g., from Formspree to Resend).

**Do this instead:** Isolate contact form logic in a `ContactForm` component with a single `onSubmit` prop. The page component just renders it.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vercel / Netlify | Push-to-deploy static export | Zero configuration needed; connect repo, auto-builds on push |
| Image hosting | Local `/public` directory | Fine for portfolio scale; no CDN transform needed beyond Next.js `<Image>` |
| Contact form | Formspree, Web3Forms, or `mailto:` link | Formspree is zero-backend; `mailto:` is simplest but no copy retention |
| Analytics | Vercel Analytics or Plausible script | Add to root `layout.tsx`; no architectural change needed |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `data/projects.ts` → pages | Direct TypeScript import | No abstraction needed at this scale; add `lib/` helpers only when filtering logic grows |
| Pages → components | Props (typed) | Components are pure functions of their props; no shared state needed |
| Nav → pages | Next.js `<Link>` + `usePathname()` | Active link highlighting is the only cross-component concern |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1–15 projects | Current architecture is sufficient. Single `projects.ts` file. |
| 15–50 projects | Split `projects.ts` into per-project files; barrel-export from `index.ts`. No structural change. |
| 50+ projects | Consider MDX files (one per case study) with frontmatter metadata. Preserves no-CMS requirement while making long-form content easier to write. |

### Scaling Priorities

1. **First bottleneck:** Build time (more projects = more static pages). Still fast at 50+ pages; non-issue.
2. **Second bottleneck:** Image management becomes unwieldy as `/public` grows. Solution: move to a hosted image service (Cloudinary free tier) and store URLs in `projects.ts`.

## Sources

- Next.js App Router documentation: https://nextjs.org/docs/app
- Next.js Static Exports guide: https://nextjs.org/docs/pages/guides/static-exports
- UX Portfolio case study anatomy (IxDF): https://ixdf.org/literature/article/how-to-create-the-perfect-structure-for-a-ux-case-study
- Portfolio case study structure (UX Planet): https://uxplanet.org/ux-portfolio-case-study-template-plus-examples-from-successful-hires-86d5b0faa2d6
- Next.js project structure patterns 2025 (DEV Community): https://dev.to/pipipi-dev/app-router-directory-design-nextjs-project-structure-patterns-31eo

---
*Architecture research for: Personal UX/UI designer portfolio site*
*Researched: 2026-04-11*
