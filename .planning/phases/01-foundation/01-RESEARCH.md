# Phase 1: Foundation - Research

**Researched:** 2026-04-12
**Domain:** Astro 6 scaffold + Tailwind CSS v4 + MDX Content Collections + Cloudflare Pages deploy
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Cloudflare Pages is the deployment target (not Vercel). FOUND-04 = Cloudflare Pages preview deploy on push to main.
- **D-02:** A note in STATE.md referenced Vercel Pro — this is superseded. Cloudflare Pages free tier is confirmed (unlimited bandwidth, no commercial use restrictions).
- **D-03:** Preview deploy triggered by pushing to the `main` branch.
- **D-04:** Include 2 placeholder MDX project files in `src/content/projects/` with all required frontmatter fields populated (realistic but dummy data). Purpose: validate that `content.config.ts` schema compiles, `getCollection('projects')` returns data, and the build passes end-to-end before real case studies exist.
- **D-05:** Placeholder files should use clearly fake names (e.g., "Project Alpha", "Project Beta") so they're easily identified and replaced in Phase 3.
- **D-06:** Typography: DM Sans for both heading (600/Semibold) and body (400/Regular). JetBrains Mono optional for code snippets in case studies — only load if needed. Phase 1 implements weights 400 and 600 only.
- **D-07:** Full spacing scale (xs 4px → 4xl 96px) declared in `global.css` under `@theme`. All multiples of 4.
- **D-08:** Complete light and dark mode color palette declared in Phase 1 even though the dark mode toggle is built in Phase 2. Both `@media (prefers-color-scheme: dark)` and `.dark` class layers declared from the start.
- **D-09:** Accent color (`#2563EB` light / `#3B82F6` dark) reserved strictly for: active nav indicator, primary CTA button, text link underlines on hover, focus rings, and per-project accent overrides in Phase 3.
- **D-10:** `content.config.ts` validates these frontmatter fields: `title` (string, required), `slug` (string, required), `role` (string, required), `accentColor` (string, required), `thumbnail` (image(), required), `skills` (string[], required), `summary` (string, required), `publishDate` (date, required), `featured` (boolean, optional, default false).
- **D-11:** `src/layouts/BaseLayout.astro` — max content width 1200px centered (`mx-auto`), page horizontal padding 24px mobile / 48px tablet+ / 64px desktop, header height 64px fixed, header `sticky top-0 z-50`, header background dominant color at 95% opacity + `backdrop-blur-sm`.
- **D-12:** Footer background is secondary color, 48px vertical padding.
- **D-13:** Landmark regions: `<header>`, `<main>`, `<footer>` — required for accessibility from day one.
- **D-14:** Touch targets in nav must be minimum 44px height via padding — baked into Phase 1's header to satisfy Phase 5 RESP-03.
- **D-15:** `<html lang="en">` and viewport meta tag included in BaseLayout.

### Claude's Discretion

- Dev tooling setup (Prettier + prettier-plugin-astro + @astrojs/check) — include if straightforward alongside scaffold, otherwise defer
- Git branch strategy details
- Exact Cloudflare Pages project setup steps (dashboard vs. CLI)
- File/directory structure beyond what's specified above

### Deferred Ideas (OUT OF SCOPE)

- None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Site scaffolded with Astro 6 + Tailwind CSS v4 + MDX Content Collections | Scaffold command, Tailwind Vite plugin setup, MDX integration install — all verified |
| FOUND-02 | Project content schema defined (`content.config.ts`) with typed frontmatter (title, slug, role, accent color, thumbnail, skills, summary) | `defineCollection` + `glob` loader + `z` schema + `image()` helper API verified from official docs |
| FOUND-03 | Root layout shell with sticky header and footer wrapping all pages | BaseLayout.astro pattern — exact constraints locked in D-11 through D-15; Tailwind v4 `@theme` token syntax verified |
| FOUND-04 | Site deploys successfully to Cloudflare Pages (preview deploy on push to main branch) | Cloudflare Pages GitHub integration via dashboard (no Wrangler required); build command `npm run build`, output dir `dist`, no adapter for static output — verified |

</phase_requirements>

---

## Summary

Phase 1 is a pure scaffolding and configuration phase: no user-visible content, no interactive features. The deliverables are the Astro 6 project with integrations wired, the design token system in `global.css`, the content schema in `content.config.ts`, the `BaseLayout.astro` shell, and a live Cloudflare Pages preview URL.

The stack is fully locked by CLAUDE.md and CONTEXT.md decisions. Research confirms there are no blocking unknowns — all APIs have been verified against official documentation. The most consequential implementation detail is the Tailwind v4 setup: `@astrojs/tailwind` is deprecated; the correct approach is `npx astro add tailwind` which installs `@tailwindcss/vite` and wires it into the Vite config automatically. The Cloudflare Pages deploy requires only a GitHub connection via the dashboard — Wrangler CLI is not installed and is not required for a fully static site.

The only structural risk is the dark mode token architecture: `@theme` variables live in `:root`, but the dark mode overrides must be in both `@media (prefers-color-scheme: dark)` and `.dark` class scope simultaneously. Tailwind v4 does not auto-generate this split — it must be hand-authored in `global.css`.

**Primary recommendation:** Follow the locked decisions verbatim. The implementation is straightforward — the main work is typing out the token system precisely as specified in the UI-SPEC, the content schema fields exactly as in D-10, and the layout constraints exactly as in D-11 through D-15.

---

## Project Constraints (from CLAUDE.md)

These directives override any research recommendations:

| Directive | Rule |
|-----------|------|
| Framework | Astro 6 only. No Next.js, Gatsby, SvelteKit. |
| Styling | Tailwind CSS v4 only. No Bootstrap, MUI, CSS Modules. |
| Content | MDX files in `src/content/` only. No CMS, no Contentful, no Sanity. |
| Components | Astro `.astro` components. No React as base layer. |
| Tailwind config | `@theme` in CSS — no `tailwind.config.js`. |
| Tailwind integration | Vite plugin (`@tailwindcss/vite`) — NOT deprecated `@astrojs/tailwind`. |
| Interactivity | Vanilla JS or focused Astro Islands only. No jQuery. |
| Contact form | Formspree (static, no backend). |
| Hosting | Cloudflare Pages free tier (confirmed by D-01/D-02). |
| Auth | None — not needed. |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | 6.1.5 | Site framework / SSG | File-system routing, Content Collections, zero-JS by default |
| `typescript` | 5.x (bundled) | Type safety | Ships with Astro, zero config needed |
| `tailwindcss` | 4.2.2 | Utility styling | v4 is the current branch; `@theme` CSS-first token system |
| `@tailwindcss/vite` | 4.2.2 | Tailwind Vite plugin | Replaces deprecated `@astrojs/tailwind`; required for v4 in Astro |
| `@astrojs/mdx` | 5.0.3 | MDX support | Case study content with embedded components |

[VERIFIED: npm registry — all versions confirmed 2026-04-12]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrojs/sitemap` | 3.7.2 | Auto-generates sitemap.xml | Add at scaffold time |
| `sharp` | 0.34.5 | Image optimisation (peer dep of Astro) | Pulled in automatically; enables WebP/AVIF via `<Image>` |
| `@astrojs/check` | 0.9.8 | TypeScript diagnostics for `.astro` files | Add `"typecheck": "astro check"` to package.json scripts |
| `prettier` | 3.8.2 | Code formatting | Run before commits |
| `prettier-plugin-astro` | 0.14.1 | Astro file formatting support | Required alongside Prettier for `.astro` files |

[VERIFIED: npm registry — all versions confirmed 2026-04-12]

### Installation

```bash
# 1. Scaffold project (Empty template)
npm create astro@latest my-portfolio -- --template empty --typescript strict --no-git

cd my-portfolio

# 2. Add integrations (handles version resolution automatically)
npx astro add mdx
npx astro add sitemap
npx astro add tailwind   # installs @tailwindcss/vite, NOT the deprecated @astrojs/tailwind

# 3. Dev tools
npm install --save-dev prettier prettier-plugin-astro @astrojs/check
```

**Critical note:** Do NOT run `npm install @astrojs/tailwind` — that package is deprecated. Use `npx astro add tailwind` which installs `@tailwindcss/vite`. [VERIFIED: docs.astro.build/en/guides/integrations-guide/tailwind/]

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── content/
│   ├── projects/
│   │   ├── project-alpha.mdx   # Placeholder 1 (D-04/D-05)
│   │   └── project-beta.mdx    # Placeholder 2 (D-04/D-05)
│   └── config.ts               # Content schema (content.config.ts per Astro docs)
├── layouts/
│   └── BaseLayout.astro        # Root layout — header + main slot + footer
├── pages/
│   └── index.astro             # Minimal placeholder page (proves dev server works)
└── styles/
    └── global.css              # @import "tailwindcss" + @theme tokens + dark mode
```

**Note on config file location:** Astro 5/6 uses `src/content.config.ts` as the canonical path (also supported: `src/content/config.ts`). Both work; `src/content.config.ts` is the documented default. [VERIFIED: docs.astro.build/en/guides/content-collections/]

### Pattern 1: Content Schema Definition

```typescript
// src/content.config.ts
// Source: docs.astro.build/en/guides/content-collections/
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    role: z.string(),
    accentColor: z.string(),
    thumbnail: image(),
    skills: z.array(z.string()),
    summary: z.string(),
    publishDate: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
```

**Key detail:** `image()` is provided as a parameter to the `schema` callback function — it is NOT imported separately. The schema must be `schema: ({ image }) => z.object({...})`, not `schema: z.object({...})`. [VERIFIED: docs.astro.build/en/guides/images/#images-in-content-collections]

### Pattern 2: Tailwind v4 Token System in global.css

```css
/* src/styles/global.css */
/* Source: tailwindcss.com/docs/theme */
@import "tailwindcss";

/* ─── Design Tokens ─── */
@theme {
  /* Typography */
  --font-sans: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Spacing scale (4px base) */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
  --spacing-4xl: 6rem;     /* 96px */

  /* Light mode colors (default) */
  --color-dominant: #FFFFFF;
  --color-secondary: #F5F5F4;
  --color-text-primary: #1C1C1C;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;
  --color-accent: #2563EB;
  --color-destructive: #DC2626;
}

/* Dark mode — system preference (base layer) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-dominant: #0F0F0F;
    --color-secondary: #1A1A1A;
    --color-text-primary: #F5F5F4;
    --color-text-secondary: #9CA3AF;
    --color-border: #2D2D2D;
    --color-accent: #3B82F6;
    --color-destructive: #EF4444;
  }
}

/* Dark mode — manual toggle override (Phase 2 toggle writes .dark to <html>) */
:root.dark {
  --color-dominant: #0F0F0F;
  --color-secondary: #1A1A1A;
  --color-text-primary: #F5F5F4;
  --color-text-secondary: #9CA3AF;
  --color-border: #2D2D2D;
  --color-accent: #3B82F6;
  --color-destructive: #EF4444;
}
```

**Why two dark mode blocks?** `@theme` tokens live in `:root` — they are CSS custom properties. Tailwind does not generate dark mode overrides from `@theme`. Overriding the values in `@media (prefers-color-scheme: dark)` handles system preference; the `.dark` class block handles manual toggle (built in Phase 2). Both are required per D-08. [VERIFIED: tailwindcss.com/docs/theme]

### Pattern 3: BaseLayout.astro Shell

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title?: string;
  description?: string;
}
const {
  title = "Tanya Zakus — UX/UI Designer",
  description = "",
} = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="font-sans text-[var(--color-text-primary)] bg-[var(--color-dominant)]">
    <header class="sticky top-0 z-50 h-16 bg-[color-mix(in_srgb,var(--color-dominant)_95%,transparent)] backdrop-blur-sm border-b border-[var(--color-border)]">
      <!-- nav slot — Phase 2 fills this in -->
      <div class="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 h-full flex items-center justify-between">
        <span class="font-semibold">Tanya Zakus</span>
        <nav><!-- Phase 2 --></nav>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="bg-[var(--color-secondary)] py-12">
      <div class="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        <p>Let's work together.</p>
        <a href="mailto:">Get in touch</a>
        <p>© 2026 Tanya Zakus</p>
      </div>
    </footer>
  </body>
</html>
```

**Note on padding values:** D-11 specifies 24px / 48px / 64px — these correspond to Tailwind utility classes `px-6` (24px) / `px-12` (48px) / `px-16` (64px) at default Tailwind spacing (1 unit = 4px). [ASSUMED — Tailwind default spacing scale; consistent with v4 docs]

### Pattern 4: Placeholder MDX File Structure

```mdx
---
title: "Project Alpha"
slug: "project-alpha"
role: "Lead UX Designer"
accentColor: "#2563EB"
thumbnail: "./thumbnail-alpha.png"
skills: ["UX Research", "Prototyping", "Figma"]
summary: "A placeholder project demonstrating the content schema. Replace with a real case study in Phase 3."
publishDate: 2024-01-15
featured: true
---

# Project Alpha

Placeholder content for schema validation. This file will be replaced with a real case study in Phase 3.
```

**Thumbnail images:** The `image()` validator requires an actual image file at the referenced path. Placeholder files need real placeholder image files (even 1×1 pixel PNGs) in `src/content/projects/` — or use a relative path pointing to a shared placeholder asset. [VERIFIED: docs.astro.build/en/guides/images/#images-in-content-collections]

### Anti-Patterns to Avoid

- **Using `@astrojs/tailwind`:** Deprecated. Will conflict with Tailwind v4. Use `@tailwindcss/vite` via `npx astro add tailwind`.
- **Putting dark mode in `@theme`:** `@theme` blocks emit into `:root` only. Do not use `@theme` for dark mode overrides — they belong in `@media` and `.dark` selectors in the regular CSS cascade.
- **Skipping `z.coerce.date()` for `publishDate`:** MDX frontmatter dates are parsed as strings by default. Use `z.coerce.date()` not `z.date()` to avoid schema validation failures.
- **Installing `@astrojs/cloudflare` adapter for static sites:** The adapter is only needed for SSR. Static output (`output: 'static'` is default) requires no adapter. Installing it unnecessarily complicates the build.
- **Omitting `output: 'static'` from astro.config.mjs:** Astro 6 defaults to static but explicitly setting it prevents confusion when integrations are added later.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimisation | Custom resize/convert scripts | Astro `<Image>` component + `sharp` peer dep | Handles WebP/AVIF conversion, responsive srcset, lazy loading — built in |
| Content schema validation | Custom frontmatter parser | `content.config.ts` with `z` from `astro/zod` | Type-safe, build-time errors, auto-generated TS types for all frontmatter |
| CSS dark mode system | Complex JS theme switcher | CSS custom properties + `@media` + `.dark` class | Zero JS needed for system preference; Phase 2 adds minimal toggle JS |
| Sitemap | Manually maintained XML file | `@astrojs/sitemap` | Regenerates on every build, zero config |
| Code formatting | Ad-hoc style decisions | Prettier + `prettier-plugin-astro` | Consistent across `.astro`, `.ts`, `.mdx`, `.css` |

**Key insight:** Astro's built-in primitives (Content Collections, Image component, file-system routing) eliminate entire categories of custom code that would otherwise be needed.

---

## Common Pitfalls

### Pitfall 1: Tailwind v4 Integration Confusion

**What goes wrong:** Developer installs `@astrojs/tailwind` (the v3 integration), which is incompatible with Tailwind v4 and will produce no styles or cryptic errors.
**Why it happens:** The old integration still appears in search results and Astro docs redirect to a deprecation notice.
**How to avoid:** Always use `npx astro add tailwind` — the CLI resolves the correct v4 package (`@tailwindcss/vite`). Never `npm install @astrojs/tailwind` directly.
**Warning signs:** Build succeeds but no utility classes are applied; or `postcss` errors in the terminal.

### Pitfall 2: `image()` Helper Not Used as Schema Callback

**What goes wrong:** Schema written as `schema: z.object({ thumbnail: image() })` where `image` is undefined — runtime error on `astro build`.
**Why it happens:** `image()` is a schema helper injected by Astro's content layer, not a standalone import.
**How to avoid:** Use the callback form: `schema: ({ image }) => z.object({ thumbnail: image() })`.
**Warning signs:** TypeScript error "Cannot find name 'image'" or build error about unknown schema type.

### Pitfall 3: Dark Mode Variables Not Overriding

**What goes wrong:** Dark mode colors declared in `@theme` don't change when `.dark` is applied — light mode colors persist.
**Why it happens:** `@theme` only writes to `:root`. Tailwind does not generate dark mode overrides from it automatically.
**How to avoid:** Declare the full color palette a second time inside `:root.dark { }` and `@media (prefers-color-scheme: dark) { :root { } }`. See Pattern 2 above.
**Warning signs:** Adding `dark` class to `<html>` has no effect on background or text colors.

### Pitfall 4: Missing Placeholder Thumbnail Images

**What goes wrong:** `astro build` fails with "image not found" error even though MDX frontmatter is syntactically correct.
**Why it happens:** The `image()` validator resolves the path relative to the MDX file and requires the file to exist at build time.
**How to avoid:** Add placeholder PNG/WebP files to `src/content/projects/` alongside the MDX files. A 1×1 pixel PNG is sufficient for Phase 1.
**Warning signs:** Build error mentioning a missing asset path.

### Pitfall 5: `publishDate` Schema Type Mismatch

**What goes wrong:** Frontmatter date like `2024-01-15` fails `z.date()` validation — dates parsed from YAML are strings, not Date objects.
**Why it happens:** YAML/MDX frontmatter parsers return dates as strings.
**How to avoid:** Use `z.coerce.date()` which accepts both Date objects and parseable date strings.
**Warning signs:** Build error "Expected date, received string" on the `publishDate` field.

### Pitfall 6: Cloudflare Pages Build Fails Due to Node Version

**What goes wrong:** Cloudflare Pages build fails with a Node.js version incompatibility error.
**Why it happens:** Cloudflare Pages defaults to an older Node version that may not satisfy Astro 6's requirements.
**How to avoid:** Set `NODE_VERSION = 20` (or `22`) as an environment variable in the Cloudflare Pages project settings. [ASSUMED — common Cloudflare Pages deployment pattern; not verified against current Cloudflare docs this session]
**Warning signs:** Build log shows Node version warning or `engines` field mismatch.

---

## Code Examples

### Querying the Content Collection

```typescript
// Source: docs.astro.build/en/guides/content-collections/
import { getCollection } from 'astro:content';

// In any .astro page component:
const projects = await getCollection('projects');
const sortedProjects = projects.sort(
  (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
);
```

### Global CSS Import in BaseLayout

```astro
---
// src/layouts/BaseLayout.astro
import "../styles/global.css";
---
```

### astro.config.mjs for Static + Cloudflare Pages

```javascript
// astro.config.mjs
// Source: docs.astro.build/en/guides/deploy/cloudflare/
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://your-site.pages.dev', // update after Cloudflare project is created
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Note:** Tailwind v4 is added as a Vite plugin, not an Astro integration. Sitemap requires the `site` URL to generate valid XML. [VERIFIED: docs.astro.build/en/guides/styling/#tailwind + tailwindcss.com/docs/theme]

### .prettierrc for Astro

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

[VERIFIED: CLAUDE.md — version compatibility section]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin | Tailwind v4 release (2024-2025) | No `tailwind.config.js`, no PostCSS config, `@theme` in CSS only |
| `src/content/config.ts` | `src/content.config.ts` | Astro 5 Content Layer API | New file location; old path still supported but new is canonical |
| `defineCollection` with `z` from `zod` | `z` from `astro/zod` | Astro 5 | Import path changed to `astro/zod` or `astro:content` |
| `reference()` / `image()` as top-level imports | `image()` injected via schema callback | Astro 5 Content Layer | Schema must be a function: `schema: ({ image }) => z.object({...})` |

**Deprecated:**
- `@astrojs/tailwind`: Do not use. Deprecated as of Tailwind v4. [VERIFIED: docs.astro.build/en/guides/integrations-guide/tailwind/]
- `tailwind.config.js`: Not applicable in v4. All config in CSS via `@theme`. [VERIFIED: tailwindcss.com/docs/theme]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Tailwind custom spacing token names use `--spacing-xs`, `--spacing-sm` etc. as namespace prefix | Architecture Patterns / Pattern 2 | If Tailwind v4 reserves `--spacing-*` for a built-in scale, custom names may conflict — use `--space-xs` etc. instead; low risk, easy to rename |
| A2 | `px-6` / `px-12` / `px-16` map to 24px / 48px / 64px in Tailwind v4 default spacing | Architecture Patterns / Pattern 3 | Tailwind v4 default spacing unit is 0.25rem (4px); this mapping is standard but if modified by `@theme { --spacing: }` it would shift — don't override the base spacing unit |
| A3 | Setting `NODE_VERSION = 20` environment variable in Cloudflare Pages dashboard resolves Node version issues | Common Pitfalls / Pitfall 6 | If Cloudflare Pages already defaults to Node 20+, no action needed; if Astro 6 requires Node 22, version 20 may still fail |
| A4 | `src/content.config.ts` and `src/content/config.ts` are both valid paths for Astro 6 | Architecture Patterns | If only one path is supported, using the wrong one causes silent schema failure |

---

## Open Questions

1. **Cloudflare Pages Node version default**
   - What we know: Cloudflare Pages sometimes defaults to older Node versions; Astro 6 requires Node 18+.
   - What's unclear: Whether the current Cloudflare Pages default (as of April 2026) already uses Node 20 or 22 without a manual setting.
   - Recommendation: Set `NODE_VERSION = 20` in Cloudflare Pages environment variables as a precaution during the deploy task.

2. **Google Fonts loading strategy**
   - What we know: DM Sans is available on Google Fonts for free; standard implementation is a `<link>` in `<head>`.
   - What's unclear: Whether self-hosting DM Sans via `fontsource` is preferable for performance (avoids Google Fonts DNS lookup).
   - Recommendation: Use Google Fonts `<link>` for Phase 1 (simplest, no npm install); consider `@fontsource/dm-sans` in a polish pass if Lighthouse flags it.

3. **Cloudflare Pages `site` URL before project creation**
   - What we know: `@astrojs/sitemap` requires `site` in `astro.config.mjs` to generate valid URLs.
   - What's unclear: The Cloudflare Pages subdomain URL is only known after the project is created in the dashboard.
   - Recommendation: Use a placeholder (`https://placeholder.pages.dev`) initially; update `site` in `astro.config.mjs` as part of the deploy task once the URL is known.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro dev server, build | Yes | v24.14.1 | — |
| npm | Package management | Yes | 11.11.0 | — |
| npx | Astro scaffold / `astro add` | Yes | 11.11.0 | — |
| git | Version control, Cloudflare Pages trigger | Yes | 2.50.1 | — |
| Wrangler CLI | Cloudflare Pages deploy | No | — | Use Cloudflare dashboard (GitHub integration) — fully sufficient |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:**
- Wrangler CLI: Not installed. Not required — Cloudflare Pages GitHub integration via dashboard handles deploy without it. [VERIFIED: developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/]

---

## Validation Architecture

### Test Framework

This is a greenfield static site project. Astro does not ship with a test framework. For Phase 1 (scaffold + config + layout shell), the appropriate validation is:

- **Build validation:** `astro build` passes without errors — this IS the primary automated test for FOUND-01, FOUND-02, FOUND-03.
- **Type validation:** `astro check` catches TypeScript and prop errors in `.astro` files.
- **Dev server:** `npm run dev` starts without errors.

No unit test framework (Vitest, Jest) is warranted for Phase 1 — the deliverables are configuration files and layout shells, not logic-bearing modules. The nyquist validation gate for this phase is build-clean + typecheck-clean.

| Property | Value |
|----------|-------|
| Framework | None (build + typecheck as validation) |
| Config file | None — Wave 0 adds npm scripts only |
| Quick run command | `npm run build && npx astro check` |
| Full suite command | `npm run build && npx astro check` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | Scaffold builds without errors; dev server starts | smoke | `npm run dev` (manual verify) + `npm run build` | Wave 0 — add `"build"` script to package.json |
| FOUND-02 | Schema validates 2 placeholder MDX files at build time | build | `npm run build` — schema errors surface as build failures | Wave 0 — `src/content.config.ts` + placeholder `.mdx` files |
| FOUND-03 | BaseLayout wraps index.astro; header and footer present in HTML output | build | `npm run build` — check `dist/index.html` contains `<header>`, `<main>`, `<footer>` | Wave 0 — `src/layouts/BaseLayout.astro` |
| FOUND-04 | Pushing to main triggers Cloudflare Pages build that succeeds | manual | Verify Cloudflare Pages dashboard shows "Success" status after push | Manual — requires Cloudflare project to exist |

### Sampling Rate

- **Per task commit:** `npm run build` (30 seconds or less on clean scaffold)
- **Per wave merge:** `npm run build && npx astro check`
- **Phase gate:** Both commands green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `package.json` scripts: `"dev"`, `"build"`, `"typecheck": "astro check"`, `"format": "prettier --write ."` — created by scaffold, may need `typecheck` added
- [ ] `src/content.config.ts` — created in Phase 1 tasks
- [ ] `src/content/projects/project-alpha.mdx` + `project-beta.mdx` — placeholder content files
- [ ] `src/content/projects/thumbnail-alpha.png` + `thumbnail-beta.png` — required by `image()` validator
- [ ] `src/styles/global.css` — Tailwind import + `@theme` tokens
- [ ] `src/layouts/BaseLayout.astro` — layout shell

*(No pre-existing test infrastructure — all infrastructure created in Wave 0 of Phase 1)*

---

## Security Domain

This phase establishes a fully static HTML/CSS site with no user input, no authentication, no server-side code, and no API calls. Standard ASVS categories do not apply to Phase 1 deliverables.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in this phase |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | Public static site |
| V5 Input Validation | No | No user input in Phase 1 |
| V6 Cryptography | No | No secrets or encryption |

**Relevant security hygiene for Phase 1:**
- `<html lang="en">` declared (accessibility baseline) — locked in D-15.
- No API keys, secrets, or credentials in codebase.
- Google Fonts loaded over HTTPS from `fonts.googleapis.com` — no integrity hash required for external hosted fonts (standard practice). [ASSUMED]

---

## Sources

### Primary (HIGH confidence)

- `docs.astro.build/en/guides/content-collections/` — `defineCollection`, `glob` loader, `z` from `astro/zod`, `getCollection()` API — verified 2026-04-12
- `docs.astro.build/en/guides/images/#images-in-content-collections` — `image()` callback syntax in schema — verified 2026-04-12
- `docs.astro.build/en/guides/integrations-guide/tailwind/` — `@astrojs/tailwind` deprecated, use `@tailwindcss/vite` — verified 2026-04-12
- `docs.astro.build/en/guides/styling/#tailwind` — `npx astro add tailwind` installs Vite plugin, CSS import location — verified 2026-04-12
- `tailwindcss.com/docs/theme` — `@theme` block syntax, dark mode via `@media` + `.dark`, CSS custom property namespaces — verified 2026-04-12
- `developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/` — build command `npm run build`, output dir `dist`, no adapter for static — verified 2026-04-12
- npm registry — `astro@6.1.5`, `tailwindcss@4.2.2`, `@tailwindcss/vite@4.2.2`, `@astrojs/mdx@5.0.3`, `@astrojs/sitemap@3.7.2`, `@astrojs/check@0.9.8`, `prettier@3.8.2`, `prettier-plugin-astro@0.14.1`, `sharp@0.34.5` — all versions confirmed 2026-04-12

### Secondary (MEDIUM confidence)

- `CLAUDE.md` project instructions — version compatibility table, `prettier-plugin-astro` `.prettierrc` config — from project documentation

### Tertiary (LOW confidence)

- Node version requirement for Cloudflare Pages (Pitfall 6) — general knowledge, not verified against current Cloudflare Pages documentation this session

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all package versions verified against npm registry 2026-04-12
- Architecture: HIGH — content schema and Tailwind token APIs verified from official docs
- Cloudflare Pages deploy: HIGH — build settings and dashboard flow verified from official docs
- Dark mode architecture: HIGH — `@theme` scoping and override pattern verified from Tailwind v4 docs
- Pitfalls: HIGH (5 of 6) / LOW (Pitfall 6 Node version) — most verified from official docs

**Research date:** 2026-04-12
**Valid until:** 2026-05-12 (stable ecosystem; Tailwind v4 and Astro 6 are active branches)
