import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// Transform "null" strings to actual null
const nullableUrl = z
	.string()
	.transform((val) => (val === 'null' || val === '' ? null : val))
	.nullable()
	.optional();

// Transform "false"/"true" strings to booleans
const stringBoolean = z
	.string()
	.transform((val) => val.toLowerCase() !== 'false')
	.default('false');

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		// Core fields
		title: z.string(),
		description: z.string(),
		author: z.string().default('Vivian'),

		// Date - transform ISO string to Date object
		publishing_date: z.string().transform((str) => new Date(str)),

		// Status
		draft: stringBoolean,

		// SEO
		keyword: z.string().optional(),
		category: z.string().default('Tutorial'),

		// URL fields
		permalink: z.string(),
		url: z.string().optional(),

		// Syndication links (nullable - some are "null" strings in old frontmatter)
		reddit: nullableUrl,
		'dev.to': nullableUrl,
		hashnode: nullableUrl,
		medium: nullableUrl,

		// Site identifier (legacy)
		site: z.string().optional(),
	}),
});

export const collections = { blog };
