---
phase: 04-about-contact-seo
reviewed: 2026-05-07T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - public/favicon.svg
  - public/og-image.png
  - public/tanya-zakus-designer-resume.pdf
  - src/assets/about-hero-placeholder.svg
  - src/components/Footer.astro
  - src/components/Header.astro
  - src/components/MobileNav.astro
  - src/layouts/BaseLayout.astro
  - src/pages/about.astro
  - src/pages/index.astro
  - src/pages/projects/[id].astro
findings:
  critical: 0
  high: 0
  medium: 2
  low: 4
  nit: 4
  total: 10
status: issues_found
---

# Phase 04: Code Review Report

**Reviewed:** 2026-05-07
**Depth:** standard
**Files Reviewed:** 9 source files (`og-image.png` and `tanya-zakus-designer-resume.pdf` are binary assets — referenced but not analyzed line-by-line)
**Status:** issues_found

## Summary

Phase 04 lands the SEO meta layer, branded `tz` favicon, the new `/about` page, and wires real Resume/LinkedIn/Instagram URLs across the nav components. Overall quality is good and the changes match the project's "near-zero JS, token-driven, surgical" ethos:

- `Props` interface on `BaseLayout` is correctly typed and all conditional meta renders (`{description && ...}`) are safe.
- All conditional renders use truthy strings, not boolean coercion of objects — no risk of leaking `false` literals into the DOM.
- External links across `Header`, `Footer`, and `MobileNav` consistently apply `target="_blank"` + `rel="noopener noreferrer"`.
- The new `/about` page uses correct semantic landmarks (`<article>` → `<header>` + two `<section>` blocks with `<h2>`s) and supplies a meaningful `alt` on the hero `<Image>`.
- Token discipline holds in `BaseLayout`, `about.astro`, `Header.astro`, and `Footer.astro` — colors and spacing reference CSS variables, not literals. The two raw hex values in `public/favicon.svg` and `src/assets/about-hero-placeholder.svg` are inside standalone SVG assets and outside the page DOM, which the project conventions explicitly allow.

The findings below are non-blocking. The two **medium** items are worth fixing before launch (description leaks the empty-string default into `og:description` indirectly via the truthy guard pattern is OK, but the home page's `ogImage="/og-image.png"` is redundant and a `nav` link list is now duplicated in three components). All other findings are polish.

---

## Medium

### M-01: Nav link array is duplicated across `Header`, `Footer`, and `MobileNav`

**Files:**
- `src/components/Header.astro:6-11`
- `src/components/Footer.astro:2-7`
- `src/components/MobileNav.astro:2-7`

**Issue:** The same four-entry navigation array (`Work`, `About`, `Resume`, `LinkedIn`) is declared three times verbatim. Phase 04 added the new `/about` and `Resume` / `LinkedIn` URLs to all three lists — meaning a future fifth nav item (or a URL change) requires three identical edits. This is exactly the kind of drift bug that surfaces months later when one list is updated and another is forgotten. The lists already differ slightly in variable name (`links` vs `navLinks`), which makes a future grep-then-edit pass error-prone.

**Fix:** Extract a single source of truth, e.g. `src/data/nav-links.ts`:

```ts
// src/data/nav-links.ts
export interface NavLink {
  href: string;
  label: string;
  external: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Work', external: false },
  { href: '/about', label: 'About', external: false },
  { href: '/tanya-zakus-designer-resume.pdf', label: 'Resume', external: true },
  { href: 'https://www.linkedin.com/in/tanya-zakus/', label: 'LinkedIn', external: true },
];
```

Then in each component:

```ts
import { NAV_LINKS } from '../data/nav-links';
```

This is a small refactor (~15 lines deleted, 1 import added per component) and aligns with the "elegant simplicity" project tone in CLAUDE.md.

---

### M-02: Empty-string `description` default produces inconsistent meta output

**File:** `src/layouts/BaseLayout.astro:16, 51, 57, 67`

**Issue:** The default for `description` is `""` (line 16). The conditional renders `{description && <meta ...>}` correctly suppress the tag when description is empty, but this default is now somewhat trap-like — every page must remember to pass `description` or the page silently ships without a `<meta name="description">`, `og:description`, or `twitter:description`. Today both callers (`index.astro`, `about.astro`, `projects/[id].astro`) pass one explicitly, so nothing is broken — but a future page added without a description will be silently SEO-degraded with no warning.

There is also a minor inconsistency: `og:title` and `twitter:title` always render even when title is the default, while the description tags drop out together. That's correct behavior, just worth noting that the contract is "description is optional, title is always rendered."

**Fix (option A — defensive default):**

```ts
const {
  title = "Tanya Zakus — UX/UI Designer",
  description = "UX/UI designer with 6+ years building humanist AI experiences and complex SaaS platforms.",
  ...
} = Astro.props;
```

Then drop the `{description && ...}` guards — every page will always emit description meta with a sensible site-wide fallback.

**Fix (option B — make required):** Remove the default and mark `description` required in `Props` so missing-description becomes a build error via `astro check`. More strict but harder to maintain because every new `.astro` page must remember it.

Option A is the lower-friction fix and matches the existing pattern for `title`.

---

## Low

### L-01: `Astro.site` fallback string is duplicated and unreachable

**File:** `src/layouts/BaseLayout.astro:22-23`

**Issue:** Both `canonicalUrl` and `absoluteOgImage` use `Astro.site ?? 'https://my-portfolio-8h7.pages.dev'`. `astro.config.mjs:9` already sets `site: 'https://my-portfolio-8h7.pages.dev'`, so `Astro.site` is guaranteed defined at build time — the fallback never executes. This is defensive but it also (a) duplicates the production URL string in three places (config + two layout lines) and (b) silently masks the bug where someone later removes `site:` from astro config and accidentally ships the dev preview URL into production canonicals.

**Fix:** Either trust the config (since the static build will fail loudly anyway if `Astro.site` is missing for sitemap), or extract a single constant:

```ts
const SITE = Astro.site ?? new URL('https://my-portfolio-8h7.pages.dev');
const canonicalUrl = canonical ?? new URL(Astro.url.pathname, SITE).href;
const absoluteOgImage = new URL(ogImage, SITE).href;
```

Better still: drop the fallback entirely and let an undefined `Astro.site` throw at build time — silent fallback to a hard-coded URL is worse than a loud failure during deploy. (The `@astrojs/sitemap` integration already requires `site` to be defined and will warn at build time if it isn't.)

---

### L-02: `index.astro` passes `ogImage="/og-image.png"` redundantly

**File:** `src/pages/index.astro:22`

**Issue:** `BaseLayout`'s default for `ogImage` is already `"/og-image.png"` (`BaseLayout.astro:17`). Passing the same string from `index.astro` and `projects/[id].astro:43` is dead-weight that obscures the intent — a future reader asks "is this a per-page override?" and discovers it's just the default repeated. If/when a per-case-study OG image is added later, the call sites will look the same as the redundant ones, hiding the meaningful change.

**Fix:** Remove the `ogImage="/og-image.png"` line from `src/pages/index.astro:22` and `src/pages/projects/[id].astro:43`. Add it back only when a page wants a different image.

---

### L-03: Resume PDF placeholder is 319 bytes — likely not the real resume

**File:** `public/tanya-zakus-designer-resume.pdf`

**Issue:** The file exists and the URL is wired into `Header`, `Footer`, and `MobileNav`, but the file is 319 bytes. A real one-page designer resume PDF is typically 50–500 KB. This is almost certainly the placeholder PDF mentioned in the phase plan. Shipping this to production gives recruiters a broken-feeling experience: they click "Resume" and download something that opens to a blank or stub page.

**Fix:** Before merging or deploying Phase 04, replace `public/tanya-zakus-designer-resume.pdf` with the real PDF. If this is intentional staging state, consider:
- Adding a `TODO` comment in `Header.astro` near the resume entry, OR
- Temporarily commenting the Resume nav entry out until the real PDF lands.

Not a code defect — flagging because the live URL is reachable from production navigation.

---

### L-04: `pathname` active-state matcher does not handle trailing-slash variants

**File:** `src/components/Header.astro:13-17`

**Issue:** `isActive('/about')` returns `true` for `/about` and `/about/sub`, but if Cloudflare Pages serves `/about/` (trailing slash) for the static build — which it does by default for directory-style routing on some configurations — the comparison `pathname === href` becomes `'/about/' === '/about'` and the active style is silently dropped on the About page. This is a latent issue not introduced by Phase 04 (the function predates this PR) but newly exercised because `/about` was added in this phase.

**Fix:** Normalize both sides before comparing:

```ts
function isActive(href: string): boolean {
  if (href.startsWith('http') || href.endsWith('.pdf')) return false;
  const normalize = (p: string) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p);
  const path = normalize(pathname);
  const target = normalize(href);
  if (target === '/') return path === '/';
  return path === target || path.startsWith(target + '/');
}
```

Verify against the production deploy after the next push to confirm Cloudflare's actual URL form.

---

## Nit

### N-01: Inline indentation regression in `index.astro` hero

**File:** `src/pages/index.astro:27`

**Issue:** `<ParticlesBg />` on line 27 is flush-left while the surrounding markup uses two-space indentation under the `<section>`. Cosmetic only; `npm run format` should auto-fix.

**Fix:** Run `npm run format`.

---

### N-02: H1 in `about.astro` uses `<header>` directly inside an `<article>` — confirm intent

**File:** `src/pages/about.astro:31-43`

**Issue:** The `<header>` block holding the eyebrow + h1 + intro paragraphs sits as a sibling of the hero `<Image>`'s wrapper `<div>` *inside* the `<article>`. This is valid HTML5 and accessible — `<article>` may have its own `<header>` — but the visual hero photo is *outside* the `<header>`. Most readers expect the hero photo to be part of the article header. This is a pure semantic-grouping nit; reading order is correct.

**Fix (optional):** Move the hero `<div>` inside the `<header>`:

```astro
<article ...>
  <header>
    <div class="rounded-2xl ...">
      <Image ... />
    </div>
    <p class="text-sm uppercase ...">Now — Open to ...</p>
    <h1 ...>Tanya Zakus, UX/UI designer ...</h1>
    <p ...>I've spent six years ...</p>
  </header>
  <section>...How I work...</section>
  <section>...Beyond work...</section>
</article>
```

Lower-priority because the current markup is already valid and accessible.

---

### N-03: Magic-number font sizes in `about.astro` and `index.astro`

**Files:**
- `src/pages/about.astro:40, 47, 50, 60, 63, 66`
- `src/pages/index.astro:46, 66`

**Issue:** Several `text-[20px]`, `text-[18px]`, `text-[28px]`, `text-[32px]`, `text-[48px]`, `leading-[30px]`, `leading-[1.625]` literal values are scattered through the two pages. These match values used elsewhere in the codebase but are not abstracted into named tokens. Per CLAUDE.md ("All spacing is a multiple of 4px... avoid arbitrary `p-[13px]`-style values"), the same logic arguably extends to typography. The current values are all 4px-aligned and consistent with `projects/[id].astro`, so they're not buggy — just not tokenized.

**Fix (optional, future cleanup):** When Phase 04 lands, consider adding a typography scale to `@theme` in `global.css` (e.g. `--text-body-lg: 20px / 30px`, `--text-h2-md: 32px`). Out of scope for this phase; flagging so it's tracked.

---

### N-04: Mobile nav link list re-queried after every overlay open

**File:** `src/components/MobileNav.astro:121-123`

**Issue:** `overlay.querySelectorAll<HTMLAnchorElement>('[data-mobile-nav-link]').forEach(...)` runs once at script init — the listeners are attached once. This is correct. But the inline comment "resets for next page" suggests the author may have thought of this as per-open behavior. Not a bug — the static link list never changes — just confusing as written. No action needed; flagging because future readers may misread it.

**Fix:** Optional — clarify the comment:

```ts
// Each link closes the overlay before navigating, so the next page loads with a clean state.
```

---

_Reviewed: 2026-05-07_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
