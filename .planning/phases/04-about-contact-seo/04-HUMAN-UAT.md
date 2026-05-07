---
status: partial
phase: 04-about-contact-seo
source: [04-VERIFICATION.md]
started: 2026-05-07T15:45:00Z
updated: 2026-05-07T15:45:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Favicon renders in browser tab (light + dark OS themes)
expected: Browser tab shows the Tanya-branded "tz" wordmark, not the stock Astro logo. Mark adapts to OS dark/light theme.
result: [pending]

### 2. Resume PDF opens in a new tab from Header, Footer, and MobileNav
expected: PDF opens in a new tab. Browser's PDF viewer renders a single blank Letter-size page (placeholder) without errors. Saving the file preserves the descriptive name `tanya-zakus-designer-resume.pdf`.
result: [pending]
note: PDF is a 319-byte placeholder. Replace `public/tanya-zakus-designer-resume.pdf` with the real resume before launch — filename is intentionally fixed so swap is a file-replace with no code change.

### 3. About page voice fidelity (ABOUT-03)
expected: The bio, How I work, and Beyond Work copy reads as Tanya's authentic voice — not a generic resume summary. Refine the planner-drafted copy in `src/pages/about.astro` if it doesn't sound like you.
result: [pending]

### 4. LinkedIn / social OG preview renders correctly on a deployed URL
expected: Sharing the homepage URL on LinkedIn (or using the LinkedIn Post Inspector) fetches `/og-image.png`, pulls the og:title and og:description, and renders a clean summary_large_image card with no crawler warnings.
result: [pending]
note: This requires a live URL accessible to social crawlers. Run after Phase 6 deploys to Cloudflare Pages.

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
