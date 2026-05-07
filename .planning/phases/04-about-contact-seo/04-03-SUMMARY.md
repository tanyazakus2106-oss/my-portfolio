---
phase: 04-about-contact-seo
plan: 03
subsystem: nav-contact-resume
tags: [contact, navigation, resume, linkedin, instagram, footer, header, mobile-nav]
requires:
  - "src/components/Header.astro (Phase 2 nav scaffold + external-link spread)"
  - "src/components/Footer.astro (Phase 2 footer scaffold + LINKEDIN_URL/INSTAGRAM_URL/EMAIL constants)"
  - "src/components/MobileNav.astro (Phase 2 mobile overlay nav)"
provides:
  - "Real Resume PDF target wired into all three nav components"
  - "Real LinkedIn personal-profile URL wired into all three nav components"
  - "Real Instagram personal-profile URL wired into Footer social icon"
  - "Placeholder Resume PDF served at /tanya-zakus-designer-resume.pdf"
affects:
  - "Resume nav link (Header / Footer / MobileNav)"
  - "LinkedIn nav link (Header / Footer / MobileNav)"
  - "LinkedIn + Instagram footer social icons"
tech-stack:
  added: []
  patterns:
    - "Existing `external: true` flag → conditional `target='_blank' rel='noopener noreferrer'` spread (no markup change required)"
    - "URL constants centralized in Footer.astro frontmatter; markup reads from constants"
key-files:
  created:
    - "public/tanya-zakus-designer-resume.pdf (319 bytes, structurally valid PDF v1.4 placeholder)"
  modified:
    - "src/components/Header.astro (links array — Resume + LinkedIn entries)"
    - "src/components/Footer.astro (navLinks array + LINKEDIN_URL + INSTAGRAM_URL constants; EMAIL unchanged per D-14)"
    - "src/components/MobileNav.astro (links array — Resume + LinkedIn entries, mirrors Header)"
decisions:
  - "Implemented per D-10 / D-11 / D-12 / D-13 / D-14 / D-15 — no deviations"
  - "Used base64-decoded minimal PDF method (preferred per plan) — avoids byte-offset pitfalls of hand-written xref tables"
metrics:
  duration: "~2 minutes"
  completed: "2026-05-07"
---

# Phase 04 Plan 03: Wire real Resume / LinkedIn / Instagram URLs Summary

Replaced placeholder URLs in `Header.astro`, `Footer.astro`, and `MobileNav.astro` with the real Resume PDF path, real LinkedIn personal profile URL, and real Instagram personal profile URL; dropped a structurally valid 319-byte minimal-PDF placeholder into `public/` so the Resume link resolves at build time.

## What Changed

### Final URLs in each nav component

**`src/components/Header.astro` — `links` array (lines 6–11):**

```ts
const links = [
  { href: '/', label: 'Work', external: false },
  { href: '/about', label: 'About', external: false },
  { href: '/tanya-zakus-designer-resume.pdf', label: 'Resume', external: true },
  { href: 'https://www.linkedin.com/in/tanya-zakus/', label: 'LinkedIn', external: true },
];
```

**`src/components/Footer.astro` — `navLinks` array + URL constants (lines 2–11):**

```ts
const navLinks = [
  { href: '/', label: 'Work', external: false },
  { href: '/about', label: 'About', external: false },
  { href: '/tanya-zakus-designer-resume.pdf', label: 'Resume', external: true },
  { href: 'https://www.linkedin.com/in/tanya-zakus/', label: 'LinkedIn', external: true },
];

const EMAIL = 'tanyazakus2106@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/tanya-zakus/';
const INSTAGRAM_URL = 'https://www.instagram.com/tania_zakus';
```

**`src/components/MobileNav.astro` — `links` array (lines 2–7):**

```ts
const links = [
  { href: '/', label: 'Work', external: false },
  { href: '/about', label: 'About', external: false },
  { href: '/tanya-zakus-designer-resume.pdf', label: 'Resume', external: true },
  { href: 'https://www.linkedin.com/in/tanya-zakus/', label: 'LinkedIn', external: true },
];
```

### EMAIL constant — UNCHANGED (D-14)

`Footer.astro` line 9 remains exactly `const EMAIL = 'tanyazakus2106@gmail.com';`. CONT-01 was already satisfied by Phase 2 — this plan did not touch it.

Verification: `grep -c "EMAIL = 'tanyazakus2106@gmail.com'" src/components/Footer.astro` → **1**.

### `rel="noopener noreferrer"` on all external links

Counts after edits:

| File | `noopener noreferrer` occurrences |
|------|-----------------------------------|
| `Header.astro` | 1 (spread pattern in nav link) |
| `Footer.astro` | 3 (spread pattern in navLinks + hardcoded on LinkedIn icon + hardcoded on Instagram icon) |
| `MobileNav.astro` | 1 (spread pattern in nav link) |

Tabnabbing mitigation (T-04-06) preserved — no markup changes required because the existing spread pattern (`{...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}`) attaches both attributes whenever `external: true`.

### Resume PDF placeholder

| Property | Value |
|----------|-------|
| Path | `public/tanya-zakus-designer-resume.pdf` |
| Size | 319 bytes |
| PDF version | 1.4 |
| Pages | 1 (blank Letter, 612×792) |
| Magic bytes (`%PDF-`) | present |
| `startxref` pointer | present |
| `%%EOF` trailer | present |
| `file` output | `PDF document, version 1.4, 1 pages` |
| Build copies to `dist/` | yes (`dist/tanya-zakus-designer-resume.pdf` exists, 319 bytes) |

The placeholder was created via the base64-decoded method specified in the plan (preferred over hand-written `xref` byte offsets — pre-validated structure). Tanya replaces this file with her real resume when ready; no code change required because the filename is fixed.

## Acceptance Criteria

All criteria from both tasks pass:

- `tanya-zakus-designer-resume.pdf` referenced exactly once in each of Header / Footer / MobileNav.
- `linkedin.com/in/tanya-zakus` referenced once in Header, twice in Footer (navLinks + `LINKEDIN_URL`), once in MobileNav.
- `instagram.com/tania_zakus` referenced once in Footer.
- `EMAIL = 'tanyazakus2106@gmail.com'` unchanged in Footer.
- Old placeholders (`/resume.pdf`, bare `https://linkedin.com`, bare `https://instagram.com`) all removed (grep counts = 0).
- Instagram tracking params (`igsh=`, `utm_source=qr`) absent (grep counts = 0).
- `noopener noreferrer` count ≥ 1 in each component.
- `npm run typecheck` exits 0 (only pre-existing Zod `z` deprecation warnings in `src/content.config.ts` — out of scope).
- `npm run build` exits 0; `dist/tanya-zakus-designer-resume.pdf` exists.

## Deviations from Plan

**None.** Plan executed exactly as written.

D-10 (descriptive filename), D-11 (Resume opens in new tab), D-12 (full LinkedIn personal URL with trailing slash), D-13 (Instagram URL with tracking params stripped), D-14 (EMAIL untouched), D-15 (consistent edits across all three nav components) — all honored.

## Authentication Gates

None encountered.

## Threat Flags

None — no new attack surface introduced. Existing tabnabbing mitigation (T-04-06) preserved via the unchanged spread pattern. Placeholder PDF has no embedded metadata beyond `Type/Catalog` and `Type/Pages` declarations (T-04-08 disposition: accept).

## Known Stubs

**`public/tanya-zakus-designer-resume.pdf`** — placeholder PDF (319 bytes, blank single page). This is **intentional** per D-10: the asset dependency is owned by Tanya, who will replace the file with her real resume before launch. The filename matches the production filename so no future code change is needed. Documented in PLAN.md `<action>` section as the "Asset dependency placeholder" pattern.

This stub does **not** prevent the plan's goal — the Resume nav link resolves to a valid PDF, the build is green, and the user-facing flow works end-to-end. It only displays a blank page until Tanya swaps the file.

## Manual Verification (for human follow-up)

1. `npm run dev` → click Resume in Header → opens `/tanya-zakus-designer-resume.pdf` in new tab (renders blank placeholder PDF).
2. Click Resume in Footer → same behavior.
3. Mobile viewport, hamburger overlay, click Resume → same behavior.
4. Click LinkedIn in Header → opens `https://www.linkedin.com/in/tanya-zakus/` in new tab.
5. Click LinkedIn social icon in Footer → same URL, new tab.
6. Click Instagram social icon in Footer → opens `https://www.instagram.com/tania_zakus` in new tab (no tracking params).
7. DevTools → inspect any external link → `rel="noopener noreferrer"` present.

## Commits

| Task | Hash | Message |
|------|------|---------|
| 1 | `5ebbecc` | feat(04-03): wire real Resume/LinkedIn/Instagram URLs into nav components |
| 2 | `065b78f` | feat(04-03): add placeholder Resume PDF to public/ |

## Self-Check: PASSED

- `src/components/Header.astro` — modified (FOUND)
- `src/components/Footer.astro` — modified (FOUND)
- `src/components/MobileNav.astro` — modified (FOUND)
- `public/tanya-zakus-designer-resume.pdf` — created (FOUND, 319 bytes)
- `dist/tanya-zakus-designer-resume.pdf` — created by build (FOUND, 319 bytes)
- Commit `5ebbecc` — present in `git log`
- Commit `065b78f` — present in `git log`
