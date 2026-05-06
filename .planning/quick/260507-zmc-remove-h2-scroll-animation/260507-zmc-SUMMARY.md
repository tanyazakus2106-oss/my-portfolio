---
quick_id: 260507-zmc
description: Remove h2 scroll-trigger animation from case study body
date: 2026-05-07
status: complete
commits:
  - 688a51e
files_changed:
  - src/pages/projects/[id].astro
---

# Quick Task 260507-zmc — Summary

## What changed

Single file, −45 / +0 net. Pure subtraction.

### Removed from `<style is:global>`
- `opacity: 0`, `transform: translateY(24px)`, `transition`, `transition-delay` from `.case-prose h2`
- The entire `.case-prose h2.is-visible` rule
- The `@media (prefers-reduced-motion: reduce) { .case-prose h2 { ... } }` override block

### Removed from page markup
- The entire inline `<script>` block (~28 lines) that orchestrated the h2 IntersectionObserver
- Including the `import '../../scripts/scroll-animation.ts'` statement (this page has no `.animate-on-scroll` elements; the import was only present to support the now-removed h2 observer)

### Preserved
- All `.case-prose h2` typography rules: `font-family: var(--font-serif)`, `font-size: 1.875rem`, `line-height: 1.2`, `color: var(--color-text-primary)`, top/bottom margins
- `.case-prose h3` and `.case-prose p` rules — untouched
- Page-section entrance cascade from zmb (`.animate-page-entry` on the 4 major sections) — fires unchanged on page load
- Wrap-around prev/next nav, ArrowLink components, hero image — all untouched

## Why

User asked for static h2 subtitles. The fade-in-on-scroll effect was a holdover from the original D-15/D-20 design intent (when h2s were small uppercase labels). After zm4 promoted them to serif large headings, the scroll-fade competed with the visual weight of the heading itself — sections felt "delayed" rather than properly punctuated. Static rendering reads cleaner.

## Verification

- `grep -c "is-visible" src/pages/projects/[id].astro` → 0
- `grep -c "stagger-index" src/pages/projects/[id].astro` → 0
- `grep -c "IntersectionObserver" src/pages/projects/[id].astro` → 0
- `grep -c "scroll-animation" src/pages/projects/[id].astro` → 0
- `grep -c "animate-page-entry" src/pages/projects/[id].astro` → 4 (zmb cascade preserved)
- `astro check`: 0 errors, 0 warnings on the changed file.

## Notes for future sessions

- **Two animation systems used to live on this page; now there's one.** The cascade from zmb (page-section entrance, CSS-only) handles initial page reveal. Body content (h2s, h3s, p, images) is now static — no scroll-triggered fade. Simpler model.
- **The `scroll-animation.ts` import was unique to this page's old h2 observer.** Other pages (home, work) import it themselves to drive their own `.animate-on-scroll` cards. Removing it here doesn't affect any other page.
- **If you ever want the h2 scroll-fade back,** revert this commit (`git revert 688a51e`). All three pieces — the CSS, the JS, the reduced-motion override — were intertwined and removed together. Restoring is one revert away.
