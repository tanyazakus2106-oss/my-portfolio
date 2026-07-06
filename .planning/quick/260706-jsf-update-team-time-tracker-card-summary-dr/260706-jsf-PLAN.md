---
quick_id: 260706-jsf
title: Update Team Time Tracker card summary (drop "for the team")
status: complete
date: 2026-07-06
---

# Quick Task 260706-jsf — Update Team Time Tracker summary

## Goal

Update the Team Time Tracker project card body text (the `summary` frontmatter)
to the owner-provided copy.

## Task

**Files:** `src/content/projects/project-beta.mdx` (line 8, `summary:`)

**Action:** set summary to:
"Designed and shipped an in-house time tracker, replacing paid SaaS
subscriptions. Implemented the frontend in React/TypeScript via Claude Code."

Only change vs. prior text: removed " for the team". No other frontmatter or MDX
body touched.

## Scope note

`summary` feeds three surfaces (all update, intended):
- Home project card body (`ProjectCard.astro`)
- Project detail hero summary (`projects/[id].astro`)
- Detail page `<meta description>` / OG text

## Verify

- `npm run typecheck` (astro check validates the Zod content schema): 0 errors.
- `npm run format` on changed file only.
- HOLD before commit — owner approval required.
