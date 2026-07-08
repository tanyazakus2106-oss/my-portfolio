---
phase: quick-260709-1wq
plan: "01"
status: complete
subsystem: scripts
tags: [lenis, smooth-scroll, prototype]
one_liner: "Site-wide Lenis smooth scrolling (duration 1.0, exponential ease-out, prefers-reduced-motion guarded) wired via BaseLayout — approved by Tanya after live feel test against yrmn.me"
dependency_graph:
  requires: []
  provides: [smooth-scroll site-wide]
  affects: [src/layouts/BaseLayout.astro]
tech_stack:
  added: [lenis]
  patterns: ["vanilla TS script in src/scripts/ + bundled <script> hookup in layout"]
key_files:
  created:
    - src/scripts/smooth-scroll.ts
  modified:
    - src/layouts/BaseLayout.astro
    - package.json
    - package-lock.json
decisions:
  - "Tuning matches the reference site (yrmn.me): Lenis duration 1.0 with default exponential ease-out, autoRaf: true"
  - "prefers-reduced-motion guard runs BEFORE Lenis construction — reduced-motion users keep fully native scrolling"
  - "Imported lenis/dist/lenis.css from the package instead of hand-copying the recommended CSS block"
  - "npm install lenis was run by Tanya herself — a global Claude Code deny rule blocks agent-run npm installs (see git history of this file for the full blocker report)"
metrics:
  duration: "~1 session (interrupted once by the npm-install permission blocker)"
  completed: 2026-07-09
  tasks_completed: "3 of 3 (Task 3 human-verify: approved — 'Keep it')"
  files_changed: 4
---

# Phase quick-260709-1wq Plan 01: Lenis Smooth-Scroll Prototype Summary

**STATUS: COMPLETE — approved by Tanya at the Task 3 human-verify checkpoint.**

## What Was Done

1. **`src/scripts/smooth-scroll.ts`** (created) — initializes Lenis with `duration: 1.0`,
   `autoRaf: true`, and Lenis's default exponential ease-out — the same recipe the reference
   site (yrmn.me, a Framer site using Lenis v1.0.42) uses. Guarded by a
   `prefers-reduced-motion: reduce` check that returns before Lenis is ever constructed.
   Imports `lenis/dist/lenis.css` for the library's recommended companion CSS.
2. **`src/layouts/BaseLayout.astro`** (modified) — 3-line bundled `<script>` hookup before
   `</body>` importing the script, applying the effect site-wide.
3. **`lenis` dependency** — installed by Tanya directly (`npm install lenis`, +2 packages);
   agent-run npm installs are denied by her global Claude Code settings.

## Verification

- `npm run typecheck` — 0 errors, 0 warnings (14 pre-existing hints untouched)
- `npm run build` — passes, 7 pages built
- Dev server feel test (Task 3, human-verify) — served on http://localhost:4324/ (4321–4323
  occupied); Lenis module confirmed resolving through Vite. Tanya approved: **"Keep it"**.

## Commits

Made after this summary was finalized, with Tanya's explicit permission (per standing rule) —
see git history: one code commit (script + layout + dependency) and one docs commit
(planning artifacts + STATE.md).

## Deviations from Plan

**1. [Blocking, resolved by human] `npm install lenis` denied by permission policy** —
`~/.claude/settings.json` globally denies `npm install`/`i`/`add`/`ci` for the agent. Files were
authored first; the working tree was temporarily parked with the implementation commented out to
keep `astro check` green while waiting; Tanya ran the install herself; implementation re-enabled.
No circumvention (no manual lockfile edits, no alternate package managers).

**Total deviations:** 1 (resolved). No scope creep — no unrelated files touched.

## Known Stubs

None.

## Self-Check

- [x] `src/scripts/smooth-scroll.ts` exists with `prefers-reduced-motion` guard and both `lenis` imports
- [x] `src/layouts/BaseLayout.astro` contains the `smooth-scroll` `<script>` hookup before `</body>`
- [x] `lenis` in `package.json` dependencies
- [x] `npm run typecheck` passes
- [x] `npm run build` passes
- [x] Task 3 human-verify checkpoint — approved ("Keep it")

## Self-Check: PASSED
