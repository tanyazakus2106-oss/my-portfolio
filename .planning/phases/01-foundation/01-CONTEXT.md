# Phase 1: Foundation - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold the full technical foundation: Astro 6 project with Tailwind CSS v4 + MDX, define the typed content schema, create the root layout shell with header and footer slots, and wire up a Cloudflare Pages preview deploy. No user-visible content pages are delivered in this phase. Everything built here — tokens, schema, layout shell, deploy pipeline — is inherited by all downstream phases.

</domain>

<decisions>
## Implementation Decisions

### Deployment platform
- **D-01:** Cloudflare Pages is the deployment target (not Vercel). FOUND-04 = Cloudflare Pages preview deploy on push to main.
- **D-02:** A note in STATE.md referenced Vercel Pro — this is superseded. Cloudflare Pages free tier is confirmed (unlimited bandwidth, no commercial use restrictions).
- **D-03:** Preview deploy triggered by pushing to the `main` branch.

### Placeholder content
- **D-04:** Include 2 placeholder MDX project files in `src/content/projects/` with all required frontmatter fields populated (realistic but dummy data). Purpose: validate that `content.config.ts` schema compiles, `getCollection('projects')` returns data, and the build passes end-to-end before real case studies exist.
- **D-05:** Placeholder files should use clearly fake names (e.g., "Project Alpha", "Project Beta") so they're easily identified and replaced in Phase 3.

### Design token system (from UI-SPEC — locked)
- **D-06:** Typography: DM Sans for both heading (600/Semibold) and body (400/Regular). JetBrains Mono optional for code snippets in case studies — only load if needed. Phase 1 implements weights 400 and 600 only.
- **D-07:** Full spacing scale (xs 4px → 4xl 96px) declared in `global.css` under `@theme`. All multiples of 4.
- **D-08:** Complete light and dark mode color palette declared in Phase 1 even though the dark mode toggle is built in Phase 2. Both `@media (prefers-color-scheme: dark)` and `.dark` class layers declared from the start.
- **D-09:** Accent color (`#2563EB` light / `#3B82F6` dark) reserved strictly for: active nav indicator, primary CTA button, text link underlines on hover, focus rings, and per-project accent overrides in Phase 3.

### Content schema (from UI-SPEC — locked)
- **D-10:** `content.config.ts` validates these frontmatter fields: `title` (string, required), `slug` (string, required), `role` (string, required), `accentColor` (string, required), `thumbnail` (image(), required), `skills` (string[], required), `summary` (string, required), `publishDate` (date, required), `featured` (boolean, optional, default false).

### Layout shell (from UI-SPEC — locked)
- **D-11:** `src/layouts/BaseLayout.astro` — max content width 1200px centered (`mx-auto`), page horizontal padding 24px mobile / 48px tablet+ / 64px desktop, header height 64px fixed, header `sticky top-0 z-50`, header background dominant color at 95% opacity + `backdrop-blur-sm`.
- **D-12:** Footer background is secondary color, 48px vertical padding.
- **D-13:** Landmark regions: `<header>`, `<main>`, `<footer>` — required for accessibility from day one.
- **D-14:** Touch targets in nav must be minimum 44px height via padding (not by adjusting tokens) — this is baked into Phase 1's header to satisfy Phase 5 RESP-03.
- **D-15:** `<html lang="en">` and viewport meta tag included in BaseLayout.

### Claude's Discretion
- Dev tooling setup (Prettier + prettier-plugin-astro + @astrojs/check) — include if straightforward alongside scaffold, otherwise defer
- Git branch strategy details
- Exact Cloudflare Pages project setup steps (dashboard vs. CLI)
- File/directory structure beyond what's specified above

</decisions>

<specifics>
## Specific Ideas

- Placeholder project files should use all required frontmatter fields with realistic-looking dummy values so downstream phases can rely on the schema shape being correct
- The design token system declared in Phase 1 is the single source of truth — later phases extend but do not contradict these values

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Stack and configuration
- `CLAUDE.md` — Full technology stack, version constraints, what NOT to use, Tailwind v4 CSS variable approach, Formspree contact form, Cloudflare Pages hosting rationale

### Phase requirements
- `.planning/REQUIREMENTS.md` — FOUND-01, FOUND-02, FOUND-03, FOUND-04 (Foundation & Setup requirements)
- `.planning/ROADMAP.md` §Phase 1 — Goal, success criteria, and dependency chain

### Visual and design contract
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Complete design token system: typography, spacing scale, color palette (light + dark), layout shell constraints, content schema contract, copywriting for shell elements. This is the authoritative design contract for Phase 1 — all token values must match exactly.

### Project context
- `.planning/PROJECT.md` — Core value, constraints (no CMS, clean/minimal aesthetic, owner edits code directly)
- `.planning/STATE.md` — Current decisions log, known blockers (content readiness concern)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — project directory is a blank slate. Phase 1 creates all foundational files from scratch.

### Established Patterns
- None yet — this phase establishes the patterns that all subsequent phases follow.

### Integration Points
- `src/layouts/BaseLayout.astro` → all pages in Phases 2–6 wrap with this layout
- `src/content/projects/` + `src/content.config.ts` → content schema powers Phases 3–5
- `src/styles/global.css` → design tokens cascade to all components in all phases

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-12*
