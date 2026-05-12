# Phase 6: Deployment - Research

**Researched:** 2026-05-12
**Domain:** Static-site production deployment on Cloudflare Pages (custom domain + perf pass + pre-launch QA)
**Confidence:** HIGH (deployment plumbing, _redirects/_headers syntax, Lighthouse/lychee/cspell tooling), MEDIUM (CSP scope decision — has real tradeoffs the planner must own)

## Summary

Phase 6 is a launch phase, not a feature phase. Three workstreams sit side-by-side:

1. **Domain + cutover** — register `tanyazakus.com` through Cloudflare Registrar, attach to the existing Pages project, verify HTTPS, flip `site:` in `astro.config.mjs` and the README "Live site" pointer. The execution plumbing is well-documented and largely dashboard-driven; the one non-obvious landmine is that **the Cloudflare Pages `_redirects` file is path-only** — hostname-based `www → apex` redirect must be implemented via Cloudflare Redirect Rules (dashboard), not `public/_redirects`. The CONTEXT D-04 "_redirects OR dashboard rule" phrasing should resolve to "dashboard rule" once this constraint is visible to the planner.

2. **Performance pass (DEPLOY-02 + SEO-05 ≥ 80 mobile)** — Astro 6 + Vite + Lightning CSS already handle minification, tree-shaking, and CSS purging by default; Phase 5 already pushed explicit `widths`/`sizes` onto high-impact images. The remaining cheap mobile-Lighthouse wins are **font loading** (the current `<link media="print" onload>` async pattern in BaseLayout works but Astro 6 ships a stable **built-in Fonts API** that self-hosts + auto-preloads), `<head>` resource hint hygiene, image-budget verification against CASE-05's 200KB ceiling, and confirming no regressions slipped in. No new tooling required for ≥ 80 mobile.

3. **Pre-launch QA (SC4)** — broken-link audit via **`lychee`** (Homebrew install, runs against `dist/` after build), spelling review via **`cspell`** with a small project dictionary covering "tanyazakus", "Fontshare", "Tushar", etc., manual mailto E2E (compose + send to `tanyazakus2106@gmail.com` from a non-Tanya address, confirm receipt), and **`lighthouse` CLI** for the SEO-05 gate (lower-friction than `@lhci/cli` for a one-shot pre-launch check).

**Primary recommendation:** Treat the perf pass as **measurement-first**: run Lighthouse against the current preview deploy BEFORE making changes, identify the actual offenders (likely candidates: Fontshare/Google-Fonts external requests, possibly LCP-related), apply 1–3 surgical fixes, re-measure. Don't pre-emptively adopt the Astro 6 Fonts API unless Lighthouse flags font loading; the current pattern may already pass the ≥ 80 mobile threshold and migrating is non-trivial (touches `BaseLayout.astro` head + the `--font-sans` token wiring in `global.css`).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Cloudflare Pages is the deployment target. Vercel is locked out (Hobby plan ToS prohibits commercial use; Pro is $20/mo for features the static site can't use; Cloudflare free tier has unlimited bandwidth, no commercial-use restriction; site already deploys to `my-portfolio-8h7.pages.dev`). Re-confirmed in this discussion.
- **D-02:** Production domain is `tanyazakus.com` (full-name `.com`, ~$8/yr at Cloudflare Registrar).
- **D-03:** Register fresh through Cloudflare Registrar. (Fallback: if the domain turns out to be taken, the planner flags immediately and pivots — does not proceed silently.)
- **D-04:** Apex (`tanyazakus.com`) is canonical; `www.tanyazakus.com` 301-redirects to apex. Mechanism (`public/_redirects` vs Cloudflare dashboard rule) is planner discretion within the Cloudflare config files zone.
- **D-05:** DNS scope = website only. No email forwarding (mailto stays at `tanyazakus2106@gmail.com`). No reserved subdomains (`blog.`, `resume.`). Cloudflare Email Routing → deferred.
- **D-06:** `site:` URL in `astro.config.mjs:9` must update from `https://my-portfolio-8h7.pages.dev` → `https://tanyazakus.com` once DNS + HTTPS verified. Drives sitemap absolute URLs, `<link rel="canonical">`, OG `og:url`.
- **D-07:** `README.md:5` "Live site" pointer updates to `https://tanyazakus.com` in the same launch PR.

### Claude's Discretion (planner picks within guardrails)

1. **Performance optimization pass scope (DEPLOY-02 + SEO-05)** — Astro 6 + Vite + Lightning CSS already minify, tree-shake, purge by default. Likely candidates: font loading review (preconnect, `font-display`), `<head>` resource hints, image-budget verification (case study WebP < 200KB per Phase 3 CASE-05). Guardrail: per CLAUDE.md and Phase 5 D-01, surgical edits — no new tooling (PostCSS plugins, image-CDN integrations) without evidence of a real gap.

2. **Cloudflare config files** — planner decides which of `public/_redirects`, `public/_headers`, `public/robots.txt` ship for launch:
   - `_redirects`: enforce apex/www canonical from D-04 (or via dashboard); consider redirect from removed `/work` route (quick task `260507-fcw`) → `/#projects`.
   - `_headers`: cache headers for `/_astro/*` immutable assets are essentially free. Security headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) are judgment calls — apply conservative defaults that don't break the existing inline FOUC script in `BaseLayout.astro`.
   - `robots.txt`: include `Sitemap: https://tanyazakus.com/sitemap-index.xml` and allow all crawlers.

3. **Pre-launch QA strategy & tooling** — manual click-through is the floor; scripted tooling (`lychee`, `cspell`, manual mailto send-and-receive, Chrome DevTools Lighthouse OR `@lhci/cli` for SEO-05) is the ceiling. The Lighthouse mobile-score gate (SEO-05 ≥ 80) is non-negotiable — pick a reproducible runner.

### Deferred Ideas (OUT OF SCOPE)

- **Email forwarding (`tanya@tanyazakus.com`)** — Cloudflare Email Routing. Deferred per D-05; v2 candidate.
- **Reserved subdomains (`blog.`, `resume.`)** — Deferred per D-05; revisit with V2-FEAT-04 (blog/writing).
- **Analytics** — Plausible or similar privacy-respecting tool; V2-FEAT-03 in REQUIREMENTS.md.
- **Preview URL redirect to production** — minor UX/SEO polish; Claude's Discretion at planner's call.
- **Cloudflare Web Analytics (free tier, separate from V2-FEAT-03)** — first-party privacy-respecting analytics that ships with Pages. Not in scope unless explicitly opened.
- **Custom 404 page** — Astro doesn't ship a `404.astro` currently. Defer unless launch QA surfaces broken links worth catching gracefully. (Cloudflare Pages will serve a generic 404 by default; if `dist/404.html` exists, it serves that. [CITED: developers.cloudflare.com/pages/configuration/serving-pages/])
- **CI typecheck on push** — `npm run typecheck` exists in package.json but isn't gated in the Cloudflare Pages build. Deferred.
- **Tightened security headers (CSP nonce, advanced Permissions-Policy)** — anything requiring per-page nonce generation or extensive testing. Deferred.
- **Real-device test matrix beyond iPhone** (carried from Phase 5) — Android, iPad, large-monitor smoke tests. Nice-to-have, not blocking.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **SEO-05** | Mobile Lighthouse performance score above 80 | "Pre-Launch QA — Lighthouse" + "Performance Pass" sections below. `lighthouse` CLI 13.x is the lowest-friction runner. Cheap mobile wins: font loading (current `<link media="print">` async pattern OR migrate to Astro 6 built-in Fonts API), `/_astro/*` immutable cache headers (post-launch effect only, but signals "best practices"), image-budget verification. |
| **DEPLOY-01** | Site deployed to Cloudflare Pages free tier (unlimited bandwidth, no commercial-use restrictions) | Already satisfied: site deploys to `https://my-portfolio-8h7.pages.dev` on push to `main`. Phase 6 verifies still-green and absorbs the launch commits without breaking the build pipeline. |
| **DEPLOY-02** | Performance optimization pass — assets minified, unused CSS purged, image formats/sizes verified | "Performance Pass — Audit Checklist" section. Astro 6 + Vite + Lightning CSS already minify, tree-shake, and purge by default — confirm `dist/_astro/*.css` is minified, confirm WebP/AVIF generation on case study covers, verify Phase 5's `widths`/`sizes` props are still in place. |
| **DEPLOY-03** | Custom domain configured on Cloudflare Pages with HTTPS — site resolves correctly at production URL | "Cloudflare Dashboard Workflow" section. Domain purchase via Cloudflare Registrar → custom-domain attach in Pages dashboard → Universal SSL provisions automatically → verify resolution + valid cert → flip `site:` + README. The www-to-apex redirect (D-04) requires Cloudflare **Redirect Rules** (dashboard), NOT `public/_redirects` — see Architecture Patterns. |

</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| HTTPS termination + cert provisioning | CDN / Edge (Cloudflare) | — | Cloudflare Universal SSL is automatic on custom-domain attach. No app-tier involvement. |
| Apex/www canonical redirect (D-04) | CDN / Edge (Cloudflare Redirect Rules) | — | `_redirects` is path-only — domain-level redirects are unsupported. [VERIFIED: Cloudflare docs] Must be a dashboard rule. |
| `/work` → `/#projects` legacy-route redirect | Static site (`public/_redirects`) | — | Path-only redirect — fits the `_redirects` model exactly. |
| Cache-control for hashed assets | Static site (`public/_headers`) | CDN (Cloudflare cache) | `/_astro/*` filenames are hash-stamped; `immutable` + `max-age=31536000` is safe and free. |
| Security headers (CSP, HSTS, Referrer-Policy, Permissions-Policy) | Static site (`public/_headers`) | — | Configured per-site; Cloudflare honors them. Note: CSP with strict `script-src` needs sha256 hashes for the inline FOUC script — see CSP Scope Decision below. |
| `robots.txt` + `sitemap-index.xml` | Static site (`public/` + `@astrojs/sitemap`) | — | Standard static-site SEO surfaces. |
| Performance optimization (minification, image sizes, font loading) | Build (Astro/Vite/Lightning CSS) | Static site (head hints) | Astro/Vite/Lightning CSS handles 90% by default; remaining work is in `BaseLayout.astro` head. |
| Broken-link audit + spelling review | Local CLI (lychee, cspell) | — | Runs against `dist/` after `npm run build`. Not a runtime concern. |
| Lighthouse SEO-05 gate | Local CLI (`lighthouse` 13.x) | — | One-shot pre-launch verification — `@lhci/cli` is overkill for solo maintainer. |

## Standard Stack

### Core (already locked — verify versions current)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 6.1.5 | Static site framework, build pipeline | Already in `package.json`. Latest is **6.3.1** [VERIFIED: `npm view astro version` 2026-05-12] — minor bump available but not required for Phase 6. |
| `@astrojs/sitemap` | 3.7.2 | Auto-generates `sitemap-index.xml` + `sitemap-0.xml` | Already integrated in `astro.config.mjs:11`. **Latest verified: 3.7.2** [VERIFIED: `npm view @astrojs/sitemap version`] — already current. Re-runs at every build; absorbs D-06 `site:` URL change with zero further config. |
| `@astrojs/mdx` | 5.0.3 | MDX content pipeline | Already integrated. Latest **5.0.4** [VERIFIED: `npm view`] — minor; not Phase 6 work. |
| `tailwindcss` + `@tailwindcss/vite` | 4.2.2 | Utility-first styling, Lightning CSS engine | Already integrated. Latest **6.3.1** [VERIFIED: `npm view tailwindcss version`] — note: Tailwind has gone through major versions; staying on 4.2.2 is fine for v1 launch. |

### Supporting (NEW for Phase 6 — pre-launch tooling only, dev-time use)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lychee` | 0.2.12 (npm wrapper) / latest via Homebrew | Broken-link audit against `dist/` | Pre-launch SC4 step. **Recommend `brew install lychee`** for macOS — the npm wrapper [VERIFIED: `npm view lychee version` → 0.2.12] is a thin shim; the Rust binary is the real tool. Run once before launch, again post-launch against the production URL. [CITED: github.com/lycheeverse/lychee] |
| `cspell` | 9.3.1 [VERIFIED: `npm view cspell version`] | Spelling review across `src/content/projects/*.mdx`, `src/pages/*.astro`, MDX body content | Pre-launch SC4 step. **Run via npx** — no global install needed: `npx cspell "src/**/*.{mdx,astro,md}"`. Add `cspell.json` with a custom dictionary for project-specific terms (Tanya, tanyazakus, Fontshare, Satoshi, tushar, etc.). [CITED: cspell.org/docs/getting-started] |
| `lighthouse` (Google Chrome CLI) | 12.8.0 [VERIFIED: `npm view lighthouse version` → 12.8.0; note: 13.3.0 is also published but not the canonical Google package — use 12.x latest stable from Google] | One-shot mobile Lighthouse audit for SEO-05 gate | Pre-launch SC4 step. **Run via npx**: `npx lighthouse https://tanyazakus.com --preset=mobile --output html --output-path ./lighthouse-mobile.html --quiet`. Lowest-friction option vs `@lhci/cli` (the latter is built for per-commit CI gating, overkill for a solo maintainer's one-shot check). [CITED: github.com/GoogleChrome/lighthouse] |

**Note on version pin:** All three tools are dev-time only — they do not appear in `dependencies` or even `devDependencies` necessarily. Running them via `npx` (cspell, lighthouse) or Homebrew (lychee) keeps `package.json` clean. Alternative: pin them to `devDependencies` if Tanya wants a reproducible toolchain in the repo; trade-off is install bloat for a tool used once a quarter.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `lychee` | `linkinator` (Node) | linkinator is Node-native and slightly easier to install on Windows; lychee is Rust-fast, multi-protocol, and the de-facto choice in 2026. lychee preferred. [VERIFIED: WebSearch corroborates lychee as the dominant link-checker as of 2026.] |
| `cspell` | `typos` (Rust) | `typos` is faster but has a smaller dictionary and weaker MDX/frontmatter awareness. `cspell` is the standard for documentation. |
| `lighthouse` CLI | `@lhci/cli` (Lighthouse CI) | LHCI is designed for per-commit CI gating with budgets and assertions. Overkill for a solo maintainer running a check once before launch. CLI is lower-friction. [CITED: github.com/GoogleChrome/lighthouse — "The Node CLI provides the most flexibility... For one-time verification, the CLI requires minimal setup."] |
| `lighthouse` CLI | Chrome DevTools Lighthouse panel | DevTools is fine for a one-off but doesn't produce a versioned artifact. CLI writes an HTML report file that can be committed to `.planning/phases/06-deployment/` as evidence the gate was met. |
| Cloudflare `_redirects` for www→apex | Cloudflare Redirect Rules (dashboard) | **The `_redirects` file does NOT support hostname-based sources** [VERIFIED: developers.cloudflare.com/pages/configuration/redirects/ — "Domain-level redirects" listed as unsupported]. Dashboard Redirect Rules is the correct mechanism for D-04. Forced choice, not optional. |
| Cloudflare Bulk Redirects | Cloudflare Redirect Rules | Both work for www→apex. **Redirect Rules** is the modern UI-driven recommended path; Bulk Redirects is for migrating ≥100 URLs at once. Use Redirect Rules. [CITED: developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/] |
| Astro 6 built-in Fonts API | Current manual `<link media="print" onload>` async pattern in BaseLayout | Astro 6's `fonts` config (stable, no experimental flag) self-hosts fonts, generates fallback metrics, and auto-injects preload links. **Migration is non-trivial** (touches BaseLayout.astro head, `--font-sans` token in global.css, removes the Fontshare CDN dependency). Recommend **measure first, migrate only if Lighthouse flags font loading**. [CITED: docs.astro.build/en/guides/fonts/, astro.build/blog/astro-6/] |

**Installation (only if planner picks tooling-heavy QA path):**
```bash
# macOS — preferred install path
brew install lychee
# cspell and lighthouse via npx (no install)
npx cspell "src/**/*.{mdx,astro,md}"
npx lighthouse https://tanyazakus.com --preset=mobile --output html --output-path ./lighthouse-mobile.html --quiet
```

**Version verification (run 2026-05-12):**
- `astro@6.3.1` (current), `6.1.5` (in lockfile) — both fine for Phase 6
- `@astrojs/sitemap@3.7.2` — current
- `@astrojs/mdx@5.0.4` (current), `5.0.3` (in lockfile)
- `cspell@9.3.1` — current
- `lighthouse@12.8.0` (Google's package; the npm name `lighthouse` resolves to Google Chrome's release)

## Architecture Patterns

### System Architecture Diagram

```
User browser
     │
     ▼
DNS lookup (tanyazakus.com)
     │
     ▼
Cloudflare DNS (apex A record, CNAME-flattened to Pages)
     │
     │  ┌─ www.tanyazakus.com ────► Cloudflare Redirect Rule ──► 301 to apex
     │  │   (dashboard, NOT _redirects)
     │  │
     ▼  ▼
Cloudflare Pages edge
     │
     ├─► public/_redirects evaluated   (path-only rules, e.g., /work → /#projects)
     ├─► public/_headers applied       (cache-control, CSP, security headers)
     │
     ▼
Static asset served from dist/
     │
     ▼
HTML response (with hashed /_astro/* asset references)
     │
     ▼
Browser parses HTML:
   ├─► Inline FOUC script runs synchronously (sets dark/light class)
   ├─► <link rel="preconnect"> for fonts.googleapis.com + api.fontshare.com
   ├─► Async font stylesheets load (media=print → onload swap to media=all)
   ├─► /_astro/*.css applied (Lightning-CSS-built, minified)
   ├─► <Image>-generated <picture> serves WebP/AVIF + responsive srcset
   └─► scroll-animation.ts runs on DOMContentLoaded
```

**Trace of the cutover (D-06 + D-07):**

```
Pre-launch state:
  astro.config.mjs:9      site: 'https://my-portfolio-8h7.pages.dev'
  README.md:5             Live site: https://my-portfolio-8h7.pages.dev
  Cloudflare Pages        Project: my-portfolio
                          Custom domains: (none — only preview URL)

Launch sequence (planner orders in PLAN.md):
  1. Cloudflare Registrar → purchase tanyazakus.com
  2. Cloudflare Pages dashboard → Custom domains → Set up a domain → tanyazakus.com
  3. Cloudflare Pages dashboard → Custom domains → Set up a domain → www.tanyazakus.com
     (or add www DNS A record + redirect rule — see Apex/www Pattern below)
  4. Wait for Universal SSL to provision (typically minutes, can take up to 24h with bad CAA)
  5. Verify https://tanyazakus.com resolves with green padlock, content matches preview
  6. Cloudflare dashboard → Rules → Redirect Rules → Create rule:
       When incoming requests match:  Hostname equals www.tanyazakus.com
       Then:                          Static redirect to https://tanyazakus.com
                                      Status 301, Preserve query string: yes
  7. Verify https://www.tanyazakus.com 301s to https://tanyazakus.com
  8. Open PR with: astro.config.mjs site: change + README.md Live site: change
  9. Merge → Cloudflare Pages auto-deploys with new site: URL → sitemap regenerates with tanyazakus.com URLs
  10. Re-verify sitemap-index.xml and canonical tags reflect new URL
```

### Component Responsibilities (file → role)

| File / Surface | Role in Phase 6 |
|----------------|-----------------|
| `astro.config.mjs:9` | `site:` URL — single coupling point between code and production hostname. D-06 cutover changes this from preview URL to `https://tanyazakus.com`. |
| `README.md:5` | Public-facing "Live site" pointer. D-07 cutover. |
| `public/_redirects` (NEW, optional per planner) | Path-only legacy redirects (e.g., `/work` → `/#projects`). NOT for www→apex. |
| `public/_headers` (NEW, optional per planner) | Cache-control for `/_astro/*`, security headers (CSP scope is a judgment call — see CSP section). |
| `public/robots.txt` (NEW, optional per planner) | `User-agent: *` `Allow: /` `Sitemap: https://tanyazakus.com/sitemap-index.xml`. Optional because Cloudflare Pages and Astro both already work without one — but explicit is better for SEO. |
| Cloudflare Pages dashboard | Custom domain attach, Universal SSL, Redirect Rules (www→apex), SSL/TLS mode. Out-of-repo state. |
| Cloudflare Registrar | Domain purchase. One-time transaction. |
| `src/layouts/BaseLayout.astro` | Inline FOUC script (lines 29-47) must remain compatible with any CSP. Inline async-font-loader script (lines 88-93) similarly. **These two scripts are the CSP scope decision driver.** |
| `dist/sitemap-index.xml` + `dist/sitemap-0.xml` | Auto-regenerated at every build. After D-06, all URLs absorb `tanyazakus.com`. Pre-flight: confirm post-cutover sitemap shows production URLs (the planner verifies this in a build-and-inspect step before launching). |

### Pattern 1: Cloudflare Pages `_redirects` (path-only)

**What:** A plain-text file at `public/_redirects` shipped with the build. Cloudflare Pages parses it server-side at request time. [CITED: developers.cloudflare.com/pages/configuration/redirects/]

**When to use:** Path-only redirects within a single hostname. NOT for hostname-level redirects (apex/www).

**Syntax:**
```
[source-path] [destination] [status?]
```

**Recommended `public/_redirects` for this project (if planner ships it):**
```
# Legacy: /work was removed in quick task 260507-fcw (commit 5c2fae4)
# Any external links pointing at /work should land on the home #projects section
/work        /#projects        301
/work/       /#projects        301
```

**Limits:** 2,000 static + 100 dynamic redirects (combined cap 2,100). 1,000-char per-line limit. [CITED: Cloudflare docs.]

**Splats and placeholders:**
- `*` matches greedily — referenced as `:splat` in destination
- `:name` matches a path segment — referenced as `:name` in destination
- Query parameters NOT preserved automatically (this is documented as unsupported in `_redirects`)

**Anti-pattern:** Using `_redirects` for `www → apex`. **Cloudflare Pages explicitly lists "Domain-level redirects" as unsupported** [VERIFIED: developers.cloudflare.com/pages/configuration/redirects/]. The example `workers.example.com/* workers.example.com/blog/:splat 301` is shown as the canonical NOT-supported pattern. Use Redirect Rules instead.

### Pattern 2: Cloudflare Pages `_headers` (cache + security)

**What:** A plain-text file at `public/_headers`. Cloudflare Pages applies these headers at the edge for matching paths. [CITED: developers.cloudflare.com/pages/configuration/headers/]

**Recommended `public/_headers` for this project:**

```
# Hashed Astro assets are content-addressed — safe to cache forever
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

# Static images, fonts, favicon, PDF — long cache but not immutable (we may swap them)
/images/*
  Cache-Control: public, max-age=604800
/*.svg
  Cache-Control: public, max-age=604800
/*.ico
  Cache-Control: public, max-age=604800
/*.pdf
  Cache-Control: public, max-age=86400

# HTML — Cloudflare default is max-age=0, must-revalidate; explicit for clarity
/*
  Cache-Control: public, max-age=0, must-revalidate
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Notes:**
- **Cloudflare default for HTML is `max-age=0, must-revalidate`** [CITED: developers.cloudflare.com/pages/configuration/serving-pages/]. The explicit `/*` line above re-states it for clarity and adds the security headers on the same matcher.
- **Headers don't apply to redirected responses** — "redirects are applied before headers, so when a request matches both a redirect and a header, the redirect takes priority" [CITED: developers.cloudflare.com/pages/configuration/headers/]. This is fine for our setup (the redirect target gets its own header pass).
- **Limits:** 100 header rules; 2,000-char per-line. [CITED: Cloudflare docs.]
- **HSTS `preload`:** The `preload` directive is **intentionally omitted** above. Adding `preload` means committing the domain to the HSTS preload list permanently — a meaningful one-way decision that's overkill for a portfolio launch. Plain `max-age=31536000; includeSubDomains` gives full HSTS protection without the preload-list permanence. Defer `preload` unless Tanya later wants it.

### Pattern 3: CSP scope decision (the planner must own this)

**The problem:** A strong CSP (`script-src 'self'` + sha256 hashes for inline scripts) is the security best-practice for static sites. But there are real landmines in this codebase:

1. **`BaseLayout.astro:29-47`** — inline FOUC script (sets `.dark` or `.light` class on `<html>` based on `localStorage.theme`). Must run synchronously before any CSS. Cannot move to an external file without breaking FOUC prevention.
2. **`BaseLayout.astro:88-93`** — inline async-font-loader script (flips `<link media="print">` to `media="all"` after load). Could move to an external file but adds an HTTP request.
3. **Tailwind v4 inline-style attributes** — Tailwind v4 may emit `style="..."` attributes for some utilities (e.g., the `bg-[var(--color-background)]` pattern used on `<body>` in BaseLayout.astro:99). **Inline `style` attributes require `style-src 'unsafe-inline'`** in CSP unless you use nonces (server-side, requires SSR) or `'unsafe-hashes'` (CSP Level 3, narrow support). [CITED: developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src]
4. **Astro 6 built-in CSP is SSR-only.** [VERIFIED: docs.astro.build/en/reference/experimental-flags/csp/ — "limited to on-demand rendering"] Cannot be enabled for our `output: 'static'` build. CSP must be hand-authored in `_headers`.

**Three CSP options for the planner to pick:**

#### Option A: Skip CSP entirely (recommend for launch)
Ship X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS, but **no Content-Security-Policy header**. The portfolio has no user input, no auth, no third-party scripts, no eval, no remote sources that aren't `https:`. CSP adds value when XSS risk is non-zero; here it's near-zero. **This is the lowest-friction launch path** and matches "surgical edits over refactors."

#### Option B: Lax CSP allowing unsafe-inline for styles (medium friction)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-<FOUC_HASH>' 'sha256-<ASYNC_FONT_HASH>'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com https://api.fontshare.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

Pros: Blocks remote scripts and frames, allows our specific inline scripts via hashes.
Cons: `'unsafe-inline'` on style-src dilutes the protection (since Tailwind/inline styles are present). The two inline-script hashes must be regenerated whenever those scripts change — an ongoing maintenance burden for a solo maintainer.
**Planner must compute the sha256 hashes** of the exact inline script contents (whitespace-sensitive — `crypto.createHash('sha256').update(scriptContent).digest('base64')`). [CITED: bryanbraun.com/2021/08/10/allowing-inline-scripts-in-your-content-security-policy-using-a-hash/]

#### Option C: Strict CSP with hashes everywhere (high friction)
Requires inlining all Tailwind-generated style attributes (does Tailwind v4 emit any? — needs audit) into a stylesheet, hashing both inline scripts, hashing every inline style if any remain. **Probably 4-8 hours of work and ongoing maintenance** every time a component changes. Not recommended for v1 launch.

**Research recommendation:** **Option A for launch, revisit Option B in a v2 hardening pass.** The portfolio has no XSS attack surface — no form inputs that reflect, no user-submitted content, no third-party scripts. CSP is defense-in-depth, not a missing-control. Document this as an explicit deferral in PLAN.md so it's revisitable.

### Pattern 4: Cloudflare custom-domain attach sequence

[CITED: developers.cloudflare.com/pages/configuration/custom-domains/]

```
1. Cloudflare Registrar → Buy tanyazakus.com (~$8/yr at-cost)
   ↓
2. After purchase, domain auto-lands in Cloudflare DNS dashboard
   (registrar + DNS are the same dashboard when using Cloudflare Registrar)
   ↓
3. Cloudflare Pages → my-portfolio project → Custom domains → "Set up a domain"
   Enter: tanyazakus.com → Continue
   ↓
4. Cloudflare auto-creates the CNAME record (CNAME-flattened from apex to
   my-portfolio.pages.dev). No manual DNS edit needed because registrar + DNS + Pages
   are all in the same Cloudflare dashboard.
   ↓
5. Universal SSL provisioning starts automatically. Wait time: typically 5-30 minutes,
   can be up to 24h if a CAA record blocks Let's Encrypt or Google Trust Services.
   Verify:  curl -vI https://tanyazakus.com 2>&1 | grep -i "subject\|issuer"
   ↓
6. Repeat steps 3-4 for www.tanyazakus.com:
   Cloudflare Pages → Custom domains → "Set up a domain" → www.tanyazakus.com
   This creates a second cert and CNAME for the www subdomain.
   ↓
7. Cloudflare dashboard → Rules → Redirect Rules → Create rule:
       Rule name: Redirect www to apex
       When incoming requests match:
           (http.host eq "www.tanyazakus.com")
       Then:
           Type: Static
           URL: https://tanyazakus.com${path}${query}  (or use the Static redirect
                with "Preserve query string" + "Preserve path" toggles)
           Status: 301
   Save and deploy.
   ↓
8. SSL/TLS encryption mode (Cloudflare dashboard → SSL/TLS → Overview):
       Set to: Full (strict)
       Rationale: Cloudflare Pages serves valid HTTPS on its backend
                  (*.pages.dev cert). Full (strict) requires Cloudflare → origin
                  to be HTTPS with a valid cert, which is correct for Pages.
                  Flexible would be a downgrade; Off is wrong.
   ↓
9. Verify in this order:
       a. https://tanyazakus.com  → green padlock, content matches preview
       b. https://www.tanyazakus.com  → 301 redirects to apex (curl -I)
       c. http://tanyazakus.com  → 301 redirects to https (Cloudflare "Always Use HTTPS")
       d. https://tanyazakus.com/projects/project-alpha  → resolves correctly
       e. https://tanyazakus.com/tanya-zakus-designer-resume.pdf  → PDF downloads
       f. https://tanyazakus.com/sitemap-index.xml  → still serves preview URLs
              (this is expected pre-D-06; it changes after the launch PR merges)
   ↓
10. Open launch PR: change astro.config.mjs site: → https://tanyazakus.com
                    + README.md Live site: → https://tanyazakus.com
                    + commit any _redirects / _headers / robots.txt the planner picks
    Merge. Cloudflare Pages auto-deploys.
    ↓
11. Post-merge verification:
       a. View https://tanyazakus.com/sitemap-index.xml → URLs are now tanyazakus.com
       b. View-source on any page → <link rel="canonical"> uses tanyazakus.com
       c. View-source on any page → <meta property="og:url"> uses tanyazakus.com
```

### Pattern 5: Performance pass — measurement-first

**Sequence:**
```
1. npm run build
2. npm run preview   (serves dist/ locally)
3. npx lighthouse http://localhost:4321 --preset=mobile --output html
                                                       --output-path baseline.html
                                                       --quiet
4. Identify the 3-5 worst audits in the report.
5. Apply fixes (see Audit Checklist below).
6. Rebuild, re-run lighthouse, compare.
7. Repeat until mobile score ≥ 80.
```

**Why measure before fixing:** The site already runs Astro 6 (zero-JS-by-default), Tailwind v4 (Lightning CSS, purged), Astro `<Image>` (WebP/AVIF + responsive srcset), and Phase 5's explicit `widths`/`sizes` on high-impact images. The starting Lighthouse mobile score is **likely already above 80**. Pre-emptively migrating to the Astro 6 Fonts API or rewriting font loading is risk-without-evidence.

### Performance Pass — Audit Checklist (DEPLOY-02 + SEO-05)

Each item below maps to a specific Lighthouse audit ID. Run the audit, fix items that fail.

| Lighthouse Audit ID | What it flags | Fix for this project | Cost / Risk |
|---------------------|---------------|----------------------|-------------|
| `modern-image-formats` | Images not in WebP/AVIF | Astro `<Image>` handles automatically. **Verify** by inspecting `dist/_astro/*` for `.webp` and `.avif` files. | Free — confirm only. |
| `uses-responsive-images` | Image asset wider than rendered size | Phase 5 D-06 already added explicit `widths`/`sizes` on high-impact images. **Verify** by sampling a case study page on mobile in DevTools. | Free — Phase 5 work already done. |
| `efficient-animated-content` | Animated GIFs/WebM unused | N/A — no animations in case studies. | N/A. |
| `uses-text-compression` | No gzip/brotli | Cloudflare Pages compresses automatically. **Verify** with `curl -H "Accept-Encoding: br" -I https://tanyazakus.com`. | Free — confirm only. |
| `uses-rel-preconnect` | Missing preconnect to font origins | `BaseLayout.astro:73-75` already preconnects to fonts.googleapis.com, fonts.gstatic.com, api.fontshare.com. **Verify.** | Free — already done. |
| `font-display` | Webfonts hide text during load | `?display=swap` is already in both font URLs in BaseLayout. **Verify.** | Free — already done. |
| `unused-css-rules` | Unused CSS in stylesheets | Tailwind v4 + Lightning CSS purges. **Verify** by inspecting `dist/_astro/*.css` size. | Free — confirm only. |
| `unused-javascript` | Unused JS shipped | Astro 6 zero-JS-by-default means almost nothing ships. **Verify** by inspecting `dist/_astro/*.js`. The only JS expected: `scroll-animation.ts`, ThemeToggle island. | Free — confirm only. |
| `render-blocking-resources` | CSS/JS blocks first paint | The inline FOUC script is **intentionally render-blocking** (it must run before paint to avoid theme flash). Font stylesheets are async-loaded (`media=print` + onload swap). Should pass. **Verify.** | Free — confirm only. |
| `total-byte-weight` | Page weight > 2.5MB | Case study WebP < 200KB per CASE-05. **Verify** by listing `dist/_astro/*.webp` sizes. | Free if CASE-05 was honored; small fix if a case study has a > 200KB image. |
| `largest-contentful-paint-element` | LCP element identified | Likely the hero text or featured-card thumbnail. Astro `<Image priority>` or `fetchpriority="high"` on the LCP image can shave 100-300ms. **Optional micro-fix.** | Low — 1 line change if needed. |
| `uses-long-cache-ttl` | Static assets have short cache | **`public/_headers`** sets `max-age=31536000 immutable` on `/_astro/*`. **Add this header file** as part of Phase 6. | Free — one file, ~6 lines. |

**Decision flowchart for the perf pass:**

```
Lighthouse mobile score ≥ 80 already?
  ├─ Yes → Add public/_headers for cache hygiene, ship. Done.
  └─ No  → Identify the failing audits.
           ├─ Font-related (uses-rel-preconnect, font-display, render-blocking) →
           │     Consider migrating to Astro 6 Fonts API. Estimate: 1-2 hrs.
           ├─ Image-related (modern-image-formats, uses-responsive-images,
           │   total-byte-weight) → Verify Phase 5 D-06 props are still in place;
           │     compress oversized images; add fetchpriority="high" to hero.
           ├─ JS-related (unused-javascript, total-blocking-time) → Audit ThemeToggle
           │     and scroll-animation islands; remove any client:load not needed.
           └─ Caching (uses-long-cache-ttl) → public/_headers (always do this).
```

**Cheapest wins that don't require measurement:**
1. **`public/_headers`** with `/_astro/* immutable max-age=31536000` — flips `uses-long-cache-ttl` from fail to pass. ~2 minutes of work.
2. **`public/robots.txt`** with the sitemap URL — improves SEO category (not perf), but cheap.
3. **Verify `dist/sitemap-index.xml`** post-D-06 has tanyazakus.com URLs.

### Pattern 6: Pre-launch QA tooling

#### lychee — broken-link audit

**Install (macOS):**
```bash
brew install lychee
```

**Run against built `dist/`:**
```bash
npm run build
lychee dist/ --base https://tanyazakus.com --exclude-mail
```

**Run against live site (post-launch verification):**
```bash
lychee https://tanyazakus.com --exclude-mail
```

**Flag explanations:**
- `--base <URL>` — resolves root-relative links (e.g., `/about`) against the production hostname when scanning local files. [CITED: github.com/lycheeverse/lychee]
- `--exclude-mail` — skips `mailto:` URLs (we E2E test those separately by send-and-receive).
- `--no-progress` — quiet for CI/scripted use.
- `--max-concurrency 10` — be polite to external hosts (default is 128).
- `--accept 200,206,429` — accept "rate-limited" responses from LinkedIn/GitHub as not-broken.

**Exit codes:** 0 = clean, 2 = broken links detected. CI-friendly. [CITED: github.com/lycheeverse/lychee]

**Known false-positive sources:**
- **LinkedIn** (`https://www.linkedin.com/in/tanya-zakus/`) — LinkedIn often returns 403 or 999 to non-browser User-Agents. Mitigation: `--exclude linkedin.com` and verify that link manually. Tanya's profile is the only LinkedIn URL on the site.
- **Instagram** (`https://www.instagram.com/tania_zakus`) — similar bot-blocking. Mitigation: same `--exclude instagram.com` + manual verification.
- **GitHub rate-limiting** — set `GITHUB_TOKEN` env var if hitting rate limits. Not expected for this site.

**Recommended invocation for this project:**
```bash
lychee dist/ \
  --base https://tanyazakus.com \
  --exclude-mail \
  --exclude linkedin.com \
  --exclude instagram.com \
  --max-concurrency 10 \
  --accept 200,206,429
```

#### cspell — spelling review

**Run (no install):**
```bash
npx cspell "src/**/*.{mdx,astro,md}" "README.md"
```

**Minimal `cspell.json` at project root:**
```json
{
  "version": "0.2",
  "language": "en",
  "words": [
    "tanyazakus",
    "Tanya",
    "Zakus",
    "Astro",
    "astrojs",
    "Tailwind",
    "Fontshare",
    "Satoshi",
    "Tushar",
    "mdx",
    "FOUC",
    "Cloudflare",
    "Lighthouse",
    "favicon",
    "preconnect",
    "srcset",
    "WebP",
    "AVIF",
    "tushar"
  ],
  "ignorePaths": [
    "node_modules",
    "dist",
    ".astro",
    ".planning"
  ]
}
```

**Astro / MDX support:** cspell handles `.astro` and `.mdx` files via its built-in markdown/HTML parsers — no plugin needed for spelling, though it may flag JSX/Astro identifiers. The custom-words list above handles project terms. [CITED: cspell.org/docs/getting-started]

**Exit codes:** 0 clean, nonzero = errors found. [CITED: cspell.org]

**`.planning/` exclusion** is important — that directory has plan/research docs with many proper names cspell would flag.

#### Mailto E2E test (manual)

The portfolio uses a plain `mailto:tanyazakus2106@gmail.com` link (Phase 2 D-14, confirmed in CONTEXT D-05). No form, no backend. End-to-end test:

```
1. On the launched production site, click an email link in the footer.
2. Confirm the OS's default mail client opens with To: tanyazakus2106@gmail.com prefilled.
3. From a non-Tanya email address (e.g., a personal Gmail), send a test message
   to tanyazakus2106@gmail.com with subject "Phase 6 launch — mailto E2E test".
4. Confirm the message arrives in Tanya's inbox within 5 minutes.
5. Confirm it does not land in spam.
6. Record the timestamp + message ID in 06-PLAN.md as evidence.
```

Repeat for the About-page email link (if Phase 4 added one), Header email link (if any), and MobileNav email link (if any).

#### lighthouse — SEO-05 gate

**Run (no install):**
```bash
npx lighthouse https://tanyazakus.com \
  --preset=mobile \
  --output html \
  --output-path ./lighthouse-mobile-launch.html \
  --quiet \
  --only-categories=performance,accessibility,best-practices,seo
```

**SEO-05 pass criterion:** Performance category score ≥ 80.

**Commit the HTML report to `.planning/phases/06-deployment/lighthouse-mobile-launch.html`** as launch evidence.

### Pattern 7: `robots.txt` (lightweight, recommended)

**`public/robots.txt`:**
```
User-agent: *
Allow: /

Sitemap: https://tanyazakus.com/sitemap-index.xml
```

**Why include it:**
1. Some crawlers expect `robots.txt` and treat its absence as a soft signal.
2. Explicitly pointing to the sitemap (per Sitemaps.org convention) is a small SEO win.
3. The file is 3 lines; no maintenance burden.

**Note:** Cloudflare Pages automatically applies `X-Robots-Tag: noindex` to preview URLs (`*.pages.dev`), so the preview deploy will remain noindex regardless of `robots.txt` contents. [CITED: developers.cloudflare.com/pages/configuration/preview-deployments/, corroborated by Cloudflare Community thread]

### Anti-Patterns to Avoid

- **Using `_redirects` for www→apex** — Cloudflare Pages does not support hostname-based sources in `_redirects` [VERIFIED]. Will silently fail or behave unpredictably. Use Cloudflare Redirect Rules in the dashboard.
- **Enabling Astro 6 built-in CSP without SSR** — the feature requires on-demand rendering [VERIFIED: docs.astro.build/en/reference/experimental-flags/csp/]. Will be a no-op on `output: 'static'`. Hand-author CSP in `_headers` instead, or skip CSP entirely (recommended for launch).
- **Preconnecting to every font host you might use** — preconnects compete for early connection slots. The current BaseLayout has 3 preconnects (fonts.googleapis.com, fonts.gstatic.com, api.fontshare.com) — this is at the upper edge of "fine." Don't add more without measurement. [CITED: web.dev font-best-practices guidance on overuse]
- **Setting HSTS `preload` without intent to permanently lock in HTTPS** — once preloaded, removal takes 6-12+ months. Plain `max-age=31536000; includeSubDomains` gives full protection without the permanence.
- **Flipping `site:` BEFORE DNS resolves with HTTPS** — sitemap and canonical URLs will be wrong on the next preview deploy. Order: DNS+SSL verified → `site:` PR → merge. The CONTEXT D-06 sequencing is correct; emphasize it in PLAN.md.
- **Forgetting to retire the stale STATE.md:79 Vercel blocker** — flagged in CONTEXT specifics. Add this housekeeping to the launch PR or a separate commit.
- **Adding a custom `404.astro`** — out of scope per CONTEXT deferred. Cloudflare Pages serves a generic 404 by default; if `dist/404.html` exists, it serves that [CITED: developers.cloudflare.com/pages/configuration/serving-pages/]. Defer unless launch QA surfaces a real need.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom build-step script | `@astrojs/sitemap` (already integrated) | Already wired; absorbs D-06 site URL change automatically. |
| HTTPS certificate | Let's Encrypt manual flow | Cloudflare Universal SSL (automatic on custom-domain attach) | Free, auto-renewing, zero-touch. |
| www→apex redirect | DNS-level ALIAS hack | Cloudflare Redirect Rules (dashboard) | Standard, monitored, free. |
| Asset cache headers | Server-side script | `public/_headers` static file | Cloudflare evaluates at edge with zero runtime overhead. |
| Broken-link checker | grep + bash script | `lychee` (Rust binary) | Handles redirects, parallelism, retries, exit codes, false-positive filtering. |
| Spelling checker | grep + dictionary file | `cspell` (npm) | MDX/Astro aware, project dictionary support, exit codes for CI. |
| Lighthouse runner | Manually open DevTools | `lighthouse` CLI | Reproducible, produces an artifact, can be committed as evidence. |
| Font loading optimization | Custom JS preloader | Astro 6 Fonts API (stable) — **if** Lighthouse flags font loading; otherwise leave current pattern in place | Self-hosts, generates fallback metrics, auto-preloads. But: migration touches BaseLayout + global.css — measure first. |
| CSP for inline FOUC script | Roll your own nonce system | sha256 hash in `_headers`, manually computed — **if** the planner picks Option B above; otherwise defer CSP | Hand-authored hashes are static-friendly; nonces require SSR. |

**Key insight:** This phase is mostly "wire existing tools together" — almost nothing should be custom. The temptation traps are (1) writing a "smart" CSP that breaks something, (2) over-tuning font loading, (3) adding a custom 404 page. CONTEXT and CLAUDE.md both push against this — "surgical edits over refactors."

## Common Pitfalls

### Pitfall 1: `_redirects` silently failing for www→apex

**What goes wrong:** Planner writes `https://www.tanyazakus.com/* https://tanyazakus.com/:splat 301` in `public/_redirects`. The redirect doesn't fire. Users on `www.` see the apex content (because Pages auto-serves both hostnames once both are attached), but the canonical URL stays as `www.` — SEO duplicate-content risk.

**Why it happens:** Cloudflare Pages `_redirects` is **path-only**. Hostname sources are unsupported. [VERIFIED]

**How to avoid:** Use Cloudflare Redirect Rules (dashboard) for www→apex. Document this in PLAN.md so the executor doesn't try to put it in `_redirects` first.

**Warning signs:** `curl -I https://www.tanyazakus.com` returns 200, not 301. View-source on the www page shows the apex hostname in canonical. Both are red flags.

### Pitfall 2: Universal SSL stuck pending due to CAA records

**What goes wrong:** Pages domain attaches, but HTTPS doesn't provision. The dashboard shows "SSL pending" for hours/days.

**Why it happens:** A CAA DNS record at the apex restricts which CAs can issue certs for the domain. If it doesn't include Let's Encrypt or Google Trust Services, Cloudflare can't issue. [CITED: developers.cloudflare.com/pages/configuration/custom-domains/]

**How to avoid:** Since Tanya is registering tanyazakus.com fresh through Cloudflare Registrar, **no CAA records will exist by default** — this pitfall is unlikely to fire. But if it does, the fix is to delete or update the CAA record in Cloudflare DNS to include `letsencrypt.org` and `pki.goog`.

**Warning signs:** Pages dashboard "SSL" column shows yellow/pending for > 30 minutes. `curl -vI https://tanyazakus.com` returns SSL handshake errors.

### Pitfall 3: Flipping `site:` before HTTPS works → broken sitemap

**What goes wrong:** Launch PR merges with `site: 'https://tanyazakus.com'`. The next preview deploy regenerates the sitemap with tanyazakus.com URLs, but DNS hasn't propagated / cert hasn't issued. Sitemap points at a non-resolvable hostname for a window of hours. Google crawler hits 404s.

**Why it happens:** Out-of-order execution. D-06 says "flip site: URL **once DNS resolves with HTTPS**" — the order is non-negotiable.

**How to avoid:** PLAN.md sequences this explicitly: domain attach + SSL verified + curl-confirmed HTTPS works → THEN open launch PR → THEN merge.

**Warning signs:** Pre-merge: `curl -vI https://tanyazakus.com` doesn't return 200 with a valid cert. Skip the merge until it does.

### Pitfall 4: Inline FOUC script breaks under accidentally-strict CSP

**What goes wrong:** Planner ships `Content-Security-Policy: script-src 'self'` in `_headers`. The inline FOUC script (BaseLayout.astro:29-47) is blocked. Dark mode flashes on every page load. Looks broken.

**Why it happens:** `script-src 'self'` blocks inline scripts. The FOUC script is intentionally inline and synchronous (it must run before any CSS to avoid the theme flash).

**How to avoid:** **Option A: skip CSP entirely** for v1 launch (recommended above). Option B: include the sha256 hash of the FOUC script and the async-font-loader script in `script-src`. Verify in a Chrome DevTools console — any CSP violations appear there.

**Warning signs:** Page loads with a brief light-mode flash before dark mode applies. DevTools console shows "Refused to execute inline script because it violates the following Content Security Policy directive..."

### Pitfall 5: lychee false-positives from LinkedIn / Instagram

**What goes wrong:** `lychee dist/` returns exit code 2 with LinkedIn and Instagram URLs flagged as broken. Tanya thinks the site has broken links to her professional profiles.

**Why it happens:** LinkedIn and Instagram aggressively block non-browser User-Agents. Returns 403/999/429 to lychee.

**How to avoid:** Add `--exclude linkedin.com --exclude instagram.com` and verify those two URLs manually in a browser. Document this in the SC4 checklist.

**Warning signs:** lychee report shows LinkedIn URL with status 999 or 403. Always a false positive.

### Pitfall 6: cspell flags every proper noun on the site

**What goes wrong:** First `npx cspell` run returns hundreds of "misspellings" — every project name in MDX, every brand reference (Fontshare, Tushar, etc.), Tanya's surname, etc.

**Why it happens:** cspell's default dictionary is general English. Domain-specific proper nouns must be allowlisted.

**How to avoid:** Ship the `cspell.json` shown above with the project-words list. Iterate once: run cspell, copy any legit-but-flagged proper nouns into the words array, rerun until clean.

**Warning signs:** First-run report dominated by names rather than typos.

### Pitfall 7: Preview URL keeps serving content forever

**What goes wrong:** After launch, `my-portfolio-8h7.pages.dev` still serves the same content. Recruiters who bookmarked the preview URL (unlikely but possible) keep hitting the non-canonical URL.

**Why it happens:** Cloudflare Pages preview URLs are not auto-disabled when a custom domain is added. They remain accessible and serve the latest preview deploy. [CITED: Cloudflare community threads]

**How to avoid:** This is the "Preview URL — leave / redirect / restrict" decision the planner must make. CONTEXT specifics flags it as Claude's Discretion. **Recommendation:** leave the preview URL accessible (the X-Robots-Tag: noindex header that Cloudflare Pages auto-applies prevents SEO duplicate-content), but **don't reference it anywhere new**. If Tanya wants it redirected, that's a Cloudflare Redirect Rule (separate from the www→apex rule).

**Warning signs:** N/A — this is a UX/SEO judgment, not a bug.

### Pitfall 8: Stale STATE.md Vercel blocker not retired

**What goes wrong:** STATE.md:79 still reads `Vercel Pro cost: Verify Pro plan billing before Phase 6 planning begins` after launch. Future readers / future Claude sessions think Vercel is still in play.

**Why it happens:** Phase 1 D-02 superseded the Vercel decision, but the STATE.md line wasn't deleted. CONTEXT specifics explicitly flags it.

**How to avoid:** Add a STATE.md edit to the launch PR (or a separate housekeeping commit) removing that line.

**Warning signs:** Grep STATE.md for "Vercel" before merging the launch PR — should return nothing.

## Code Examples

### Example 1: `public/_redirects` (path-only, optional)

```
# Phase 6 — Cloudflare Pages _redirects
# Reference: https://developers.cloudflare.com/pages/configuration/redirects/
#
# NOTE: This file is PATH-ONLY. The www → apex redirect is handled by
# Cloudflare Redirect Rules (dashboard), NOT here. Domain-level sources are
# unsupported in _redirects.

# Legacy: /work was removed in quick task 260507-fcw (commit 5c2fae4).
# Map any external links pointing at /work back to the home #projects section.
/work    /#projects    301
/work/   /#projects    301
```

[VERIFIED: Cloudflare Pages docs — splat/placeholder/status syntax]

### Example 2: `public/_headers` (cache + security, recommended)

```
# Phase 6 — Cloudflare Pages _headers
# Reference: https://developers.cloudflare.com/pages/configuration/headers/

# Hashed Astro assets — content-addressed, immutable, cache forever
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

# Static images in public/images/
/images/*
  Cache-Control: public, max-age=604800

# SVG, ICO, PDF in public/
/*.svg
  Cache-Control: public, max-age=604800
/*.ico
  Cache-Control: public, max-age=604800
/*.pdf
  Cache-Control: public, max-age=86400

# Default for HTML and everything else
/*
  Cache-Control: public, max-age=0, must-revalidate
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

[VERIFIED: Cloudflare _headers syntax — `path-pattern` first line, two-space indented header lines]

### Example 3: `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://tanyazakus.com/sitemap-index.xml
```

[CITED: sitemaps.org cross-submission protocol]

### Example 4: `cspell.json`

```json
{
  "version": "0.2",
  "language": "en",
  "words": [
    "tanyazakus",
    "Tanya",
    "Zakus",
    "Astro",
    "astrojs",
    "Tailwind",
    "Fontshare",
    "Satoshi",
    "Tushar",
    "mdx",
    "FOUC",
    "Cloudflare",
    "Lighthouse",
    "favicon",
    "preconnect",
    "srcset",
    "WebP",
    "AVIF"
  ],
  "ignorePaths": [
    "node_modules",
    "dist",
    ".astro",
    ".planning"
  ]
}
```

[CITED: cspell.org/docs/getting-started — JSON schema]

### Example 5: Pre-launch QA shell script (composable)

```bash
#!/usr/bin/env bash
# Optional: run before opening the launch PR.
set -euo pipefail

echo "→ Building..."
npm run build

echo "→ Typecheck..."
npm run typecheck

echo "→ Broken-link audit (against dist/)..."
lychee dist/ \
  --base https://tanyazakus.com \
  --exclude-mail \
  --exclude linkedin.com \
  --exclude instagram.com \
  --max-concurrency 10 \
  --accept 200,206,429

echo "→ Spelling review..."
npx cspell "src/**/*.{mdx,astro,md}" "README.md"

echo "→ All scripted checks passed. Now: manual mailto E2E + Lighthouse on live."
```

(Manual steps follow: deploy → mailto send/receive → `npx lighthouse https://tanyazakus.com --preset=mobile --output html --output-path ./lighthouse-mobile-launch.html`.)

## Runtime State Inventory

Phase 6 is not a rename/refactor, but the production-cutover element ("flip `site:` URL, update README pointer, attach custom domain") shares a similar shape — the same string `my-portfolio-8h7.pages.dev` may live in places a grep misses. Auditing:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no databases or persistent stores. Astro is build-time only. | None. |
| Live service config | **Cloudflare Pages dashboard** holds the project-to-repo binding, env vars (currently none), preview-URL settings, and (after Phase 6) custom-domain attachments and Redirect Rules. NOT exported to git. Dashboard state is the source of truth for these. | Manual dashboard changes per the Cloudflare Custom-domain Attach sequence above. |
| OS-registered state | None — no Tanya-side service registration. Cloudflare manages everything. | None. |
| Secrets/env vars | None — site is fully static, no API keys required. Verified by inspecting `astro.config.mjs` (no env access) and the absence of `.env*` files. | None. |
| Build artifacts | `dist/` is build-output; not committed. `dist/sitemap-index.xml` and `dist/sitemap-0.xml` will absorb the `site:` change at next build. `node_modules/` not relevant. | None — sitemap regenerates on next push. |

**Audit of `my-portfolio-8h7.pages.dev` references** (grep-verified before launch):

```
astro.config.mjs:9      site: 'https://my-portfolio-8h7.pages.dev'  ← D-06 changes this
src/layouts/BaseLayout.astro:22  Astro.site fallback ?? 'https://my-portfolio-8h7.pages.dev'  ← legacy fallback; can stay (now-unreachable code path) OR be flipped to tanyazakus.com for consistency
src/layouts/BaseLayout.astro:23  Astro.site fallback ?? 'https://my-portfolio-8h7.pages.dev'  ← same
README.md:5             Live site: https://my-portfolio-8h7.pages.dev  ← D-07 changes this
dist/sitemap-index.xml (build artifact, not committed) — regenerates from site:
dist/sitemap-0.xml (build artifact, not committed) — regenerates from site:
```

**Recommendation:** The two BaseLayout fallbacks on lines 22-23 should also flip to `tanyazakus.com` in the launch PR for consistency, even though they're unreachable when `site:` is set. Otherwise a future developer who reads BaseLayout.astro will be confused by a stale preview URL appearing as a fallback. Surgical addition to the launch PR; trivial.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual `<link>` tags to font CDNs (current pattern) | Astro 6 Fonts API (`fonts: [...]` in astro.config) — stable as of Astro 6.0.0 | Astro 6.0.0 (2025) | Self-hosts fonts, generates fallback metrics, auto-preloads. Migration optional for v1 — measure first. [CITED: astro.build/blog/astro-6/] |
| Cloudflare Page Rules | Cloudflare Redirect Rules | Cloudflare deprecated Page Rules for new features in 2024-2025 | Redirect Rules is the modern UI-driven mechanism; Bulk Redirects is for high-volume migrations. [CITED: developers.cloudflare.com/rules/url-forwarding/] |
| Hand-authored sitemap.xml | `@astrojs/sitemap` integration | Astro 2.x+ | Already in place; absorbs site: changes for free. |
| CSP via `unsafe-inline` everywhere | CSP via sha256 hashes for inline scripts, separate handling for inline styles | Ongoing; CSP Level 3 (current) supports `unsafe-hashes` for inline `style` attributes but support is partial. For static sites in 2026: hash inline scripts, accept `unsafe-inline` on style-src OR drop CSP for low-risk static sites. [CITED: developer.mozilla.org/CSP] |
| Lighthouse v9 audit IDs (`uses-rel-preload`, etc.) | Lighthouse v12 still has these IDs but emphasizes Core Web Vitals (LCP, INP, CLS) over the older Page Speed metrics | Lighthouse 10+ replaced "First Input Delay" with INP. [CITED: developer.chrome.com Lighthouse blog] |

**Deprecated/outdated:**
- **Cloudflare Page Rules for new redirects** — superseded by Redirect Rules. Existing Page Rules still work but new setups should use Redirect Rules.
- **HTTP-only sites in 2026** — not relevant to us; Cloudflare Pages is HTTPS-only by default. Mentioned for completeness.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Tanya is comfortable running `brew install lychee`, `npx cspell`, and `npx lighthouse` from a terminal | Standard Stack — Supporting | Low — if she isn't, the QA path drops to "open Chrome DevTools and click Lighthouse, manually visit-each-page for broken links, eyeball spelling." Manual fallback is acceptable. [ASSUMED based on solo-maintainer context] |
| A2 | The current Lighthouse mobile score on the preview deploy is at or near ≥ 80 already (i.e., no major regressions) | Performance Pass | Medium — if the score is < 60, the perf pass becomes much larger work (font self-hosting, image audit, etc.). **Recommendation:** PLAN.md's first task is "measure baseline Lighthouse score" so this assumption is replaced with a verified number before any optimization work commits. [ASSUMED] |
| A3 | Tailwind v4 in this project does not emit inline `style="..."` attributes that would require `style-src 'unsafe-inline'` in CSP | CSP Scope Decision — Option B | Medium — if it does, Option B CSP needs `'unsafe-inline'` on style-src, which dilutes the CSP value. **Mitigation:** the recommendation is Option A (no CSP) for v1, which sidesteps this entirely. [ASSUMED — would need a grep of `dist/*.html` for `style=` attributes to verify] |
| A4 | `tanyazakus.com` is available to register at Cloudflare Registrar | Cloudflare Custom-domain Attach | High if wrong, but CONTEXT D-03 already addresses the fallback (planner flags immediately, does not proceed silently). [ASSUMED — Tanya should verify in the Cloudflare Registrar search before PLAN.md is written] |
| A5 | Tanya's CAA records will not block Universal SSL provisioning | Pitfall 2 | Low — fresh registration through Cloudflare Registrar means no CAA records exist by default. Risk is essentially zero. [VERIFIED by registrar workflow] |
| A6 | The current Cloudflare Pages preview URL behavior (auto-noindex via X-Robots-Tag) means leaving it accessible doesn't cause SEO duplicate-content issues | Pitfall 7 + robots.txt note | Low — Cloudflare docs confirm preview URLs get `X-Robots-Tag: noindex` automatically. [VERIFIED] |
| A7 | A planner picking the Astro 6 Fonts API migration could complete it in 1-2 hours | Performance Pass — Decision Flowchart | Medium — the migration touches `BaseLayout.astro` head, `--font-sans`/`--font-serif` tokens in `global.css`, may require font weight verification. Could be 3-4 hours if Fontshare-hosted Satoshi requires the `fontProviders.local()` workaround (download + bundle). [ASSUMED — would need a spike to verify] |

## Open Questions

1. **Does Tailwind v4 emit inline `style` attributes in our compiled output?**
   - What we know: Some Tailwind utilities (especially arbitrary value `bg-[var(--foo)]`) may or may not compile to inline styles depending on the version and Lightning CSS settings.
   - What's unclear: Whether THIS codebase's compiled HTML has inline `style=` attributes.
   - Recommendation: If the planner picks CSP Option B (lax CSP with hashes), spike this first: `grep -r 'style=' dist/*.html` after a build. If the count is low (< 5), hash them; if high, accept `style-src 'unsafe-inline'` or skip CSP.

2. **Is the Astro 6 Fonts API's Fontshare provider production-ready, or do we need `fontProviders.local()` for Satoshi?**
   - What we know: Astro docs list "Fontshare" among supported providers but show only Google in examples.
   - What's unclear: Whether `fontProviders.fontshare({ family: 'Satoshi', weights: [...] })` exists today, or whether the only path is to download Satoshi WOFF2 files and self-host with `fontProviders.local()`.
   - Recommendation: If Lighthouse flags font loading, spike `fontProviders.fontshare()` first; fall back to `local()` with downloaded WOFF2 files if not supported. Either way, get Tanya's blessing before committing to the migration in PLAN.md.

3. **Should the preview URL `my-portfolio-8h7.pages.dev` redirect to production after launch, or just stay accessible?**
   - What we know: CONTEXT specifics flags this as Claude's Discretion. Cloudflare auto-applies `X-Robots-Tag: noindex` to preview URLs, so SEO impact is zero.
   - What's unclear: Whether Tanya cares about redirecting it.
   - Recommendation: **Leave it accessible** for v1. Adding a redirect is a separate Cloudflare Redirect Rule (similar pattern to www→apex). It's reversible cheaply later. Defer.

4. **Should `npm run typecheck` be gated in the Cloudflare Pages build?**
   - What we know: CONTEXT deferred lists this as "minor friction for a solo maintainer."
   - What's unclear: Whether the planner wants to enable it in Phase 6 (adds confidence on every push) or defer (keeps Phase 6 surgical).
   - Recommendation: Defer per CONTEXT. Cloudflare Pages build command is `npm run build`; changing it to `npm run typecheck && npm run build` is one dashboard click but slows every preview deploy by 5-10s.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js ≥ 22.12 | Existing build pipeline (`package.json` engines.node) | Likely ✓ (already running for Phase 5) | — | If missing, install via nvm or homebrew before Phase 6 work. |
| `npm` | Build + npx invocations | ✓ (bundled with Node) | — | — |
| `npx` (lighthouse, cspell) | Pre-launch QA tooling | ✓ (bundled with npm) | — | — |
| `brew` (Homebrew) | Recommended lychee install path on macOS | Likely ✓ (developer machine) | — | `cargo install lychee` if cargo is installed; or use the npm wrapper `npx lychee` (slower, less reliable). |
| `lychee` binary | Broken-link audit | ✗ (not installed) | — | `brew install lychee` — one-time install. Alternatives: `cargo install lychee`, or npm wrapper. |
| Chrome / Chromium | `lighthouse` CLI needs headless Chrome | Likely ✓ (developer machine) | — | If missing, `npx lighthouse` will install puppeteer's bundled Chromium on first run. |
| Cloudflare Pages account | DEPLOY-01 requirement | ✓ — site already deploys to `my-portfolio-8h7.pages.dev` | — | — |
| Cloudflare Registrar access | D-03 — domain purchase | ✓ (same account) | — | If Tanya prefers another registrar (Namecheap, etc.), the planner adjusts D-03; the Cloudflare-only consolidation benefit is lost. |
| Payment method for ~$8/yr domain | D-02 / D-03 | Assumed ✓ | — | If absent, Phase 6 cannot complete domain purchase step. |
| Network access for `lychee` and `lighthouse` live-URL runs | Pre-launch QA | ✓ (assumed) | — | Run lychee against `dist/` with `--offline` for fully-offline link check (won't catch external link issues). |

**Missing dependencies with no fallback:** None expected.

**Missing dependencies with fallback:** lychee — easy install via Homebrew, npm wrapper, or cargo.

## Validation Architecture

> nyquist_validation is true in `.planning/config.json`; this section is included.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No JavaScript/TypeScript unit-test framework in this project (no vitest, no jest, no playwright). Validation is via build + lint + manual + tool-driven checks. |
| Config file | `astro.config.mjs` (build), `package.json` scripts, `cspell.json` (new in Phase 6) |
| Quick run command | `npm run build && npm run typecheck` |
| Full suite command | `npm run build && npm run typecheck && npx cspell "src/**/*.{mdx,astro,md}" "README.md" && lychee dist/ --base https://tanyazakus.com --exclude-mail --exclude linkedin.com --exclude instagram.com` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| SEO-05 | Mobile Lighthouse performance score ≥ 80 | manual-automated (CLI tool, but interpreted by human) | `npx lighthouse https://tanyazakus.com --preset=mobile --only-categories=performance --output html --output-path ./lighthouse-mobile-launch.html --quiet` | ❌ Wave 0 — Phase 6 produces this artifact |
| DEPLOY-01 | Site deployed to Cloudflare Pages free tier, site reachable on push | smoke (manual + curl) | `curl -I https://tanyazakus.com` (expect 200) + dashboard visual check that build is green | ✅ existing pipeline; Phase 6 verifies didn't regress |
| DEPLOY-02 | Performance optimization pass — minification, CSS purge, image formats verified | build-output inspection + Lighthouse | `npm run build && ls dist/_astro/*.css \| xargs -I {} wc -c {} && ls dist/_astro/*.webp 2>/dev/null \| head` + Lighthouse audits (modern-image-formats, unused-css-rules, total-byte-weight) | ❌ Wave 0 — inspection happens at Phase 6 execution |
| DEPLOY-03 | Custom domain configured with HTTPS, resolves at production URL | smoke (curl + browser) | `curl -vI https://tanyazakus.com 2>&1 \| grep -i "subject\|issuer"` (verify cert) + `curl -I https://www.tanyazakus.com` (expect 301) + browser visual check | ❌ Wave 0 — runs once Cloudflare attach completes |
| (SC4) | Broken-link audit passes | unit-like (lychee) | `lychee dist/ --base https://tanyazakus.com --exclude-mail --exclude linkedin.com --exclude instagram.com --max-concurrency 10 --accept 200,206,429` (exit 0) | ❌ Wave 0 — first run produces report |
| (SC4) | Spelling review passes | unit-like (cspell) | `npx cspell "src/**/*.{mdx,astro,md}" "README.md"` (exit 0 after `cspell.json` allowlists project terms) | ❌ Wave 0 — `cspell.json` is created in Phase 6 |
| (SC4) | Mailto E2E test passes | manual | Click footer email → mail client opens prefilled to `tanyazakus2106@gmail.com` → send test from external account → confirm receipt within 5 minutes | manual; document in PLAN.md |

### Sampling Rate
- **Per task commit:** `npm run build && npm run typecheck` — Astro build catches schema errors, broken imports, missing components; typecheck catches `.astro` prop mismatches. These should pass on every commit. This is the minimal Nyquist sample rate.
- **Per wave merge:** Full suite (build + typecheck + cspell + lychee) — runs once per wave merge into the launch branch.
- **Phase gate:** Full suite green + Lighthouse mobile ≥ 80 (`./lighthouse-mobile-launch.html` committed to `.planning/phases/06-deployment/` as evidence) + mailto E2E confirmed + DNS+HTTPS verified before `/gsd-verify-work` runs.

### Wave 0 Gaps
- [ ] `public/_redirects` — only if planner picks the redirects-shipped path (recommended for `/work` → `/#projects` legacy mapping)
- [ ] `public/_headers` — recommended (cache hygiene + security headers)
- [ ] `public/robots.txt` — recommended (sitemap pointer)
- [ ] `cspell.json` — recommended (Wave 0 prerequisite for the spelling-review SC4 check)
- [ ] Install lychee (`brew install lychee`) — Wave 0 prerequisite for broken-link audit
- [ ] Update `astro.config.mjs:9` `site:` to `https://tanyazakus.com` — D-06, requires DNS+SSL verified first
- [ ] Update `README.md:5` Live site pointer — D-07
- [ ] Update `src/layouts/BaseLayout.astro:22-23` fallback strings — housekeeping (CONTEXT specifics)
- [ ] Remove stale STATE.md:79 Vercel blocker — housekeeping (CONTEXT specifics)
- [ ] Lighthouse mobile HTML report committed to `.planning/phases/06-deployment/lighthouse-mobile-launch.html` — SEO-05 evidence

*No test framework installation needed — this project intentionally has no unit test suite (per CLAUDE.md "JS budget: near-zero" and "elegant simplicity beats robust abstraction" for a solo-maintained portfolio).*

## Security Domain

> `security_enforcement` is not explicitly set in `.planning/config.json` — treating as enabled per the agent prompt directive ("absent = enabled").

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No authentication on a public portfolio. |
| V3 Session Management | no | No sessions; site is stateless static HTML. |
| V4 Access Control | no | No access control; everything is public. |
| V5 Input Validation | partial | The site accepts no user input. The only "input" surface is the mailto link (and the previous `/work` URL that's being redirected); both are well-formed by construction. |
| V6 Cryptography | partial | TLS terminates at Cloudflare (Universal SSL, managed). HSTS recommended via `_headers`. |
| V9 Communication | yes | HTTPS-only via Cloudflare + HSTS in `_headers` (recommended). |
| V11 Business Logic | no | No business logic on the client. |
| V13 API | no | No API. |
| V14 Configuration | yes | Cloudflare dashboard SSL/TLS mode = Full (strict), Always Use HTTPS = on. Security headers via `_headers`. |

### Known Threat Patterns for static Astro on Cloudflare Pages

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Clickjacking via iframe embedding | Tampering | `X-Frame-Options: DENY` (in `_headers`) |
| MIME-type confusion / sniffing | Tampering | `X-Content-Type-Options: nosniff` (in `_headers`) |
| Excessive referrer leakage to external sites (LinkedIn, Instagram links) | Information Disclosure | `Referrer-Policy: strict-origin-when-cross-origin` (in `_headers`) — preserves analytics utility while not leaking full path |
| HTTPS downgrade attack | Tampering | `Strict-Transport-Security: max-age=31536000; includeSubDomains` (in `_headers`) + Cloudflare "Always Use HTTPS" |
| Hostname feature abuse (camera, geolocation, etc.) | Elevation of Privilege | `Permissions-Policy: camera=(), microphone=(), geolocation=(), ...` (in `_headers`) |
| XSS via reflected URL params | Tampering | Astro escapes by default; no `set:html` usages with untrusted input in this codebase. CSP would be defense-in-depth (Option A/B/C above). |
| Open redirect via `_redirects` typo | Tampering | All `_redirects` destinations in this project are relative paths or same-origin; no open-redirect risk. |
| Domain hijacking / DNS takeover | Spoofing | Cloudflare Registrar transfer-lock by default; 2FA on the Cloudflare account is the most important control (manage out-of-band). |

**Recommended security posture for v1 launch:** Ship `_headers` with HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. **Defer CSP** to a future hardening pass (Option A recommended above). Verify 2FA is enabled on Tanya's Cloudflare account (out-of-band, manual).

## Project Constraints (from CLAUDE.md)

Extracted directives that constrain Phase 6 execution:

- **No CMS overhead** — static/code-driven content only. Phase 6 must not introduce any service that adds CMS-like configuration ceremony.
- **No heavy frameworks** — perf pass must not pull in PostCSS plugins, image-CDN integrations, or other tooling without evidence of a real gap.
- **Owner edits code directly** — `_redirects`, `_headers`, `robots.txt` must be plain-text files Tanya can hand-edit. No generation scripts.
- **JS budget: near-zero** — perf pass must not add client-side JS unless it materially improves Lighthouse.
- **Deploy target: Cloudflare Pages, fully static** — confirmed locked. No SSR adapter, no Pages Functions, no API routes.
- **Surgical edits over refactors** — applies to every Phase 6 decision. Skip CSP if it isn't needed. Skip the Fonts API migration if Lighthouse already passes. Don't add tooling that maintains itself.
- **No emojis in files** — applies to README updates, MDX content, and any new files (`_redirects`, `_headers`, `robots.txt`).
- **GSD workflow enforcement** — Phase 6 work goes through `/gsd-execute-phase` (or quick tasks for specific surgical edits); no direct edits outside the GSD flow.

These directives align with the CONTEXT.md guidance and the recommendations in this research. No conflicts identified.

## Sources

### Primary (HIGH confidence)

- **Cloudflare Pages `_redirects` docs** — https://developers.cloudflare.com/pages/configuration/redirects/ — syntax, limits, "Domain-level redirects unsupported" confirmation
- **Cloudflare Pages `_headers` docs** — https://developers.cloudflare.com/pages/configuration/headers/ — syntax, limits, header rules vs system-header interaction
- **Cloudflare Pages custom domains docs** — https://developers.cloudflare.com/pages/configuration/custom-domains/ — attach sequence, Universal SSL, CAA-record pitfall
- **Cloudflare Pages serving-pages docs** — https://developers.cloudflare.com/pages/configuration/serving-pages/ — default cache-control, 404.html behavior, trailing-slash redirects
- **Cloudflare www-to-root redirect rules** — https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/ — exact dashboard configuration for D-04
- **Cloudflare Pages www-redirect how-to** — https://developers.cloudflare.com/pages/how-to/www-redirect/ — Bulk Redirects path (alternative to Redirect Rules)
- **Astro Fonts API docs** — https://docs.astro.build/en/guides/fonts/ — built-in font handling in Astro 6
- **Astro CSP experimental flag docs** — https://docs.astro.build/en/reference/experimental-flags/csp/ — confirms CSP feature is SSR-only
- **Astro 6 release notes** — https://astro.build/blog/astro-6/ — Fonts API stable, Node 22 requirement, no Image API breaking changes
- **Astro sitemap integration docs** — https://docs.astro.build/en/guides/integrations-guide/sitemap/ — site: dependency, filenames, filter/serialize options
- **MDN Content Security Policy reference** — https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP — hash vs nonce, directives, browser support
- **lychee README** — https://github.com/lycheeverse/lychee — install, flags, exit codes
- **cspell getting-started** — https://cspell.org/docs/getting-started — JSON schema, glob patterns, exit codes
- **Lighthouse README** — https://github.com/GoogleChrome/lighthouse — CLI flags, preset modes, output formats
- **`npm view`** — version verification for astro, @astrojs/sitemap, @astrojs/mdx, tailwindcss, cspell, lighthouse (run 2026-05-12)
- **Project files** — astro.config.mjs, BaseLayout.astro, package.json, README.md, .planning/STATE.md, .planning/REQUIREMENTS.md, .planning/ROADMAP.md, .planning/phases/01/04/05/06-CONTEXT.md, public/, dist/sitemap-*.xml

### Secondary (MEDIUM confidence)

- **eastondev.com Astro Performance Guide** — https://eastondev.com/blog/en/posts/dev/20251202-astro-performance-optimization/ — corroborates zero-JS-by-default impact on Lighthouse
- **bryanbraun.com CSP hash guide** — https://www.bryanbraun.com/2021/08/10/allowing-inline-scripts-in-your-content-security-policy-using-a-hash/ — practical inline-script hash workflow
- **content-security-policy.com** — https://content-security-policy.com/ — directive reference, common-mistakes overview
- **web.dev font-best-practices** — https://web.dev/articles/font-best-practices — font-display tradeoffs, preconnect guidance (general, not Astro-specific)
- **web.dev LCP article** — https://web.dev/articles/lcp — LCP threshold of 2.5s, what counts as LCP element
- **developer.chrome.com Lighthouse blog** — https://developer.chrome.com/blog/lighthouse-load-performance — TBT/INP guidance, audit category weights
- **Cloudflare Community on preview URL noindex** — https://community.cloudflare.com/t/x-robots-tag-doesnt-work-expected-on-cloudflare-pages-preview-deployment/853157 — corroborates Cloudflare auto-applies noindex to *.pages.dev
- **piyushmehta.com Astro 5.9 CSP** — https://www.piyushmehta.com/blog/astro-v5-9-content-security-policy — context on the CSP feature's evolution into Astro 6

### Tertiary (LOW confidence — flagged for validation if used)

- **Fontshare provider in Astro 6 Fonts API** — listed among supported providers in docs prose but no concrete example. Treat as "spike before adopting."
- **Exact Tailwind v4 inline-style behavior in this project's compiled output** — not verified against `dist/*.html` in this research. Treat as Open Question 1.

## Metadata

**Confidence breakdown:**
- Cloudflare Pages plumbing (_redirects, _headers, custom domain attach, www→apex) — HIGH — Multiple official docs cross-referenced. The `_redirects` path-only constraint is verified by explicit docs language.
- Astro 6 perf and feature surface — HIGH — Official docs + release notes; versions verified via `npm view`.
- CSP scope decision — MEDIUM — The recommendation (Option A skip-CSP-for-v1) is conservative and matches "surgical edits over refactors." Options B and C are well-researched but the planner must own the final call.
- Pre-launch QA tooling (lychee, cspell, lighthouse) — HIGH — Official sources, recent versions verified.
- Performance pass scope — MEDIUM — The measurement-first recommendation depends on Lighthouse baseline. Hard to predict without running the audit. Audit checklist itself is HIGH-confidence.
- Open Questions (Tailwind inline styles, Fontshare provider) — LOW — Both should be spiked before commits land. Flagged as Open Questions and as Assumptions.

**Research date:** 2026-05-12
**Valid until:** 2026-06-12 (30 days for the deployment plumbing, which is stable). Astro 6 perf details should be re-verified if not executed within 14 days. Tooling versions (lychee, cspell, lighthouse) should be re-`npm view`'d at execution time.

---

*Phase: 06-deployment*
*Researched: 2026-05-12*
