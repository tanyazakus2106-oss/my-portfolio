# Tanya's UX/UI Design Portfolio

## What This Is

A personal portfolio site for a UX/UI designer targeting both full-time roles and freelance clients. The site showcases case studies and visual design work through dedicated project pages, and serves as the primary professional touchpoint for recruiters, hiring managers, and prospective clients.

**Shipped v1.0 on 2026-05-12** — live at https://tanyazakus.com via Cloudflare Pages.

## Core Value

Visitors immediately understand the quality and range of the designer's work, and have a clear path to get in touch.

## Current State

- **Live URL:** https://tanyazakus.com (apex with HTTPS via Cloudflare Pages, www → 301 to apex)
- **Stack:** Astro 6.1 + Tailwind CSS v4 + MDX Content Collections + TypeScript (zero-JS islands)
- **Hosting:** Cloudflare Pages, Cloudflare Registrar (registrar + DNS + Pages in one account)
- **Codebase:** 24 source files, ~1,900 LOC total (`.astro` + `.ts` + `.css` + `.mdx`)
- **Lighthouse mobile (production):** Perf 0.82, A11y 1.00, Best Practices 1.00, SEO 1.00
- **SSL:** Universal SSL via Google Trust Services (CN=WE1), 90-day auto-rotation

## Requirements

### Validated (v1.0)

- ✓ Astro 6 + Tailwind CSS v4 + MDX Content Collections scaffold — v1.0 (Phase 1)
- ✓ Content schema with typed frontmatter (title, slug, role, accentColor, thumbnail, skills, summary, publishDate, featured) — v1.0 (Phase 1)
- ✓ Root layout shell with sticky header and footer — v1.0 (Phase 1)
- ✓ Cloudflare Pages deploy live — v1.0 (Phase 1 preview, Phase 6 production)
- ✓ Sticky header with logo + nav links (Work / About / Resume / LinkedIn) — v1.0 (Phase 2)
- ✓ Dark/light mode toggle with localStorage persistence and no FOUC — v1.0 (Phase 2)
- ✓ Full-screen mobile nav overlay with focus trap + Esc-to-close — v1.0 (Phase 2)
- ✓ Hero, work index, case study pages with accent colors and full-bleed images — v1.0 (Phase 3)
- ✓ Scroll-triggered entrance animations respecting `prefers-reduced-motion` — v1.0 (Phase 3)
- ✓ About page with bio, design philosophy, availability — v1.0 (Phase 4)
- ✓ Contact paths (mailto from footer + About; Resume PDF + LinkedIn from nav) — v1.0 (Phase 4)
- ✓ Site-wide SEO meta (Open Graph, Twitter Card, canonical, branded "tz" favicon) — v1.0 (Phase 4)
- ✓ Responsive design across mobile/tablet/desktop verified on real iPhone hardware — v1.0 (Phase 5)
- ✓ WebP images via Astro `<Image>` with explicit widths/sizes — v1.0 (Phase 5)
- ✓ Production deployment with custom domain + HTTPS (`tanyazakus.com`) — v1.0 (Phase 6)
- ✓ Performance optimization pass — Lighthouse mobile perf 0.82 (SEO-05 gate ≥0.80) — v1.0 (Phase 6)

### Active (v1.1+)

No requirements yet. The next milestone's requirements will be defined via `/gsd-new-milestone`.

Possible directions surfaced during v1.0 development:
- Testimonials section with LinkedIn recommendations or client quotes
- Real case study content replacing the 5 placeholder MDX files
- Analytics (Plausible or similar privacy-respecting tool)
- Blog / writing section
- Project filter on work index (by role or skill tag)

### Out of Scope (v1.0 → v1.1 review)

- **Blog / writing section** — out of v1.0 scope; *open consideration for v1.1+*
- **CMS / admin UI** — confirmed not needed; owner edits MDX directly. **Reasoning still valid.**
- **Prototypes / embedded interactive demos** — out of v1.0 scope; *revisit if a future case study needs it*
- **UX research docs** — out of v1.0 scope; *revisit if separate research-output surface is wanted*
- **Contact form with backend** — superseded by mailto + Resume PDF + LinkedIn. **Reasoning still valid for static-only architecture.**
- **Dark mode forced on first load** — shipped as: system preference respected, toggle available. **Implementation matched intent.**
- **Video backgrounds** — out of v1.0; performance risk on image-heavy portfolio. **Reasoning still valid.**

## Context

- **Target audience:** recruiters/hiring managers at companies + freelance clients (both)
- **Work types:** case studies (full project breakdowns) + visual designs (high-fidelity mockups)
- **Desired aesthetic:** clean and minimal — white space, restrained typography, work-forward
- **Content management:** owner edits MDX directly; no CMS needed
- **Each project gets its own dedicated page** at `/projects/[slug]`

**v1.0 tech-stack lessons learned:**
- Astro 6 + Tailwind v4 delivered Lighthouse mobile perf 0.82 with zero hand-optimization — the architecture itself does the work
- Cloudflare Pages + Cloudflare Registrar + Cloudflare DNS in one account made the custom-domain attach a single dashboard flow (no nameserver hand-editing)
- iOS Safari has quirks that desktop testing won't surface (programmatic `.focus()` triggers `:focus-visible`, `position-fixed` scroll lock works where `overflow:hidden` doesn't, `backdrop-filter` creates a containing block for fixed descendants)
- Cloudflare Redirect Rules: the simplest working pattern for apex-canonical is Dynamic + `concat("https://apex", http.request.uri)` — `if()` function unavailable in that expression subset

## Constraints

- **Simplicity:** No CMS overhead — static or code-driven content only
- **Aesthetic:** Clean and minimal — no heavy frameworks or cluttered UIs
- **Maintenance:** Owner edits code directly — keep project content structure simple to update
- **JS budget:** Near-zero. New interactivity must be evaluated for whether plain CSS or a `<script>` tag could do the job before reaching for a framework runtime
- **Deploy target:** Cloudflare Pages, fully static. SSR adapter requires explicit decision

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dedicated case study pages (not cards/PDFs) | Better storytelling surface, more professional impression | ✓ Good — landed in Phase 3 with strong reception during owner review |
| Clean/minimal aesthetic | Design portfolio should elevate the work, not compete with it | ✓ Good — Lighthouse a11y 1.00 + restrained typography held up under iPhone hardware test |
| No CMS | Owner is comfortable editing code; keeps stack simpler | ✓ Good — MDX authoring proved natural; zero CMS friction in v1.0 |
| Astro 6 over Next.js | Zero-JS-by-default for content-heavy static portfolio | ✓ Good — 0.82 mobile perf at first measurement with no hand-tuning |
| Tailwind v4 (no JS config) | Single source of truth in `global.css` `@theme` block | ✓ Good — token discipline easy to maintain solo |
| Cloudflare Pages over Vercel Pro | Free unlimited bandwidth, no commercial-use restrictions, registrar+DNS+Pages in one account | ✓ Good — initial Vercel Pro assumption (D-09) revised in Phase 6 planning |
| Apex canonical (`tanyazakus.com`); www 301s to apex | SEO clarity; preserves "naked" domain as professional address | ✓ Good — canonical URL flip in Phase 6 cutover gave Lighthouse SEO a +0.08 bump |
| Single atomic launch commit for Phase 6 cutover | Production-visible flip should be transactional and revertable in one step | ✓ Good — `c1b0b38` `feat(06): production domain cutover (D-06/D-07)` |
| Mailto only (no contact form) | Static architecture; mailto sufficient for inbound volume | ✓ Good — E2E verified twice (preview + production) |
| Resume PDF as static asset (no CMS) | Owner controls the asset; filename fixed for stable URL | ✓ Good — 173KB real PDF replaced 319B placeholder before launch |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections — ✓ done for v1.0 on 2026-05-12
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-12 after v1.0 Launch milestone completion*
