// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Fully prerendered: `output: 'static'` (default) + no adapter. The Worker only
// serves assets, so `build.format: 'file'` gives extensionless URLs with no
// trailing slash — see the URL contract in the deploy notes.
export default defineConfig({
  site: 'https://after-ai.browserstay.com',
  build: { format: 'file' },
  integrations: [
    react(),
    mdx(),
    sitemap({
      // 404 is not a page anyone should index.
      filter: (page) => !page.includes('/404'),
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});