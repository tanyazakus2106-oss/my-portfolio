---
phase: quick
plan: 260507-zmb
type: execute
wave: 1
depends_on: []
files_modified:
  - src/styles/global.css
  - src/pages/projects/[id].astro
autonomous: true
requirements: []

must_haves:
  truths:
    - "global.css gains a .animate-page-entry class with @keyframes for opacity 0→1 + translateY(20px)→0"
    - "Animation is 600ms ease-out with animation-fill-mode: both"
    - "Stagger via animation-delay: calc(var(--entry-index, 0) * 100ms)"
    - "prefers-reduced-motion override disables the animation"
    - "Four sections in [id].astro receive .animate-page-entry: back link container, header, hero image container, body article"
    - "Each section has --entry-index set to 0, 1, 2, 3 respectively for staggered cascade"
    - "Existing per-h2 scroll animation inside .case-prose is preserved"
  artifacts:
    - path: "src/styles/global.css"
      provides: ".animate-page-entry class + @keyframes page-entry-fade-in + reduced-motion override"
      contains: "animate-page-entry"
    - path: "src/pages/projects/[id].astro"
      provides: "Four sections wired to entrance animation with stagger indices"
      contains: "animate-page-entry"
  key_links: []
---

<objective>
Match the entrance animation pattern from `https://www.tushar.work/design/microsoft-edge`. Each major section on the case study page (back link, header, hero image, body article) fades in from `translateY(20px) opacity:0` to `translateY(0) opacity:1` in a staggered cascade on page load.

Pure CSS implementation — no JS dependency. Stagger via CSS variable, animation-fill-mode: both holds the from-state during the delay so sections stay invisible until their cascade position arrives. `prefers-reduced-motion` override disables the animation entirely.

Out of scope: home/work pages (existing animation patterns there are different — hero word-stagger and card scroll-animation), and the per-h2 scroll animation inside the case-prose body (kept as-is, fires independently via IntersectionObserver).
</objective>

<context>
@.planning/STATE.md
@.planning/quick/260507-zma-timeline-team-stacked/260507-zma-SUMMARY.md
</context>

<tasks>

### Task 1: Add `.animate-page-entry` class + keyframes to global.css

**Files:** `src/styles/global.css`

**Action:**
Append a new section after the existing scroll-animation block (around the `.animate-on-scroll` definition):

```css
/* ─── Page-load entrance animation (case study layout sections) ─── */
.animate-page-entry {
  opacity: 0;
  transform: translateY(20px);
  animation: page-entry-fade-in 600ms ease-out both;
  animation-delay: calc(var(--entry-index, 0) * 100ms);
  will-change: opacity, transform;
}

@keyframes page-entry-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-page-entry {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
```

**Verify:**
- `grep -n "animate-page-entry" src/styles/global.css` returns 3 matches (definition, keyframe ref, reduced-motion override).
- `grep -n "@keyframes page-entry-fade-in" src/styles/global.css` returns 1 match.

### Task 2: Apply the class to four sections in [id].astro

**Files:** `src/pages/projects/[id].astro`

**Action:**
Add `class="...existing classes... animate-page-entry"` and `style="--entry-index: N"` to:

1. Back link container (entry-index 0):
   `<div class="max-w-[1200px] mx-auto px-[var(--spacing-lg)] pt-[var(--spacing-lg)] animate-page-entry" style="--entry-index: 0">`
2. Header (entry-index 1):
   `<header class="max-w-[1200px] mx-auto px-[var(--spacing-lg)] pt-[var(--spacing-xl)] pb-[var(--spacing-xl)] animate-page-entry" style="--entry-index: 1">`
3. Hero image container (entry-index 2):
   `<div class="max-w-[1200px] mx-auto px-[var(--spacing-lg)] mb-[var(--spacing-2xl)] animate-page-entry" style="--entry-index: 2">`
4. Body article (entry-index 3):
   `<article class="max-w-[720px] mx-auto px-[var(--spacing-lg)] pb-[var(--spacing-4xl)] case-prose animate-page-entry" style="--entry-index: 3">`

**Verify:**
- `grep -c "animate-page-entry" src/pages/projects/\[id\].astro` returns 4.
- `grep -c "--entry-index:" src/pages/projects/\[id\].astro` returns 4.
- `astro check` passes.

**Done when:**
- Reload the case study page: back link fades in first (~0ms), then header (~100ms), then hero image (~200ms), then body article (~300ms). Each with 600ms duration.
- Existing h2 scroll animations in body still fire as user scrolls.
- With OS-level "Reduce motion" set, all four sections appear instantly with no animation.

</tasks>
