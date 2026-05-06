---
quick_id: 260506-zm6
description: Restore prev/next nav typography to pre-zm4 sizes
date: 2026-05-06
status: complete
commits:
  - 075c1d2
files_changed:
  - src/pages/projects/[id].astro
---

# Quick Task 260506-zm6 — Summary

## What changed

`src/pages/projects/[id].astro` (+4 / −4) — typography revert on prev/next nav:

| Element | zm4 (post-redesign) | zm6 (restored) |
|---|---|---|
| Label | `text-xs tracking-widest uppercase` (12px / 0.1em) | `text-[13px] uppercase tracking-[0.08em]` |
| Title | `text-sm text-[var(--color-text-primary)]` (14px) | `text-base text-[var(--color-text-primary)]` (16px) |

## Why

zm4's typography was a global Tushar-reference match. For this specific component (prev/next nav at the bottom of the case study), the slightly larger pre-zm4 sizes give the labels enough presence to register as section headings and the titles enough weight to read as the primary action. User preferred the older pairing.

## Preserved from zm4 / zm5

- Layout placement inside `max-w-[720px]` body article column (zm4)
- Border-top divider, mt-3xl pt-xl spacing (zm4)
- Sweep-underline animation under label text (zm5)
- Hover color `text-[var(--color-accent)]` (zm5)
- Focus ring outline + min-h-[44px] tap target

## Verification

- `grep -c "text-\[13px\]" src/pages/projects/[id].astro` → 2.
- `grep -c "tracking-\[0.08em\]" src/pages/projects/[id].astro` → 2.
- `grep -c "group-hover:after:scale-x-100" src/pages/projects/[id].astro` → 2 (zm5 hover preserved).
- Diff: +4 / −4.

## Notes for future sessions

- The prev/next nav now uses different label sizing than the eyebrow at the top of the page (`text-xs tracking-widest`). That's intentional — the page header is one cohesive design, the case study footer nav is its own micro-component with consistency to homepage `ProjectCard`. If a future refactor wants global typography unification, this is one of two label styles in tension.
- Three quick tasks (zm4 → zm5 → zm6) ended up needed to land this nav: structural redesign, then hover restoration, then typography restoration. Worth noting for next time: when a redesign brief says "match grid + layout", explicitly ask whether component-level interactions and per-component typography count as in-scope or out-of-scope before starting.
