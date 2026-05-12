# Roadmap: Tanya's UX/UI Design Portfolio

## Overview

Six phases take this portfolio from an empty directory to a launched, polished site on Cloudflare Pages. Phase 1 scaffolds the technical foundation and content schema that everything else depends on. Phase 2 builds the persistent UI shell — navigation, footer, and the design system tokens visitors see on every page, including consistent dark mode. Phase 3 delivers the portfolio's reason for existing: the work index, full case study pages, and scroll animations that bring the work to life. Phase 4 completes the site with the About page, contact paths, and all SEO metadata. Phase 5 ensures every layout holds up at any screen size — responsive grid, images, and mobile navigation. Phase 6 deploys the production site to Cloudflare Pages with performance optimization and a custom domain.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Astro project scaffolded, content schema defined, layout shell in place, Cloudflare Pages preview deploy live
- [ ] **Phase 2: Navigation & Design System** - Sticky header, full-screen nav overlay, footer, dark/light mode toggle, and typography/spacing tokens established consistently
- [ ] **Phase 3: Work Index & Case Studies** - Homepage hero, project index with animated cards, scroll entrance animations, and full long-form case study pages with imagery
- [ ] **Phase 4: About, Contact & SEO** - About page, contact paths, resume/LinkedIn links, and all meta tags across every page
- [ ] **Phase 5: Responsive Design** - Responsive grid system, optimized responsive images, and mobile navigation verified across all breakpoints
- [ ] **Phase 6: Deployment** - Production site on Cloudflare Pages, performance optimized, custom domain configured

## Phase Details

### Phase 1: Foundation
**Goal**: The Astro project exists, the content schema is defined, the base layout shell wraps all pages, and a Cloudflare Pages preview deploy is live
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` starts a local site with no errors
  2. `content.config.ts` schema validates project frontmatter fields (title, slug, role, accent color, thumbnail, skills, summary) at build time
  3. Every page is wrapped by a root layout that includes a header and footer slot
  4. Pushing to the main branch triggers a successful Cloudflare Pages preview deploy and the URL is publicly accessible
**Plans**: TBD
**UI hint**: yes

### Phase 2: Navigation & Design System
**Goal**: Every page has a fully functional sticky header with dark/light mode toggle, a full-screen overlay nav, a footer mirroring nav links, and the design token system (typography scale, spacing rhythm, color palette) is applied consistently and correctly across both light and dark modes
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, FOOT-01, FOOT-02, FOOT-03, POL-02, POL-03, POL-04
**Success Criteria** (what must be TRUE):
  1. The header sticks to the top on scroll and the active page is visually indicated in the nav
  2. Clicking the dark/light mode toggle switches the site theme and the preference survives a page refresh
  3. Toggling dark mode on any page produces correct, consistent styles across every component — no flash of wrong theme, no unstyled elements
  4. Clicking the hamburger icon opens a full-screen overlay navigation
  5. The footer displays nav links, social links (LinkedIn and email), and a "get in touch" CTA
  6. Typography size, weight, and line-height are consistent across headings and body text; spacing rhythm is uniform between sections
**Plans**: 3 plans
  - [x] 02-01-PLAN.md — Header + ThemeToggle + FOUC script + BaseLayout component extraction (NAV-01, NAV-02, NAV-04, POL-02, POL-03, POL-04)
  - [x] 02-02-PLAN.md — Mobile hamburger + full-screen overlay navigation with focus trap (NAV-03)
  - [x] 02-03-PLAN.md — Footer two-column grid with CTA, social icons, mirrored nav (FOOT-01, FOOT-02, FOOT-03)
**UI hint**: yes

### Phase 3: Work Index & Case Studies
**Goal**: The homepage establishes Tanya's identity with a warm hero and featured projects, the /work page lists all case studies as visually distinct numbered cards with scroll animations, and each project has a full dedicated case study page that tells the complete design story with imagery
**Depends on**: Phase 2
**Requirements**: HERO-01, HERO-02, HERO-03, WORK-01, WORK-02, WORK-03, WORK-04, WORK-05, WORK-06, CASE-01, CASE-02, CASE-03, CASE-04, CASE-05, POL-01
**Success Criteria** (what must be TRUE):
  1. The homepage opens with a personal intro (name, role, availability) that communicates personality — not a generic tagline — and shows 2–3 featured project cards below
  2. The /work page lists all projects as numbered cards (01, 02, 03…) with alternating image+text layout, accent colors, and a hover interaction
  3. Page sections and cards animate into view on scroll in a way that feels subtle and intentional; `prefers-reduced-motion` disables animations for users who have requested it
  4. Each project card links to a dedicated case study page at /projects/[slug] with Problem, My Role, Process, and Outcome sections
  5. Case study pages use global tokens only for headings and highlights (D-15: no per-project accent color on case study pages — muted label style only), and support full-bleed image sections with WebP images under 200KB via Astro's Image component
**Plans**: TBD
**UI hint**: yes

### Phase 4: About, Contact & SEO
**Goal**: Visitors can learn about Tanya, reach her via email or resume, and every page is correctly described for search engines and social sharing
**Depends on**: Phase 3
**Requirements**: ABOUT-01, ABOUT-02, ABOUT-03, CONT-01, CONT-02, CONT-03, SEO-01, SEO-02, SEO-03, SEO-04
**Success Criteria** (what must be TRUE):
  1. The About page includes a bio, design philosophy, and communicates availability (full-time, freelance, or both) in a warm, human voice
  2. An email mailto: link is accessible from the footer and/or About page without navigating to a separate Contact page
  3. The Resume nav link opens a downloadable PDF and the LinkedIn nav link opens Tanya's LinkedIn profile in a new tab
  4. Every page has a title tag including "Tanya Zakus — UX/UI Designer", a meta description, Open Graph tags, and a custom favicon visible in browser tabs
**Plans**: 4 plans
  - [x] 04-01-PLAN.md — BaseLayout SEO meta extension (OG, Twitter Card, canonical, favicon links) + og-image.png placeholder (SEO-01, SEO-02, SEO-03, SEO-04)
  - [x] 04-02-PLAN.md — About page creation (src/pages/about.astro: hero photo + Now eyebrow + 4-block content per tushar.work skeleton minus Speaking/Press) (ABOUT-01, ABOUT-02, ABOUT-03)
  - [x] 04-03-PLAN.md — Resume + LinkedIn + Instagram URL wiring across Header/Footer/MobileNav + resume PDF placeholder (CONT-01, CONT-02, CONT-03)
  - [x] 04-04-PLAN.md — Per-page SEO props pass-through (homepage + case study route) — Wave 2, depends on 01+02 (SEO-01, SEO-02, SEO-03)
**UI hint**: yes

### Phase 5: Responsive Design
**Goal**: Every page and component is fully usable and visually correct across all screen sizes — mobile, tablet, and desktop — with optimized images and a verified mobile navigation experience
**Depends on**: Phase 4
**Requirements**: NAV-05, CASE-06, RESP-01, RESP-02, RESP-03
**Success Criteria** (what must be TRUE):
  1. All page layouts reflow correctly from 375px mobile to 1440px desktop with no horizontal overflow or broken layout
  2. The header and overlay navigation are fully usable on mobile (touch targets, legible text, no layout shift)
  3. Case study pages are fully readable and correctly laid out on a mobile device
  4. Responsive images load appropriately sized assets for each viewport — no oversized images on mobile
**Plans**: 7 plans
  - [x] 05-01-PLAN.md — Audit-matrix setup: create 05-AUDIT.md with 15 rows × 4 breakpoints + methodology snippets + pre-identified failures (NAV-05, CASE-06, RESP-01, RESP-02, RESP-03)
  - [x] 05-02-PLAN.md — Pre-identified fixes: footer-icon-btn 40→44px + FullBleedImage self-contained overflow-x guard (RESP-01, RESP-03)
  - [x] 05-03-PLAN.md — MobileNav iOS Safari scroll-lock: replace body.overflow with position-fixed scroll-position-capture pattern (NAV-05, RESP-03)
  - [x] 05-04-PLAN.md — Responsive Image widths refinement: About hero [400,600,800,1120] + case study cover [400,800,1200,1800] for DPR-2 mobile coverage (RESP-02, CASE-06)
  - [x] 05-05-PLAN.md — CaseImage MDX wrapper component + FullBleedImage sizes="100vw" (Path A) + registration + doc-comment in project-alpha.mdx (RESP-02, CASE-06)
  - [x] 05-06-PLAN.md — Audit execution: fill all remaining breakpoint cells, Audit Summary, D-01 escape-hatch check, human spot-check (NAV-05, CASE-06, RESP-01, RESP-02, RESP-03)
  - [x] 05-07-PLAN.md — Real-iPhone verification + audit sign-off (NAV-05, CASE-06, RESP-02)
**UI hint**: yes

### Phase 6: Deployment
**Goal**: The portfolio is live on a custom domain via Cloudflare Pages, with passing Lighthouse performance scores and a verified pre-launch checklist
**Depends on**: Phase 5
**Requirements**: SEO-05, DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. The site is deployed to Cloudflare Pages and accessible at the production URL
  2. A custom domain is configured on Cloudflare and resolves correctly with HTTPS
  3. Mobile Lighthouse performance score is above 80
  4. A broken link audit, spelling review, and contact mailto end-to-end test all pass before the site is considered launched
**Plans**: 4 plans
  - [ ] 06-01-PLAN.md — Repo-side launch prep: public/_headers (cache + ASVS L1 security headers), public/_redirects (/work legacy), public/robots.txt, cspell.json (DEPLOY-02, SEO-05)
  - [ ] 06-02-PLAN.md — Pre-cutover QA gates: lychee broken-link audit, cspell spelling review, baseline mobile Lighthouse on preview URL, mailto E2E manual (SEO-05, DEPLOY-02)
  - [ ] 06-03-PLAN.md — Cloudflare dashboard cutover (manual): registrar purchase, custom domain attach apex + www, Universal SSL, SSL Full strict, Always Use HTTPS, www→apex Redirect Rule (DEPLOY-01, DEPLOY-03)
  - [ ] 06-04-PLAN.md — Code cutover + housekeeping + production verify: site: URL flip (D-06), README pointer (D-07), BaseLayout fallbacks, STATE.md cleanup, final Lighthouse on production hostname (DEPLOY-01, DEPLOY-03, SEO-05)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/TBD | Not started | - |
| 2. Navigation & Design System | 0/TBD | Not started | - |
| 3. Work Index & Case Studies | 0/TBD | Not started | - |
| 4. About, Contact & SEO | 0/TBD | Not started | - |
| 5. Responsive Design | 0/TBD | Not started | - |
| 6. Deployment | 0/4 | Not started | - |
