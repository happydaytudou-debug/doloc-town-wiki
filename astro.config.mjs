import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Production origin. PUBLIC_SITE_URL remains available for explicit preview overrides.
const site = process.env.PUBLIC_SITE_URL || 'https://doloc-town-wiki-3c1.pages.dev';
const base = process.env.PUBLIC_BASE_PATH || '/';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  base,
  site,
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/404.html') && !page.endsWith('/404/') })],
});
