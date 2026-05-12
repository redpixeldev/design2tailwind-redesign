import { siteConfig } from '@config/site';

interface BuildServiceSchemaOptions {
	/** Service name shown in rich results, e.g. "Figma to Tailwind CSS Conversion". */
	name: string;
	/** One-line description of what the service does. */
	description: string;
	/** Page path the service lives at, e.g. "/figma-to-tailwind". */
	path: string;
	/** Optional service type override; defaults to "Web Development". */
	serviceType?: string;
}

export function buildServiceSchema({
	name,
	description,
	path,
	serviceType = 'Web Development',
}: BuildServiceSchemaOptions): Record<string, unknown> {
	const url = `${siteConfig.url}${path}`;
	return {
		'@type': 'Service',
		'@id': `${url}#service`,
		name,
		description,
		serviceType,
		areaServed: { '@type': 'Place', name: 'Worldwide' },
		provider: { '@id': `${siteConfig.url}/#organization` },
		url,
	};
}
