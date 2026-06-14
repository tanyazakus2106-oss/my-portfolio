# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Tanya's UX/UI Design Portfolio** — live at https://tanyazakus.com

A personal portfolio site for a UX/UI designer targeting both full-time roles and freelance clients. The site showcases case studies and visual design work through dedicated project pages, and serves as the primary professional touchpoint for recruiters, hiring managers, and prospective clients.

**Core Value:** Visitors immediately understand the quality and range of the designer's work, and have a clear path to get in touch.

### Constraints

- **Simplicity**: No CMS overhead — static or code-driven content only
- **Aesthetic**: Clean and minimal — no heavy frameworks or cluttered UIs
- **Maintenance**: Owner edits code directly — keep project content structure simple to update
<!-- GSD:project-end -->

## Commands & local dev

Requires **Node >= 22.12.0** (see `engines.node` in `package.json`).

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server at http://localhost:4321 with HMR |
| `npm run build` | Build the production site to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | `astro check` — TypeScript / `.astro` prop diagnostics |
| `npm run format` | Prettier with `prettier-plugin-astro` |
| `node scripts/generate-favicon-ico.mjs` | Regenerate `public/favicon.ico` from `public/favicon.svg` (run whenever the SVG changes) |

Run `npm run typecheck` and `npm run format` before pushing — there is no CI lint step gating deploys, so local discipline matters.

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

Locked-in choices (see `.planning/research/STACK.md` for the full rationale, alternatives considered, and version-compatibility notes):

- **Astro 6** (`output: 'static'`) — zero-JS-by-default static site generator
- **TypeScript** — bundled with Astro; `tsconfig.json` extends `astro/tsconfigs/strict`
- **Tailwind CSS v4** via `@tailwindcss/vite` — all theming in `src/styles/global.css` under `@theme` (no `tailwind.config.js`)
- **MDX** via `@astrojs/mdx` — case studies authored as `.mdx`
- **`@astrojs/sitemap`** — auto-generates `sitemap.xml` at build
- **`sharp`** — image optimisation (transitive via Astro's `<Image>` service)
- **Formspree** (external) — contact form endpoint; keeps the site 100% static
- **Cloudflare Pages** — host; auto-builds on push to `main`

`package.json` pins `vite` to `^7` via `overrides`. If a future task hits a Vite version mismatch, that override is why.

**Do not introduce:** WordPress / headless CMS, Next.js, Gatsby, jQuery, Bootstrap/Material UI, or React as the primary component model. For an interactive piece, use a small vanilla TS script in `src/scripts/` or an Astro Island with `client:visible` — not a framework runtime.
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
- **Spell-check**: Project-specific words (e.g., "Tushar", "Fontshare", "Satoshi") live in `cspell.json`. Add new project nouns there rather than letting an editor "fix" them.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

**Site type:** Fully static (`output: 'static'` in `astro.config.mjs`). The build emits HTML to `dist/`; Cloudflare Pages serves it. No server runtime, no API routes.

### Routing

File-system routing via `src/pages/`:

- `index.astro` — home (hero + featured work)
- `about.astro` — about page
- `projects/[id].astro` — dynamic route generating one HTML page per case study at build time, fed by the `projects` content collection

### Content layer

`src/content.config.ts` defines the `projects` collection using Astro's `glob` loader pointed at `src/content/projects/**/*.mdx`. Frontmatter is validated by a Zod schema requiring: `title`, `slug`, `role`, `accentColor`, `thumbnail` (image), `skills[]`, `summary`, `publishDate`, `featured`; with optional `timelineRange` and `team`. Adding a new project is a single MDX file — no code changes needed.

### Layout & components

- `src/layouts/BaseLayout.astro` — wraps every page; includes inline FOUC-prevention script that reads `localStorage.theme` synchronously before paint, then `Header` and `Footer`
- `src/components/` — leaf components: `Header`, `Footer`, `FeaturedCard`, `ProjectCard`, `CaseImage`, `FullBleedImage`, `MobileNav`, `ParticlesBg`, `SparkEffect`, `ThemeToggle`
- `src/components/ui/` — small primitives (currently `ArrowLink.astro`)

### Styling

Tailwind v4 via `@tailwindcss/vite`. The single source of truth for design tokens is `src/styles/global.css`:

- Typography: `--font-sans`, `--font-serif`, `--font-mono`
- Spacing: 4px base scale (`--spacing-xs` … `--spacing-4xl`)
- Colors: light-mode tokens by default; dark-mode overrides under both `@media (prefers-color-scheme: dark)` and a manual `:root.dark` class (toggle-driven)
- Global container: `.container` class with `max-width: 1440px` and responsive horizontal padding

### Scripts & interactivity

Minimal client JS. Two standalone TS files live in `src/scripts/`:

- `scroll-animation.ts` — drives the `.animate-on-scroll` entrance pattern (respects `prefers-reduced-motion`)
- `hero-line-animation.ts` — homepage hero line treatment

Theme toggling is the other interactive piece, handled by `ThemeToggle` plus the inline FOUC script in `BaseLayout`.

### Build & deploy

- Build: `astro build` → static HTML/CSS/JS in `dist/`
- Deploy: Cloudflare Pages auto-detects Astro and runs the build on push to `main`. `public/_headers` and `public/_redirects` are Cloudflare Pages directives served verbatim.
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
- **Typography intent: Inter** is the preferred sans-serif, but `global.css` currently declares `--font-sans: "Satoshi"` (with Instrument Serif secondary). Known divergence — propose a token swap rather than overriding `font-family` inline.
- **Color**: Restrained palette. The accent color (`#553EE5` light, `#8776F9` dark) is used sparingly for emphasis. Body text and surfaces stay near greyscale.
- **Motion**: Subtle, fast, dismissible. Scroll entrance animations are 500ms ease-out with a 60ms stagger; anything more dramatic is probably wrong for this site. Always honor `prefers-reduced-motion`.
- **Density**: Designed for the full 1440px container width on desktop. Don't compress to narrower widths just because content is short — let space breathe.

## Context for Future Claude Code Sessions

- **Owner**: Tanya Zakus (UX/UI designer). She edits this codebase directly; there is no engineering team behind her.
- **Audience**: Recruiters, hiring managers, and prospective freelance clients view the live site. The repo itself is public — README quality matters for first impressions.
- **Tone of changes**: Prefer surgical edits over refactors. The site is small enough that "elegant simplicity" beats "robust abstraction." When in doubt, ship fewer lines.
- **CMS**: Intentionally none. Don't suggest Contentful, Sanity, Storyblok, or similar. Case studies are MDX files; that is the contract.
- **JS budget**: Near-zero. Before adding any framework runtime or `client:load` island, ask whether plain CSS or a `<script>` tag could do the job.
- **Deploy target**: Cloudflare Pages, fully static. Avoid changes that would require an SSR adapter unless we've explicitly discussed leaving the static-only model.
- **Local agent state**: `.claude/` is git-ignored — anything stored there is per-machine, not shared across collaborators or future deploys.

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
