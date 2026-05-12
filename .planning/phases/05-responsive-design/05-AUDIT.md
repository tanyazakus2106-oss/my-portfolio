---
phase: 05-responsive-design
artifact: audit-matrix
status: empty
created: 2026-05-12
breakpoints: [375, 768, 1024, 1440]
---

# Phase 5 — Responsive Audit Matrix

> Verification artifact for Phase 5. Every (page × component) row is audited at all four committed breakpoints (375 / 768 / 1024 / 1440 px).
> Fill each cell with one of three values: PASS, COSMETIC (1024 column only — D-03), or FAIL.
> A row is **DONE** when all 4 cells are filled and any FAIL has a linked fix commit SHA in the Notes column.
> The phase passes the responsive gate when no FAIL cells remain open.

## Cell Semantics

| Value | Meaning |
|-------|---------|
| `PASS` | No issue at this breakpoint. Layout reflows correctly, no overflow, tap targets ≥ 44px on D-04-in-scope tappables, images load appropriate srcset variant. |
| `COSMETIC` | Awkward visually but fully functional and readable. **Valid only in the 1024 column per CONTEXT.md D-03.** Does NOT require a fix. |
| `FAIL` | Broken, unreadable, horizontal overflow present, or tap target below 44px at this breakpoint. **Requires a fix task.** Record commit SHA in Notes once resolved. |

## Methodology

Per RESEARCH §1 testing sequence:

1. Build and serve the production preview: `npm run build && npm run preview`.
2. Open Chrome DevTools responsive mode at exact widths 375, 768, 1024, 1440 (in that order).
3. Set device pixel ratio (DPR) to 2 when testing the 375 column so srcset selection matches real iPhone behavior.
4. For each row: scroll the relevant page section end-to-end, run the overflow + tap-target console snippets, record result.
5. After DevTools pass, verify the 375 column on a real iPhone before declaring the row DONE (RESEARCH §1 step 4).

### Overflow Detection Snippet

Run in DevTools console at each breakpoint, on each page:

```javascript
// Returns the element(s) causing horizontal overflow
(function() {
  const docWidth = document.documentElement.offsetWidth;
  const offenders = [];
  document.querySelectorAll('*').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.right > docWidth || rect.left < 0) {
      offenders.push({ tag: el.tagName, id: el.id, class: el.className.toString().slice(0,60), right: rect.right.toFixed(1), left: rect.left.toFixed(1) });
    }
  });
  console.table(offenders);
})();
console.log('Page overflows?', document.documentElement.scrollWidth > document.documentElement.clientWidth);
```

### Touch-Target Snippet (run at 375 only)

```javascript
const targets = document.querySelectorAll('button, a[href], [role="button"]');
const failures = [];
targets.forEach(el => {
  const r = el.getBoundingClientRect();
  if (r.width < 44 || r.height < 44) {
    failures.push({ tag: el.tagName, class: el.className.toString().slice(0,50), w: r.width.toFixed(1), h: r.height.toFixed(1) });
  }
});
console.table(failures);
```

ArrowLink primitive instances are exempt from this check per CONTEXT.md D-04 (typographic-density exemption).

### Image Asset Selection Check (RESP-02)

In DevTools Network tab → Img filter → reload page at the target breakpoint → confirm the served image width is appropriate:
- About hero photo (`/about`) at 375 DPR-2: served variant should be ≤ 800px wide.
- Case study cover (`/projects/[id]`) at 375 DPR-2: served variant should be ≤ 800px wide.
- FullBleedImage (in case prose): single asset (no srcset); record served file size.

## Audit Matrix

| Component / Page | 375 | 768 | 1024 | 1440 | Overflow? | Tap targets? | Images? | Notes |
|-----------------|-----|-----|------|------|-----------|--------------|---------|-------|
| Header (sticky, logo, inline nav visibility) | PASS | PASS | PASS | PASS | none@all | ≥44px@375 | n/a | inline nav visible at md+; hamburger md:hidden; sticky preserved |
| MobileNav trigger (hamburger tap target) | PASS | PASS | N/A | N/A | none | ≥44px | n/a | existing min-h-[44px] min-w-[44px] already passes — no change |
| MobileNav overlay (open/close, scroll lock, tap targets) | PROVISIONAL-PASS | PASS | N/A | N/A | none | ≥44px | n/a | scroll-lock mechanism switched to position-fixed pattern (commit b2716b3); 375 awaits real-iPhone verify in 05-07 |
| ThemeToggle (tap target) | PASS | PASS | PASS | PASS | n/a | ≥44px@375 | n/a | toggle visible and tappable at all widths |
| Footer (grid reflow, icon-btn tap targets) | PASS | PASS | PASS | PASS | none | ≥44px | n/a | tap target 40→44 (commit 68b52c7) |
| index.astro — hero section | PASS | PASS | PASS | PASS | none@all | n/a | n/a | headline scales cleanly through all widths to 1440 design target |
| index.astro — projects section (ProjectCard layout) | PASS | PASS | PASS | PASS | none@all | ≥44px@375 | n/a | grid reflows cleanly from phone through 1440 design target |
| about.astro — hero grid (lg:grid-cols-2) | PASS | PASS | PASS | PASS | none@all | n/a | PASS (4-step widths) | grid flips to 50/50 at lg=1024 with sticky text column; 50/50 holds through 1440; widths array refined for DPR-2 mobile (commit e55112b) |
| about.astro — how I work / beyond work sections | PASS | PASS | PASS | PASS | none@all | n/a | n/a | 4-col grid (heading + 3-col body) activates at lg=1024 and holds through 1440 |
| projects/[id].astro — header, summary | PASS | PASS | PASS | PASS | none@all | n/a | n/a | clamp() title scales to ~4.5rem max at 1440; 55ch summary holds readability |
| projects/[id].astro — cover image | PASS | PASS | PASS | PASS | none@all | n/a | PASS (4-step widths) | rounded-2xl preserved; fills max-w-[1200px] container at lg+ (capped); widths array (commit e55112b) |
| projects/[id].astro — case prose body | PASS | PASS | PASS | PASS | none@all | n/a | n/a | 720px column with generous side whitespace at 1440; FullBleedImage breakout clean at all widths |
| projects/[id].astro — prev/next nav | PASS | PASS | PASS | PASS | none@all | ≥44px@375 | n/a | audit-driven fix: flex-1 widens tap zone to ~165px@375 (commit 4f0f85f); each link half-width with breathing room at all viewports |
| FullBleedImage (in case prose) | PASS | PASS | PASS | PASS | none | n/a | PASS (sizes=100vw — Path A; Path B src/assets migration deferred, commit 4ed2e7d) | overflow-x guard on .full-bleed (commit 61d573d) + sizes hint (commit 4ed2e7d) |
| CaseImage component (MDX wrapper) | PASS (preparedness — no real MDX usage yet) | PASS (preparedness) | PASS (preparedness) | PASS (preparedness) | n/a | n/a | PASS (widths=[400,720,1440], sizes for 720px column) | Wrapper component + registration + doc-comment in project-alpha.mdx (commits 4ed2e7d) |
| ArrowLink (typographic density check only) | PASS | PASS | PASS | PASS | n/a | exempt (D-04 typographic-density) | n/a | audit-driven fix: accent-color resting state on (hover: none) (commit 4f0f85f → 56df3ff trimmed underline); desktop hover behavior unchanged at all widths |

## Pre-Identified Failures (recorded before audit runs)

Per RESEARCH §3 and PATTERNS § "Key Pre-Identified Failures":

| Component | Issue | Source confirmation | Fix plan |
|-----------|-------|---------------------|----------|
| `Footer.astro` `.footer-icon-btn` | `width: 40px; height: 40px` — 4px below D-04 44px minimum | Footer.astro lines 92–93 | 05-02-PLAN.md — RESOLVED in 68b52c7 |
| `FullBleedImage.astro` figure | `100vw` breakout causes horizontal scroll on browsers with visible scrollbars; the BaseLayout `overflow-x: hidden` guard the component comment references does not exist | Grep src/ — no overflow-x declaration; FullBleedImage.astro line 5 comment | 05-02-PLAN.md — RESOLVED in 61d573d |
| `MobileNav.astro` `open()`/`close()` | `document.body.style.overflow = 'hidden'` does not prevent iOS Safari momentum scroll | MobileNav.astro lines 92, 108; multi-source verified | 05-03-PLAN.md — RESOLVED in b2716b3 (375-column gate still pending real-iPhone verify in 05-07) |

These three FAILs are addressed in Wave 2 fix plans regardless of audit outcome.

## Audit Summary

**Audit run:** 2026-05-12
**Pages audited:** `/`, `/about`, `/projects/project-alpha`
**Breakpoints:** 375, 768, 1024, 1440
**DPR setting:** 2 (for 375 column)
**Matrix dimensions:** 16 rows × 4 breakpoints = 64 cells

### Cell tallies
- PASS cells: 60 (includes 1 PROVISIONAL-PASS — MobileNav overlay @375, pending plan 05-07)
- COSMETIC cells (1024 only — D-03): 0
- FAIL cells: 0
- N/A cells (component hidden at this breakpoint): 4 (MobileNav trigger + overlay at 1024 and 1440 — both `md:hidden`)

### Open FAILs requiring follow-up

None — phase ready for plan 05-07 real-iPhone verification.

### D-01 escape-hatch evaluation

No repeated-pattern failures observed. The audit surfaced two RESP-03 touch-UX gaps (ArrowLink hover-only affordance, prev/next nav narrow tap zone), but each was a single-offender finding addressed by a targeted scoped fix — not 5+ instances of one pattern requiring a system-level rule. No `/gsd-insert-phase 5.1` recommended.

### Audit-driven discoveries (fixed inline)

| Discovery | Severity | Fix | Commit |
|-----------|----------|-----|--------|
| ArrowLink hover affordance never visible on `(hover: none)` touch devices — destination cue invisible to phone/tablet users | RESP-03 | Scoped `@media (hover: none)` block in `ArrowLink.astro` sets resting state to accent color. Underline reveal stays hover-only (touch needs accent only, per user spec). Desktop unchanged. | `4f0f85f` → trimmed in `56df3ff` |
| Case study prev/next nav tap zone narrowed to text content width (~100-130px) on 375 — touch users miss the dead zone between left/right edges | RESP-03 | Added `flex-1` to both `<a>` elements in `src/pages/projects/[id].astro` nav. Each link now fills half the row; `items-end` preserves right-alignment of the right link's content. Tap zone widens to ~165px each at 375. | `4f0f85f` |

### Recommended follow-up actions

None for this phase. Plan 05-07 (real-iPhone verification) is the only outstanding gate: confirms MobileNav scroll-lock on iOS Safari momentum scroll + DPR-aware srcset selection on a physical device. Both audit-driven RESP-03 fixes should be re-verified on real hardware as part of 05-07.

## Sign-Off

- [x] All 64 cells (16 rows × 4 breakpoints) filled with PASS / COSMETIC / FAIL / N/A
- [x] Every FAIL cell has a linked fix commit SHA in the Notes column — N/A, no FAILs
- [x] Overflow snippet returns empty table on every page at every breakpoint
- [x] Touch-target snippet returns empty failures table at 375 px on every page (ArrowLink instances excluded per D-04)
- [ ] Real-iPhone 375 column verification passed (per 05-07-PLAN.md)
- [ ] Sign-off date recorded: ___________
