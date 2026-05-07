---
phase: 260507-qhb
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/pages/about.astro
autonomous: false
requirements:
  - QHB-01
must_haves:
  truths:
    - "At lg+ (1024px+), the hero block is a 50/50 two-column grid with image on the LEFT and text (eyebrow + h1 + intro) on the RIGHT."
    - "Below lg (mobile + tablet up to 1023px), the hero block is a single column with text appearing ABOVE the image."
    - "At lg+, the text column is sticky and pins to the top while sub-sections (How I work, Beyond work) scroll past it."
    - "The 'How I work' and 'Beyond work' sub-sections are 1/4 + 3/4 grids at lg+ — heading in column 1, body content spanning columns 2–4."
    - "All copy on the page (eyebrow, h1, intros, sub-section bodies) is unchanged from the current file."
    - "No horizontal scroll at 375px viewport. Image displays correctly at 1440px, 1023px, and 375px viewports."
  artifacts:
    - path: "src/pages/about.astro"
      provides: "Updated layout primitives (grid, gap, order, sticky, sub-section grid) using Tailwind v4 utilities + @theme tokens"
      contains: "lg:grid-cols-2"
      contains_also: "lg:sticky"
  key_links:
    - from: "src/pages/about.astro hero grid div"
      to: "@theme tokens in src/styles/global.css"
      via: "var(--spacing-3xl), var(--spacing-2xl), var(--spacing-4xl), var(--spacing-xl)"
      pattern: "var\\(--spacing-(3xl|2xl|4xl|xl)\\)"
    - from: "Astro <Image> component on the about page"
      to: "Retuned widths and sizes for the new ~520-560px column at lg+"
      via: "widths={[560, 1120]} and sizes='(min-width: 1024px) 560px, calc(100vw - 3rem)'"
      pattern: "widths=\\{\\[560, 1120\\]\\}"
---

<objective>
Refactor `src/pages/about.astro` to mirror tushar.work/about's layout grid exactly, replacing the previous iteration's md:40/60 split with the tushar pattern: lg:50/50 hero with sticky text column, mobile-first text-above-image visual order, and 1/4 + 3/4 sub-section grids.

Purpose: The user has provided tushar.work/about as the canonical reference. The previous iteration (qab) chose proportions and a breakpoint that diverge from the reference. This task swaps the chosen primitives (breakpoint, proportions, mobile order, sticky behavior, sub-section grid) to match tushar precisely while preserving all copy and the existing token discipline.

Output: A single modified file (`src/pages/about.astro`) with updated layout classes and retuned `<Image>` srcset. No new tokens, no global.css edits, no copy changes.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@.planning/STATE.md
@src/pages/about.astro
@src/styles/global.css

<interfaces>
<!-- Token equivalences locked by the planning context. Do not deviate. -->

From src/styles/global.css (@theme block):
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
--spacing-4xl: 6rem;     /* 96px */
```

Tushar → our token mapping (LOCKED):
| Tushar utility       | Our equivalent                                                   | Math                          |
|----------------------|------------------------------------------------------------------|-------------------------------|
| `gap-16`             | `gap-[var(--spacing-3xl)]`                                       | 4rem = 64px exact             |
| `gap-12`             | `gap-[var(--spacing-2xl)]`                                       | 3rem = 48px exact             |
| `lg:top-32`          | `lg:top-[calc(var(--spacing-4xl)+var(--spacing-xl))]`            | 96 + 32 = 128px exact         |
| `space-y-10` (2.5rem)| `space-y-[var(--spacing-xl)]`                                    | 32px (accept 8px reduction)   |

`<Image>` srcset retune for ~520–560px column at lg+ inside 1120px container:
- `widths={[560, 1120]}`
- `sizes="(min-width: 1024px) 560px, calc(100vw - 3rem)"`
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Swap hero grid + sub-section grids in about.astro to mirror tushar.work/about</name>
  <files>src/pages/about.astro</files>
  <action>
Make ONLY the following edits to `src/pages/about.astro`. Do not touch any other file. Preserve all copy verbatim, BaseLayout props verbatim, the `Image` import, the `heroPhoto` import, the `<article>` wrapper's `max-w-[1120px]` and existing padding utilities, and the existing copy/comments inside `<header>` and the two `<section>` blocks.

**Edit 1 — Hero grid container.**

Replace the existing hero grid div (currently `<div class="grid grid-cols-1 md:grid-cols-[2fr_3fr] items-start gap-[var(--spacing-2xl)]">`) with:

```html
<div class="grid grid-cols-1 lg:grid-cols-2 items-start gap-[var(--spacing-3xl)]">
```

Reasoning: tushar uses `lg:grid-cols-2` (50/50) at the `lg` (1024px) breakpoint, with `gap-16` (4rem). Our `--spacing-3xl` = 4rem exactly.

**Edit 2 — Image column wrapper.**

The image column div currently reads `<div class="rounded-2xl overflow-hidden bg-[var(--color-secondary)]">`. Add `relative order-2 lg:order-1` so the image sits below text on mobile and to the LEFT on lg+:

```html
<div class="relative order-2 lg:order-1 rounded-2xl overflow-hidden bg-[var(--color-secondary)]">
```

Keep the existing `rounded-2xl overflow-hidden bg-[var(--color-secondary)]` classes — they preserve the placeholder fill and corner rounding.

**Edit 3 — `<Image>` srcset retune.**

Inside the image column, change the `<Image>` element's `widths` and `sizes` props (leave `src`, `alt`, `format`, and `class` untouched):

- `widths={[448, 896]}` → `widths={[560, 1120]}`
- `sizes="(min-width: 768px) 448px, calc(100vw - 3rem)"` → `sizes="(min-width: 1024px) 560px, calc(100vw - 3rem)"`

Reasoning: at lg+ (1024px viewport) the 50% column inside `max-w-[1120px]` minus padding is ~520–560px; `1120w` is the retina @ 2x source. Below lg the column spans full width minus the `--spacing-lg` (24px) horizontal padding on each side = `calc(100vw - 3rem)`.

**Edit 4 — Text column wrapper (`<header>`).**

The `<header>` currently has no class attribute. Add `order-1 lg:order-2 lg:sticky lg:top-[calc(var(--spacing-4xl)+var(--spacing-xl))]`:

```html
<header class="order-1 lg:order-2 lg:sticky lg:top-[calc(var(--spacing-4xl)+var(--spacing-xl))]">
```

Reasoning: mobile order = 1 (text above image), lg+ order = 2 (text right of image). Sticky pins the text column at 128px from the viewport top on lg+ (exactly tushar's `lg:top-32` = 128px), which corresponds to the 80px header height plus a 48px breathing buffer.

**Edit 5 — Sub-sections converted to 1/4 + 3/4 grids at lg+.**

Both `<section>` elements currently use `mt-[var(--spacing-3xl)]` and contain an `<h2>` followed by paragraphs. Convert each to tushar's pattern:

```html
<section class="mt-[var(--spacing-3xl)] grid grid-cols-1 lg:grid-cols-4 gap-[var(--spacing-2xl)]">
  <h2 class="text-[28px] md:text-[32px] font-medium text-[var(--color-text-primary)] mb-[var(--spacing-md)]">
    {existing heading text}
  </h2>
  <div class="lg:col-span-3 space-y-[var(--spacing-xl)]">
    {existing paragraphs — unchanged}
  </div>
</section>
```

For each of the two sections (`How I work`, `Beyond work`):

1. Add `grid grid-cols-1 lg:grid-cols-4 gap-[var(--spacing-2xl)]` to the existing `<section>` class list (so the full class becomes `mt-[var(--spacing-3xl)] grid grid-cols-1 lg:grid-cols-4 gap-[var(--spacing-2xl)]`).
2. Keep the `<h2>` exactly as it is (heading takes column 1 by default at lg+, full width below lg).
3. Wrap the two `<p>` paragraphs in a `<div class="lg:col-span-3 space-y-[var(--spacing-xl)]">`.
4. Inside that wrapper, REMOVE the `mt-[var(--spacing-md)]` class from the second paragraph (the wrapper's `space-y-[var(--spacing-xl)]` now handles inter-paragraph spacing — replacing the heterogeneous 16px with token-disciplined 32px between paragraphs).
5. Also remove the `mb-[var(--spacing-md)]` from the `<h2>` — at lg+ the heading is in its own grid column so the bottom-margin is irrelevant; below lg the `gap-[var(--spacing-2xl)]` (48px) between grid items provides the heading→content spacing. This keeps spacing fully token-driven.

Final shape per section (paragraphs' inner text and `<p>` classes other than the removed `mt-*` are preserved verbatim):

```html
<section class="mt-[var(--spacing-3xl)] grid grid-cols-1 lg:grid-cols-4 gap-[var(--spacing-2xl)]">
  <h2 class="text-[28px] md:text-[32px] font-medium text-[var(--color-text-primary)]">
    How I work
  </h2>
  <div class="lg:col-span-3 space-y-[var(--spacing-xl)]">
    <p class="text-[18px] leading-[1.625] text-[var(--color-text-secondary)] max-w-[600px]">
      {existing paragraph 1 — unchanged}
    </p>
    <p class="text-[18px] leading-[1.625] text-[var(--color-text-secondary)] max-w-[600px]">
      {existing paragraph 2 — unchanged}
    </p>
  </div>
</section>
```

Apply the same shape to the `Beyond work` section.

**Edit 6 — Comment refresh (small).**

Update the inline comment above the hero grid (currently `{/* Hero grid — image (40%) left / eyebrow + headline + intro (60%) right at md+; stacks image-above-text on mobile. */}`) to reflect the new layout. New comment:

```
{/* Hero grid — mirrors tushar.work/about. lg+ = 50/50 image-left / text-right; below lg = single column with text-above-image (Tailwind order-* visual reorder, DOM source order preserved). Text column sticky on lg+. */}
```

Update the comment above the image column (`{/* Block 1 — Hero photo (D-03)... PLACEHOLDER... Pattern copied verbatim from src/pages/projects/[id].astro:70-81. */}`) — keep the placeholder note and the `<Image>` pattern reference, but adjust the column-position language:

```
{/* Block 1 — Hero photo (D-03). Image column: visual order 2 below lg (sits below text on mobile/tablet), order 1 at lg+ (sits left). PLACEHOLDER: replace `src/assets/about-hero-placeholder.svg` with a real photo (16:9 or 3:2). <Image> pattern from src/pages/projects/[id].astro:70-81; widths/sizes retuned for the ~560px lg-column inside max-w-[1120px]. */}
```

Update the comment above `<header>` to note sticky behavior:

```
{/* Block 2 — Eyebrow + hero headline + intro. Visual order 1 below lg (lede first on mobile), order 2 at lg+ (sits right of image). Sticky on lg+ at top-128px (header is 80px sticky, leaves 48px buffer). */}
```

**What NOT to change (verify after editing):**
- BaseLayout title and description props — unchanged.
- `Image` import path and `heroPhoto` import path — unchanged.
- The `<article>` wrapper's classes — unchanged (`max-w-[1120px] mx-auto px-[var(--spacing-lg)] pt-[var(--spacing-2xl)] pb-[var(--spacing-4xl)]`).
- Eyebrow, h1, intro, and all sub-section paragraph copy — verbatim.
- Eyebrow + h1 + intro paragraph CLASSES (font sizing, leading, color tokens, the h1's `clamp(...)`, the intro's `max-w-[600px]`) — unchanged. The h1 retains NO `max-w-[20ch]` (intentionally removed in qab — preserve that state).
- No new global.css tokens. No new imports. No client:* directives. No JS added.
  </action>
  <verify>
    <automated>npm run typecheck && npm run build</automated>
  </verify>
  <done>
- `src/pages/about.astro` compiles and `npm run typecheck` returns clean.
- `npm run build` produces 7 pages (home, work, about, projects/[id]×4) with no errors.
- Hero grid at `≥1024px` viewport is 50/50, image-left, text-right; text column visibly sticks while page scrolls.
- Hero stack at `≤1023px` viewport is single column, text above image, no horizontal scroll at 375px.
- Sub-sections (`How I work`, `Beyond work`) at `≥1024px` viewport show heading in column 1 and paragraphs in columns 2–4; at `≤1023px` they stack as heading-then-paragraphs.
- All copy is byte-identical to the pre-refactor version (visually verifiable: same words, same headline, same intro, same sub-section bodies).
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Checkpoint: Visual confirmation at 1440px / 1023px / 375px + sticky behavior</name>
  <what-built>
Hero grid swapped to lg:50/50 with image-left/text-right at lg+ and text-above-image on mobile. Sub-sections converted to 1/4 + 3/4 grids at lg+. `<Image>` srcset retuned for the new ~560px column. `<header>` sticky-pinned at 128px on lg+. Copy unchanged.
  </what-built>
  <how-to-verify>
1. Run `npm run dev` and open the local URL in an incognito window (avoids cached bundles).
2. **Desktop (1440px viewport):** Navigate to `/about`. Confirm:
   - Hero is two columns, ~50/50 split.
   - Image is on the LEFT, eyebrow + headline + intro are on the RIGHT.
   - Gap between columns is visibly generous (~64px).
   - Scroll the page slowly. The text column (eyebrow + h1 + intro) should remain pinned ~128px below the top of the viewport while "How I work" and "Beyond work" sections scroll past on the right side of the page (or below, depending on column heights). The image column should scroll normally with the page.
   - "How I work" and "Beyond work" each show heading in a narrower left column with body paragraphs in a wider right column (1/4 + 3/4).
   - Inter-paragraph spacing inside sub-sections feels comfortable (≈32px).
3. **Tablet (1023px viewport):** Resize browser or use DevTools to set viewport to exactly 1023px. Confirm:
   - Hero collapses to a single column.
   - TEXT (eyebrow + headline + intro) appears FIRST / on top.
   - IMAGE appears BELOW the text.
   - Sub-sections also collapse to single column with heading-then-paragraphs.
   - No sticky behavior — page scrolls normally.
4. **Mobile (375px viewport):** Set DevTools to iPhone SE (375px) or similar. Confirm:
   - Same single-column layout as 1023px (text-above-image).
   - No horizontal scroll. Drag the page sideways — should not move horizontally.
   - Image fills the column edge-to-edge (within page padding) without distortion.
5. **Reduced motion (optional):** In DevTools "Rendering" tab enable `prefers-reduced-motion: reduce`. Reload `/about`. Confirm there are no entrance animations on the about page itself (this page does not use `.animate-on-scroll` — sanity check that no jank appears). Sticky behavior should still work (sticky is layout, not motion).
6. **Copy spot-check:** Read through the page top-to-bottom. Confirm the eyebrow, headline, intro, and both sub-section bodies match the pre-refactor copy exactly (no typos introduced).
  </how-to-verify>
  <resume-signal>Type "approved" if the layout matches tushar.work/about's pattern at all three viewports and the sticky behavior works on desktop. If anything is off (proportions wrong, sticky not pinning, mobile order wrong, image stretched, copy changed), describe the issue.</resume-signal>
</task>

</tasks>

<verification>
- `npm run typecheck` clean.
- `npm run build` produces 7 pages with no errors.
- Visual checkpoint passes at 1440px / 1023px / 375px.
- Sticky text column verified by scrolling the page on lg+.
- All page copy verified unchanged from pre-refactor state.
</verification>

<success_criteria>
The about page's layout primitives match tushar.work/about's reference exactly:
- `lg:` breakpoint (1024px), not `md:`.
- 50/50 hero columns, not 40/60.
- Mobile order is text-above-image, not image-above-text.
- Text column is sticky on lg+.
- Sub-sections are 1/4 + 3/4 grids on lg+.
- Token discipline preserved — no raw px, no new tokens, all spacing via `var(--spacing-*)`.
- All copy preserved verbatim.
</success_criteria>

<output>
After completion, create `.planning/quick/260507-qhb-refactor-about-mirror-tushar-work-about-/260507-qhb-SUMMARY.md` documenting: the exact diff applied to `src/pages/about.astro`, the token mappings used, and confirmation of the visual checkpoint sign-off.
</output>
