import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.enum(['planowanie', 'pakowanie', 'koszty', 'transport', 'formalnosci', 'nietypowe']),
    type: z.enum(['poradnik', 'porownanie', 'realizacja']),
    audience: z.enum(['dom', 'firma', 'oba']),
    stage: z.enum(['przed', 'w-trakcie', 'po', 'ogolne']),
    author: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
