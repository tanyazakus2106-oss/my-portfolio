---
phase: quick
plan: 260507-zma
type: execute
wave: 1
depends_on: []
files_modified:
  - src/content.config.ts
  - src/pages/projects/[id].astro
autonomous: true
requirements: []

must_haves:
  truths:
    - "Schema gains two optional fields: timelineRange (string) and team (string)"
    - "Existing MDX files (no timelineRange, no team) continue to build with no errors — the fields are optional"
    - "[id].astro renders a single TIMELINE label with two stacked rows below: timeline + team"
    - "Row 1 shows entry.data.timelineRange when set, else falls back to the existing month/year format from publishDate"
    - "Row 2 shows entry.data.team when set, else falls back to 'Placeholder team — update in MDX'"
    - "The 3-col grid (Timeline / Team / My Role) is removed; My Role is no longer displayed in the metadata section (already shown in the eyebrow at the top of the page)"
    - "Visual matches the reference target: single uppercase label, then two text-sm secondary lines stacked with tight spacing"
  artifacts:
    - path: "src/content.config.ts"
      provides: "Updated projects schema with timelineRange + team optional fields"
      contains: "timelineRange"
    - path: "src/pages/projects/[id].astro"
      provides: "Single-column metadata block (TIMELINE label + two rows)"
      contains: "Timeline"
  key_links:
    - from: "[id].astro metadata section"
      to: "entry.data.timelineRange, entry.data.team"
      via: "Astro Content Collections schema"
      pattern: "entry.data.team"
---

<objective>
Replace the 3-column metadata block (Timeline / Team / My Role) on the case study page with a single-column block that has one TIMELINE label and two stacked data rows. Match the reference target visually (single label, tight stacked rows, no card/background).

Add `timelineRange` and `team` as optional schema fields so the owner can supply real per-project data. Until they're filled in, fall back to the formatted `publishDate` for row 1 and a placeholder string for row 2.

Drop "My Role" from the metadata — it duplicates data already shown in the page eyebrow.

Out of scope: changes to existing MDX files (they keep working unchanged via the optional schema fields).
</objective>

<context>
@.planning/STATE.md
@.planning/quick/260506-zm9-arrow-link-component/260506-zm9-SUMMARY.md
</context>

<tasks>

### Task 1: Add `timelineRange` and `team` to schema

**Files:** `src/content.config.ts`

**Action:**
Add two optional string fields to the projects schema:
```ts
timelineRange: z.string().optional(),
team: z.string().optional(),
```

**Verify:**
- `grep -n "timelineRange\|team" src/content.config.ts` returns 2 matches.
- `astro check` passes.

### Task 2: Replace metadata section with single-column block

**Files:** `src/pages/projects/[id].astro`

**Action:**
Replace the current 3-col `<dl>` block (Timeline / Team / My Role columns) with:

```astro
<dl class="mt-[var(--spacing-lg)]">
  <dt class="text-xs tracking-widest uppercase text-[var(--color-text-secondary)] mb-[var(--spacing-sm)]">Timeline</dt>
  <dd class="m-0 text-sm text-[var(--color-text-secondary)]">{entry.data.timelineRange ?? timeline}</dd>
  <dd class="m-0 mt-[var(--spacing-xs)] text-sm text-[var(--color-text-secondary)]">{entry.data.team ?? 'Placeholder team — update in MDX'}</dd>
</dl>
```

Notes:
- Single `<dt>` paired with two `<dd>` elements — valid HTML for one term with multiple values.
- `m-0` on `<dd>` clears the browser default left-margin/indent on definition descriptions.
- `mt-[var(--spacing-xs)]` (4px) between rows matches reference's tight spacing.
- `mb-[var(--spacing-sm)]` (8px) between label and first row matches reference.

**Verify:**
- `grep -c "My Role" src/pages/projects/\[id\].astro` returns 0 (removed from metadata; eyebrow uses `entry.data.role` directly).
- `grep -c "grid-cols-3" src/pages/projects/\[id\].astro` returns 0 (3-col grid gone).
- `grep -n "timelineRange\|entry.data.team" src/pages/projects/\[id\].astro` returns 2 matches.
- `astro check` passes — no type errors despite new optional fields.

**Done when:**
- Visual matches target screenshot: single uppercase TIMELINE label, two stacked text-sm secondary lines.
- Existing MDX files render without error (no team field set → placeholder displays).
- Eyebrow at top of page still shows role + skills.

</tasks>
