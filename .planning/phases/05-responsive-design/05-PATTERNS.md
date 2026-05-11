# Phase 5: Responsive Design — Pattern Map

**Mapped:** 2026-05-12
**Files analyzed:** 9 files to create or modify
**Analogs found:** 8 / 9 (1 new artifact with no analog)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `.planning/phases/05-responsive-design/05-AUDIT.md` | artifact/doc | — | None — new deliverable type | no analog |
| `src/components/CaseImage.astro` | component | request-response (MDX render) | `src/components/FullBleedImage.astro` | role-match |
| `src/components/Footer.astro` | component | — (scoped CSS fix) | `src/components/Header.astro` (`.tz-logo` scoped CSS, 44px sizing) | role-match |
| `src/components/MobileNav.astro` | component + client script | event-driven | `src/components/MobileNav.astro` itself (self-analog — JS scroll-lock block) | self |
| `src/components/FullBleedImage.astro` | component | — (img attribute fix) | `src/components/FeaturedCard.astro` (`<Image>` with sizes/widths) | partial |
| `src/pages/about.astro` | page | request-response | `src/pages/projects/[id].astro` (Astro `<Image>` with `widths`/`sizes`) | exact |
| `src/pages/projects/[id].astro` | page | request-response | `src/pages/about.astro` (Astro `<Image>` with `widths`/`sizes`) | exact |
| `src/content/projects/*.mdx` | content | — (component reference update) | `src/content/projects/project-alpha.mdx` (existing `<FullBleedImage>` usage) | self |
| `src/layouts/BaseLayout.astro` | layout | — (optional body CSS guardrail) | `src/styles/global.css` (`.container` responsive CSS block) | partial |

---

## Pattern Assignments

### `.planning/phases/05-responsive-design/05-AUDIT.md` (artifact, no data flow)

**Analog:** None. Brand new artifact type for this project.

**Structural recommendation — copy this template for Wave 0 creation:**

The audit matrix must be a Markdown table with three-state cell values. From RESEARCH §1:

```markdown
# Phase 5 — Responsive Audit Matrix

> Fill each cell with PASS, COSMETIC (1024px only — D-03), or FAIL.
> A row is DONE when all 4 cells are filled and any FAIL has a linked fix commit.

| Component / Page | 375 | 768 | 1024 | 1440 | Overflow? | Tap targets? | Images? | Notes |
|-----------------|-----|-----|------|------|-----------|--------------|---------|-------|
| Header (sticky, logo, inline nav visibility) | | | | | | | | |
| MobileNav trigger (hamburger tap target) | | | | | | | | |
| MobileNav overlay (open/close, scroll lock, tap targets) | | | | | | | | |
| ThemeToggle (tap target) | | | | | | | | |
| Footer (grid reflow, icon-btn tap targets) | | | | | | | | |
| index.astro — hero section | | | | | | | | |
| index.astro — projects section (ProjectCard layout) | | | | | | | | |
| about.astro — hero grid (lg:grid-cols-2) | | | | | | | | |
| about.astro — how I work / beyond work sections | | | | | | | | |
| projects/[id].astro — header, summary | | | | | | | | |
| projects/[id].astro — cover image | | | | | | | | |
| projects/[id].astro — case prose body | | | | | | | | |
| projects/[id].astro — prev/next nav | | | | | | | | |
| FullBleedImage (in case prose) | | | | | | | | |
| ArrowLink (typographic density check only) | | | | | | | | |
```

Cell semantics (from RESEARCH §1):
- `PASS` — no issue at this breakpoint
- `COSMETIC` — awkward visually but functional; valid only in the 1024 column per D-03
- `FAIL` — broken, unreadable, overflowing, or tap target below 44px; requires a fix task

---

### `src/components/CaseImage.astro` (component, new file)

**Analog:** `src/components/FullBleedImage.astro`

This is a new component. The closest structural analog is `FullBleedImage.astro` — it is also an MDX-injectable Astro component that wraps an image in a `<figure>`. The difference: `CaseImage` uses Astro `<Image>` (not a raw `<img>`), constrains to the 720px prose column rather than breaking out, and accepts an `ImageMetadata` import (not a `public/` string).

**Analog imports pattern** (`src/components/FullBleedImage.astro`, lines 1–17):
```astro
---
// FullBleedImage — MDX custom component...
interface Props {
  src: string;
  alt: string;
}
const { src, alt } = Astro.props;
---
```

**Target pattern for CaseImage** — based on RESEARCH §6, Option A:
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

**Registration in `[id].astro`** — copy the existing FullBleedImage pattern (`src/pages/projects/[id].astro`, line 91):
```astro
// Current:
<Content components={{ FullBleedImage }} />

// After adding CaseImage:
import CaseImage from '../../components/CaseImage.astro';
<Content components={{ FullBleedImage, CaseImage }} />
```

**MDX usage pattern** — parallel to the `<FullBleedImage>` usage in `project-alpha.mdx` line 27:
```mdx
import CaseImage from '../../components/CaseImage.astro';
import wireframeImg from './wireframes-v2.jpg';

<CaseImage src={wireframeImg} alt="Second iteration wireframes" />
```

**Scoped style pattern:** `FullBleedImage.astro` uses a `<style>` block for layout concerns that cannot be expressed in Tailwind utilities (lines 24–35). `CaseImage` does NOT need a scoped style block — `<Image>` with `class="w-full h-auto"` handles sizing entirely in Tailwind utilities.

---

### `src/components/Footer.astro` (component, touch-target fix)

**Analog:** `src/components/Header.astro` — `.tz-logo` scoped CSS block (lines 88–111) shows how the project sizes a 44px circular icon element using explicit `width`/`height` in a scoped `<style>` block.

**Pre-identified issue** (RESEARCH §3): `.footer-icon-btn` is currently 40×40px, 4px short of the D-04 minimum.

**Current failing pattern** (`src/components/Footer.astro`, lines 88–108):
```css
<style>
  .footer-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;   /* FAIL — 4px below D-04 minimum */
    height: 40px;  /* FAIL — 4px below D-04 minimum */
    border-radius: 9999px;
    color: var(--color-text-primary);
    background-color: transparent;
    border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
    transition: border-color 150ms ease, color 150ms ease;
  }
```

**Analog fix pattern** (`src/components/Header.astro`, lines 89–109 — `.tz-logo` correctly sized at 44px):
```css
<style>
  .tz-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;    /* correct 44px pattern */
    height: 44px;   /* correct 44px pattern */
    border-radius: 50%;
    ...
    transition:
      background-color 150ms ease-out,
      color 150ms ease-out;
  }
```

**Fix to apply:** Change `width: 40px; height: 40px;` to `width: 44px; height: 44px;` in the `.footer-icon-btn` scoped style block. This is Option A from RESEARCH §3 — simplest fix; 4px size increase is imperceptible at border-circle scale. Transition pattern and token references (`var(--color-border)`, `var(--color-accent)`) must be preserved unchanged.

**Focus-visible pattern to preserve** (`src/components/Footer.astro`, lines 104–107):
```css
  .footer-icon-btn:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
```

---

### `src/components/MobileNav.astro` (component, iOS scroll-lock fix)

**Analog:** Self — the existing `<script>` block in `src/components/MobileNav.astro` (lines 67–149) is the target of the fix.

**Current scroll-lock pattern — FAILS on iOS Safari** (`src/components/MobileNav.astro`, lines 92 and 108):
```javascript
function open() {
  // ...
  document.body.style.overflow = 'hidden';  // line 92 — not reliable on iOS Safari
}

function close() {
  // ...
  document.body.style.overflow = '';  // line 108 — clear on close
}
```

**Target pattern — position-fixed scroll lock** (from RESEARCH §4, CSS-Tricks pattern):
```javascript
// On open — replace document.body.style.overflow = 'hidden' with:
const scrollY = window.scrollY;
document.body.style.position = 'fixed';
document.body.style.top = `-${scrollY}px`;
document.body.style.width = '100%';

// On close — replace document.body.style.overflow = '' with:
const scrollY = parseInt(document.body.style.top || '0') * -1;
document.body.style.position = '';
document.body.style.top = '';
document.body.style.width = '';
window.scrollTo(0, scrollY);
```

**Context: what must NOT change.** The rest of the `open()` and `close()` functions (lines 84–109) are correct and must be preserved verbatim:
- `overlay.dataset.state` transitions
- `opacity-0` / `pointer-events-none` Tailwind class toggling
- `aria-expanded` management
- `requestAnimationFrame(() => focusables[0]?.focus())` on open
- `trigger.focus()` on close

The focus trap (lines 126–147), Esc key handler, backdrop click, and nav-link click handlers are all correct and untouched.

**Existing tap-target classes — already passing D-04** (no change needed):
- Hamburger button (`line 14`): `min-h-[44px] min-w-[44px] inline-flex items-center justify-center`
- X-close button (`line 39`): `min-h-[44px] min-w-[44px] inline-flex items-center justify-center`
- Overlay nav links (`line 56`): `min-h-[44px] flex items-center`

---

### `src/components/FullBleedImage.astro` (component, img attribute fix)

**Analog:** `src/components/FeaturedCard.astro` — shows how Astro `<Image>` uses `widths`, `sizes`, `loading`, `class` props (lines 38–45).

**Current pattern — no srcset, no sizes** (`src/components/FullBleedImage.astro`, line 21):
```astro
<img src={src} alt={alt} loading="lazy" decoding="async" />
```

**Critical context:** `FullBleedImage` receives a `public/` path string (`src: string`), not an `ImageMetadata` import. Astro's `<Image>` component cannot generate srcset from a `public/` path string through the sharp pipeline. (RESEARCH §2, Surface 3 — verified via Context7.)

**Two-decision path for the planner:**

**Path A (partial improvement — keep `public/` authoring):**
Add `sizes="100vw"` to the existing `<img>` tag. This tells the browser the image spans 100vw but produces no actual srcset variety (only one file exists). Also add `width` and `height` attributes if known to prevent CLS:
```astro
<img
  src={src}
  alt={alt}
  loading="lazy"
  decoding="async"
  sizes="100vw"
  class="w-full h-auto block"
/>
```

**Path B (full D-06 implementation — migrate to `src/assets/`):**
Change the Props interface to accept `ImageMetadata`, use `<Image>` from `astro:assets`, and update all MDX call sites to import image files instead of using path strings. Pattern from `FeaturedCard.astro` lines 8–9, 38–45:
```astro
---
import { Image } from 'astro:assets';
interface Props { src: ImageMetadata; alt: string; }
const { src, alt } = Astro.props;
---
<figure class="full-bleed my-[var(--spacing-2xl)]">
  <Image
    src={src}
    alt={alt}
    widths={[640, 960, 1280, 1600, 2000]}
    sizes="100vw"
    loading="lazy"
    class="w-full h-auto block"
  />
</figure>
```

**Scoped style block** (lines 24–35) — preserve unchanged in both paths:
```css
<style>
  .full-bleed {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
  }
  .full-bleed img {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
```

**Known overflow issue** (RESEARCH §5, Pitfall 1): The component comment on line 5 references `<body> overflow-x:hidden from BaseLayout` — that guard does not exist. This fix belongs in `BaseLayout.astro`, not here.

---

### `src/pages/about.astro` (page, Image widths refinement)

**Analog:** `src/pages/projects/[id].astro` — shows the same Astro `<Image>` pattern with `widths` and `sizes` props (lines 77–85).

**Current pattern** (`src/pages/about.astro`, lines 19–27):
```astro
<Image
  src={heroPhoto}
  alt="Tanya Zakus, portrait"
  format="webp"
  widths={[560, 1120]}
  sizes="(min-width: 1024px) 560px, calc(100vw - 3rem)"
  class="w-full h-auto block"
/>
```

**Recommended refinement** (RESEARCH §2, Surface 1 — adds DPR-2 mobile steps):
```astro
<Image
  src={heroPhoto}
  alt="Tanya Zakus, portrait"
  format="webp"
  widths={[400, 600, 800, 1120]}
  sizes="(min-width: 1024px) 560px, calc(100vw - 3rem)"
  class="w-full h-auto block"
/>
```

**Rationale for widths array:**
- `400px` — 375px DPR-1 mobile
- `600px` — 375px DPR-2 (actual iPhone) and 768px DPR-1
- `800px` — 768px DPR-2
- `1120px` — desktop column at lg+ (DPR-2 at ~540px rendered = needs ~1080px source; 1120 is close enough)

**Container context** (`src/pages/about.astro`, line 12):
`max-w-[1120px]` wrapper — not `.container`. The `sizes` formula `calc(100vw - 3rem)` matches the `--spacing-lg` (1.5rem) padding on each side from `.container` in `global.css` lines 188–189. At `lg:`, the image column is 50% of `max-w-[1120px]` minus gap ≈ 520–540px rendered width.

**Surrounding layout context to preserve** (lines 15–18):
```astro
<div class="relative order-2 lg:order-1 overflow-hidden bg-[var(--color-secondary)] aspect-[4/5] [&>img]:object-cover [&>img]:h-full [&>img]:w-full">
```
Portrait `aspect-[4/5]` is correct for this image. Do not change the container; only update the `widths` array inside `<Image>`.

---

### `src/pages/projects/[id].astro` (page, Image widths refinement)

**Analog:** `src/pages/about.astro` — same Astro `<Image>` import and widths/sizes pattern.

**Current pattern** (`src/pages/projects/[id].astro`, lines 77–85):
```astro
<div class="rounded-2xl overflow-hidden bg-[var(--color-secondary)]">
  <Image
    src={entry.data.thumbnail}
    alt={`Cover image for ${entry.data.title}`}
    format="webp"
    widths={[900, 1800]}
    sizes="(min-width: 1200px) 1152px, calc(100vw - 3rem)"
    class="w-full h-auto"
  />
</div>
```

**Recommended refinement** (RESEARCH §2, Surface 2 — adds DPR-2 mobile steps):
```astro
<Image
  src={entry.data.thumbnail}
  alt={`Cover image for ${entry.data.title}`}
  format="webp"
  widths={[400, 800, 1200, 1800]}
  sizes="(min-width: 1200px) 1152px, calc(100vw - 3rem)"
  class="w-full h-auto"
/>
```

**Rationale for widths array:**
- `400px` — 375px DPR-1 mobile
- `800px` — 375px DPR-2 (actual iPhone) and 768px DPR-1
- `1200px` — 768px DPR-2 or 1024px DPR-1
- `1800px` — DPR-2 at full desktop (1152px rendered × 2 = 2304; 1800 is the practical cap)

**Sizes formula rationale:** Container is `max-w-[1200px]` with `px-[var(--spacing-lg)]` (1.5rem = 24px each side). At ≥1200px: 1200 − 48px padding = 1152px rendered. Below 1200px: `100vw − 3rem` (same 24px×2 padding).

**`CaseImage` registration** — add alongside existing `FullBleedImage` import and `components` prop (lines 3 and 91):
```astro
// Add import (line 4 area):
import CaseImage from '../../components/CaseImage.astro';

// Update components prop (line 91):
<Content components={{ FullBleedImage, CaseImage }} />
```

---

### `src/content/projects/*.mdx` (content, CaseImage references)

**Analog:** `src/content/projects/project-alpha.mdx` — shows current `<FullBleedImage>` usage pattern (line 27).

**Current pattern** (`project-alpha.mdx`, line 27):
```mdx
<FullBleedImage src="/images/project-alpha-process.jpg" alt="Process overview for Project Alpha — placeholder" />
```

**Note from audit** (`project-alpha.mdx`, lines 13–15): A comment already documents the `<FullBleedImage>` pattern. When `<CaseImage>` is added, a parallel comment should be added documenting its usage.

**Target pattern for MDX inline body images** (RESEARCH §6, Option A):
```mdx
import CaseImage from '../../components/CaseImage.astro';
import processImg from './process-overview.jpg';

<CaseImage src={processImg} alt="Process overview" caption="Optional caption text" />
```

**Current state:** All five MDX files (`project-alpha.mdx` through `project-epsilon.mdx`) use only `<FullBleedImage>` with `public/` path strings. There are no inline `<Image>` or `<CaseImage>` uses. No MDX file changes are needed until real case study content with inline body images arrives. The planner should create `CaseImage.astro` as a preparedness step and document its usage in a comment at the top of the MDX template — but no MDX files need rewriting in Phase 5.

---

### `src/layouts/BaseLayout.astro` (layout, optional overflow guardrail)

**Analog:** `src/styles/global.css` — the `.container` responsive CSS block (lines 182–197) shows the pattern for adding CSS to `<body>` context in this project.

**Trigger condition (D-01 escape hatch):** Only add `overflow-x: hidden` to `<body>` if the overflow audit finds the same horizontal-overflow cause in 3+ places. The single known pre-existing case is `FullBleedImage`'s `100vw` breakout — one offender does not trigger the escape hatch unless the audit surfaces more.

**Current `<body>` tag** (`src/layouts/BaseLayout.astro`, line 99):
```astro
<body class="font-sans text-[var(--color-text-primary)] bg-[var(--color-background)]">
```

**Fix if escape hatch triggers:**
```astro
<body class="font-sans text-[var(--color-text-primary)] bg-[var(--color-background)] overflow-x-hidden">
```

**Alternative (preferred if only FullBleedImage causes overflow):** Add `overflow-x: hidden` to the `.full-bleed` figure container in `FullBleedImage.astro`'s scoped style block instead of blanketing the entire `<body>`. This is a more targeted fix that avoids hiding unrelated overflow.

**Verification after adding overflow-x guard (RESEARCH §5, Pitfall 1):**
Run `document.documentElement.scrollWidth > document.documentElement.clientWidth` in DevTools console at each breakpoint on all pages after the fix. If any page still returns `true`, the offender is something other than FullBleedImage and needs individual investigation.

---

## Shared Patterns

### Touch-target sizing (D-04)
**Sources:** `src/components/MobileNav.astro` (lines 14, 39, 56), `src/components/ThemeToggle.astro` (line 11), `src/components/Header.astro` (lines 31, 49)
**Apply to:** Any element in D-04 scope that needs a touch-target fix
**Canonical Tailwind pattern (from MobileNav hamburger, line 14):**
```astro
class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center ..."
```
**Canonical scoped-CSS pattern (from Header .tz-logo, lines 89–92):**
```css
width: 44px;
height: 44px;
/* Always pair with: */
display: flex; /* or inline-flex */
align-items: center;
```
**Rule from RESEARCH §3 Pitfall 5:** `min-h-[44px]` alone does not guarantee 44px height in inline layout contexts. Always pair with `inline-flex items-center` or `flex items-center`.

### Astro `<Image>` responsive props pattern
**Sources:** `src/components/FeaturedCard.astro` (lines 38–45), `src/pages/about.astro` (lines 19–27), `src/pages/projects/[id].astro` (lines 77–85)
**Apply to:** All new and modified `<Image>` usages in Phase 5
```astro
<Image
  src={importedImageOrCollectionImage}
  alt="Descriptive alt text"
  format="webp"
  widths={[/* surface-specific array */]}
  sizes="/* surface-specific formula */"
  class="w-full h-auto block"
/>
```
**Rule:** `widths` and `sizes` must always appear together (Astro 6 requirement). `format="webp"` is redundant (Astro defaults to webp) but harmless — preserve for consistency with existing files.

### Design token reference (all fixes)
**Source:** `src/styles/global.css` (lines 4–31)
**Apply to:** Every modified component — never introduce raw hex values or magic-number px sizes in new or modified code
```css
/* Spacing */
var(--spacing-xs)  /* 4px */
var(--spacing-sm)  /* 8px */
var(--spacing-md)  /* 16px */
var(--spacing-lg)  /* 24px */
var(--spacing-xl)  /* 32px */
var(--spacing-2xl) /* 48px */
var(--spacing-3xl) /* 64px */
var(--spacing-4xl) /* 96px */

/* Colors */
var(--color-text-primary)
var(--color-text-secondary)
var(--color-border)
var(--color-accent)
var(--color-background)
var(--color-secondary)
```

### Focus-visible pattern (all interactive elements)
**Source:** `src/components/Footer.astro` (lines 104–107), `src/components/MobileNav.astro` (lines 14, 39, 56)
**Apply to:** Any new interactive element introduced by fixes
```astro
class="... focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
```
Or in scoped CSS:
```css
.element:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

### Transition pattern
**Source:** `src/components/Footer.astro` (lines 98–99), `src/components/Header.astro` (lines 108–110)
**Apply to:** Any new hover states introduced by fixes
```css
transition: border-color 150ms ease, color 150ms ease;
/* or Tailwind: */
class="transition-colors duration-150"
```

### Scoped `<style>` block usage
**Source:** `src/components/Footer.astro` (lines 87–108), `src/components/FullBleedImage.astro` (lines 24–35), `src/components/Header.astro` (lines 87–140)
**Rule:** Scoped `<style>` blocks are acceptable for structural layout concerns that cannot be expressed cleanly in Tailwind utilities (documented exception — per Phase 3 UI-SPEC Note 7). Use them for named classes like `.footer-icon-btn`, `.full-bleed`, `.tz-logo`. Do not scatter raw `style=""` attributes on elements for layout concerns.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `.planning/phases/05-responsive-design/05-AUDIT.md` | artifact | — | No audit matrix files exist in this project. Planner should use the structural template in RESEARCH §1 and the matrix rows listed above. |

---

## Key Pre-Identified Failures (planner note)

These are confirmed failures before the audit even runs (from RESEARCH executive summary and §3):

| Component | Issue | Source confirmation | Fix location |
|-----------|-------|--------------------|----|
| `Footer.astro` `.footer-icon-btn` | `width: 40px; height: 40px` — 4px below D-04 44px minimum | Line 92–93 read directly | `Footer.astro` scoped CSS |
| `FullBleedImage.astro` + `BaseLayout.astro` | Comment references non-existent `overflow-x:hidden` body guard; `100vw` breakout causes horizontal scroll on Windows/Linux | Grepped full src/ — no `overflow-x` declaration found | `BaseLayout.astro` body tag OR `FullBleedImage.astro` figure scoped CSS |
| `MobileNav.astro` | `overflow: hidden` scroll lock does not prevent iOS Safari momentum scroll | Lines 92, 108 — RESEARCH §4 multi-source confirmed | `MobileNav.astro` `<script>` block `open()`/`close()` functions |

---

## Analog Search Scope

**Directories searched:** `src/components/`, `src/pages/`, `src/layouts/`, `src/styles/`, `src/content/projects/`
**Files read:** `Header.astro`, `Footer.astro`, `MobileNav.astro`, `ThemeToggle.astro`, `FullBleedImage.astro`, `FeaturedCard.astro`, `about.astro`, `[id].astro`, `BaseLayout.astro`, `global.css`, `project-alpha.mdx`
**Pattern extraction date:** 2026-05-12
