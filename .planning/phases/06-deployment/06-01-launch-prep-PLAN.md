---
phase: 06-deployment
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/_headers
  - public/_redirects
  - public/robots.txt
  - cspell.json
autonomous: true
requirements:
  - DEPLOY-02
  - SEO-05
requirements_addressed:
  - DEPLOY-02
  - SEO-05
tags:
  - cloudflare-pages
  - edge-config
  - security-headers
  - perf

must_haves:
  truths:
    - "Hashed Astro assets serve with immutable long-cache headers in production"
    - "All HTML responses carry HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy"
    - "Crawlers discover the production sitemap via robots.txt"
    - "Legacy /work URLs redirect to /#projects without a 404"
    - "cspell can run against src/**/*.{mdx,astro,md} without flagging known project terms"
  artifacts:
    - path: "public/_headers"
      provides: "Cache-Control + security headers at the Cloudflare edge"
      contains: "Strict-Transport-Security: max-age=31536000; includeSubDomains"
    - path: "public/_redirects"
      provides: "Path-only /work → /#projects legacy redirect"
      contains: "/work    /#projects    301"
    - path: "public/robots.txt"
      provides: "User-agent: * + Sitemap pointer to production hostname"
      contains: "Sitemap: https://tanyazakus.com/sitemap-index.xml"
    - path: "cspell.json"
      provides: "Project dictionary for pre-launch spelling review"
      contains: "tanyazakus"
  key_links:
    - from: "public/_headers"
      to: "/_astro/*"
      via: "path-pattern cache-control rule"
      pattern: "/_astro/\\*"
    - from: "public/robots.txt"
      to: "sitemap-index.xml"
      via: "Sitemap: directive"
      pattern: "Sitemap: https://tanyazakus\\.com/sitemap-index\\.xml"
---

<objective>
Ship the repo-side launch prep: four plain-text static-asset files that Cloudflare Pages will pick up at the next deploy. These files cause zero behavior change on the preview URL today (security headers and cache-control apply but don't break anything) and pre-stage everything the production custom-domain cutover (Plan 03 / Plan 04) needs.

Purpose: Address DEPLOY-02 (perf optimization — `/_astro/*` long-cache headers flip the Lighthouse `uses-long-cache-ttl` audit from fail to pass) and seed the SEO-05 baseline measurement that Plan 02 runs. Establish security headers per the ASVS L1 register below.

Output: 4 new committed files under repo root (3 in `public/`, 1 at root for cspell). No production cutover yet — that lives in Plan 03 + Plan 04.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/06-deployment/06-CONTEXT.md
@.planning/phases/06-deployment/06-RESEARCH.md
@.planning/phases/06-deployment/06-PATTERNS.md
@CLAUDE.md

<interfaces>
<!-- The public/ static-asset bypass pattern is the only "interface" this plan touches.
     Files placed in public/ are copied verbatim to dist/ at build time and served at
     the root URL. No Astro processing, no Vite bundling, no imports. -->

Existing public/ contents (proves the bypass pattern):
- public/favicon.ico            (810 bytes, served at /favicon.ico)
- public/favicon.svg            (508 bytes, served at /favicon.svg)
- public/og-image.png           (27,890 bytes, served at /og-image.png)
- public/tanya-zakus-designer-resume.pdf (173,328 bytes, served at /tanya-zakus-designer-resume.pdf)
- public/images/                (case study covers)

Cloudflare Pages edge-config conventions:
- _headers: path-pattern flush-left, header lines indented exactly TWO SPACES (not tabs, not 4-space).
- _redirects: path-only sources. Hostname sources fail silently.
- robots.txt: served at /robots.txt; sitemap URL must match production hostname.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create public/_headers with cache + security headers</name>
  <files>public/_headers</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md (sections: "Pattern 2: Cloudflare Pages `_headers`" and "Code Examples → Example 2") — authoritative byte-for-byte content
    - .planning/phases/06-deployment/06-PATTERNS.md (section: "`public/_headers` (NEW — recommended for launch)") — formatting conventions (two-space indent, no tabs)
    - src/layouts/BaseLayout.astro (lines 28-98) — confirms there's no CSP being shipped; lines 29-47 (inline FOUC) and lines 88-93 (async font loader) drove CSP-skip decision (Option A in RESEARCH.md)
    - CLAUDE.md — "No emojis in files" rule applies to this new plain-text file
  </read_first>
  <action>
    Create `public/_headers` with EXACTLY the following content. Per RESEARCH.md Pattern 3 / Pitfall 4, CSP is deliberately omitted for v1 launch (Option A). HSTS `preload` is intentionally omitted (one-way commitment per RESEARCH.md Pattern 2 notes). The file uses two-space indented header lines (Cloudflare-specific syntax; tabs and four-space indents are NOT accepted).

    ```
    # Phase 6 — Cloudflare Pages _headers
    # Reference: https://developers.cloudflare.com/pages/configuration/headers/
    # D-06 / DEPLOY-02 / SEO-05 — cache hygiene + ASVS L1 baseline security headers.
    # CSP intentionally omitted for v1 launch (Option A per 06-RESEARCH.md).

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

    No trailing emoji, no commentary outside `#`-prefixed lines, no smart-quotes (the file is parsed byte-strictly by Cloudflare's edge). Confirm with `cat -A public/_headers` that header lines start with exactly two spaces — not a tab character (which would render as `^I`).
  </action>
  <verify>
    <automated>test -f public/_headers && grep -q "^  Strict-Transport-Security: max-age=31536000; includeSubDomains$" public/_headers && grep -q "^/_astro/\*$" public/_headers && grep -q "^  Cache-Control: public, max-age=31536000, immutable$" public/_headers && grep -q "^  X-Frame-Options: DENY$" public/_headers && grep -q "^  Referrer-Policy: strict-origin-when-cross-origin$" public/_headers && grep -q "Permissions-Policy: camera=()" public/_headers && ! grep -q "$(printf '\t')" public/_headers && ! grep -q "preload" public/_headers && ! grep -q "Content-Security-Policy" public/_headers && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - File `public/_headers` exists
    - Contains the exact string `Strict-Transport-Security: max-age=31536000; includeSubDomains` (indented with two spaces, NO `preload` token)
    - Contains the exact path-pattern line `/_astro/*` (flush-left)
    - Contains the exact line `  Cache-Control: public, max-age=31536000, immutable` directly underneath `/_astro/*` (two-space indent)
    - Contains `X-Frame-Options: DENY`
    - Contains `X-Content-Type-Options: nosniff`
    - Contains `Referrer-Policy: strict-origin-when-cross-origin`
    - Contains `Permissions-Policy: camera=()` substring
    - Does NOT contain any tab character (grep `$'\t'` returns 0 matches)
    - Does NOT contain `preload` (HSTS preload intentionally excluded — one-way decision)
    - Does NOT contain `Content-Security-Policy` (CSP skipped for v1 per Option A)
  </acceptance_criteria>
  <done>
    `public/_headers` exists with the exact content above, passes the grep verification, and is staged for commit.
  </done>
</task>

<task type="auto">
  <name>Task 2: Create public/_redirects (legacy /work path) and public/robots.txt (sitemap pointer)</name>
  <files>public/_redirects, public/robots.txt</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md (sections: "Pattern 1: Cloudflare Pages `_redirects` (path-only)", "Code Examples → Example 1", "Pattern 7: `robots.txt`", "Code Examples → Example 3") — authoritative content
    - .planning/phases/06-deployment/06-CONTEXT.md (D-04 — www→apex enforcement; D-05 — DNS scope = website only; "Deferred-but-noted code paths" — /work was removed in quick task 260507-fcw)
    - .planning/phases/06-deployment/06-RESEARCH.md "Anti-Patterns to Avoid" — `_redirects` for www→apex is forbidden; that mechanism lives in Cloudflare Redirect Rules (Plan 03), NOT this file
  </read_first>
  <action>
    Create TWO files this task.

    **File A — `public/_redirects`** (path-only legacy redirect for the removed /work route per quick task `260507-fcw` commit `5c2fae4`). The www→apex redirect must NOT appear here; it is a Cloudflare dashboard Redirect Rule per D-04 and Plan 03.

    Exact content:
    ```
    # Phase 6 — Cloudflare Pages _redirects
    # Reference: https://developers.cloudflare.com/pages/configuration/redirects/
    #
    # NOTE: This file is PATH-ONLY. The www -> apex redirect is handled by
    # Cloudflare Redirect Rules (dashboard), NOT here. Domain-level sources are
    # unsupported in _redirects.

    # Legacy: /work was removed in quick task 260507-fcw (commit 5c2fae4).
    # Map any external links pointing at /work back to the home #projects section.
    /work    /#projects    301
    /work/   /#projects    301
    ```

    **File B — `public/robots.txt`** (3 lines + blank). Sitemap URL uses the production hostname (matches D-06 `site:` target, even though that flip happens in Plan 04 — robots.txt only takes effect once the custom domain is live, so it is correct to bake in the apex hostname now).

    Exact content:
    ```
    User-agent: *
    Allow: /

    Sitemap: https://tanyazakus.com/sitemap-index.xml
    ```

    No BOM, no trailing whitespace beyond the file-final newline. No emoji.
  </action>
  <verify>
    <automated>test -f public/_redirects && test -f public/robots.txt && grep -qE "^/work[[:space:]]+/#projects[[:space:]]+301$" public/_redirects && grep -qE "^/work/[[:space:]]+/#projects[[:space:]]+301$" public/_redirects && ! grep -q "www\." public/_redirects && grep -q "^User-agent: \*$" public/robots.txt && grep -q "^Allow: /$" public/robots.txt && grep -q "^Sitemap: https://tanyazakus\.com/sitemap-index\.xml$" public/robots.txt && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - File `public/_redirects` exists
    - `public/_redirects` matches line `/work    /#projects    301` (whitespace-tolerant — grep -E `^/work[[:space:]]+/#projects[[:space:]]+301$`)
    - `public/_redirects` matches line `/work/   /#projects    301` (whitespace-tolerant)
    - `public/_redirects` does NOT contain the substring `www.` anywhere (D-04 www→apex must NOT be in this file — Pitfall 1)
    - File `public/robots.txt` exists
    - `public/robots.txt` contains exact line `User-agent: *`
    - `public/robots.txt` contains exact line `Allow: /`
    - `public/robots.txt` contains exact line `Sitemap: https://tanyazakus.com/sitemap-index.xml` (production hostname, NOT the preview URL)
    - Neither file contains emoji characters
  </acceptance_criteria>
  <done>
    Both files exist with the exact content above, pass the grep verification, and are staged for commit.
  </done>
</task>

<task type="auto">
  <name>Task 3: Create cspell.json with project dictionary</name>
  <files>cspell.json</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md (sections: "Pattern 6: Pre-launch QA tooling → cspell — spelling review" and "Code Examples → Example 4", and "Pitfall 6: cspell flags every proper noun on the site") — authoritative content + dictionary
    - .planning/phases/06-deployment/06-PATTERNS.md (section: "`cspell.json` (NEW — recommended)") — JSON schema, ignorePaths rationale
    - Existing repo root configs for placement (`astro.config.mjs`, `package.json`, `.prettierrc` — cspell.json sits alongside)
  </read_first>
  <action>
    Create `cspell.json` at the repo root (NOT inside `public/`, NOT inside `.planning/`). This is a tooling config consumed by `npx cspell` (Plan 02 runs it). Per RESEARCH.md Pitfall 6, ship the project dictionary up-front so the first run is signal, not noise. `.planning/` is in `ignorePaths` so plan/research docs don't pollute the spelling-review signal.

    Exact content (JSON; trailing newline required):
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
        "tushar",
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

    Note: Plan 02 may extend the `words` array if `npx cspell "src/**/*.{mdx,astro,md}" "README.md"` flags additional legit project-specific proper nouns (case study names, project codenames, etc.). That iteration belongs to Plan 02 Task 2, not here.
  </action>
  <verify>
    <automated>test -f cspell.json && python3 -c "import json; d=json.load(open('cspell.json')); assert d['version']=='0.2', 'wrong version'; assert 'tanyazakus' in d['words'], 'missing tanyazakus'; assert 'Fontshare' in d['words'], 'missing Fontshare'; assert '.planning' in d['ignorePaths'], 'missing .planning ignore'; assert 'node_modules' in d['ignorePaths'], 'missing node_modules ignore'; print('OK')"</automated>
  </verify>
  <acceptance_criteria>
    - File `cspell.json` exists at repo root
    - Valid JSON (`python3 -c "import json; json.load(open('cspell.json'))"` exits 0)
    - `version` field equals `"0.2"`
    - `language` field equals `"en"`
    - `words` array includes at minimum: `tanyazakus`, `Tanya`, `Zakus`, `Astro`, `Fontshare`, `Satoshi`, `Tushar`, `FOUC`, `Cloudflare`, `Lighthouse`, `preconnect`, `srcset`, `WebP`, `AVIF`
    - `ignorePaths` array includes at minimum: `node_modules`, `dist`, `.astro`, `.planning`
  </acceptance_criteria>
  <done>
    `cspell.json` exists at repo root with valid JSON containing the required dictionary and ignore-paths, and is staged for commit.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| public internet → Cloudflare edge | HTTPS request from any visitor; Cloudflare terminates TLS |
| Cloudflare edge → static asset | Edge reads `_headers` and `_redirects` from `dist/` (build output of `public/`) |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-06-01 | Tampering | Embedded site in third-party iframe (clickjacking) | MEDIUM | mitigate | Task 1 — `X-Frame-Options: DENY` in `public/_headers` on `/*` |
| T-06-02 | Tampering | MIME-type sniffing attacks against served assets | LOW | mitigate | Task 1 — `X-Content-Type-Options: nosniff` in `public/_headers` on `/*` |
| T-06-03 | Information Disclosure | Excessive referrer leakage when visitor clicks outbound LinkedIn/Instagram | LOW | mitigate | Task 1 — `Referrer-Policy: strict-origin-when-cross-origin` in `public/_headers` on `/*` (preserves analytics utility while not leaking full path) |
| T-06-04 | Tampering | HTTPS downgrade / MITM via plain-HTTP first request | MEDIUM | mitigate | Task 1 — `Strict-Transport-Security: max-age=31536000; includeSubDomains` in `public/_headers` on `/*`. Cloudflare "Always Use HTTPS" (Plan 03) is the complementary control. `preload` intentionally deferred (one-way commitment per RESEARCH.md Pattern 2 notes). |
| T-06-05 | Elevation of Privilege | Hostname-permission feature abuse (camera, geolocation, etc. via embedded scripts) | LOW | mitigate | Task 1 — `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()` in `public/_headers` on `/*` |
| T-06-06 | Tampering | Open-redirect via `_redirects` typo / wildcard misuse | LOW | accept | Task 2 — all redirect destinations are same-origin paths (`/#projects`); no `:splat` interpolation into hostnames. Audit: `grep -E "https?://" public/_redirects` returns zero matches in the destination column. |
| T-06-07 | Tampering | XSS via reflected URL params or untrusted MDX content | LOW | accept | Astro escapes by default; no `set:html` with untrusted input in this codebase. CSP would be defense-in-depth; deferred to v2 hardening per CONTEXT (Option A in RESEARCH.md Pattern 3). |
| T-06-08 | Information Disclosure | Crawlers indexing the preview URL alongside production | LOW | accept | Cloudflare Pages auto-applies `X-Robots-Tag: noindex` to `*.pages.dev` preview URLs [VERIFIED: RESEARCH.md Pattern 7 + Pitfall 7]. `robots.txt` Sitemap pointer is the apex hostname only. |

**ASVS L1 mapping:**
- V9 (Communication) — HSTS via `_headers` ✓
- V14 (Configuration) — Security headers via `_headers`; Cloudflare dashboard hardening (Plan 03) ✓
- V5 (Input Validation) — N/A (no user input)
- V2/V3/V4 (Auth/Session/Access Control) — N/A (public static site)
</threat_model>

<verification>
After all three tasks complete:

```bash
# All four launch-prep files exist
test -f public/_headers && test -f public/_redirects && test -f public/robots.txt && test -f cspell.json && echo "All files present"

# Build still passes (none of these break Astro build)
npm run build

# Files made it into dist/ (Cloudflare's serving root)
test -f dist/_headers && test -f dist/_redirects && test -f dist/robots.txt && echo "Files reached dist/"
```

`cspell.json` does NOT need to land in `dist/` — it's a dev-time tooling config, not a served asset.
</verification>

<success_criteria>
- 4 files committed: `public/_headers`, `public/_redirects`, `public/robots.txt`, `cspell.json`
- `npm run build` succeeds
- All three `public/*` files exist in `dist/` after build (Cloudflare picks them up there)
- Grep acceptance criteria for all three tasks pass
- No regression: existing `dist/` artifacts (favicon, og-image, resume PDF, /_astro/*) still build cleanly
</success_criteria>

<output>
After completion, create `.planning/phases/06-deployment/06-01-SUMMARY.md` documenting:
- Files created (4)
- Lines added
- Why CSP was deliberately omitted (Option A — RESEARCH.md Pattern 3 + ASVS L1 sufficient without it)
- Why HSTS `preload` was omitted (one-way decision)
- Pointer to Plan 02 (QA gates) as the next step
</output>
