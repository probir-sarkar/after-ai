import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Two collections read one folder per job:
 *
 *   src/content/jobs/<slug>/job.json     structured, schema-validated data
 *   src/content/jobs/<slug>/notes.mdx    the prose, with <Cite ids="..." /> inline
 *
 * The slug is the folder name, so the two collections join on it. `pages/jobs/[slug]`
 * throws if a folder has data but no note (or vice versa) — a missing note is a
 * build failure, not a page with an empty section.
 */

const metric = z.object({
  label: z.string(),
  display: z.string(),
  value: z.number(),
  unit: z.enum(['percent', 'jobs', 'usd', 'day', 'count', 'index', 'premium']),
  source: z.string(),
});

const series = z.object({
  label: z.string(),
  value: z.number(),
  kind: z.enum(['growth', 'absolute', 'share', 'premium']),
  source: z.string(),
});

export const tests = z.object({
  body: z.number().min(0).max(3),
  accountability: z.number().min(0).max(3),
  relationship: z.number().min(0).max(3),
  bundle: z.number().min(0).max(3),
});

export const collections = {
  jobs: defineCollection({
    loader: glob({
      pattern: 'jobs/*/job.json',
      base: './src/content',
      generateId: ({ entry }) => entry.split('/')[1]!,
    }),
    schema: z.object({
      name: z.string(),
      short: z.string(),
      verdict: z.enum(['survives', 'at-risk', 'emerging', 'mixed', 'possible']),
      category: z.enum(['care', 'trades', 'judgement', 'frontline', 'cognitive', 'platform']),
      oneLiner: z.string(),
      /** Editorial reading of the task profile — labelled as such in the UI. */
      tests,
      why: z.array(z.string()).default([]),
      threats: z.array(z.string()).default([]),
      metrics: z.array(metric).default([]),
      /** Verified claims about the role, each carrying its source id. */
      claims: z.array(z.object({ text: z.string(), source: z.string() })).default([]),
      series: z.array(series).default([]),
      horizon: z.string().optional(),
      wage: z.string().optional(),
      order: z.number().default(99),
      featured: z.boolean().default(false),
    }),
  }),

  jobNotes: defineCollection({
    loader: glob({
      pattern: 'jobs/*/notes.{md,mdx}',
      base: './src/content',
      generateId: ({ entry }) => entry.split('/')[1]!,
    }),
    schema: z.object({}),
  }),

  /** Theme-page copy, so the narrative is editable markdown too. */
  sections: defineCollection({
    loader: glob({ pattern: 'sections/*.{md,mdx}', base: './src/content' }),
    schema: z.object({
      key: z.enum(['survives', 'risk', 'opportunity', 'what-to-do', 'possibilities']),
      title: z.string(),
      eyebrow: z.string(),
      standfirst: z.string(),
      /** Longer, search-facing summary; falls back to the standfirst. */
      description: z.string().optional(),
      order: z.number().default(99),
    }),
  }),
};