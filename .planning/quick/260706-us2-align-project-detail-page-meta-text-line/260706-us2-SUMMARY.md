---
phase: quick-260706-us2
plan: 01
status: complete
branch: A-then-content-fix
code_changed: true
completed: 2026-07-06
---

# Summary — "Align" detail-page meta line with work-page cards

## Outcome: content change, not position change

The request turned out to be about **text content**, not horizontal alignment.
The detail-page header meta line previously rendered the role plus every skill
("Senior Product Designer, UX Research, Prototyping, Figma"); the user wanted
it to match the work-page card labels, which show only the role
("Senior Product Designer").

**Fix (one line, `src/pages/projects/[id].astro:68`):**

```diff
-      {[entry.data.role, ...entry.data.skills].join(", ")}
+      {entry.data.role}
```

`skills[]` stays in the content schema (required frontmatter) — it is simply
no longer displayed in the case-study header.

**Follow-up (same session):** the meta line was briefly restyled to the
page-eyebrow recipe (`text-sm tracking-[0.08em]`, 14px) to match the About
eyebrow, then reverted on user request — final state is the original
`text-xs tracking-widest` (12px). Work-page card labels untouched throughout.

## Investigation notes (position hypothesis, ruled out first)

The literal reading — left-edge misalignment — was disproven before the user
clarified:

- Both elements are direct children of the same `.container` (1200px cap,
  centered, 24px gutter); entry animations are translateY-only. Left edges
  are identical by construction on both pages.
- Pixel analysis of the user's screenshots (normalized by cap height) showed
  only a ~5 CSS px apparent delta — window-width noise, not a token-sized gap.
- Checkpoint with the user then surfaced the real intent (text content).

## Verification

- Dev server render: `/projects/apollo-design-system` header now shows
  "Senior Product Designer" only.
- `npm run typecheck`: 0 errors, 0 warnings.
- Prettier: changed file already conformant.

## Side findings

- Live site (tanyazakus.com) is ~10 commits behind local main (stale
  `/projects/project-alpha` URLs). User declined pushing for now.
- Pre-existing uncommitted user edits in the tree (not part of this task):
  `timelineRange` added to project-alpha.mdx; team `<dd>` made conditional
  in `[id].astro`.
- Nothing committed — per standing rule, commits require explicit user OK.
