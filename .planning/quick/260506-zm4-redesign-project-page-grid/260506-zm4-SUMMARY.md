---
quick_id: 260506-zm4
description: Redesign project detail page to match tushar.work grid + typography
date: 2026-05-06
status: complete
commits:
  - b9d1a1d
files_changed:
  - src/pages/projects/[id].astro
---

# Quick Task 260506-zm4 — Summary

## What changed

Single-file rewrite: `src/pages/projects/[id].astro` (+93 / −99).

### Layout structure
| Section | Old | New |
|---|---|---|
| Outer container | `.container` (max-w-1440px) | per-section `max-w-[1200px] mx-auto px-[var(--spacing-lg)]` |
| Header column | 760px centered | 1200px |
| Hero image column | inside .container | 1200px (own container) |
| Body article column | 760px | 720px |
| Back link | inline above prose, same column | own container above header, with arrow icon |
| Vertical padding | spacing-3xl wrapper | per-section: pt-lg (back link) → pt/pb-xl (header) → mb-2xl (hero) → pb-4xl (article) |

### Typography
| Element | Old | New |
|---|---|---|
| Eyebrow | text-[13px] tracking-[0.08em] | text-xs tracking-widest |
| H1 | clamp(2.5rem,5vw,4.5rem) | clamp(2.5rem,5vw,4.5rem) max-w-[20ch] leading-[1.05] (unchanged size, added line-height + measure) |
| Summary | text-base | text-xl md:text-2xl max-w-[55ch] leading-relaxed |
| MDX H2 | 13px uppercase tracking-[0.08em] color-text-secondary (label style) | serif 1.875rem color-text-primary mt-3xl mb-lg |
| MDX H3 | unstyled (browser default) | serif 1.5rem color-text-primary my-md |
| MDX P | 16px line-height 1.6 color-text-primary | 16px line-height 1.625 color-text-secondary |
| Prev/Next labels | text-[13px] tracking-[0.08em] | text-xs tracking-widest |

### Components
- **Metadata block** changed from styled card (`bg-[var(--color-secondary)] rounded-lg p-lg`) to a flat 3-col grid with no background. Field labels and values match reference's small-uppercase + text-sm pattern.
- **Hero image wrapper** changed from `rounded-lg` to `rounded-2xl`, with `bg-[var(--color-secondary)]` as a placeholder bg behind the image.
- **Prev/next navigation** preserved inside the 720px body column. Labels updated to text-xs tracking-widest; titles to text-sm.

### Preserved
- `getStaticPaths` wrap-around pagination logic (unchanged)
- `<FullBleedImage>` injection into MDX `Content`
- Scroll-animation behavior on `.case-prose h2` (intersection observer + stagger index)
- `prefers-reduced-motion` handling
- Focus rings and accessibility attributes (`aria-label` on nav, `min-h-[44px]` on links)

## Why

User requested visual parity with `https://www.tushar.work/design/microsoft-edge`. That reference uses a clean two-tier width system (wide for header/hero, narrow for prose) with serif body headings — quite different from the prior page's uniform 760px column with small-uppercase H2 labels.

The reference uses the same fonts (Satoshi + Instrument Serif) so the typography swap was straightforward. The structural shift to per-section width containers makes the case study page easier to read on wider monitors (header type doesn't feel cramped; prose still narrows to a comfortable measure).

## Verification

- `astro check`: 0 errors, 0 warnings on the changed file.
- `grep` confirms must_haves: 3× `max-w-[1200px]`, 1× `max-w-[720px]`, 1× `rounded-2xl`, 3× Timeline/Team/My Role.
- Diff stats: 93 added / 99 removed, net 6-line reduction.

## Notes for future sessions

- The case study page now uses **inline 1200px containers** instead of the global `.container` (which is 1440px). If you ever want to consolidate, you could add a new utility like `.container-narrow` to global.css. Not needed today — the inline approach is surgical and matches the reference.
- `.case-prose h2` and `.case-prose h3` styles are now closer to a generic prose stylesheet. If a future case study needs different heading sizes, scope the overrides to a more specific selector.
- The "Team" field still says "Placeholder — update in MDX" because the projects schema doesn't have a team field. If that field gets added to `src/content.config.ts`, swap the placeholder to `{entry.data.team}` here.
- Reference page (tushar.work) has no prev/next navigation — that block is project-specific to this site and was preserved intentionally.
