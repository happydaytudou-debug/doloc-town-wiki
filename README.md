# Doloc Town Wiki

Doloc Town Wiki is an independent, fan-made English guide site. It is not affiliated with or endorsed by the developers or publishers of Doloc Town. The production site is deployed to Cloudflare Pages from the public GitHub repository.

## Technology

- Astro 7 with static output
- TypeScript
- Astro MDX Content Collections
- Native CSS
- Node's built-in test runner
- `@astrojs/sitemap`
- Cloudflare Pages with Wrangler 4

## Requirements and local commands

Use a current Node.js release and npm. Install the locked dependencies with:

```sh
npm install
```

Start the development server:

```sh
npm run dev -- --host 127.0.0.1
```

Run individual checks:

```sh
npm run check
npm run check:a11y
npm run validate:content
npm test
npm run build
npm run validate:build
npm run preview -- --host 127.0.0.1
```

With the production preview running, set its selected local port when necessary and run:

```sh
PREVIEW_PORT=4321 npm run check:preview
PREVIEW_PORT=4321 node scripts/check-responsive.mjs
```

Run the complete automated gate:

```sh
npm run verify
```

## Page structure

The approved first-release matrix contains 22 HTML pages:

- Home
- Four categories: Guides, Farming, Characters & Items, and Map & Quests
- Sixteen guide pages defined by `src/data/site-matrix.json`
- One custom 404 page

Routes use directory-style trailing slashes. The 404 output is `/404.html`, is marked `noindex`, and is excluded from the sitemap.

## Content and evidence rules

Guide content lives in `src/content/guides/*.mdx`. The schema is defined in `src/content.config.ts`. Do not change an ID, slug, category, or priority independently of the approved matrix.

Every first-release guide is currently `Needs Verification`. Do not invent prices, mechanics, locations, recipes, character preferences, quest steps, statistics, codes, or sources. Search intent and SEO keywords describe the question a page should answer; they are not evidence that an answer is true.

Sources use two display states:

- `Verified` means an exact source supports a specific visible claim. No current guide source has this status.
- `Discovery Only` means the supplied URL is an entry point for later research and does not verify a detailed claim.

Every `<SourceRef id="..." />` must resolve to a source declared on the same page. Every declared source must be referenced. Player reports must remain attributed, and broad storefront, community, discussion, guide-index, channel, or subreddit pages must not be treated as claim-level evidence.

## Site URL, canonical URLs, and base paths

The single default site origin is configured in `astro.config.mjs`:

```text
https://doloc-town-wiki-3c1.pages.dev
```

Production uses the root path. For an explicit preview or future approved custom-domain build, override the origin without editing components:

```sh
PUBLIC_SITE_URL=https://approved.example npm run build
```

For a subdirectory deployment, also set the base path:

```sh
PUBLIC_SITE_URL=https://approved.example PUBLIC_BASE_PATH=/repository-name/ npm run build
```

Canonical URLs, Open Graph URLs, JSON-LD URLs, sitemap URLs, robots output, internal links, and assets derive from Astro's central `site` and `base` configuration.

## Deployment

- GitHub repository: <https://github.com/happydaytudou-debug/doloc-town-wiki>
- Cloudflare Pages project: `doloc-town-wiki`
- Production branch: `main`
- Production URL: <https://doloc-town-wiki-3c1.pages.dev>
- Build command: `npm run build`
- Build output directory: `dist`

Wrangler is installed as a project development dependency. `wrangler.json` records the Pages project name and output directory. After running the complete verification gate, deploy the generated root-path site with:

```sh
npx wrangler pages deploy dist --project-name doloc-town-wiki --branch main
```

Cloudflare credentials remain in Wrangler's user-level configuration and must never be committed. The generated `dist` directory also remains untracked.

## SEO output

- Home: `WebSite` JSON-LD
- Category pages: `CollectionPage` and `BreadcrumbList`
- Guide pages: `Article` and `BreadcrumbList`
- 404: no content JSON-LD and `noindex, nofollow`
- All indexable pages: canonical, Open Graph, and basic Twitter Card metadata

Structured data intentionally omits unverified authors, publishers, organizations, logos, images, ratings, reviews, and publication dates.

## Before a future production update

Before publishing an update:

1. Replace discovery-only links with exact claim-level sources where evidence permits.
2. Re-review every `Needs Verification` statement; do not upgrade status merely to make a page appear complete.
3. Confirm social/video affiliation and reachability where those claims remain visible.
4. Run `npm run verify` against the final root-path configuration and inspect the production preview.
5. Complete the responsive, accessibility, keyboard, and full-page acceptance checklist.

The latest local acceptance evidence is recorded in `docs/qa/final-acceptance.md`. It distinguishes automated checks from browser screenshot review and does not claim that automation is manual testing.

No custom domain has been purchased or connected. The `pages.dev` origin remains the canonical production address unless an owner-approved domain replaces it in a later release.
