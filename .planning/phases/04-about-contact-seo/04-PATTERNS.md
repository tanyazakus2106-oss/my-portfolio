# Phase 4: About, Contact & SEO — Pattern Map

**Mapped:** 2026-05-07
**Files analyzed:** 8 (1 new, 7 modified)
**Analogs found:** 8 / 8

## File Classification

| New / Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------------|------|-----------|----------------|---------------|
| `src/pages/about.astro` (NEW) | page (top-level route) | static-render | `src/pages/index.astro` (page shell + tokenized hero) and `src/pages/projects/[id].astro` (single-column ~720-1200px content measure) | exact (page) + role-match (single-column body) |
| `src/layouts/BaseLayout.astro` (MOD) | layout / `<head>` extension | static-render | itself, lines 6-14 (Props) and 19-68 (head block) — extending in place | exact (self-extension) |
| `src/components/Header.astro` (MOD) | nav config + render | static-render | itself, lines 6-11 (`links` array) + line 33 (external attrs spread) | exact (self-edit, two URL replacements) |
| `src/components/Footer.astro` (MOD) | nav config + render | static-render | itself, lines 2-11 (`navLinks` + URL constants) | exact (self-edit, three URL replacements) |
| `src/components/MobileNav.astro` (MOD) | nav config + render | static-render | itself, lines 2-7 (`links` array) | exact (self-edit, mirror Header changes) |
| `astro.config.mjs` (MOD) | build config | n/a | itself, line 8 already has `site:` field | exact (verify only — `site:` already set) |
| `src/pages/index.astro` (MOD) | page (homepage) | static-render | itself, line 19 `<BaseLayout title="...">` — extend props pass | exact (self-edit, add description + ogImage) |
| `src/pages/projects/[id].astro` (MOD) | dynamic page | static-render | itself, line 40 `<BaseLayout title={...}>` — extend props pass | exact (self-edit, add description + ogImage + ogType) |

---

## Pattern Assignments

### `src/pages/about.astro` (NEW — page, static-render)

**Closest analog (page shell):** `src/pages/index.astro`
**Closest analog (content column + section rhythm):** `src/pages/projects/[id].astro`

**Page shell pattern (from `src/pages/index.astro` lines 1-3, 19, 69):**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { Image } from 'astro:assets';
---

<BaseLayout title="About — Tanya Zakus, UX/UI Designer" description="...">
  {/* page content */}
</BaseLayout>
```

**Single-column content measure pattern (from `src/pages/projects/[id].astro` lines 84):**
```astro
<article class="max-w-[720px] mx-auto px-[var(--spacing-lg)] pb-[var(--spacing-4xl)]">
  {/* body content — D-12 says ~760-800px; case study uses 720px. Adopt 760px for About to match Phase 3 D-12 spec */}
</article>
```

> Note: case study `[id].astro` uses `max-w-[720px]` for prose, `max-w-[1200px]` for header/hero. Phase 3 D-12 spec says ~760-800px content measure. Use `max-w-[760px]` on About body for spec-fidelity, or `max-w-[720px]` to match case study prose exactly. Planner picks one and notes the choice.

**"Now" eyebrow pattern (small-caps muted label) — from `src/pages/index.astro` line 26 AND `src/pages/projects/[id].astro` line 49:**

Homepage variant (looser tracking, `text-sm`):
```astro
<p class="text-sm uppercase tracking-[0.08em] font-normal text-[var(--color-text-secondary)]">
  Open to full-time & freelance
</p>
```

Case study variant (tighter, `text-xs`, `tracking-widest`):
```astro
<p class="text-xs tracking-widest uppercase text-[var(--color-text-secondary)] mb-[var(--spacing-md)]">
  {[entry.data.role, ...entry.data.skills].join(', ')}
</p>
```

> **No utility class for eyebrows exists in `src/styles/global.css`.** Both pages inline-style the small-caps treatment. Phase 4 D-06 says "small-caps + letter-spacing styling" — use the homepage variant (`text-sm uppercase tracking-[0.08em]`) so the About hero rhythm matches the homepage hero rhythm.

**Hero photo pattern (Astro `<Image>` with WebP + responsive widths) — from `src/pages/projects/[id].astro` lines 70-81:**
```astro
<div class="max-w-[1200px] mx-auto px-[var(--spacing-lg)] mb-[var(--spacing-2xl)]">
  <div class="rounded-2xl overflow-hidden bg-[var(--color-secondary)]">
    <Image
      src={heroPhoto}
      alt="Tanya Zakus, portrait"
      format="webp"
      widths={[900, 1800]}
      sizes="(min-width: 1200px) 1152px, calc(100vw - 3rem)"
      class="w-full h-auto"
    />
  </div>
</div>
```

> Adapt for About: width can be the single-column 760px (matches D-03 "full-width within the content column") or wider full-bleed 1200px. D-03 says "full-width within the content column" → use the 760px column wrap, not the 1200px wrap.

**Hero headline pattern (confident, large clamp) — from `src/pages/index.astro` line 34:**
```astro
<h1 class="mt-[var(--spacing-md)] text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-[var(--color-text-primary)] max-w-[600px]">
  Tanya Zakus — UX/UI designer ...
</h1>
```

> The case-study `h1` (line 53) uses `text-[clamp(2.5rem,5vw,4.5rem)]` — gentler clamp suitable for body-page hierarchy. **Use the case-study clamp on About** so the About headline does not compete with the homepage hero.

**Section heading pattern (D-07 title-case medium weight, body color)** — **No existing analog.** Phase 3 case studies use serif `h2` (lines 115-122 of `[id].astro`), homepage uses `text-[48px]` for "Projects". For About per D-07: "title case + medium weight + body color" — distinct from Phase 3 small-caps eyebrows. Suggested treatment, derived by composing existing tokens:
```astro
<h2 class="text-[28px] md:text-[32px] font-medium text-[var(--color-text-primary)] mt-[var(--spacing-3xl)] mb-[var(--spacing-md)]">
  How I Work
</h2>
```

**Body paragraph pattern — from `src/pages/index.astro` line 42:**
```astro
<p class="mt-[24px] text-[20px] leading-[30px] text-[var(--color-text-secondary)] max-w-[600px]">
  ...
</p>
```

**Tokenized styling rule (Phase 2 D-17):** Every spacing/color/font reference uses `var(--*)`. **No hex literals**, **no magic-number `p-[13px]`** values. Both `index.astro` and `[id].astro` honor this — every margin, padding, color, font in the analogs is `var(--spacing-*)`, `var(--color-*)`, or a token-derived clamp. Same rule for About.

---

### `src/layouts/BaseLayout.astro` (MOD — layout, static-render)

**Self-analog. Extend in place.**

**Existing Props interface (lines 6-14):**
```ts
interface Props {
  title?: string;
  description?: string;
}

const {
  title = "Tanya Zakus — UX/UI Designer",
  description = "",
} = Astro.props;
```

**Extension pattern (D-16):** Add `ogImage`, `ogType`, `canonical` to interface; add defaults in destructure. Derive canonical from `Astro.url` + `Astro.site` (`astro.config.mjs` already declares `site: 'https://my-portfolio-8h7.pages.dev'` — see "Existing astro.config.mjs" below).

**Existing `<head>` insertion site (lines 39-43):**
```astro
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
{description && <meta name="description" content={description} />}
<link rel="preconnect" href="https://fonts.googleapis.com" />
```

> **Insertion point for new SEO meta tags (D-17):** between line 42 (`{description && ...}`) and line 43 (`<link rel="preconnect">`). New tags: OG (title, description, image, type, url, site_name), Twitter Card (card, title, description, image), canonical link, favicon links (svg + ico).

**Conditional-render pattern already in use (line 42):**
```astro
{description && <meta name="description" content={description} />}
```

> Same pattern applies to all the new optional meta tags: `{ogImage && <meta property="og:image" content={...} />}` etc. Use Astro's expression-render syntax, not framework conditionals.

**Canonical/og:url derivation (D-22):**
```ts
const canonicalUrl = canonical ?? new URL(Astro.url.pathname, Astro.site).href;
```

`Astro.site` resolves from `astro.config.mjs` line 8 (`site: 'https://my-portfolio-8h7.pages.dev'`). Works at build time for static output.

**Favicon link tag pattern (D-17):**
```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

> `public/favicon.svg` and `public/favicon.ico` already exist (verified). No new files needed for the link tags themselves; D-20 covers replacing the file contents (asset dependency).

---

### `src/components/Header.astro` (MOD — nav config, static-render)

**Self-analog. Two URL replacements in `links` array.**

**Existing `links` array (lines 6-11):**
```ts
const links = [
  { href: '/', label: 'Work', external: false },
  { href: '/about', label: 'About', external: false },
  { href: '/resume.pdf', label: 'Resume', external: false },
  { href: 'https://linkedin.com', label: 'LinkedIn', external: true },
];
```

**External-link wiring (line 33) — already correct, just trigger with `external: true`:**
```astro
<a
  href={link.href}
  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
  ...
>
```

**Edits per D-11, D-12:**
- Line 9: change `{ href: '/resume.pdf', label: 'Resume', external: false }` → `{ href: '/tanya-zakus-designer-resume.pdf', label: 'Resume', external: true }`
- Line 10: change `{ href: 'https://linkedin.com', ... }` → `{ href: 'https://www.linkedin.com/in/tanya-zakus/', ... }`

> No markup changes. The `external: true` flag on Resume is what triggers `target="_blank"` via the spread on line 33. No risk of inconsistency since the spread already handles both flags.

---

### `src/components/Footer.astro` (MOD — nav config, static-render)

**Self-analog. Three URL replacements.**

**Existing constants (lines 9-11):**
```ts
const EMAIL = 'tanyazakus2106@gmail.com';
const LINKEDIN_URL = 'https://linkedin.com';
const INSTAGRAM_URL = 'https://instagram.com';
```

**Existing `navLinks` array (lines 2-7):**
```ts
const navLinks = [
  { href: '/', label: 'Work', external: false },
  { href: '/about', label: 'About', external: false },
  { href: '/resume.pdf', label: 'Resume', external: false },
  { href: 'https://linkedin.com', label: 'LinkedIn', external: true },
];
```

**Existing external-link wiring (line 70) — already correct:**
```astro
<a
  href={link.href}
  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
  ...
>
```

**Edits per D-11, D-12, D-13:**
- Line 5: Resume `href` + `external` (mirror Header.astro line 9 change)
- Line 6: LinkedIn `href` (mirror Header.astro line 10 change)
- Line 10: `LINKEDIN_URL = 'https://www.linkedin.com/in/tanya-zakus/'`
- Line 11: `INSTAGRAM_URL = 'https://www.instagram.com/tania_zakus'` (QR/utm params stripped per D-13)
- `EMAIL` (line 9) — unchanged per D-14.

> The `<li>` markup for LinkedIn (lines 20-32) and Instagram (lines 33-47) reads from the constants already — no markup edits needed. Just constant value swaps.

---

### `src/components/MobileNav.astro` (MOD — nav config, static-render)

**Self-analog. Mirror Header.astro changes.**

**Existing `links` array (lines 2-7) — identical structure to Header.astro:**
```ts
const links = [
  { href: '/', label: 'Work', external: false },
  { href: '/about', label: 'About', external: false },
  { href: '/resume.pdf', label: 'Resume', external: false },
  { href: 'https://linkedin.com', label: 'LinkedIn', external: true },
];
```

**External-link wiring (line 55) — already correct:**
```astro
<a
  href={link.href}
  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
  ...
>
```

**Edits:** identical to Header.astro lines 9-10 (Resume href/filename + `external: true`; LinkedIn href to `https://www.linkedin.com/in/tanya-zakus/`).

---

### `astro.config.mjs` (MOD — build config)

**Self-analog — `site:` is ALREADY set.**

**Existing config (verified):**
```js
export default defineConfig({
  site: 'https://my-portfolio-8h7.pages.dev',
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: /** @type {any} */ ([tailwindcss()]),
  },
});
```

**D-22 says:** "If `astro.config.mjs` is missing the `site:` field, planner adds it (e.g., `site: 'https://tanyazakus.com'` — placeholder if real domain not yet decided)." 

> The current value `https://my-portfolio-8h7.pages.dev` is the Cloudflare Pages preview domain. Planner decides:
> - **Option A:** leave as-is (canonical points to preview domain — usable for Phase 4, fine until Phase 6 DEPLOY-03).
> - **Option B:** swap to placeholder `https://tanyazakus.com` (per D-22 specifics line, "placeholder if real domain not yet decided").
>
> Either is consistent with D-22. No structural change to `astro.config.mjs` needed beyond the value choice.

---

### `src/pages/index.astro` (MOD — homepage, static-render)

**Self-analog. Extend BaseLayout props pass.**

**Existing BaseLayout invocation (line 19):**
```astro
<BaseLayout title="Tanya Zakus — UX/UI Designer">
```

**Extension pattern (D-19):**
```astro
<BaseLayout
  title="Tanya Zakus — UX/UI Designer"
  description="..."
  ogImage="/og-image.png"
>
```

> Description per D-19 = "1-sentence summary of portfolio focus", ≤160 chars. Planner drafts. `ogImage` defaults handled in BaseLayout, but D-18 says pass explicitly. `ogType` defaults to `'website'` in BaseLayout — no need to pass on homepage.

---

### `src/pages/projects/[id].astro` (MOD — dynamic case study, static-render)

**Self-analog. Extend BaseLayout props pass with per-project values.**

**Existing BaseLayout invocation (line 40):**
```astro
<BaseLayout title={`${entry.data.title} — Tanya Zakus`}>
```

**Extension pattern (D-19):**
```astro
<BaseLayout
  title={`${entry.data.title} — Tanya Zakus, UX/UI Designer`}
  description={entry.data.summary}
  ogImage="/og-image.png"
  ogType="article"
>
```

> Per D-19: title gets " UX/UI Designer" appended (current title pattern omits it). `description` reuses the existing `summary` frontmatter field — no schema change in `src/content.config.ts` needed. `ogType="article"` distinguishes case study pages from homepage/About (which use the default `'website'`).

---

## Shared Patterns

### Pattern 1 — External links

**Source:** `src/components/Header.astro` line 33, `src/components/Footer.astro` lines 22-26 / 70, `src/components/MobileNav.astro` line 55

**Apply to:** All three nav components — Resume PDF link (D-11), LinkedIn link (D-12), Instagram link (D-13).

**Excerpt (canonical form, Header.astro line 33):**
```astro
<a
  href={link.href}
  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
  ...
>
```

> **Do not write `target="_blank"` inline.** Always set `external: true` on the link object so the spread handles it. This keeps Header / Footer / MobileNav identical and prevents drift.

---

### Pattern 2 — Token-only styling (Phase 2 D-17, hard rule)

**Source:** `src/components/Footer.astro` lines 87-107, `src/pages/index.astro` lines 22-49, `src/pages/projects/[id].astro` lines 49-67

**Apply to:** `src/pages/about.astro` body, all new SEO-related markup in `BaseLayout.astro`.

**Excerpt (Footer.astro lines 95-99):**
```css
color: var(--color-text-primary);
border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
transition: border-color 150ms ease, color 150ms ease;
```

**Excerpt (index.astro line 26 — inline class form):**
```astro
class="text-sm uppercase tracking-[0.08em] font-normal text-[var(--color-text-secondary)]"
```

> **Forbidden in Phase 4 markup:**
> - Hex colors (`#6F5FD5`, `#fff`, etc.)
> - Arbitrary spacing (`p-[13px]`, `mt-[27px]`)
> - Hardcoded font families
>
> **Allowed:** `var(--color-*)`, `var(--spacing-*)`, `var(--font-*)`, the spacing scale tokens. Tracking/clamp values like `tracking-[0.08em]` and `clamp(3rem,8vw,7rem)` are NOT magic numbers when copied verbatim from the analog files — they reproduce existing typography, not invent new.

---

### Pattern 3 — Conditional `<head>` meta render

**Source:** `src/layouts/BaseLayout.astro` line 42

**Apply to:** All optional SEO meta tags added in BaseLayout (`og:image`, `twitter:image`, etc.).

**Excerpt:**
```astro
{description && <meta name="description" content={description} />}
```

> Astro expression-render. Use this pattern, not ternaries with `null`, not framework conditionals. Keeps the `<head>` clean when a prop is absent.

---

### Pattern 4 — Canonical URL from `Astro.url` + `Astro.site`

**Source:** New pattern (no existing canonical tag). Astro idiom — same `Astro.url.pathname` already used in `Header.astro` line 5 for active-link detection.

**Excerpt (Header.astro line 5, established usage of `Astro.url`):**
```ts
const pathname = Astro.url.pathname;
```

**New canonical derivation in BaseLayout:**
```ts
const canonicalUrl = canonical ?? new URL(Astro.url.pathname, Astro.site).href;
```

> Use both for the canonical `<link>` and the `og:url` meta. `Astro.site` is type-safe (typed as `URL | undefined`) — the nullish coalesce + the `astro.config.mjs site:` field together guarantee a defined value at build time.

---

## No Analog Found

| File / Concern | Role | Reason |
|----------------|------|--------|
| OG / Twitter meta tags in BaseLayout | head meta | No SEO meta exists today beyond `<title>` and `<meta name="description">`. Pattern is standard HTML — derive from D-17 spec, not codebase. |
| "How I Work" / "Beyond Work" section heading style (D-07 title-case medium body color) | typography | No section-heading style of this exact treatment exists. Case studies use serif `h2` (lines 115-122 of `[id].astro`); homepage uses `text-[48px]`. About needs a third hierarchy distinct from both. Compose tokens per the suggested treatment in `src/pages/about.astro` section above. |
| `og-image.png` 1200×630 site-wide image | static asset | None exists in `public/`. Asset dependency per D-18; planner inserts placeholder if absent at execution. |
| `tanya-zakus-designer-resume.pdf` | static asset | None exists in `public/`. Asset dependency per D-10; planner inserts placeholder if absent. |
| About hero photo | static asset | None exists. Asset dependency per D-03; planner inserts placeholder if absent. |

---

## Metadata

**Analog search scope:**
- `src/pages/` (3 files: `index.astro`, `projects/[id].astro`, `about.astro` — last not yet present)
- `src/layouts/` (1 file: `BaseLayout.astro`)
- `src/components/` (Header, Footer, MobileNav)
- `astro.config.mjs`
- `src/styles/global.css` (grep for eyebrow/uppercase/tracking utilities — none found; treatment is inlined per-page)
- `public/` (favicon files present; resume, OG image, hero photo absent)

**Files scanned:** 9 source files + 1 stylesheet + 1 config + public/ listing
**Pattern extraction date:** 2026-05-07
