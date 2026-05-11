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
| Header (sticky, logo, inline nav visibility) | | | | | | | | |
| MobileNav trigger (hamburger tap target) | PASS | PASS | N/A | N/A | none | ≥44px | n/a | existing min-h-[44px] min-w-[44px] already passes — no change |
| MobileNav overlay (open/close, scroll lock, tap targets) | PROVISIONAL-PASS | PASS | N/A | N/A | none | ≥44px | n/a | scroll-lock mechanism switched to position-fixed pattern (commit b2716b3); 375 awaits real-iPhone verify in 05-07 |
| ThemeToggle (tap target) | | | | | | | | |
| Footer (grid reflow, icon-btn tap targets) | PASS | PASS | PASS | PASS | none | ≥44px | n/a | tap target 40→44 (commit 68b52c7) |
| index.astro — hero section | | | | | | | | |
| index.astro — projects section (ProjectCard layout) | | | | | | | | |
| about.astro — hero grid (lg:grid-cols-2) | | | | | | | | |
| about.astro — how I work / beyond work sections | | | | | | | | |
| projects/[id].astro — header, summary | | | | | | | | |
| projects/[id].astro — cover image | | | | | | | | |
| projects/[id].astro — case prose body | | | | | | | | |
| projects/[id].astro — prev/next nav | | | | | | | | |
| FullBleedImage (in case prose) | PASS | PASS | PASS | PASS | none | n/a | single-src | overflow-x guard on .full-bleed (commit 61d573d) |
| ArrowLink (typographic density check only) | | | | | | | | |

## Pre-Identified Failures (recorded before audit runs)

Per RESEARCH §3 and PATTERNS § "Key Pre-Identified Failures":

| Component | Issue | Source confirmation | Fix plan |
|-----------|-------|---------------------|----------|
| `Footer.astro` `.footer-icon-btn` | `width: 40px; height: 40px` — 4px below D-04 44px minimum | Footer.astro lines 92–93 | 05-02-PLAN.md — RESOLVED in 68b52c7 |
| `FullBleedImage.astro` figure | `100vw` breakout causes horizontal scroll on browsers with visible scrollbars; the BaseLayout `overflow-x: hidden` guard the component comment references does not exist | Grep src/ — no overflow-x declaration; FullBleedImage.astro line 5 comment | 05-02-PLAN.md — RESOLVED in 61d573d |
| `MobileNav.astro` `open()`/`close()` | `document.body.style.overflow = 'hidden'` does not prevent iOS Safari momentum scroll | MobileNav.astro lines 92, 108; multi-source verified | 05-03-PLAN.md — RESOLVED in b2716b3 (375-column gate still pending real-iPhone verify in 05-07) |

These three FAILs are addressed in Wave 2 fix plans regardless of audit outcome.

## Sign-Off

- [ ] All 60 cells (15 rows × 4 breakpoints) filled with PASS / COSMETIC / FAIL
- [ ] Every FAIL cell has a linked fix commit SHA in the Notes column
- [ ] Overflow snippet returns empty table on every page at every breakpoint
- [ ] Touch-target snippet returns empty failures table at 375 px on every page (ArrowLink instances excluded)
- [ ] Real-iPhone 375 column verification passed (per 05-07-PLAN.md)
- [ ] Sign-off date recorded: ___________
