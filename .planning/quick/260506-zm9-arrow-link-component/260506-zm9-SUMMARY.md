---
quick_id: 260506-zm9
description: Extract ArrowLink primitive and migrate all 5 text+arrow sites
date: 2026-05-06
status: complete
commits:
  - aa684ed
files_changed:
  - src/components/ui/ArrowLink.astro (new, 47 lines)
  - src/components/ProjectCard.astro
  - src/components/FeaturedCard.astro
  - src/pages/projects/[id].astro
---

# Quick Task 260506-zm9 — Summary

## What changed

Net diff: 4 files, +57 / −16. One new component file (~47 lines), three consumer files simplified.

### New: `src/components/ui/ArrowLink.astro`

Single-purpose primitive owning the text+arrow + sweep-underline pattern.

**API:**
```ts
interface Props {
  href?: string;                    // required when decorative=false
  direction?: 'left' | 'right';     // default 'right'
  decorative?: boolean;             // default false
  class?: string;                   // optional pass-through classes
  [key: string]: unknown;           // any other HTML attribute (aria-hidden, target, rel, ...)
}
```

**Two modes:**
| Mode | Renders | Hover trigger | When to use |
|---|---|---|---|
| Standalone (default) | `<a class="group" href={...}>` | Self-`hover` | Standalone link; the component IS the click target |
| Decorative (`decorative={true}`) | `<span>` | `group-hover` from a parent `class="group"` | When an ancestor `<a>` or `<article>` is the click target — avoids invalid nested `<a>` |

**Visual contract (identical for both modes):**
- `text-base` (16px), `text-[var(--color-text-secondary)]` default
- Color shifts to `var(--color-accent)` on hover with `transition-colors`
- Sweep-underline animation under text only, arrow stays static (300ms ease-in-out, `origin-bottom-right` → `origin-bottom-left` on hover)
- Arrow placed OUTSIDE the underline span — `←` before slot for left direction, `→` after slot for right direction

### Migration of 5 hand-rolled sites

| File | Before | After |
|---|---|---|
| `ProjectCard.astro` | 3-line nested `<span>` block | `<ArrowLink decorative aria-hidden="true">View project</ArrowLink>` |
| `FeaturedCard.astro` | same | same |
| `[id].astro` Back to work | 5-line `<a>` block | `<ArrowLink href="/work" direction="left">Back to work</ArrowLink>` |
| `[id].astro` Previous project | label `<span>` inside `<a class="group flex">` | `<ArrowLink decorative direction="left">Previous project</ArrowLink>` |
| `[id].astro` Next project | same | `<ArrowLink decorative direction="right">Next project</ArrowLink>` |

Also stripped the now-redundant `text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors` from the parent `<a>` of prev/next anchors — ArrowLink owns those classes now. Parent anchors retain `class="group flex flex-col [items-end] min-h-[44px] py-[var(--spacing-sm)] focus-visible:..."`.

### Per user brief: uniform sizes

Prev/next labels were `text-[13px]` from zm6. The new brief asked to use View project's exact text size for all text+arrow buttons → all five sites now render at `text-base` (16px). The prev/next title (project name) stays at `text-base text-primary` — same size as the label, distinguished by color.

### A11y handling

- **Cards (View project):** `aria-hidden="true"` passed via the rest-spread because the parent `<a>` already has `aria-label="<title> — View project"`. Suppresses duplicate screen-reader announcement.
- **Back to work:** standalone `<a>`, no aria-hidden — the link content "Back to work" IS the accessible name.
- **Prev/Next:** decorative ArrowLink with NO aria-hidden — the parent `<a>` has no aria-label, so screen readers concatenate "Previous project Project Beta" as the link's accessible name.

Each choice is intentional and a regression-vs-baseline check passed (a11y behavior identical to pre-zm9 state).

## Verification

- `grep -rn "after:origin-bottom-right" src/` → 1 match, only in `src/components/ui/ArrowLink.astro:40`. The pattern is centralized.
- `grep -rn "<ArrowLink" src/` → 5 usages across 3 consumer files (2 cards + 3 sites in [id].astro).
- `astro check` → 0 errors, 0 warnings on the changed files.
- Visual: every text+arrow site now renders identically in default state and hover state.

## Notes for future sessions

- **Adding a sixth text+arrow site:** add `<ArrowLink href={...} direction="...">{label}</ArrowLink>` (standalone) or `<ArrowLink decorative direction="...">{label}</ArrowLink>` (inside a parent group). No new Tailwind chain needed.
- **Customization escape hatches:** `class="..."` prop forwards to the rendered element. For example, `class="text-sm"` would override the size if a future component needs a smaller scale (rare).
- **The `class:list` prop** in the component combines `[baseClass, interactionClass, className]`. Tailwind's `class:list` directive deduplicates conflicting utilities, so a custom `text-sm` in `className` correctly overrides the base `text-base` from earlier in the list.
- **Why the inline-block is in baseClass:** ensures the component sits compactly when used in flow contexts (e.g., the back link area). In flex/grid contexts (e.g., card text columns), `inline-block` is harmless because flex children are block-formatted regardless.
- **Why the rest-spread on `tagAttrs` is `Record<string, unknown>` and not stricter:** Astro's templating accepts arbitrary attributes via `{...spread}`. Stricter typing would require enumerating `aria-*`, `data-*`, `target`, `rel`, etc. — not worth the maintenance burden for a leaf primitive.
- **Did not touch the `ui/` folder convention:** before zm9, `src/components/ui/` was empty (a placeholder per CLAUDE.md). ArrowLink is the first inhabitant. If a `Button`, `Card`, or other primitive is added later, it goes here.
