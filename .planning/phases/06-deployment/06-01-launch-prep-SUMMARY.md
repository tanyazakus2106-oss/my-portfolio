---
phase: 06-deployment
plan: "01"
subsystem: edge-config
tags:
  - cloudflare-pages
  - security-headers
  - cache-control
  - robots
  - cspell
dependency_graph:
  requires: []
  provides:
    - "Cache-Control immutable headers for /_astro/* (DEPLOY-02)"
    - "ASVS L1 security headers on all HTML responses"
    - "Legacy /work redirect to /#projects (301)"
    - "robots.txt with production sitemap pointer"
    - "cspell project dictionary for Plan 02 QA gate"
  affects:
    - "Plan 02: QA gates (reads cspell.json, validates robots.txt)"
    - "Plan 03: Cloudflare dashboard hardening (complements _headers HSTS)"
    - "Plan 04: Custom domain cutover (robots.txt sitemap URL goes live)"
tech_stack:
  added: []
  patterns:
    - "Cloudflare Pages _headers: path-pattern flush-left, two-space indented header lines"
    - "Cloudflare Pages _redirects: path-only redirects (no hostname sources)"
    - "cspell v0.2 config with ignorePaths to focus review on src/**"
key_files:
  created:
    - public/_headers
    - public/_redirects
    - public/robots.txt
    - cspell.json
  modified: []
decisions:
  - "CSP omitted for v1 launch (Option A): inline FOUC script in BaseLayout and async font loader would require nonce infrastructure or hash allowlisting; ASVS L1 is satisfied without CSP for a static site with no user input"
  - "HSTS preload omitted: one-way commitment requiring external registry submission; deferred until production domain is stable post-cutover"
  - "www->apex redirect NOT in _redirects: domain-level sources are unsupported by Cloudflare Pages _redirects; handled in Cloudflare Redirect Rules (Plan 03)"
  - "cspell.json ships pre-populated dictionary so Plan 02 first run produces signal not noise"
metrics:
  duration: "~2 minutes"
  completed_date: "2026-05-12"
  tasks_completed: 3
  tasks_total: 3
  files_created: 4
  files_modified: 0
  lines_added: 75
---

# Phase 6 Plan 01: Launch Prep (Edge Config) Summary

Shipped four plain-text static-asset files providing Cloudflare edge cache headers, ASVS L1 security headers, a legacy-path redirect, a sitemap-indexed robots.txt, and a pre-populated cspell dictionary — all ready for the next Cloudflare Pages deploy.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create public/_headers (cache + security headers) | 98b40f9 | public/_headers |
| 2 | Create public/_redirects and public/robots.txt | 8a23b0d | public/_redirects, public/robots.txt |
| 3 | Create cspell.json (project dictionary) | 9dddccb | cspell.json |

## Files Created

### `public/_headers` (29 lines)

Cloudflare Pages edge-config file providing:

- `/_astro/*`: `Cache-Control: public, max-age=31536000, immutable` — content-addressed Astro hashed assets served with permanent cache (addresses DEPLOY-02 Lighthouse `uses-long-cache-ttl` audit)
- `/images/*`, `/*.svg`, `/*.ico`: `Cache-Control: public, max-age=604800` (7-day cache for static images and icons)
- `/*.pdf`: `Cache-Control: public, max-age=86400` (1-day cache for resume PDF)
- `/*`: ASVS L1 security headers on all HTML responses:
  - `X-Frame-Options: DENY` (T-06-01 clickjacking mitigation)
  - `X-Content-Type-Options: nosniff` (T-06-02 MIME sniffing mitigation)
  - `Referrer-Policy: strict-origin-when-cross-origin` (T-06-03 referrer leakage mitigation)
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()` (T-06-05 feature permission mitigation)
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (T-06-04 HTTPS downgrade mitigation)

### `public/_redirects` (11 lines)

Cloudflare Pages path-only redirect file:

- `/work` and `/work/` redirect 301 to `/#projects` — handles legacy external links pointing at the `/work` route that was removed in quick task `260507-fcw` (commit `5c2fae4`)
- No hostname-level sources (www->apex lives in Cloudflare Redirect Rules per Plan 03 / D-04)

### `public/robots.txt` (4 lines)

Standard `User-agent: *`, `Allow: /`, and `Sitemap: https://tanyazakus.com/sitemap-index.xml` pointing crawlers to the production apex domain. Sitemap URL uses the final custom hostname even though the domain cutover happens in Plan 04 — robots.txt only becomes effective when the custom domain is live.

### `cspell.json` (31 lines)

CSpell v0.2 configuration with:

- 19 project-specific words covering proper nouns that would otherwise generate false-positive spelling errors in Plan 02's `npx cspell "src/**/*.{mdx,astro,md}" "README.md"` run
- `ignorePaths` excluding `node_modules`, `dist`, `.astro`, and `.planning` to focus review signal on source files

## Key Design Decisions

### Why CSP was deliberately omitted (Option A)

`src/layouts/BaseLayout.astro` ships an inline FOUC-prevention script (lines 29–47) and an async font loader (lines 88–93). A Content Security Policy on `/*` would block both unless allowlisted by hash or nonce. Hash allowlisting requires computing SHA-256 of the inline script at build time and injecting it into the header — non-trivial with static file `_headers`. Nonce requires a server-side response to generate per-request — incompatible with a fully-static Cloudflare Pages deploy. ASVS L1 is met by the other five security headers shipped in this plan. CSP is deferred to a v2 hardening pass per RESEARCH.md Pattern 3 / CONTEXT Option A.

### Why HSTS `preload` was omitted

`preload` submits the domain to browser HSTS preload lists — a one-way commitment. Once submitted, removing the domain from the list takes months. The custom domain is not yet live (Plan 04), and Cloudflare "Always Use HTTPS" (Plan 03) provides complementary protection. HSTS without `preload` is correct for this launch phase. `preload` can be added post-cutover after verifying the domain is stable.

## Build Verification

`npm run build` passes cleanly. All three `public/*` files (`_headers`, `_redirects`, `robots.txt`) are present in `dist/` as expected. `cspell.json` correctly remains at repo root (dev-time tooling, not served).

Existing dist/ artifacts (favicon, og-image, resume PDF, `/_astro/*` image assets) build without regression.

## Next Steps

**Plan 02: QA Gates** — runs `npx cspell` (reads `cspell.json` created here), validates `robots.txt`, and performs Lighthouse pre-flight checks to baseline the site before the domain cutover.

**Plan 03: Cloudflare Dashboard Hardening** — adds the www->apex Redirect Rule (D-04), enables "Always Use HTTPS", and validates the preview URL behavior complementing the `_headers` HSTS.

## Deviations from Plan

None — plan executed exactly as written. All four files created with exact content specified in the plan. Build verification passed on first attempt.

## Threat Flags

No new security-relevant surface introduced beyond what is documented in the plan's threat model. All STRIDE threats T-06-01 through T-06-05 are mitigated by the `_headers` file created in Task 1.

## Self-Check: PASSED

- `public/_headers` exists: FOUND
- `public/_redirects` exists: FOUND
- `public/robots.txt` exists: FOUND
- `cspell.json` exists: FOUND
- Commits: 98b40f9 (Task 1), 8a23b0d (Task 2), 9dddccb (Task 3) — all present in git log
- `dist/_headers` exists after build: FOUND
- `dist/_redirects` exists after build: FOUND
- `dist/robots.txt` exists after build: FOUND
