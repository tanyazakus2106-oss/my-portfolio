# Phase 6: Deployment — Pattern Map

**Mapped:** 2026-05-12
**Files analyzed:** 13 (5 NEW + 5 MODIFY + 3 dashboard-only)
**Analogs found:** 5 / 10 in-repo files (3 NEW files have no analog; 2 dashboard items are out-of-repo)

---

## File Classification

| New / Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------------|------|-----------|----------------|---------------|
| `public/_redirects` (NEW, optional) | config (edge routing) | request-response (path rewrite) | `public/` static assets (`og-image.png`, `favicon.svg`, `tanya-zakus-designer-resume.pdf`) — same "drop-in static asset" pattern | partial — same delivery pipeline, but no existing edge-rules file in repo |
| `public/_headers` (NEW) | config (edge headers) | request-response (header injection) | `public/` static assets — same delivery pipeline | none in repo — net-new file shape |
| `public/robots.txt` (NEW) | config (crawler directive) | request-response (text response) | `public/` static assets — same delivery pipeline | none in repo |
| `cspell.json` (NEW) | config (tooling) | batch (CLI dictionary check) | `astro.config.mjs` — root-level config file pattern | partial — both are root configs; cspell.json is JSON not JS |
| `.cspell-words.txt` (NEW, optional) | config (dictionary) | batch | none | none — pure data file |
| `lychee.toml` (NEW, optional — only if planner picks config-file approach) | config (tooling) | batch | none | none — author flags inline instead |
| `astro.config.mjs:9` (MODIFY) | config (build) | n/a — one-line `site:` flip | self (in-place edit) | exact — D-06 changes one string |
| `README.md:5` (MODIFY) | docs (public) | n/a — one-line link flip | self | exact — D-07 changes one string |
| `src/layouts/BaseLayout.astro:22-23` (MODIFY, housekeeping) | layout (head meta) | n/a — fallback-string flip | self | exact — consistency edit |
| `.planning/STATE.md:79` (MODIFY, housekeeping) | docs (internal state) | n/a — line deletion | self | exact — retire stale blocker |
| `package.json` (MODIFY, optional) | config (npm scripts) | batch | self — add `audit:*` scripts following existing `dev/build/preview/typecheck/format` style | exact — extend existing scripts table |
| `src/layouts/BaseLayout.astro` head (MODIFY, conditional on perf-pass findings) | layout (head meta) | request-response | self — current `<head>` already follows pattern | exact |
| `astro.config.mjs` (MODIFY, conditional on Fonts API migration) | config (build) | build-time | self — current `integrations: [mdx(), sitemap()]` is the slot for `fonts: [...]` | exact |

**Dashboard-only work (out-of-repo, no analog possible):**
- Cloudflare Registrar checkout (purchase `tanyazakus.com`)
- Cloudflare Pages → Custom domains attach (apex + www)
- Cloudflare → Rules → Redirect Rules → `www → apex` 301 (D-04 mechanism)
- Cloudflare → SSL/TLS → Full (strict)

These are checklist items in PLAN.md, not files. The planner captures them as ordered manual steps.

---

## Pattern Assignments

### `astro.config.mjs:9` (MODIFY — D-06 cutover)

**Analog:** self (in-place edit). The pattern below is the current file, line 9 is the surgical change.

**Current state** (`astro.config.mjs` lines 1-15):
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://my-portfolio-8h7.pages.dev',
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: /** @type {any} */ ([tailwindcss()]),
  },
});
```

**Action:** Change line 9 only:
```diff
-  site: 'https://my-portfolio-8h7.pages.dev',
+  site: 'https://tanyazakus.com',
```

**Sequencing constraint (D-06):** Do NOT merge this change until `curl -vI https://tanyazakus.com` returns a 200 with valid cert. Pitfall 3 in RESEARCH.md.

**Coupling:** Drives `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, `<link rel="canonical">` (via BaseLayout `Astro.site`), and `<meta property="og:url">`. No further integration work.

---

### `README.md:5` (MODIFY — D-07 cutover)

**Analog:** self. Single-line edit in the same launch PR as `astro.config.mjs`.

**Current state** (`README.md` line 5):
```markdown
**Live site:** https://my-portfolio-8h7.pages.dev
```

**Action:**
```diff
-**Live site:** https://my-portfolio-8h7.pages.dev
+**Live site:** https://tanyazakus.com
```

---

### `src/layouts/BaseLayout.astro:22-23` (MODIFY — housekeeping)

**Analog:** self. Same launch PR as D-06 / D-07. Flagged by RESEARCH.md Runtime State Inventory.

**Current state** (`BaseLayout.astro` lines 22-23):
```typescript
const canonicalUrl = canonical ?? new URL(Astro.url.pathname, Astro.site ?? 'https://my-portfolio-8h7.pages.dev').href;
const absoluteOgImage = new URL(ogImage, Astro.site ?? 'https://my-portfolio-8h7.pages.dev').href;
```

**Action:** Flip both fallback strings to `https://tanyazakus.com` for consistency. The fallbacks are unreachable when `site:` is set in `astro.config.mjs`, but a future maintainer reading these lines should see the production URL, not stale preview-URL noise.

```diff
-const canonicalUrl = canonical ?? new URL(Astro.url.pathname, Astro.site ?? 'https://my-portfolio-8h7.pages.dev').href;
-const absoluteOgImage = new URL(ogImage, Astro.site ?? 'https://my-portfolio-8h7.pages.dev').href;
+const canonicalUrl = canonical ?? new URL(Astro.url.pathname, Astro.site ?? 'https://tanyazakus.com').href;
+const absoluteOgImage = new URL(ogImage, Astro.site ?? 'https://tanyazakus.com').href;
```

---

### `.planning/STATE.md:79` (MODIFY — housekeeping)

**Analog:** self. Same launch PR (or a separate housekeeping commit). Flagged in CONTEXT specifics + RESEARCH.md Pitfall 8.

**Current state** (`.planning/STATE.md` line 79, inside the Blockers/Concerns list):
```markdown
- Vercel Pro cost: Verify Pro plan billing before Phase 6 planning begins.
```

**Action:** Delete the line entirely. The blocker is superseded by Phase 1 D-02 and Phase 6 D-01. Grep `.planning/STATE.md` for "Vercel" after the edit — should return zero matches.

---

### `public/_redirects` (NEW — conditional on planner shipping legacy redirects)

**Analog:** No existing edge-rules file in repo. Closest analog by **delivery pipeline** is the `public/` static-asset bypass — files dropped in `public/` ship as-is via Astro build → Cloudflare Pages without any code-side processing.

**Existing public/ contents** (proves the bypass pattern):
```
public/favicon.ico            (810 bytes)
public/favicon.svg            (508 bytes)
public/og-image.png           (27,890 bytes)
public/tanya-zakus-designer-resume.pdf (173,328 bytes)
public/images/                (folder, case study covers)
```

**Pattern to copy from RESEARCH.md Code Example 1** (path-only redirects, hostname-level redirects are forbidden in this file per VERIFIED Cloudflare docs):

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

**Critical constraint (RESEARCH.md Anti-Patterns + Pitfall 1):** Do NOT add `www.tanyazakus.com` source rules to this file. Cloudflare Pages `_redirects` is path-only; hostname sources fail silently. The `www → apex` redirect (D-04) must be a Cloudflare Redirect Rule in the dashboard.

**Format conventions:**
- Plain text, two-space indented continuations not used (one rule per line).
- Comments start with `#`.
- No emojis (CLAUDE.md "No emojis in files" rule).

---

### `public/_headers` (NEW — recommended for launch)

**Analog:** None in repo. Same `public/` bypass pipeline as above. RESEARCH.md Code Example 2 is the authoritative pattern.

**Pattern to copy from RESEARCH.md Code Example 2:**

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

**Format conventions (VERIFIED Cloudflare docs):**
- First line of each rule is the path pattern, flush-left.
- Header lines are indented with **two spaces** (Cloudflare-specific syntax, NOT four spaces, NOT tabs).
- One header per line.
- Blank lines separate rule blocks.
- `Strict-Transport-Security` intentionally omits `preload` — adding `preload` is a one-way decision (RESEARCH.md note on HSTS preload).

**CSP scope decision driver** (RESEARCH.md Pattern 3): Option A (skip CSP entirely) is the recommended launch path. If the planner picks Option B (CSP with hashes), the two inline scripts in `BaseLayout.astro` that need sha256-hashing are:

1. **FOUC script** — `src/layouts/BaseLayout.astro:29-47`
2. **Async-font-loader script** — `src/layouts/BaseLayout.astro:88-93`

Both are `is:inline` scripts that must remain inline (FOUC script must run before paint; the font loader is trivially small).

---

### `public/robots.txt` (NEW — recommended)

**Analog:** None in repo. Same `public/` bypass pipeline.

**Pattern to copy from RESEARCH.md Code Example 3:**

```
User-agent: *
Allow: /

Sitemap: https://tanyazakus.com/sitemap-index.xml
```

**Notes:**
- Sitemap URL must reference the production apex hostname (matches D-06 `site:` value).
- Preview URL (`*.pages.dev`) gets `X-Robots-Tag: noindex` automatically by Cloudflare — no separate `robots.txt` needed for the preview deploy.
- Three lines, no maintenance.

---

### `cspell.json` (NEW — recommended)

**Analog by location:** `astro.config.mjs` at the repo root — both are tooling configs that gate `npm run`/`npx` commands. cspell.json is JSON instead of JS.

**Existing root-config pattern** (`astro.config.mjs`):
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
// ...
export default defineConfig({ /* ... */ });
```

**Pattern to copy from RESEARCH.md Code Example 4** (cspell.json schema, no analog in repo):

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

**Important:** `.planning/` is in `ignorePaths` so plan/research docs (which use many proper names) don't pollute the spelling-review signal.

---

### `package.json` (MODIFY — optional, audit scripts)

**Analog:** self. Current scripts block (lines 8-15):
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "typecheck": "astro check",
  "format": "prettier --write .",
  "astro": "astro"
}
```

**Pattern:** Short, single-purpose, one-line commands. Names lowercase, kebab-case avoided for the existing 5 (single words). For audit scripts, use `audit:*` namespace to keep the table readable:

**Proposed additions (planner's discretion):**
```json
"audit:links": "lychee dist/ --base https://tanyazakus.com --exclude-mail --exclude linkedin.com --exclude instagram.com --max-concurrency 10 --accept 200,206,429",
"audit:spell": "cspell \"src/**/*.{mdx,astro,md}\" \"README.md\"",
"audit:lighthouse": "lighthouse https://tanyazakus.com --preset=mobile --output html --output-path ./lighthouse-mobile-launch.html --quiet --only-categories=performance,accessibility,best-practices,seo"
```

**Tradeoff:** Adding these scripts requires either `npm install --save-dev cspell lighthouse` (toolchain bloat) or relying on `npx`/Homebrew at invocation (cleaner; matches RESEARCH.md recommendation to keep `package.json` lean). If the planner picks `npx`-only, do NOT add these scripts — document the one-liners in PLAN.md instead.

**README.md scripts table** (lines 31-37) — should be updated in lockstep IF scripts are added.

---

### `scripts/` folder additions (NEW — conditional, low likelihood)

**Analog:** `scripts/generate-favicon-ico.mjs` (the only existing entry in `scripts/`).

**Existing pattern** (`scripts/generate-favicon-ico.mjs` lines 1-23):
```javascript
// Usage: node scripts/generate-favicon-ico.mjs (run from repo root)
//
// Rasterizes public/favicon.svg into a multi-resolution Windows ICO file
// (16x16 + 32x32, PNG-compressed entries) and writes public/favicon.ico.
//
// Why a hand-rolled ICO packer instead of a dependency: [...]
//
// Re-run this script whenever public/favicon.svg changes.

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
```

**Conventions to copy if any new audit script lands:**
- `.mjs` extension (ESM, no transpile).
- Top-of-file `// Usage:` comment with the exact invocation.
- Rationale comment explaining "why this script exists in-repo instead of a dependency."
- Node built-ins prefixed `node:` (`node:fs`, `node:path`, `node:url`).
- Repo-root resolution via `fileURLToPath` + `path.resolve(__dirname, "..")`.
- Error handler at end: `main().catch((err) => { console.error(err); process.exit(1); });`

**Recommendation:** Phase 6 should NOT add a new audit script. The three QA tools (`lychee`, `cspell`, `lighthouse`) are invoked via `npx` / Homebrew; wrapping them in a `.mjs` script adds maintenance for zero benefit (RESEARCH.md "Don't Hand-Roll" table).

---

### `src/layouts/BaseLayout.astro` head (MODIFY — conditional on perf-pass findings)

**Analog:** self. The current `<head>` is the reference pattern; any addition must follow these conventions.

**Current head structure** (`BaseLayout.astro` lines 28-98):

| Lines | Element | Purpose |
|-------|---------|---------|
| 29-47 | `<script is:inline>` FOUC | Sets `.dark`/`.light` on `<html>` before paint — must stay first, must stay inline |
| 48-49 | charset + viewport | Standard `<meta>` |
| 50 | `<title>` | From `Astro.props.title` |
| 51 | description meta | Conditional |
| 52-53 | canonical link | D-22 — uses `canonicalUrl` |
| 55-62 | OG meta block | D-17 |
| 64-68 | Twitter Card | D-21 |
| 70-72 | favicon links | D-17, D-20 |
| 73-75 | preconnect to fonts.googleapis.com, fonts.gstatic.com, api.fontshare.com | Already optimized |
| 76-87 | async font stylesheets via `media="print"` + `data-async-style` | Already optimized |
| 88-93 | inline script to flip `media="print"` → `media="all"` on load | Render-blocking but tiny |
| 94-97 | `<noscript>` font fallback | Accessibility |

**Pattern for new head additions** (if Lighthouse pass demands them):
- Resource hints: `<link rel="preconnect" href="..." />` — already at lines 73-75. Add more only with measurement evidence (RESEARCH.md Anti-Patterns warns against preconnect overuse).
- Module preload: `<link rel="modulepreload" href="..." />` — add ONLY if Lighthouse flags `unused-javascript` or `unminified-javascript`.
- `<link rel="preload" as="image" ... fetchpriority="high">` for the LCP element — add ONLY if Lighthouse's `largest-contentful-paint-element` audit fails.

**Anti-pattern:** Adding head tags speculatively. Phase 5 D-01 + CLAUDE.md "surgical edits over refactors" both apply.

---

### `astro.config.mjs` integrations (MODIFY — conditional on Fonts API migration)

**Analog:** self. Current integrations slot:
```javascript
integrations: [mdx(), sitemap()],
```

**Pattern for adding the Astro 6 Fonts API** (per RESEARCH.md State of the Art + Open Question 2):
```javascript
import { fontProviders } from 'astro/config';
// ...
export default defineConfig({
  site: 'https://tanyazakus.com',
  output: 'static',
  integrations: [mdx(), sitemap()],
  experimental: {
    // NOT NEEDED in Astro 6.0+: fonts is stable, no experimental flag.
  },
  fonts: [
    {
      provider: fontProviders.google(),  // or fontshare() — verify in spike
      name: 'Inter',                      // CLAUDE.md design preference is Inter
      cssVariable: '--font-sans',
      weights: [400, 500, 700],
    },
    // ... Instrument Serif config
  ],
});
```

**Trigger:** Only if Lighthouse mobile baseline < 80 AND the failing audits are font-related (`uses-rel-preconnect`, `font-display`, `render-blocking-resources` on font CSS).

**Coupled changes if migrated:**
- Remove `<link rel="preconnect">` lines 73-75 in BaseLayout.
- Remove async font stylesheets at lines 76-87.
- Remove inline async-loader at lines 88-93.
- Remove `<noscript>` fallback at lines 94-97.
- Update `--font-sans` and `--font-serif` declarations in `src/styles/global.css:6-8` to reference the new auto-injected font-family or remove the manual declaration if Astro's Fonts API provides it.

**Estimated effort (RESEARCH.md A7):** 1-2 hours if Fontshare provider works; 3-4 hours if Satoshi requires `fontProviders.local()` (download + bundle WOFF2 files).

**Recommendation:** Defer unless Lighthouse fails on font audits. Pre-emptive migration is risk-without-evidence.

---

## Shared Patterns

### Pattern: `public/` static-asset bypass

**Source:** All existing `public/` files (`favicon.ico`, `favicon.svg`, `og-image.png`, `images/`, `tanya-zakus-designer-resume.pdf`).

**Apply to:** All three new files (`_redirects`, `_headers`, `robots.txt`).

**Rule:** Files placed in `public/` are copied verbatim to `dist/` at build time and served at the root URL. No Astro processing, no Vite bundling, no import statements needed. Cloudflare Pages then evaluates `_redirects` and `_headers` at the edge during request handling; `robots.txt` is served as a static file at `/robots.txt`.

**No-emoji rule (CLAUDE.md):** All three new files are plain-text and must not contain emoji characters. Comments use `#` (not `//`).

---

### Pattern: Atomic commits per concern (Phase 5 carry-over)

**Source:** Phase 5 close-out commits (`8b36c31 fix(05-07): iPhone-driven RESP-03 + NAV-05 fixes`, `234070a docs(05-07): audit matrix signed off + plan summary (7/7)`, `2305014 docs(phase-05): complete phase 5 responsive design`).

**Apply to:** All Phase 6 commits. Recent commit log shows one logical concern per commit, prefixed with type (`fix`, `docs`, `feat`).

**Recommended Phase 6 commit sequencing:**
1. `chore(06): add public/_headers and public/robots.txt`
2. `chore(06): add public/_redirects for legacy /work route`
3. `chore(06): add cspell.json with project dictionary`
4. `docs(state): retire stale Vercel Pro blocker .planning/STATE.md`
5. *(perf-pass commits — only if Lighthouse fails: one commit per fix)*
6. `feat(06): production domain cutover — site URL + README + BaseLayout fallbacks` (the launch PR — combines D-06 + D-07 + housekeeping in BaseLayout)
7. `docs(06): commit Lighthouse mobile launch report`

---

### Pattern: D-XX decision references in comments / commits

**Source:** `src/layouts/BaseLayout.astro` already uses `{/* Canonical URL (D-22) */}`, `{/* Open Graph (D-17) */}`, `{/* Favicon (D-17, D-20) */}` (lines 52, 55, 64, 70). Phase 5 commits include `RESP-03`, `NAV-05` codes.

**Apply to:** Phase 6 inline comments and commit messages should reference D-01 through D-07 from `06-CONTEXT.md` where the change is implementing a locked decision.

Example: A commit message for the launch PR could reference `D-06` and `D-07`; an inline comment in `public/_redirects` could note `# D-04 enforced via Cloudflare Redirect Rules (dashboard), NOT here.`

---

### Pattern: TypeScript-checked config files via JSDoc

**Source:** `astro.config.mjs:1` (`// @ts-check`) and `astro.config.mjs:12-13` (`/** @type {any} */ ([tailwindcss()])`).

**Apply to:** Any new `.mjs` script in `scripts/`. Use `// @ts-check` at the top + JSDoc type annotations rather than introducing `.ts` build tooling.

---

## No Analog Found

Files with no close in-repo match (planner uses RESEARCH.md code examples directly):

| File | Role | Data Flow | Reason | Reference |
|------|------|-----------|--------|-----------|
| `public/_redirects` | edge routing config | request-response | No existing edge-routing file in repo — Phase 6 is the first to ship one | RESEARCH.md Code Example 1 (Pattern 1) |
| `public/_headers` | edge header config | request-response | No existing edge-header file in repo — net-new file shape | RESEARCH.md Code Example 2 (Pattern 2) |
| `public/robots.txt` | crawler directive | request-response | No existing crawler directive in repo | RESEARCH.md Code Example 3 (Pattern 7) |
| `cspell.json` | tooling config | batch | No existing JSON-format root config in repo (astro.config.mjs is JS) | RESEARCH.md Code Example 4 |

All four use RESEARCH.md examples verbatim. The "no analog" classification is **expected and correct** for Phase 6 — this is the launch phase that introduces the edge-config layer for the first time.

---

## Dashboard-Only Work (No Code Analog Possible)

Captured for PLAN.md as ordered manual steps. RESEARCH.md Pattern 4 has the full sequence.

| Step | Surface | Action |
|------|---------|--------|
| 1 | Cloudflare Registrar | Purchase `tanyazakus.com` (~$8/yr) |
| 2 | Cloudflare Pages → Custom domains | Attach `tanyazakus.com` (apex) |
| 3 | Cloudflare Pages → Custom domains | Attach `www.tanyazakus.com` |
| 4 | Cloudflare → wait | Universal SSL provisioning (5-30 min typical) |
| 5 | Cloudflare → SSL/TLS → Overview | Set encryption mode = **Full (strict)** |
| 6 | Cloudflare → Rules → Redirect Rules | Create rule: hostname `www.tanyazakus.com` → 301 to `https://tanyazakus.com` (preserve path + query) |
| 7 | Verify | `curl -vI https://tanyazakus.com` → 200 with valid cert, then `curl -I https://www.tanyazakus.com` → 301 |
| 8 | Open launch PR | Includes D-06 (`astro.config.mjs:9`), D-07 (`README.md:5`), BaseLayout fallbacks, STATE.md cleanup |
| 9 | Merge | Cloudflare Pages auto-deploys; sitemap regenerates with `tanyazakus.com` URLs |
| 10 | Post-merge verify | Sitemap absolute URLs, canonical tags, OG `og:url` all reflect production hostname |

**No file analog applies** — this is out-of-repo state living in the Cloudflare dashboard. PLAN.md captures it as a checklist.

---

## Metadata

**Analog search scope:**
- Repo root: `astro.config.mjs`, `package.json`, `README.md`, `.prettierrc`
- `public/` static asset folder (4 files + 1 directory)
- `src/layouts/BaseLayout.astro` (full head structure read once, lines 1-106)
- `src/styles/global.css` (font tokens, lines 6-8)
- `scripts/generate-favicon-ico.mjs` (only existing scripts/ entry)
- `.planning/STATE.md` (housekeeping target, lines 70-95)

**Files scanned in-repo:** 8 files read in full or by targeted Read; 1 Bash listing of `public/`; 1 Grep for font tokens in `global.css`.

**Files NOT analyzed (no Phase 6 pattern relevance):**
- `src/components/*` — perf pass is unlikely to touch components (Phase 5 D-06 already addressed image surfaces)
- `src/content/projects/*.mdx` — content layer not in scope for Phase 6
- `src/pages/*.astro` — routing not in scope

**Pattern extraction date:** 2026-05-12
**Phase:** 06-deployment
