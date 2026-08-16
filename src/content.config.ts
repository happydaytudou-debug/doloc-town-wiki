import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const source = z.object({
  id: z.string().regex(/^[A-Z][A-Z0-9-]*$/),
  name: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  type: z.string().min(1),
  intendedUse: z.string().min(1),
  checked: z.coerce.date(),
  verificationStatus: z.enum(['Verified', 'Discovery Only']),
  claimNote: z.string().optional(),
});
const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    id: z.string(), title: z.string(), description: z.string(), slug: z.string(), category: z.enum(['guides', 'farming', 'characters-items', 'map-quests']),
    keywords: z.array(z.string()).min(1), searchIntent: z.string().min(1), summary: z.string().min(1), updated: z.coerce.date(), verificationStatus: z.literal('Needs Verification'),
    priority: z.number().int().min(1).max(16), featured: z.boolean(), relatedGuides: z.array(z.string()), sources: z.array(source).min(1),
  }),
});
export const collections = { guides };
