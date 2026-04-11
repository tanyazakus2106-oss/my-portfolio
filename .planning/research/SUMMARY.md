# Project Research Summary

**Project:** Tanya Zakus Personal Portfolio
**Domain:** UX/UI Designer Personal Portfolio Site (static, code-edited)
**Researched:** 2026-04-11
**Confidence:** HIGH

## Executive Summary

This is a static, personal UX/UI designer portfolio — a content-light, image-heavy site whose primary job is to get Tanya hired or contacted by recruiters and freelance clients. The expert consensus is clear: build it as a fully static site with zero client-side JavaScript overhead, use a file-system-based content model (MDX files), and deploy to a CDN. Astro 6 is the purpose-built tool for this exact problem. It ships zero JS by default, has native support for Content Collections with schema validation, and produces Lighthouse-perfect output without configuration. Tailwind CSS v4 handles design tokens in a single CSS file — exactly the one-person maintenance model this project demands.

The recommended architecture centers on a data-driven, single-template approach: a typed content schema in `content.config.ts` drives all case study pages through one dynamic `[slug]` route and a polymorphic `CaseStudySection` component. This means adding a new project is an MDX file edit and asset drop, not a code change. The contact form runs through Formspree — no backend, no API keys, no serverless functions. Hosting on Cloudflare Pages (unlimited bandwidth free tier) is ideal for an image-heavy portfolio.

The single greatest risk is not technical — it is content. Research is unambiguous: portfolios fail when case studies show polished screens without exposing design thinking, omit outcomes, and blur personal contribution with team attribution. The narrative structure of each case study must be locked before any templates are built. A second category of risk is image performance: uncompressed Figma PNG exports will crater PageSpeed scores and cause recruiter bounce before the work is ever seen. Both risks are fully preventable with upfront planning.

## Key Findings

### Recommended Stack

Astro 6 is the clear choice for a static designer portfolio. It ships zero JS to the browser by default, uses file-system routing, and validates content schemas at build time — which catches typos in case study frontmatter before they reach production. Tailwind CSS v4 replaces the JS config file with an `@theme` CSS block, making the design system (typeface, color palette, spacing scale) visible in one place. MDX via `@astrojs/mdx` lets Tanya write case study content as plain text files she edits in VS Code, with the ability to embed interactive components when needed. There is no CMS, no admin panel, no login.

**Core technologies:**
- **Astro 6.1.5**: Site framework and static site generator — purpose-built for content-heavy static sites; zero JS shipped by default; Content Collections with schema validation
- **TypeScript 5.x** (bundled): Type safety — catches broken content schemas at build time, not in production
- **Tailwind CSS 4.2.2**: Utility-first styling — design tokens declared in CSS via `@theme`; Lightning CSS engine for near-instant builds
- **MDX via `@astrojs/mdx`**: Case study content format — plain text files with embedded component support; no CMS required
- **Formspree**: Contact form submissions — zero backend, no API keys, 50 submissions/month free tier, spam filtering included
- **Cloudflare Pages** (hosting): Unlimited bandwidth on free tier — critical for an image-heavy portfolio; auto-detects Astro static builds

**Do not use:** Gatsby (maintenance mode), Next.js App Router (ships 40-85KB JS runtime that adds zero value for static content), WordPress or any headless CMS (unnecessary API keys and rebuild complexity for a site that changes quarterly), Bootstrap/Material UI (visual opinions that conflict with a bespoke design and require heavy CSS override work).

### Expected Features

Research across recruiter guidance, hiring manager interviews, and portfolio critique communities is strongly convergent on what distinguishes effective portfolios. The key insight: recruiters spend 6-30 seconds on an initial scan. Everything else must earn more time.

**Must have (table stakes):**
- Project index / work grid — the portfolio only exists once visitors can see the work
- 3-5 dedicated case study pages with problem / process / outcome structure — cards and PDFs are not substitutes
- Results-first summary block at the top of each case study — problem, role, outcome visible before the narrative
- Explicit "My Role" block per case study — team attribution vs. personal ownership clearly stated
- About page with bio and design philosophy — both recruiter and freelance audiences want to understand the person
- Contact CTA visible without scrolling — a portfolio with no easy contact path has failed its primary job
- Availability / status signal adjacent to the contact CTA — freelance clients need this before investing reading time
- Responsive design (mobile + desktop) — approximately 50% of initial browsing is mobile
- Semantic HTML, alt text, and focus states — accessibility built in from day one; retrofitting is expensive
- Correct page titles and meta descriptions with designer name and role — AI-assisted recruiter tools parse these

**Should have (competitive):**
- Curated "featured" work on homepage (2-3 hero projects) rather than full index — signals taste and intentionality
- Hover effects on project cards — micro-interaction that signals design craft before a case study is opened
- Testimonials from past clients or collaborators — critical for freelance conversion; rare at mid-level and therefore differentiating
- Open Graph / social preview images per page — professional signal when URLs are shared in Slack or LinkedIn
- Scroll-triggered entrance animations — polish; defer until layout is stable post-launch
- Reflections / lessons learned section in case studies — signals maturity; valued by senior hiring managers

**Defer (v2+):**
- Blog / writing section — only if Tanya commits to ongoing maintenance; an empty blog signals neglect
- Dark mode toggle — doubles visual QA burden; lower ROI than other improvements post-launch
- Password-protected case studies — only if NDA projects become relevant to showcase
- Live Figma prototype embeds — external service dependency; use static screenshots with optional external links instead

**Anti-features to avoid explicitly:** Full-screen loading animation, heavy animation on every element, cluttered work grid showing all work, resume PDF as primary CTA, infinite scroll on project index.

### Architecture Approach

The architecture is a data-driven static site built on Astro's Content Collections. All project metadata and case study content lives in MDX files under `src/content/projects/` with a schema validated by `src/content.config.ts`. A single dynamic route (`src/pages/work/[slug].astro`) renders every case study using a shared `CaseStudySection` component that handles all section variants (text block, full-bleed image, image+text, callout) via a type discriminator. Pages are thin route handlers; all logic lives in typed data and reusable components. The shell (Nav + Footer) wraps all pages via a shared Layout component. Contact state is isolated in a standalone `ContactForm` component that POSTs to Formspree.

Note: ARCHITECTURE.md was researched with Next.js framing; the component model and data patterns described are sound and translate directly to Astro. `generateStaticParams` becomes `getStaticPaths()`; everything else is equivalent.

**Major components:**
1. **Root Layout** (`src/layouts/BaseLayout.astro`) — wraps all pages with Nav + Footer; change once, updates everywhere
2. **ProjectCard** — thumbnail + title + tags on the index page; accepts a typed Project object as prop
3. **CaseStudySection** — polymorphic content block component; renders text, image, full-bleed, and callout variants from a `type` discriminator; single component to maintain for all case study layouts
4. **CaseStudyHero** — title, role, timeline, and results-first summary block at the top of each case study page
5. **ContactForm** — isolated form component that POSTs to Formspree; decoupled from page so the submission mechanism can be swapped without touching page layout
6. **Nav** — site-wide navigation with current-page indicator via Astro's `Astro.url.pathname`

**Key pattern:** The content schema in `content.config.ts` is the first code artifact. Every page component is a thin consumer of that schema. Build the schema before building any pages.

### Critical Pitfalls

1. **Case studies show work but not thinking** — Structure every case study around problem → constraints → key decisions with rationale → iterations → outcome. Lock this narrative template before writing content. A case study skimmable entirely through images has failed its purpose.

2. **No stated outcomes** — Build a Results/Impact section into the MDX template as a required field. Outcomes do not have to be hard metrics — qualitative results and shipping success are acceptable. No outcome at all is never acceptable.

3. **Unclear personal contribution on team projects** — Require a "My Role" block in the first 100 words of every case study: team size, what was personally owned, what was collaborative, what was handed off. "We" throughout a case study is a senior-role credibility killer.

4. **Unoptimized images destroy page performance** — Raw Figma PNG exports will produce PageSpeed scores below 60 and cause recruiter bounce. Define image standards before adding any content: WebP format, max 200KB per image, lazy loading for below-fold images. Use Astro's built-in `<Image>` component — it handles this automatically.

5. **Portfolio UX fails to demonstrate UX skill** — A UX designer with confusing navigation, broken mobile layout, or a buried contact method directly contradicts their claimed expertise. Validate user flows before visual design. Test on a physical device, not just DevTools.

## Implications for Roadmap

Based on combined research, the natural phase structure follows content strategy → infrastructure → pages → supporting pages → polish. Content decisions gate all technical work.

### Phase 1: Foundation and Content Strategy
**Rationale:** Content structure must be decided before any template is built. The case study narrative template cannot be retrofitted cheaply once pages exist. Project curation must happen before the index is designed. Positioning statement must be written before homepage layout is touched. These are blocking decisions, not optional prep.
**Delivers:** Project shortlist (3-5 pieces), case study narrative template (problem / process / outcome / role / reflection), positioning statement for hero, image format and size standards (WebP, 200KB max), content schema spec
**Addresses:** Establishes the structure that prevents the top 3 critical pitfalls (no thinking shown, no outcomes, unclear contribution)
**Avoids:** "Case studies show work not thinking" pitfall; "unclear personal contribution" pitfall; "too much content, poor curation" pitfall; "no immediate identity clarity" pitfall

### Phase 2: Project Setup and Design System
**Rationale:** Scaffold the Astro project and establish the content schema before building any pages. The schema in `content.config.ts` is the dependency everything else flows from.
**Delivers:** Astro 6 project scaffold with TypeScript strict mode, Tailwind v4 design tokens in `@theme`, content schema in `content.config.ts`, base layout component (Nav + Footer shell), Prettier formatting configured, deploy pipeline connected to Cloudflare Pages
**Uses:** Astro 6.1.5, Tailwind CSS 4.2.2, `@astrojs/mdx`, `@astrojs/sitemap`
**Implements:** Root layout, Nav, Footer shells (unstyled structure)
**Avoids:** Anti-pattern of building pages before the data shape is locked

### Phase 3: Core Pages — Work Index and Case Studies
**Rationale:** The project index and case study pages are the portfolio's reason for existing. Build these with real content (not placeholder) so image standards and layout decisions are tested against reality.
**Delivers:** Project index (`/work`) with curated work grid and hover effects; 3-5 full case study pages (`/work/[slug]`) with results-first summary, problem/process/outcome narrative, role block, full imagery; responsive layout at all breakpoints; accessibility built in (semantic HTML, alt text, focus states)
**Implements:** `ProjectCard`, `CaseStudyHero`, `CaseStudySection` (polymorphic), dynamic `[slug]` route with `getStaticPaths()`
**Avoids:** "Unreadable or tiny images" pitfall; "orphaned project pages" UX pitfall; accessibility retrofitting cost

### Phase 4: Supporting Pages and Contact
**Rationale:** About and Contact pages depend on the site shell being stable. Contact form requires end-to-end testing before launch — treat form delivery verification as a hard launch blocker.
**Delivers:** About page with bio, philosophy, and positioning; Contact page with Formspree form tested with real submission, `mailto:` fallback, and availability status signal; correct `<title>`, `<meta description>`, and Open Graph tags on all pages; homepage with hero, featured projects (2-3), and contact CTA
**Implements:** `ContactForm` component (isolated, POSTs to Formspree), per-page Open Graph meta, hero positioning statement
**Avoids:** "Contact hard to find or broken" pitfall; missing identity clarity on homepage

### Phase 5: Performance, Polish, and Launch Readiness
**Rationale:** Scroll animations require stable layout. Testimonials require content sourcing. Performance verification must precede launch — image compression and PageSpeed targets are launch blockers, not finishing touches.
**Delivers:** Scroll-triggered entrance animations (with `prefers-reduced-motion` respect); testimonials section (if content sourced); sitemap.xml verified; all images confirmed WebP under 200KB; PageSpeed mobile score above 80; full "looks done but isn't" checklist completed; broken link audit; spelling/grammar review; contact form final end-to-end test
**Avoids:** "Slow load from image bloat" pitfall; scroll animation performance trap; launching with unverified contact form

### Phase Ordering Rationale

- Content decisions (Phase 1) gate all technical work because the case study narrative template defines what goes in the content schema, which defines what components render, which defines what pages exist. This is not overhead — it prevents the most expensive rework in the project.
- Project setup (Phase 2) must precede all page work because the content schema is the single source of truth that all page components consume.
- Work pages (Phase 3) before supporting pages (Phase 4) because the portfolio's value proposition is the work itself; About and Contact are support infrastructure.
- Polish (Phase 5) last because scroll animations require layout stability and testimonials require content sourcing that may not be ready at launch.
- Accessibility is a constraint on every phase, not a separate phase. Semantic HTML and alt text built in during Phase 3; focus states and motion preferences verified in Phase 5.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Case Study Pages):** MDX inline image handling in Astro Content Collections — how images referenced inline in MDX body (vs. frontmatter) integrate with Astro's `<Image>` optimization pipeline has nuances worth verifying against current docs before implementation.
- **Phase 4 (Contact):** Formspree honeypot and reCAPTCHA v3 configuration — spam protection setup is not complex but should be verified against current Formspree docs to confirm free-tier availability of these features.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Project Setup):** Astro 6 scaffolding and Tailwind v4 integration are well-documented with official `npx astro add` commands. No additional research needed.
- **Phase 5 (Performance):** WebP conversion, lazy loading, and PageSpeed auditing are established patterns. Astro's built-in `<Image>` component handles the heavy lifting automatically.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official GitHub releases, official docs, and official blog posts. Astro 6.1.5 and Tailwind 4.2.2 confirmed latest stable. Multiple independent performance comparisons corroborate Astro over Next.js for static sites. |
| Features | HIGH | Strong consensus across recruiter guidance, hiring manager interviews, IxDF literature, and multiple portfolio critique communities. Same patterns appear independently across all sources. |
| Architecture | MEDIUM-HIGH | Core patterns are sound and well-established. Minor caveat: ARCHITECTURE.md was framed around Next.js rather than Astro; pattern translation is straightforward but warrants a small verification step during Phase 2 setup. |
| Pitfalls | HIGH | Cross-verified across 9+ authoritative sources including recruiter accounts, hiring manager interviews, and technical performance data. All critical pitfalls independently corroborated by multiple sources. |

**Overall confidence:** HIGH

### Gaps to Address

- **MDX inline image handling in Astro Content Collections:** Frontmatter image references are well-documented; inline MDX image optimization has less coverage. Verify during Phase 3 that both patterns work as expected before building all case study templates.
- **Formspree spam filtering behavior at low volume:** Whether Formspree's spam filter aggressively blocks legitimate first-contact messages from unknown senders is worth monitoring post-launch. Have `mailto:` fallback ready from day one.
- **Testimonial content is a people dependency:** Tanya needs to source 1-3 quotes from past clients or collaborators before Phase 5. This requires outreach, not technical work — flag early so it does not block launch.
- **Project content readiness:** Research assumes 3-5 case studies with real outcomes and imagery exist. If case study content is not ready at project start, Phase 1 must include a content production sprint before any technical work begins. This should be clarified in requirements.

## Sources

### Primary (HIGH confidence)
- GitHub releases (astro/astro) — confirmed Astro 6.1.5 latest stable 2026-04-08
- GitHub releases (tailwindlabs/tailwindcss) — confirmed Tailwind CSS v4.2.2 latest stable 2026-03-18
- docs.astro.build — Content Collections, `content.config.ts`, MDX integration, `<Image>` component
- astro.build/blog/astro-5/ — Content Layer API, MDX performance
- tailwindcss.com/blog/tailwindcss-v4 — v4 architecture, `@theme` config, Lightning CSS engine
- ixdf.org — UX portfolio case study structure, hiring manager expectations, what UX portfolios must contain
- uxfol.io — UX Portfolio Playbook 2026, case study template and structure
- uxplaybook.org — Portfolio homepage mistakes 2025, senior UX portfolio guide 2026
- interaction-design.org — Portfolio mistakes costing jobs
- uxdesign.cc — 30-second portfolio rejection research
- nextjs.org/docs — Static exports guide, App Router documentation (architecture reference)

### Secondary (MEDIUM confidence)
- eastondev.com, makersden.io, reliasoftware.com — Astro vs Next.js performance comparisons for static sites (corroborated by multiple independent sources)
- danubedata.ro, digitalapplied.com, bejamas.com — Cloudflare Pages free tier bandwidth confirmation
- help.formspree.io — 50 submissions/month free tier limit confirmation
- nitropack.io — Image optimization standards 2026
- muzli.blog — Portfolio mistakes designers still make in 2026
- designlab.com, careerstrategylab.com — Common UX portfolio mistakes
- uxdesigninstitute.com — What hiring managers look for in a UX portfolio
- rockpaperscissors.studio — Performance mistakes and UX impact 2025

### Tertiary (LOW confidence)
- dev.to/pipipi-dev — Next.js App Router project structure patterns (used as architecture reference only; adapted to Astro conventions)

---
*Research completed: 2026-04-11*
*Ready for roadmap: yes*
