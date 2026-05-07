# Phase 4: About, Contact & SEO - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Three deliverables:

1. **About page** — A new `src/pages/about.astro` that 404s today. Hero photo + confident intro + "How I Work" + "Beyond Work" sections. Communicates bio, design philosophy, and availability in Tanya's voice.
2. **Resume + LinkedIn wiring** — Replace placeholder URLs in `Header.astro` and `Footer.astro` with real values. Drop a static Resume PDF into `public/` with a descriptive filename. Tanya provides the PDF.
3. **SEO meta across every page** — Extend `BaseLayout.astro` with Open Graph, Twitter Card, canonical, and favicon link tags. Add per-page `title` and `description` props on every page (homepage, About, case study dynamic route).

**Not in scope (per requirements):**
- No dedicated Contact page — `mailto:` from Footer + About suffices (CONT-01).
- No contact form with backend (out of scope per REQUIREMENTS.md).
- No Lighthouse performance work (SEO-05 lives in Phase 6).
- No responsive QA pass (Phase 5 covers).

**Asset dependencies (Tanya provides; Phase 4 wires up):**
- Resume PDF (e.g., `tanya-zakus-designer-resume.pdf`)
- About hero photo
- Site-wide OG image (1200×630)
- Tanya-branded favicon (replace existing `public/favicon.ico` + `favicon.svg`)

If any asset is missing at execution time, the planner inserts a clearly-marked placeholder so the site still builds and the wiring is verifiable.

</domain>

<decisions>
## Implementation Decisions

### About Page Structure & Tone

- **D-01:** Structure follows `https://www.tushar.work/about` minus the Speaking and Press & Recognition sections. Resulting 4-block skeleton:
  1. Hero photo (full-width, prominent)
  2. Hero headline + intro paragraphs (with "Now" availability eyebrow above)
  3. "How I Work" section
  4. "Beyond Work" section

- **D-02:** Page layout — single centered column. Content measure ~760–800px (matches Phase 3 D-12 case study layout). Wraps in `BaseLayout.astro`. No sidebar.

- **D-03:** Hero photo treatment — full-width within the content column, prominent position (top of page, below header, before intro text). Aspect ratio: wider than tall (recommend 16:9 or 3:2) to match the visual rhythm of case study hero images. Use Astro's `<Image>` component for optimization (WebP, responsive srcset). **Asset dependency: Tanya provides photo.**

- **D-04:** Page length — short, ~1 screen on desktop. Compress tushar.work's 3-paragraph blocks to **1–2 sentences each**. Total page word count: ~150–250 words.

- **D-05:** Voice mix — **confident hero, warm body**:
  - Hero headline + intro: confident, no greeting (matches Phase 3 D-02 homepage hero pattern). Direct statement of who Tanya is and what she does.
  - "How I Work" + "Beyond Work" body: warmer, first-person, conversational. Reveals personality.

- **D-06:** Availability statement — **small "Now" eyebrow above the hero headline**, small-caps + letter-spacing styling. Reuses Phase 3 D-14 small-caps muted-label pattern. Example treatment:
  ```
  NOW — OPEN TO FULL-TIME & FREELANCE
  Tanya Zakus, UX/UI designer for [...]
  ```

- **D-07:** Section heading typography — "How I Work" and "Beyond Work" headings use **title case + medium weight + body color** (matches tushar.work reference). **Distinct from** the small-caps muted style used for the "Now" eyebrow and Phase 3 case study Problem/Process/Outcome labels. The hierarchy is:
  - Small-caps muted → meta/eyebrow labels
  - Title-case medium → section headings on About
  - Phase 3 small-caps muted → case study section labels (different page type)

- **D-08:** About page content (bio, philosophy, "Beyond Work" details) — **placeholder copy drafted by the planner, refined by Tanya post-execution**. Same pattern as Phase 3 D-17 placeholder MDX. Planner writes confident, specific drafts (not generic "I design beautiful experiences" filler).

- **D-09:** **No additional contact CTA on the About page itself** (Claude's discretion default applied — user did not select this gray area for discussion). Reasoning: Footer already carries the bold "Let's work together" CTA + email/social icons (Phase 2 D-13). Adding another CTA on About would be duplicative. Footer mailto satisfies CONT-01 ("from footer and/or About page").

### Resume + LinkedIn Wiring

- **D-10:** Resume PDF — **static file in `public/` with a descriptive filename**. Recommended: `public/tanya-zakus-designer-resume.pdf`. Matches the tushar.work pattern (`tushar-gupta-designer-resume.pdf`). Tanya replaces the file and pushes when she updates her resume. **Asset dependency: Tanya provides PDF.**

- **D-11:** Resume link in nav opens in a **new tab**. Update `Header.astro` line 8–9 to:
  ```ts
  { href: '/tanya-zakus-designer-resume.pdf', label: 'Resume', external: true },
  ```
  Setting `external: true` triggers the existing `target="_blank"` + `rel="noopener noreferrer"` logic in `Header.astro:33`. Same change applies to `Footer.astro` navLinks. Update `MobileNav.astro` if it has its own nav array.

- **D-12:** LinkedIn URL = **`https://www.linkedin.com/in/tanya-zakus/`**. Replaces the placeholder `https://linkedin.com` in:
  - `Header.astro:10` (`links[3].href`)
  - `Footer.astro:10` (`LINKEDIN_URL` constant)
  - `MobileNav.astro` if it has its own LinkedIn link

- **D-13:** Instagram link kept and wired to **`https://www.instagram.com/tania_zakus`**. The user-provided URL had QR-share tracking params (`?igsh=...&utm_source=qr`) — these are stripped. Replaces the placeholder `https://instagram.com` in `Footer.astro:11` (`INSTAGRAM_URL` constant). The Instagram `<li>` in `Footer.astro:33-47` stays as-is.

- **D-14:** Email/mailto unchanged — Footer's existing `mailto:tanyazakus2106@gmail.com` (Phase 2 D-13/D-14) satisfies CONT-01. No new wiring needed.

- **D-15:** External-link attributes — all external destinations (LinkedIn, Instagram, Resume) use `target="_blank"` + `rel="noopener noreferrer"`. Pattern is consistent across Header.astro, Footer.astro, and MobileNav.astro. No mixed behavior.

### SEO Meta Strategy

- **D-16:** Implementation pattern — **pass-through props on `BaseLayout.astro`**. Extend the existing `Props` interface (currently lines 6–9) with new optional props:
  ```ts
  interface Props {
    title?: string;
    description?: string;
    ogImage?: string;       // path to OG image, defaults to /og-image.png
    ogType?: 'website' | 'article';  // defaults to 'website'
    canonical?: string;     // absolute URL; if omitted, derived from Astro.url
  }
  ```
  No new SEO component, no new dependency. Keeps the change surgical.

- **D-17:** `BaseLayout.astro` `<head>` adds the following meta tags (rendered between line 41 `<title>` and line 43 `<link rel="preconnect">`):
  - **OG**: `og:title`, `og:description`, `og:image`, `og:type`, `og:url`, `og:site_name="Tanya Zakus"`
  - **Twitter**: `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`
  - **Canonical**: `<link rel="canonical" href={...}>`
  - **Favicon**: `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` + `<link rel="icon" type="image/x-icon" href="/favicon.ico">`

- **D-18:** OG image strategy — **single site-wide image** at `public/og-image.png`, dimensions 1200×630px. Used as the default value for the `ogImage` prop in BaseLayout. Every page inherits unless it overrides explicitly. **Asset dependency: Tanya provides OG image.** If absent at build, planner inserts a placeholder Tanya-branded card (see D-26).

- **D-19:** Per-page SEO content — every page passes explicit `title` and `description` props:
  - **Homepage** (`src/pages/index.astro`): `title="Tanya Zakus — UX/UI Designer"`, `description=` (1-sentence summary of portfolio focus)
  - **About** (`src/pages/about.astro`): `title="About — Tanya Zakus, UX/UI Designer"`, `description=` (1-sentence about-the-designer summary)
  - **Case study dynamic route** (`src/pages/projects/[id].astro`): `title={`${project.data.title} — Tanya Zakus, UX/UI Designer`}`, `description={project.data.summary}` (reuses the existing `summary` frontmatter field)

  All titles include "Tanya Zakus" + "UX/UI Designer" per SEO-01.

- **D-20:** Favicon — **replace existing `public/favicon.ico` and `public/favicon.svg`** with Tanya-branded files. **Asset dependency: Tanya provides favicons.** If absent, planner generates a placeholder "tz" mark matching the existing inline `Header.astro:23` `.tz-logo` SVG. BaseLayout link tags work for both placeholder and real assets — no markup change needed when Tanya swaps files later.

- **D-21:** Twitter Card — `summary_large_image` (matches the 1200×630 OG image). Single `twitter:card` meta. Twitter's crawler falls back to `og:image` when `twitter:image` is absent, so duplicating is optional but recommended for explicit safety.

- **D-22:** Canonical URL implementation — uses Astro's site config. If `astro.config.mjs` is missing the `site:` field, planner adds it (e.g., `site: 'https://tanyazakus.com'` — placeholder if real domain not yet decided). Canonical for each page is `new URL(Astro.url.pathname, Astro.site).href`. This also allows `og:url` to be absolute.

### Claude's Discretion

- Exact About hero copy — planner drafts confident headline + intro paragraphs; Tanya refines by editing the `.astro` file.
- Exact "How I Work" / "Beyond Work" body copy — planner drafts; Tanya refines.
- Exact `description` values per page — planner drafts ≤160 chars each; Tanya refines.
- About hero photo aspect ratio (recommend 16:9 or 3:2; planner can adjust based on photo Tanya provides).
- Whether to add `<meta name="theme-color">` (small enhancement; planner decides).
- Whether to add `<link rel="apple-touch-icon">` (only if Tanya provides a 180×180 PNG; otherwise skip).
- Exact CSS approach for the "Now" eyebrow (existing eyebrow utility class vs. inline). Match existing pattern in case study small-caps labels.
- The `og:locale="en_US"` meta inclusion (small enhancement).
- Real production domain for `astro.config.mjs site:` — placeholder if not yet decided.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project constraints and stack
- `CLAUDE.md` — Tech stack, JS budget, design preferences, deploy target (Cloudflare Pages, fully static), no-CMS constraint, current typography state (Satoshi + Instrument Serif)

### Phase requirements
- `.planning/REQUIREMENTS.md` — ABOUT-01, ABOUT-02, ABOUT-03, CONT-01, CONT-02, CONT-03, SEO-01, SEO-02, SEO-03, SEO-04
- `.planning/ROADMAP.md` §Phase 4 — Goal, success criteria, dependency on Phase 3

### Phase 1 decisions (inherit — design tokens + layout shell)
- `.planning/phases/01-foundation/01-CONTEXT.md` — D-06 (typography weights), D-07 (spacing scale), D-08 (color system light + dark), D-11 (BaseLayout layout shell, max-width 1200px, page padding), D-13 (landmark regions), D-15 (`<html lang="en">` + viewport meta)
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Authoritative token values

### Phase 2 decisions (inherit — header/footer pattern + tokenized styling)
- `.planning/phases/02-navigation-design-system/02-CONTEXT.md` — D-13 (footer "Let's work together" CTA), D-14 (email = `tanyazakus2106@gmail.com`), D-17 (token-only styling, no hardcoded values), D-19 (4px spacing scale)

### Phase 3 decisions (inherit — page layout + small-caps labels + animation)
- `.planning/phases/03-work-index-case-studies/03-CONTEXT.md` — D-02 (confident hero tone, no greeting), D-12 (single centered column ~760-800px), D-14 (small-caps muted section labels), D-17 (placeholder content + asset-dependency pattern), D-18–D-23 (scroll animations, prefers-reduced-motion)

### External design references
- `https://www.tushar.work/about` — About page structural reference (4-block skeleton: hero photo → intro → "How I Work" → "Beyond Work", minus Speaking + Press & Recognition)
- `https://www.tushar.work/tushar-gupta-designer-resume.pdf` — Static-PDF + descriptive-filename pattern for resume hosting

### Existing code to extend
- `src/layouts/BaseLayout.astro` — Single source of truth for SEO meta. Extend `Props` interface (lines 6–9) and `<head>` block (lines 19–68). Add OG, Twitter Card, canonical, favicon link tags.
- `src/components/Header.astro` — Lines 6–11 hold the `links` array. Update Resume `href` to descriptive filename + `external: true`, update LinkedIn `href` to real URL.
- `src/components/Footer.astro` — Lines 9–11 hold the `EMAIL`, `LINKEDIN_URL`, `INSTAGRAM_URL` constants and the `navLinks` array. Update LinkedIn + Instagram URLs + Resume nav entry.
- `src/components/MobileNav.astro` — Likely has its own nav link list. Apply identical updates as Header.astro.
- `src/content.config.ts` — Project schema; case study route uses `summary` frontmatter for SEO description.
- `astro.config.mjs` — Add or verify `site:` field (canonical URLs depend on this).

### Existing static assets to extend or replace
- `public/favicon.ico` + `public/favicon.svg` — present but possibly default/un-Tanya-branded; replace with Tanya-branded files (D-20)
- `public/` — drop in: `tanya-zakus-designer-resume.pdf`, `og-image.png` (1200×630), updated `favicon.ico` + `favicon.svg`, optionally `apple-touch-icon-180.png`

### Project context
- `.planning/PROJECT.md` — Core value, no-CMS constraint, clean/minimal aesthetic
- `.planning/STATE.md` — Project state, prior decisions log

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **`BaseLayout.astro` `Props` interface** (lines 6–9) — already accepts `title` and `description`. Extend rather than rewrite for SEO meta.
- **Astro `<Image>` component** — already in use for case study thumbnails; reuse for the About hero photo (WebP optimization, responsive srcset).
- **Footer `footer-icon-btn` class** (Footer.astro:88–107) — reusable styled icon-link pattern; LinkedIn/Instagram/email already use it.
- **Phase 3 small-caps eyebrow pattern** (Phase 3 D-14) — reuse for the "Now" availability eyebrow on About.
- **Phase 3 single-column layout** (Phase 3 D-12, ~760–800px) — reuse for the About page content measure.
- **`Header.astro:10` external-link logic** — `external: true` already triggers `target="_blank"` + `rel="noopener noreferrer"`. Reuse for Resume.

### Established Patterns

- **All styling via design tokens** — `var(--color-*)`, `var(--spacing-*)` only (Phase 2 D-17). Hard rule.
- **External links** — always `target="_blank"` + `rel="noopener noreferrer"` (Header.astro:33, Footer.astro footer-icon-btn).
- **Placeholder content + asset-dependency** — Phase 3 used this pattern for case study MDX. Phase 4 applies it to About copy + the four asset dependencies (Resume, hero photo, OG image, favicon).
- **Page = `.astro` file in `src/pages/`** — About becomes `src/pages/about.astro` wrapping `<BaseLayout>`.
- **Title fallback in BaseLayout** (line 12) — currently defaults to `"Tanya Zakus — UX/UI Designer"`. Per-page passes override; missing pages still get a sensible default.

### Integration Points

- **`src/pages/about.astro`** — new file; the `/about` link in nav currently 404s.
- **`src/layouts/BaseLayout.astro`** — extends `Props` + `<head>`; every page benefits from new SEO meta with no per-page change beyond passing props.
- **`src/pages/index.astro`** — needs `description` + `ogImage` props passed (currently uses BaseLayout default title only).
- **`src/pages/projects/[id].astro`** (or whatever the dynamic case study route is named) — passes per-project `title` + `description` + `ogImage` props.
- **`astro.config.mjs`** — `site:` field needed for canonical URLs and absolute `og:url`.
- **`public/`** — receives 4 new/replaced static assets.

</code_context>

<specifics>
## Specific Ideas

- **Tushar.work compression rule** — Tushar's bio is 3 paragraphs per block; we compress to **1–2 sentences per block** to honor the "short ~1 screen" length while keeping the same structural skeleton. Voice density goes up; structure stays.
- **"Now" eyebrow exact treatment** — small-caps + letter-spacing matching Phase 3 case study labels. Suggested copy: `NOW — OPEN TO FULL-TIME & FREELANCE` (or with the em-dash replaced by a middle-dot if the eyebrow util uses that).
- **Hero headline draft direction** — Confident, specific, NOT generic. Bad: "I design beautiful experiences." Good: "Tanya Zakus — UX/UI designer building [specific kind of product] for [specific kind of company/user]." Match Phase 3 D-04 hero-copy guidance.
- **"How I Work" 1–2 sentences** — design philosophy + working style. Example direction: how she approaches problems, what she values in a process, what kinds of teams she thrives in.
- **"Beyond Work" 1–2 sentences** — humanizing personal interests outside design. Example direction: hobbies, what she's curious about, what she's learning. Tushar uses tennis + cooking + indie SwiftUI apps — same template applies.
- **OG image visual direction (placeholder if Tanya doesn't provide)** — minimal type-driven card matching site typography. Center: name + "UX/UI Designer". Accent color present. NOT a logo treatment. Readable at small sizes (LinkedIn preview is ~520×270 visible).
- **Favicon visual direction (placeholder if Tanya doesn't provide)** — simple "tz" mark matching the inline SVG already in `Header.astro:23` `.tz-logo`. Could be exported from that markup.
- **Description copy guidance** — keep under 160 characters per page (Google snippet limit). Active voice. Mention "UX/UI designer" + a noun describing the page (portfolio / case studies / about).
- **Canonical site URL placeholder** — if no production domain decided, planner uses `https://tanyazakus.com` as a placeholder in `astro.config.mjs site:`. Tanya updates before launch (Phase 6 DEPLOY-03).
- **Resume filename SEO benefit** — descriptive filename (`tanya-zakus-designer-resume.pdf`) means saved/forwarded copies carry Tanya's name in the filename. Small but meaningful for recruiter workflows.

</specifics>

<deferred>
## Deferred Ideas

- **Per-case-study OG images** with project name + accent color — would require a build-step image generator. Belongs in v2 polish, not v1.
- **HTML resume page** in addition to the PDF — better SEO and screen-reader accessibility. Maps to V2-CONT-02 area.
- **Apple touch icon at multiple sizes** (76, 120, 152, 167) — modern iOS/Android scale a 180px well; multi-size is rarely needed.
- **Twitter handle in `twitter:site` meta** — only meaningful if Tanya creates a professional Twitter/X account.
- **JSON-LD structured data** (Person schema for About, CreativeWork for case studies) — improves Google rich results. Not in scope; could move to v2 SEO polish.
- **Analytics integration** (Plausible) — tracked under V2-FEAT-03.
- **`prefers-color-scheme` for OG image** (a dark-mode OG variant) — Twitter and LinkedIn don't render different OG images by client theme; not worth the asset duplication.
- **Footer "© 2026 Tanya Zakus" auto-updating year** — the literal `2026` in `Footer.astro:81` will go stale next year. Could be auto-derived from `new Date().getFullYear()`. Surgical change; can be folded into Phase 4 if executor sees it (minor scope creep, ~2 lines), or deferred. Not a Phase 4 requirement.

</deferred>

---

*Phase: 04-about-contact-seo*
*Context gathered: 2026-05-07*
