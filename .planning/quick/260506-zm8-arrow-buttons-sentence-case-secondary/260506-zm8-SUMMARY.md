---
quick_id: 260506-zm8
description: Sentence case + secondary default state for all text+arrow buttons
date: 2026-05-06
status: complete
commits:
  - fee2234
files_changed:
  - src/pages/projects/[id].astro
  - src/components/ProjectCard.astro
  - src/components/FeaturedCard.astro
---

# Quick Task 260506-zm8 — Summary

## What changed

3 files, +5 / −5 net. Five surgical class-list edits across the four text+arrow affordances:

| File | Site | Change |
|---|---|---|
| `[id].astro` | Back to work `<a>` | `text-base text-accent` → `text-base text-secondary hover:text-accent transition-colors` |
| `[id].astro` | Prev label `<span>` | `text-[13px] uppercase tracking-[0.08em]` → `text-[13px]` |
| `[id].astro` | Next label `<span>` | same as prev |
| `ProjectCard.astro` | View project `<span>` | `text-base text-accent` → `text-base text-secondary group-hover:text-accent transition-colors` |
| `FeaturedCard.astro` | View project `<span>` | same as ProjectCard |

## Why

User asked for two things, applied uniformly to text+arrow buttons:
1. **Sentence case** — only prev/next labels were affected, since the other three sites already render in sentence case. The fix is removing the `text-transform: uppercase` class (the source markup was already authored in sentence case).
2. **Secondary color default** — three sites needed updating (Back to work + the two View project spans, which were always-accent). Prev/next anchors already used secondary as default at the `<a>` level, so no anchor-level change needed there.

## Hover model — why two flavors

Two different `:hover` strategies are used in this commit, deliberately:

- **`hover:text-accent`** on the `<a>` itself — used for the Back to work link, where the `<a>` carries `class="group"` and IS the hover target. Plain `:hover` works directly on the anchor.
- **`group-hover:text-accent`** on the View project spans — the parent `<article>` (one level up from the `<a>`) carries `class="group"`, because hovering anywhere on the card should trigger the affordance. This is the same hook the existing sweep-underline already uses (`group-hover:after:scale-x-100`), so no new class binding is needed.

`transition-colors` was added to all three newly-color-changing sites so the secondary→accent shift animates instead of snapping.

## What was NOT touched

- The eyebrow (`text-xs tracking-widest uppercase`) at the top of the case study page — different element, label-style, intentionally uppercase.
- The Timeline / Team / My Role `<dt>` labels — same uppercase label-style as the eyebrow.
- Sweep-underline classes — preserved verbatim (still 3 `after:origin-bottom-right` matches in `[id].astro`).
- All sizes (text-base, text-[13px]) and structural placements.

## Verification

- `grep -c "uppercase tracking-\[0.08em\]" src/pages/projects/[id].astro` → 0 (was 2 before).
- `grep -c "group-hover:text-\[var(--color-accent)\]" src/components/{ProjectCard,FeaturedCard}.astro` → 1 + 1 = 2.
- `grep -c "hover:text-\[var(--color-accent)\] transition-colors" src/pages/projects/[id].astro` → 3 (back link + prev + next).
- `grep -c "after:origin-bottom-right" src/pages/projects/[id].astro` → 3 (sweep-underline preserved).

## Notes for future sessions

- This is the eighth quick task in the zm-series today. The page now has a fully unified affordance vocabulary: every text+arrow link defaults to muted secondary, transitions to accent on hover, and sweeps an underline under the label text only. New links should follow the same template.
- The duplicated Tailwind chain across `[id].astro` (3 sites, ~150 chars each) is now uniform. If a fourth use appears, the abstraction tax for an `<ArrowLink>` Astro component might finally be worth paying.
