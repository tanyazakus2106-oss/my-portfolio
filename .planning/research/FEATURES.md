# Feature Research

**Domain:** UX/UI Designer Personal Portfolio Site
**Researched:** 2026-04-11
**Confidence:** HIGH (multiple current sources, strong consensus across recruiter and design community guidance)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or unprofessional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Project index / work grid | First thing every visitor looks for — the portfolio itself | LOW | Grid or list of case studies + visual work; quality over quantity; 3–5 strong pieces beats 10 weak ones |
| Dedicated case study pages | Recruiters and clients expect to read project narratives, not scan thumbnails | MEDIUM | Each project gets its own URL and full-page treatment; cards or PDFs are not substitutes |
| Case study: problem + process + outcome | Hiring managers evaluate thinking, not just output | MEDIUM | Must include: problem statement, your role, approach, key decisions, final designs, measurable outcome or reflection |
| Clear role/title on homepage above fold | Visitors need to orient in seconds: "who is this person and what do they do?" | LOW | "UX/UI Designer" or more specific positioning; appears in hero, page title, and meta description |
| About page with bio | Recruiters and clients want to understand the person, not just the work | LOW | Bio, design philosophy, background; signals personality and professionalism |
| Visible contact method | If clients or recruiters can't easily reach Tanya, the portfolio has failed its primary job | LOW | Email link or contact form; must not require scrolling to find; clear CTA |
| Responsive design (mobile + desktop) | ~50% of recruiter/initial-browsing traffic happens on mobile | MEDIUM | Layout, images, and typography must hold up at all breakpoints |
| Fast load times | Slow portfolios get bounced before work is seen | LOW–MEDIUM | Optimize images; avoid heavy JS frameworks; static delivery is fast by default |
| Consistent visual quality | The portfolio itself IS a design artifact — low craft signals low standards | MEDIUM | Typography, spacing, color, and image presentation must be intentional and consistent |
| Project thumbnails that communicate quality | First impression in the work grid determines whether visitors click through | LOW | High-quality mockup imagery; consistent framing style across projects |
| Meta title and description with designer name and role | AI-assisted recruiter tools and search engines parse these; missing = invisible | LOW | Include "UX/UI Designer" + name in `<title>` and `<meta name="description">` |

### Differentiators (Competitive Advantage)

Features that set the portfolio apart. Not required, but create meaningful competitive advantage.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Results-first case study structure | Hiring managers often only allocate 5 minutes; showing impact upfront earns the rest of the read | LOW | Lead each case study with a summary box: role, timeline, outcome — before the full narrative |
| Curated "featured" work on homepage | Signals taste and intentionality; lets Tanya control what first impression she makes | LOW | 2–3 hero projects surfaced on homepage rather than full project grid; full index accessible via navigation |
| Testimonials from past clients or collaborators | Critical for freelance clients who need social proof before hiring; differentiates from student/junior portfolios | LOW | 1–3 quotes with name, company, context; even LinkedIn recommendations work |
| Project role clarity (solo vs. team) | Recruiters are specifically looking for evidence of personal contribution, not team output | LOW | A sentence per case study clarifying scope of ownership — "I led X, collaborated on Y" |
| Reflections / lessons learned section in case studies | Shows maturity, self-awareness, growth mindset — rare and valued by senior hiring managers | LOW | Optional end-of-case-study section; what you'd do differently, what you learned |
| Subtle scroll-triggered animations | Adds polish and demonstrates motion design sensibility without distracting from the work | MEDIUM | Entrance animations on project cards, fade-in sections; must be purposeful, not decorative |
| Hover effects on project cards | Micro-interaction that signals design craft at the index level before a case study is opened | LOW | Subtle scale or overlay on hover; avoid heavy JS |
| Open graph / social preview images | When portfolio URL is shared in Slack, LinkedIn, or email, a rich preview appears — signals professionalism | LOW | `og:image`, `og:title`, `og:description` per page |
| Keyboard navigation / accessibility basics | Demonstrates UX values — a UX designer with an inaccessible portfolio is a contradiction | LOW | Focus states, semantic HTML, sufficient color contrast; not full WCAG audit but intentional basics |
| Availability / status signal | Freelance clients want to know if Tanya is currently taking on work before they invest time reading | LOW | A single line: "Currently available for freelance" or "Open to full-time roles" near contact CTA |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this specific portfolio's goals.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full-screen loading animation / splash screen | Feels dramatic and "designed" | Delays access to actual work; recruiters bounce; adds no information value | Skip straight to the work; let the homepage design itself be the first impression |
| Heavy animation on every element | Demonstrates motion skills | Distracting, slows perception of content, fatigues viewers, signals inexperience | 2–3 intentional animations max; entrance on scroll for sections, hover on cards |
| Blog / writing section | Content marketing, SEO, thought leadership | Requires ongoing maintenance; empty blog looks worse than no blog; out of scope per PROJECT.md | Defer; if added later, only publish when there's real content to put there |
| Resume PDF download as primary CTA | Applicants want to make it easy | Shifts frame from "portfolio" to "job applicant"; devalues the case study work; CLIENT visitors don't want a resume | Keep contact CTA as primary; resume available on request or linked subtly in About |
| Cluttered work grid showing all work | "More work = more impressive" belief | Dilutes quality signal; visitors don't know what to focus on; confuses positioning | Curate to 4–6 strongest pieces; quality over quantity is a signal of taste |
| Auto-playing video / motion in hero | High visual impact | Can trigger motion sensitivity; slows load; distracts from navigation; often feels gimmicky | Static hero with strong typography and a single well-chosen project image |
| Client logo wall (without context) | Implies prestigious client list | Without testimonials or project links, logos feel like name-dropping; some client relationships may be NDA-sensitive | Pair logos with testimonials or brief project descriptions, or omit entirely |
| Live prototype embeds (Figma, InVision) | Lets visitors interact with actual designs | Requires external service dependency; Figma embeds can be slow or break; adds complexity | Use static screenshots and annotated images in case studies; link to external prototypes as secondary option |
| Infinite scroll on project index | Feels modern, removes pagination | Breaks browser back-button expected behavior; makes it hard for visitors to orient in the project list | Simple grid with all projects visible, or paginated with clear controls |
| Dark mode toggle | Shows technical chops, UX awareness | For a minimal, work-forward portfolio, maintaining two full design states doubles visual QA burden; lower ROI than investing that effort in the work itself | Set a single deliberate mode (light is safer for showing design work true to creation context); revisit post-launch if requested |

## Feature Dependencies

```
Project Index Page
    └──requires──> Project thumbnail images
    └──requires──> Project metadata (title, category, hero image)
                       └──required by──> Individual Case Study Pages

Individual Case Study Pages
    └──requires──> Project narrative content (problem, process, outcome)
    └──requires──> Case study imagery (wireframes, mockups, process shots)
    └──enhances──> Reflections section (optional, adds depth)

Results-First Case Study Structure
    └──requires──> Case Study Pages (can't exist without them)
    └──enhances──> Overall recruiter experience

Contact Method
    └──requires──> About Page (context for who they're contacting)

Availability / Status Signal
    └──enhances──> Contact Method (gives visitors confidence before reaching out)

Open Graph / Social Previews
    └──requires──> Meta tags on all pages
    └──requires──> og:image assets per project

Testimonials
    └──enhances──> Contact Method (increases conversion)
    └──requires──> Content from past clients / collaborators

Scroll-triggered Animations
    └──requires──> Core layout complete (can't animate what hasn't been built)
    └──enhances──> Project Index Page and Case Study Pages

Accessibility Basics
    └──requires──> Semantic HTML structure (must be built in from start, costly to retrofit)
```

### Dependency Notes

- **Case study pages require content decisions upfront:** The structure of what goes on a case study page (problem / process / outcome / reflection) needs to be locked before templates are built — retrofitting a different structure means rebuilding page layout.
- **Scroll animations require layout completion:** Implement after all sections are placed; adding animations to unstable layouts creates rework.
- **Accessibility requires semantic HTML from day one:** Focus states, landmark regions, and alt text are hard to retrofit; build in from the start.
- **Testimonials are content-dependent, not tech-dependent:** No implementation complexity — just requires Tanya to source quotes from past clients or collaborators before launch.

## MVP Definition

### Launch With (v1)

Minimum needed for the portfolio to serve its job: get Tanya hired or contacted.

- [ ] Project index page — the portfolio only exists once visitors can see the work
- [ ] 3–5 case study pages with problem / process / outcome / role clarity — table stakes for both recruiters and freelance clients
- [ ] Results-first summary at top of each case study — high value, minimal effort, differentiates immediately
- [ ] About page with bio — both audiences want to understand the person
- [ ] Contact CTA (email link minimum) — without this the portfolio is a dead end
- [ ] Availability / status signal — freelance clients need this to decide whether to invest time
- [ ] Responsive design — non-negotiable for mobile browsing
- [ ] Correct page titles and meta descriptions — required for AI-assisted recruiter screening tools
- [ ] Hover effects on project cards — low effort, high craft signal, clearly within scope
- [ ] Accessibility basics (semantic HTML, alt text, focus states) — must be built in from day one

### Add After Validation (v1.x)

Add once the core portfolio is live and receiving real traffic/outreach.

- [ ] Testimonials — gather from past clients after launch; adds significant credibility for freelance conversions
- [ ] Scroll-triggered entrance animations — adds polish; defer until layout is stable post-launch
- [ ] Open graph / social preview images — improves link-sharing appearance; valuable but not blocking launch

### Future Consideration (v2+)

Defer until there's a clear reason to invest.

- [ ] Blog / writing section — only add if Tanya commits to maintaining it; empty blog is worse than none
- [ ] Password-protected case studies (NDA work) — only needed if NDA projects become relevant to showcase
- [ ] Dark mode — revisit if explicitly requested by Tanya post-launch; lower ROI than other improvements

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Project index with curated work | HIGH | LOW | P1 |
| Case study pages (problem / process / outcome) | HIGH | MEDIUM | P1 |
| Results-first case study structure | HIGH | LOW | P1 |
| About page | HIGH | LOW | P1 |
| Contact CTA | HIGH | LOW | P1 |
| Responsive design | HIGH | MEDIUM | P1 |
| Role clarity per project | HIGH | LOW | P1 |
| Page titles + meta descriptions | HIGH | LOW | P1 |
| Accessibility basics | MEDIUM | LOW (if built in from start) | P1 |
| Availability / status signal | HIGH | LOW | P1 |
| Hover effects on project cards | MEDIUM | LOW | P1 |
| Testimonials | HIGH | LOW (content-dependent) | P2 |
| Open graph / social previews | MEDIUM | LOW | P2 |
| Scroll-triggered animations | MEDIUM | MEDIUM | P2 |
| Reflections section in case studies | MEDIUM | LOW | P2 |
| Blog | LOW | HIGH (maintenance burden) | P3 |
| Dark mode toggle | LOW | MEDIUM | P3 |
| Figma prototype embeds | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

Based on analysis of well-regarded UX portfolio patterns (Julie Zhuo, Nathaniel Koloc, Tobias van Schneider style portfolios and guidance from uxfol.io, CareerFoundry, IxDF):

| Feature | Common (Most Portfolios) | Strong Portfolios | Our Approach |
|---------|--------------------------|-------------------|--------------|
| Work grid on homepage | Yes, often cluttered | Curated 3–5 projects, quality-forward | Curated featured work; full index as secondary page |
| Case study depth | Variable — many are shallow | Problem + process + decisions + outcome + reflection | Full narrative structure with results-first summary box |
| Contact visibility | Often buried in footer | Prominent CTA, near-top placement | Visible without scrolling; availability status adjacent |
| About page | Present, often generic | Personal, specific voice and philosophy | Bio with design philosophy and positioning |
| Testimonials | Rare at junior/mid level | Present on freelance-focused portfolios | Gather and include; high ROI for freelance credibility |
| Mobile | Often afterthought | First-class responsive | Responsive from day one |
| Animation | Heavy or none | Purposeful micro-interactions only | Hover effects on cards; optional scroll animations post-launch |
| Social proof signals | Missing | Testimonials, client names (where allowed) | Testimonials; project role clarity |

## Sources

- [UX Portfolio Playbook: What Recruiters Actually Look For in 2026 — uxfol.io](https://blog.uxfol.io/ux-portfolio-playbook/)
- [What Should a UX Design Portfolio Contain? — Interaction Design Foundation](https://ixdf.org/literature/article/what-should-a-ux-design-portfolio-contain)
- [How to Write UX/UI Design Case Studies — IxDF](https://ixdf.org/literature/article/how-to-write-great-case-studies-for-your-ux-design-portfolio)
- [14 Common UX Portfolio Mistakes to Avoid — Designlab](https://designlab.com/blog/ux-portfolio-mistakes-to-avoid)
- [UX Portfolio Mistakes: 11 Red Flags — UX Playbook](https://uxplaybook.org/articles/11-common-ux-portfolio-mistakes-and-solutions)
- [How to Design Portfolio Homepages That Land You a Job in 2025 — UX Playbook](https://uxplaybook.org/articles/6-ux-portfolio-homepage-mistakes-2025)
- [The Ultimate UX Case Study Template & Structure — uxfol.io](https://blog.uxfol.io/ux-case-study-template/)
- [10 Inspiring Graphic Design Portfolios — Flux Academy](https://www.flux-academy.com/blog/10-inspiring-graphic-design-portfolios-how-to-create-your-own)
- [UX Portfolios: 30+ Inspiring Examples — Site Builder Report](https://www.sitebuilderreport.com/inspiration/ux-portfolios)
- [Password-protected portfolio: smart move or red flag? — Glassdoor Forum](https://www.glassdoor.com/Community/creatives/password-protected-portfolio-smart-move-or-red-flag)

---
*Feature research for: UX/UI Designer Personal Portfolio Site*
*Researched: 2026-04-11*
