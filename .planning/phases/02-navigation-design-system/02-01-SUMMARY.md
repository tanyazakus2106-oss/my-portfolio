---
phase: 02-navigation-design-system
plan: "01"
subsystem: navigation-shell
tags: [header, footer, theme-toggle, dark-mode, FOUC, active-nav]
dependency_graph:
  requires:
    - 01-foundation (CSS tokens in global.css, :root.dark selector)
  provides:
    - src/components/Header.astro (sticky header shell with desktop nav + ThemeToggle)
    - src/components/Footer.astro (placeholder footer, Plan 03 expands to two-column)
    - src/components/ThemeToggle.astro (dark/light toggle with localStorage persistence)
    - src/layouts/BaseLayout.astro (thin shell with FOUC script, imports Header + Footer)
  affects:
    - All pages using BaseLayout (every page in the site)
    - 02-02-PLAN.md (fills #header-mobile-slot with hamburger button)
    - 02-03-PLAN.md (expands Footer.astro into two-column grid)
tech_stack:
  added: []
  patterns:
    - FOUC prevention via synchronous inline script in <head> before CSS
    - Astro.url.pathname for active page detection at build/render time
    - CSS :global() scoping for cross-component dark mode icon visibility
    - Tailwind after: pseudo-element for hover/active nav underlines
key_files:
  created:
    - src/components/ThemeToggle.astro
    - src/components/Header.astro
    - src/components/Footer.astro
  modified:
    - src/layouts/BaseLayout.astro
decisions:
  - "FOUC script placed as first child of <head> before <meta charset> — ensures synchronous execution before any CSS or DOM renders (D-02)"
  - "ThemeToggle uses CSS :global(html.dark) selector to control icon visibility — avoids JS-driven class swaps on individual icons"
  - "Footer extracted as placeholder (Plan 03 scope) — preserves current copy while allowing Plan 03 to own two-column grid refactor"
  - "#header-mobile-slot div reserved in Header.astro with md:hidden — Plan 02 targets this exact ID to inject hamburger button"
metrics:
  duration: "~25 minutes"
  completed_date: "2026-04-16"
  tasks_completed: 3
  tasks_total: 3
  files_created: 3
  files_modified: 1
---

# Phase 02 Plan 01: Header, Footer, ThemeToggle — Navigation Shell Summary

**One-liner:** Sticky header with active-page nav and FOUC-safe dark/light toggle, extracted to dedicated Astro components replacing inline BaseLayout markup.

---

## What Was Built

### ThemeToggle.astro (`67e8547`)

Dark/light mode toggle button with inline SVG moon and sun icons. Icon visibility is controlled by CSS `:global(html.dark)` selector — no JS class-swapping on icon elements. Click handler toggles `.dark` on `<html>`, writes `'dark'` or `'light'` to `localStorage`, and syncs `aria-label` to current state. Meets 44px × 44px touch target via `min-h-[44px] min-w-[44px]`, focus ring uses `var(--color-accent)`.

**Interfaces for consumers:**
- No props — renders a self-contained `<button id="theme-toggle">` with its own script
- Import: `import ThemeToggle from './ThemeToggle.astro'`
- Expects the `.dark` class to already be on `<html>` (set by FOUC script in BaseLayout) — no flash

### Header.astro (`0fad79a`)

Sticky header (`sticky top-0 z-50 h-16`) with logo link left and a flex row right containing desktop nav, hamburger reservation slot, and ThemeToggle. Active page detection uses `Astro.url.pathname` at render time — no client-side JS needed for the underline state.

**Active page underline:** Tailwind `after:` pseudo-element with `after:h-[2px] after:bg-[var(--color-accent)]`. Active links have `after:opacity-100`; inactive links have `after:opacity-0 hover:after:opacity-100` (150ms transition).

**Hamburger slot for Plan 02:** `<div id="header-mobile-slot" class="md:hidden">` is an empty placeholder. Plan 02 should query `#header-mobile-slot` and insert the `<HamburgerButton />` component inside it, or replace it with the full mobile nav wrapper.

**External links:** LinkedIn uses the spread `{...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}` pattern — all future external links in the links array automatically get both attributes.

### Footer.astro (`85693e5`)

Initial placeholder extraction of the inline footer from BaseLayout. Contains the "Let's work together." heading, `mailto:tanyazakus2106@gmail.com` CTA link, and `© 2026 Tanya Zakus` copyright. All values use spacing/color tokens.

**For Plan 03:** Replace the inner `<div>` content with the two-column grid per D-13/D-14/D-15 (left: heading + mailto CTA + LinkedIn icon; right: stacked nav links). The outer `<footer>` element and token-based padding can be preserved as-is.

### BaseLayout.astro (refactored, `85693e5`)

Now a thin shell — imports Header and Footer, renders `<Header /> + <main><slot /></main> + <Footer />`. Key addition: FOUC prevention script as the FIRST child of `<head>`:

```js
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
```

`is:inline` directive tells Astro to not bundle or defer this script — it renders verbatim inline and executes synchronously during HTML parse, before the browser applies any CSS. This is the only way to guarantee zero FOUC on hard reload with `localStorage['theme'] = 'dark'`.

---

## FOUC Script — Why Placement Matters

The script must be the first child of `<head>`, before `<meta charset>` and before any `<link rel="stylesheet">` tags. Browser behavior: HTML is parsed top-to-bottom. If the `.dark` class is added to `<html>` before the CSS `<link>` loads, the browser applies the dark token values on first paint. If the script runs after CSS loads, the browser renders once in light mode then switches — visible flash.

Astro's default behavior is to bundle and defer `<script>` tags. `is:inline` bypasses this. The script uses `var` (not `const`/`let`) to ensure it works even in environments with strict ES5 mode (old in-page script contexts).

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Known Stubs

**Footer.astro is a planned stub.** The current footer is intentionally minimal — it preserves the Phase 1 copy while deferring the two-column grid (D-13/D-14/D-15) to Plan 03. This is documented in the file comment and the plan frontmatter. The stub does not prevent this plan's goal (component extraction + FOUC + theme toggle), which is fully achieved.

---

## Self-Check

**Files exist:**
- `src/components/ThemeToggle.astro` — FOUND
- `src/components/Header.astro` — FOUND
- `src/components/Footer.astro` — FOUND
- `src/layouts/BaseLayout.astro` — MODIFIED (confirmed)

**Commits exist:**
- `67e8547` feat(02-01): create ThemeToggle component — FOUND
- `0fad79a` feat(02-01): create Header.astro with desktop nav — FOUND
- `85693e5` feat(02-01): extract Footer and refactor BaseLayout — FOUND

## Self-Check: PASSED
