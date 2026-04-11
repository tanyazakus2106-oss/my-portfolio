# Pitfalls Research

**Domain:** UX/UI Designer Portfolio Site
**Researched:** 2026-04-11
**Confidence:** HIGH (multiple authoritative sources, cross-verified)

---

## Critical Pitfalls

### Pitfall 1: Case Studies That Show Work But Not Thinking

**What goes wrong:**
The portfolio displays polished final screens and deliverables but omits the design reasoning — what problem was being solved, what constraints existed, what was tried and discarded, and why the final direction was chosen. Hiring managers see beautiful UI but cannot evaluate the designer's judgment.

**Why it happens:**
Designers are proud of the output and default to showcasing it. Documenting process feels like extra work. Many assume the work speaks for itself.

**How to avoid:**
Structure every case study around the problem-to-solution arc: business context → user problem → constraints → research approach → key decisions with rationale → iterations → outcome. Never show a deliverable without explaining why it exists and what alternatives were considered. The reasoning is the product.

**Warning signs:**
- A case study can be skimmed entirely through images without reading a word
- There is no section explaining what was rejected and why
- The "process" section is just a bullet list of deliverable types (personas, wireframes, prototypes) with no explanation of what they revealed

**Phase to address:**
Content planning phase — establish case study narrative structure before writing a word of content. Each project page should be templated around the story arc, not the artifact list.

---

### Pitfall 2: No Stated Outcomes or Impact

**What goes wrong:**
Case studies describe activity ("I conducted 8 user interviews, then created wireframes, then ran usability tests") but never state what changed as a result. Reviewers cannot assess whether the designer's work made a difference.

**Why it happens:**
Designers often work on large teams where business metrics are not directly attributable to a single person's work. Or outcomes were never measured. Or the designer left before results were visible. The temptation is to omit this section entirely.

**How to avoid:**
Outcomes do not have to be hard revenue metrics. Acceptable outcomes include: usability test improvements, reduction in support tickets, qualitative stakeholder feedback, before/after comparison of the user flow, or even "the product shipped and the team adopted the design direction." No outcome at all is the worst option.

**Warning signs:**
- Every case study ends with the final mockup and nothing after it
- There is no "Results" or "Impact" section in any project
- The work is described entirely in past actions with no consequence stated

**Phase to address:**
Content drafting phase — build an outcome statement into the required structure of every case study page template. Make it a non-optional section.

---

### Pitfall 3: Unclear Personal Contribution on Team Projects

**What goes wrong:**
Case studies describe "we" throughout — "we researched," "we designed," "we shipped." Reviewers cannot tell what this specific designer owned, decided, or contributed. This is a credibility killer, especially for senior roles.

**Why it happens:**
Designers are trained to credit teams and avoid sounding self-promotional. This admirable instinct actively damages portfolio effectiveness.

**How to avoid:**
Separate team context from personal ownership. Open with "This was a 4-person team. I owned [X], collaborated with [Y role] on [Z], and handed off [W] to engineering." Use "I" for decisions made, "we" only for genuinely shared work. Be specific about scope.

**Warning signs:**
- "We" appears in every sentence of the case study narrative
- There is no statement of the designer's specific role on the project
- It is impossible to tell which design decisions this person made vs. inherited

**Phase to address:**
Content drafting phase — add a "My Role" field as a required metadata block at the top of every case study page template.

---

### Pitfall 4: Too Much Content, Not Enough Curation

**What goes wrong:**
The portfolio includes every project the designer has ever worked on, including student projects, irrelevant industries, and weaker work. The signal is buried in noise. Hiring managers — who spend 6–30 seconds on initial scan — cannot identify the designer's strongest or most relevant work.

**Why it happens:**
Designers fear that fewer projects will make the portfolio look thin. The instinct is "more is more." The reality is the opposite.

**How to avoid:**
Show 3–5 projects maximum. Lead with the best work, not chronological order. Remove any project that doesn't demonstrate the skill or domain relevant to the target role. Quality of 3 strong case studies vastly outweighs quantity of 8 mediocre ones.

**Warning signs:**
- More than 6–7 projects listed on the index page
- Student or conceptual projects appear alongside client/employer work without clear distinction
- The first project on the page is not the strongest

**Phase to address:**
Content planning phase — define the project shortlist before building any project pages. Resist adding more later without removing something.

---

### Pitfall 5: Unreadable or Tiny Images

**What goes wrong:**
Mockup images are displayed at small sizes — thumbnail-scale. Text in the UI is illegible. Screen details that demonstrate craft cannot be seen. Reviewers cannot actually evaluate the quality of the design.

**Why it happens:**
Designers often embed presentation slides or export images at low resolution. Layout concerns push images smaller. Designers assume users will click to enlarge — most will not.

**How to avoid:**
Display images large enough that UI copy and components are legible without zooming. For full-screen mockups, show them at full width. For mobile designs, show multiple screens at readable size rather than cramming them together. Optimize for legibility, not for fitting more images per page.

**Warning signs:**
- A screenshot of a dashboard where table text is not readable
- Mobile screen mockups shown at thumbnail scale in a 3-column grid
- Slides imported as-is from a Keynote or Figma presentation export

**Phase to address:**
Design and asset preparation phase — establish image size standards (minimum display width per image type) before building pages.

---

### Pitfall 6: Slow Page Load Due to Unoptimized Images

**What goes wrong:**
Portfolio pages contain high-resolution PNG or JPEG exports from Figma — often 2–5MB per image — loaded without compression, lazy loading, or modern format conversion. The page takes 5–10+ seconds to become interactive. Recruiters with limited time leave.

**Why it happens:**
Designers export from Figma and upload directly. The images look great locally. No one checks actual load time. Performance is treated as an engineering concern, not a content concern.

**How to avoid:**
- Export images at 2x for retina displays, no larger
- Convert all images to WebP format (not PNG/JPEG)
- Implement lazy loading for below-the-fold images
- Target under 200KB per image after compression
- Use responsive images (`srcset`) so mobile devices receive smaller files
- Test with Google PageSpeed Insights before launch — target LCP under 2.5 seconds

**Warning signs:**
- Any individual image file is larger than 500KB
- PNG or uncompressed JPEG files in the assets directory
- PageSpeed score below 80

**Phase to address:**
Asset pipeline setup — define image export, compression, and format standards before any content is added. This is infrastructure, not a finishing step.

---

### Pitfall 7: The Portfolio UX Fails to Demonstrate UX Skill

**What goes wrong:**
A UX designer's own portfolio has confusing navigation, broken mobile layout, unclear information hierarchy, inaccessible typography, or requires multiple clicks to find contact information. This is a direct contradiction of the designer's claimed expertise.

**Why it happens:**
Designers focus intensely on the work being showcased and treat the site shell as an afterthought. Or they copy a template without critically evaluating its UX. Or they design at desktop resolution and never test mobile.

**How to avoid:**
Apply the same UX rigor to the portfolio as to any client project. Define user flows for both primary audiences (recruiters scanning quickly; clients evaluating depth). The site should pass a basic usability test: a stranger can find 3 projects and the contact method in under 60 seconds without assistance. Test on actual mobile devices, not just browser DevTools.

**Warning signs:**
- The contact method requires more than 1 click to reach from any page
- Navigation items have unclear labels (e.g., "Things" instead of "Work")
- The mobile layout breaks below 375px viewport width
- Font size on mobile is below 16px for body text

**Phase to address:**
Site architecture and navigation design phase — user flows and navigation structure should be validated before any visual design begins.

---

### Pitfall 8: No Immediate Clarity on Who This Designer Is

**What goes wrong:**
A visitor lands on the homepage and cannot immediately tell: what type of designer this is, what kind of work they do, or what role they are seeking. The identity and positioning are buried or absent. The visitor has to hunt.

**Why it happens:**
Designers assume their portfolio will speak for itself. Or they are reluctant to commit to a specific positioning (product vs. visual vs. generalist). Generic headlines like "Welcome to my portfolio" or just a name treat the homepage as decoration rather than communication.

**How to avoid:**
The hero section of the homepage must state: who you are, what you design, and what your context is (open to work, freelance available, etc.). This should be visible without scrolling. A single clear sentence is better than a list of adjectives. Example: "Product designer specializing in B2B SaaS — open to full-time roles."

**Warning signs:**
- The homepage hero contains only the designer's name and a generic tagline
- A recruiter cannot state the designer's specialization after 6 seconds on the homepage
- "About" page is the only place professional positioning is stated

**Phase to address:**
Homepage design phase — write the positioning statement as the very first content decision, before any design work begins on the homepage layout.

---

### Pitfall 9: Contact Is Hard to Find or Use

**What goes wrong:**
The contact method is buried in the footer, links to a form that may not work, or exists only on a separate Contact page that is not reachable from project pages. Interested parties give up rather than hunt.

**Why it happens:**
Designers treat contact as low-priority infrastructure. The form was set up once and never tested end-to-end. Footer links are added last and overlooked.

**How to avoid:**
- Contact should be reachable from every page (navigation or persistent footer link)
- If using a contact form, test it with a real submission before launch — verify email delivery
- Consider a direct email link (`mailto:`) as a simpler and more reliable fallback
- If using a form service (Formspree, Netlify Forms), verify spam filtering and delivery into the correct inbox

**Warning signs:**
- Contact link only in the footer, not in the main navigation
- No test submission made to verify form delivery
- The form has no success state or error handling

**Phase to address:**
Contact implementation phase — treat form delivery verification as a launch blocker, not a nice-to-have.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Upload raw Figma PNG exports without compression | Fast to publish, no extra tooling | Pages load slowly, poor PageSpeed score, bad first impression | Never — WebP conversion takes minutes |
| Hardcode all case study content in HTML | No CMS setup time | Adding/editing a project requires editing raw HTML in multiple places | Only if owner is fully comfortable with HTML and there are fewer than 5 projects |
| Use a pre-built portfolio template with no customization | Faster launch | Generic appearance signals low investment; template may have poor performance | Only as a wireframe prototype, never as a final product |
| Skip mobile testing in browser DevTools only | Appears fine at design stage | Real devices reveal tap target failures, font size issues, scroll problems | Never — test on a physical device before launch |
| Embed a Google Doc or Notion page as a case study | Zero build time | Loses brand control, loads slowly, breaks if permissions change, looks unprofessional | Never — case studies must live on the portfolio domain |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Contact form (Formspree, Netlify Forms) | Assume form works after configuration without testing | Send a real test submission and verify it arrives in the correct inbox before launch |
| Contact form | No spam protection enabled | Enable honeypot or reCAPTCHA — unprotected forms receive spam within days |
| Analytics (Plausible, Google Analytics) | Tracking script installed but never verified | Check live event firing in the analytics dashboard day-1 to confirm data is flowing |
| Hosted fonts (Google Fonts, Typekit) | Load synchronously, blocking render | Use `font-display: swap` or self-host fonts with preload hints to avoid invisible text during load |
| External image hosting (Cloudinary, imgix) | Configure without setting format auto-conversion | Set `f_auto,q_auto` (Cloudinary) or equivalent to avoid serving PNG when WebP is supported |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full-resolution Figma exports served without compression | LCP above 4 seconds, PageSpeed below 60 | Compress to WebP at 80% quality, max 200KB per image | Immediately, even with a single large image |
| Scroll-triggered animations on every section | Janky scrolling, high CPU on mobile, potential motion sensitivity issues | Use animations sparingly with `prefers-reduced-motion` media query; no more than 2–3 animated elements per page | On any mid-range mobile device |
| CSS/JS not minified or bundled | Slightly slower load; multiplied by number of assets | Use build tool (Vite, Astro's built-in bundler) to minify automatically | Not catastrophic but measurable on slow connections |
| No caching headers on static assets | Every page load re-downloads fonts, images, scripts | Configure long cache TTLs on Vercel/Netlify for hashed static assets | Compounds with each return visitor |
| Video embeds (case study recordings) hosted directly | Videos are enormous files; can easily be 50–200MB | Host video on YouTube/Vimeo and embed with `<iframe>`, or use `<video>` with compressed MP4/WebM | Any case study with screen recording content |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Wall-of-text case studies with no visual breaks | Recruiters stop reading, miss key points | Use headers, callout quotes, before/after comparisons, and short paragraphs — design the reading experience as carefully as the work itself |
| No clear hierarchy between featured and minor projects | All projects feel equal; recruiter cannot tell what to prioritize | Use visual weight (size, order, prominence) to signal which projects matter most |
| Case studies without a concise summary at the top | Reviewer must read the entire page to understand the project | Add a 2–3 sentence summary block at the top: problem, approach, outcome |
| Hover effects as the only affordance for interactive elements | Completely broken on mobile/touch; non-obvious on desktop | All interactive elements must be identifiable without hover |
| Orphaned project pages with no navigation back to the index | Reviewer finishes a case study and has no obvious path to the next | Persistent navigation + "Next project" link at the bottom of every case study page |

---

## "Looks Done But Isn't" Checklist

- [ ] **Contact form:** Tested with a real submission — confirmed email arrives in the correct inbox with content intact
- [ ] **Mobile layout:** Tested on a physical device (not just browser DevTools) at 375px and 390px viewport widths
- [ ] **Images:** Every image verified as WebP format and under 200KB; check with browser DevTools Network tab
- [ ] **Case study narrative:** Each case study has: problem context, personal role, key design decisions with rationale, and stated outcome
- [ ] **PageSpeed score:** Measured with Google PageSpeed Insights — both mobile and desktop above 80
- [ ] **Spelling and grammar:** Every page reviewed with a fresh read + spell check — typos disqualify design portfolios immediately
- [ ] **Broken links:** All navigation, CTA buttons, and footer links tested — no 404s
- [ ] **Open Graph tags:** Share the URL in a chat app — verify the preview shows the correct title, description, and image
- [ ] **Hero positioning statement:** A stranger who has never heard of this designer can state their specialization within 6 seconds of landing on the homepage
- [ ] **Project index order:** The strongest, most relevant project is listed first — not most recent

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Slow load from unoptimized images | LOW | Batch-convert all images to WebP using Squoosh or `sharp` CLI; replace files; re-deploy |
| Broken contact form post-launch | LOW | Switch to `mailto:` link immediately as fallback; debug form service separately |
| Weak case study narratives | HIGH | Requires rewriting content — budget 2–4 hours per case study for a proper revision |
| Poor mobile layout discovered after launch | MEDIUM | Requires CSS fixes across multiple pages; easier to prevent with mobile-first development |
| Generic positioning/unclear hero | LOW | Homepage copy edit — 1–2 hours to rewrite and re-deploy; does not require design changes |
| Missing outcomes in all case studies | HIGH | Research and write outcomes for each project; may require reaching out to former stakeholders for data |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Case studies show work not thinking | Content planning — establish narrative template before writing | Review each case study: can you articulate 3 design decisions with rationale? |
| No stated outcomes | Content drafting — require outcome section in template | Each case study has a Results/Impact section with at least one concrete statement |
| Unclear personal contribution | Content drafting — require "My Role" block in template | "I" vs "we" audit on each case study; role stated in first 100 words |
| Too much content, poor curation | Content planning — define shortlist of 3–5 projects before building | Project index contains no more than 5 projects; weakest removed |
| Unreadable images | Asset standards — define minimum display width before layout work | Every UI screenshot passes legibility test without zooming |
| Slow load from image bloat | Asset pipeline — define compression and format standards before adding content | PageSpeed mobile score above 80; no image file larger than 200KB |
| Portfolio UX fails to demonstrate UX skill | Site architecture — define user flows before visual design | 60-second usability test: stranger finds 3 projects + contact without help |
| No immediate identity clarity | Homepage design — write positioning statement before layout | 6-second test: stranger states designer's specialization correctly |
| Contact hard to find or broken | Contact implementation — treat delivery verification as launch blocker | Test submission confirmed; contact accessible from every page in ≤1 click |

---

## Sources

- [Portfolio Mistakes Designers Still Make in 2026 — Muzli Blog](https://muz.li/blog/portfolio-mistakes-designers-still-make-in-2026/)
- [11 Common UX Portfolio Mistakes and Solutions — UX Playbook](https://uxplaybook.org/articles/11-common-ux-portfolio-mistakes-and-solutions)
- [8 UX Portfolio Website Mistakes to Avoid — Career Strategy Lab](https://www.careerstrategylab.com/8-ux-portfolio-website-mistakes-to-avoid/)
- [7 Design Portfolio Mistakes That Are Costing You Jobs — Interaction Design Foundation](https://www.interaction-design.org/literature/article/avoid-design-portfolio-mistakes-costing-jobs)
- [Only 30 Seconds to Reject Your Portfolio — UX Collective / Medium](https://uxdesign.cc/only-30-seconds-to-reject-your-portfolio-8cb14ac70674)
- [What Hiring Managers Look for in a UX Portfolio — UX Design Institute](https://www.uxdesigninstitute.com/blog/hiring-managers-ux-portfolio/)
- [Image Optimization for the Web: 2026 Proven Techniques — NitroPack](https://nitropack.io/blog/image-optimization-for-the-web-the-essential-guide/)
- [The Speed-Killer Files: 6 UX Mistakes Murdering Your Website Performance — Rock Paper Scissors Studio](https://rockpaperscissors.studio/the-speed-killer-files-6-ux-mistakes-murdering-your-website-performance-data-driven-analysis-2025/)
- [UX Portfolio Guide: How Senior Designers Get Hired in 2026 — UX Playbook](https://uxplaybook.org/articles/senior-ux-designer-portfolio-get-hired-2026)

---

*Pitfalls research for: UX/UI Designer Portfolio Site*
*Researched: 2026-04-11*
