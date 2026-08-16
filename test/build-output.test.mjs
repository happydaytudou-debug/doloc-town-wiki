import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');

const categoryExpectations = [
  {
    slug: 'guides',
    title: 'Guides',
    guides: ['beginner-guide', 'walkthrough', 'tips-and-tricks'],
    recommended: 'beginner-guide',
  },
  {
    slug: 'farming',
    title: 'Farming',
    guides: ['most-profitable-crops', 'crop-tier-list', 'gene-system', 'ranching-guide', 'fish-locations', 'automation'],
    recommended: 'most-profitable-crops',
  },
  {
    slug: 'characters-items',
    title: 'Characters &amp; Items',
    guides: ['npc-gifts', 'recipes', 'metal-frame', 'old-chips', 'old-engine-cores'],
    recommended: 'recipes',
  },
  {
    slug: 'map-quests',
    title: 'Map &amp; Quests',
    guides: ['map', 'wetlands-pipes'],
    recommended: 'map',
  },
];

const contentPaths = [
  '',
  ...categoryExpectations.map(({ slug }) => slug),
  ...categoryExpectations.flatMap(({ slug, guides }) => guides.map((guide) => `${slug}/${guide}`)),
];

test('homepage emits the approved shell, SEO, and all required sections', async () => {
  const html = await read('index.html');
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<title>Doloc Town Wiki — Guides, Crops, Map &amp; Recipes<\/title>/);
  assert.match(html, /Master Doloc Town with beginner guides, crop rankings, recipes, maps, NPC gifts, item locations, ranching tips, gene systems, and automation help\./);
  for (const text of ['Independent Fan-Made Guide', 'Start Here', 'What is Doloc Town?', 'Guide Categories', 'Popular Guides', 'Official Video', 'Ready to Master Doloc Town?']) assert.match(html, new RegExp(text.replace(/[?]/g, '\\?')));
  for (const path of ['/guides/', '/farming/', '/characters-items/', '/map-quests/']) assert.match(html, new RegExp(`href="${path}"`));
  assert.match(html, /Doloc Town Wiki is an independent, fan-made guide and is not affiliated with or endorsed by the developers or publishers of Doloc Town\./);
  assert.doesNotMatch(html, /2,420|94% Positive|30\+ Hours|100\+ Hours|80 Steam Achievements|Privacy Policy|Terms of Service/);
});

test('homepage external links use safe attributes', async () => {
  const html = await read('index.html');
  const externalLinks = [...html.matchAll(/<a[^>]+href="https:[^"]+"[^>]*>/g)].map(([tag]) => tag);
  assert.ok(externalLinks.length >= 2);
  for (const tag of externalLinks) {
    assert.match(tag, /target="_blank"/);
    assert.match(tag, /rel="noopener noreferrer"/);
  }
});

test('404 provides recovery links to home and all categories', async () => {
  const html = await read('404.html');
  assert.match(html, /Page not found/);
  for (const path of ['/', '/guides/', '/farming/', '/characters-items/', '/map-quests/']) assert.match(html, new RegExp(`href="${path}"`));
});

test('category routes render the exact final matrix with metadata and navigation', async () => {
  for (const category of categoryExpectations) {
    const html = await read(`${category.slug}/index.html`);

    const categoryGuideLabel = category.slug === 'guides' ? 'Guides' : `${category.title} Guides`;
    assert.match(html, new RegExp(`<title>Doloc Town ${categoryGuideLabel} — Fan-Made Wiki</title>`));
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, new RegExp(`<h1[^>]*>${category.title}</h1>`));
    assert.match(html, /<nav[^>]+aria-label="Breadcrumb"/);
    assert.match(html, /href="\/">Home<\/a>/);
    assert.match(html, /Recommended First/);
    assert.match(html, new RegExp(`data-recommended-guide="${category.recommended}"`));
    assert.match(html, /Reading Path/);
    assert.match(html, /Explore Other Categories/);
    assert.match(html, /Needs Verification/);

    const guideCards = [...html.matchAll(/data-guide-id="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(guideCards, category.guides);
    for (const guide of category.guides) {
      assert.match(html, new RegExp(`href="/${category.slug}/${guide}/"`));
    }

    const otherCategories = categoryExpectations.filter(({ slug }) => slug !== category.slug);
    for (const other of otherCategories) {
      assert.match(html, new RegExp(`href="/${other.slug}/"`));
    }
  }
});

test('all sixteen guide routes render the complete guide contract', async () => {
  const descriptions = new Set();
  for (const category of categoryExpectations) {
    for (const guide of category.guides) {
      const html = await read(`${category.slug}/${guide}/index.html`);
      const h1Matches = html.match(/<h1(?:\s[^>]*)?>/g) ?? [];
      assert.equal(h1Matches.length, 1, `/${category.slug}/${guide}/ must have one H1`);
      assert.match(html, /<article[^>]+class="guide-article"/);
      assert.match(html, /aria-label="Breadcrumb"/);
      assert.match(html, /Needs Verification/);
      assert.match(html, /aria-label="On this page"/);
      assert.match(html, /Related Guides/);
      assert.match(html, /Verified Sources/);
      assert.match(html, /Sources for Verification/);
      assert.match(html, /<meta name="description" content="([^"]+)"/);
      const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
      assert.ok(description && !descriptions.has(description), `/${category.slug}/${guide}/ needs a unique description`);
      descriptions.add(description);
      assert.doesNotMatch(html, /Lorem ipsum|TODO|TBD|Coming Soon/i);
    }
  }
  assert.equal(descriptions.size, 16);
});

test('all indexable pages emit canonical, social metadata, and valid restrained JSON-LD', async () => {
  for (const path of contentPaths) {
    const html = await read(`${path ? `${path}/` : ''}index.html`);
    const canonical = `https://example.invalid/${path ? `${path}/` : ''}`;
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    assert.match(html, /<meta property="og:title" content="[^"]+"/);
    assert.match(html, /<meta property="og:description" content="[^"]+"/);
    assert.match(html, new RegExp(`<meta property="og:url" content="${canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    assert.match(html, /<meta property="og:type" content="(?:website|article)"/);
    assert.match(html, /<meta name="twitter:card" content="summary"/);
    assert.match(html, /<meta name="twitter:title" content="[^"]+"/);
    assert.match(html, /<meta name="twitter:description" content="[^"]+"/);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const types = blocks.map((block) => block['@type']);
    if (!path) assert.deepEqual(types, ['WebSite']);
    else if (!path.includes('/')) assert.deepEqual(types.sort(), ['BreadcrumbList', 'CollectionPage']);
    else assert.deepEqual(types.sort(), ['Article', 'BreadcrumbList']);
    assert.ok(blocks.every((block) => JSON.stringify(block).includes(canonical)));
    assert.doesNotMatch(JSON.stringify(blocks), /AggregateRating|ratingValue|reviewCount|publisher|logo|image|author|datePublished/);
  }
});

test('404 is noindex and sitemap and robots contain exactly the twenty-one content routes', async () => {
  const notFound = await read('404.html');
  assert.match(notFound, /<meta name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(notFound, /application\/ld\+json/);

  const sitemap = await read('sitemap-0.xml');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls.sort(), contentPaths.map((path) => `https://example.invalid/${path ? `${path}/` : ''}`).sort());
  assert.ok(!urls.some((url) => url.includes('404')));

  const robots = await read('robots.txt');
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/example\.invalid\/sitemap-index\.xml/);
});

test('shared shell and navigation expose the required accessibility contract', async () => {
  const pages = ['index.html', '404.html', ...contentPaths.filter(Boolean).map((path) => `${path}/index.html`)];
  for (const page of pages) {
    const html = await read(page);
    assert.match(html, /<a class="skip-link" href="#main-content">Skip to content<\/a>/);
    assert.match(html, /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"/);
    assert.equal((html.match(/<header\b/g) ?? []).length >= 1, true, `${page}: missing header landmark`);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${page}: expected one main landmark`);
    assert.equal((html.match(/<footer\b/g) ?? []).length, 1, `${page}: expected one footer landmark`);
    assert.match(html, /<button[^>]+id="mobile-menu-toggle"[^>]+aria-controls="mobile-menu"[^>]+aria-expanded="false"/);
    assert.match(html, /<nav[^>]+id="mobile-menu"[^>]+aria-label="Mobile navigation"[^>]+hidden/);
    assert.doesNotMatch(html, /<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<a\b/i, `${page}: nested links are not allowed`);
  }

  const category = await read('farming/index.html');
  assert.match(category, /href="\/farming\/" aria-current="page"/);
  const guide = await read('farming/automation/index.html');
  assert.match(guide, /href="\/farming\/" aria-current="location"/);

  const mobileNavSource = await readFile(new URL('../src/components/MobileNav.astro', import.meta.url), 'utf8');
  assert.match(mobileNavSource, /event\.key === 'Escape'/);
  assert.match(mobileNavSource, /aria-expanded/);
});
