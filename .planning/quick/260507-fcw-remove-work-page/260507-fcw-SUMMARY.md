---
quick_id: 260507-fcw
type: quick
plan: 01
wave: 1
status: complete
completed: 2026-05-07
duration_minutes: 5
requirements_completed:
  - QUICK-260507-fcw
key-files:
  deleted:
    - src/pages/work.astro
  modified:
    - src/pages/index.astro
    - src/pages/projects/[id].astro
    - src/components/ui/ArrowLink.astro
    - src/scripts/scroll-animation.ts
decisions:
  - "Used Tailwind utility scroll-mt-20 (= scroll-margin-top: 5rem = 80px header height) on the Projects <section>; no design-token addition needed since the value matches the existing h-20 sticky header utility"
  - "Kept the label 'Back to work' on the case-study back-link; the user mental model is 'the work archive', which is now the home page Projects section"
metrics:
  files_touched: 5
  insertions: 4
  deletions: 26
  commit: 5c2fae4
---

# Quick Task 260507-fcw: Remove standalone /work page Summary

**One-liner:** Deleted the `/work` route, reanchored the home page's Projects section to `#projects`, and rerouted the case-study "Back to work" link to `/#projects` — all in a single atomic commit.

## Outcome

The standalone `/work` archive page is gone. The home page (`src/pages/index.astro`) now serves as the work archive — its Projects section is the anchor target `#projects`, with `scroll-mt-20` ensuring the heading clears the sticky 80px header when navigated to via hash. The only inbound dependent (the `ArrowLink` on every case-study page) now lands users at the Projects section of the home page.

After the change, there are zero references to `/work` anywhere under `src/`. Information architecture simplified to: home (work) / about / resume / contact.

## Touches (5 files, 1 atomic commit)

1. **`git rm src/pages/work.astro`** — deleted the duplicate archive page.
2. **`src/pages/index.astro:60`** — Projects section opening tag changed from `<section class="pt-[132px] pb-[132px]">` to `<section id="projects" class="pt-[132px] pb-[132px] scroll-mt-20">`. Added the anchor target plus 80px scroll offset for the sticky header.
3. **`src/pages/projects/[id].astro:44`** — case-study back-link `href="/work"` → `href="/#projects"`. Label retained as "Back to work".
4. **`src/components/ui/ArrowLink.astro:6`** — JSDoc usage example updated from `/work` to `/#projects` for grep hygiene; no behavioral change.
5. **`src/scripts/scroll-animation.ts:1`** — leading comment "used by /work cards and case study sections" rewritten to "used by home-page project cards and case-study sections".

## Verification

All gates from the plan executed and passed before commit:

| Check | Result |
| --- | --- |
| `npm run typecheck` | 0 errors, 0 warnings (15 pre-existing `z is deprecated` / unused-`media` hints, all out of scope) |
| `grep -rn "/work" src/` | zero matches |
| `test ! -e src/pages/work.astro` | DELETED |
| `grep -n 'id="projects"' src/pages/index.astro` | matches line 60 |
| `grep -n 'href="/#projects"' src/pages/projects/[id].astro` | matches line 44 |

Header (`src/components/Header.astro:7`) and mobile nav (`src/components/MobileNav.astro:3`) were already `href: '/'` per the plan's pre-flight findings — no change needed and none made.

## Deviations from Plan

None — plan executed exactly as written.

## Auth Gates

None.

## Known Stubs

None.

## Commit

```
5c2fae4 refactor(nav): remove standalone /work page; route case-study back-link to /#projects
```

5 files changed, 4 insertions(+), 26 deletions(-). One file deletion (`src/pages/work.astro`).

## Self-Check

**Files (claimed → actual):**

- `src/pages/work.astro` — claimed deleted: confirmed deleted (`test ! -e` returned true).
- `src/pages/index.astro` line 60 — claimed `<section id="projects" ... scroll-mt-20>`: confirmed via grep.
- `src/pages/projects/[id].astro` line 44 — claimed `href="/#projects"`: confirmed via grep.
- `src/components/ui/ArrowLink.astro` line 6 — claimed `/#projects` in JSDoc: confirmed via grep.
- `src/scripts/scroll-animation.ts` line 1 — claimed comment swept: confirmed via head -1.

**Commit `5c2fae4`** — confirmed present in `git log -1`.

## Self-Check: PASSED
