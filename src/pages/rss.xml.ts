import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { siteConfig } from '@config/site';

export async function GET(context: APIContext) {
	const posts = (
		await getCollection('blog', ({ data }) => !data.draft)
	).sort(
		(a, b) =>
			b.data.publishing_date.getTime() - a.data.publishing_date.getTime()
	);

	return rss({
		title: `${siteConfig.name} Blog`,
		description: siteConfig.description,
		site: context.site!,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishing_date,
			link: post.data.permalink.replace(/\/$/, ''),
			author: post.data.author,
		})),
		customData: '<language>en-us</language>',
	});
}
