# Doloc Town Wiki — Final Local Acceptance

**Acceptance date:** 2026-08-16  
**Environment:** Node.js 22.23.2; npm 10.9.8  
**Scope:** Local production build only. No GitHub connection or deployment was performed.

## Evidence types

- **Automated build checks:** Astro/TypeScript, content schema, tests, SEO, JSON-LD, sitemap, links, accessibility structure, contrast, and emitted files.
- **Automated browser checks:** Real headless Chrome against the production preview for geometry, text clipping risk, menu state, actual Space/Escape input, focus return, console errors, and page-specific UI.
- **Browser screenshot review:** Representative screenshots were visually inspected for the home, category, long-title/long-source guide, and 404 templates across the four acceptance widths. This is an explicit sample, not a claim that every one of the 88 viewport combinations was manually inspected pixel by pixel.
- **Manual document/content review:** Page matrix, evidence states, visible disclaimers, source separation, known limitations, and final report were reviewed directly.

## Commands used

```sh
npm run verify
npm run check:preview
node scripts/check-responsive.mjs
```

Additional deterministic checks covered placeholder terms, old category routes, incorrect Verified status, a temporary `/wiki/` base-path build, and the sitemap/robots artifacts. The production preview was started from `dist/` with `npm run preview -- --host 127.0.0.1`.

## Per-page acceptance

`Pass` in the four viewport columns means the real-browser automated layout check passed at that exact viewport. “Visual sample” identifies the templates selected for screenshot review.

| Page | 390×844 | 768×1024 | 1280×800 | 1440×900 | H1/title/links | Visual sample | Result |
|---|---|---|---|---|---|---|---|
| Home `/` | Pass | Pass | Pass | Pass | Pass | Yes | Pass |
| 404 `/404.html` | Pass | Pass | Pass | Pass | Pass | Yes | Pass |
| Guides `/guides/` | Pass | Pass | Pass | Pass | Pass | Template covered | Pass |
| Farming `/farming/` | Pass | Pass | Pass | Pass | Pass | Yes | Pass |
| Characters & Items `/characters-items/` | Pass | Pass | Pass | Pass | Pass | Template covered | Pass |
| Map & Quests `/map-quests/` | Pass | Pass | Pass | Pass | Pass | Template covered | Pass |
| Beginner Guide | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Walkthrough | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Tips and Tricks | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Most Profitable Crops | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Crop Tier List | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Gene System | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Ranching Guide | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Fish Locations | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Automation | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| NPC Gifts | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Recipes | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Metal Frame | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Old Chips | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Old Engine Cores | Pass | Pass | Pass | Pass | Pass | Yes; long-title/source case | Pass |
| Map | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |
| Wetlands Pipes | Pass | Pass | Pass | Pass | Pass | Guide template covered | Pass |

## Responsive and visual results

- 88/88 page-and-viewport combinations passed with no horizontal document overflow, clipped visible text, or elements outside the viewport.
- Mobile uses one-column cards and moves the guide contents navigation above the article body.
- Breadcrumbs wrap and render without default list numbering.
- Source references and both source sections render on all guide pages; long source URLs can wrap.
- Footer, disclaimer, H1 region, cards, decorative clipped corners, and 404 layout remained visible and unobstructed.
- No content table is currently published. The shared table component retains a caption contract, focusable horizontal overflow wrapper, and mobile-safe scrolling for future evidence-backed tables.

## Accessibility and keyboard results

- Semantic header, main, footer, navigation, article, and section structures passed static review.
- Every HTML page has one H1 and no heading-level jumps.
- Skip link targets `#main-content` and visible focus styling is present.
- The mobile menu uses a native button with `aria-controls` and synchronized `aria-expanded`.
- Real browser Space input opens the native menu button; Escape closes the menu and returns focus to the button. Native button semantics also provide Enter activation without custom key handling.
- No positive tabindex values alter natural keyboard order.
- Current category navigation uses `aria-current="page"`; guide pages identify the parent category with `aria-current="location"`.
- Breadcrumbs use `aria-label="Breadcrumb"` and `aria-current="page"` on their final item.
- Audited text/background pairs meet at least 4.5:1 contrast.
- `prefers-reduced-motion` disables nonessential smooth scrolling and card motion.
- External links retain `target="_blank"` with `rel="noopener noreferrer"`.

## Production preview and HTTP results

- Home, four category routes, and sixteen guide routes returned HTTP 200.
- `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml`, and a generated CSS asset returned HTTP 200.
- An unknown route returned HTTP 404 with the custom recovery page.
- Directory URLs use strict trailing slashes: `/guides/` is the valid route; `/guides` is not a duplicate route and returns 404 in Astro’s static preview.
- A separate temporary build confirmed that internal links, canonical URLs, robots, and all 21 sitemap URLs consistently honor a `/wiki/` base path.
- The final browser matrix reported zero console errors.

## SEO, links, and evidence

- 22 HTML pages have unique titles, descriptions, one H1, and English language declarations.
- Twenty-one indexable routes have canonical, Open Graph, Twitter Card, and appropriate restrained JSON-LD.
- The 404 is `noindex, nofollow` and excluded from the 21-URL sitemap.
- All internal links resolve in the generated root build.
- Every guide SourceRef resolves, every declared source is referenced, and no orphan source exists.
- All guide pages remain `Needs Verification`; all current external research inputs remain `Discovery Only`.

## Fixes made during final acceptance

- Replaced the `<details>` mobile menu with an explicit native-button menu supporting keyboard activation, Escape, focus return, and synchronized ARIA state.
- Added current-location navigation styling and semantics.
- Darkened rust and amber accents to meet normal-text contrast.
- Moved breadcrumb styling into shared navigation CSS so guide pages no longer show default numbering.
- Added an original text-geometric SVG favicon to eliminate the browser’s missing-favicon console error.
- Added automated accessibility, production-preview, four-viewport, keyboard, and console checks.

## Known limitations and deployment prerequisites

- `https://example.invalid` is a reserved placeholder, not the production domain. An approved `PUBLIC_SITE_URL` is required before deployment.
- All sixteen guides still contain evidence-bounded first editions. Specific mechanics, values, locations, recipes, preferences, quest steps, and item details remain `Needs Verification` until exact sources are approved.
- Discovery-only URLs must not be upgraded merely to make content appear complete.
- No Git repository, GitHub connection, push, or deployment has been performed.
- Before public launch, set the real origin/base path, re-run the complete gate and production preview, and review any newly verified content and external-link reachability.

## Local acceptance conclusion

The project satisfies the local technical conditions for a later GitHub and static-deployment stage: reproducible build, complete route output, validated links and metadata, responsive layouts, keyboard-operable navigation, clean production preview, and documented constraints. Version-control and deployment authorization remain separate owner decisions.
