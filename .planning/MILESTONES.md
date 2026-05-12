# Milestones

## v1.0 Launch (Shipped: 2026-05-12)

**Live at:** https://tanyazakus.com
**Phases completed:** 6 phases, 24 plans, 29 tasks
**Timeline:** 2026-04-11 → 2026-05-12 (~31 days)
**Commits:** 237 on `main`
**Known deferred items at close:** 26 (see [STATE.md](./STATE.md) Deferred Items)

**Key accomplishments:**

- **Phase 1 — Foundation:** Astro 6 + Tailwind v4 + MDX scaffold with `content.config.ts` schema (9 typed frontmatter fields), `BaseLayout.astro` shell (sticky 64px header, 44px touch targets, footer), and Cloudflare Pages preview deploy live.
- **Phase 2 — Navigation & Design System:** Sticky header with theme toggle (no FOUC, localStorage persistence, system `prefers-color-scheme` fallback), full-screen mobile nav overlay with focus trap + Esc-to-close, footer mirror, design tokens locked in `global.css` `@theme` block.
- **Phase 3 — Work Index & Case Studies:** Homepage hero with per-line entrance animation, project index with animated cards (`ProjectCard` + `FeaturedCard`), 5 placeholder case study MDX files, accent-color per project, scroll-triggered entrance animations respecting `prefers-reduced-motion`.
- **Phase 4 — About, Contact & SEO:** About page with bio + design philosophy + availability statement, footer mailto + Resume PDF + LinkedIn nav links, site-wide Open Graph + Twitter Card + canonical + Tanya-branded "tz" favicon.
- **Phase 5 — Responsive Design:** 4-breakpoint audit matrix across all pages (60 PASS, 0 FAIL), Footer social icons hit 44px tap targets, MobileNav scroll-lock switched from `overflow:hidden` to position-fixed pattern (iOS Safari compatibility), responsive image `widths`/`sizes` tuned for 375px DPR-2 iPhones, real-iPhone hardware verification surfaced and fixed overlay-from-scrolled-page bug.
- **Phase 6 — Deployment:** Repo-side edge config files (`_headers`, `_redirects`, `robots.txt`, `cspell.json`), SC4 pre-launch QA gates all pass (lychee 0 broken links, cspell 0 issues, Lighthouse mobile 0.86 baseline, mailto E2E verified), Cloudflare cutover complete (`tanyazakus.com` registered, Universal SSL via Google Trust Services, SSL Full strict, Always Use HTTPS, www→apex 301), final production deploy (`c1b0b38` cutover commit, Cloudflare auto-deploy in ~30s, 16/16 live-state checks PASS, production Lighthouse perf 0.82 / SEO 1.00).

**Lighthouse mobile (production, 2026-05-12):**
- Performance: 0.82 (SEO-05 gate ≥0.80 ✓)
- Accessibility: 1.00
- Best Practices: 1.00
- SEO: 1.00 (+0.08 from preview baseline — canonical URL flip dividend)

**Architecture wins:**
- Zero JavaScript shipped on the critical path (Astro 6 islands; only theme toggle and scroll animation hydrate)
- Single Tailwind v4 `@theme` token source-of-truth in `global.css`
- WebP image pipeline via Astro `<Image>` with explicit responsive widths

**Tracked tech debt deferred to v1.1+:**
- 4 of 6 phases lack formal `VERIFICATION.md` (functional delivery confirmed via live site; process artifacts incomplete)
- `REQUIREMENTS.md` traceability table never advanced from `[ ]` despite all 48 requirements being functionally delivered (bulk-update available)
- Phase 4 missing `VALIDATION.md` (Nyquist test-coverage planning artifact)
- Cloudflare edge cache override on `/_astro/*` (max-age=14400 vs declared 31536000)
- Preview URL `*.pages.dev` not 301'd to production (acceptable — not user-facing)
- CSP header not shipped (deferred — HSTS+XFO+Referrer-Policy+Permissions-Policy cover practical attack surface for static site)

---
