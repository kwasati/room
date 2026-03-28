import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const coursesCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string().optional(),
    courseType: z.enum(['learn', 'learn-tool']),
    toolName: z.string().optional(),
    toolDownload: z.string().optional(),
    tags: z.array(z.string()).default([]),
    order: z.number(),
    publishedAt: z.coerce.date(),
  })
});

const lessonsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    course: z.string(),
    order: z.number(),
    videoId: z.string().optional(),
    duration: z.string().optional(),
  })
});

export const collections = {
  courses: coursesCollection,
  lessons: lessonsCollection,
};
