# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Design2tailwind website redesign - a static site built with Astro and Tailwind CSS v4. The site showcases a service that converts designs (PSD, Figma, Adobe XD, Sketch) to handcrafted Tailwind CSS code.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run development server (localhost:3000)
pnpm dev
# Alternative commands: pnpm develop, pnpm start

# Preview production build
pnpm preview

# Deploy to Cloudflare Pages
wrangler pages deploy ./dist
```

**IMPORTANT**: Do NOT run build commands (`pnpm build`) unless explicitly requested. The dev server is assumed to be running.

## Architecture & Structure

### Framework Stack
- **Astro** - Static site generator configured for static output
- **Tailwind CSS v4** - Using the new @tailwindcss/postcss plugin
- **Alpine.js** - For interactive components (loaded via CDN)
- **jQuery** - Legacy dependency for vendor scripts

### Key Directories
- `/src/pages/` - Astro page components (routes)
- `/src/components/` - Shared Astro components (Header, Footer)
- `/src/layouts/` - Base layout templates
- `/src/styles/` - Global styles and Tailwind imports
- `/public/` - Static assets served directly
  - `/css/` - Legacy CSS files
  - `/fonts/` - Custom web fonts (Recoleta, Gordita, etc.)
  - `/images/` - Image assets, icons, shapes
  - `/vendor/` - Third-party JavaScript libraries

### Build Configuration
- **Output**: Static files to `./dist/`
- **Assets**: Bundled to `assets/` directory
- **Format**: File-based routing
- **Deployment**: Cloudflare Pages via wrangler

## Important Technical Details

### Tailwind CSS v4 Setup
- Configuration in `tailwind.config.js` with custom container queries and breakpoints
- Main styles imported via `src/styles/main.css` using `@import 'tailwindcss'` with `@config` directive
- PostCSS configured to use `@tailwindcss/postcss` plugin (implicitly via Tailwind v4)
- Base layer includes custom resets and utility defaults (box-sizing, margins, paddings)

### Custom Breakpoints
The project uses non-standard Tailwind breakpoints matching Bootstrap conventions:
- `xsm`: max 575.98px
- `sm`: 576px - 767.98px
- `md`: 768px - 991.98px
- `lg`: 992px - 1199.98px
- `xl`: min 1200px
- `2xl`: 1200px - 1399px
- `xxl`: min 1536px

### Font Configuration
Custom fonts are loaded via CSS files in `/public/fonts/`:
- Recoleta (headings)
- Gordita (body text)
- Bootstrap Icons
- Font Awesome
- Eustache, Noteworthy (decorative)

### Astro-Specific Configuration
- **HTML Compression**: Disabled (`compressHTML: false`) for readability
- **Build Format**: File-based routing (not directory-based)
- **Asset Bundling**: All assets output to `assets/` with specific filenames (`main.js`, `main.css`)
- **Assets Inline Limit**: Set to 0 to prevent any inlining
- **Script Loading**: Vendor scripts use `is:inline` attribute to bypass Astro's script processing

### Legacy Dependencies
The site includes jQuery and several jQuery plugins loaded at the end of the `<body>` in Layout.astro:
- jQuery core
- Bootstrap JS (bundle)
- Slick slider
- Fancybox
- WOW.js (scroll animations)
- Isotope (filtering/sorting)
- Nice Select (custom dropdowns)
- jQuery Counter, Waypoints, Lazy loading
- Custom theme.js

All vendor scripts use `is:inline` to prevent Astro from processing/bundling them.

## Development Notes

1. **No Test Suite**: Currently no testing framework is configured
2. **Formatting**: Prettier is installed with plugins for Astro and Tailwind, but no explicit config file
3. **Image Optimization**: Uses lazy loading with placeholder SVG via jQuery Lazy plugin
4. **CSS Architecture**: Mix of Tailwind utilities and legacy CSS files in `/public/css/` - prioritize Tailwind for new features
5. **CSS Custom Properties**: Uses CSS variables for theme colors (defined in `:root` in main.css):
   - `--text-color`, `--heading`
   - `--prime-one` through `--prime-twelve` for various accent colors
6. **Container Sizing**: Custom container plugin with Bootstrap-style responsive max-widths (540px → 1320px)

## Working with Tailwind CSS

### Key Differences from Standard Tailwind
- **Breakpoints**: Use Bootstrap-style breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`, `xxl`, `xsm`) instead of default Tailwind breakpoints
- **Custom Utilities**: Extensive custom utilities in `main.css` for transitions (`.tran3s`, `.tran4s`, etc.)
- **CSS Variable Access**: Theme colors accessed via `text-(--prime-one)` syntax in utility classes
- **Legacy CSS Mix**: Many components still use traditional CSS in `main.css` - gradually migrate to utilities when editing

### Styling Approach
- New features should use Tailwind utilities where possible
- Complex animations and vendor-specific styles remain in `main.css` base layer
- Use `@apply` directive sparingly (only in base layer for resets)
- Prefer inline Tailwind classes in `.astro` components

## Cloudflare Deployment

The project is configured for Cloudflare Pages deployment:
- Build output directory: `./dist`
- Environment variable: `PROD = true`
- Deploy command: `wrangler pages deploy ./dist`