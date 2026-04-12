# Phase 2: Navigation & Design System - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the persistent UI shell every page shares: sticky header with dark/light mode toggle and active page indicator, mobile hamburger that opens a full-screen overlay navigation, a two-column footer with CTA and mirrored nav links, and consistent application of the design token system (typography, spacing, colors) across all components. No new content pages in this phase — only the shared chrome and token consistency.

</domain>

<decisions>
## Implementation Decisions

### Dark mode toggle

- **D-01:** First-visit default = system preference. Read `prefers-color-scheme` on first load. If no `localStorage` key is set, respect the OS theme. Once the user manually toggles, save their choice to `localStorage` and use that on all subsequent visits.
- **D-02:** FOUC prevention is mandatory. An inline `<script>` in `<head>` (before any CSS or body renders) must read `localStorage` and conditionally add the `.dark` class to `<html>` synchronously. This prevents the flash of wrong theme on page load (POL-02).
- **D-03:** Toggle position: rightmost element in the header, after the nav links.
- **D-04:** Toggle icon: sun/moon swap. In light mode → show moon icon (click to go dark). In dark mode → show sun icon (click to go light). Simple, universally understood.

### Header navigation

- **D-05:** Desktop (≥768px): inline nav links visible in header — Work, About, Resume, LinkedIn. No hamburger on desktop.
- **D-06:** Mobile (<768px): inline nav links hidden, hamburger icon shown in header (+ logo + dark toggle).
- **D-07:** Hamburger triggers full-screen overlay navigation on mobile only (not all viewports — the requirement says "all viewports" but the user decision is mobile-only; inline nav handles desktop).
- **D-08:** Active page indicator: accent-colored underline beneath the active nav link. Same underline style appears on hover for non-active links. Accent colors locked: `#2563EB` (light) / `#3B82F6` (dark) per D-09 from Phase 1.

### Overlay navigation (mobile)

- **D-09:** Overlay content: nav links only (Work, About, Resume, LinkedIn) — large type, vertically and horizontally centered. No social links in the overlay.
- **D-10:** Open animation: fade in from transparent. Close animation: fade out. Quick duration (200–250ms). Does not distract from the links.
- **D-11:** Close gestures (all three required):
  1. X button visible in top-right of overlay
  2. Clicking the backdrop (anywhere outside the link group) closes the overlay
  3. Esc key closes the overlay (keyboard accessibility)
- **D-12:** While overlay is open, body scroll is locked (`overflow: hidden` on `<body>`).

### Footer

- **D-13:** Footer layout: two-column grid.
  - Left column: "Let's work together." heading (semibold) + "Get in touch →" link wired to `mailto:tanyazakus2106@gmail.com`
  - Right column: stacked nav links mirroring the header — Work, About, Resume, LinkedIn (FOOT-01 + FOOT-02)
- **D-14:** Footer contact email: `tanyazakus2106@gmail.com`
- **D-15:** Footer social links (FOOT-02): LinkedIn (external link, target blank) and email (`mailto:`) — these live in the left column near the CTA, or as small icon links below the nav column. Implementation detail to resolve in planning.
- **D-16:** Footer closing line / copyright stays: "© 2026 Tanya Zakus" at the bottom (already in BaseLayout).

### Design token consistency (POL-02, POL-03, POL-04)

- **D-17:** All components in this phase use CSS custom properties from `global.css` (via `var(--color-*)`, `var(--spacing-*)`, `var(--font-*)`). No hardcoded color or spacing values.
- **D-18:** Typography scale (POL-03): DM Sans 400 body, 600 semibold headings — applied via `font-sans` and explicit `font-semibold` classes. No new font weights introduced.
- **D-19:** Spacing rhythm (POL-04): All padding/margin/gap uses the declared spacing tokens (`--spacing-xs` through `--spacing-4xl`). No arbitrary pixel values outside the 4px base scale.

### Claude's Discretion

- Exact Tailwind utility classes for the overlay (positioning, z-index layering)
- Whether the hamburger icon is inline SVG or a library icon
- Whether to use Astro's `<script>` or a separate `.ts` file for the dark mode toggle logic
- Exact breakpoint where inline nav collapses to hamburger (768px is implied by `md:` prefix but can be adjusted)
- Footer column proportions and responsive stacking behavior

</decisions>

<specifics>
## Specific Ideas

- The FOUC prevention script is critical for POL-02. It must run synchronously before any rendering — async or deferred script will not prevent the flash.
- The overlay must lock body scroll while open to prevent background scroll on iOS.
- All three close gestures (X button, backdrop, Esc) are required — this is an accessibility and UX baseline.
- Contact email: `tanyazakus2106@gmail.com` — wire this into both the footer "Get in touch" link and anywhere else an email CTA appears.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project constraints and stack
- `CLAUDE.md` — Technology stack, version constraints, what NOT to use, Tailwind v4 approach

### Phase requirements
- `.planning/REQUIREMENTS.md` — NAV-01, NAV-02, NAV-03, NAV-04, FOOT-01, FOOT-02, FOOT-03, POL-02, POL-03, POL-04
- `.planning/ROADMAP.md` §Phase 2 — Goal, success criteria, dependency on Phase 1

### Phase 1 decisions (inherit)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Design token decisions D-06 through D-15 (typography, spacing, colors, layout shell constraints, touch targets — all carry forward)
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Authoritative design token values (exact hex codes, spacing values, font families)

### Existing code to extend
- `src/layouts/BaseLayout.astro` — Current layout shell: header, main slot, footer. Phase 2 refactors this file significantly.
- `src/styles/global.css` — Design token system. Dark mode `.dark` class layer already declared. Phase 2 adds component-level styles if needed.

### Project context
- `.planning/PROJECT.md` — Core value, constraints (clean/minimal aesthetic, work-forward)
- `.planning/STATE.md` — Current project state and decisions log

</canonical_refs>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-navigation-design-system*
*Context gathered: 2026-04-12*
