---
quick_id: 260506-zm7
description: Unify back link with View project arrow pattern
date: 2026-05-06
status: complete
commits:
  - 3ae4bb9
files_changed:
  - src/pages/projects/[id].astro
---

# Quick Task 260506-zm7 — Summary

## What changed

`src/pages/projects/[id].astro` (+2 / −5) — replaced the back-to-work link's SVG-arrow + translate-x interaction with the canonical View project pattern:

| | Before (zm4) | After (zm7) |
|---|---|---|
| Arrow | SVG path with `group-hover:-translate-x-1` | Unicode `←` (static) |
| Color | `text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]` | `text-[var(--color-accent)]` (always) |
| Size | `text-sm` (14px) | `text-base` (16px) |
| Hover effect | Arrow translate-left | Sweep-underline under text only |
| Markup shape | `inline-flex items-center gap-sm` | `inline-block` with `←` + `<span class="relative after:...">` |

Net change: −3 lines (SVG dropped), markup is structurally simpler.

## Why

There were three text+arrow affordances on the case study page using two different interaction patterns:

1. **View project** (homepage cards): sweep-underline + arrow outside span — *canonical*
2. **Prev/Next** (zm5): sweep-underline + arrow outside span — matches canonical
3. **Back to work** (zm4): SVG arrow + translate-x — *outlier*

User asked to "reuse same UI as View project for all text button with arrow," meaning unify on the canonical pattern. The back link was the only outlier; updating it brings the whole page (and site) into a single hover-affordance vocabulary.

## What was NOT changed

The prev/next nav uses the same micro-interaction (sweep-underline + arrow outside) but with smaller `text-[13px] uppercase` typography that was explicitly locked in via zm5 + zm6. That sizing is intentional for a navigation-label context (small label + project title underneath). zm7 only touches the back link.

## Verification

- `grep -c "after:origin-bottom-right" src/pages/projects/[id].astro` → 3 (back link + prev + next).
- `grep -E "translate-x-1|<svg"` on the file → no matches.
- Diff: +2 / −5.

## Notes for future sessions

- All three text+arrow affordances on this page now share the same `after:origin-bottom-right ... scale-x-0 group-hover:after:scale-x-100` pattern. If a fourth use appears (e.g., a "Read more" CTA), reuse the same span structure.
- The interaction pattern is duplicated three times in this file's markup. Worth extracting to a small `<ArrowLink>` component if a fourth instance is added — but at three uses, inline duplication is still cheaper than the abstraction tax.
- Reference page (tushar.work) used SVG arrow + translate for the back link; we deliberately diverge here because internal consistency (matching View project) outweighs reference fidelity for this particular affordance.
