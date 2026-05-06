---
quick_id: 260507-zmb
description: Cascading entrance animation matching tushar.work
date: 2026-05-07
status: complete
commits:
  - 8b0b067
files_changed:
  - src/styles/global.css
  - src/pages/projects/[id].astro
---

# Quick Task 260507-zmb — Summary

## What changed

2 files, +28 / −4 net.

### `src/styles/global.css` (+24 lines)

Added `.animate-page-entry` utility class with keyframes and reduced-motion override:

```css
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

### `src/pages/projects/[id].astro` (+4 / −4)

Wired four major sections with cascading stagger indices:

| Section | `--entry-index` | Cascade timing |
|---|---|---|
| Back link container | 0 | starts immediately |
| Header (eyebrow / title / summary / metadata) | 1 | +100ms |
| Hero image container | 2 | +200ms |
| Body article (prose + prev/next) | 3 | +300ms |

Each section runs the same 600ms ease-out animation; total cascade duration is ~900ms (300ms last delay + 600ms duration).

## Why this implementation

### Pure CSS, no JS

CSS `@keyframes` fires automatically when the element enters the DOM. For a static SSG-rendered page like this, that's effectively page load. No `useEffect`, no `IntersectionObserver`, no hydration cost. Tushar's reference uses framer-motion (a JS library) to do the same thing because he's on Next.js with React; we get the equivalent with zero runtime overhead.

### `animation-fill-mode: both`

Without this, sections would briefly flash visible during their delay window before snapping back to opacity:0 when the animation starts. With `both`, the from-state holds during the delay AND the to-state holds after — so sections stay invisible during their cascade wait, then animate cleanly into their final state.

### Stagger via CSS variable

The `--entry-index` custom property approach (vs. a hardcoded `:nth-child` pattern) is the same approach used elsewhere in the codebase (`--stagger-index` on `.animate-on-scroll`, `--word-index` on `.animate-word`). Keeps the conventions consistent.

### Why these specific sections (not more)

Four sections is what Tushar does — back link, header, hero image, body. Animating finer (e.g., individual fields inside the metadata block) would be over-orchestrated for this page. The body article fades in as a whole; the per-h2 scroll animation inside the body still fires independently as the user scrolls.

### Why translateY(20px) not 24px

Matches Tushar's reference exactly (the inline `style="opacity:0;transform:translateY(20px)"` attribute on his SSR'd elements). Our existing `.animate-on-scroll` uses 24px — slightly different because that's a scroll-triggered effect, not an on-load cascade. Different motion language, slightly different distance. Both are subtle.

## Coexistence with existing animations

| Animation | Trigger | Sites |
|---|---|---|
| `.animate-page-entry` (new) | Page load (CSS @keyframes) | 4 sections in `[id].astro` |
| `.animate-on-scroll` | IntersectionObserver | `.case-prose h2` (inside body article), `<ProjectCard>`, `<FeaturedCard>` |
| `.animate-word` | Page load (CSS @keyframes, word-by-word) | Hero on home page |
| `.animate-line-word` | Page load + JS for line-grouping | Hero eyebrow + summary on home page |

All four coexist without conflict. The case-prose h2 scroll animation continues to fire as the user scrolls through the article body — even though the article *container* fades in via the new entrance animation.

## Verification

- `astro check`: 0 errors, 0 warnings on changed files (15 hints unrelated).
- `grep -n "animate-page-entry\|page-entry-fade-in" src/styles/global.css` → 5 matches across the new block.
- `grep -c "animate-page-entry" src/pages/projects/[id].astro` → 4.
- `grep -c "\-\-entry-index:" src/pages/projects/[id].astro` → 4.

## How to verify visually

1. Reload any case study page — the four sections should fade in from below in a cascade, totaling about a second.
2. Compare side-by-side with `https://www.tushar.work/design/microsoft-edge` — the cascade rhythm should feel similar (back link → header → image → body).
3. Set OS-level "Reduce motion" preference (macOS: System Settings → Accessibility → Display → Reduce motion). Reload — all four sections should appear instantly with no animation.
4. Scroll the body article — the per-h2 scroll animation should still fire as each `## Heading` enters the viewport (separate effect from the page entrance).

## Notes for future sessions

- **The animation only applies to the case study page (`[id].astro`).** Other pages (home, work) have their own established animation patterns. Don't unify unless there's a clear reason — distinct entrance feels per page is a reasonable design choice.
- **Tuning knobs:** If the cascade feels too fast, bump the `100ms` stagger to `120ms`–`150ms` in the `animation-delay` calc. If it feels too slow, drop to `80ms`. The 600ms duration is on the high end of "snappy" — could go down to 500ms for a brisker feel without losing the polish.
- **`will-change` use:** Adding `will-change: opacity, transform` on `.animate-page-entry` hints the browser to optimize for these properties. Cheap performance win for animations. Minor downside: the property creates a new compositing layer per element, slight memory cost — acceptable for four short-lived animations.
