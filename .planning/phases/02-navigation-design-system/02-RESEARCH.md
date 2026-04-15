# Phase 2: Navigation & Design System — Research

**Researched:** 2026-04-15
**Domain:** Astro component authoring, Tailwind CSS v4 dark mode, vanilla JS overlay navigation, accessibility
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Dark mode toggle**
- D-01: First-visit default = system preference. Read `prefers-color-scheme` on first load. If no `localStorage` key is set, respect the OS theme. Once the user manually toggles, save choice to `localStorage`. All subsequent visits use stored preference.
- D-02: FOUC prevention is mandatory. An inline `<script>` in `<head>` (before any CSS or body renders) must read `localStorage` and conditionally add `.dark` to `<html>` synchronously.
- D-03: Toggle position: rightmost element in the header, after the nav links.
- D-04: Toggle icon: sun/moon swap. Light mode shows moon icon; dark mode shows sun icon.

**Header navigation**
- D-05: Desktop (≥768px): inline nav links visible — Work, About, Resume, LinkedIn. No hamburger on desktop.
- D-06: Mobile (<768px): inline nav links hidden, hamburger shown (+ logo + dark toggle).
- D-07: Hamburger triggers full-screen overlay on mobile only.
- D-08: Active page indicator: accent-colored underline. Same underline on hover for inactive links. Accent: `#2563EB` (light) / `#3B82F6` (dark).

**Overlay navigation (mobile)**
- D-09: Overlay content: nav links only (Work, About, Resume, LinkedIn). Large type, vertically and horizontally centered. No social links.
- D-10: Open animation: fade in from transparent. Close animation: fade out. 200–250ms.
- D-11: All three close gestures required: X button (top-right), backdrop click, Esc key.
- D-12: Body scroll locked (`overflow: hidden` on `<body>`) while overlay is open.

**Footer**
- D-13: Two-column grid. Left: "Let's work together." heading + "Get in touch →" mailto link. Right: stacked nav links.
- D-14: Footer contact email: `tanyazakus2106@gmail.com`
- D-15: Social links (LinkedIn + email) in left column near CTA. Implementation detail deferred to planning.
- D-16: Copyright line `© 2026 Tanya Zakus` stays.

**Design token consistency**
- D-17: All components use CSS custom properties from `global.css`. No hardcoded color or spacing values.
- D-18: Typography: DM Sans 400 body, 600 semibold headings. No new font weights.
- D-19: Spacing: all padding/margin/gap uses declared spacing tokens. No arbitrary pixel values outside 4px base scale.

### Claude's Discretion
- Exact Tailwind utility classes for the overlay (positioning, z-index layering)
- Whether hamburger icon is inline SVG or a library icon
- Whether to use Astro's `<script>` or a separate `.ts` file for the dark mode toggle logic
- Exact breakpoint where inline nav collapses to hamburger (768px implied by `md:`)
- Footer column proportions and responsive stacking behavior

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NAV-01 | Sticky header with name/logo left, nav links right (Work / About / Resume / LinkedIn) | Existing BaseLayout has sticky header skeleton; phase refactors it with full nav, active state, and responsive hide/show logic |
| NAV-02 | Dark/light mode toggle icon in header, persisted to localStorage | FOUC script pattern, toggle JS, `@custom-variant dark` in CSS documented in this research |
| NAV-03 | Hamburger icon triggers full-screen overlay navigation on all viewports (mobile-only per D-07) | Overlay architecture, focus trap, body scroll lock, Esc key handling documented |
| NAV-04 | Active page indicated in nav | `Astro.url.pathname` comparison pattern documented; accent underline via CSS custom property |
| FOOT-01 | Footer mirrors nav links (Work / About / Resume / LinkedIn) | Two-column grid layout documented; right column carries nav links |
| FOOT-02 | Footer includes social links (LinkedIn, email) | Left-column placement decision per D-15; `target="_blank" rel="noopener noreferrer"` pattern |
| FOOT-03 | Footer includes "get in touch" CTA | mailto: link wired to `tanyazakus2106@gmail.com`; accent color text |
| POL-02 | Consistent dark/light mode styles across all pages — no flash, no unstyled elements | `@custom-variant dark` + inline FOUC script documented in full |
| POL-03 | Typography scale defined and applied consistently | Tokens already in `global.css`; phase applies them via `font-sans`, `font-semibold`, explicit size classes |
| POL-04 | Spacing and layout rhythm consistent across all pages | Spacing tokens already in `global.css`; phase must use `var(--spacing-*)` / mapped utilities only |

</phase_requirements>

---

## Summary

Phase 2 refactors `src/layouts/BaseLayout.astro` and adds the persistent UI shell components — header, footer, overlay navigation, and dark mode toggle — that every downstream page inherits. The design token system is already declared in `src/styles/global.css` from Phase 1. This phase wires those tokens into interactive components.

There are two distinct technical concerns: (1) preventing FOUC when the dark theme is user preference, and (2) building an accessible full-screen overlay navigation without a component library. Both are well-understood problems with established vanilla-JS patterns that suit Astro's architecture. No new npm dependencies are required for this phase — all interactive behavior can be achieved with a small inline script for FOUC prevention and a bundled `<script>` block in the header component for overlay/toggle logic.

The critical insight for the planner is that Tailwind CSS v4's `dark:` variant is tied to `prefers-color-scheme` by default. For the `.dark` class strategy to work with Tailwind utilities, a `@custom-variant dark` directive must be added to `global.css`. Without this, `dark:bg-*` and similar utilities will not respond to the `.dark` class on `<html>`. The existing Phase 1 `global.css` uses only CSS custom property overrides under `:root.dark {}` — which is correct for the `var(--color-*)` tokens, but any future direct use of Tailwind's `dark:` prefix requires the custom variant.

**Primary recommendation:** Build the header as a single `BaseLayout.astro` refactor (not a separate component file) to keep the layout shell in one place. Add the FOUC script as an `is:inline` block at the top of `<head>`. Add the overlay toggle JS as a standard bundled `<script>` at the bottom of the component. Add `@custom-variant dark` to `global.css`. No new packages needed.

---

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 6.1.5 | Component authoring, layout shell, `Astro.url.pathname` | All pages already use BaseLayout; no change needed |
| Tailwind CSS | 4.2.2 | Utility classes for layout, animation, z-index, responsive breakpoints | Already wired via `@tailwindcss/vite`; `@custom-variant dark` extends it |
| TypeScript | bundled | Prop types in `.astro` frontmatter | Already active via `@astrojs/check` |

[VERIFIED: package.json in project root — all versions confirmed]

### No New Packages Needed

All interactive behavior for this phase (dark mode toggle, overlay open/close, focus trap, body scroll lock, Esc key) is achievable with vanilla JS in `<script>` blocks. The `focus-trap` npm package exists but adds ~8KB of JS for functionality that is ~20 lines of vanilla code. Given CLAUDE.md's "clean and minimal" constraint and the zero-JS-by-default ethos of Astro, hand-writing the focus trap is the correct approach here.

[ASSUMED] — focus-trap package size estimate is from training data; exact bundle size not verified this session.

### Alternatives Considered

| Recommended | Alternative | Tradeoff |
|-------------|-------------|----------|
| Vanilla JS focus trap | `focus-trap` npm package | Package adds a dependency and bundle weight for 15–20 lines of code; not justified for a single nav overlay |
| Inline SVG icons | `astro-icon` or `heroicons` | Both add packages; inline SVG (moon, sun, hamburger, X) is 4 small icons, manageable directly in `.astro` markup |
| `@custom-variant dark` in CSS | Tailwind v4 default `prefers-color-scheme` | Default does not respond to `.dark` class; custom variant is the one-line fix |

---

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)

```
src/
├── layouts/
│   └── BaseLayout.astro     # REFACTOR: full header/footer, FOUC script, overlay, toggle
├── styles/
│   └── global.css           # ADD: @custom-variant dark directive
└── pages/
    └── index.astro          # No change
```

No new component files are required. The header, overlay, footer, and toggle all live inside `BaseLayout.astro`. This keeps the "single layout shell" mental model intact and avoids prop-drilling between sibling components.

If the overlay script grows large (>50 lines), it may be extracted to `src/scripts/nav.ts` and imported as a standard `<script>` import in the component. This is a Claude's Discretion call for the implementation task.

---

### Pattern 1: FOUC Prevention — Inline Synchronous Script

**What:** An `is:inline` script tag placed as the first element inside `<head>`. It runs synchronously before the browser renders any body content, reading `localStorage['theme']` and falling back to `window.matchMedia('(prefers-color-scheme: dark)')` to decide whether to add `.dark` to `<html>` immediately.

**Why `is:inline`:** Astro's default script processing bundles scripts as ES modules with `type="module"`, which are deferred. A deferred script cannot prevent FOUC. `is:inline` tells Astro to emit the script literally, without bundling or deferral, preserving the synchronous execution that FOUC prevention requires.

[VERIFIED: docs.astro.build/en/guides/client-side-scripts/ — confirmed `is:inline` emits script literally with no transformation]

**Example:**

```astro
<!-- Source: danielnewton.dev/blog/dark-mode-astro-tailwind-fouc/ + astro-tips.dev/recipes/dark-mode/ -->
<head>
  <script is:inline>
    (function () {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>
  <!-- Google Fonts, viewport, title etc. come AFTER this script -->
</head>
```

The IIFE wrapper prevents any variable from leaking into global scope.

**CRITICAL placement rule:** This script must be the first child of `<head>`, before all `<link>` tags, including Google Fonts. Any stylesheet loaded before the script runs may briefly render without the dark class, causing a flash. [VERIFIED: multiple Astro dark mode tutorials, cross-referenced across three sources]

---

### Pattern 2: Tailwind v4 Dark Mode Class Strategy

**What:** By default, Tailwind v4's `dark:` prefix responds to `prefers-color-scheme` media query. To make `dark:` utilities respond to the `.dark` class on `<html>`, add one directive to `global.css`.

[VERIFIED: tailwindcss.com/docs/dark-mode — confirmed `@custom-variant` is the v4 mechanism]

**Example:**

```css
/* src/styles/global.css — add immediately after @import "tailwindcss"; */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

/* ... existing @theme block unchanged ... */
```

**Important nuance for this project:** Phase 1's dark mode is implemented entirely via CSS custom properties (`var(--color-*)`) with a `:root.dark {}` override block — this already works correctly without `@custom-variant`. The `@custom-variant` directive is only needed if Tailwind's `dark:` prefix is used directly on utility classes (e.g., `dark:bg-gray-900`). Given the UI-SPEC uses `bg-[var(--color-dominant)]` patterns rather than `dark:bg-*`, the existing approach is valid and `@custom-variant` may not be strictly needed. However, adding it now costs nothing and prevents a category of future bugs. [ASSUMED — whether any dark: utilities will appear in Phase 2 components is a planner/implementor decision]

---

### Pattern 3: Active Page Detection in Astro

**What:** Use `Astro.url.pathname` in the component frontmatter, compare against each nav link href, conditionally apply the active underline class.

[VERIFIED: docs.astro.build/en/tutorial/3-components/1/ — confirmed Astro.url.pathname is the standard pattern]

**Example:**

```astro
---
// In BaseLayout.astro or a NavLink component
const pathname = Astro.url.pathname;
---

<a
  href="/work"
  class:list={[
    "min-h-[44px] flex items-center relative",
    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full",
    "after:bg-[var(--color-accent)] after:transition-opacity after:duration-150",
    pathname === '/work' ? "after:opacity-100" : "after:opacity-0 hover:after:opacity-100"
  ]}
>
  Work
</a>
```

The `class:list` Astro directive accepts arrays and objects for conditional class application. [VERIFIED: docs.astro.build/en/reference/astro-syntax/]

**Edge case:** `Astro.url.pathname` on the homepage returns `'/'`. The `/work` path returns `'/work'` (no trailing slash in standard Astro static builds). Trailing slash handling depends on `trailingSlash` config — check `astro.config.mjs`. Current config has no explicit `trailingSlash` setting, so Astro's default applies. [ASSUMED — default trailingSlash behavior in Astro 6 not verified against official docs this session; planner should confirm `/work` vs `/work/`]

---

### Pattern 4: Full-Screen Overlay Navigation — Vanilla JS

**What:** A `<div>` with `position: fixed; inset: 0; z-index: 60` (above header's z-50), toggled between hidden and visible states. Managed entirely with vanilla JS in a `<script>` block (not `is:inline` — this one can be bundled normally since it doesn't need synchronous execution).

**Open/close mechanism:** Toggle a CSS class (e.g., `overlay-open` or Tailwind's `hidden`) rather than setting `display` in JS directly. Using a class keeps the animation declarative.

**Body scroll lock:** `document.body.style.overflow = 'hidden'` on open; `document.body.style.overflow = ''` on close. This works for the overlay use-case (mobile full-screen takeover). The position-fixed body approach is needed only for iOS if scroll position restoration is required — for a full-screen overlay that hides all content, simple `overflow: hidden` is sufficient. [VERIFIED: CSS-Tricks — Prevent Page Scrolling When a Modal is Open]

**Focus trap (vanilla JS):**

```javascript
// Source: hidde.blog/using-javascript-to-trap-focus-in-an-element/
function trapFocus(element) {
  const focusableSelectors = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  
  const focusableEls = element.querySelectorAll(focusableSelectors);
  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
    } else {
      if (document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    }
  });
}
```

**Return focus:** Store a reference to the hamburger button before opening the overlay, call `.focus()` on it when the overlay closes.

**Esc key:**

```javascript
document.addEventListener('keydown', function handleEsc(e) {
  if (e.key === 'Escape' && overlayIsOpen) {
    closeOverlay();
    document.removeEventListener('keydown', handleEsc);
  }
});
```

**Animation with `prefers-reduced-motion`:**

```css
/* In global.css or as Tailwind arbitrary values */
.overlay {
  transition: opacity 200ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .overlay { transition: none; }
}
```

Or via Tailwind utility: `motion-safe:transition-opacity motion-safe:duration-200`

[CITED: hidde.blog/using-javascript-to-trap-focus-in-an-element/ — focus trap pattern]

---

### Pattern 5: Sticky Header with Scroll-State Backdrop

**What:** The header is already `sticky top-0 z-50` from Phase 1. The backdrop-blur and 95% opacity background is also already implemented. No scroll-state detection is strictly needed for Phase 2 — the header background is always semi-transparent with blur per the UI-SPEC. The UI-SPEC distinguishes "pre-scroll" (dominant color) and "scrolled" (secondary color at 95% opacity) states — however, this is listed as a Claude's Discretion refinement, not a locked requirement. Phase 2 success criteria do not include a scroll-triggered background change.

[ASSUMED — whether the planner decides to implement scroll-state header changes or leave the static backdrop is discretionary]

If scroll-state is implemented: use `IntersectionObserver` on a sentinel element at the top of the page (zero-height div above the header), or a `scroll` event listener that adds/removes a CSS class on the header element.

---

### Pattern 6: Footer Two-Column Grid

**What:** CSS Grid with `grid-cols-1 md:grid-cols-2` for responsive stacking. The existing footer is a single-column layout that needs to be replaced.

**Example:**

```astro
<footer class="bg-[var(--color-secondary)] py-[var(--spacing-2xl)]">
  <div class="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-xl)]">
      <!-- Left: CTA -->
      <div>
        <p class="text-[1.5rem] font-semibold leading-[1.25] text-[var(--color-text-primary)]">
          Let's work together.
        </p>
        <a href="mailto:tanyazakus2106@gmail.com"
           class="mt-[var(--spacing-md)] inline-block text-[var(--color-accent)] hover:underline">
          Get in touch →
        </a>
      </div>
      <!-- Right: Nav links -->
      <nav aria-label="Footer navigation">
        <ul class="flex flex-col gap-[var(--spacing-sm)]">
          <li><a href="/work">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/resume.pdf">Resume</a></li>
          <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
      </nav>
    </div>
    <p class="mt-[var(--spacing-xl)] text-sm text-[var(--color-text-secondary)]">
      © 2026 Tanya Zakus
    </p>
  </div>
</footer>
```

---

### Anti-Patterns to Avoid

- **Deferred FOUC script:** Using a regular `<script>` (without `is:inline`) for the theme init script. Astro bundles these as `type="module"`, which is deferred — the dark class will be applied after first paint, causing a visible flash. Always use `is:inline` for the FOUC prevention script only.
- **Hardcoded colors in components:** Using `bg-gray-900` or `text-white` instead of `bg-[var(--color-dominant)]` etc. Breaks dark mode because hardcoded Tailwind colors don't respond to CSS custom property changes.
- **Missing `aria-expanded` on hamburger:** Screen readers will not announce the state of the button without this attribute toggling between `true` and `false`.
- **Overlay without `role="dialog" aria-modal="true"`:** Without these, screen readers may still navigate to content behind the overlay.
- **Applying `overflow: hidden` to `<html>` instead of `<body>`:** Some iOS scroll-lock techniques target `<html>`, which can interact unexpectedly with the dark mode class on `<html>`. Target `<body>` only.
- **Using `display: none` for overlay animation:** `display: none` cannot be transitioned. Use `opacity` + `pointer-events-none` to hide/show while preserving animation capability.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| `@custom-variant dark` | Custom CSS class toggling logic without Tailwind variant | One-line `@custom-variant` in CSS | The variant makes dark: prefix work consistently across all utilities |
| Active link detection | JS-based scroll/path watchers | `Astro.url.pathname` in frontmatter | Server-side comparison at build time — no JS needed, no flickering |
| FOUC prevention | Any async/deferred approach | Synchronous `is:inline` script | Async runs too late; FOUC is inevitable |

**Key insight:** The most common mistake in Astro dark mode implementations is using a regular `<script>` tag (which Astro defers as a module) for the theme init. This is the one place in the entire codebase that must use `is:inline`.

---

## Common Pitfalls

### Pitfall 1: Tailwind `dark:` Utilities Silently Not Working

**What goes wrong:** Developer writes `dark:bg-[#0F0F0F]` or `dark:text-white`, toggles `.dark` on `<html>`, nothing happens.
**Why it happens:** Tailwind v4 defaults `dark:` to respond to `prefers-color-scheme` media query. The `.dark` class on `<html>` has no effect unless `@custom-variant dark (&:where(.dark, .dark *))` is declared in the CSS.
**How to avoid:** Add the `@custom-variant` directive to `global.css` before any component uses `dark:` prefix utilities. This project uses `var(--color-*)` patterns today, but adding the variant now prevents silent failures later.
**Warning signs:** Toggling the class in browser DevTools changes the CSS variable values (visible in computed styles) but no Tailwind `dark:` utility classes respond.

[VERIFIED: tailwindcss.com/docs/dark-mode — confirmed @custom-variant mechanism]

### Pitfall 2: FOUC on Hard Reload When User Prefers Dark

**What goes wrong:** User has selected dark mode, refreshes page, sees brief flash of light mode before JS runs.
**Why it happens:** The FOUC prevention script runs after CSS is parsed but before paint only if it is synchronous. Any async loading (regular `<script>`, deferred, or after a `<link>` tag) breaks this.
**How to avoid:** `is:inline` script placed as the absolute first child of `<head>`. Test by throttling CPU in DevTools and hard-refreshing with dark preference set.
**Warning signs:** Flash of white background visible during page load in dark mode.

[CITED: danielnewton.dev/blog/dark-mode-astro-tailwind-fouc/]

### Pitfall 3: Overlay Focus Escapes to Background

**What goes wrong:** Keyboard user opens the overlay, presses Tab past the last nav link, and focus moves to elements behind the overlay (in the page body or header).
**Why it happens:** No focus trap implemented — Tab key cycles the full document tabindex order.
**How to avoid:** Implement the vanilla JS focus trap described in Pattern 4. Test with keyboard-only navigation.
**Warning signs:** After last link in overlay, Tab moves focus outside the overlay.

### Pitfall 4: Body Scroll Lock Not Restored on Close

**What goes wrong:** After closing the overlay, the page body remains unscrollable.
**Why it happens:** The overlay close function sets `overflow: hidden` on open but the restore call (`overflow = ''`) is missing or only on one of the three close paths (X button, backdrop click, Esc key).
**How to avoid:** Extract scroll lock/unlock into two functions (`lockScroll()` / `unlockScroll()`) called from a single `closeOverlay()` function. All three close gestures call `closeOverlay()`.
**Warning signs:** Scrolling stops working after opening and closing the overlay.

### Pitfall 5: Active Class on Nested Routes

**What goes wrong:** `/work/project-alpha` also highlights "Work" as active — or doesn't, depending on exact string match.
**Why it happens:** `pathname === '/work'` is an exact match. A sub-path `/work/project-alpha` won't match.
**How to avoid:** Use `pathname.startsWith('/work')` for the Work link specifically so case study pages also highlight the parent nav item. Use exact match for standalone pages (About, etc.).
**Warning signs:** Visiting a case study page shows no active nav link.

### Pitfall 6: LinkedIn URL Placeholder

**What goes wrong:** The LinkedIn nav link points to `https://linkedin.com` (the placeholder from Phase 1 BaseLayout).
**Why it happens:** Phase 1 left a placeholder URL.
**How to avoid:** Replace with the actual LinkedIn profile URL in this phase's implementation. The URL is not documented in CONTEXT.md or UI-SPEC — implementor must confirm with Tanya or use a data attribute / constant that can be updated in one place.
**Warning signs:** LinkedIn link navigates to linkedin.com homepage rather than Tanya's profile.

[ASSUMED — actual LinkedIn URL not available in any planning document]

---

## Code Examples

### FOUC Prevention Script (complete, production-ready)

```astro
<!-- Placement: first child of <head> in BaseLayout.astro, before all <link> tags -->
<!-- Source: danielnewton.dev/blog/dark-mode-astro-tailwind-fouc/ + cross-verified -->
<script is:inline>
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // localStorage may be unavailable in private browsing on some browsers
    }
  })();
</script>
```

The `try/catch` handles the edge case where `localStorage` throws (Safari private mode with cookies blocked).

### Dark Mode Toggle Script (bundled, not inline)

```astro
<!-- Placement: bottom of BaseLayout.astro, standard <script> tag -->
<script>
  const toggle = document.getElementById('theme-toggle');
  
  function updateToggleIcon(isDark: boolean) {
    const moon = document.getElementById('icon-moon');
    const sun = document.getElementById('icon-sun');
    moon?.classList.toggle('hidden', isDark);
    sun?.classList.toggle('hidden', !isDark);
  }
  
  // Initialize icon state on load
  const isDark = document.documentElement.classList.contains('dark');
  updateToggleIcon(isDark);
  
  toggle?.addEventListener('click', () => {
    const nowDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', nowDark ? 'dark' : 'light');
    updateToggleIcon(nowDark);
  });
</script>
```

### global.css Addition

```css
/* Add immediately after @import "tailwindcss"; — Source: tailwindcss.com/docs/dark-mode */
@custom-variant dark (&:where(.dark, .dark *));
```

### Overlay HTML Structure (accessibility-complete)

```astro
<!-- Full-screen overlay -->
<div
  id="nav-overlay"
  role="dialog"
  aria-modal="true"
  aria-label="Navigation"
  class="fixed inset-0 z-[60] bg-[var(--color-dominant)] flex items-center justify-center
         opacity-0 pointer-events-none transition-opacity duration-200
         motion-reduce:transition-none"
>
  <!-- Close button -->
  <button
    id="overlay-close"
    aria-label="Close navigation"
    class="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center"
  >
    <!-- X SVG icon -->
  </button>
  
  <!-- Nav links -->
  <nav aria-label="Mobile navigation">
    <ul class="flex flex-col items-center gap-[var(--spacing-xl)]">
      <li><a href="/work" class="text-[2rem] font-semibold min-h-[44px] flex items-center">Work</a></li>
      <li><a href="/about" class="text-[2rem] font-semibold min-h-[44px] flex items-center">About</a></li>
      <li><a href="/resume.pdf" class="text-[2rem] font-semibold min-h-[44px] flex items-center">Resume</a></li>
      <li>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
           class="text-[2rem] font-semibold min-h-[44px] flex items-center">LinkedIn</a>
      </li>
    </ul>
  </nav>
</div>
```

### Overlay JavaScript (overlay open/close, focus trap, scroll lock)

```javascript
// Source: vanilla JS pattern, cross-verified from hidde.blog and CSS-Tricks
const overlay = document.getElementById('nav-overlay');
const hamburger = document.getElementById('hamburger');
const overlayClose = document.getElementById('overlay-close');
let previouslyFocused = null;

function openOverlay() {
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  overlay.classList.add('opacity-100');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
  previouslyFocused = document.activeElement;
  // Move focus into overlay
  overlayClose.focus();
  // Attach Esc listener
  document.addEventListener('keydown', handleEsc);
}

function closeOverlay() {
  overlay.classList.add('opacity-0', 'pointer-events-none');
  overlay.classList.remove('opacity-100');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
  // Return focus
  previouslyFocused?.focus();
  document.removeEventListener('keydown', handleEsc);
}

function handleEsc(e) {
  if (e.key === 'Escape') closeOverlay();
}

// Focus trap
const focusableEls = overlay.querySelectorAll('a[href], button');
const firstEl = focusableEls[0];
const lastEl = focusableEls[focusableEls.length - 1];
overlay.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  if (e.shiftKey && document.activeElement === firstEl) {
    e.preventDefault(); lastEl.focus();
  } else if (!e.shiftKey && document.activeElement === lastEl) {
    e.preventDefault(); firstEl.focus();
  }
});

// Backdrop click (click outside link group)
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeOverlay();
});

hamburger.addEventListener('click', openOverlay);
overlayClose.addEventListener('click', closeOverlay);
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 `darkMode: 'class'` in `tailwind.config.js` | `@custom-variant dark` in CSS | Tailwind v4 (2025) | Config file removed; CSS-first approach |
| Astro `<script>` bundles as module (deferred) | `is:inline` for synchronous scripts | Astro 2+ | FOUC prevention must use `is:inline` |
| `classList.toggle('dark', condition)` applied in body | Applied in `<head>` synchronously | Best practice evolved ~2023–2024 | FOUC eliminated |

**Deprecated/outdated:**
- `tailwind.config.js` `darkMode: 'class'` setting: Does not exist in Tailwind v4. Use `@custom-variant dark` in CSS.
- `Astro.request.url.pathname`: Replaced by `Astro.url.pathname` in Astro 2+. Current project uses Astro 6 — `Astro.url.pathname` is correct.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `focus-trap` npm package is ~8KB bundle size | Standard Stack | Minor — decision to avoid the package is still correct on principle; exact size doesn't change recommendation |
| A2 | Whether `dark:` prefix utilities will appear in Phase 2 component markup | Pattern 2 | Low — the `@custom-variant` addition costs nothing; not adding it could create silent bugs if any implementor uses `dark:` utilities |
| A3 | Astro 6 default `trailingSlash` means `/work` paths have no trailing slash | Pattern 3 | Medium — if trailing slashes are added by Cloudflare Pages rewrite rules, `pathname === '/work'` would fail; use `pathname.startsWith('/work')` as a defensive measure |
| A4 | LinkedIn profile URL is not yet available in planning docs | Pitfall 6 | Low for functionality — link still navigates somewhere; but incorrect URL is a content error visible on launch |
| A5 | Scroll-state header (secondary color on scroll) is a discretionary refinement, not a Phase 2 requirement | Pattern 5 | Low — UI-SPEC mentions it but Phase 2 success criteria do not; planner should confirm whether to include |

---

## Open Questions

1. **LinkedIn profile URL**
   - What we know: Placeholder `https://linkedin.com` is in BaseLayout from Phase 1
   - What's unclear: Tanya's actual LinkedIn profile URL is not documented anywhere in the planning files
   - Recommendation: Planner should add a task to replace the URL, with a note to confirm the actual URL with Tanya before implementation completes

2. **`@custom-variant dark` vs. CSS-variable-only approach**
   - What we know: Current `global.css` uses `:root.dark {}` to override CSS custom properties. This works without `@custom-variant`. The directive is only needed if `dark:` prefix utilities are used directly.
   - What's unclear: Whether Phase 2 implementation will use `dark:bg-*` Tailwind utilities or stay exclusively on `bg-[var(--color-*)]` patterns
   - Recommendation: Add `@custom-variant dark` as a Wave 0 task regardless — it is a one-line addition that prevents a category of future bugs

3. **Scroll-state header color change**
   - What we know: UI-SPEC distinguishes pre-scroll (dominant) and scrolled (secondary) header backgrounds. Success criteria for Phase 2 do not mention this distinction.
   - What's unclear: Is this a Phase 2 requirement or a Phase 5 (polish) refinement?
   - Recommendation: Treat as Claude's Discretion for the planner; implement the static semi-transparent backdrop (already done in Phase 1) and skip scroll-state detection unless the planner explicitly includes it

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Astro dev server / build | ✓ | ≥22.12.0 (engines field) | — |
| Astro 6.1.5 | All Phase 2 components | ✓ | 6.1.5 | — |
| Tailwind CSS 4.2.2 | All styling | ✓ | 4.2.2 | — |
| @tailwindcss/vite | Tailwind v4 Vite integration | ✓ | ^4.2.2 | — |
| @astrojs/mdx | MDX content (not used in Phase 2) | ✓ | ^5.0.3 | — |

[VERIFIED: package.json — all dependencies confirmed present]

No missing dependencies. Phase 2 requires no new npm installs.

---

## Validation Architecture

`workflow.nyquist_validation` is `true` in `.planning/config.json` — this section is required.

### Test Framework

Phase 2 is entirely visual/interactive browser UI. There is no existing test infrastructure (no `tests/` directory, no `vitest.config.*`, no `playwright.config.*`). Automated unit testing of Astro components is possible with `@astrojs/check` (type-checking) and Playwright/Cypress for e2e, but installing a full e2e framework is out of scope for this phase.

The pragmatic validation strategy: manual browser smoke checks documented as a checklist, plus `astro build` as the automated gate (catches type errors and broken imports).

| Property | Value |
|----------|-------|
| Framework | Astro Check (`astro check`) — type-checking only |
| Config file | No dedicated test config; `@astrojs/check` reads `tsconfig.json` |
| Quick run command | `npm run typecheck` |
| Full suite command | `npm run build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| NAV-01 | Sticky header with logo and nav links renders | smoke | `npm run build` | Build failure catches missing component or type error |
| NAV-02 | Dark mode toggle persists to localStorage | manual | — | Requires browser interaction; verify: toggle → refresh → check class on `<html>` |
| NAV-03 | Hamburger opens full-screen overlay on mobile | manual | — | Requires viewport resize and click interaction |
| NAV-04 | Active page highlighted in nav | manual | — | Navigate to each page, verify underline on correct link |
| FOOT-01 | Footer renders all four nav links | smoke | `npm run build` | Build catches missing markup; visual check confirms links |
| FOOT-02 | Footer has LinkedIn and email social links | smoke / manual | `npm run build` | Build confirms presence; manual check confirms correct URLs |
| FOOT-03 | "Get in touch" CTA links to correct mailto | manual | — | Click CTA, verify mailto:tanyazakus2106@gmail.com opens email client |
| POL-02 | No FOUC on dark mode hard reload | manual | — | Set dark in localStorage, hard refresh, visually confirm no white flash |
| POL-03 | Typography scale consistent | manual | — | Visual check across all headings/body text in both modes |
| POL-04 | Spacing rhythm consistent | manual | — | Visual check for consistent padding/gap between sections |

### Sampling Rate

- **Per task commit:** `npm run typecheck` — catches TypeScript/prop errors in `.astro` files
- **Per wave merge:** `npm run build` — full static build; confirms all pages compile, no broken imports
- **Phase gate:** `npm run build` green + manual browser smoke checklist passed before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] No automated browser tests exist. For this phase, manual smoke testing is the validation method. This is acceptable given the purely visual/interactive nature of Phase 2 deliverables and the absence of existing test infrastructure.
- [ ] If e2e testing is desired in a future phase, Playwright can be added with `npm init playwright@latest`. Not required for Phase 2.

---

## Security Domain

This phase has no authentication, user input, data storage, or API calls. The only security-relevant element is the external LinkedIn link which must use `rel="noopener noreferrer"` (already specified in UI-SPEC). No ASVS categories apply beyond the baseline.

| ASVS Category | Applies | Note |
|---------------|---------|------|
| V2 Authentication | No | No auth in this phase |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | Public pages only |
| V5 Input Validation | No | No user input forms |
| V6 Cryptography | No | No sensitive data |

**External links:** All `target="_blank"` links must include `rel="noopener noreferrer"` — already specified in UI-SPEC for LinkedIn link. [CITED: 02-UI-SPEC.md — Footer component spec]

---

## Sources

### Primary (HIGH confidence)
- [docs.astro.build/en/guides/client-side-scripts/](https://docs.astro.build/en/guides/client-side-scripts/) — `is:inline` behavior, script bundling, module deferral
- [tailwindcss.com/docs/dark-mode](https://tailwindcss.com/docs/dark-mode) — `@custom-variant dark` directive for class-based dark mode in v4
- [docs.astro.build/en/tutorial/3-components/1/](https://docs.astro.build/en/tutorial/3-components/1/) — `Astro.url.pathname` active link pattern
- `package.json` in project root — confirmed all package versions (Astro 6.1.5, Tailwind 4.2.2)
- `src/layouts/BaseLayout.astro` — confirmed Phase 1 output: existing header structure, FOUC script absent
- `src/styles/global.css` — confirmed Phase 1 output: `:root.dark {}` present, `@custom-variant` absent

### Secondary (MEDIUM confidence)
- [danielnewton.dev/blog/dark-mode-astro-tailwind-fouc/](https://www.danielnewton.dev/blog/dark-mode-astro-tailwind-fouc/) — FOUC prevention inline script pattern for Astro + Tailwind
- [astro-tips.dev/recipes/dark-mode/](https://astro-tips.dev/recipes/dark-mode/) — Astro dark mode implementation with localStorage and system preference
- [hidde.blog/using-javascript-to-trap-focus-in-an-element/](https://hidde.blog/using-javascript-to-trap-focus-in-an-element/) — Vanilla JS focus trap implementation
- [css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/](https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/) — Body scroll lock for modals

### Tertiary (LOW confidence / ASSUMED)
- `focus-trap` npm package bundle size (~8KB) — training data estimate, not verified this session

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against package.json; no new packages needed
- Architecture patterns: HIGH — FOUC script and dark mode variant verified against official docs; overlay pattern cross-verified from three sources
- Active page detection: HIGH — Astro.url.pathname confirmed in official docs
- Pitfalls: HIGH — Tailwind v4 dark variant behavior verified against official docs; FOUC behavior verified
- Accessibility patterns: MEDIUM — focus trap and aria patterns cited from credible sources but not verified against current WCAG specification this session

**Research date:** 2026-04-15
**Valid until:** 2026-05-15 (Astro and Tailwind are stable; dark mode patterns are not changing rapidly)
