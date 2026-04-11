# Requirements: Tanya's UX/UI Design Portfolio

**Defined:** 2026-04-11
**Core Value:** Visitors immediately understand the quality and range of the designer's work, and have a clear path to get in touch.

## v1 Requirements

### Foundation & Setup

- [ ] **FOUND-01**: Site scaffolded with Astro 6 + Tailwind CSS v4 + MDX Content Collections
- [ ] **FOUND-02**: Project content schema defined (`content.config.ts`) with typed frontmatter (title, slug, role, accent color, thumbnail, skills, summary)
- [ ] **FOUND-03**: Root layout shell with sticky header and footer wrapping all pages
- [ ] **FOUND-04**: Site deploys successfully to Cloudflare Pages

### Header & Navigation

- [ ] **NAV-01**: Sticky header with name/logo on left, nav links on right (Work / About / Resume / LinkedIn)
- [ ] **NAV-02**: Dark/light mode toggle icon in header, persisted to localStorage
- [ ] **NAV-03**: Hamburger icon triggers full-screen overlay navigation on all viewports
- [ ] **NAV-04**: Active page indicated in nav
- [ ] **NAV-05**: Header is fully responsive across mobile and desktop

### Hero

- [ ] **HERO-01**: Homepage opens with a warm personal intro (name, role/specialty, current availability)
- [ ] **HERO-02**: Hero establishes current role/focus and hints at personality — not a generic tagline
- [ ] **HERO-03**: Featured projects section below hero highlights 2–3 selected works

### Work Index

- [ ] **WORK-01**: Projects page lists all case studies as numbered cards (01, 02, 03…)
- [ ] **WORK-02**: Each project card shows: number, thumbnail, title, role/skills tags, short description
- [ ] **WORK-03**: Project cards use alternating image + text layout (not a uniform grid)
- [ ] **WORK-04**: Each project has a distinct accent color applied to its card and detail page
- [ ] **WORK-05**: Card hover state triggers a clean, subtle interaction (inspired by wenjing.io)
- [ ] **WORK-06**: Scroll-entrance animations on cards as they enter the viewport

### Case Study Pages

- [ ] **CASE-01**: Each project has a dedicated long-form case study page at `/projects/[slug]`
- [ ] **CASE-02**: Case study page sections: Problem, My Role, Process, Outcome
- [ ] **CASE-03**: Case study uses project accent color for headings, dividers, and highlights
- [ ] **CASE-04**: Full-bleed image sections supported between text blocks
- [ ] **CASE-05**: Images are WebP format, max 200KB, using Astro's built-in `<Image>` component
- [ ] **CASE-06**: Case study page is fully responsive on mobile

### About

- [ ] **ABOUT-01**: About page includes bio and design philosophy
- [ ] **ABOUT-02**: About communicates availability/what Tanya is open to (full-time, freelance, or both)
- [ ] **ABOUT-03**: About has personality — warm, human, not a resume summary

### Contact

- [ ] **CONT-01**: Email link (mailto:) accessible from footer and/or About page — no dedicated Contact page
- [ ] **CONT-02**: Resume opens as a downloadable PDF via the Resume nav link
- [ ] **CONT-03**: LinkedIn nav link opens Tanya's LinkedIn profile in a new tab

### Footer

- [ ] **FOOT-01**: Footer mirrors nav links (Work / About / Resume / LinkedIn)
- [ ] **FOOT-02**: Footer includes social links (LinkedIn, email)
- [ ] **FOOT-03**: Footer includes a "get in touch" CTA or brief closing line

### SEO & Performance

- [ ] **SEO-01**: Every page has a title tag including name + "UX/UI Designer"
- [ ] **SEO-02**: Every page has a meta description
- [ ] **SEO-03**: Open Graph tags on all pages (title, description, image) for clean LinkedIn sharing
- [ ] **SEO-04**: Custom favicon
- [ ] **SEO-05**: Mobile Lighthouse performance score above 80

### Polish & Interactions

- [ ] **POL-01**: Scroll-triggered entrance animations on page sections (subtle, not distracting)
- [ ] **POL-02**: Consistent dark/light mode styles across all pages and components
- [ ] **POL-03**: Typography scale defined and applied consistently (size, weight, line-height)
- [ ] **POL-04**: Spacing and layout rhythm consistent across all pages

## v2 Requirements

### Content

- **V2-CONT-01**: Testimonials section with LinkedIn recommendations or client quotes
- **V2-CONT-02**: Resume PDF updated independently of site deploys (consider hosted link)
- **V2-CONT-03**: Availability status indicator in header (open/closed to work badge)

### Features

- **V2-FEAT-01**: Project type / role filter on work index
- **V2-FEAT-02**: Password-protected case study sections for NDA work
- **V2-FEAT-03**: Analytics (Plausible or similar privacy-respecting tool)
- **V2-FEAT-04**: Blog / writing section for design articles

## Out of Scope

| Feature | Reason |
|---------|--------|
| CMS / admin panel | Owner edits code directly — no CMS needed |
| Prototype / Figma embeds | Not in current showcase scope |
| UX research docs | Not in current showcase scope |
| Contact form with backend | Email link sufficient for v1; Formspree can be added if volume warrants |
| Dark mode forced on first load | System preference respected; toggle available |
| Video backgrounds | Performance risk on image-heavy portfolio |

## Traceability

Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01–04 | — | Pending |
| NAV-01–05 | — | Pending |
| HERO-01–03 | — | Pending |
| WORK-01–06 | — | Pending |
| CASE-01–06 | — | Pending |
| ABOUT-01–03 | — | Pending |
| CONT-01–02 | — | Pending |
| FOOT-01–03 | — | Pending |
| SEO-01–05 | — | Pending |
| POL-01–04 | — | Pending |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 38 ⚠️

---
*Requirements defined: 2026-04-11*
*Last updated: 2026-04-11 after initial definition*
