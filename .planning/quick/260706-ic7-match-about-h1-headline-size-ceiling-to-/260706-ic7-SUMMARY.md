---
quick_id: 260706-ic7
title: Match About H1 headline size ceiling to tushar reference (clamp max 4.5->3.75rem)
status: complete
date: 2026-07-06
commit: 99db1b9
---

# Quick Task 260706-ic7 — Summary

## What changed

`src/pages/about.astro` (h1, line 47), one class, +1/-1:

```
- text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05]
+ text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.1]
```

## Effect

- About headline max size: **4.5rem (72px) -> 3.75rem (60px)**, matching tushar's
  desktop `text-6xl`. At the 17px root (>=1200px) both render ~**63.75px**.
- Line-height **1.05 -> 1.1** to match tushar's `leading-[1.1]`.
- Kept the fluid `clamp()` (min 2.5rem, 5vw preferred) — the site's headline
  convention — instead of tushar's stepped breakpoints. So the About H1 stays
  consistent with the home and project-detail H1s while hitting the reference's
  ceiling.
- The longer About headline now reads less dominant in the hero (a side benefit,
  since it wraps to several lines at the old 72px).

## Verification

- `npm run typecheck` (astro check): **0 errors**.
- Grep: no `clamp(2.5rem,5vw,4.5rem)` / `leading-[1.05]` remain; new values present.
- `prettier` on changed file only (already conformant).
- dev server localhost:4321 (HMR) reflects it live.

## Not committed

Source + docs staged, **not committed** — awaiting owner approval.
