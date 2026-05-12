---
quick_id: 260512-wpa
description: "fix(about): mobile-only 24px gap above and below the hero image"
date: 2026-05-12
mode: quick
---

# Quick Plan 260512-wpa

About page: on mobile (< lg), the hero image is stacked below the hero text. The space above the image (from text → image) comes from the hero grid's `gap-[var(--spacing-3xl)]` (64px). The space below the image (from image → next section's border) comes from the "How I work" section's `mt-[var(--spacing-3xl)]` (64px). Goal: both gaps → `var(--spacing-lg)` (24px) on mobile, unchanged at lg+.

## Changes

**File:** `src/pages/about.astro`

### Hero grid gap (above image on mobile)

```diff
- <div class="animate-on-scroll grid grid-cols-1 lg:grid-cols-2 items-start gap-[var(--spacing-3xl)]">
+ <div class="animate-on-scroll grid grid-cols-1 lg:grid-cols-2 items-start gap-[var(--spacing-lg)] lg:gap-[var(--spacing-3xl)]">
```

24px gap between text and image on mobile; 64px on lg+.

### "How I work" section's margin-top (below image on mobile)

```diff
- <section class="... pt-[var(--spacing-3xl)] mt-[var(--spacing-3xl)] grid grid-cols-1 lg:grid-cols-4 lg:gap-[var(--spacing-2xl)]">
+ <section class="... pt-[var(--spacing-3xl)] mt-[var(--spacing-lg)] lg:mt-[var(--spacing-3xl)] grid grid-cols-1 lg:grid-cols-4 lg:gap-[var(--spacing-2xl)]">
```

24px gap between image and the section's top border on mobile; 64px on lg+. Only "How I work" is changed (not "Beyond work") because only the former sits directly below the image.

## Verification

- Mobile (DevTools <1024px): hero text → 24px → image → 24px → border-t → 64px (internal `pt-3xl`) → "How I work" title.
- Desktop (≥1024px): hero text and image side-by-side with 64px column gap; "How I work" section starts 64px below the hero grid as before.
- `npm run typecheck` — 0 errors.
