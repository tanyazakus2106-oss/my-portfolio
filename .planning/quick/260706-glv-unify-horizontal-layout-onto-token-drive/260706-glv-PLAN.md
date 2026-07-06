---
quick_id: 260706-glv
title: Unify horizontal layout onto token-driven .container (1200/24px)
status: complete
date: 2026-07-06
---

# Quick Task 260706-glv — Unify horizontal layout onto token-driven `.container`

## Goal

Make the home/"work" page (and all site chrome) share the project detail page's
horizontal inset, by collapsing two competing layout systems into one
token-driven `.container`. Home page currently uses `.container` at
`max-width: 1440px` with a fluid `clamp(24px → 80px)` gutter; project detail
pages use a bespoke `max-w-[1200px] mx-auto px-[var(--spacing-lg)]` (1200 / fixed
24px). Target: one shared `.container` at 1200 / fixed 24px.

## Context / prior art

- Task `260615-1js` originally made `.container` padding fluid (24→80px). This
  task deliberately reverts that to a fixed 24px gutter and narrows the cap to
  1200px, per owner request to match the project detail page's inset.
- The 720px article reading column on project pages is intentional and stays.

## Tasks

### Task 1 — Retarget `.container` to token-driven 1200/24px

**Files:** `src/styles/global.css`

**Action:**
1. Add a layout token to the `@theme` block: `--layout-max: 1200px;`
   (Named `--layout-*`, NOT `--container-*`, because `--container-*` is a
   reserved Tailwind v4 theme namespace and would emit a stray `max-w-*`
   utility / risk collision.)
2. Rewrite the `.container` rule:
   - `max-width: var(--layout-max);` (was `1440px`)
   - `padding-left: var(--spacing-lg);` (was `clamp(24px, 4.28px + 5.26vw, 80px)`)
   - `padding-right: var(--spacing-lg);`

**Verify:** `.container` resolves to max-width 1200px + 24px side padding; no
`clamp()` remains in the rule.

**Done:** Home page, header, footer, mobile nav all inherit 1200/24px (they use
`.container`).

### Task 2 — De-duplicate the project detail page onto `.container`

**Files:** `src/pages/projects/[id].astro`

**Action:** Replace the bespoke wrapper string
`max-w-[1200px] mx-auto px-[var(--spacing-lg)]` with `container` on the three top
sections, preserving every other class and the `style="--entry-index"` attr:
- Back link (~line 50): keep `pt-[var(--spacing-lg)] animate-page-entry`
- Header (~line 58): keep `pt-[var(--spacing-xl)] pb-[var(--spacing-xl)] animate-page-entry`
- Hero image (~line 99): keep `mb-[var(--spacing-2xl)] animate-page-entry`

**Do NOT touch** the article body wrapper (~line 116, `max-w-[720px] ...`) — the
narrow reading column is intentional.

**Verify:** Project page renders identically (was already 1200/24px); the three
wrappers now use `class="container"`; `sizes="(min-width: 1200px) 1152px, ..."`
on the hero `<Image>` remains correct (1200 − 48 = 1152).

**Done:** No bespoke `max-w-[1200px]` layout remains on the page.

## Post-execution

- `npm run typecheck` (astro check) — clean
- `npm run format` on changed files only (per repo memory: full-repo format is
  discouraged)
- HOLD before commit — owner must approve (standing repo rule: no commit without
  explicit approval).

## Out of scope

- The 720px article reading column (intentional).
- Any color / typography / spacing-scale token changes.
- Committing or pushing.
