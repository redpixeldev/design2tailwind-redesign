#!/usr/bin/env node
/**
 * Blog Post Migration Script
 *
 * Migrates blog posts from old-site/src/posts/ to Astro content collections.
 * - Copies and renames markdown files (strips date prefix)
 * - Copies images to public/blog/images/ for static serving
 * - Keeps original /blog/images/ paths in markdown
 */

import { readdir, readFile, writeFile, copyFile, mkdir } from 'fs/promises';
import { join } from 'path';

const OLD_POSTS = './old-site/src/posts';
const OLD_IMAGES = './old-site/src/posts/images';
const NEW_POSTS = './src/content/blog';
const PUBLIC_IMAGES = './public/blog/images';

async function migrate() {
	console.log('Starting blog post migration...\n');

	// 1. Create public images directory and copy images
	console.log('Copying images to public folder...');
	await mkdir(PUBLIC_IMAGES, { recursive: true });
	const images = await readdir(OLD_IMAGES);
	let imageCount = 0;

	for (const img of images) {
		if (img.endsWith('.webp') || img.endsWith('.png') || img.endsWith('.jpg') || img.endsWith('.jpeg') || img.endsWith('.gif')) {
			await copyFile(join(OLD_IMAGES, img), join(PUBLIC_IMAGES, img));
			imageCount++;
		}
	}
	console.log(`  Copied ${imageCount} images\n`);

	// 2. Process markdown files (keep original /blog/images/ paths)
	console.log('Processing markdown files...');
	const files = await readdir(OLD_POSTS);
	const posts = files.filter((f) => f.endsWith('.md'));
	let postCount = 0;

	for (const post of posts) {
		let content = await readFile(join(OLD_POSTS, post), 'utf-8');

		// Keep original image paths - they'll be served from public/blog/images/

		// Generate slug by stripping date prefix
		// e.g., "2022-02-11-tailwindcss-tables.md" -> "tailwindcss-tables.md"
		const slug = post.replace(/^\d{4}-\d{2}-\d{2}-/, '');

		await writeFile(join(NEW_POSTS, slug), content);
		console.log(`  ${post} -> ${slug}`);
		postCount++;
	}

	console.log(`\nMigration complete!`);
	console.log(`  Posts: ${postCount}`);
	console.log(`  Images: ${imageCount}`);
}

migrate().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
