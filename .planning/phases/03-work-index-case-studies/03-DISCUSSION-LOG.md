# Phase 3: Discussion Log

**Session:** 2026-04-16
**Areas discussed:** Hero copy & availability, Work card hover, Case study page anatomy, Scroll animation approach

---

## Area 1: Hero Copy & Availability

| Question | Options Presented | Answer |
|----------|------------------|--------|
| Availability status | Open to full-time / Freelance / Both / Not displaying | Open to both |
| Hero tone | Warm & personal / Confident & professional / Minimal | Confident & professional |
| Hero copy ownership | Draft it (Claude) / I'll provide the copy | Draft it — I'll refine |
| Specialty / focus area | Product design / UI & visual / User research / Other | Product design (end-to-end UX) |
| Featured projects display | Simpler preview cards / Same as /work cards / You decide | You decide (Claude picks) |

---

## Area 2: Work Card Hover (wenjing.io reference)

| Question | Options Presented | Answer |
|----------|------------------|--------|
| Hover interaction | Image scale + slight lift / Overlay reveal / Text slide-in / Describe it | Image scale + slight lift |
| Number hover | Accent color on hover / Static / You decide | Static |
| Hover transition duration | Snappy (150–200ms) / Smooth (250–300ms) / You decide | Smooth (250–300ms) |
| Image-to-text ratio | 60/40 / 50/50 / You decide | 60% image / 40% text |
| Card CTA | Always visible / On hover only / No CTA (whole card is link) | Always visible |

---

## Area 3: Case Study Page Anatomy

| Question | Options Presented | Answer / Notes |
|----------|------------------|----------------|
| Page opening | Hero section / Content immediately / Full-bleed image header | Reference screenshot provided (Microsoft Edge case study). Structured text header: back link → skills → title → summary → metadata → image. |
| Layout type | Single column / Two-column with sidebar / You decide | Single column (from screenshot) |
| Metadata fields | Timeline / Team / My Role / Skills | Timeline + Team/Company + My Role |
| First image | Full-bleed / Constrained / You decide | Constrained to text column |
| Section heading style | Accent color / Muted label style / Accent for dividers only | Muted label style (like "TIMELINE" in screenshot) |
| Accent color on detail page | Multiple placement options offered | **No accent color on case study pages.** Accent applies to work index cards only. Overrides CASE-03/WORK-04 (detail page portion). |
| Full-bleed image authoring | Custom MDX component / CSS class on img / You decide | You decide |
| Next/prev navigation | Yes / No — back link only / You decide | Yes — next/prev at bottom |
| Content readiness | Real content ready / Placeholder for now / Partially ready | Placeholder for now |

---

## Area 4: Scroll Animation Approach

| Question | Options Presented | Answer |
|----------|------------------|--------|
| Animation style | Fade up / Fade in only / Scale + fade | Fade up (opacity + translateY) |
| Library | Vanilla IntersectionObserver / Motion One / You decide | You decide |
| What animates | Work cards / Case study sections / Hero elements | Work cards + case study sections (both; confirmed after clarification that WORK-06 is a requirement) |
| Stagger | Staggered (50–80ms) / All at once / You decide | Staggered (50–80ms) |
| Animation duration | Quick (300–400ms) / Medium (500–600ms) / You decide | Medium (500–600ms) |
| translateY offset | Subtle (16–20px) / Moderate (32–40px) / You decide | You decide |

---

*Log generated: 2026-04-16*
