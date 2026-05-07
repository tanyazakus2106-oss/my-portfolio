---
phase: quick-260507-qab
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/pages/about.astro
autonomous: false
requirements:
  - QAB-01
must_haves:
  truths:
    - "At ≥768px (md+), the hero photo and the eyebrow + headline + intro paragraph appear side-by-side as two columns: image ~40% on the left, text ~60% on the right"
    - "Image and text columns are top-aligned (eyebrow lines up with the top edge of the image card)"
    - "At <768px, the hero photo stacks ABOVE the eyebrow + headline + intro paragraph (image on top, text below), reading order unchanged"
    - "All copy is preserved verbatim — eyebrow string, h1 headline, intro paragraph, both 'How I work' paragraphs, both 'Beyond work' paragraphs"
    - "'How I work' and 'Beyond work' sections remain single-column full-width within the article, with paragraphs capped at the existing 600px reading measure"
    - "The article horizontal padding still prevents text from touching viewport edges on mobile"
    - "`npm run typecheck` passes; `npm run build` succeeds with no warnings; `dist/about/index.html` is generated"
  artifacts:
    - path: "src/pages/about.astro"
      provides: "About page with 2-column hero layout (image left / text right at md+, stacked on mobile) and unchanged 'How I work' / 'Beyond work' sections"
      contains: "md:grid-cols-[2fr_3fr]"
  key_links:
    - from: "src/pages/about.astro hero grid"
      to: "Tailwind v4 utilities"
      via: "grid + grid-cols-1 + md:grid-cols-[2fr_3fr] + items-start + gap-[var(--spacing-2xl)]"
      pattern: "md:grid-cols-\\[2fr_3fr\\]"
    - from: "Astro <Image> component"
      to: "new column geometry (~448px desktop / full-width mobile)"
      via: "updated widths and sizes props"
      pattern: "sizes="
---

<objective>
Refactor `src/pages/about.astro` so that the top hero (existing Block 1 photo + Block 2 eyebrow/headline/intro) becomes a 2-column layout at md+ breakpoint — image 40% on the left, text 60% on the right — while stacking image-above-text on mobile. The "How I work" and "Beyond work" sections stay single-column with their current reading measure.

Purpose: Tighten the lede of the about page by pairing the portrait with the eyebrow/headline/intro paragraph the way tushar.work/about pairs them, so the page reads as a portrait-introduction unit rather than a stacked image followed by a separate text block.

Output: Updated `src/pages/about.astro` with a wider article container, a CSS-grid 2-column block for the hero, retuned `<Image>` props, and preserved single-column sections below.
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
<!-- Key tokens and constraints the executor needs. Extracted from the codebase. -->
<!-- Use these directly — no further codebase exploration needed. -->

From src/styles/global.css (`@theme` block, lines 4–29):
```
--spacing-xs:  0.25rem  /* 4px */
--spacing-sm:  0.5rem   /* 8px */
--spacing-md:  1rem     /* 16px */
--spacing-lg:  1.5rem   /* 24px */
--spacing-xl:  2rem     /* 32px */
--spacing-2xl: 3rem     /* 48px */
--spacing-3xl: 4rem     /* 64px */
--spacing-4xl: 6rem     /* 96px */
```
Column gap on the hero grid uses `var(--spacing-2xl)` (48px) — already used between Block 1 and Block 2 today as `mb-[var(--spacing-2xl)]`, so the visual rhythm is preserved.

From src/pages/about.astro (current — to be refactored):
```astro
import { Image } from 'astro:assets';
import heroPhoto from '../assets/about-hero-placeholder.svg';
```
Imports stay exactly as-is. Only the `<Image>` `widths` and `sizes` props may change.

`<BaseLayout>` props (`title`, `description`) — DO NOT modify.

Tailwind v4 breakpoint reference: `md:` = `@media (min-width: 768px)`. Mobile-first default is single-column; opt into 2-column with `md:` prefix.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Refactor about.astro hero into 2-column grid (image left / text right at md+, stacked on mobile)</name>
  <files>src/pages/about.astro</files>
  <action>
Modify `src/pages/about.astro` as follows. Preserve every word of copy verbatim — only the layout markup changes.

1. **Widen the article container.** Change the outer `<article>`'s class from
   `max-w-[760px] mx-auto px-[var(--spacing-lg)] pt-[var(--spacing-2xl)] pb-[var(--spacing-4xl)]`
   to
   `max-w-[1120px] mx-auto px-[var(--spacing-lg)] pt-[var(--spacing-2xl)] pb-[var(--spacing-4xl)]`.
   (Padding, vertical spacing, and the `mx-auto` centering are unchanged.)

2. **Wrap Block 1 (hero photo) and Block 2 (header) in a single grid container.** Insert a new `<div>` wrapper that begins immediately after the opening `<article>` and closes immediately before the existing Block 3 `<section class="mt-[var(--spacing-3xl)]">`. The wrapper class must be exactly:
   `grid grid-cols-1 md:grid-cols-[2fr_3fr] items-start gap-[var(--spacing-2xl)]`
   - `grid-cols-1` is the mobile default (image stacks above text).
   - `md:grid-cols-[2fr_3fr]` produces the 40/60 split at ≥768px (2 of 5 = 40%, 3 of 5 = 60%).
   - `items-start` top-aligns the columns so the eyebrow lines up with the top of the image card.
   - `gap-[var(--spacing-2xl)]` (48px) handles BOTH the desktop column gap AND the mobile vertical stack gap.
   - Do NOT add `md:gap-*` — the same gap value works for both axes.

3. **Image column — keep the rounded card; remove the now-redundant bottom margin.** The existing `<div class="rounded-2xl overflow-hidden bg-[var(--color-secondary)] mb-[var(--spacing-2xl)]">` becomes:
   `<div class="rounded-2xl overflow-hidden bg-[var(--color-secondary)]">`
   (Drop `mb-[var(--spacing-2xl)]` — the grid `gap` now provides that spacing on mobile, and on desktop the columns are side-by-side so a bottom margin would be wrong.)

4. **Retune the `<Image>` `widths` and `sizes` props for the new column geometry.** The desktop image column is ~40% of 1120px = ~448px (retina ~896px); on mobile it is full viewport width minus the article horizontal padding (`var(--spacing-lg)` = 1.5rem on each side, so `calc(100vw - 3rem)`). Update the props to:
   ```
   widths={[448, 896]}
   sizes="(min-width: 768px) 448px, calc(100vw - 3rem)"
   ```
   The `format="webp"`, `alt`, `src`, and the `class="w-full h-auto block"` props remain unchanged. The `w-full` on the inner `<Image>` already ensures the image fills its grid column at any breakpoint.

5. **Right text column — relax the headline width cap.** The existing `<header>` element becomes the second grid child. Inside it:
   - The eyebrow `<p>` is unchanged.
   - The `<h1>`'s `max-w-[20ch]` constraint becomes counterproductive once the column itself is ~60% of 1120px (~672px). REMOVE `max-w-[20ch]` from the `<h1>` so the headline can flow to the natural column edge. Keep everything else on the `<h1>` — the `mt-[var(--spacing-md)]`, `text-[clamp(2.5rem,5vw,4.5rem)]`, `leading-[1.05]`, and `text-[var(--color-text-primary)]` classes all stay.
   - The intro `<p>`'s `max-w-[600px]` stays — keeps the reading measure pleasant inside the wider column.

6. **Block 3 ("How I work") and Block 4 ("Beyond work") — leave entirely alone.** Both `<section>` elements, their `<h2>` and `<p>` children, and the per-paragraph `max-w-[600px]` caps remain byte-identical to the current file. They sit BELOW the grid wrapper, full-width within the now-1120px article. Their existing `mt-[var(--spacing-3xl)]` provides spacing from the hero grid.

7. **No other changes.** Do not touch the frontmatter imports. Do not touch `<BaseLayout>` props. Do not add a new component or split the file. Do not introduce arbitrary spacing values — every gap/margin/padding must reference an existing `--spacing-*` token.

After saving, run `npm run typecheck` and `npm run build` from the project root and confirm both pass with no errors and no warnings related to about.astro.
  </action>
  <verify>
    <automated>cd /Users/tanyazakus/Desktop/my-portfolio &amp;&amp; npm run typecheck &amp;&amp; npm run build</automated>
  </verify>
  <done>
- `src/pages/about.astro` article uses `max-w-[1120px]`
- A single `<div>` with class `grid grid-cols-1 md:grid-cols-[2fr_3fr] items-start gap-[var(--spacing-2xl)]` wraps both the image card and the `<header>`
- Image card no longer has `mb-[var(--spacing-2xl)]`
- `<Image>` props are `widths={[448, 896]}` and `sizes="(min-width: 768px) 448px, calc(100vw - 3rem)"`
- `<h1>` no longer has `max-w-[20ch]`; all other classes on the `<h1>` are unchanged
- Eyebrow `<p>`, intro `<p>`, "How I work" `<section>`, and "Beyond work" `<section>` are byte-identical to the previous version (copy + classes preserved)
- `npm run typecheck` exits 0
- `npm run build` exits 0 and emits `dist/about/index.html`
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Manual visual check — desktop side-by-side and mobile stack</name>
  <what-built>2-column hero on `/about`: image-left (40%), text-right (60%) at md+; image-above-text stack at <768px. Below-hero sections unchanged.</what-built>
  <how-to-verify>
1. Run `npm run dev` from the project root.
2. Open http://localhost:4321/about in an incognito window at ~1440px viewport width. Confirm:
   - Hero image and the eyebrow/headline/intro text appear side-by-side
   - Image is on the LEFT and occupies roughly 40% of the article width
   - Text is on the RIGHT and occupies roughly 60% of the article width
   - The eyebrow ("Now — Open to full-time &amp; freelance") top-aligns with the top edge of the image card (no awkward vertical drift)
   - The h1 headline wraps naturally inside its column without an obviously cramped line break
   - "How I work" and "Beyond work" sit below the hero, single-column, with their existing ~600px reading measure
3. Resize the browser to 375px wide (or use device emulation). Confirm:
   - Hero image stacks on TOP, full-width within the article padding
   - Eyebrow/headline/intro stack BELOW the image
   - Vertical gap between the image and the text feels equivalent to the previous design (~48px / `--spacing-2xl`)
   - No horizontal scrollbar
4. Toggle dark mode (theme toggle in header). Confirm both layouts still look correct in dark mode (no color regressions — this task didn't touch colors but verify nothing slipped).
  </how-to-verify>
  <resume-signal>Type "approved" if both desktop side-by-side and mobile stack render correctly; otherwise describe what looks off (e.g., "image too wide on desktop", "headline wrapping awkwardly", "columns not top-aligned") and the executor will adjust.</resume-signal>
</task>

</tasks>

<verification>
- `npm run typecheck` passes with no errors
- `npm run build` succeeds and emits `dist/about/index.html`
- Manual visual check at desktop (1440px) and mobile (375px) confirms the layout matches the spec
- All copy is byte-identical to the previous version of `about.astro` (eyebrow, h1, intro, both "How I work" paragraphs, both "Beyond work" paragraphs)
</verification>

<success_criteria>
- About page top hero renders as image-left (40%) / text-right (60%) at ≥768px
- About page top hero stacks image-above-text at <768px
- "How I work" and "Beyond work" sections are visually unchanged
- No new files created, no new dependencies, no `@theme` token additions
- Only `src/pages/about.astro` is modified
</success_criteria>

<output>
After completion, create `.planning/quick/260507-qab-refactor-about-split-top-hero-into-2-col/260507-qab-SUMMARY.md` documenting: the final classes used on the grid wrapper, the final `<Image>` `widths`/`sizes` values, any deviations from this plan and why, and the commit hash.
</output>
