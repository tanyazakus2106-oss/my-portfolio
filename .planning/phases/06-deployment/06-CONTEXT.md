# Phase 6: Deployment - Context

**Gathered:** 2026-05-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Take the existing Cloudflare Pages preview deploy to production on the custom domain `tanyazakus.com`, run a performance optimization pass to meet Lighthouse mobile ≥ 80, complete the SC4 pre-launch QA checklist (broken-link audit, spelling review, mailto end-to-end test), and ship the static-config files that production needs in `public/` (`_redirects`, `_headers`, `robots.txt` as scoped by the planner).

**In scope:**
- Custom domain configuration on Cloudflare: register `tanyazakus.com` fresh through Cloudflare Registrar, attach to the existing Pages project, verify HTTPS resolves.
- Apex/`www` canonical enforcement (apex is canonical; `www.tanyazakus.com` → `tanyazakus.com` 301).
- One-shot update of `astro.config.mjs:9` `site:` from `https://my-portfolio-8h7.pages.dev` → `https://tanyazakus.com` so sitemap absolute URLs and canonical tags reflect production.
- README.md "Live site" pointer update (currently references the preview URL).
- Performance optimization pass (DEPLOY-02, SEO-05) — depth at planner's discretion within Claude's Discretion bounds below.
- Pre-launch QA artifacts and tooling — broken-link audit, spelling review, mailto E2E test — depth at planner's discretion.
- Whichever subset of `public/_redirects`, `public/_headers`, and `public/robots.txt` is needed for launch.

**Out of scope (deferred or covered elsewhere):**
- Vercel as deployment target — locked out by Phase 1 D-01/D-02 and reconfirmed in this discussion (see Specifics).
- Switching to SSR or adding a server adapter — fully-static `output: 'static'` model is intentional (Phase 1, CLAUDE.md).
- Email forwarding at `tanya@tanyazakus.com` — explicitly deferred (D-04 below); Phase 4 mailto stays at `tanyazakus2106@gmail.com`.
- Reserved subdomains (`blog.`, `resume.`) — explicitly deferred (D-04 below); revisit in v2 if added.
- Analytics (Plausible or similar) — v2 backlog (V2-FEAT-03 in REQUIREMENTS.md).
- Responsive design re-work — Phase 5 closed; Phase 6 inherits the audit-first results.
- Net-new content or case studies — content production is a separate concern (STATE.md blocker — verify before Phase 6 ships).

</domain>

<decisions>
## Implementation Decisions

### Deployment platform (carried forward from Phase 1)

- **D-01:** **Cloudflare Pages remains the deployment target.** Phase 1 D-01/D-02 locked this; the stale `.planning/STATE.md:67` Vercel Pro note was officially superseded then. The user asked "why Cloudflare, not Vercel?" during this discussion and the answer was re-confirmed:
  - Vercel Hobby plan ToS prohibits commercial use; this portfolio targets freelance clients and recruiters (commercial). Vercel Pro is $20/month for features the static site can't use.
  - Cloudflare Pages free tier: unlimited bandwidth, unlimited requests, no commercial-use restriction — material for an image-heavy portfolio that may go viral on LinkedIn.
  - Site already deploys to `https://my-portfolio-8h7.pages.dev`; switching platforms would redo Phase 1 deployment work for zero functional benefit.
  - Cloudflare Registrar at-cost pricing (~$8/yr for `.com`) consolidates registrar + DNS + Pages in one dashboard.

### Custom domain & DNS

- **D-02:** **Production domain is `tanyazakus.com`.** Full-name `.com` — most-recognized pattern for a designer portfolio on a resume; ~$8/yr at Cloudflare Registrar.

- **D-03:** **Register fresh through Cloudflare Registrar.** Domain is not currently owned; buy it directly through Cloudflare to consolidate registrar + DNS + Pages under one dashboard. At-cost renewals, no markup, no transfer step ever needed. (If, during execution, the domain turns out to already be registered to someone else, the planner falls back to a brand pivot — flag immediately, do not proceed silently.)

- **D-04:** **Apex (`tanyazakus.com`) is canonical; `www.tanyazakus.com` 301-redirects to apex.** Cloudflare's CNAME flattening removes the historical technical reason to prefer `www.`; apex is shorter on resumes and in print. The www-to-apex redirect can be implemented via either `public/_redirects` or a Cloudflare Pages dashboard rule — planner picks (lives in the Cloudflare config files Claude's Discretion zone below).

- **D-05:** **DNS scope = website only.** No email forwarding (`tanya@tanyazakus.com` is NOT set up — Phase 4 mailto stays at `tanyazakus2106@gmail.com`). No reserved subdomains. Cloudflare Email Routing and `blog.`/`resume.` subdomains both go to Deferred Ideas; revisit in v2.

- **D-06:** **The `site:` URL in `astro.config.mjs:9` must be updated** from `https://my-portfolio-8h7.pages.dev` → `https://tanyazakus.com` once DNS resolves with HTTPS. This commit drives sitemap absolute URLs, `<link rel="canonical">`, and OG `og:url`. Planner specifies the exact sequencing in PLAN.md (recommendation: change `site:` in the launch PR, merge once DNS+HTTPS verified in dashboard).

- **D-07:** **README.md "Live site" pointer** (currently `https://my-portfolio-8h7.pages.dev` on line 5) gets updated to `https://tanyazakus.com` in the same launch PR.

### Claude's Discretion

The user explicitly chose **not** to discuss the three other gray areas in this session. The planner has discretion within these guardrails:

- **Performance optimization pass scope (DEPLOY-02 + SEO-05)** — Astro 6 + Vite + Lightning CSS already minify, tree-shake, and purge by default. Planner decides incremental work — likely candidates: explicit `widths`/`sizes` audit pass-through from Phase 5, font loading review (preconnect, `font-display`), `<head>` resource hints, image-budget verification (case study WebP < 200KB per Phase 3 CASE-05). Guardrail: per CLAUDE.md and Phase 5 D-01, surgical edits over refactors — do not introduce new tooling (PostCSS plugins, image-CDN integrations) without evidence of a real gap.
- **Cloudflare config files** — Planner decides which of `public/_redirects`, `public/_headers`, `public/robots.txt` ship for launch:
  - `_redirects`: must enforce the apex/www canonical from D-04 (or via dashboard, planner picks); should consider a redirect from the removed `/work` route (quick task `260507-fcw`) → `/#projects`.
  - `_headers`: cache headers for `/_astro/*` immutable assets are essentially free. Security headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) are a judgment call — apply conservative defaults that don't break the existing inline FOUC script in `BaseLayout.astro`.
  - `robots.txt`: include `Sitemap: https://tanyazakus.com/sitemap-index.xml` and allow all crawlers.
- **Pre-launch QA strategy & tooling** — Planner decides depth for the SC4 checklist (broken-link audit, spelling review, mailto E2E). Manual click-through is the floor; scripted tooling (`lychee` for links, `cspell` for spelling, manual send-and-receive for mailto, Chrome DevTools Lighthouse for SEO-05) is the ceiling. The Lighthouse mobile-score gate (SEO-05 ≥ 80) is non-negotiable — pick whatever runner makes the score reproducible.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project constraints and stack
- `CLAUDE.md` — Cloudflare Pages hosting rationale (alternatives table), JS budget (near-zero), static-only deploy target, image optimization patterns, "surgical edits over refactors" guidance for the perf pass.

### Phase requirements
- `.planning/REQUIREMENTS.md` — **SEO-05** (mobile Lighthouse ≥ 80), **DEPLOY-01** (Cloudflare Pages free tier), **DEPLOY-02** (perf optimization pass), **DEPLOY-03** (custom domain + HTTPS).
- `.planning/ROADMAP.md` §Phase 6 — Goal, 4 success criteria, dependency on Phase 5.

### Phase 1 decisions (inherit — deployment platform + content schema)
- `.planning/phases/01-foundation/01-CONTEXT.md` — **D-01/D-02** (Cloudflare Pages locked; Vercel superseded), **D-03** (preview deploy on push to `main`), **D-10** (content schema — `sitemap.xml` regeneration depends on `publishDate` field), **D-11** (BaseLayout container + sticky header — perf pass must not regress).

### Phase 4 decisions (inherit — SEO meta and canonical URLs)
- `.planning/phases/04-about-contact-seo/04-CONTEXT.md` — SEO meta-tag pattern (OG, Twitter Card, canonical, favicon) lives in `BaseLayout.astro`; canonical and OG `url` values resolve through Astro's `site` config — the D-06 cutover here is the moment those URLs flip from preview to production. Contact strategy (CONT-01/02/03) determines what the SC4 mailto E2E test exercises.

### Phase 5 decisions (inherit — image pipeline)
- `.planning/phases/05-responsive-design/05-CONTEXT.md` — **D-06** (explicit `widths`/`sizes` on high-impact images: About hero, case study cover, `FullBleedImage`, MDX inline images; card thumbnails use Astro `<Image>` defaults). The perf pass audits these but does not re-shape them.

### Existing code & config to touch
- `astro.config.mjs` (line 9) — `site:` URL change is mandatory at launch (D-06).
- `README.md` (line 5) — "Live site" URL update at launch (D-07).
- `public/` — destination for any `_redirects`, `_headers`, `robots.txt` that the planner ships.
- `src/layouts/BaseLayout.astro` — Inline FOUC script must not break under any CSP added in `_headers` (informs CSP scope at planner's discretion).
- `dist/sitemap-0.xml` + `dist/sitemap-index.xml` — proof that `@astrojs/sitemap` is already generating absolute URLs based on `site:`; verifies D-06 surface.

### Project context
- `.planning/PROJECT.md` — Core value (recruiters/clients see work + clear contact path), no-CMS constraint, clean/minimal aesthetic.
- `.planning/STATE.md` — Project state, prior decisions log, completed quick tasks. **Housekeeping:** the "Vercel Pro cost: Verify Pro plan billing before Phase 6 planning begins" blocker on STATE.md:79 is obsolete after Phase 1 D-02 / Phase 6 D-01; planner should retire it.

### GitHub / deploy plumbing
- Git remote: `https://tanyazakus2106-oss@github.com/tanyazakus2106-oss/my-portfolio.git` — Cloudflare Pages project is wired to this repo (per memory + `git remote -v`). DEPLOY-01 verification is dashboard-level.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **`@astrojs/sitemap` integration** (`astro.config.mjs:5,12`) — already wired; sitemap-0.xml + sitemap-index.xml exist in `dist/`. Will absorb the `site:` URL change in D-06 with zero further config.
- **Astro `<Image>` defaults + per-component `widths`/`sizes`** — Phase 5 already pushed the high-impact surfaces. Perf pass verifies but does not redo.
- **`scripts/generate-favicon-ico.mjs`** — favicon already branded (quick task `260507-p8w`); no work needed for Phase 6.
- **Public-folder bypass for static assets** — `public/og-image.png`, `public/favicon.svg`, `public/favicon.ico`, `public/tanya-zakus-designer-resume.pdf` ship as-is. `_redirects`/`_headers`/`robots.txt` join this same directory.
- **Cloudflare Pages build defaults** — `npm run build` is the build command, `dist` is the output dir, both already detected. No changes needed unless we add `npm run typecheck` to the pipeline.

### Established Patterns

- **Atomic commits per concern** — Phase 5 closed out with one commit per audit-row fix. Phase 6 should match: e.g., separate commits for `_redirects`, `_headers`, `robots.txt`, `site:` URL bump, README update, perf-pass image audit. Keeps revert surface small.
- **Token-only styling, no raw values** — design system locked across Phases 1-5; perf pass must not introduce arbitrary CSS values or hardcoded colors.
- **`prefers-reduced-motion` honored** — already wired across `src/styles/global.css` and `src/scripts/scroll-animation.ts`. Perf pass should verify nothing regressed.

### Integration Points

- **`astro.config.mjs:9` (`site:` field)** — the single coupling point between code and the production hostname. Drives sitemap URLs, canonical tags, OG URLs. D-06.
- **`README.md:5` (Live site pointer)** — public-facing; recruiters who clone the repo see this. D-07.
- **Cloudflare Pages dashboard** — out-of-repo configuration surface for: custom domain attachment, SSL/TLS mode, build settings, environment variables (none currently needed), preview-URL handling. Planner specifies steps in PLAN.md without scripting them; dashboard work is manual.
- **Cloudflare Registrar checkout** — domain purchase is a single dashboard transaction; not scriptable. PLAN.md captures the checklist, executor confirms after purchase.

### Deferred-but-noted code paths

- **Removed `/work` route** (quick task `260507-fcw`) — if any external links still point at `/tanyazakus.com/work`, the launch is the right moment to install a `_redirects` rule mapping `/work` → `/#projects`. Planner decides whether to ship this preemptively or only after a 404 surfaces in CF Pages analytics.

</code_context>

<specifics>
## Specific Ideas

- **Vercel rationale re-explored mid-discussion.** The user asked "why Cloudflare, not Vercel?" before the registrar question and accepted the explanation (commercial-use restriction on Vercel Hobby, bandwidth caps on Vercel Pro vs unlimited on Cloudflare free, static-only deploy needs no Vercel-specific features, site already on Cloudflare). The decision is reversible if the user revisits — planner should treat it as locked unless explicitly re-opened.
- **The stale Vercel Pro reference in STATE.md is obsolete twice over** (Phase 1 D-02, Phase 6 D-01). Planner should remove the `Vercel Pro cost: Verify Pro plan billing before Phase 6 planning begins` blocker entry from `.planning/STATE.md` as part of the launch PR or a separate housekeeping commit.
- **Resume PDF (`public/tanya-zakus-designer-resume.pdf`) ships unchanged.** The launch checklist should include a sanity-check that the PDF link still works post-cutover (it's an internal `/tanya-zakus-designer-resume.pdf` link — hostname-agnostic, so should be fine, but worth one click).
- **Cloudflare Pages preview URL** (`my-portfolio-8h7.pages.dev`) will keep serving the same content after launch unless explicitly disabled. Planner decides whether to leave it accessible (default), redirect it to the production domain, or restrict it. No user preference was captured here — Claude's Discretion.
- **HTTPS / SSL mode.** Cloudflare Pages auto-provisions an SSL cert via Universal SSL. SSL/TLS encryption mode on the Cloudflare dashboard should be **Full (strict)** — the Pages backend already serves HTTPS, so anything less would be an unnecessary downgrade. Planner specifies in PLAN.md.
- **Apex `tanyazakus.com` will require an Address or CNAME record at the root** — Cloudflare's CNAME flattening makes this trivial when both registrar and DNS live on Cloudflare (Cloudflare Pages auto-configures it on custom-domain attach). Planner does not need to hand-author the record.
- **No new pages, no content production in Phase 6.** STATE.md flags 3-5 case studies as a pre-Phase-3 concern; Phase 6 inherits whatever content has shipped. If real case studies are still placeholders at launch time, that's a content blocker outside the deployment scope but should be flagged to the user before the production cutover.

</specifics>

<deferred>
## Deferred Ideas

- **Email forwarding (`tanya@tanyazakus.com`)** — Cloudflare Email Routing setup; would let recruiters see a branded contact address without managing a new inbox. Deferred per D-04; v2 candidate.
- **Reserved subdomains (`blog.`, `resume.`)** — placeholder DNS records for future expansion. Deferred per D-04; v2 candidate (V2-FEAT-04 blog/writing section already in REQUIREMENTS.md).
- **Analytics** — Plausible or similar privacy-respecting tool; V2-FEAT-03 in REQUIREMENTS.md. Out of scope for v1 launch.
- **Preview URL redirect to production** — minor UX/SEO polish; Claude's Discretion at planner's call. Easy to revisit later.
- **Cloudflare Web Analytics (free tier, separate from V2-FEAT-03)** — Cloudflare's privacy-respecting first-party analytics that ships with Pages and requires no JS in the page. If the user later wants visitor counts without a third-party tool, this is the lowest-friction option. Not in scope unless explicitly opened.
- **Custom 404 page** — Astro doesn't ship a `404.astro` currently; Cloudflare Pages will serve a generic 404. A branded 404 is a small polish item — defer unless the launch QA surfaces broken links worth catching gracefully.
- **CI typecheck on push** — `npm run typecheck` is in package.json but not gated in the Cloudflare Pages build. Adding it would catch broken `.astro` props before deploy; minor friction for a solo maintainer. Deferred.
- **Tightened security headers (CSP nonce, Permissions-Policy)** — beyond the baseline planner-discretion set, anything that requires per-page nonce generation or extensive testing is deferred.
- **Real-device test matrix beyond iPhone** (carried over from Phase 5 deferred) — Android, iPad, large-monitor smoke tests; nice-to-have, not blocking.

</deferred>

---

*Phase: 06-deployment*
*Context gathered: 2026-05-12*
