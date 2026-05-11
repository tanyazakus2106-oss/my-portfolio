# Phase 5: Responsive Design - Research

**Researched:** 2026-05-12
**Domain:** Responsive web audit, Astro image optimization, touch-target compliance, iOS Safari quirks
**Confidence:** HIGH (codebase fully read; Astro docs verified via Context7; iOS/WCAG findings multi-source verified)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Audit-first. Verify existing Tailwind `md:`/`lg:` utilities and fix specific failures. No new responsive system introduced upfront. Escape hatch: 5+ components with same kind of failure triggers one system-level rule.
- **D-02:** Audit matrix = 375 / 768 / 1024 / 1440px. Four columns only. No 320px, 1280px, or 1920px columns.
- **D-03:** Pragmatic-fix policy for 1024px column. "Fail" only if component is visibly cramped, broken, or unreadable — not merely cosmetically awkward.
- **D-04:** 44×44px touch-target minimum on primary tappables only: hamburger, X-close, ThemeToggle, header nav links at mobile, footer icon buttons (`footer-icon-btn`), full project-card link surfaces. Inline `ArrowLink` primitive is explicitly exempted.
- **D-05:** Audit starts fresh — no pre-flagged failures. Real testing methodology required.
- **D-06:** Explicit `widths` + `sizes` props on: About hero photo, case study `[id].astro` cover image, `FullBleedImage.astro`, MDX inline images. Card thumbnails rely on Astro defaults.

### Claude's Discretion

- Exact testing methodology (Chrome DevTools breakpoints, optional real-device list)
- Whether audit matrix is one `05-AUDIT.md` file, inline checklist, or distributed tasks
- Specific `widths` array values for each Image surface
- Whether MDX inline images use a wrapper component or inline snippet
- Whether overflow offenders get individual fixes or an `overflow-x: hidden` guardrail (only if 3+ offenders)
- Exact CSS approach for touch-target pad-ups

### Deferred Ideas (OUT OF SCOPE)

- Fluid type (`clamp()`)
- Named breakpoint tokens in `global.css`
- 320px / Galaxy Fold support
- 1280px / 1920px audit columns
- Per-MDX-image wrapper component (if found too verbose, defer to a follow-up quick task)
- `overflow-x: hidden` on `<body>` guardrail (reserve, only trigger if 3+ overflows)
- Material 48×48 touch standard
- Real-device test matrix beyond iPhone
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NAV-05 | Header and overlay navigation are fully responsive and usable on mobile (touch targets, legible text, no layout shift) | Section 5: MobileNav verification — CLS measurement, iOS scroll lock, in-overlay tap targets |
| CASE-06 | Case study page is fully readable and correctly laid out on a mobile device | Section 3: cover image sizing; Section 7: MDX inline image strategy |
| RESP-01 | Responsive grid system applied across all pages — layouts reflow correctly from 375px to 1440px with no horizontal overflow | Section 6: overflow detection technique |
| RESP-02 | Responsive images load appropriately sized assets per viewport using Astro's Image component (no oversized images on mobile) | Section 3: `widths`/`sizes` for each of the 4 high-impact surfaces |
| RESP-03 | Mobile navigation (overlay nav) verified for touch usability — tap targets meet minimum 44px, no content clipped | Section 4: touch-target verification; Section 5: in-overlay targets |
</phase_requirements>

---

## Executive Summary

Phase 5 is an audit-and-fix phase, not a build phase. The codebase has a solid foundation — Tailwind `md:`/`lg:` utilities are in heavy use, `min-h-[44px] min-w-[44px]` classes already appear on the hamburger, X-close, ThemeToggle, and header logo. Two pre-existing issues the planner must address: (1) `FullBleedImage.astro`'s comment claims `<body> overflow-x:hidden` exists in BaseLayout — it does not; this is a dormant horizontal-overflow landmine that must be resolved as part of the D-06 work. (2) `footer-icon-btn` is explicitly sized `40×40px` in scoped CSS — it falls below the 44px D-04 minimum and is the most obvious touch-target failure before the audit even begins.

The four D-06 image surfaces each have different render geometry that demands distinct `widths`/`sizes` values. The About hero is portrait `aspect-[4/5]` in a ~560px constrained half-column; the case study cover spans the full 1200px wrapper with a 720px prose body below it; `FullBleedImage` breaks out to 100vw; and MDX inline images are constrained to the 720px `max-w` article. For MDX inline images, the wrapper-component approach (`<CaseImage>`) is recommended over per-image inline snippets because Tanya authors MDX directly — the wrapper removes the need to remember `widths`/`sizes` incantations.

The mobile overlay nav (`MobileNav.astro`) uses `document.body.style.overflow = 'hidden'` for scroll lock. This works on desktop Chrome but has a known reliability gap on iOS Safari where `overflow: hidden` alone does not always prevent momentum scroll on the body. An additional `position: fixed` + scroll-position capture pattern is the robust fix. The overlay itself uses `fixed inset-0` which is the correct approach for overlays on iOS.

**Primary recommendation:** Run the audit sequentially in Chrome DevTools at all four widths, then verify the 375px column on a real iPhone before closing any audit cell. Fix issues in small scoped commits referencing their audit-row IDs.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Responsive layout (breakpoints, grid reflow) | Browser / Client (CSS) | — | Tailwind utility classes; pure CSS, no JS needed |
| Responsive images (srcset/sizes generation) | Build pipeline (Astro/sharp) | Browser | `widths`/`sizes` props instruct sharp at build time; browser selects from srcset at runtime |
| Touch-target sizing | Browser / Client (CSS) | — | `min-height`/`min-width` or padding in component markup; pure CSS |
| Mobile overlay nav state (open/close, scroll lock) | Browser / Client (JS) | — | Existing vanilla JS in `MobileNav.astro` `<script>` block |
| Horizontal overflow detection | Browser / Client (DevTools/console) | — | `scrollWidth > clientWidth` snippet run at each breakpoint; no code artifact |
| Audit matrix record-keeping | Planner artifact | — | Markdown file consumed by executor row-by-row |

---

## 1. Methodology

### Testing Sequence

**Recommended sequence (Claude's Discretion, D-05):**

1. `npm run build && npm run preview` — test against the production build, not the dev server. Astro's dev server ships unprocessed images; the production build applies sharp transforms and generates real srcsets.
2. Chrome DevTools responsive mode at each audit width in order: **375 → 768 → 1024 → 1440**.
3. For each width: scroll every page end-to-end, resize the font (browser zoom 100%), check overflow, check tap targets in box-model panel.
4. After DevTools pass: **real iPhone at 375px** before closing any 375 cells. DevTools emulation omits iOS Safari quirks (address bar reflow, momentum scroll, `100vh` mismatch, system font size preferences).
5. Fix cycle: one scoped commit per fix row. Re-run affected rows only.

### Chrome DevTools Responsive Mode — Key Gotchas

- **Set width, not height.** Set the width to exactly 375/768/1024/1440 and let height free-float. Pinning height to a device value can hide overflow that appears during natural page scroll.
- **DPR (device pixel ratio).** DevTools defaults to DPR 1 in responsive mode. For 375px testing, set DPR 2 or 3 (matches actual iPhones). This does not affect layout pixel math but does affect which srcset candidate the browser selects — important for RESP-02 validation.
- **Touch emulation.** DevTools responsive mode enables touch emulation. This means `hover:` states will not fire on tap as they do with a mouse — helpful for catching hover-only affordances that have no touch equivalent.
- **Scrollbar exclusion.** In DevTools responsive mode, the viewport width excludes scrollbar width (same as mobile Safari behavior). On Windows desktop where scrollbars are visible by default, the body scrollbar adds ~17px to the viewport; this is NOT present in responsive mode, matching real mobile behavior correctly.

### Audit Matrix Format

Each page × component × breakpoint gets a cell. The executor fills cells with one of three values:

| State | Meaning |
|-------|---------|
| PASS | No issue at this breakpoint |
| COSMETIC | Awkward visually but fully functional and readable. For 1024px cells only (D-03). Does NOT require a fix. |
| FAIL | Broken, unreadable, overflowing, or tap-target below 44px at this breakpoint. Requires a fix task. |

**Audit scope rows** (planner expands into the full matrix):

| Component / Page | 375 | 768 | 1024 | 1440 |
|-----------------|-----|-----|------|------|
| Header (sticky, logo, inline nav visibility) | | | | |
| MobileNav trigger (hamburger tap target) | | | | |
| MobileNav overlay (open/close, scroll lock, tap targets) | | | | |
| ThemeToggle (tap target) | | | | |
| Footer (grid reflow, icon-btn tap targets) | | | | |
| index.astro — hero section | | | | |
| index.astro — projects section (ProjectCard layout) | | | | |
| about.astro — hero grid (lg:grid-cols-2) | | | | |
| about.astro — how I work / beyond work sections | | | | |
| projects/[id].astro — header, summary | | | | |
| projects/[id].astro — cover image | | | | |
| projects/[id].astro — case prose body | | | | |
| projects/[id].astro — prev/next nav | | | | |
| FullBleedImage (in case prose) | | | | |
| ArrowLink (typographic density check only) | | | | |

---

## 2. Image Responsiveness Specifics

All four surfaces use Astro's `<Image>` component from `astro:assets`. By default Astro emits WebP. No `format` override needed — the `format="webp"` prop already present in the codebase is redundant but harmless.

**Key Astro 6 behaviour confirmed via Context7:**
- `widths` prop generates `srcset` width descriptors. Values larger than the source image's intrinsic width are silently dropped (no upscaling). [VERIFIED: Context7 /withastro/docs]
- `sizes` prop is **required** when `widths` is provided. [VERIFIED: Context7 /withastro/docs]
- Default output format is `.webp` when no `format` prop is set. [VERIFIED: Context7 /withastro/docs]
- Local images imported from `src/assets/` (e.g., `heroPhoto`) carry width/height metadata — Astro enforces correct `width`/`height` attributes automatically. [VERIFIED: Context7 /withastro/docs]
- Collection `thumbnail` fields declared with `image()` in the schema are treated as local assets after Astro resolves the relative path — they go through the same sharp pipeline. [VERIFIED: Context7 /withastro/docs]

### Surface 1: About Hero Photo

**Source:** `src/assets/about_img.jpg`, imported as `heroPhoto`
**Current code:** `widths={[560, 1120]} sizes="(min-width: 1024px) 560px, calc(100vw - 3rem)"`
**Geometry:** Portrait `aspect-[4/5]`. At `lg:` the image column is 50% of `max-w-[1120px]` minus gap = approximately 520-540px rendered. Below `lg:` it is full column width minus container padding.

**Assessment:** The existing `widths` and `sizes` are already present and mostly correct. Research confirms the actual rendered column at lg+ is ~520–540px so the 560px step is accurate. The mobile formula `calc(100vw - 3rem)` accounts for the container padding (`--spacing-lg` = 1.5rem each side = 3rem total). [VERIFIED: reading about.astro source]

**Recommended values (refinement):**
```astro
widths={[400, 600, 800, 1120]}
sizes="(min-width: 1024px) 560px, calc(100vw - 3rem)"
```
Rationale: The 400px step covers 375px DPR-1 mobile; 600px covers DPR-2 at 375px and DPR-1 at 768px; 800px covers DPR-2 at 768px; 1120px covers DPR-2 at the desktop column size. Portrait orientation means tall steps matter more than wide ones — but the `widths` array controls output width (Astro maintains aspect ratio).

### Surface 2: Case Study Cover Image (`[id].astro`)

**Source:** `entry.data.thumbnail` (collection image, local asset)
**Current code:** `widths={[900, 1800]} sizes="(min-width: 1200px) 1152px, calc(100vw - 3rem)"`
**Geometry:** Container is `max-w-[1200px]` with `px-[var(--spacing-lg)]` (1.5rem each side). At 1200px+, the actual rendered image width is 1200 − 48px padding = 1152px. Below 1200px, image spans `100vw − 3rem`.

**Assessment:** Current `widths=[900, 1800]` are reasonable but miss the DPR-2 mobile step. The `sizes` formula `(min-width: 1200px) 1152px` is correct. [VERIFIED: reading [id].astro source]

**Recommended values:**
```astro
widths={[400, 800, 1200, 1800]}
sizes="(min-width: 1200px) 1152px, calc(100vw - 3rem)"
```
Rationale: 400px = 375px DPR-1; 800px = 375px DPR-2 or 768px DPR-1; 1200px = 768px DPR-2 or 1024px DPR-1; 1800px = DPR-2 at full desktop width.

### Surface 3: FullBleedImage Component

**Source:** `public/` path string (e.g., `/images/project-alpha-process.jpg`)
**Current code:** Uses a plain `<img>` tag with `loading="lazy" decoding="async"` — NO srcset, NO `<Image>` component.
**Critical blocker:** `public/` files bypass Astro's image pipeline entirely. The `<Image>` component cannot process a `public/` path string with the sharp pipeline in the same way it processes `src/` local assets. [VERIFIED: Context7 /withastro/docs]

**Two valid approaches for D-06:**

**Option A — Keep `public/` path, add manual `srcset`:** Since `public/` images bypass processing, you would need to pre-generate multiple sizes manually (e.g., `project-alpha-process@800.jpg`, `project-alpha-process@1600.jpg`) and write a manual `srcset` attribute. This is maintenance-heavy and defeats the purpose of Astro's pipeline.

**Option B — Move FullBleedImage assets to `src/assets/` and use `<Image>`:** This allows sharp to generate srcset variants automatically. The tradeoff: FullBleedImage currently accepts a `src` string prop (public path). Switching to `<Image>` requires the MDX author to import the image file, not pass a path string. This breaks the current simple string-based authoring UX.

**Option C (recommended) — Add `srcset` and `sizes` attributes manually on the `<img>` tag using size hints, with `width`/`height` for CLS prevention.** Keep the `public/` pattern for authoring simplicity (already documented in MDX comments), but add:
```html
<img
  src={src}
  alt={alt}
  loading="lazy"
  decoding="async"
  sizes="100vw"
/>
```
This tells the browser the image spans 100vw. Without manually pre-generated size variants, the browser will fetch only the one file at `src`. This is a partial improvement (CLS prevention via `width`/`height` is lost without intrinsic dimensions). The honest answer: without moving assets to `src/`, you get `sizes="100vw"` on the `<img>` but no actual srcset variety.

**Recommendation for D-06:** The planner should decide: if full srcset for FullBleedImage is desired, the assets must move to `src/assets/case-studies/` and the component must accept an imported image object. If authoring simplicity is the priority, document that `public/` FullBleedImage gets `loading="lazy" decoding="async" sizes="100vw"` but no srcset. The CONTEXT.md D-06 says "explicit `widths` + `sizes` props" — this requires the `src/assets/` approach to be meaningful.

**If moving to `src/assets/` (full D-06 implementation):**
```astro
import { Image } from 'astro:assets';
interface Props { src: ImageMetadata; alt: string; }
```
```astro
<Image
  src={src}
  alt={alt}
  widths={[640, 960, 1280, 1600, 2000]}
  sizes="100vw"
  loading="lazy"
  class="w-full h-auto block"
/>
```
Rationale: `sizes="100vw"` is the canonical value for full-viewport-width images. [CITED: CONTEXT.md `<specifics>` — "pairing with `widths={[640, 960, 1280, 1600, 2000]}`"]

### Surface 4: MDX Inline Images

**Current state:** No `<Image>` usage in MDX files. Placeholder MDX files use `<FullBleedImage>` (a named JSX component injected via `components` prop) but contain no inline `![alt](src)` Markdown images or explicit `<Image>` tags. [VERIFIED: reading project-alpha.mdx, project-beta.mdx]

**When real content arrives:** MDX inline images (i.e., body images that are not full-bleed) will land as either:
- Standard Markdown `![alt](./image.jpg)` — Astro processes these automatically in MDX and runs them through the image pipeline with no srcset by default.
- Explicit `<Image src={import('./image.jpg')} ... />` — requires a per-image import at the top of the MDX file.

**Geometry:** The prose body is `max-w-[720px]` centered. At full desktop this renders at 720px − 2×24px padding = 672px. On 375px mobile it renders at 375 − 48px = 327px.

**Recommended `widths`/`sizes` for MDX inline images:**
```astro
widths={[400, 720, 1440]}
sizes="(min-width: 768px) 720px, calc(100vw - 3rem)"
```
Rationale: 720px is the max rendered column width; 1440px covers DPR-2 at max desktop. `calc(100vw - 3rem)` covers mobile container padding. [ASSUMED — confirmed geometry from code, widths are research-derived]

---

## 3. Touch-Target Verification

### Measurable Approach

**Method 1 — DevTools Box Model panel (primary):**
Select the element in DevTools "Elements" panel → "Computed" tab → inspect `height` and `width` values in the box model diagram. This shows the actual rendered size in CSS pixels. For tap targets: rendered height AND width must both be ≥44px.

**Method 2 — DevTools "Inspect" tooltip on hover:**
When hovering over an element in the Elements panel, the blue overlay shows element dimensions in px. Quick visual check — but rounded values (e.g., "44 × 44") need box-model verification.

**Method 3 — Console snippet (batch check):**
```javascript
// Run in DevTools console to check all interactive elements
const targets = document.querySelectorAll('button, a[href], [role="button"]');
const failures = [];
targets.forEach(el => {
  const r = el.getBoundingClientRect();
  if (r.width < 44 || r.height < 44) {
    failures.push({ el, w: r.width.toFixed(1), h: r.height.toFixed(1) });
  }
});
console.table(failures.map(f => ({ tag: f.el.tagName, class: f.el.className.slice(0,50), w: f.w, h: f.h })));
```
[ASSUMED — standard DOM API pattern, `getBoundingClientRect()` is well-established]

### Pre-identified Issue: footer-icon-btn

The `.footer-icon-btn` scoped CSS in `Footer.astro` sets `width: 40px; height: 40px;` — 4px short of the 44px minimum. [VERIFIED: reading Footer.astro lines 92-93]

**CSS fix — pad up without changing visible circle size:**
```css
.footer-icon-btn {
  /* Was: width: 40px; height: 40px; */
  /* Option A: Bump to 44px (visible size changes slightly) */
  width: 44px;
  height: 44px;
  
  /* Option B: Keep 40px visual, add padding for tap area (preserves aesthetic) */
  width: 40px;
  height: 40px;
  padding: 2px; /* extends tap area to 44px each side */
  
  /* Option C: Hit-area pseudo-element (invisible tap expansion, zero visual change) */
  position: relative;
}
.footer-icon-btn::before {
  content: '';
  position: absolute;
  inset: -2px; /* expands tap area by 2px each side: 40 + 4 = 44 */
}
```
Option A is simplest and recommended — 4px size increase is imperceptible at the border-circle scale. [ASSUMED — aesthetic judgment; planner confirms]

### Existing Components that Already Pass

These components already have `min-h-[44px] min-w-[44px]` in their class lists [VERIFIED: reading component source]:
- Hamburger button (`MobileNav.astro` line 14)
- X-close button (`MobileNav.astro` line 39)
- ThemeToggle button (`ThemeToggle.astro` line 11)
- Header logo link (`Header.astro` line 31 — `min-h-[44px]`)
- Desktop header nav links (`Header.astro` line 49 — `min-h-[44px]` + `flex items-center`)
- Mobile overlay nav links (`MobileNav.astro` line 56 — `min-h-[44px]` + `flex items-center`)
- Case study prev/next navigation links (`[id].astro` lines 98-107 — `min-h-[44px]`)

### Project Card Link Surface

`FeaturedCard` and `ProjectCard` wrap their entire content in `<a>` — the full card is the tap target. At 375px, the card stacks to a tall column. Height will be well above 44px. Width = 100vw − 48px ≈ 327px. No fix needed. [VERIFIED: reading FeaturedCard.astro, ProjectCard.astro]

### ArrowLink Exemption Rationale (D-04)

The `ArrowLink` primitive renders inline text + an arrow SVG. At "View project" and "Back to work" usage sites, the surrounding `<a>` already provides the tap target (the `<a>` wrapping ProjectCard, or the `min-h-[44px]` `<a>` in case study nav). The `ArrowLink` itself is `decorative` at those call sites. In standalone use (if any), the text flow is the tap target — enforcing 44px would require adding 20px+ of vertical padding to a text link, disrupting line rhythm. This is the documented CLAUDE.md "typographic density" concern. [VERIFIED: reading CONTEXT.md D-04, reading ArrowLink usage in components]

---

## 4. Mobile Overlay Nav Verification (NAV-05)

### What to Verify

Phase 2 D-09 through D-12 locked the overlay behavior. Phase 5 verifies, does not change. [VERIFIED: reading 02-CONTEXT.md]

| Check | Method | Pass Condition |
|-------|--------|---------------|
| Open/close CLS = 0 | Chrome DevTools Performance panel → record open+close sequence → check Layout Shift score | No layout shift events during open/close transition |
| Scroll lock on desktop | Open overlay → attempt to scroll body → background must not move | `document.body.style.overflow = 'hidden'` works on desktop Chrome |
| Scroll lock on iOS Safari | Real iPhone → open overlay → swipe on background → background must not move | FAIL expected (see below) |
| Tap targets inside overlay | DevTools box model or console snippet | All 4 nav links ≥44px |
| Esc key closes | Keyboard test | Overlay closes |
| Backdrop click closes | Click overlay backdrop (not a link) | Overlay closes |
| Focus trap | Tab key loops within overlay | Focus stays inside |

### iOS Safari Scroll Lock Issue

**Current implementation:** `document.body.style.overflow = 'hidden'` on open, cleared on close. [VERIFIED: reading MobileNav.astro lines 92, 108]

**Issue:** On iOS Safari, setting `overflow: hidden` on `<body>` does not reliably prevent momentum scrolling of the body behind the overlay. The user can still rubber-band-scroll the page background through the overlay. [VERIFIED: multiple sources — pqina.nl, benfrain.com, stripearmy.medium.com]

**`overscroll-behavior: none` on `<html>` or `<body>`:** As of 2024, `overscroll-behavior` is **not supported in Safari** (it is supported in Chrome and Firefox). [CITED: WebSearch — multiple sources confirming Safari lacks `overscroll-behavior` support]

**Robust fix (position-fixed pattern):**
```javascript
// On open:
const scrollY = window.scrollY;
document.body.style.position = 'fixed';
document.body.style.top = `-${scrollY}px`;
document.body.style.width = '100%';

// On close:
const scrollY = parseInt(document.body.style.top || '0') * -1;
document.body.style.position = '';
document.body.style.top = '';
document.body.style.width = '';
window.scrollTo(0, scrollY);
```
[CITED: CSS-Tricks "Prevent Page Scrolling When a Modal is Open", PQINA blog]

**Impact:** Switching from `overflow: hidden` to `position: fixed` is a behavioral change within the existing mechanism — it does not change any Phase 2 D-09–D-12 locked decisions (those lock the UX gestures and animation, not the scroll-lock implementation detail).

**CLS (Layout Shift) caution:** The `position: fixed` approach can cause a layout shift when `<body>` switches to fixed positioning because the page "jumps" to top visually, then the overlay appears. The scroll-position capture + restore mitigates this. The planner should note that this fix needs real-device CLS validation post-implementation.

### In-Overlay Tap Targets

All four nav links in `MobileNav.astro` have `min-h-[44px] flex items-center` at `text-[2rem]`. [VERIFIED: reading MobileNav.astro line 56]. At 375px viewport, each link renders at approximately 327px wide × ≥44px tall. Pass without changes.

---

## 5. Horizontal Overflow Detection (RESP-01)

### Primary Detection Method (Console Snippet)

```javascript
// Paste in DevTools console at each breakpoint
// Returns the element(s) causing horizontal overflow
(function() {
  const docWidth = document.documentElement.offsetWidth;
  const allEls = document.querySelectorAll('*');
  const offenders = [];
  allEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.right > docWidth || rect.left < 0) {
      offenders.push({ tag: el.tagName, id: el.id, class: el.className.slice(0,60), right: rect.right.toFixed(1), left: rect.left.toFixed(1) });
    }
  });
  console.table(offenders);
})();
```
This uses `getBoundingClientRect()` rather than `scrollWidth > clientWidth` — the latter only detects overflow at the document root level and can miss overflow in scrollable sub-containers. The `getBoundingClientRect` approach finds the specific offending element. [ASSUMED — standard DOM API approach; cross-browser reliable]

**Also run at document level:**
```javascript
console.log('Page overflows?', document.documentElement.scrollWidth > document.documentElement.clientWidth);
```
[CITED: MDN — Element.scrollWidth]

### Visual Debug Overlay

```javascript
// Paste in DevTools console to outline all elements
document.querySelectorAll('*').forEach(el => { el.style.outline = '1px solid rgba(255,0,0,0.3)'; });
// Reset:
document.querySelectorAll('*').forEach(el => { el.style.outline = ''; });
```
[ASSUMED — widely-used developer debug technique]

### Known Horizontal Overflow Risk: FullBleedImage

`FullBleedImage.astro` uses `width: 100vw; margin-left: calc(-50vw + 50%)` — a negative-margin breakout. The component comment references `<body> overflow-x:hidden from BaseLayout` as the guard against horizontal scrollbar. **That guard does not exist** — there is no `overflow-x: hidden` on `<body>` anywhere in the current codebase. [VERIFIED: grepping entire src/ — only the comment references it; BaseLayout body tag has no overflow declaration]

**This is a pre-audit known failure.** At the 375 and 768 breakpoints, `FullBleedImage` will cause `document.documentElement.scrollWidth > clientWidth` because 100vw on a page without a scrollbar guard equals the scrollbar-inclusive width on some browsers. On macOS (hidden scrollbars), the effect is hidden; on Windows/Linux it produces a horizontal scrollbar. The fix is to add `overflow-x: hidden` to `<body>` in BaseLayout (or to the `FullBleedImage` `<figure>` container) — this is a 1-line fix.

---

## 6. MDX Inline Image Strategy (CASE-06 + RESP-02)

### Current Reality Check

Current placeholder MDX files use only `<FullBleedImage>` (passed via `components` prop) and no inline `<Image>` usage. When Tanya adds real case study content, inline body images will need to be responsive. [VERIFIED: reading project-alpha.mdx, project-beta.mdx]

### Option A: Wrapper Component (`<CaseImage>`)

Create `src/components/CaseImage.astro`:
```astro
---
import { Image } from 'astro:assets';
interface Props { src: ImageMetadata; alt: string; caption?: string; }
const { src, alt, caption } = Astro.props;
---
<figure class="my-[var(--spacing-2xl)]">
  <Image
    src={src}
    alt={alt}
    widths={[400, 720, 1440]}
    sizes="(min-width: 768px) 720px, calc(100vw - 3rem)"
    class="w-full h-auto rounded-lg"
  />
  {caption && <figcaption class="mt-[var(--spacing-sm)] text-sm text-[var(--color-text-secondary)]">{caption}</figcaption>}
</figure>
```

Usage in MDX:
```mdx
import CaseImage from '../../components/CaseImage.astro';
import wireframeImg from './wireframes-v2.jpg';

<CaseImage src={wireframeImg} alt="Second iteration wireframes" />
```

**Pros:** Tanya never writes `widths`/`sizes` manually. Consistent treatment across all case studies. Supports optional caption.
**Cons:** Requires an import line per image at top of MDX. Two lines total per image (import + component use). The image must be co-located with the MDX file or in a known `src/assets/` path.

### Option B: Inline `<Image>` Snippet with Documented Pattern

Document at the top of each MDX template as a comment:
```mdx
{/* INLINE IMAGE PATTERN — copy this for each body image:
import { Image } from 'astro:assets';
import myImg from './my-image.jpg';
...
<Image src={myImg} alt="description" widths={[400,720,1440]} sizes="(min-width:768px) 720px, calc(100vw - 3rem)" class="w-full h-auto rounded-lg my-[var(--spacing-2xl)]" />
*/}
```

**Pros:** No new component file. One-time pattern document.
**Cons:** Tanya must copy-paste a long prop list for each image. Error-prone. The `widths`/`sizes` values are invisible to her workflow and easy to get wrong.

### Recommendation

**Use Option A (wrapper component `<CaseImage>`)** for the following reasons:
1. CLAUDE.md states the owner "edits code directly" — reducing the mental load for a designer authoring MDX is high value.
2. The wrapper pattern is documented in Astro official docs as the canonical approach for reusable image components. [CITED: docs.astro.build/en/recipes/build-custom-img-component]
3. The CONTEXT.md `<deferred>` section notes the wrapper could be a follow-up quick task if found too verbose — this is not the same as deferring it; Phase 5 should make the decision. If D-06 is in scope, the wrapper is the right implementation.

**Pass to `[id].astro` via `components` prop** (same pattern as FullBleedImage):
```astro
// [id].astro
import CaseImage from '../../components/CaseImage.astro';
...
<Content components={{ FullBleedImage, CaseImage }} />
```

### MDX `img` Element Override (Alternative)

Astro MDX supports overriding the default `img` element with a custom component by passing `components={{ img: CaseImage }}` at the render site. This would allow standard Markdown `![alt](./img.jpg)` syntax to automatically use the optimized component. However, this requires the image src in the Markdown to be a valid import path, and Astro's handling of Markdown-style image paths in MDX varies across versions. [ASSUMED — complex edge case; the explicit import + component approach is safer and verified]

---

## 7. Pitfalls & Landmines

### Pitfall 1: FullBleedImage `overflow-x` Guard Missing

**What goes wrong:** `FullBleedImage.astro` documents that `<body> overflow-x:hidden` exists in BaseLayout. It does not. On Windows/Linux browsers with visible scrollbars, `100vw` includes the scrollbar width, causing a horizontal scrollbar.
**Why it happens:** The comment was written as a forward-reference to a planned guard that was never implemented.
**How to avoid:** Add `overflow-x: hidden` to `<body>` in `BaseLayout.astro` (1 line) as the first task in the overflow audit, before testing FullBleedImage.
**Warning sign:** `document.documentElement.scrollWidth > clientWidth` returns `true` at any breakpoint even when no obvious overflow component is on screen.

### Pitfall 2: iOS Safari Scroll Lock Incomplete

**What goes wrong:** `document.body.style.overflow = 'hidden'` does not prevent momentum scroll on iOS Safari. The page background scrolls while the overlay is open.
**Why it happens:** iOS Safari treats fixed-position overlays and body scroll lock differently from Chrome/Firefox. `overscroll-behavior` is not supported on Safari. [CITED: multiple sources including pqina.nl, GSAP docs]
**How to avoid:** Implement `position: fixed` + scroll-position capture pattern in `MobileNav.astro`.
**Warning sign:** Only discoverable on real iPhone — DevTools emulation does not replicate iOS scroll behavior accurately.

### Pitfall 3: footer-icon-btn is 40px, Not 44px

**What goes wrong:** `.footer-icon-btn` CSS sets explicit `width: 40px; height: 40px;` — 4px below D-04 minimum.
**Why it happens:** The component was built before Phase 5 touch-target audit.
**How to avoid:** Flag as a known FAIL in the audit matrix before starting. Fix is bump to `44px` or add `padding: 2px`.
**Warning sign:** Any automated touch-target console script will surface this immediately.

### Pitfall 4: About Hero `widths` — Portrait vs Landscape Confusion

**What goes wrong:** Using a landscape `widths` array like `[800, 1200, 1600]` for a portrait `aspect-[4/5]` image. The image is tall, not wide — the actual rendered render-width at desktop is ~540px.
**Why it happens:** Default instinct is to use wide steps for hero images.
**How to avoid:** Match `widths` steps to the actual rendered column width. Portrait images need fewer wide steps and more steps in the 400–800px range.
**Warning sign:** Sharp generates output files larger than needed, wasting build time and asset sizes.

### Pitfall 5: `min-h-[44px]` Without `flex items-center` Can Fail

**What goes wrong:** Setting `min-h-[44px]` alone does not guarantee the tap target is 44px tall — if the element is `display: inline` or has default `line-height` that makes its box height less than 44px, the `min-height` applies correctly only on block/flex/grid contexts.
**Why it happens:** CSS `min-height` on inline elements has no effect in some layout contexts.
**How to avoid:** Pair `min-h-[44px]` with `inline-flex items-center` or use `display: flex` on the container. The existing components already do this correctly — the pitfall applies to any new touch-target fix.

### Pitfall 6: DevTools `100vh` Does Not Match iOS Safari

**What goes wrong:** Testing overlay height at `height: 100%` (which fills `fixed inset-0`) in DevTools shows it fits the viewport. On real iPhone, the address bar overlaps the overlay bottom.
**Why it happens:** On iOS Safari, `100vh` historically included the full viewport height including the retracted address bar. The overlay uses `fixed inset-0` which fills the layout viewport. Modern iOS Safari (15.4+) has `dvh` support.
**Impact for this project:** The overlay is `fixed inset-0` with content `flex h-full w-full items-center justify-center`. If the content is vertically centered and does not touch the bottom edge, there is no clipping risk. Monitor the X-close button position at top (`top-[var(--spacing-md)]`) — this is not affected by address bar height.
**Warning sign:** X-close button is not visible or is overlapped by Safari chrome on real iPhone.

### Pitfall 7: `max-w-[1120px]` on About vs `max-w-[1200px]` on Case Study

**What goes wrong:** Two different max-width caps on different pages (`about.astro` uses `max-w-[1120px]`, `[id].astro` uses `max-w-[1200px]`) are not using the `.container` utility class. This bypasses the shared container system.
**Why it matters for Phase 5:** Audit must check both pages at 1440px to ensure neither max-width creates awkward centering or layout gaps. These are intentional design decisions, not bugs — but the audit must confirm the result looks correct at 1440px.
**Warning sign:** At 1440px, the about page content appears noticeably narrower than the header/footer container. This may be intentional (D-01: verify, do not auto-fix).

### Pitfall 8: `text-[clamp(...)]` Already Present — Verify at Mobile Breakpoints

**What goes wrong:** Assuming clamp values set in earlier phases are correct at 375px. `h1` on about.astro uses `text-[clamp(2.5rem,5vw,4.5rem)]`. At 375px, `5vw = 18.75px` which is below the clamp minimum of `2.5rem = 40px`. So the h1 renders at 40px (2.5rem) on mobile — which is large but manageable. Verify it does not break line length or overflow the container.
**Warning sign:** H1 text wraps to 3+ lines on 375px, overlapping or looking cramped.

---

## 8. Validation Architecture

**nyquist_validation is enabled** (config.json `workflow.nyquist_validation: true`). This section defines the reproducible validation record for Phase 5.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual audit + DevTools console scripts (no automated test runner required for this phase) |
| Config file | None — audit record lives in `05-AUDIT.md` produced by Wave 0 |
| Quick run command | Open `npm run preview` → DevTools at target width → run console snippets |
| Full suite | All breakpoints × all rows in `05-AUDIT.md` completed + real iPhone 375 column verified |

### Why No Automated Test Runner

Phase 5 is a visual/behavioral audit. Playwright visual snapshots require a stable baseline — this is Wave 0 work (no baseline exists yet). The cost of setting up Playwright for a 6-page static portfolio is disproportionate to the maintenance burden for a solo designer who edits code directly. The audit record (`05-AUDIT.md`) is the validation artifact. [ASSUMED — engineering judgment; if Tanya later adds Playwright for regression, snapshots taken post-Phase-5 serve as the responsive baseline]

**If Playwright verification is desired for touch targets (RESP-03):** A lightweight Playwright script can measure `boundingBox()` of tappable elements at specified viewport widths and assert `width >= 44 && height >= 44`. This is low-cost to write and highly reproducible. The planner can include it as an optional Wave verification step.

```javascript
// Optional Playwright touch-target verification
// playwright.config.js: { use: { viewport: { width: 375, height: 812 } } }
const box = await page.locator('#mobile-nav-trigger').boundingBox();
expect(box.width).toBeGreaterThanOrEqual(44);
expect(box.height).toBeGreaterThanOrEqual(44);
```

### Phase Requirements to Validation Map

| Req ID | Behavior | Test Type | Reproducible Command / Method | Artifact |
|--------|----------|-----------|-------------------------------|---------|
| NAV-05 | Header + overlay nav usable on mobile: tap targets, no layout shift, legible text | Manual audit | DevTools at 375px + real iPhone Safari | `05-AUDIT.md` rows: Header, MobileNav trigger, MobileNav overlay |
| CASE-06 | Case study mobile layout correct | Manual audit | DevTools at 375px, 768px on `/projects/[id]` page | `05-AUDIT.md` rows: `[id].astro` cover image, case prose, prev/next |
| RESP-01 | No horizontal overflow, 375→1440 | Console snippet | `scrollWidth > clientWidth` snippet at each of 4 widths on each page | `05-AUDIT.md` overflow column per row |
| RESP-02 | Responsive images — correct asset selection | DevTools Network tab | Network tab → Images → filter by width. At 375px DPR-2, cover image response should be ≤800px wide variant | `05-AUDIT.md` image-check column |
| RESP-03 | Tap targets ≥44px, no content clipped | Console getBoundingClientRect snippet | Run snippet at 375px, inspect failures table | `05-AUDIT.md` tap-target column |

### Audit Record Format (Wave 0 deliverable)

Wave 0 creates `05-AUDIT.md` with the full matrix table. Each cell is filled during the audit wave. A row is "DONE" when all 4 breakpoint cells are filled with PASS/COSMETIC/FAIL values and any FAIL cells have a linked fix commit. The phase passes when no FAIL cells remain open.

### Sampling Rate

- **Per task commit:** Run `npm run build && npm run preview` and verify the specific audit row the commit addresses.
- **Per wave merge:** Run the full DevTools audit at all 4 breakpoints on all pages. Re-run the console snippet for overflow and touch targets.
- **Phase gate before `/gsd-verify-work`:** All audit matrix cells filled, no FAIL cells open, real-iPhone 375 column verified by human.

### Wave 0 Gaps

- [ ] `05-AUDIT.md` — the audit matrix file itself must be created before any fix tasks run. This is a Wave 0 executor deliverable.
- [ ] Identify and inventory all FullBleedImage usage sites in MDX files (currently only `<FullBleedImage>` in placeholder files — real case study images are absent).
- [ ] Confirm `npm run build && npm run preview` produces a working preview server (Astro `output: 'static'` uses `astro preview`).

---

## Sources

### Primary (HIGH confidence)
- Context7 `/withastro/docs` — `widths`, `sizes`, `format` props on `<Image>`; MDX image import patterns; `components` prop for custom MDX components. Query topics: "responsive images widths sizes srcset", "Image component MDX format output", "content collections images", "MDX custom components".
- Codebase — All component source files read directly: `Header.astro`, `MobileNav.astro`, `ThemeToggle.astro`, `Footer.astro`, `FullBleedImage.astro`, `FeaturedCard.astro`, `ProjectCard.astro`, `about.astro`, `[id].astro`, `index.astro`, `global.css`, `BaseLayout.astro`, `project-alpha.mdx`, `project-beta.mdx`, `05-CONTEXT.md`, `02-CONTEXT.md`, `REQUIREMENTS.md`.

### Secondary (MEDIUM confidence)
- [PQINA — How To Prevent Scrolling The Page On iOS Safari 15](https://pqina.nl/blog/how-to-prevent-scrolling-the-page-on-ios-safari/) — iOS scroll lock, `position: fixed` pattern. Cited and corroborated by multiple sources.
- [CSS-Tricks — Prevent Page Scrolling When a Modal is Open](https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/) — position-fixed scroll-lock pattern with scroll-position capture/restore.
- [W3C WAI WCAG 2.5.5 Understanding](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) — 44×44 AAA target size definition.
- [MDN — Element.scrollWidth](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollWidth) — overflow detection technique.
- [Chrome DevTools — Device Mode](https://developer.chrome.com/docs/devtools/device-mode) — DevTools responsive mode behavior and limitations.
- [modern-css.com — dvh/svh/lvh](https://modern-css.com/mobile-viewport-height-without-100vh-hack/) — viewport height units, iOS address bar behavior.
- [Astro Docs — Build a custom image component](https://docs.astro.build/en/recipes/build-custom-img-component/) — wrapper component pattern for reusable image components.

### Tertiary (LOW confidence — flagged for validation)
- WebSearch results on `overscroll-behavior` Safari support (multiple sources agree Safari lacks support; this is consistent with MDN data but not directly verified via official MDN in this session).

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `getBoundingClientRect` overflow-detection snippet is cross-browser reliable for finding horizontal overflow offenders | Section 6 | Could miss elements inside scrollable sub-containers; mitigation: also check `scrollWidth > clientWidth` at root |
| A2 | The position-fixed + scroll-position-capture pattern resolves iOS Safari body scroll leak | Section 4 | May still fail on very old iOS versions (<13); mitigation: test on real device |
| A3 | Bump `footer-icon-btn` from 40px to 44px is visually imperceptible at the border-circle scale | Section 3 | Slight visual change — Tanya should approve before committing |
| A4 | Adding `overflow-x: hidden` to `<body>` in BaseLayout is safe and does not break any existing layout | Section 7 (Pitfall 1) | Could clip intentional horizontal scroll patterns — audit FullBleedImage behavior post-fix |
| A5 | MDX inline images widths `[400, 720, 1440]` with `sizes="(min-width: 768px) 720px, calc(100vw - 3rem)"` are correctly sized for the 720px prose column | Section 2, Surface 4 | Could be off if Tanya adds padding inside the prose article |

---

## Open Questions

1. **FullBleedImage asset strategy**
   - What we know: FullBleedImage uses `public/` path strings. Astro's `<Image>` cannot generate srcset from `public/` strings. D-06 says "explicit `widths` + `sizes`" on FullBleedImage.
   - What's unclear: Does D-06 require a true srcset (requiring `src/assets/` migration) or just adding `sizes="100vw"` to the existing `<img>` tag?
   - Recommendation: Planner should spec the simplest interpretation first: add `loading="lazy"`, `decoding="async"`, `sizes="100vw"` to the existing `<img>` tag, and document that true srcset requires moving assets to `src/assets/case-studies/`. Defer the migration unless RESP-02 audit shows meaningful image weight on the FullBleedImage surface.

2. **`about.astro` uses `max-w-[1120px]` and `[id].astro` uses `max-w-[1200px]` — neither uses `.container`**
   - What we know: These are intentional design decisions from prior phases.
   - What's unclear: At 1440px, does the about page look noticeably narrower than the header? Is this intentional?
   - Recommendation: Mark as "verify at 1440px" in the audit — pass if intentional, fix if accidental divergence from design intent.

3. **Real content readiness for MDX image strategy**
   - What we know: Placeholder MDX files have no inline `<Image>` usage; FullBleedImage is the only image component called from MDX.
   - What's unclear: Whether real case study content will have inline body images at all (vs. only full-bleed images).
   - Recommendation: Implement `<CaseImage>` wrapper anyway as a preparedness step. Cost is low; benefit is avoiding a follow-up task when Tanya adds real content.

---

## Metadata

**Confidence breakdown:**
- Audit methodology: HIGH — based on reading all source files and DevTools documentation
- Image `widths`/`sizes` arrays: HIGH for Astro API mechanics (Context7-verified); MEDIUM for specific values (derived from geometry; exact rendered widths may vary by pixel)
- Touch-target status: HIGH — components read directly; footer-icon-btn failure confirmed by exact pixel value
- iOS scroll lock issue: HIGH — multi-source confirmed; overscroll-behavior Safari gap well-documented
- MDX image strategy: HIGH — Astro docs confirm both approaches work; recommendation is research-supported
- Pitfalls: HIGH for codebase-derived pitfalls; MEDIUM for general iOS quirks

**Research date:** 2026-05-12
**Valid until:** 2026-06-11 (stable Astro 6.x / Safari behavior; iOS scroll-lock situation is long-standing)
