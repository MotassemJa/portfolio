// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Project page: https://MotassemJa.github.io/portfolio
// `base` is why you must never hardcode a root-relative asset path.
// Use import.meta.env.BASE_URL, or let astro:assets handle it.
export default defineConfig({
  site: 'https://MotassemJa.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  integrations: [react(), sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: {
    css: {
      // oklch(), corner-shape and animation-timeline must survive the build.
      // Lightning CSS with a modern target avoids downleveling them into nothing.
      transformer: 'lightningcss',
      lightningcss: { targets: { chrome: 111 << 16, firefox: 128 << 16, safari: (16 << 16) | (4 << 8) } },
    },
  },
});
