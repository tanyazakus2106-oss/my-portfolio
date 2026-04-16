# Phase 3: Work Index & Case Studies - Context

**Gathered:** 2026-04-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the three content surfaces that are the portfolio's reason for existing:

1. **Homepage** — Replace the current placeholder `index.astro` with a confident hero section (name, role, availability) and a featured-projects block below it.
2. **/work page** — A new `src/pages/work.astro` listing all case studies as numbered, alternating-layout cards with hover interactions and scroll-entrance animations.
3. **/projects/[slug] pages** — Dynamic case study route rendering each MDX project file with a structured text header, 4-section body (Problem / My Role / Process / Outcome), constrained images, full-bleed image support, and next/prev navigation at the bottom.

Content shipped in Phase 3 is **placeholder** — real case study MDX files are added by Tanya after the templates are built.

</domain>

<decisions>
## Implementation Decisions

### Hero — Copy & Availability

- **D-01:** Availability status: "Open to full-time & freelance" — surface this on the homepage hero (badge, single line, or inline text — Claude's discretion on exact presentation).
- **D-02:** Hero tone: Confident and professional. No greeting ("Hi, I'm…"). A direct statement of what Tanya does and who she does it for.
- **D-03:** Specialty to highlight: Product design (end-to-end UX) — research → wireframes → prototyping → handoff.
- **D-04:** Claude drafts the hero headline and sub-line; Tanya refines the final copy by editing the component. Draft should be confident, specific, and non-generic (not "I design beautiful experiences").
- **D-05:** Featured projects below hero — Claude picks the display approach. Recommended: a 2–3 column compact preview grid (thumbnail + title + role tag, filtered by `featured: true`), followed by a "View all work →" link. Simpler than the full work-index cards — this is a preview, not the full list.

### Work Index Cards — Layout & Hover

- **D-06:** Alternating image+text layout (WORK-03): 60% image / 40% text column on desktop. Image is left on odd rows, right on even rows.
- **D-07:** Hover interaction (WORK-05): Image thumbnail scales to ~1.05 + card receives a subtle box-shadow elevation. The scale applies to the image only (inside `overflow: hidden` wrapper), not the whole card row. Static number — the large muted project number (01, 02…) does not change on hover.
- **D-08:** Hover transition duration: 250–300ms ease-out. Consistent with the overall smooth, unhurried aesthetic.
- **D-09:** Card CTA: "View case study →" (or "View project →") link always visible at the bottom of the text column. Not a hover-only reveal. The entire card row is also wrapped in an anchor, but the explicit link provides a clear affordance.
- **D-10:** Card anatomy per row: project number (large, muted), thumbnail (60% column), text column (40%) containing: title, role tag, skills tags, short summary, and the always-visible CTA link.

### Case Study Page — Structure & Layout

- **D-11:** Page structure follows the provided reference (Microsoft Edge case study screenshot):
  - `← Back to work` back link at the very top
  - Skills / role as small-caps uppercase category labels (e.g. `UX DESIGN, PROTOTYPING`)
  - Large project title (H1)
  - One-line summary tagline (from `summary` frontmatter field)
  - Metadata block: Timeline (start–end dates from `publishDate`), Team/Company, My Role
  - Project image/screenshot below the text header block
  - Then the 4 content sections
- **D-12:** Layout: Single centered column. No sidebar. Content width ~760–800px centered within the 1200px max-width layout.
- **D-13:** First project image: constrained to the text column width (not full-bleed). Full-bleed option available via a custom MDX component (Claude decides the exact component/syntax — Claude's discretion on authoring pattern, but must be documented in a comment in the MDX placeholder).
- **D-14:** Section headings (Problem / My Role / Process / Outcome): Muted label style — small-caps or uppercase, text-secondary color. Matches the "TIMELINE" label style in the reference screenshot. **Not** the project accent color.
- **D-15:** Project accent color is **not used** on case study detail pages. The accent color system (WORK-04) applies to the work index cards only. Case study pages use global design tokens throughout. This overrides the "detail page" portion of WORK-04 and CASE-03.
- **D-16:** Next/prev project navigation at the bottom of each case study page — arrow links "← Previous project" / "Next project →". Ordered by `publishDate` (descending) to match the work index sort order.
- **D-17:** No real case study content in Phase 3. Executor updates the placeholder MDX files (`project-alpha.mdx`, `project-beta.mdx`) with richer placeholder content that demonstrates all template sections. Real content is added by Tanya post-Phase 3.

### Scroll Animations — Style & Behavior

- **D-18:** Animation style: fade-up — element starts at `opacity: 0` + `translateY: 24px` (Claude-chosen offset that feels subtle but perceptible), animates to `opacity: 1` + `translateY: 0`.
- **D-19:** Animation library: Claude decides. Recommended: vanilla `IntersectionObserver` + CSS transitions/animations. Zero runtime dependency, aligns with Astro's zero-JS-by-default approach. The observer adds a class (`is-visible`) when the element enters the viewport; CSS handles the transition.
- **D-20:** What animates: (a) Work index cards as they enter the viewport (WORK-06), and (b) Case study section blocks (Problem, My Role, Process, Outcome) as the user scrolls down.
- **D-21:** Stagger: 50–80ms delay between items in the same viewport batch. Cards on the work index stagger in sequence.
- **D-22:** Animation duration: 500–600ms ease-out for the fade-up itself (not the stagger delay).
- **D-23:** `prefers-reduced-motion` respected (POL-01): when the media query matches, all animations are disabled — elements render in their final visible state immediately.

### Claude's Discretion

- Exact hero component structure (whether availability is a badge, inline text, or a `<span>` — Claude picks what looks polished)
- Featured projects display approach on homepage (grid layout, card size, spacing — Claude picks, filtered by `featured: true`)
- Full-bleed image authoring pattern in MDX (component name, props, wrapper approach)
- `IntersectionObserver` implementation details (threshold, rootMargin, whether it's a shared Astro component or an inline `<script>`)
- Easing curve for fade-up animation (ease-out or cubic-bezier — Claude picks what feels smooth at 500–600ms)
- `/work` page route file name and location (`src/pages/work.astro`)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project constraints and stack
- `CLAUDE.md` — Technology stack, version constraints, what NOT to use, Tailwind v4 `@theme` approach, Astro Content Collections

### Phase requirements
- `.planning/REQUIREMENTS.md` — HERO-01, HERO-02, HERO-03, WORK-01 through WORK-06, CASE-01 through CASE-05, POL-01
- `.planning/ROADMAP.md` §Phase 3 — Goal, success criteria, dependency on Phase 2

### Phase 1 decisions (inherit — design tokens)
- `.planning/phases/01-foundation/01-CONTEXT.md` — D-06 (typography: DM Sans 400/600), D-07 (spacing tokens), D-08 (color system), D-09 (accent color usage rules), D-10 (content schema), D-11 (layout shell constraints)
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Authoritative token values (exact hex codes, spacing values, font families)

### Phase 2 decisions (inherit — styling conventions)
- `.planning/phases/02-navigation-design-system/02-CONTEXT.md` — D-17 (token-only styling, no hardcoded values), D-18 (DM Sans 400/600 only), D-19 (spacing rhythm via tokens)

### Content schema
- `src/content.config.ts` — Typed project schema: title, slug, role, accentColor, thumbnail, skills, summary, publishDate, featured. Executor must query with `getCollection('projects')`.

### Existing code to extend
- `src/pages/index.astro` — Current placeholder homepage. Phase 3 replaces this entirely.
- `src/content/projects/project-alpha.mdx` + `project-beta.mdx` — Placeholder files to enrich with fuller placeholder content demonstrating all template sections.
- `src/layouts/BaseLayout.astro` — All new pages wrap in this layout.
- `src/styles/global.css` — Design token source of truth. New components use `var(--color-*)` and `var(--spacing-*)` only.

### Visual reference
- User-provided screenshot (Microsoft Edge case study from a reference portfolio) — defines the case study page header structure: back link → skills labels → title → summary → metadata (timeline, team, role) → first project image. Stored in context session only; not a file in the repo.

### Project context
- `.planning/PROJECT.md` — Core value, constraints (clean/minimal, work-forward, no CMS)
- `.planning/STATE.md` — Current project state and decisions log

</canonical_refs>

<specifics>
## Specific Ideas

- Hero copy direction: Confident, direct. Example draft (Tanya will refine): *"Tanya Zakus — UX/UI designer focused on end-to-end product design. Open to full-time and freelance work."* Adjust the second sentence to match her voice.
- The case study back link (`← Back to work`) should link to `/work`, not `history.back()` — predictable navigation, works on direct page load.
- Project number on work cards should be visually large and muted (e.g. `text-6xl font-semibold text-[var(--color-text-secondary)] opacity-40`) — it's a design element, not primary navigation.
- Skills on case study page header: use `role` frontmatter and `skills[]` array displayed as small-caps labels separated by commas or centered dots.
- Next/prev navigation on case study pages: sort all projects by `publishDate` descending to match the work index order. Wrap at the ends (last project links back to first).

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-work-index-case-studies*
*Context gathered: 2026-04-16*
