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

# Build for production
pnpm build

# Preview production build
pnpm preview

# Deploy to Cloudflare Pages
wrangler pages deploy ./dist
```

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
- Main styles imported via `src/styles/main.css` using `@import 'tailwindcss'`
- Custom PostCSS configuration using `@tailwindcss/postcss`

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

### Legacy Dependencies
The site includes jQuery and several jQuery plugins loaded via script tags in the layout. These are marked with `is:inline` to prevent Astro processing.

## Development Notes

1. **No Test Suite**: Currently no testing framework is configured
2. **No Linting/Formatting**: No ESLint or Prettier config files present (though Prettier is installed)
3. **Image Optimization**: Uses lazy loading with placeholder SVG
4. **Vendor Scripts**: Multiple jQuery plugins loaded globally - consider modern alternatives when refactoring
5. **CSS Architecture**: Mix of Tailwind utilities and legacy CSS files - prioritize Tailwind for new features

## Cloudflare Deployment

The project is configured for Cloudflare Pages deployment:
- Build output directory: `./dist`
- Environment variable: `PROD = true`
- Deploy command: `wrangler pages deploy ./dist`