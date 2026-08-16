import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Reserved placeholder only. Set PUBLIC_SITE_URL to the real origin before deployment.
const site = process.env.PUBLIC_SITE_URL || 'https://example.invalid';
const base = process.env.PUBLIC_BASE_PATH || '/';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  base,
  site,
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/404.html') && !page.endsWith('/404/') })],
});
