---
quick_id: 260507-fcw
type: quick
plan: 01
wave: 1
depends_on: []
files_modified:
  - src/pages/work.astro
  - src/pages/index.astro
  - src/pages/projects/[id].astro
  - src/components/ui/ArrowLink.astro
  - src/scripts/scroll-animation.ts
autonomous: true
requirements:
  - QUICK-260507-fcw
must_haves:
  truths:
    - "src/pages/work.astro no longer exists in the repo"
    - "Clicking 'Work' in the header or mobile nav lands on the home page (/), where the Projects section is the work archive"
    - "Clicking 'Back to work' from any case-study page lands at the Projects section of the home page (anchor /#projects), with the section title not hidden under the sticky header"
    - "No source file under src/ contains the string '/work' (no broken links, no stale comments)"
    - "`npm run typecheck` passes with no errors"
  artifacts:
    - path: "src/pages/index.astro"
      provides: "Projects <section> is now the anchor target #projects with scroll-mt-20 to clear the sticky h-20 header"
      contains: 'id="projects"'
    - path: "src/pages/projects/[id].astro"
      provides: "Back-link rerouted from /work to /#projects"
      contains: 'href="/#projects"'
    - path: "src/components/ui/ArrowLink.astro"
      provides: "JSDoc usage example updated to /#projects"
    - path: "src/scripts/scroll-animation.ts"
      provides: "Leading comment no longer references /work"
  key_links:
    - from: "src/pages/projects/[id].astro"
      to: "src/pages/index.astro#projects"
      via: "ArrowLink href"
      pattern: 'href="/#projects"'
    - from: "src/components/Header.astro Work link (already href=\"/\")"
      to: "src/pages/index.astro"
      via: "Existing nav — no change required, verified during planning"
      pattern: "href: '/'"
---

<objective>
Remove the standalone `/work` archive page. The home page (`src/pages/index.astro`) already contains a hero plus a Projects section listing every case-study card, so it now serves as the work archive. Reroute the only dependent in-app link — the "Back to work" arrow on each case-study page — to `/#projects`, and add the `id="projects"` anchor (with `scroll-mt-20` to clear the sticky 80px header) to the Projects section so the back-link lands at the cards, not the top of the page. Sweep two cosmetic comments that still reference `/work` for grep hygiene.

**Already verified during planning, no change needed:**
- `src/components/Header.astro` line 7 — `Work` link is `href: '/'` ✓
- `src/components/MobileNav.astro` line 3 — `Work` link is `href: '/'` ✓

Purpose: Eliminate a redundant page. The home page already shows every project, so a separate `/work` archive duplicated content and added a navigation hop. Removing it simplifies the IA to: home (work) / about / resume / contact.

Output: One atomic commit deleting `work.astro`, rerouting the case-study back-link, anchoring the home Projects section, and sweeping stale comments. Site has no remaining references to `/work`.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@src/pages/work.astro
@src/pages/index.astro
@src/pages/projects/[id].astro
@src/components/ui/ArrowLink.astro
@src/scripts/scroll-animation.ts

<interfaces>
<!-- Confirmed during planning. The executor should NOT re-explore the codebase for these. -->

Header link list — src/components/Header.astro:7
```ts
{ href: '/', label: 'Work', external: false },
```
Already points to "/". No change needed.

Mobile nav link list — src/components/MobileNav.astro:3
```ts
{ href: '/', label: 'Work', external: false },
```
Already points to "/". No change needed.

Sticky header height — src/components/Header.astro:20
```
<header id="site-header" class="sticky top-0 z-50 h-20 ...">
```
Header is `h-20` = 80px → use Tailwind `scroll-mt-20` on the anchor target so the section title is not hidden under the header when scrolled to.

Current Projects section — src/pages/index.astro:59-67
```astro
{/* Projects section */}
<section class="pt-[132px] pb-[132px]">
  <div class="container">
    <h2 class="text-[48px] text-[var(--color-text-primary)] mb-[var(--spacing-2xl)]">Projects</h2>
    ...
  </div>
</section>
```

Current case-study back-link — src/pages/projects/[id].astro:44
```astro
<ArrowLink href="/work" direction="left">Back to work</ArrowLink>
```

Current ArrowLink JSDoc example — src/components/ui/ArrowLink.astro:5-6
```
 * Standalone (default) — renders <a class="group">:
 *   <ArrowLink href="/work" direction="left">Back to work</ArrowLink>
```

Current scroll-animation comment — src/scripts/scroll-animation.ts:1
```
// Shared scroll-entrance animation — used by /work cards and case study sections.
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Delete /work page; reroute case-study back-link to /#projects; add anchor + sweep comments (atomic)</name>
  <files>src/pages/work.astro, src/pages/index.astro, src/pages/projects/[id].astro, src/components/ui/ArrowLink.astro, src/scripts/scroll-animation.ts</files>
  <action>
This is ONE atomic change — all five touches must land in a single commit so the repo never sits in a state where /work is gone but case studies still link to it.

Make these edits in order:

**1. Delete the standalone work page**
Run: `git rm src/pages/work.astro`

(Do not just `rm` — use `git rm` so the deletion is staged. The file is currently a duplicate archive of the home page's Projects section.)

**2. Anchor the Projects section on the home page**
File: `src/pages/index.astro`, line 60.

Change:
```astro
<section class="pt-[132px] pb-[132px]">
```
To:
```astro
<section id="projects" class="pt-[132px] pb-[132px] scroll-mt-20">
```

Why `scroll-mt-20`: the sticky header is `h-20` (80px). Without scroll-margin, the section's top edge ends up under the header when the browser scrolls to `#projects`. `scroll-mt-20` (= `scroll-margin-top: 5rem` = 80px) offsets the scroll target so the "Projects" heading is fully visible beneath the header. This is a Tailwind utility — no design-token addition needed.

Do NOT change anything else in this file. The `<h2>Projects</h2>` already serves as the visible label; we are only adding the anchor + scroll offset to its containing section.

**3. Reroute the case-study back-link**
File: `src/pages/projects/[id].astro`, line 44.

Change:
```astro
<ArrowLink href="/work" direction="left">Back to work</ArrowLink>
```
To:
```astro
<ArrowLink href="/#projects" direction="left">Back to work</ArrowLink>
```

Keep the label "Back to work" — it still reads correctly even though the destination is the home page's Projects section. The label refers to the user's mental model ("the work archive"), not the URL path.

**4. Update ArrowLink JSDoc example for grep hygiene**
File: `src/components/ui/ArrowLink.astro`, line 6.

Change:
```
 *   <ArrowLink href="/work" direction="left">Back to work</ArrowLink>
```
To:
```
 *   <ArrowLink href="/#projects" direction="left">Back to work</ArrowLink>
```

This is a JSDoc comment only — no behavioral change. Update it so a future grep for `/work` returns zero results.

**5. Sweep the scroll-animation leading comment**
File: `src/scripts/scroll-animation.ts`, line 1.

Change:
```ts
// Shared scroll-entrance animation — used by /work cards and case study sections.
```
To:
```ts
// Shared scroll-entrance animation — used by home-page project cards and case-study sections.
```

Leave lines 2–3 (the `prefers-reduced-motion` note and the `D-18 to D-23, WORK-06, POL-01.` decision-ID comment) untouched.

**Do NOT touch:**
- `src/components/Header.astro` — Work link is already `href: '/'`
- `src/components/MobileNav.astro` — Work link is already `href: '/'`
- Any other file. If `npm run typecheck` flags an error not listed above, stop and surface it before guessing.
  </action>
  <verify>
    <automated>npm run typecheck && test -z "$(grep -rn '/work' src/ 2>/dev/null)" && ! test -e src/pages/work.astro && grep -q 'id="projects"' src/pages/index.astro && grep -q 'href="/#projects"' 'src/pages/projects/[id].astro'</automated>
  </verify>
  <done>
- `src/pages/work.astro` is deleted (git rm staged).
- `src/pages/index.astro` projects section opening tag reads `<section id="projects" class="pt-[132px] pb-[132px] scroll-mt-20">`.
- `src/pages/projects/[id].astro:44` reads `<ArrowLink href="/#projects" direction="left">Back to work</ArrowLink>`.
- `src/components/ui/ArrowLink.astro:6` JSDoc example uses `/#projects`.
- `src/scripts/scroll-animation.ts:1` no longer mentions `/work`.
- `npm run typecheck` exits 0.
- `grep -rn "/work" src/` returns zero matches.
- All five changes ready to commit together with message: `refactor(nav): remove standalone /work page; route Work tab to home and case-study back-link to /#projects`
  </done>
</task>

</tasks>

<verification>
After the edit:

1. **Type check** — `npm run typecheck` must exit 0.
2. **Grep for stale references** — `grep -rn "/work" src/` must return zero lines. (This catches both broken links and stale comments in one sweep.)
3. **File deletion check** — `test ! -e src/pages/work.astro && echo "deleted"` must print `deleted`.
4. **Anchor present** — `grep -n 'id="projects"' src/pages/index.astro` must match line ~60.
5. **Back-link rewritten** — `grep -n 'href="/#projects"' 'src/pages/projects/[id].astro'` must match line ~44.

Optional sanity check (manual, not blocking): `npm run dev`, open `http://localhost:4321/`, click any case-study card, then click "Back to work" on the case-study page → browser should land at the Projects section of the home page with the heading visible beneath the sticky header (not hidden under it).
</verification>

<success_criteria>
- Deleting /work and rerouting its sole inbound case-study link land in a single atomic commit.
- Header and mobile nav "Work" tab continues to land on `/` (already true; verified during planning, no change made).
- Case-study "Back to work" link now goes to `/#projects` and reveals the Projects section with the heading not obscured by the sticky header.
- Repo contains zero references to `/work` after the change.
- `npm run typecheck` is clean.
- No design-token, no styling-system, and no nav-component changes were introduced — surgical edit only, per CLAUDE.md "prefer fewer lines."
</success_criteria>

<output>
After completion, create `.planning/quick/260507-fcw-remove-work-page/260507-fcw-SUMMARY.md` documenting the five touches, the verification commands run, and the resulting commit hash.
</output>
