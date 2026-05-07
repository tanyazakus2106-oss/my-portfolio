---
phase: quick-260507-p8w
plan: 01
subsystem: infra
tags: [favicon, ico, sharp, astro, seo]

requires:
  - phase: 04-about-contact-seo
    provides: existing favicon.svg source mark and BaseLayout link tags

provides:
  - Real multi-resolution Windows ICO at public/favicon.ico (16x16 + 32x32, PNG-compressed)
  - Re-runnable scripts/generate-favicon-ico.mjs for regenerating the ICO when the source SVG changes

affects: [phase-05-responsive, phase-06-deploy]

tech-stack:
  added: []
  patterns:
    - "One-shot artifact generator scripts live in scripts/ and are invoked manually (not wired into package.json)"
    - "Hand-rolled ICO packer (~25 lines of Buffer math) used in lieu of a single-purpose dependency"

key-files:
  created:
    - scripts/generate-favicon-ico.mjs
  modified:
    - public/favicon.ico

key-decisions:
  - "Hand-rolled ICO packer over to-ico dependency: avoids adding a single-purpose package to a minimal-tooling stack"
  - "Density 384 for sharp's SVG rasterizer: gives enough headroom before downsampling to 16/32 px"
  - "Generator is manual-invoke only: not added to npm scripts because it is a one-shot artifact tool, not a build step"

patterns-established:
  - "Pattern: artifact-generator scripts live in scripts/*.mjs and are documented via top-of-file Usage comment"

requirements-completed: [SEO-04]

duration: 5min
completed: 2026-05-07
---

# Quick 260507-p8w: Fix Favicon (Generate tz-Branded Favicon) Summary

**Replaced the stock Astro PNG masquerading as `public/favicon.ico` with a real multi-resolution Windows ICO (16x16 + 32x32 PNG-compressed entries) rasterized from `public/favicon.svg` via sharp + a hand-rolled 25-line Buffer packer; no new dependencies.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-07T18:14:00Z
- **Completed:** 2026-05-07T18:15:30Z
- **Tasks:** 2
- **Files modified:** 2 (1 created, 1 overwritten)

## Accomplishments

- `scripts/generate-favicon-ico.mjs` written and committed: re-runnable Node ESM script that rasterizes `public/favicon.svg` into 16x16 + 32x32 PNG buffers via `sharp` (already in `node_modules` transitively via Astro's image service) and packs them into a multi-resolution ICO.
- `public/favicon.ico` regenerated as a real Windows ICO. `file` confirms: `MS Windows icon resource - 2 icons, 16x16 with PNG image data, 16 x 16, 8-bit/color RGBA, non-interlaced, 32 bits/pixel, 32x32 with PNG image data, 32 x 32, 8-bit/color RGBA, non-interlaced, 32 bits/pixel`.
- Production build passes; `dist/favicon.ico` is byte-identical to `public/favicon.ico` (Astro's static-asset pipeline copies the file verbatim).
- `npm run typecheck` passes (`0 errors, 0 warnings`).
- No package.json changes; no new dependencies added.

## Verification Evidence

**`file public/favicon.ico` output**

- **Before:** `PNG image data, 32 x 32, 8-bit colormap, non-interlaced` (655-byte stock Astro PNG renamed to .ico)
- **After:** `MS Windows icon resource - 2 icons, 16x16 with PNG image data, 16 x 16, 8-bit/color RGBA, non-interlaced, 32 bits/pixel, 32x32 with PNG image data, 32 x 32, 8-bit/color RGBA, non-interlaced, 32 bits/pixel`

**Final ICO file size:** 810 bytes

**ICO header bytes (verified via xxd):**

```
00000000: 0000 0100 0200       <- ICONDIR: reserved=0, type=1 (ICO), count=2
00000006: 1010 00 00 0100 2000 <- ICONDIRENTRY 16x16: width=0x10, height=0x10, palette=0, reserved=0, planes=1, bpp=32
00000016: 2020 00 00 0100 2000 <- ICONDIRENTRY 32x32: width=0x20, height=0x20, palette=0, reserved=0, planes=1, bpp=32
00000026: 8950 4e47            <- PNG signature for first image data block
```

**Build pipeline check:**

- `npm run build` -> exit 0, no favicon-related warnings
- `cmp public/favicon.ico dist/favicon.ico` -> 0 (byte-identical)
- `file dist/favicon.ico` -> same "MS Windows icon resource - 2 icons" report
- `grep -o 'favicon\.ico' dist/index.html` -> matches (BaseLayout link tag survives the build)
- `npm run typecheck` -> 0 errors, 0 warnings, 13 hints (all pre-existing, e.g., zod deprecation warnings in `src/content.config.ts`)

**Visual verification in Chrome incognito:** Deferred to deploy. The fix is documented as a Chromium quirk on the planning side; once Cloudflare Pages rebuilds main, the user can hard-refresh in an incognito window to confirm the tz mark replaces the stock Astro icon. Local-build evidence is sufficient for this fix because the Astro pipeline copies the ICO verbatim.

## Task Commits

Each task was committed atomically:

1. **Task 1: Write generate-favicon-ico.mjs and rebuild public/favicon.ico** -- `ef7ce58` (fix)
2. **Task 2: Verify build output and visual correctness end-to-end** -- (no file modifications; verification only)

## Files Created/Modified

- `scripts/generate-favicon-ico.mjs` -- New ESM script: reads `public/favicon.svg`, rasterizes via sharp at density 384, builds 16x16 + 32x32 PNG buffers, packs them into a multi-resolution ICO via a hand-rolled `packIco()` helper, writes `public/favicon.ico`.
- `public/favicon.ico` -- Overwritten: was a 655-byte misnamed PNG; now an 810-byte real multi-resolution ICO.

Untouched (verified): `public/favicon.svg`, `src/layouts/BaseLayout.astro`, `package.json`, `package-lock.json`.

## Decisions Made

- **Hand-rolled ICO packer over `to-ico`:** A single-purpose 25-line packer keeps the project's minimal-tooling stance. ICO is just a 6-byte header + 16-byte-per-entry directory + PNG payloads; not worth a dependency.
- **Manual-invoke generator (not in `package.json` scripts):** The script is a one-shot artifact tool, not a CI build step. Wiring it into `npm run build` would imply it must run on every deploy and would couple the static build to `sharp` at build time (currently it just copies the already-generated `public/favicon.ico`). The plan explicitly forbids this and the constraint was honored.
- **Density 384 for SVG rasterization:** Gives sharp's rasterizer enough headroom to produce a crisp source bitmap before downsampling to 16/32 px squares. Lower densities can introduce subpixel artifacts at very small sizes.

## Deviations from Plan

None - plan executed exactly as written. The generator script and ICO match the plan's specification; no auto-fixes were required.

**Note on file size envelope:** The plan suggested a "reasonable size envelope" of 1.5–4 KB with a sanity floor of 500 bytes ("if <500 bytes, the packer broke"). The final file is 810 bytes — between the floor and the lower estimate. This is expected behavior, not a bug: the source SVG is a black rounded rectangle with two letters at extremely small target sizes (16x16 + 32x32), which compresses to very small PNG payloads (~239 + ~501 bytes). The structure is verifiably correct (ICO header bytes match spec; both PNG payloads parse as valid 8-bit RGBA PNGs via `file`; cmp against dist passes), so the smaller-than-estimated total is a property of the input, not a packer error. No remediation needed.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- SEO-04 favicon trade-off documented in Phase 4 is now closed: Chrome's ICO-preference path serves the tz mark instead of the stock Astro icon.
- The generator script is the source of truth for any future favicon mark updates: edit `public/favicon.svg`, then `node scripts/generate-favicon-ico.mjs` to regenerate.
- No blockers for Phase 5 (responsive design).

## Self-Check: PASSED

Verified before submission:

- `[ -f scripts/generate-favicon-ico.mjs ]` -> FOUND
- `[ -f public/favicon.ico ]` -> FOUND (810 bytes, MS Windows icon resource)
- `git log --oneline | grep -q ef7ce58` -> FOUND (Task 1 commit present in history)
- `cmp public/favicon.ico dist/favicon.ico` -> exit 0 (byte-identical)
- `npm run build` -> exit 0
- `npm run typecheck` -> 0 errors, 0 warnings
- `package.json` unchanged from base commit (no new deps)
- `src/layouts/BaseLayout.astro` and `public/favicon.svg` unchanged

---
*Phase: quick-260507-p8w*
*Completed: 2026-05-07*
