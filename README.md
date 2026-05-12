# Tanya Zakus — Portfolio

A personal UX/UI design portfolio showcasing case studies and visual design work. Built as a fully static site for fast load times, perfect Lighthouse scores, and zero runtime overhead.

**Live site:** https://tanyazakus.com

## Tech stack

- **[Astro 6.1](https://astro.build/)** — static site generator (zero JavaScript shipped by default)
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling, configured via `@theme` in `src/styles/global.css`
- **TypeScript** — type-safe content schemas and component props (bundled with Astro)
- **MDX** (via `@astrojs/mdx`) — case studies authored as Markdown files in `src/content/projects/`
- **Sitemap** (via `@astrojs/sitemap`) — auto-generated at build
- **Cloudflare Pages** — hosting

## Running it locally

**Requirements:** Node.js 22.12 or newer (see `engines.node` in `package.json`).

```bash
git clone https://github.com/tanyazakus2106-oss/my-portfolio.git
cd my-portfolio
npm install
npm run dev
```

The dev server runs at http://localhost:4321 by default. Hot module reload works for `.astro`, `.mdx`, `.ts`, and `.css` files.

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Build the production site to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run `astro check` for TypeScript / prop errors |
| `npm run format` | Format all files with Prettier |

## Project structure

```
src/
├── components/         Reusable .astro components (Header, Footer, ProjectCard, …)
├── content/
│   └── projects/       Case studies as .mdx files (one per project)
├── content.config.ts   Schema validating each project's frontmatter
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── work.astro
│   └── projects/[id].astro   Dynamic route — one page per project
├── styles/global.css   Tailwind v4 @theme tokens + global styles
└── scripts/scroll-animation.ts
```

## Adding a new case study

1. Create `src/content/projects/<slug>.mdx`
2. Fill in the required frontmatter (validated at build time):
   - `title`, `slug`, `role`, `accentColor`, `thumbnail`, `skills`, `summary`, `publishDate`, `featured`
3. Drop the thumbnail image into the same folder
4. Write the case study body in Markdown — MDX components like `<FullBleedImage>` are available

## Deployment

The site is configured with `output: 'static'` in `astro.config.mjs` and deploys to Cloudflare Pages. Pushing to `main` triggers an automatic deploy.
