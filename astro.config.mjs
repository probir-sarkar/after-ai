// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Fully prerendered: `output: 'static'` (default) + no adapter. The Worker only
// serves assets, so `build.format: 'file'` gives extensionless URLs with no
// trailing slash — see the URL contract in the deploy notes.
export default defineConfig({
  site: 'https://after-ai.probir.dev',
  build: { format: 'file' },
  integrations: [react(), mdx()],
  vite: { plugins: [tailwindcss()] },
});