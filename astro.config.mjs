import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://design2tailwind.com',
  compressHTML: false,

  build: {
      assets: 'assets',
      format: 'file',
	},
	markdown: {
    shikiConfig: {
      // theme: 'dracula',
    },
  },

  vite: {
      define: {
          'process.env': process.env,
      },
      build: {
          assetsInlineLimit: 0,
          rollupOptions: {
              output: {
                  entryFileNames: 'assets/main.js',
                  assetFileNames: 'assets/main[extname]',
              },
          },
      },
	},

  output: 'static',
  adapter: cloudflare(),
});
