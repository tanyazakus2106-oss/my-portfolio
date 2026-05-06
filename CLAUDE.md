<!-- GSD:project-start source:PROJECT.md -->
## Project

**Tanya's UX/UI Design Portfolio**

A personal portfolio site for a UX/UI designer targeting both full-time roles and freelance clients. The site showcases case studies and visual design work through dedicated project pages, and serves as the primary professional touchpoint for recruiters, hiring managers, and prospective clients.

**Core Value:** Visitors immediately understand the quality and range of the designer's work, and have a clear path to get in touch.

### Constraints

- **Simplicity**: No CMS overhead — static or code-driven content only
- **Aesthetic**: Clean and minimal — no heavy frameworks or cluttered UIs
- **Maintenance**: Owner edits code directly — keep project content structure simple to update
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | 6.1.5 | Site framework / static site generator | Purpose-built for content-heavy static sites. Zero JS shipped by default — the browser receives pure HTML unless you explicitly opt a component into hydration. This means perfect Lighthouse scores are achievable without effort. Content Collections give Tanya a type-safe, schema-validated way to manage case studies as MDX files she edits directly. The `/src/pages/` file-system routing means each case study is literally a file — no config, no CMS concept needed. |
| TypeScript | 5.x (bundled with Astro) | Type safety across components and content schemas | Astro ships TypeScript support out of the box with zero configuration. Defining a content schema in `src/content.config.ts` automatically generates TypeScript types for all frontmatter fields — catches typos in case study files at build time, not in production. |
| Tailwind CSS | 4.2.2 | Utility-first styling | v4 removed `tailwind.config.js` entirely — all theme customisation lives in CSS via `@theme`. This is ideal for a portfolio: the design system (typeface, spacing scale, color palette) is declared in one CSS file, which is exactly what a designer editing code directly wants. v4's Lightning CSS engine makes builds near-instant. The utility class approach keeps styles co-located with markup, which suits the small team-of-one maintenance model. |
| MDX | via `@astrojs/mdx` | Case study content format | Allows case study pages to be written as Markdown but with embedded Astro/React components where needed (e.g., an image comparison slider, a callout block). Tanya edits `.mdx` files to add new work — no CMS login, no admin panel. The Astro Content Layer handles validation of required frontmatter fields (title, description, cover image, date) at build time. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrojs/mdx` | latest (Astro 6.x compatible) | MDX support for case study pages | Add immediately. Case studies need rich layout: images, pullquotes, two-column sections. MDX enables this while keeping files as plain text Tanya can open in VS Code. |
| `@astrojs/sitemap` | latest | Auto-generates sitemap.xml | Add at build step. Helps recruiters and Google discover individual case study pages. Zero configuration required. |
| `sharp` | latest | Image optimisation (used by Astro's built-in `<Image>`) | Already a peer dependency of Astro's image service. Enables next-gen format conversion (WebP/AVIF) and responsive `srcset` generation. Critical for a portfolio because case study screenshots are large. No additional install needed beyond what Astro pulls in. |
| `@astrojs/check` | latest | TypeScript diagnostics in CI / terminal | Use in `npm run build` script to catch type errors in `.astro` files before deploy. |
| Formspree (external service) | — | Contact form submissions | Use for the contact form. The form POSTs directly to Formspree's endpoint — zero backend needed, zero serverless functions to maintain. Free tier is 50 submissions/month, more than sufficient for inbound recruiter/client inquiries. Includes spam filtering and reCAPTCHA v3. No environment variables or API keys required in the codebase. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| Vite (bundled with Astro) | Dev server and build bundler | Astro 6.x ships with Vite 6. No separate install or config needed. HMR works out of the box for `.astro`, `.mdx`, `.ts`, and `.css` files. |
| Prettier + `prettier-plugin-astro` | Code formatting | `prettier-plugin-astro` adds proper formatting for `.astro` files, which are neither standard HTML nor JSX. Run `prettier --write .` before commits. |
| `astro check` | Type-checking `.astro` files | Part of `@astrojs/check`. Add to `package.json` scripts as `"typecheck": "astro check"`. Catches prop mismatches and broken content collection queries before deploy. |
| Netlify CLI or Wrangler (optional) | Local preview of form submissions | Only needed if testing contact form locally. Formspree works fine in production without local testing infrastructure. |
## Installation
# Scaffold a new Astro project (use the "Empty" template to start clean)
# Add MDX support
# Add sitemap generation
# Tailwind CSS v4 (use the official Astro integration)
# Code formatting
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro 6 | Next.js 15 | If the portfolio needed heavy client-side interactivity (real-time filters, auth, dynamic data fetching). For a static case study showcase, Next.js ships 40–85KB of JS runtime the user never benefits from. Overkill. |
| Astro 6 | SvelteKit | If Tanya already writes Svelte and prefers that syntax. SvelteKit is excellent but adds framework-specific knowledge overhead vs. Astro's plain HTML-first model. |
| Astro 6 | Gatsby | Gatsby is in maintenance mode as of 2023. Netlify acquired it but development is stalled. Do not start new projects on Gatsby. |
| Astro 6 | Plain HTML + CSS | Viable for 2–3 pages but does not scale to a case study archive (no layouts, no shared components, repetitive markup). Would work but makes adding a 6th case study painful. |
| Tailwind CSS v4 | CSS Modules | CSS Modules are cleaner for large component libraries; unnecessary for a personal site where one person controls all styles. Tailwind's utility classes are faster to prototype with. |
| Tailwind CSS v4 | Tailwind CSS v3 | No reason to start on v3 in 2026. v4 removes the JS config file, builds faster, and is the actively maintained branch. v3 enters maintenance mode. |
| Formspree | Resend + Astro Server Actions | Resend is the better deliverability choice if Tanya already has a custom domain email and wants branded transactional email. However, it requires an Astro SSR adapter (partially server-rendered), which complicates the otherwise fully-static deployment. Formspree keeps the site 100% static and requires zero API key management. Switch to Resend if form volume or deliverability becomes a concern. |
| Formspree | Netlify Forms | Netlify Forms is equally valid if deploying to Netlify (just add `netlify` attribute to the HTML `<form>` tag). Choose based on host: Formspree if on Cloudflare Pages or Vercel; Netlify Forms if on Netlify. |
| Cloudflare Pages (host) | Netlify | Both are excellent. Cloudflare Pages has unlimited bandwidth on the free tier — better for a portfolio with large image assets. Netlify has better DX (drag-and-drop deploys, branch previews). Either works. Avoid Vercel Hobby tier for a professional portfolio that may receive client traffic — the Terms of Service prohibit commercial use on the Hobby plan. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Gatsby | Maintenance mode since 2023. GraphQL data layer is heavy overhead for a portfolio. Build times are slow. Community adoption dropped sharply in favor of Astro. | Astro |
| WordPress / Headless CMS (Contentful, Sanity) | The project explicitly excludes CMS. Even headless CMS adds API keys, webhook setup, rebuild triggers, and monthly cost for a site where one person edits a handful of files per quarter. | MDX files in `src/content/` edited directly |
| Next.js App Router with full SSR | Ships 40–85KB of React runtime for a site with zero interactive requirements. Server Components help but the mental model complexity doesn't pay off here. First load JS is measurably slower than Astro for static content. | Astro |
| React as the primary component model | A portfolio is 95% static HTML. Bringing in React means the browser downloads and parses a runtime just to render text and images. If an interactive component is needed (e.g., image lightbox), use an Astro Island (`client:load`) with a small focused library, not React as the base layer. | Astro `.astro` components; use `client:load` islands sparingly |
| Bootstrap / Material UI | Visual design frameworks impose aesthetic opinions that conflict with the "clean minimal" brief. They also require overriding large amounts of CSS to achieve a custom look — more work than Tailwind, not less. | Tailwind CSS with a custom design token set |
| jQuery | Not relevant in 2026. Any DOM interaction needed can be handled by a small vanilla JS script or an Astro Island. | Vanilla JS or a focused Astro component |
| Netlify Identity / Auth | No authentication is needed on a public portfolio. Adding it is unnecessary complexity. | — |
## Stack Patterns by Variant
- The Content Collections schema already supports this — add a `blog` collection alongside `projects`
- No stack change required; MDX handles prose content identically
- Use Astro Islands: write the interactive component as a standalone `.tsx` or `.svelte` file, add `client:visible` directive
- The rest of the page stays static; only the interactive island hydrates
- Avoid making the entire page client-rendered for one interactive element
- Add `@astrojs/node` adapter (or `@astrojs/cloudflare`) and a Resend API integration
- This moves the site from fully static to "mostly static with one SSR endpoint"
- Only do this if Formspree's 50 submissions/month limit becomes a constraint
- Use `@astrojs/cloudflare` adapter only if server-side rendering is added later
- For fully static output: set `output: 'static'` in `astro.config.mjs` — no adapter needed
- Cloudflare Pages auto-detects Astro and runs `astro build` correctly
## Version Compatibility
| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `astro@6.x` | `@astrojs/mdx@3.x`, `@astrojs/sitemap@3.x`, `@astrojs/tailwind@5.x` | All official Astro integrations track the major Astro version. Use `npx astro add` to install integrations — it handles version resolution automatically. |
| `tailwindcss@4.2.2` | Vite 6 (bundled in Astro 6) | Tailwind v4's Vite plugin (`@tailwindcss/vite`) supports Vite 6 as of v4.2.2 (this fix was explicitly included in that release). Do not use the legacy PostCSS plugin for new projects — use the Vite plugin. |
| `prettier-plugin-astro` | Prettier 3.x | Requires Prettier 3+. Add `"plugins": ["prettier-plugin-astro"]` and `"overrides": [{"files": "*.astro", "options": {"parser": "astro"}}]` to `.prettierrc`. |
## Sources
- GitHub releases page (astro/astro) — confirmed Astro 6.1.5 is latest stable as of 2026-04-08 — HIGH confidence
- GitHub releases page (tailwindlabs/tailwindcss) — confirmed Tailwind CSS v4.2.2 latest stable as of 2026-03-18 — HIGH confidence
- Astro official docs (docs.astro.build/en/guides/content-collections/) — confirmed `src/content.config.ts` is current config file for build-time collections in Astro 5/6 — HIGH confidence
- Astro blog (astro.build/blog/astro-5/) — Astro 5.0 release notes, Content Layer API, MDX performance — HIGH confidence
- Tailwind CSS blog (tailwindcss.com/blog/tailwindcss-v4) — v4 architecture changes, Lightning CSS engine, `@theme` config — HIGH confidence
- Multiple comparisons (eastondev.com, makersden.io, reliasoftware.com) — Astro vs Next.js performance data for static sites — MEDIUM confidence (WebSearch, corroborated by multiple sources)
- Hosting comparison (danubedata.ro, digitalapplied.com, bejamas.com) — Cloudflare Pages unlimited bandwidth on free tier — MEDIUM confidence
- Formspree docs (help.formspree.io/hc/en-us/articles/47605896654227) — 50 submissions/month free tier limit — MEDIUM confidence
- Resend + Astro integration (resend.com/astro, developers.cloudflare.com) — SSR requirement for Resend in Astro — MEDIUM confidence
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

- **Components**: Prefer `.astro` components over framework islands. Reach for `client:*` directives only when interactivity genuinely requires JS (e.g., `ThemeToggle`, `MobileNav`).
- **Styling**: Use Tailwind utility classes inline. Custom values come from the `@theme` tokens in `src/styles/global.css` — don't introduce raw hex colors or magic-number spacing in components.
- **Spacing scale**: All spacing is a multiple of 4px (`--spacing-xs` through `--spacing-4xl`). Avoid arbitrary `p-[13px]`-style values.
- **Theme tokens**: Light/dark colors are declared as CSS variables under `@theme`. Components reference token names, never literal hex.
- **Content authoring**: New case studies are MDX files in `src/content/projects/`. Frontmatter is schema-validated at build time via `src/content.config.ts` — typos surface as build errors.
- **Image paths in MDX**: `thumbnail` is a relative path resolved by Astro's image service. `<FullBleedImage>` accepts public-folder paths as strings.
- **Reduced motion**: Any animation must respect `prefers-reduced-motion` (see the pattern in `src/styles/global.css` and `src/scripts/scroll-animation.ts`).
- **Formatting**: Run `npm run format` (Prettier with `prettier-plugin-astro`) before commits.
- **Type-checking**: Run `npm run typecheck` (`astro check`) before pushing — catches `.astro` prop mismatches and broken collection queries.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

**Site type:** Fully static (`output: 'static'` in `astro.config.mjs`). The build emits HTML to `dist/`; Cloudflare Pages serves it. No server runtime, no API routes.

### Routing

File-system routing via `src/pages/`:

- `index.astro` — home (hero + featured work)
- `work.astro` — full work archive
- `projects/[id].astro` — dynamic route generating one HTML page per case study at build time, fed by the `projects` content collection

### Content layer

`src/content.config.ts` defines the `projects` collection using Astro's `glob` loader pointed at `src/content/projects/**/*.mdx`. Frontmatter is validated by a Zod schema requiring: `title`, `slug`, `role`, `accentColor`, `thumbnail` (image), `skills[]`, `summary`, `publishDate`, `featured`. Adding a new project is a single MDX file — no code changes needed.

### Layout & components

- `src/layouts/BaseLayout.astro` — wraps every page; includes inline FOUC-prevention script that reads `localStorage.theme` synchronously before paint, then `Header` and `Footer`
- `src/components/` — leaf components: `Header`, `Footer`, `FeaturedCard`, `ProjectCard`, `FullBleedImage`, `MobileNav`, `ParticlesBg`, `SparkEffect`, `ThemeToggle`, plus a `ui/` folder for primitives

### Styling

Tailwind v4 via `@tailwindcss/vite`. The single source of truth for design tokens is `src/styles/global.css`:

- Typography: `--font-sans`, `--font-serif`, `--font-mono`
- Spacing: 4px base scale (`--spacing-xs` … `--spacing-4xl`)
- Colors: light-mode tokens by default; dark-mode overrides under `.dark`
- Global container: `.container` class with `max-width: 1440px` and responsive horizontal padding

### Scripts & interactivity

Minimal client JS. The only standalone TS file is `src/scripts/scroll-animation.ts`, which drives the `.animate-on-scroll` entrance pattern with respect for `prefers-reduced-motion`. Theme toggling is the other interactive piece, handled by `ThemeToggle` plus the inline FOUC script in `BaseLayout`.

### Build & deploy

- Build: `astro build` → static HTML/CSS/JS in `dist/`
- Deploy: Cloudflare Pages auto-detects Astro and runs the build on push to `main`
- Sitemap is auto-generated by `@astrojs/sitemap` at build time

### Adding new functionality — decision tree

1. New page → add `.astro` file under `src/pages/`
2. New case study → add `.mdx` under `src/content/projects/` with thumbnail
3. New static UI piece → add `.astro` component under `src/components/`
4. New interactive piece → write a focused vanilla TS script under `src/scripts/` and `<script>` it, OR an Astro Island with `client:visible`. Avoid adding React as a primary layer.
5. New design token → add to `@theme` block in `src/styles/global.css`. Never hardcode a literal in a component.
<!-- GSD:architecture-end -->

## Design Preferences

These guide all visual decisions in this repo. Future sessions should align new components and styles with these defaults rather than introducing competing aesthetics.

- **Aesthetic: minimal.** Default to fewer elements, fewer borders, fewer decorative flourishes. Whitespace is the structural element — let layout do the work that ornamentation does on busier sites.
- **Generous whitespace.** Lean toward the larger end of the spacing scale (`--spacing-xl` and above) for vertical rhythm between sections. Tight spacing belongs only inside a single grouped element (e.g., a card's internal label/title pair).
- **Typography intent: Inter.** Inter is the preferred sans-serif. **Current state:** `src/styles/global.css` declares `--font-sans: "Satoshi"` (with Instrument Serif as the secondary). Treat this as a known divergence from intent — flag it before making large typography changes, and propose a token swap rather than overriding font-family inline.
- **Color**: Restrained palette. The accent color (currently `#6F5FD5`) is used sparingly for emphasis. Body text and surfaces stay near greyscale.
- **Motion**: Subtle, fast, dismissible. Scroll entrance animations are 500ms ease-out with a 60ms stagger; anything more dramatic is probably wrong for this site. Always honor `prefers-reduced-motion`.
- **Density**: Designed for the full 1440px container width on desktop. Don't compress to narrower widths just because content is short — let space breathe.

## Context for Future Claude Code Sessions

- **Owner**: Tanya Zakus (UX/UI designer). She edits this codebase directly; there is no engineering team behind her.
- **Audience**: Recruiters, hiring managers, and prospective freelance clients view the live site. The repo itself is public — README quality matters for first impressions.
- **Tone of changes**: Prefer surgical edits over refactors. The site is small enough that "elegant simplicity" beats "robust abstraction." When in doubt, ship fewer lines.
- **CMS**: Intentionally none. Don't suggest Contentful, Sanity, Storyblok, or similar. Case studies are MDX files; that is the contract.
- **JS budget**: Near-zero. Before adding any framework runtime or `client:load` island, ask whether plain CSS or a `<script>` tag could do the job.
- **Deploy target**: Cloudflare Pages, fully static. Avoid changes that would require an SSR adapter unless we've explicitly discussed leaving the static-only model.

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
