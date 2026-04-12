import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
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
