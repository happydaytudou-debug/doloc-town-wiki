import type { APIRoute } from 'astro';
import { buildCanonical } from '../lib/seo';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Astro site URL must be configured');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${buildCanonical(site, '/sitemap-index.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
