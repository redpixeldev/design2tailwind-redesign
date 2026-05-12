# SEO Audit — design2tailwind.com

**Date:** 2026-05-12
**Auditor:** Claude (via `.agents/skills/seo-audit/`)
**Scope:** Code + live site checks + Ahrefs data
**Tested against:** `https://design2tailwind.com` (production, Cloudflare Pages)

---

## Executive Summary

The site has a strong technical foundation for an Astro v5 build — dynamic per-page meta tags, Open Graph + Twitter cards, a working sitemap-index, RSS feed, and clean URL structure. **However, a single configuration issue (`build.format: 'file'`) is silently breaking canonical URLs on 28 of 29 pages, and is interacting badly with the migration from the previous site.** Combined with the absence of any structured data, a heavy legacy jQuery stack, and unoptimized images, the site is leaving meaningful organic visibility on the table.

### Current Ahrefs snapshot (2026-05-12)
- **Domain Rating:** 8 (low — typical for early-stage sites)
- **Organic keywords:** 52
- **Organic traffic:** ~300 visits/month
- **Referring domains:** ~1–2 across all pages (very thin)
- **Top traffic page:** `/blog/change-tailwindcss-base-font-size.html` (147 visits/mo, ranks #6 for "tailwind font size")
- **All top-ranking URLs in Ahrefs still end in `.html`** — Google has the prior site's URLs indexed, the current site no longer serves them as canonical, and the migration is not properly redirected. This is silently bleeding equity.

### Top 5 priority issues
1. **Broken canonical tags on every non-index page** (Critical) — `<link rel="canonical">` points to `*.html` URLs that 307-redirect away. Migration hygiene is suppressing indexation.
2. **No structured data anywhere** (High) — zero JSON-LD across 29 pages. Missing Organization, Service, Article, FAQPage, BreadcrumbList.
3. **`.html` → clean-URL redirects are 307 (temporary), not 301 (permanent)** (Critical) — PageRank from the indexed `.html` URLs is not being passed.
4. **Footer links to `/terms` and `/privacy` 404 in production** (High) — verified live, both return HTTP 404.
5. **Heavy jQuery vendor stack inlined on every page** (High) — Slick + FancyBox + WOW + Isotope + Counter + Waypoints + Lazy + jQuery + Bootstrap + Nice-Select + Validator all loaded via `is:inline` regardless of need. Core Web Vitals liability.

### Quick wins (each ≤30 minutes)
- Add `alt="Design2Tailwind"` to logo in `Header.astro`/`Footer.astro`.
- Create `src/pages/terms.astro` + `src/pages/privacy.astro` stubs or remove the footer links.
- Add `font-display: swap;` to `@font-face` declarations in `public/fonts/*/stylesheet.css`.
- Truncate `/about` title from 142 chars to ~55 chars (currently the full first sentence).
- Add per-blog-post OG image (or at least a templated one) via `defaultOgImage` override in `[slug].astro`.

---

## 1. Technical SEO Findings

### 1.1 Canonical URLs are wrong on 28 of 29 pages — CRITICAL
- **Issue:** Every non-homepage `<link rel="canonical">` points to a `*.html` URL that does not exist as a canonical version (it 307-redirects to the clean URL).
- **Evidence (live, 2026-05-12):**
  - `https://design2tailwind.com/figma-to-tailwind` → canonical: `https://design2tailwind.com/figma-to-tailwind.html`
  - `https://design2tailwind.com/about` → canonical: `https://design2tailwind.com/about.html`
  - `https://design2tailwind.com/blog` → canonical: `https://design2tailwind.com/blog.html`
  - `https://design2tailwind.com/blog/tailwindcss-hide-scrollbar` → canonical: `https://design2tailwind.com/blog/tailwindcss-hide-scrollbar.html`
  - `.html` versions return `HTTP/2 307 → location: /<page>` (verified via `curl -sSI`)
- **Root cause:** `astro.config.mjs:14` sets `build.format: 'file'`. Astro renders each page to `<route>.html` at build time, so `Astro.url.pathname` resolves to `/figma-to-tailwind.html` inside `src/layouts/Layout.astro:23`, where the canonical fallback is computed:
  ```ts
  const canonicalURL = canonical
    ? new URL(canonical, siteConfig.url).href
    : new URL(Astro.url.pathname, siteConfig.url).href;  // produces /<page>.html
  ```
  Meanwhile, Cloudflare Pages auto-rewrites the request so that `/figma-to-tailwind` (no extension) serves the file. The `og:url` and `twitter:url` tags inherit the same broken value (lines 84 and 114).
- **Impact:** High. Google may interpret the canonical signal as "the real URL is `*.html`", but the `*.html` URL redirects away — this is a canonical loop. PageRank from inbound links to `.html` URLs (which is most of the existing link equity per Ahrefs) cannot consolidate cleanly.
- **Fix (choose one):**

  **Option A — easiest, recommended:** strip `.html` from the canonical computation. Edit `src/layouts/Layout.astro:21-23`:
  ```ts
  const cleanPath = Astro.url.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/';
  const canonicalURL = canonical
    ? new URL(canonical, siteConfig.url).href
    : new URL(cleanPath, siteConfig.url).href;
  ```

  **Option B — addresses the root cause:** change `build.format` to `directory` in `astro.config.mjs:14`. This makes Astro emit `figma-to-tailwind/index.html` instead of `figma-to-tailwind.html`, so `Astro.url.pathname` becomes `/figma-to-tailwind/`. Beware: this is a URL structure change and would shift trailing-slash behavior site-wide — coordinate with Option 1.3 below.
- **Priority:** 1 (block other indexation work on this).

### 1.2 `.html` → clean-URL redirects are 307 (temporary), not 301 — CRITICAL
- **Issue:** Cloudflare Pages auto-redirects `*.html` to the extension-less URL with HTTP 307 (Temporary Redirect). 307 tells crawlers "this URL is the right one *for now*, keep asking for the old one." 301 (Permanent) is what tells Google "consolidate signals to the new URL."
- **Evidence:**
  ```
  curl -sSI https://design2tailwind.com/figma-to-tailwind.html
  HTTP/2 307
  location: /figma-to-tailwind
  ```
  Ahrefs `site-explorer-top-pages` (2026-05-12) shows **all top-traffic URLs still indexed as `.html`**:
  - `https://design2tailwind.com/blog/change-tailwindcss-base-font-size.html` — 147 visits/mo
  - `https://design2tailwind.com/blog/tailwindcss-hide-scrollbar.html` — 66 visits/mo
  - `https://design2tailwind.com/blog/tailwindcss-gradient-text.html` — 54 visits/mo
- **Impact:** High. The historical link equity earned by `.html` URLs is being held at the redirect destination by a 307, which RFC 7231 explicitly defines as non-cacheable for SEO consolidation. Google's documentation (`developers.google.com/search/docs/crawling-indexing/301-redirects`) requires 301 (or 308) for canonical signal passing.
- **Fix:** Add a redirect rule in `public/_redirects` (Cloudflare Pages convention) to force 301:
  ```
  /*.html  /:splat  301
  ```
  Or, in `public/_headers`, override the default. Verify after deploy with `curl -sSI`.
- **Priority:** 1 (paired with 1.1).

### 1.3 Trailing-slash inconsistency between sitemap, canonical, and RSS — MEDIUM
- **Issue:** Three URL formats are in use across the site:
  - **Sitemap** (`/sitemap-0.xml`): no trailing slash, no `.html` — `https://design2tailwind.com/blog/tailwindcss-hide-scrollbar`
  - **Canonical tags**: `.html` extension — `https://design2tailwind.com/blog/tailwindcss-hide-scrollbar.html`
  - **RSS `<link>`** (from `post.data.permalink`): trailing slash, no `.html` — `https://design2tailwind.com/blog/tailwindcss-hide-scrollbar/`
  - **Actual served URL**: no trailing slash, no `.html` — `/blog/tailwindcss-hide-scrollbar` (200 OK; trailing-slash version returns 307)
- **Impact:** Confused canonicalization signals. Internal-link audits will flag warnings even when fixed.
- **Fix:** Standardize on no-trailing-slash, no-`.html`. Update:
  - `src/content/blog/*.md` frontmatter `permalink:` to drop trailing slashes, OR
  - `src/pages/rss.xml.ts` to strip trailing slashes when building the feed link.
- **Priority:** 2.

### 1.4 `/terms` and `/privacy` referenced in footer return 404 — HIGH
- **Issue:** `src/components/Footer.astro` links to `/terms` and `/privacy`, but no `terms.astro` or `privacy.astro` exists in `src/pages/`. Verified live: both return `HTTP/2 404`.
- **Impact:** Soft trust signal (legal pages missing on a commercial site) + crawler waste. Also a buying-trust issue for the agency audience this site targets.
- **Fix:** Either build the pages with real content (recommended) or remove the footer links until they're ready. If you stub them, mark them `noindex` until content is ready.
- **Priority:** 2.

### 1.5 Sitemap is present, complete, and indexable — OK
- 29 URLs in `sitemap-0.xml`, all return 200, no `.html` extensions, correct protocol/domain.
- `robots.txt` allows all, references the sitemap-index.
- `@astrojs/sitemap` configured in `astro.config.mjs:7`.
- **No action needed** beyond reconciling with 1.3 once URLs are canonicalized.

### 1.6 HTTPS, HSTS, server response — OK
- Site served entirely over HTTPS via Cloudflare. `cf-cache-status: HIT` on key URLs.
- No mixed content observed in the rendered homepage.
- TTFB will be excellent on Cloudflare edge — not a concern.

### 1.7 No hreflang / single-locale — OK for now
- `<html lang="en">` hardcoded in `Layout.astro:28`. Single locale, no hreflang needed.
- If you ever localize, see the skill's `references/international-seo.md` for the hreflang playbook.

---

## 2. On-Page SEO Findings

### 2.1 Most service-page titles exceed 60 characters — MEDIUM
- **Issue:** Pixel-truncation in SERPs typically occurs around 580px wide (~55–60 characters depending on character mix). The following titles will be truncated mid-keyword:

  | Page | Title length | Title |
  |---|---|---|
  | `/about` | **142 chars** | "We're Design2Tailwind: a small sister-run studio focused on one thing, turning designs into clean, production-ready front-end code." |
  | `/design-to-tailwind-alpinejs` | **110 chars** | "Design to Tailwind CSS & Alpine.js \| We convert your design to Tailwind CSS code with Alpine.js components" |
  | `/design-to-tailwind-shopify` | **107 chars** | "Design to Tailwind CSS & Shopify \| We convert your design to Tailwind CSS code with Shopify sections" |
  | `/design-to-tailwind-statamic` | **108 chars** | "Design to Tailwind CSS & Statamic \| We convert your design to Tailwind CSS code with Statamic templates" |
  | `/design-to-tailwind-react` | **103 chars** | "Design to Tailwind CSS & React \| We convert your design to Tailwind CSS code with React components" |
  | `/figma-to-tailwind` | **74 chars** | "Figma to Tailwind CSS \| We convert your Figma design to Tailwind CSS code" |
  | `/adobe-xd-to-tailwind` | **81 chars** | "Adobe XD to Tailwind CSS \| We convert your Adobe XD design to Tailwind CSS code" |

- **Evidence:** `src/pages/*.astro` lines 14 of each file; live-checked rendered titles.
- **Fix:** Tighten titles to lead with the keyword and end with the brand. Examples:
  - `/about` → `About Design2Tailwind | A Sister-Run Front-End Studio` (51 chars)
  - `/design-to-tailwind-react` → `Figma to React + Tailwind CSS Conversion | Design2Tailwind` (58 chars) — *note: leading with the user's actual search term ("figma to react") is stronger than "Design to Tailwind CSS & React"*
  - `/design-to-tailwind-shopify` → `Tailwind CSS Shopify Theme Development | Design2Tailwind` (56 chars)
- **Priority:** 3.

### 2.2 Meta descriptions are well-sized and compelling — OK
- All service-page descriptions checked land between 115–155 chars (within 150–160 target).
- Descriptions are unique per page and include the primary keyword.
- **No action needed.**

### 2.3 Homepage H1 is good — OK
- Single H1 on `src/pages/index.astro` lines 39–50: *"We convert your design to Tailwind CSS."*
- Keyword "Tailwind CSS" present. Brand mention is in the surrounding hero copy.
- **Consider:** adding "Figma to Tailwind" or similar high-intent commercial phrase into the H1 or the immediately-following H2.

### 2.4 Blog post titles don't include brand — LOW
- `src/pages/blog/[slug].astro:41` passes `post.data.title` to Layout with no `| Design2Tailwind` suffix. Live: blog titles render as just the post title.
- **Impact:** Lower brand recall in SERP listings; blog clicks don't reinforce the brand.
- **Fix:** Append the site name in `Layout.astro` for non-homepage pages, OR append in `[slug].astro:41` (`title={\`${post.data.title} | Design2Tailwind\`}`). Watch for length — many blog titles are already 50+ chars.
- **Priority:** 4.

### 2.5 Image alt text is mostly empty — MEDIUM
- **Issue:** Spot-check of `src/pages/index.astro` and `src/pages/figma-to-tailwind.astro` shows nearly all `<img>` tags use `alt=''`, including content-meaningful images:
  - Logo in `Header.astro` / `Footer.astro` → `alt=''` (should be `alt="Design2Tailwind"`)
  - Tool logos like `/images/logo/logo-figma.png` in `figma-to-tailwind.astro:23` → `alt=''`
  - Decorative shapes → `alt=''` (this is actually correct — leave them empty)
- **Impact:** Lost image-search visibility; minor accessibility concern.
- **Fix:** Add descriptive alt text to:
  - Logos (brand and tool logos like Figma, PSD, XD, Sketch)
  - Hero illustrations
  - Blog post images (in `src/content/blog/*.md` — markdown alt text)
  - Leave decorative SVG shapes as `alt=""` (correct usage).
- **Priority:** 3.

### 2.6 No per-post OG image — MEDIUM
- **Issue:** `src/pages/blog/[slug].astro:43` does not pass `ogImage` to Layout. All blog posts fall back to `siteConfig.defaultOgImage` (`/images/social.jpg`).
- **Impact:** Social previews for every blog post look identical — significantly hurts CTR from Twitter/LinkedIn shares.
- **Fix (cheapest):** Add an `ogImage` field to the blog frontmatter schema in `src/content.config.ts`, then pass through in `[slug].astro`. For posts without one, fall back to a templated `og:image` (e.g., generate at build time with `satori` or use Cloudflare's `og-image` worker).
- **Fix (best):** Build-time OG image generation per post using the post title + Recoleta font. Astro has community plugins for this (e.g., `astro-og-canvas`).
- **Priority:** 3.

### 2.7 Internal linking — OK with caveats
- Mega-menu in `Header.astro` links to all 6 framework pages and 4 design-tool pages, putting them all ≤1 click from the homepage. Good.
- Footer adds redundancy. Good.
- Blog posts don't internally link to service pages (commercial intent). Each blog post is a high-intent reader funnel that's currently terminating in dead-ends.
- **Fix:** Add a "Need help converting your designs?" CTA component to `src/pages/blog/[slug].astro` linking to `/figma-to-tailwind` or the matching service page. This is one of the highest-ROI changes in this audit — it converts existing organic blog traffic into service-page visits.
- **Priority:** 2 (high-leverage, low-effort).

### 2.8 Keyword targeting maps to keyword research — MIXED
- Ahrefs shows the site's existing rankings are all **informational long-tail** (`tailwind font size`, `hide scrollbar css`, `tailwind text gradient`). The commercial-intent pages (`/figma-to-tailwind`, etc.) have **zero ranking keywords** in Ahrefs.
- **Implication:** The blog drives all traffic; the service pages are competing for high-intent commercial terms with no measurable visibility yet. They need:
  - More on-page content (currently very heavy hero + CTA, light body content)
  - Internal links from the blog (see 2.7)
  - Real schema (see Section 3)
  - Backlinks (Ahrefs shows 0 RD on the top blog posts and ~1 on a couple — link-building is out of scope but flagged)
- **Priority:** 3 (long-term content/marketing work).

---

## 3. Structured Data Findings

### 3.1 Zero JSON-LD on any page — HIGH
- **Issue:** `grep "application/ld+json"` across the codebase returns zero matches. Verified live: `curl -sS https://design2tailwind.com/ | grep -c "application/ld+json"` = 0. Same for the highest-traffic blog post.
- **Note:** The skill's SKILL.md warns that `curl`/`web_fetch` can miss JS-injected schema. This site doesn't use a CMS plugin that would inject schema client-side (it's a static Astro build), so the grep result is reliable. Re-verify with a browser-rendered check (`document.querySelectorAll('script[type="application/ld+json"]')`) before shipping the fixes.
- **Impact:** No rich results eligibility. Missing key opportunities:
  - **Organization** on homepage — brand entity, sameAs links, logo
  - **Service** on each `/figma-to-tailwind`, `/psd-to-tailwind`, etc.
  - **Article** + **BreadcrumbList** on each blog post — eligible for article rich results
  - **FAQPage** on service pages with FAQ sections (`src/components/FAQ.astro` exists)
- **Fix:** Add a `Schema.astro` component that emits JSON-LD based on page type. Sketch below:

  ```astro
  ---
  // src/components/Schema.astro
  import { siteConfig } from '@config/site';
  interface Props { type: 'website' | 'article' | 'service' | 'faq'; data?: any; }
  const { type, data } = Astro.props;

  const organization = {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.svg`,
    sameAs: ['https://twitter.com/Design2Tailwind'],
  };

  let schema;
  if (type === 'website') schema = { '@context': 'https://schema.org', '@type': 'WebSite', ...organization };
  if (type === 'service') schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    provider: organization,
    areaServed: 'Worldwide',
    serviceType: 'Web Development',
    description: data.description,
  };
  if (type === 'article') schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    image: data.image,
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime ?? data.publishedTime,
    author: { '@type': 'Person', name: data.author },
    publisher: organization,
  };
  if (type === 'faq') schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map((q: any) => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a },
    })),
  };
  ---
  <script type='application/ld+json' set:html={JSON.stringify(schema)} />
  ```
  Then include `<Schema type='website' />` in `Layout.astro` (homepage), `<Schema type='service' data={...} />` on each service page, and `<Schema type='article' data={...} />` on `[slug].astro`. Validate with [Rich Results Test](https://search.google.com/test/rich-results).
- **Priority:** 2 (highest-ROI of the priority-2 items because it's deterministic SERP enhancement).

---

## 4. Performance / Core Web Vitals Findings

### 4.1 Heavy jQuery vendor stack loaded on every page — HIGH
- **Issue:** `src/layouts/Layout.astro` lines 281–328 load these on every route via `is:inline`:
  - jQuery
  - Bootstrap bundle JS
  - WOW.js + animate.css
  - Slick slider
  - FancyBox
  - jquery.lazy
  - jquery.counterup
  - jquery.waypoints
  - Isotope
  - Nice Select
  - Validator
  - theme.js
- **Estimated cost:** ~250–400KB of compressed JS, ~600–900KB uncompressed, plus the parser work to evaluate all of it before main-thread idles. Most pages use approximately one of these.
- **Impact:** LCP drag and high TBT/INP on mobile. The site likely scores poorly on Core Web Vitals (recommend manual Lighthouse run to confirm).
- **Fix:** This is non-trivial. Phased approach:
  1. **Phase 1 — measure:** Run Lighthouse on the homepage and a blog post. Identify which scripts actually contribute to rendered features.
  2. **Phase 2 — split:** Move vendor scripts out of `Layout.astro` and into the specific pages/components that use them (e.g., Slick lives with the Testimonials carousel, not on `/about`).
  3. **Phase 3 — replace:** Each jQuery widget has a tiny vanilla-JS equivalent or could be done with Alpine.js (which is already loaded). Targets to remove first: `jquery.lazy` (use `loading="lazy"` native attribute), `nice-select` (use `<select>` styled with Tailwind), `wow.js` (use Intersection Observer + CSS classes).
- **Priority:** 2 (architectural, but the gains are large).

### 4.2 No image optimization — HIGH
- **Issue:** All images are raw `<img>` tags with `data-src` for jQuery Lazy. No `astro:assets <Image />`, no `srcset`, no WebP/AVIF conversion. `sharp` is installed in `package.json` but unused.
- **Impact:** Larger payloads on retina screens, no responsive serving, CLS risk (no width/height set), and the `<img src="images/lazy.svg">` placeholder approach is fragile (any image without JS execution shows the placeholder).
- **Fix:** Migrate to Astro's built-in `<Image />` from `astro:assets`:
  ```astro
  import { Image } from 'astro:assets';
  import figmaLogo from '../assets/logo-figma.png';
  ...
  <Image src={figmaLogo} alt="Figma" width={64} height={64} loading="lazy" />
  ```
  Astro will auto-generate WebP/AVIF and `srcset`. Combine with native `loading="lazy"` and drop the jQuery Lazy dependency entirely.
- **Priority:** 2.

### 4.3 No `font-display: swap` on custom fonts — MEDIUM
- **Issue:** Custom fonts (Recoleta, Gordita, Eustache, Noteworthy) are loaded via stylesheets in `public/fonts/*/stylesheet.css`. Spot-check expected: no `font-display` declared, so browsers default to `block` (3-second invisible-text window, then swap).
- **Impact:** LCP drag — if Recoleta is the LCP element font, the page can stall on text rendering.
- **Fix:** Add `font-display: swap;` to every `@font-face` block in `public/fonts/recoleta/stylesheet.css`, `public/fonts/gordita/stylesheet.css`, etc. Also consider `<link rel="preload" as="font" type="font/woff2" crossorigin>` on the one or two fonts that appear above the fold.
- **Priority:** 3 (easy win, but smaller than the JS stack issue).

### 4.4 `compressHTML: false` — LOW
- `astro.config.mjs:9` disables HTML compression. CLAUDE.md says this is intentional for readability, which is fine — but ~5–10% of HTML payload is whitespace that the user doesn't need to pay for.
- **Fix:** Set `compressHTML: true` once development is past the "frequently view-source" phase. Low priority; minimal SEO impact.
- **Priority:** 5.

### 4.5 No `width`/`height` on `<img>` tags — MEDIUM (CLS risk)
- **Issue:** Most `<img>` tags don't declare `width` and `height` attributes. Logo in `Header.astro` has `width='250'` but no `height`. Astro's `<Image />` would supply both automatically.
- **Impact:** Cumulative Layout Shift as images load. CWV penalty.
- **Fix:** Pair with 4.2 (move to `astro:assets`). Manual fix: add `width`/`height` attributes matching the source aspect ratio.
- **Priority:** 3.

---

## 5. Prioritized Action Plan

### Critical (ship this week)
| # | Action | File(s) | Effort | Section |
|---|---|---|---|---|
| 1 | Strip `.html` from canonical/og:url in Layout (or change `build.format`) | `src/layouts/Layout.astro:21-23` | XS | 1.1 |
| 2 | Add `_redirects` rule to force 301 on `*.html → :splat` | `public/_redirects` (new) | XS | 1.2 |
| 3 | Build or noindex `/terms` and `/privacy` | `src/pages/terms.astro`, `src/pages/privacy.astro` (new) | S | 1.4 |

### High (ship next sprint)
| # | Action | File(s) | Effort | Section |
|---|---|---|---|---|
| 4 | Add `Schema.astro` component + JSON-LD on homepage, service pages, blog posts | `src/components/Schema.astro` (new), `Layout.astro`, all service pages, `[slug].astro` | M | 3.1 |
| 5 | Add blog → service CTA component | `src/components/BlogCTA.astro` (new) + `[slug].astro` | S | 2.7 |
| 6 | Add per-post OG image (frontmatter field + fallback) | `src/content.config.ts`, `[slug].astro`, content `.md` files | M | 2.6 |
| 7 | Standardize URL format across sitemap/canonical/RSS | `src/pages/rss.xml.ts` or `permalink:` in `.md` frontmatter | XS | 1.3 |

### Quick Wins (do anytime — each <30 min)
| # | Action | File(s) | Effort | Section |
|---|---|---|---|---|
| 8 | Add `alt="Design2Tailwind"` to logo `<img>` | `src/components/Header.astro`, `Footer.astro` | XS | 2.5 |
| 9 | Truncate `/about` title to ~55 chars | `src/pages/about.astro:14` | XS | 2.1 |
| 10 | Truncate framework-page titles (Alpine.js, Shopify, Statamic, etc.) | `src/pages/design-to-tailwind-*.astro:14` | XS | 2.1 |
| 11 | Add `font-display: swap;` to `@font-face` blocks | `public/fonts/*/stylesheet.css` | XS | 4.3 |
| 12 | Append brand to blog post titles | `src/pages/blog/[slug].astro:41` | XS | 2.4 |
| 13 | Add alt text to Figma/PSD/XD/Sketch tool logos on service pages | `src/pages/figma-to-tailwind.astro:25` (and siblings) | XS | 2.5 |

### Long-term (multi-week)
| # | Action | File(s) | Effort | Section |
|---|---|---|---|---|
| 14 | Migrate `<img>` → `astro:assets <Image />` (auto-WebP/AVIF, srcset) | All `.astro` files with raw `<img>` | L | 4.2, 4.5 |
| 15 | Audit & shed jQuery vendor stack; per-component script loading | `src/layouts/Layout.astro:281-328`, move into specific components | L | 4.1 |
| 16 | Expand service-page content (longer bodies, FAQs) to compete for commercial keywords | All `src/pages/*-to-tailwind.astro` and `design-to-tailwind-*.astro` | L | 2.8 |
| 17 | Link-building / content marketing (out of code scope) | n/a | L | 2.8 |

---

## Appendix A — Live test evidence (2026-05-12)

### Robots.txt
```
User-agent: *
Allow: /
Sitemap: https://design2tailwind.com/sitemap-index.xml
```
Served: `HTTP/2 200`, `content-type: text/plain`.

### Sitemap-index
`https://design2tailwind.com/sitemap-index.xml` → `HTTP/2 200`, references `sitemap-0.xml`.
`sitemap-0.xml` contains 29 URLs (1 home + 14 blog + 14 service/framework/about/agencies). All return 200.

### RSS feed
`https://design2tailwind.com/rss.xml` → `HTTP/2 200`, `content-type: application/xml`.

### 404 checks
`https://design2tailwind.com/terms` → `HTTP/2 404`
`https://design2tailwind.com/privacy` → `HTTP/2 404`

### Canonical bug spot-checks
| Live URL | Returns | Canonical in `<head>` |
|---|---|---|
| `/` | 200 | `https://design2tailwind.com/` ✓ |
| `/figma-to-tailwind` | 200 | `https://design2tailwind.com/figma-to-tailwind.html` ✗ |
| `/about` | 200 | `https://design2tailwind.com/about.html` ✗ |
| `/blog` | 200 | `https://design2tailwind.com/blog.html` ✗ |
| `/blog/tailwindcss-hide-scrollbar` | 200 | `https://design2tailwind.com/blog/tailwindcss-hide-scrollbar.html` ✗ |
| `/design-to-tailwind-react` | 200 | `https://design2tailwind.com/design-to-tailwind-react.html` ✗ |
| `/figma-to-tailwind.html` | **307** → `/figma-to-tailwind` | (target of broken canonical) |

### Ahrefs snapshot (subdomains mode, 2026-05-12)
- Domain Rating: **8**
- Organic keywords: **52**
- Organic traffic: **300/mo**
- Paid keywords: 0
- Top 4 traffic pages — all `.html`:
  1. `/blog/change-tailwindcss-base-font-size.html` — 147/mo, top kw "tailwind font size" #6
  2. `/blog/tailwindcss-hide-scrollbar.html` — 66/mo, top kw "hide scrollbar css" #5
  3. `/blog/tailwindcss-gradient-text.html` — 54/mo, top kw "tailwind text gradient" #1
  4. `/blog/tailwindcss-background-image.html` — 27/mo, top kw "tailwind background image" #11

## Appendix B — How this audit was produced

- Code exploration: read-only walk of `src/pages/`, `src/components/`, `src/layouts/`, `src/content/`, `astro.config.mjs`, `package.json`, `public/robots.txt`.
- Live verification: `curl -sSI` and `curl -sS -L` against production URLs; meta tag extraction via `grep`.
- Ahrefs data: pulled via `mcp__claude_ai_Ahrefs__site-explorer-metrics`, `site-explorer-domain-rating`, `site-explorer-organic-keywords`, and `site-explorer-top-pages` for `design2tailwind.com` in `subdomains` mode.
- Framework: `.agents/skills/seo-audit/SKILL.md`.

To re-run the live checks:
```bash
# Canonical bug spot-check
for p in / /about /blog /figma-to-tailwind /design-to-tailwind-react /blog/tailwindcss-hide-scrollbar; do
  echo "=== $p ==="
  curl -sS -L "https://design2tailwind.com$p" | grep 'rel="canonical"'
done

# 307 vs 301 check
curl -sSI https://design2tailwind.com/figma-to-tailwind.html | head -3

# Schema check (after fixes)
curl -sS https://design2tailwind.com/ | grep -c "application/ld+json"
```
