import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Chart ids Cover.astro knows how to render. Keep in sync with that component. */
export const COVER_CHARTS = ['f1-results', 'pitwall-degradation'] as const;

const PLACEHOLDER = /\[[^\]]*\]|\bTBD\b|\bTODO\b|placeholder/i;

const words = (max: number) => (s: string) => s.trim().split(/\s+/).length <= max;

const realText = z
  .string()
  .min(1)
  .refine((s) => !PLACEHOLDER.test(s), 'Placeholder text is not allowed');

const projects = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    headline: realText,
    /** The domain the project works in, shown on its card. */
    domain: z.string(),
    slug: z.string(),
    order: z.number().int(),
    featured: z.boolean(),
    year: z.number().int(),
    role: z.string(),
    summary: realText.refine(words(25), 'Summary must be 25 words or fewer'),
    problem: realText,
    mechanisms: z
      .array(z.object({ label: realText, detail: realText }))
      .length(3, 'Exactly three mechanisms'),
    result: realText,
    metric: z.object({ value: z.string(), label: z.string() }).optional(),
    stack: z.array(z.string()).max(6),
    links: z.object({
      repo: z.url().optional(),
      demo: z.url().optional(),
      paper: z.url().optional(),
      writeup: z.url().optional(),
    }),
    cover: z
      .object({
        /** image/video: a path under public/; chart: one of COVER_CHARTS (rendered by Cover.astro). */
        src: z.string(),
        alt: realText,
        kind: z.enum(['image', 'video', 'chart']),
        poster: z.string().optional(),
      })
      .refine((c) => c.kind !== 'chart' || (COVER_CHARTS as readonly string[]).includes(c.src), {
        message: `Chart covers must be one of: ${COVER_CHARTS.join(', ')}`,
      }),
    status: z.enum(['active', 'complete']).optional(),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: 'site.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    description: realText.refine((d) => d.length <= 155, 'Meta description must be 155 characters or fewer'),
    headline: realText.refine(words(12), 'Headline must be 12 words or fewer'),
    subline: realText,
    intro: z.array(realText).min(1),
    availability: realText,
    focus: z.array(z.string()).min(3).max(6),
    email: z.email(),
    github: z.url(),
    linkedin: z.url(),
    resume: z.string(),
    toolkit: z.array(z.object({ group: z.string(), items: z.array(z.string()).min(1) })),
    education: z.array(
      z.object({ degree: z.string(), school: z.string(), dates: z.string(), detail: z.string() }),
    ),
    cta: z.object({ heading: realText }),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: 'experience.md', base: './src/content' }),
  schema: z.object({
    roles: z.array(
      z.object({
        company: z.string(),
        title: z.string(),
        location: z.string(),
        start: z.string().regex(/^\d{4}-\d{2}$/),
        end: z.string().regex(/^\d{4}-\d{2}$/),
        points: z.array(realText).min(1).max(3),
      }),
    ),
  }),
});

const publication = defineCollection({
  loader: glob({ pattern: 'publication.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    role: z.string(),
    venue: z.string(),
    volume: z.string(),
    pages: z.string(),
    year: z.number().int(),
    doi: z.string(),
    url: z.url(),
  }),
});

const alsoBuilt = defineCollection({
  loader: glob({ pattern: 'also-built.md', base: './src/content' }),
  schema: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        line: realText,
        repo: z.url(),
        demo: z.url().optional(),
      }),
    ),
  }),
});

export const collections = { projects, site, experience, publication, alsoBuilt };
