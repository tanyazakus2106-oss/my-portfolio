---
phase: quick
plan: 260507-zmc
type: execute
wave: 1
depends_on: []
files_modified:
  - src/pages/projects/[id].astro
autonomous: true
requirements: []

must_haves:
  truths:
    - ".case-prose h2 retains its typography rules (font-serif, font-size, line-height, color, margins) but loses opacity/transform/transition properties"
    - ".case-prose h2.is-visible rule is removed (no longer needed)"
    - "prefers-reduced-motion override for .case-prose h2 is removed (nothing to reduce)"
    - "Inline <script> block in [id].astro is removed entirely (its only purpose was wiring the h2 IntersectionObserver)"
    - "Page-section entrance animation from zmb (.animate-page-entry on 4 sections) is preserved"
    - "h2 elements ('Problem', 'My Role', etc.) appear immediately with their typography, no fade"
  artifacts:
    - path: "src/pages/projects/[id].astro"
      provides: "Static h2 subtitles, no scroll-triggered fade"
      contains: ".case-prose h2"
  key_links: []
---

<objective>
Remove the per-h2 scroll-triggered fade animation in the case study body. The h2 subtitles ("Problem", "My Role", "Process", "Outcome", etc.) currently start at `opacity: 0` and animate in via IntersectionObserver as they enter the viewport. User wants them to render statically — typography only, no motion.

Page-section entrance animation from zmb (the 4-section cascade) stays. Only the body h2 effect is removed.
</objective>

<context>
@.planning/STATE.md
@.planning/quick/260507-zmb-case-study-entrance-animation/260507-zmb-SUMMARY.md
</context>

<tasks>

### Task 1: Strip h2 scroll-animation from [id].astro

**Files:** `src/pages/projects/[id].astro`

**Action:**
1. In the `<style is:global>` block, simplify the `.case-prose h2` rule to keep only typography:
   - Keep: `font-family`, `font-size`, `line-height`, `color`, `margin-top`, `margin-bottom`
   - Remove: `opacity: 0`, `transform: translateY(24px)`, `transition`, `transition-delay`
2. Remove the `.case-prose h2.is-visible` rule entirely.
3. Remove the `@media (prefers-reduced-motion: reduce) { .case-prose h2 { ... } }` block — there's nothing to reduce now.
4. Remove the entire `<script>` block (it only existed to orchestrate the h2 observer). The `import '../../scripts/scroll-animation.ts'` line goes with it — the case study page has no `.animate-on-scroll` elements.

**Verify:**
- `grep -c "is-visible" src/pages/projects/\[id\].astro` returns 0.
- `grep -c "stagger-index" src/pages/projects/\[id\].astro` returns 0.
- `grep -c "IntersectionObserver" src/pages/projects/\[id\].astro` returns 0.
- `grep -c "scroll-animation" src/pages/projects/\[id\].astro` returns 0.
- `grep -c "animate-page-entry" src/pages/projects/\[id\].astro` returns 4 (zmb cascade preserved).
- `grep -c ".case-prose h2" src/pages/projects/\[id\].astro` returns 1 (typography rule retained).
- `astro check` passes.

**Done when:**
- Reload a case study and scroll: h2 headings appear instantly with their serif typography. No fade-in, no translateY motion.
- The 4-section page entrance cascade still fires as before.
- Body paragraphs and images render normally (they were never animated).

</tasks>
