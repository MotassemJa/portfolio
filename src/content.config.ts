import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const localized = z.object({ en: z.string(), de: z.string(), ar: z.string() });

const projects = defineCollection({
  loader: file('src/content/projects.json'),
  schema: z.object({
    id: z.enum(['ds', 'fb', 'ci', 'ws', 'ac']),
    order: z.number(),
    year: z.string(),
    status: localized,
    title: localized,
    meta: localized,
    desc: localized,
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience.json'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    kind: z.enum(['work', 'internship', 'education']),
    current: z.boolean().default(false),
    company: localized,
    role: localized,
    period: localized,
    points: z.object({
      en: z.array(z.string()),
      de: z.array(z.string()),
      ar: z.array(z.string()),
    }),
    // CONTENT.md translates these per locale ("Unit testing" / "Unit-Tests" / "اختبارات"),
    // so this widens the starter's plain z.string() rather than dropping the DE/AR copy.
    tags: localized,
  }),
});

const certificates = defineCollection({
  loader: file('src/content/certificates.json'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    name: z.string(),          // never translated
    issuer: z.string(),        // never translated
    field: z.enum(['ai', 'db', 'other']),
    pinned: z.boolean().default(false),
    date: localized,
    url: z.string().url(),
  }),
});

export const collections = { projects, experience, certificates };
