# Phase 5: Responsive Design - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `05-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-05-11
**Phase:** 05-responsive-design
**Areas discussed:** Approach & breakpoint matrix, Tablet layout treatment (768–1024), Touch target & mobile nav usability, Image responsiveness depth

---

## Approach & breakpoint matrix

### Q1 — Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Audit-first (verify & fix) | Plan is a structured audit: each page × each breakpoint → pass / fail checklist. Fixes are targeted at specific broken spots. No new responsive abstractions introduced. Smallest blast radius; matches the 'surgical edits' principle in CLAUDE.md. | ✓ |
| System formalization | Phase 5 introduces a centralized responsive system: fluid type scale via clamp(), named breakpoint tokens in global.css, possibly a responsive container utility. Touches more files. Cleaner long-term but higher risk of unintended visual shifts across the whole site. | |
| Hybrid | Audit-first as the primary deliverable, but if the audit surfaces repeated patterns of breakage (e.g., every heading is too big on mobile), introduce a small system-level fix (e.g., one fluid type rule) rather than fixing 12 components individually. | |

**User's choice:** Audit-first (verify & fix)
**Notes:** User initially asked for clarification on what each approach means in practice. Tanya then accepted the explicit recommendation grounded in CLAUDE.md's "surgical edits over refactors" principle, the observable (not architectural) success criteria, solo-maintainer status, and the existing per-component Tailwind responsive pattern that already works in `FeaturedCard`, `ProjectCard`, `about.astro`, etc.

### Q2 — Breakpoint matrix

| Option | Description | Selected |
|--------|-------------|----------|
| 375 / 768 / 1024 / 1440 | Aligned with Tailwind defaults (md=768, lg=1024) already used in the code. 375 = iPhone-class mobile. 1440 = target container width. Four columns. | ✓ |
| 320 / 375 / 768 / 1024 / 1440 | Adds 320px (old iPhone SE, Galaxy Fold cover). Five columns. | |
| 375 / 768 / 1440 | Minimal — skips 1024 entirely. Three columns. | |
| 375 / 768 / 1024 / 1280 / 1440 | Adds 1280 (13" MacBook) between lg and 1440. Five columns. | |

**User's choice:** 375 / 768 / 1024 / 1440
**Notes:** Selected the option that maps cleanly to Tailwind defaults already in the code. Four audit columns × ~3 page templates + chrome = a one-sitting deliverable.

---

## Tablet layout treatment (768–1024)

### Q1 — Tablet expectation & fail trigger

| Option | Description | Selected |
|--------|-------------|----------|
| Pragmatic-fix | Expect mostly desktop-style layout from 768 upward (matches current code). Component 'fails' at 1024 only if visibly cramped, broken, or unreadable. Fix individual offenders by bumping md→lg or adding tablet-specific spacing. Matches what the codebase already does instinctively. | ✓ |
| Inherit-desktop | Accept that tablet sees a scaled-down desktop. Audit only fails for true breakage (overflow, unreadable text, broken tap targets). Cramped-but-functional passes. | |
| Dedicated-tablet | Treat 768–1024 as its own zone with explicit layout treatment. Headers, cards, hero blocks each get a 'tablet' variant. Most polished; biggest fix volume. | |

**User's choice:** Pragmatic-fix
**Notes:** Codifies the implicit mixed pattern already in the code (some components use `md:`, others use `lg:` for their switch). The 1024 column gets a higher fail threshold than 375 or 768 — cosmetic awkwardness passes; only true breakage fails.

---

## Touch target & mobile nav usability

### Q1 — Audit strictness

| Option | Description | Selected |
|--------|-------------|----------|
| Primary tappables only | Audit-enforce 44×44px on hamburger, X close, ThemeToggle, header nav links (mobile-sized), footer icon buttons, full project card surfaces. Inline ArrowLink primitive exempted because enforcing 44 would visually break the typography. | ✓ |
| All interactive (strict 44×44) | Every <a> and <button> must be 44×44 minimum, including inline ArrowLinks. Requires padding the arrow links into something closer to button-sized. | |
| Material 48×48 for primary | Use the larger Material standard (48×48) for primary tappables. ~9% bigger. Most useful for Android-leaning audiences. | |

**User's choice:** Primary tappables only
**Notes:** Preserves the minimal aesthetic. The ArrowLink primitive (used 5+ places after the 260506-zm9 quick task) lives inline with text — padding it to 44px tall would make it look like a button, contradicting CLAUDE.md's typographic density preference.

### Q2 — Pre-flagged known failures

| Option | Description | Selected |
|--------|-------------|----------|
| Start fresh — let the audit find everything | No specific known issues to pre-flag. The audit's job is to surface problems systematically; the planner shouldn't make assumptions. | ✓ |
| I have specific concerns to log | Pick this if there are observed mobile issues to pre-flag as known failures. | |
| Just flag the usual suspects | Pre-flag three common failure modes (scrollbar-gap shift, FOUT/FOIT reflow, header height stability) regardless of whether they've been observed. | |

**User's choice:** Start fresh — let the audit find everything
**Notes:** Cleanest audit posture. Pre-flagging poisons the result by pre-pathologizing things that may be fine. Forces real verification rather than a finite checklist the executor could coast on.

---

## Image responsiveness depth

### Q1 — Audit depth

| Option | Description | Selected |
|--------|-------------|----------|
| Pragmatic: explicit widths/sizes on high-impact images | Hero photo, case study cover, FullBleedImage, MDX inline images get explicit widths + sizes. Card thumbnails rely on defaults. public/ assets out of scope. | ✓ |
| Strict: explicit widths/sizes on every <Image> | Every Astro <Image> usage gets explicit widths + sizes, including small thumbnails. | |
| Loose: Astro <Image> defaults are the bar | Audit only checks that every image uses <Image> not raw <img>. Defaults trusted to handle responsiveness. | |

**User's choice:** Pragmatic: explicit widths/sizes on high-impact images
**Notes:** Best ROI without per-image fuss. `FullBleedImage` (`sizes="100vw"`) is the easiest win. Case study cover uses `sizes="(max-width: 768px) 100vw, 800px"` per Phase 3 D-12 content measure. About hero is portrait `aspect-[4/5]` so its widths array is tall-image-shaped, not landscape.

---

## Claude's Discretion

Areas where the user accepted Claude's recommendation or deferred to planning:

- Whether to express the audit as a single Markdown matrix file vs. inline within PLAN.md vs. distributed across per-plan tasks
- Specific `widths` array values for each high-impact image
- Whether MDX inline image `sizes` consolidates into a wrapper component or stays inline
- Whether horizontal-overflow guardrail (`overflow-x: hidden` on body) is added if 3+ overflow patterns surface
- Exact CSS approach for any touch-target pad-ups (padding vs `min-height` vs hit-area pseudo-element)
- Test methodology specifics (DevTools breakpoints, real-device list)

## Deferred Ideas

- Fluid type via `clamp()` — v2 polish if step-based pattern feels jarring
- Named breakpoint tokens in `global.css` — premature for solo maintainer
- 320px / Galaxy Fold cover screen support — tiny audience
- 1280px / 1920px audit columns — revisit only on observed failure
- Per-MDX-image wrapper component — follow-up quick task if needed
- Horizontal-overflow guardrail — kept in reserve
- Material 48×48 standard — N/A for iOS-leaning audience
- Multi-device real-test matrix beyond iPhone — Phase 6 polish concern
