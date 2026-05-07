# Phase 4: About, Contact & SEO - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `04-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 4-about-contact-seo
**Areas discussed:** About page structure & tone, Resume + LinkedIn wiring, SEO meta strategy
**Areas left to Claude's discretion:** Contact pattern on About page

---

## Area 1: About Page Structure & Tone

### Q1: What structure should the About page use?

| Option | Description | Selected |
|--------|-------------|----------|
| Long-form essay | One flowing column of prose; bio + philosophy + availability woven together. Most warmth. | |
| Sectioned (Bio \| Philosophy \| Now) | Three labeled sections with mini-headings. Scannable for recruiters. | |
| Hero + supporting blocks | Confident one-line hero, then 2-3 supporting blocks. Most consistent with rest of site. | |
| Other (free text) | — | ✓ |

**User's choice:** "Same as here https://www.tushar.work/about, but remove Speaking and Press & Recognition sections."

**Captured:** External reference URL fetched via WebFetch and structurally analyzed. Resulting 4-block skeleton: hero photo → headline + intro paragraphs → "How I Work" → "Beyond Work". Reference URL added to canonical_refs.

---

### Q2: Should the About page include a photo of Tanya?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — prominent photo | Clear photo (portrait or environmental). Adds humanity. Standard for designer portfolios. | ✓ |
| Yes — small/subtle photo | Small avatar-sized photo. Compromise option. | |
| No photo | Pure typography + content. More minimal. | |

**User's choice:** Yes — prominent photo

---

### Q3: How long should the About page be?

| Option | Description | Selected |
|--------|-------------|----------|
| Short (~1 screen) | ~100–200 words. Tight statement. Reads in <30s. Matches "minimal" brand. | ✓ |
| Medium (~2-3 scrolls) | 300–500 words. Bio + philosophy + now without padding. Recommended sweet spot. | |
| Long (essay-depth) | 600+ words. Rich personal essay. Best for senior roles. | |

**User's choice:** Short (~1 screen)

**Notes:** Tension surfaced — tushar.work reference is medium-length but user wants short. Resolved by keeping the structural skeleton and compressing each block to 1-2 sentences.

---

### Q4: What voice should the About page use?

| Option | Description | Selected |
|--------|-------------|----------|
| Confident / direct (matches hero) | Same voice as homepage hero. Statements not stories. Recruiter-friendly. | |
| Warm / personal | First-person, conversational. Storytelling. Best for freelance prospects. | |
| Mix — confident hero, warm body | Confident hero, body relaxes into warmer voice. Recommended — best of both. | ✓ |

**User's choice:** Mix — confident hero, warm body

---

### Q5 (follow-up): Where should the availability statement live?

Asked because tushar.work has no Now/availability section but ABOUT-02 requires one.

| Option | Description | Selected |
|--------|-------------|----------|
| In the intro headline | Bake availability into the lead headline. One line, immediate. | |
| Inline in the intro paragraph | Mention in first/last sentence of intro. Subtler than headline. | |
| Small "Now" callout above intro | Small-caps eyebrow above hero headline. Reuses Phase 3 case-study eyebrow pattern. Most prominent without taking real estate. | ✓ |
| Small "Currently" line below intro | Italic/muted line at end of intro paragraphs. Quieter. | |

**User's choice:** Small "Now" callout above intro

---

## Area 2: Resume + LinkedIn Wiring

### Q1: Where should the Resume PDF live?

Originally three options presented; user asked for clarification on what tushar.work uses. After fetching `https://www.tushar.work/tushar-gupta-designer-resume.pdf` and identifying the pattern (static file in /public/ with descriptive filename), user locked the same approach without re-asking.

| Option | Description | Selected |
|--------|-------------|----------|
| Static file in /public/resume.pdf | Drop PDF into public/. Update by replacing file + push. Self-hosted. | ✓ |
| External host (Drive/Notion/Dropbox) | Link to external URL. Update without redeploy. External dependency. | |
| HTML resume page + PDF download | Build /resume as actual HTML page. More work, more SEO value. Could be V2. | |

**User's choice:** Static file in /public/ with descriptive filename (matches tushar.work pattern)

**Notes:** Recommended filename `tanya-zakus-designer-resume.pdf` — descriptive filename gives small SEO + recruiter-workflow benefit (saved file carries Tanya's name).

---

### Q2: What's the real LinkedIn URL?

| Option | Description | Selected |
|--------|-------------|----------|
| I'll type it in (use Other) | Paste actual LinkedIn URL. Unblocks planner. | ✓ |
| I don't have it ready — leave a TODO | Keep placeholder, flag for manual fill before launch. | |

**User's choice:** Provided URL via plain text follow-up

**Captured value:** `https://www.linkedin.com/in/tanya-zakus/`

---

### Q3: What about the orphan Instagram link in the footer?

| Option | Description | Selected |
|--------|-------------|----------|
| Remove it (Recommended) | Delete Instagram <li> from Footer.astro. Not in requirements. Cleanest. | |
| Keep + wire to real account | Replace placeholder with real Instagram URL. | ✓ |
| Keep but hide for now | Comment out the <li>. Awkward middle ground. | |

**User's choice:** Keep + wire to real account

**Captured value:** `https://www.instagram.com/tania_zakus` (QR-share tracking params `?igsh=...&utm_source=qr` stripped from the user-provided URL for cleanliness)

---

### Q4: Resume link click behavior — same tab or new tab?

| Option | Description | Selected |
|--------|-------------|----------|
| New tab (target=_blank) (Recommended) | Opens in new tab. Recruiter doesn't lose portfolio. Matches LinkedIn external pattern. | ✓ |
| Same tab | Browser navigates away from portfolio. Worse UX. | |

**User's choice:** New tab (target=_blank)

---

## Area 3: SEO Meta Strategy

### Q1: How should per-page SEO meta be implemented?

| Option | Description | Selected |
|--------|-------------|----------|
| Pass-through props on BaseLayout (Recommended) | Extend existing Props interface. No new component. Surgical. | ✓ |
| New <SEO> component (centralized) | Build src/components/SEO.astro. More abstraction. | |
| astro-seo package | Install dependency. Built-in OG/Twitter/JSON-LD. | |

**User's choice:** Pass-through props on BaseLayout

---

### Q2: OG image strategy?

| Option | Description | Selected |
|--------|-------------|----------|
| Single site-wide OG image (Recommended) | One 1200×630 image at public/og-image.png. Used everywhere. | ✓ |
| Per-page OG images (homepage + about + per-case-study) | Different image per page/case study. More polish, more assets. | |
| Dynamic OG generation (built at deploy) | Library generates per-page from metadata. Most polished, most complex. | |

**User's choice:** Single site-wide OG image

---

### Q3: Favicon strategy?

| Option | Description | Selected |
|--------|-------------|----------|
| Audit existing files first, then decide | Inspect public/favicon.ico + favicon.svg before locking. Smartest. | |
| Replace with custom Tanya-branded favicon | Treat current as default; replace with branded mark. | ✓ |
| Keep current files, just wire them up | Trust current files; just add <link rel="icon"> in BaseLayout. | |

**User's choice:** Replace with custom Tanya-branded favicon

**Notes:** Asset dependency — Tanya provides the new favicon files. Planner generates a placeholder "tz" mark matching the existing inline `.tz-logo` SVG in `Header.astro:23` if real assets aren't ready.

---

## Final Pacing Check

**Question:** Anything you want to explore further?

| Option | Selected |
|--------|----------|
| I'm ready for context (Recommended) | ✓ |
| Explore more gray areas | |

**User's choice:** Ready for context.

---

## Claude's Discretion

The user did not select **"Contact pattern on About page"** for discussion. Default applied:
- **No additional contact CTA on the About page.** Reasoning: Footer already carries the "Let's work together" CTA + email/social icons (Phase 2 D-13). Adding another on About would duplicate. Footer mailto satisfies CONT-01 ("from footer and/or About page").

Other Claude's-discretion items recorded in CONTEXT.md `<decisions>` section:
- Exact About hero copy (planner drafts; Tanya refines)
- Exact "How I Work" / "Beyond Work" body copy (planner drafts; Tanya refines)
- Exact `description` values per page (planner drafts ≤160 chars)
- About hero photo aspect ratio (recommend 16:9 or 3:2)
- Optional `<meta name="theme-color">`
- Optional `<link rel="apple-touch-icon">` (only if 180×180 PNG provided)
- CSS approach for "Now" eyebrow (utility class vs inline)
- `og:locale` inclusion
- Production domain for `astro.config.mjs site:` (placeholder if undecided)

## Deferred Ideas (recorded in CONTEXT.md)

- Per-case-study OG images
- HTML resume page in addition to PDF
- Multi-size apple-touch-icon
- Twitter handle in `twitter:site` meta
- JSON-LD structured data
- Analytics integration (V2-FEAT-03)
- `prefers-color-scheme` OG variant
- Footer year auto-update (`new Date().getFullYear()`) — minor; can be folded if executor sees it
