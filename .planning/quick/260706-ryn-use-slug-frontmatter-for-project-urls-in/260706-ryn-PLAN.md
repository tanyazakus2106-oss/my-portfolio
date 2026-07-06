---
phase: quick-260706-ryn
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/pages/projects/[id].astro
  - src/components/ProjectCard.astro
  - src/components/FeaturedCard.astro
  - src/content/projects/project-alpha.mdx
  - src/content/projects/project-beta.mdx
  - public/_redirects
autonomous: true
requirements: [QUICK-260706-ryn]

must_haves:
  truths:
    - "Visiting /projects/apollo-design-system renders the Apollo design system case study"
    - "Visiting /projects/team-time-tracker renders the Team Time Tracker case study"
    - "Old URL /projects/project-alpha returns a 301 redirect to /projects/apollo-design-system"
    - "Old URL /projects/project-beta returns a 301 redirect to /projects/team-time-tracker"
    - "Home/work project cards and case-study prev/next nav link to slug-based URLs"
    - "npm run build succeeds — validates getStaticPaths output and frontmatter schema"
  artifacts:
    - path: "src/pages/projects/[id].astro"
      provides: "getStaticPaths routes on entry.data.slug; prev/next nav links use slug"
      contains: "entry.data.slug"
    - path: "src/components/ProjectCard.astro"
      provides: "Work-index card links to slug-based URL"
      contains: "entry.data.slug"
    - path: "src/components/FeaturedCard.astro"
      provides: "Homepage featured card links to slug-based URL"
      contains: "entry.data.slug"
    - path: "src/content/projects/project-alpha.mdx"
      provides: "Descriptive slug for Apollo case study"
      contains: "slug: \"apollo-design-system\""
    - path: "src/content/projects/project-beta.mdx"
      provides: "Descriptive slug for Team Time Tracker case study"
      contains: "slug: \"team-time-tracker\""
    - path: "public/_redirects"
      provides: "301 redirects from old filename URLs to new descriptive slugs"
      contains: "apollo-design-system"
  key_links:
    - from: "src/pages/projects/[id].astro getStaticPaths"
      to: "entry.data.slug"
      via: "params.id assignment"
      pattern: "params:\\s*\\{\\s*id:\\s*entry\\.data\\.slug"
    - from: "src/components/ProjectCard.astro"
      to: "/projects/${entry.data.slug}"
      via: "href template literal"
      pattern: "/projects/\\$\\{entry\\.data\\.slug\\}"
---

<objective>
Route project pages by the `slug` frontmatter field instead of the filename-derived `entry.id`, and give the two real case studies descriptive slugs so their URLs read as `/projects/apollo-design-system` and `/projects/team-time-tracker` (instead of `/projects/project-alpha` and `/projects/project-beta`).

Purpose: Clean, meaningful URLs improve SEO and first impressions for recruiters/clients. The `slug` field already exists in the content schema but is currently unused by routing — this wires it in and preserves live links via 301 redirects.

Output: Slug-driven routing across the dynamic route and all internal link generators; renamed slugs for the two featured real projects; 301 redirects for the two old URLs. No new dependencies, no schema change.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@./CLAUDE.md

<interfaces>
<!-- Contracts the executor needs — extracted from the codebase. No exploration required. -->

`slug` is already a REQUIRED field in the content schema (src/content.config.ts):
```ts
schema: ({ image }) => z.object({
  title: z.string(),
  slug: z.string(),   // already present — used for routing after this plan
  ...
})
```

Current routing (src/pages/projects/[id].astro):
```astro
export async function getStaticPaths() {
  const all = (await getCollection("projects")).sort(...);
  return all.map((entry, i) => ({
    params: { id: entry.id },          // ← line 16: change to entry.data.slug
    props: { entry, nextEntry: ..., prevEntry: ... },
  }));
}
```
Nav prev/next links (same file):
```astro
<a href={`/projects/${prevEntry.id}`} ...>   {/* ~line 126 */}
<a href={`/projects/${nextEntry.id}`} ...>   {/* ~line 136 */}
```

Card link generators:
- src/components/ProjectCard.astro line 29:  `href={`/projects/${entry.id}`}`
- src/components/FeaturedCard.astro line 28:  `href={`/projects/${entry.id}`}`

Current slugs (frontmatter):
- project-alpha.mdx → slug: "project-alpha"  (title: "Design System for Apollo.io", featured)
- project-beta.mdx  → slug: "project-beta"   (title: "Team Time Tracker", featured)
- project-gamma / project-delta / project-epsilon → slugs equal their filenames (placeholders — DO NOT change; routing stays identical for them).

Cloudflare _redirects syntax (public/_redirects), one rule per line:
```
/source/path    /destination/path    301
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Route on entry.data.slug across route + card components</name>
  <files>src/pages/projects/[id].astro, src/components/ProjectCard.astro, src/components/FeaturedCard.astro</files>
  <action>
    Replace every filename-derived URL reference with the `slug` frontmatter value. There are 5 references across 3 files:

    In src/pages/projects/[id].astro:
    1. getStaticPaths (line ~16): change `params: { id: entry.id }` to `params: { id: entry.data.slug }`. Leave the `props` (entry, nextEntry, prevEntry) and the sort logic untouched.
    2. Prev nav link (line ~126): change `href={`/projects/${prevEntry.id}`}` to `href={`/projects/${prevEntry.data.slug}`}`.
    3. Next nav link (line ~136): change `href={`/projects/${nextEntry.id}`}` to `href={`/projects/${nextEntry.data.slug}`}`.

    In src/components/ProjectCard.astro (line ~29): change `href={`/projects/${entry.id}`}` to `href={`/projects/${entry.data.slug}`}`.

    In src/components/FeaturedCard.astro (line ~28): change `href={`/projects/${entry.id}`}` to `href={`/projects/${entry.data.slug}`}`.

    Do NOT change src/content.config.ts — `slug` is already a required schema field. Do NOT touch the placeholder MDX files. This task is a pure `entry.id` → `entry.data.slug` swap; slugs still equal filenames at this point, so build output URLs are unchanged until Task 2.
  </action>
  <verify>
    <automated>npm run typecheck</automated>
    <automated>! grep -REn "(entry|prevEntry|nextEntry)\.id\b" "src/pages/projects/[id].astro" src/components/ProjectCard.astro src/components/FeaturedCard.astro</automated>
  </verify>
  <done>`astro check` passes with no new errors; no remaining `entry.id` / `prevEntry.id` / `nextEntry.id` references in the three files; all URL generation now reads `.data.slug`.</done>
</task>

<task type="auto">
  <name>Task 2: Set descriptive slugs for real case studies and add 301 redirects</name>
  <files>src/content/projects/project-alpha.mdx, src/content/projects/project-beta.mdx, public/_redirects</files>
  <action>
    Rename the two real project slugs and preserve their old live URLs.

    1. In src/content/projects/project-alpha.mdx frontmatter: change `slug: "project-alpha"` to `slug: "apollo-design-system"`. Change only the slug line — leave title, thumbnail, and all other frontmatter untouched.
    2. In src/content/projects/project-beta.mdx frontmatter: change `slug: "project-beta"` to `slug: "team-time-tracker"`.
    3. In public/_redirects, append two 301 rules below the existing `/work` rules (keep the existing content and the file's PATH-ONLY comment intact). Add a short comment noting the origin (this quick task), then the rules aligned to the existing column style:
       ```
       # Project slug rename (quick task 260706-ryn): keep old case-study URLs alive.
       /projects/project-alpha   /projects/apollo-design-system   301
       /projects/project-beta    /projects/team-time-tracker      301
       ```
    Do NOT add redirects for placeholder projects (gamma/delta/epsilon) — their slugs are unchanged. Slugs must stay unique; `apollo-design-system` and `team-time-tracker` do not collide with any placeholder slug.
  </action>
  <verify>
    <automated>npm run build</automated>
    <automated>test -f dist/projects/apollo-design-system/index.html && test -f dist/projects/team-time-tracker/index.html && ! test -e dist/projects/project-alpha/index.html && ! test -e dist/projects/project-beta/index.html</automated>
    <automated>grep -q "apollo-design-system" public/_redirects && grep -q "team-time-tracker" public/_redirects</automated>
  </verify>
  <done>`npm run build` succeeds (validates getStaticPaths + frontmatter schema); `dist/projects/apollo-design-system/` and `dist/projects/team-time-tracker/` exist; old `dist/projects/project-alpha/` and `dist/projects/project-beta/` no longer exist; both 301 rules present in public/_redirects.</done>
</task>

</tasks>

<verification>
- `npm run typecheck` passes (no `.astro` prop or collection-query errors).
- `npm run build` completes successfully — this is the strongest gate: it re-runs getStaticPaths (validating unique slug params) and re-validates every MDX frontmatter against the Zod schema.
- Built HTML pages exist at the new slug paths and no longer at the old filename paths.
- `public/_redirects` contains both 301 rules mapping old → new URLs; existing `/work` rules and comments are preserved.
- No `git commit` is run — file edits and verification only, per user preference.
</verification>

<success_criteria>
- Project pages are generated at `/projects/apollo-design-system` and `/projects/team-time-tracker`.
- All internal links (home featured cards, work-index cards, case-study prev/next nav) point to slug-based URLs.
- `/projects/project-alpha` and `/projects/project-beta` 301-redirect to their new URLs via public/_redirects.
- Placeholder projects continue to route unchanged (slug == filename).
- `npm run typecheck` and `npm run build` both pass.
</success_criteria>

<output>
After completion, create `.planning/quick/260706-ryn-use-slug-frontmatter-for-project-urls-in/260706-ryn-SUMMARY.md`
</output>
