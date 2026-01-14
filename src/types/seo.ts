export interface SEOProps {
	/** Page title - will be suffixed with site name */
	title: string;

	/** Override formatted title (skips site name suffix) */
	seoTitle?: string;

	/** Meta description */
	description?: string;

	/** Canonical URL - auto-generated from Astro.url if not provided */
	canonical?: string;

	/** OG image path - relative to site root */
	ogImage?: string;

	/** OG type - defaults to 'website' */
	ogType?: 'website' | 'article';

	/** Keywords for meta keywords tag */
	keywords?: string[];

	/** Article metadata for blog posts */
	article?: {
		publishedTime: string; // ISO 8601 format
		modifiedTime?: string; // ISO 8601 format
		author?: string;
		tags?: string[];
	};

	/** Disable indexing for this page */
	noindex?: boolean;
}
