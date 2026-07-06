---
quick_id: 260706-ilu
title: Rename About hero eyebrow text to "About"
status: complete
date: 2026-07-06
---

# Quick Task 260706-ilu — Rename About hero eyebrow

## Goal

Change the About page hero eyebrow text from
"Now — Open to full-time & freelance" to "About" (renders as "ABOUT" via the
existing CSS `uppercase`), mirroring the reference's page-name eyebrow.

## Task

**Files:** `src/pages/about.astro` (hero eyebrow `<p>`, line ~43)

**Action:** replace inner text `Now — Open to full-time &amp; freelance` → `About`.
No class/style change. Meta `description` on line 9 (which also mentions
"full-time … freelance") left untouched — different element.

**Verify:** eyebrow reads "About"; old text gone; meta description intact;
typecheck clean.

## Out of scope (offered separately)

Eyebrow *styling* still differs from tushar's "ABOUT" (yours: `text-sm` 14px
`tracking-[0.08em]`; tushar: `text-xs` 12px `tracking-widest`). Not changed —
this task was text-only.
