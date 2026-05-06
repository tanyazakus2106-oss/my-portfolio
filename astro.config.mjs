// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://my-portfolio-8h7.pages.dev',
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: /** @type {any} */ ([tailwindcss()]),
  },
});
