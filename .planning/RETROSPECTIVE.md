# Project Retrospective

A living document of milestone retrospectives, accumulating lessons learned over time. Each milestone appends a section; cross-milestone trends are summarized at the bottom.

## Milestone: v1.0 — Launch

**Shipped:** 2026-05-12
**Phases:** 6 | **Plans:** 24 | **Tasks:** 29
**Live at:** https://tanyazakus.com
**Timeline:** 2026-04-11 → 2026-05-12 (~31 days)

### What Was Built

A personal UX/UI design portfolio (Astro 6 + Tailwind v4 + MDX) deployed to a custom domain on Cloudflare Pages. Sticky header with theme toggle, full-screen mobile nav, home hero with featured work, 5 placeholder case study pages with accent colors and full-bleed images, About page with bio + availability + contact paths, and a production deploy hitting Lighthouse mobile perf 0.82 / a11y 1.00 / BP 1.00 / SEO 1.00.

### What Worked

- **Architecture-first stack choices paid off immediately.** Astro 6's zero-JS-by-default model hit 0.86 mobile perf at first Lighthouse run with no hand-tuning — the architecture did the work that hand-optimization would have done on a Next.js stack.
- **Single token source-of-truth (`global.css` `@theme` block).** Spacing scale (4px multiples, xs through 4xl), color tokens (light + dark + accent), and typography (Satoshi + Instrument Serif) all in one CSS file. Made design discipline trivial to maintain solo.
- **Plan 06's single atomic launch commit pattern.** Bundling the 4 cutover edits (`astro.config.mjs` site URL, README pointer, BaseLayout fallbacks, STATE.md Vercel cleanup) into one transactional commit (`c1b0b38`) made the production-visible flip revertable in a single step. Worth repeating for any deploy-touching change set.
- **Cloudflare-everything for hosting + DNS + registrar.** Keeping all three in one Cloudflare account turned the apex CNAME-flattening problem into a single dashboard click (Pages → Set up a domain). Third-party registrar would have required nameserver hand-editing and would have surfaced the apex-vs-CNAME RFC limitation.
- **Phase 6 sequencing landmines encoded as plan dependencies.** Plan 04 `depends_on: ["06-03"]` structurally prevented flipping `astro.config.mjs` `site:` URL before HTTPS was verified live — making "Pitfall 3: site flip before HTTPS works" impossible by construction, not just by discipline.

### What Was Inefficient

- **No formal VERIFICATION.md for 4 of 6 phases.** Phases 1, 3, 5, 6 shipped without running the gsd-verifier agent step. The work IS delivered (live site proves it), but the audit trail is documentation-shaped rather than artifact-shaped. Future milestones should not skip the verifier step — it's cheap and the artifact becomes the source-of-truth for "did this phase achieve its goal?"
- **REQUIREMENTS.md traceability never advanced past `[ ]`.** All 48 v1 requirements were functionally delivered but the traceability table was never updated as phases completed. Cause: no automated step in execute-phase to flip the checkbox, and the manual habit didn't form. The v1.1+ recommendation is to use the modern plan template with `requirements_addressed:` frontmatter from day 1 (Phase 6 plans did this and it worked cleanly).
- **iOS Safari quirks burned dev time post-hoc.** Three separate iOS-specific issues surfaced only during real-device testing in Phase 5 and Phase 6: `overflow:hidden` scroll-lock ineffective (Phase 5 fix), `backdrop-filter` creating containing block for fixed descendants (MobileNav hoist to body), `:focus-visible` matching after programmatic `.focus()` (Phase 6 polish). Future milestones should test on real iOS hardware *earlier*, not at the end.
- **Cloudflare Redirect Rules took 3 iterations to land.** `${1}` syntax interpreted literally, `if()` function unavailable in expression subset, finally `concat("https://apex", http.request.uri)` worked. Future Cloudflare work should consult the expression-language docs upfront rather than discover-by-trial.
- **23 quick tasks shipped without planning artifacts.** All have committed code (visible in `git log` and `STATE.md`), but `.planning/quick/{slug}/` directories or `SUMMARY.md` files are missing. The `audit-open` tool flags these as 23 open items. Cosmetic but creates noise at milestone close.

### Patterns Established

- **Atomic commits per task.** Every plan task gets its own commit with a descriptive subject and a body explaining *why*. Plays well with `git revert` for any single change.
- **Surgical reverts over rebases.** When polish iterations didn't land (multiple About-page experiments this milestone), targeted reverts kept history honest and made the rejected path discoverable in `git log` for future "did we try X?" questions.
- **Single-source design tokens in `@theme`.** No `tailwind.config.js`; all design tokens (typography, colors, spacing) live in CSS variables. New components reference token names; arbitrary `p-[13px]`-style values are explicitly avoided per CLAUDE.md.
- **Production-hostname Lighthouse over preview-URL Lighthouse for gates.** Preview URL measurements (Phase 02 baseline 0.86) and production measurements (Phase 06 final 0.82) can differ due to caching headers, DNS warmth, and CDN behavior. SEO-05 gate validated against the real hostname catches what preview-URL measurement might miss.
- **Decimal/polish phases captured in `quick/` directory.** 28+ quick tasks shipped during Phase 3 and 5 development as same-day refinements without going through a full phase-planning cycle. The pattern works for "I see something off, fix it now" scope, but the planning artifacts (this milestone's 23 missing-stub issue) need a lighter-weight convention next time.

### Key Lessons

1. **Skip the verifier agent at your peril.** SUMMARY.md captures *what was built*; VERIFICATION.md captures *whether the phase goal was achieved*. They're different documents. For solo projects this feels redundant — but the artifact trail is the only way "did this milestone deliver what was scoped?" survives the conversation context after `/clear`.

2. **Test on real device hardware before Phase 5.** Three of the iOS Safari quirks discovered late could have been caught by *any* device test as early as Phase 2. Future milestone: schedule a real-iPhone walk after every major UI phase, not only the dedicated responsive phase.

3. **Production-domain decisions deserve their own phase.** Splitting Phase 6 into 4 plans (edge config → QA → Cloudflare cutover → code cutover) caught the D-06 sequencing landmine (don't flip `site:` URL before HTTPS works) structurally via `depends_on`. Bundling all four into a single plan would have lost that structural enforcement.

4. **Tokens > magic numbers.** The home page projects-section had `pt-[132px] pb-[132px] gap-[132px]` (132px is a multiple of 4 but not on the token scale). When mid-launch polish surfaced the need to tighten this, the change was trivial *because* the spacing scale already had `--spacing-3xl = 64px` ready. Lesson: even when prototyping, reach for the nearest scale value rather than inventing arbitrary px.

5. **A "tech debt" audit verdict beats a "passed" audit verdict that hides gaps.** v1.0 closed with `status: tech_debt` and 26 documented deferred items. That's more useful for future-Tanya than a green-flag close that papers over the missing VERIFICATION.md files. Honesty in the archive history is cheap.

### Cost Observations

- **Model mix:** Mostly Sonnet for execution; Opus for plan-phase and discussion. No specific telemetry captured.
- **Sessions:** ~20+ separate Claude Code sessions over 31 days, frequently checkpointed via `/gsd-pause-work` and resumed via `/gsd-resume-work`.
- **Notable efficiency observations:**
  - Worktree-isolated executor agents (Phase 6 Wave 1) cut down on context budget for parallel-eligible work. Sequential single-plan waves (Phase 6 Waves 2-4) didn't benefit from worktree isolation and ran cleaner inline.
  - Spawning a fresh gsd-executor agent vs continuing via SendMessage: the harness in use here doesn't support SendMessage, so all continuations were either fresh agents or inline orchestrator work. Inline coordination during Wave 3 (Cloudflare dashboard work) avoided worktree gymnastics.
  - The audit-open tool was very useful at milestone close; surfaced 26 items in one shot that would have taken longer to enumerate by hand.

---

## Cross-Milestone Trends

*Trends accumulate as more milestones ship. Currently only v1.0 data is available.*

### Velocity

| Milestone | Phases | Plans | Days | Plans/Day |
|-----------|--------|-------|------|-----------|
| v1.0 | 6 | 24 | 31 | 0.77 |

### Recurring Patterns

- **(Single data point — patterns will emerge after v1.1 ships.)**

### Recurring Issues

- **(Single data point — patterns will emerge after v1.1 ships.)**

---
*This document evolves at each milestone close.*
