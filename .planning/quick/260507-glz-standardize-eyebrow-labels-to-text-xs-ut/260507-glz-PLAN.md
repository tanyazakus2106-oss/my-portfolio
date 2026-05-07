---
phase: 260507-glz
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/pages/index.astro
  - src/components/ProjectCard.astro
  - src/components/FeaturedCard.astro
autonomous: true
requirements:
  - QUICK-260507-glz
must_haves:
  truths:
    - "All 3 eyebrow labels render with the named Tailwind v4 `text-xs` utility (no arbitrary `text-[14px] leading-[20px]` recipe remains)"
    - "Eyebrow visual recipe is identical across home hero, ProjectCard, and FeaturedCard"
    - "No other typography surface (H1, lede, card titles, `<dd>` labels, footer/header microcopy) is touched"
  artifacts:
    - path: "src/pages/index.astro"
      provides: "Home hero eyebrow using `text-xs`"
      contains: "text-xs uppercase tracking-[0.08em]"
    - path: "src/components/ProjectCard.astro"
      provides: "ProjectCard role eyebrow using `text-xs`"
      contains: "text-xs uppercase tracking-[0.08em]"
    - path: "src/components/FeaturedCard.astro"
      provides: "FeaturedCard role eyebrow using `text-xs`"
      contains: "text-xs uppercase tracking-[0.08em]"
  key_links:
    - from: "all 3 eyebrow `<p>` elements"
      to: "Tailwind v4 named utility `text-xs`"
      via: "class attribute"
      pattern: "text-xs uppercase tracking-\\[0.08em\\]"
---

<objective>
Standardize all 3 eyebrow labels to the Tailwind v4 named utility `text-xs`, replacing the arbitrary `text-[14px] leading-[20px]` recipe with a design-system-aligned token.

Purpose: Design-system coherence. Mirrors the prior body-text standardization (260507-g17) — replace ad-hoc arbitrary values with named tokens. Owner verified via DevTools that `.text-xs` resolves to `font-size: var(--text-xs); line-height: var(--tw-leading, var(--text-xs--line-height))`, so the utility alone supplies both font-size and a sensible default line-height.

Output: Three single-line class-attribute edits across three files. Net visual: eyebrow font-size 14px → 12px, line-height 20px → 16px (Tailwind v4 defaults).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@src/pages/index.astro
@src/components/ProjectCard.astro
@src/components/FeaturedCard.astro
</context>

<tasks>

<task type="auto">
  <name>Task 1: Replace text-[14px] leading-[20px] with text-xs on all 3 eyebrow labels</name>
  <files>src/pages/index.astro, src/components/ProjectCard.astro, src/components/FeaturedCard.astro</files>
  <action>
Apply EXACTLY these three substitutions, in order. No other edits.

**1. `src/pages/index.astro` line 26** — home hero eyebrow

Before:
```
<p class="text-[14px] leading-[20px] uppercase tracking-[0.08em] font-normal text-[var(--color-text-secondary)]" data-line-group>
```

After:
```
<p class="text-xs uppercase tracking-[0.08em] font-normal text-[var(--color-text-secondary)]" data-line-group>
```

(Delete `text-[14px] leading-[20px]`, prepend `text-xs`. Keep `data-line-group` and every other attribute intact.)

**2. `src/components/ProjectCard.astro` line 51** — ProjectCard role eyebrow

Before:
```
<p class="text-[14px] leading-[20px] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
```

After:
```
<p class="text-xs uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
```

**3. `src/components/FeaturedCard.astro` line 50** — FeaturedCard role eyebrow

Before:
```
<p class="text-[14px] leading-[20px] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
```

After:
```
<p class="text-xs uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
```

**DO NOT TOUCH** (guardrails — these are deliberately not eyebrows or share the recipe):
- The hero H1 in `src/pages/index.astro` (heading, not eyebrow)
- The hero description paragraph / lede (line 42 in `src/pages/index.astro`)
- Card titles using `text-[36px]` (heading, not eyebrow) in ProjectCard / FeaturedCard
- Case-study `<dd>` elements using `text-sm` (label, not an eyebrow — different recipe)
- All footer/header microcopy
- Any other surface in the repo

Why this is safe: Owner verified in DevTools that Tailwind v4's `.text-xs` ships both `font-size: var(--text-xs)` and a default `line-height` via `var(--text-xs--line-height)`, so dropping `leading-[20px]` is intentional — the named utility supplies an appropriate single-line line-height for an uppercase eyebrow.
  </action>
  <verify>
    <automated>npm run typecheck && test "$(grep -rn 'text-\[14px\] leading-\[20px\] uppercase' src/ | wc -l | tr -d ' ')" = "0" && test "$(grep -rn 'text-xs uppercase tracking-\[0.08em\]' src/ | wc -l | tr -d ' ')" = "3"</automated>
  </verify>
  <done>
- `npm run typecheck` exits clean
- `grep -n "text-\[14px\] leading-\[20px\] uppercase" src/` returns zero matches
- `grep -n "text-xs uppercase tracking-\[0.08em\]" src/` shows exactly 3 matches (one per file above)
- No other files in `src/` are modified (verify via `git diff --name-only`)
  </done>
</task>

</tasks>

<verification>
After the substitutions:

1. `npm run typecheck` — clean (no `.astro` prop or class-attribute errors)
2. `grep -rn "text-\[14px\] leading-\[20px\] uppercase" src/` — zero matches (old recipe fully retired)
3. `grep -rn "text-xs uppercase tracking-\[0.08em\]" src/` — exactly 3 matches (new recipe applied uniformly)
4. `git diff --name-only` — exactly 3 files modified: `src/pages/index.astro`, `src/components/ProjectCard.astro`, `src/components/FeaturedCard.astro`
5. Visual sanity (optional, since this is a typography-utility swap with predictable defaults): `npm run dev` and confirm eyebrows render slightly smaller (12px vs 14px) with consistent uppercase + tracking across home, work archive, and project listings.

Suggested commit message: `refactor(typography): standardize eyebrow labels to text-xs utility`
</verification>

<success_criteria>
- All 3 eyebrow `<p>` elements use `text-xs` (not `text-[14px] leading-[20px]`)
- Eyebrow recipe is now identical across all three surfaces
- No other typography surface is altered
- Typecheck clean, both grep gates pass exactly
</success_criteria>

<output>
After completion, create `.planning/quick/260507-glz-standardize-eyebrow-labels-to-text-xs-ut/260507-glz-01-SUMMARY.md` documenting the three substitutions and the verification gate results.
</output>
