---
phase: quick-260706-siq
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/content/projects/project-alpha.mdx
  - src/content/projects/project-beta.mdx
  - src/content/projects/project-delta.mdx
  - src/content/projects/project-epsilon.mdx
  - public/images/project-alpha-process.jpg
  - public/images/project-beta-process.jpg
autonomous: true
requirements: [quick-260706-siq]

must_haves:
  truths:
    - "No case-study page renders a full-bleed placeholder image (no giant solid-color square, no broken image icon)"
    - "The FullBleedImage component file still exists and is untouched"
    - "The instructional usage comments remain in the MDX files"
    - "astro check passes with no errors"
  artifacts:
    - path: "src/components/FullBleedImage.astro"
      provides: "Component preserved — only usages removed"
    - path: "src/content/projects/project-alpha.mdx"
      provides: "FullBleedImage usage removed, comments kept"
    - path: "src/content/projects/project-beta.mdx"
      provides: "FullBleedImage usage removed, comments kept"
    - path: "src/content/projects/project-delta.mdx"
      provides: "FullBleedImage usage removed"
    - path: "src/content/projects/project-epsilon.mdx"
      provides: "FullBleedImage usage removed"
  key_links:
    - from: "src/content/projects/*.mdx"
      to: "public/images/project-*-process.jpg"
      via: "removed — no MDX body references any *-process.jpg"
      pattern: "process\\.jpg"
---

<objective>
Remove the four placeholder `<FullBleedImage>` usages from the case-study MDX files
and delete the two 1×1 placeholder images they referenced.

Purpose: Two of these blocks render a 1×1 image stretched to 100vw as a giant solid-color
square (alpha = red, beta = orange); the other two point at files that do not exist and
render as broken images. All four are placeholder artifacts that degrade the live case-study
pages.

Output: Clean MDX bodies (usage comments preserved, no double blank lines) and two fewer
junk files in `public/images/`. The reusable `FullBleedImage` component stays intact for
future real content.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@./CLAUDE.md

<constraints>
- KEEP `src/components/FullBleedImage.astro` — remove only the usages in MDX bodies.
- KEEP every `{/* ... */}` comment, including the usage-example comments that mention
  `<FullBleedImage ... />` inline (those are instructional, not real usages).
- Do NOT touch `src/content/projects/project-gamma.mdx` — it has comments only, no usage.
- After removing each 4-line JSX block, collapse the resulting double blank line so exactly
  one blank line separates the surrounding paragraph/heading.
- Do NOT run `git commit`. Commits are deferred to the user (project memory: no commits
  without explicit OK). State the intended commit message in the SUMMARY only.
- Do NOT run `npm run format` (it rewrites the whole repo). Format only the changed files
  with an explicit `npx prettier --write <files>` if formatting is needed.
</constraints>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove FullBleedImage usages from the four MDX files</name>
  <files>src/content/projects/project-alpha.mdx, src/content/projects/project-beta.mdx, src/content/projects/project-delta.mdx, src/content/projects/project-epsilon.mdx</files>
  <action>
In each of the four files, delete the multi-line `<FullBleedImage ... />` JSX block (it
spans a `<FullBleedImage`, `src="..."`, `alt="..."`, and closing `/>` line) and collapse
the blank lines it leaves behind to a single blank line.

Exact blocks to remove (verified line numbers):
- project-alpha.mdx lines 32–35: block referencing `/images/project-alpha-process.jpg`
  (sits between the "## My Role" paragraph and "## Process").
- project-beta.mdx lines 29–32: block referencing `/images/project-beta-process.jpg`
  (sits between the "## Process" paragraph and the "Continue the narrative here." paragraph).
- project-delta.mdx lines 23–26: block referencing `/images/project-delta-process.jpg`
  (sits between the "## My Role" paragraph and "## Process").
- project-epsilon.mdx lines 23–26: block referencing `/images/project-epsilon-process.jpg`
  (sits between the "## My Role" paragraph and "## Process").

Preserve ALL `{/* ... */}` comments, including the alpha/beta usage-example comments that
contain `<FullBleedImage ... />` inline. Do NOT open or edit project-gamma.mdx.

After each removal, ensure exactly one blank line remains between the two surrounding
blocks (no doubled blank lines, and the surrounding paragraphs/headings are otherwise
untouched).
  </action>
  <verify>
    <automated>cd /Users/tanyazakus/Projects/my-portfolio && grep -rn "^<FullBleedImage" src/content/projects/ ; grep -rn "process\.jpg" src/content/projects/ ; test -z "$(grep -rln '^<FullBleedImage' src/content/projects/)" && echo "NO_USAGES_REMAIN"</automated>
  </verify>
  <done>No line beginning with `<FullBleedImage` remains in any MDX file; no `process.jpg` reference remains in any MDX body; the usage-example comments and project-gamma.mdx are unchanged; no doubled blank lines were introduced.</done>
</task>

<task type="auto">
  <name>Task 2: Delete the two 1×1 placeholder images and verify the build types</name>
  <files>public/images/project-alpha-process.jpg, public/images/project-beta-process.jpg</files>
  <action>
Delete the two orphaned placeholder image files now that nothing references them:
`public/images/project-alpha-process.jpg` and `public/images/project-beta-process.jpg`
(both are 69-byte 1×1 JPGs). Do NOT delete `FullBleedImage.astro` or any other image.

Then run `npm run typecheck` (astro check) to confirm the content collection and pages
still type-check with the bodies trimmed. If astro check reports formatting-sensitive
issues, run `npx prettier --write` on only the four changed MDX files (never the repo-wide
`npm run format`).
  </action>
  <verify>
    <automated>cd /Users/tanyazakus/Projects/my-portfolio && ! test -f public/images/project-alpha-process.jpg && ! test -f public/images/project-beta-process.jpg && npm run typecheck</automated>
  </verify>
  <done>Both placeholder JPGs are gone; `FullBleedImage.astro` still exists; `npm run typecheck` passes with no errors.</done>
</task>

</tasks>

<verification>
- `grep -rn "^<FullBleedImage" src/content/projects/` returns nothing.
- `grep -rn "process\.jpg" src/content/projects/` returns nothing.
- `public/images/project-alpha-process.jpg` and `public/images/project-beta-process.jpg` do not exist.
- `src/components/FullBleedImage.astro` still exists.
- `src/content/projects/project-gamma.mdx` is unchanged.
- Usage-example comments in project-alpha.mdx and project-beta.mdx are preserved.
- `npm run typecheck` passes.
</verification>

<success_criteria>
- All four placeholder full-bleed image usages removed; live case-study pages no longer show
  giant solid-color squares or broken images.
- Two orphaned 1×1 placeholder JPGs deleted.
- FullBleedImage component and all instructional comments intact; project-gamma untouched.
- astro check passes; no doubled blank lines left behind.
- No commit made — intended message noted for the user: `chore(content): remove placeholder FullBleedImage blocks and 1x1 images`.
</success_criteria>

<output>
After completion, create `.planning/quick/260706-siq-remove-placeholder-fullbleedimage-blocks/260706-siq-SUMMARY.md`.
Note in the SUMMARY that the commit is deferred to the user with the suggested message above.
</output>
