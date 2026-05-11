# Phase 5: Responsive Design - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify and patch — not rebuild — the site's responsive behavior so every page and component is fully usable and visually correct across the four committed viewport widths (375 / 768 / 1024 / 1440), with optimized responsive images on high-impact surfaces and a mobile navigation experience that meets touch-usability standards.

**In scope:**
- Systematic audit of every page (`/`, `/about`, `/projects/[id]`) and persistent chrome (Header, Footer, MobileNav, ThemeToggle, ArrowLink) at each of the 4 audit breakpoints.
- Targeted fixes to specific components that fail the audit at specific breakpoints. Fixes use existing patterns (Tailwind responsive utilities, design tokens) — no new responsive system introduced.
- Explicit `widths` + `sizes` props added to high-impact `<Image>` usages: About hero, case study `[id].astro` cover image, `FullBleedImage.astro`, MDX inline images.
- Touch-target verification (44×44px minimum) on primary tappables: hamburger, X close, ThemeToggle, header nav links at mobile sizes, footer icon buttons, full project-card link surfaces.
- Verification of mobile overlay nav usability (NAV-05): tap target sizes, text legibility at small viewports, no layout shift on open/close.

**Out of scope (deferred or covered elsewhere):**
- Introducing fluid type (`clamp()`) or named breakpoint tokens in `global.css` — only triggers if the audit surfaces widespread repetition of the same fix.
- Adding sub-375px support (320px, Galaxy Fold cover screen).
- Adding 1280px or 1920px audit columns.
- Inline `ArrowLink` primitive touch-target enforcement — explicitly exempted to preserve typographic density per CLAUDE.md design preferences.
- `public/` static assets (OG image, favicon) — bypass Astro's image pipeline by design.
- Lighthouse performance score (lives in Phase 6 — SEO-05).
- Custom domain, deployment configuration (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Approach & breakpoint matrix

- **D-01:** **Audit-first approach.** Phase 5 verifies the existing per-component Tailwind responsive utilities (`md:`, `lg:`) and fixes specific failures. No new responsive system (fluid type, named breakpoint tokens, centralized container utility) is introduced upfront. Escape hatch: if the audit surfaces the same kind of fix across 5+ components, introduce one system-level rule rather than 5+ component-level patches. This matches CLAUDE.md's "surgical edits over refactors" principle and the "elegant simplicity beats robust abstraction" guidance for a 6-page site with a solo maintainer.

- **D-02:** **Audit matrix = 375px / 768px / 1024px / 1440px.** Four columns per page in the audit table. Aligned with Tailwind defaults (`md:`=768, `lg:`=1024) already used in the codebase and the `.container` `max-width: 1440px` declared in `src/styles/global.css:185`. 375px covers iPhone-class mobile; 1440px is the design target. 320px (older devices) and 1280px (laptop mid-range) are explicitly out of scope.

### Tablet layout treatment (768–1024)

- **D-03:** **Pragmatic-fix policy for the tablet zone.** Expect mostly desktop-style layout from 768px upward (matches current code: `FeaturedCard`/`ProjectCard` switch to two-column at `md:`, Header inline nav appears at `md:`). Mark a 1024px audit cell as "fail" **only if** the component is visibly cramped, broken, or unreadable — not for cosmetic awkwardness. Targeted fix is to bump that component's responsive breakpoint from `md:` to `lg:`, or add intermediate spacing. **No upfront tablet layer is introduced.** The audit's 1024px column has a higher fail threshold than 375px or 768px.

### Touch target & mobile nav usability

- **D-04:** **44×44px touch-target minimum applies to primary tappables only.** In scope: hamburger button, overlay X-close button, `ThemeToggle`, header nav links at mobile sizes, `footer-icon-btn` social-icon links, full project-card link surfaces. **Inline `ArrowLink` primitive is explicitly exempted** — its tap area is the surrounding text block; enforcing 44px on the arrow itself would break typographic density per CLAUDE.md design preferences. 44 chosen over Material's 48 because the audience is recruiter/client (iOS-leaning) and the design world references WCAG 2.5.5 (AAA) standard.

- **D-05:** **Audit starts fresh — no pre-flagged known failures.** No "usual suspects" pre-asserted (scrollbar-gap shift, FOUT/FOIT reflow, header height instability). The audit's job is to discover problems systematically; pre-pathologizing pollutes the result. Planner must specify a real testing methodology — Chrome DevTools responsive mode at minimum, with real-device verification recommended for the 375px column.

### Image responsiveness depth

- **D-06:** **Pragmatic depth — explicit `widths` + `sizes` props on high-impact images, defaults on the rest.** Explicit responsive props go on:
  - About page hero photo (`src/pages/about.astro` — `aspect-[4/5]`, full-column width)
  - Case study `[id].astro` cover image (~760–800px content measure)
  - `FullBleedImage.astro` component (full viewport width — `sizes="100vw"` is the canonical pattern)
  - MDX inline images in case study body content

  Card thumbnails (`FeaturedCard`, `ProjectCard`) **rely on Astro `<Image>` defaults** — already small enough that explicit sizing wouldn't change asset selection meaningfully. `public/` static assets (OG image at `public/og-image.png`, favicon at `public/favicon.svg` + `public/favicon.ico`) bypass the image pipeline by design and are **out of scope**.

### Claude's Discretion

- Exact testing methodology specification (Chrome DevTools breakpoints, optional real-device list — planner picks).
- Whether to express the audit as a single Markdown matrix file, inline checklist within PLAN.md, or distributed across per-plan tasks.
- Specific `widths` array values for each Image surface (e.g., `[400, 800, 1200]` vs `[640, 960, 1280]`) — planner picks based on each component's render width.
- Whether to consolidate MDX inline image `widths`/`sizes` into a small wrapper component vs. inline per-image snippets.
- Whether to fix horizontal-overflow offenders inline or add an `overflow-x: hidden` guardrail on `<body>` — only if audit finds the same kind of overflow in 3+ places.
- Exact CSS approach for any touch-target pad-ups (padding vs `min-height`/`min-width` vs hit-area pseudo-element).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project constraints and stack
- `CLAUDE.md` — Tech stack (Astro 6, Tailwind v4), JS budget (near-zero), design preferences (generous whitespace, 1440px container, restrained accent use), the "surgical edits over refactors" principle that motivates the audit-first approach (D-01), CMS-free constraint, deploy target (Cloudflare Pages fully static).

### Phase requirements
- `.planning/REQUIREMENTS.md` — **NAV-05** (mobile header + overlay nav touch usability), **CASE-06** (case study mobile readability), **RESP-01** (375→1440 reflow, no horizontal overflow), **RESP-02** (responsive images per viewport), **RESP-03** (mobile nav 44px tap targets, no clipped content).
- `.planning/ROADMAP.md` §Phase 5 — Goal, 4 success criteria, dependency on Phase 4.

### Phase 1 decisions (inherit — design tokens + container)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Layout shell, max-width constraints, design token system that the audit-first approach explicitly preserves.
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Authoritative token values; responsive utility usage MUST resolve to these tokens, not raw values.

### Phase 2 decisions (inherit — breakpoint conventions + overlay nav)
- `.planning/phases/02-navigation-design-system/02-CONTEXT.md` — **D-05/D-06** (768px = `md:` = inline-nav-vs-hamburger boundary; audit treats this as locked), **D-07** (mobile overlay <768px only), **D-09 through D-12** (overlay close gestures, scroll lock, animation — Phase 5 verifies, does not change), **D-17** (token-only styling — fixes must comply), **D-19** (4px spacing scale).

### Phase 3 decisions (inherit — layout measure + animation)
- `.planning/phases/03-work-index-case-studies/03-CONTEXT.md` — **D-06** (60/40 alternating card layout — already uses `md:` switch), **D-12** (case study single centered column ~760-800px — drives the case study cover image `sizes` value in D-06), **D-23** (`prefers-reduced-motion` already honored — audit verifies, does not re-implement).

### Phase 4 decisions (inherit — image pipeline + BaseLayout)
- `.planning/phases/04-about-contact-seo/04-CONTEXT.md` — **D-03** (About hero photo via Astro `<Image>`), **D-16/D-17** (BaseLayout SEO props pattern — out of scope for Phase 5 but informs the file structure planner will touch), **D-18** (OG image is `public/`-bypass — confirms D-06 out-of-scope boundary).

### Existing code to audit and fix
- `src/styles/global.css` — Spacing tokens, container max-width, dark/light mode media queries, `prefers-reduced-motion` blocks. Source of truth for responsive system; audit verifies usage, does not extend unless D-01 escape hatch triggers.
- `src/layouts/BaseLayout.astro` — Wraps every page. Audit verifies the FOUC script and viewport meta on mobile.
- `src/components/Header.astro` — Lines using `hidden md:block` / `md:hidden` for desktop-vs-mobile nav switch. Tap-target audit applies (D-04).
- `src/components/Footer.astro` — `lg:grid-cols-10` complex grid, `footer-icon-btn` icon links (D-04 in scope).
- `src/components/MobileNav.astro` — Overlay open/close, scroll lock. NAV-05 audit target.
- `src/components/ThemeToggle.astro` — Primary tappable (D-04).
- `src/components/FeaturedCard.astro` + `ProjectCard.astro` — `flex-col md:flex-row` 60/40 layouts; thumbnail rendering (D-06 defaults apply).
- `src/components/FullBleedImage.astro` — Case study full-bleed image surface; gets explicit `sizes="100vw"` per D-06.
- `src/components/ui/ArrowLink.astro` — Touch-target exempted per D-04; verify typographic density holds across breakpoints.
- `src/pages/index.astro` — Homepage hero + featured cards section.
- `src/pages/about.astro` — `grid-cols-1 lg:grid-cols-2` hero, `aspect-[4/5]` photo (D-06 high-impact target), `lg:sticky` text column behavior at 1024.
- `src/pages/projects/[id].astro` — Case study dynamic route. Lines 62-63 use `text-xl md:text-2xl` summary typography — sample of existing per-component responsive pattern.
- `src/content/projects/*.mdx` — Case study MDX files containing inline images that need D-06 treatment.

### Project context
- `.planning/PROJECT.md` — Core value, no-CMS constraint, clean/minimal aesthetic.
- `.planning/STATE.md` — Project state, prior decisions log, completed quick tasks (260507-r5q etc. — about-page responsive fine-tuning history).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **Astro `<Image>` component** (already imported across the codebase) — backbone of D-06. Existing usage in `FeaturedCard`, `ProjectCard`, About hero confirms the pattern is established; Phase 5 extends it with explicit `widths`/`sizes` on high-impact surfaces.
- **`.container` class** (`src/styles/global.css:182-193`) — single source of truth for `max-width: 1440px` + responsive horizontal padding (breakpoint at 768px). Audit verifies every page uses it.
- **Tailwind responsive utility classes** (`md:`, `lg:`) — already in heavy use (FeaturedCard, ProjectCard, Header, Footer, about.astro, case study route). D-01 preserves this pattern; D-03 fixes use the same utilities.
- **Design tokens** (`--spacing-*`, `--color-*`, `--font-*` in `src/styles/global.css`) — all fixes must reference tokens, not raw values, per Phase 2 D-17.
- **`prefers-reduced-motion` blocks** (`global.css` lines 119, 144, 169) — already wired; audit verifies they still trip motion preferences correctly at mobile widths.

### Established Patterns

- **Per-component responsive utilities, no centralized system.** Each component declares its own `md:` / `lg:` switches inline. D-01 codifies this as intentional.
- **Two-tier breakpoint use.** Only `md:` (768) and `lg:` (1024) appear in scouted code — no `sm:`, `xl:`, or `2xl:`. D-02 matches this.
- **Tablet inherits desktop layout from `md:` upward**, with a few components (about hero, footer grid) deferring to `lg:`. D-03 formalizes this as pragmatic-fix policy.
- **`<Image>` for content images, raw `<img>` only for SVG-as-img** (e.g., logo marks). Audit can flag any raw `<img>` of a raster source as a D-06 violation.

### Integration Points

- **Audit checklist artifact** — planner decides whether to produce it as a single `05-AUDIT.md` matrix or distributed across per-plan tasks. Either way, downstream executor consumes the checklist row-by-row.
- **Fix commit pattern** — each fix should be a small, scoped commit referencing the audit row it addresses (matches Phase 4 commit cadence: `fix(component): correct breakpoint at viewport`).
- **MDX inline image `sizes` strategy** — planner decides whether to introduce a small MDX wrapper component or document an inline `<Image>` snippet pattern in the case study template comment. Either way must not require Tanya to recall the responsive incantation when authoring a new case study.

</code_context>

<specifics>
## Specific Ideas

- **CLAUDE.md alignment for D-01.** The "surgical edits over refactors" principle and "elegant simplicity beats robust abstraction" guidance both motivate audit-first. Quoted verbatim in the discussion. The planner should treat any urge to introduce abstractions (fluid type, responsive container utility, etc.) as a yellow flag requiring evidence of widespread repetition.
- **Audit cell semantics.** A cell in the matrix isn't a binary pass/fail — it's: (a) passes, (b) cosmetic-awkward-but-functional (passes at 1024 per D-03; fails at 375/768/1440), (c) fails. The planner spec should make this three-state distinction explicit.
- **`FullBleedImage` is the easiest D-06 win.** `sizes="100vw"` is conceptually trivial; pairing with `widths={[640, 960, 1280, 1600, 2000]}` gives the browser a sensible asset ladder.
- **Case study cover image `sizes`.** Content measure is ~760-800px per Phase 3 D-12. Suggested: `sizes="(max-width: 768px) 100vw, 800px"` — mobile fetches viewport-width, desktop fetches the bounded measure.
- **About hero photo is portrait `aspect-[4/5]`.** That changes the asset ladder: tall images, not wide. `widths={[400, 600, 800, 1000]}` is the right range, not the landscape `[800, 1200, 1600, 2000]` you'd use for full-bleed.
- **Tap-target ergonomics for header nav links.** At mobile sizes, header nav is hidden anyway (`hidden md:block`), so the 44×44 requirement applies primarily to the hamburger trigger, the ThemeToggle button, and the tz-logo. The desktop inline nav at ≥768 is mouse territory — 44px is moot.
- **Test methodology suggestion (Claude's Discretion zone).** Planner-recommended sequence: Chrome DevTools responsive at exact widths 375/768/1024/1440 → fix obvious failures → smoke test on a real iPhone (375 column truth) → re-audit. The audit is not "done" until the real-device check passes for at least the 375 column.

</specifics>

<deferred>
## Deferred Ideas

- **Fluid type scale via `clamp()`** — could land in v2 polish if Tanya later wants headings to scale smoothly across viewport widths. Audit-first will reveal whether the current step-based pattern (`text-xl md:text-2xl`) feels jarring or fine.
- **Named breakpoint tokens in `global.css`** (e.g., `--bp-tablet: 768px`) — same conditions as fluid type. Useful for a team; premature for a solo maintainer.
- **320px / Galaxy Fold cover screen support** — tiny audience for a recruiter-targeted portfolio; revisit only if analytics later show meaningful traffic from devices below 375px.
- **1280px / 1920px audit columns** — covered indirectly by 1024 and 1440 columns passing; expand only if a specific failure is observed at those widths.
- **Per-MDX-image wrapper component** — if D-06 implementation finds inline `<Image>` calls in MDX feel verbose, fold the wrapper into the case study template in a follow-up quick task. Not blocking Phase 5.
- **Horizontal-overflow guardrail** (`overflow-x: hidden` on `<body>`) — kept in reserve. Only triggered if the audit finds the same overflow-causing pattern in 3+ components; otherwise fix the offenders individually.
- **Material Design 48×48 touch standard** — irrelevant for an iOS-leaning recruiter audience; would matter if the portfolio later targets Android-first markets.
- **Real-device test matrix beyond iPhone** — Android, iPad, large-monitor smoke tests — nice-to-have polish for Phase 6 pre-launch rather than Phase 5 audit scope.

</deferred>

---

*Phase: 05-responsive-design*
*Context gathered: 2026-05-11*
