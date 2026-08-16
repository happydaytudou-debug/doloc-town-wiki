# Doloc Town Wiki Design Specification

**Date:** 2026-08-13  
**Revision:** 2 — aligned to the Level 2 submitted page matrix  
**Status:** Revised design pending owner confirmation  
**Site language:** English  
**Project communication:** Chinese

## 1. Goal and source of truth

Build a locally runnable English game-guide website for the course Level 4 submission. The Level 2 submitted page matrix and the Level 3 homepage/source package are the sole source of truth for first-release information architecture. This revision supersedes the earlier incorrect category and guide list.

The release contains one homepage, four category pages, sixteen guide pages, one custom 404 page, shared navigation/footer/layouts, responsive styling, SEO, citations, and a README. It must support a later static deployment to GitHub Pages, Cloudflare Pages, or Vercel, but this scope does not authorize Git, GitHub, or deployment work.

## 2. Content and evidence rules

- Preserve the owner-supplied Level 1–3 documents as research inputs.
- Do not research replacement game facts on the internet without later explicit authorization for a named gap.
- Do not invent facts, statistics, mechanics, recipes, locations, conclusions, codes, or links.
- Do not use competing Doloc Town guide-site content or assets.
- All sixteen guide pages begin at page-level `Needs Verification`.
- Broad source index pages are discovery inputs, not proof that a specific guide claim is Verified.
- Player discussions must be attributed as player reports and never presented as official facts.
- Preserve source type and intended use so exact sources can be verified later.

## 3. Identity and disclaimer

The text identity is **Doloc Town Wiki**. The homepage eyebrow is **Independent Fan-Made Guide**. Do not use “Official,” “Community Wiki,” or any wording that implies affiliation, endorsement, authorization, or community contribution.

The footer uses this approved disclaimer:

> Doloc Town Wiki is an independent, fan-made guide and is not affiliated with or endorsed by the developers or publishers of Doloc Town. Game names, trademarks, and related assets belong to their respective owners.

Do not use the official game logo as the site brand. Do not include Privacy Policy or Terms of Service links in the first release because those pages are not in scope.

## 4. Technical architecture

Use Astro, TypeScript, Astro Markdown/MDX Content Collections, native CSS, and npm. Astro generates static directory-style pages from typed site/category data and validated MDX entries. Shared data belongs in TypeScript or JSON; guide prose belongs in MDX.

Do not add React, a backend, database, CMS, accounts, comments, search, dark mode, or a client state library without a separately approved requirement. The layout must be complete without images. Only owner-approved official assets or separately recorded open-source icons may be added later.

## 5. Final categories, pages, priorities, and routes

The four categories and sixteen guides are fixed as follows. Priority numbers preserve the Level 2 submitted matrix order; the first six are the homepage's high-priority group.

| Category | Category slug | Priority | Guide | Guide slug | Primary keyword |
|---|---|---:|---|---|---|
| Guides | `guides` | 1 | Beginner Guide | `beginner-guide` | Doloc Town beginner guide |
| Guides | `guides` | 6 | Walkthrough | `walkthrough` | Doloc Town walkthrough |
| Guides | `guides` | 2 | Tips and Tricks | `tips-and-tricks` | Doloc Town tips and tricks |
| Farming | `farming` | 3 | Most Profitable Crops | `most-profitable-crops` | Doloc Town most profitable crops |
| Farming | `farming` | 11 | Crop Tier List | `crop-tier-list` | Doloc Town crop tier list |
| Farming | `farming` | 4 | Gene System | `gene-system` | Doloc Town gene system |
| Farming | `farming` | 16 | Ranching Guide | `ranching-guide` | Doloc Town ranching guide |
| Farming | `farming` | 8 | Fish Locations | `fish-locations` | Doloc Town fish locations |
| Farming | `farming` | 10 | Automation | `automation` | Doloc Town automation |
| Characters & Items | `characters-items` | 9 | NPC Gifts | `npc-gifts` | Doloc Town NPC gifts |
| Characters & Items | `characters-items` | 7 | Recipes | `recipes` | Doloc Town recipes |
| Characters & Items | `characters-items` | 13 | Metal Frame | `metal-frame` | Doloc Town metal frame |
| Characters & Items | `characters-items` | 14 | Old Chips | `old-chips` | Doloc Town old chips |
| Characters & Items | `characters-items` | 15 | Old Engine Cores | `old-engine-cores` | Doloc Town old engine cores |
| Map & Quests | `map-quests` | 5 | Map | `map` | Doloc Town map |
| Map & Quests | `map-quests` | 12 | Wetlands Pipes | `wetlands-pipes` | Doloc Town Wetlands pipes |

Final URL tree:

```text
/
├── guides/
│   ├── beginner-guide/
│   ├── walkthrough/
│   └── tips-and-tricks/
├── farming/
│   ├── most-profitable-crops/
│   ├── crop-tier-list/
│   ├── gene-system/
│   ├── ranching-guide/
│   ├── fish-locations/
│   └── automation/
├── characters-items/
│   ├── npc-gifts/
│   ├── recipes/
│   ├── metal-frame/
│   ├── old-chips/
│   └── old-engine-cores/
└── map-quests/
    ├── map/
    └── wetlands-pipes/
```

All internal links and assets respect Astro's configured base path. URLs use trailing slashes. Canonical URLs are omitted until a real production origin is configured.

## 6. Content model

Each guide entry has validated frontmatter for stable ID, title, description, slug, category, keywords, search intent, summary, updated date, `Needs Verification` status, numeric priority, featured state, explicit related-guide IDs, and structured sources.

Each source stores a source ID, title/name, URL, source type, intended use, access/verification date, and optional claim note. Cross-entry validation rejects duplicate IDs/slugs, unknown categories, broken related IDs, malformed URLs, source-reference mismatches, and any page marked Verified without claim-level support.

The four category records store their approved guide membership and recommended-first item. Related links are explicit; they are not inferred from keywords.

## 7. Homepage

The homepage order is:

1. Shared header with Home and the four final categories.
2. Hero using `Independent Fan-Made Guide`, title, supplied evidence-safe description, Beginner Guide CTA, Map CTA, and Recipes/items CTA.
3. Core facts containing only facts later confirmed to a sufficiently specific source.
4. Start Here with four cards aligned to Guides, Farming, Characters & Items, and Map & Quests.
5. What Is Doloc Town introduction, with unsupported statements visibly held for verification or omitted.
6. Four Guide Categories using the final membership.
7. Popular Guides using the first six Level 2 priorities: Beginner Guide, Tips and Tricks, Most Profitable Crops, Gene System, Map, and Walkthrough.
8. Official Video area only if the exact supplied video URL and official relationship are verified; otherwise omit it rather than show a broken or misleading embed.
9. Final CTA to Beginner Guide and the verified Steam store URL when available.
10. Footer navigation and approved disclaimer.

Homepage SEO title:

> Doloc Town Wiki — Guides, Crops, Map & Recipes

Homepage SEO description:

> Master Doloc Town with beginner guides, crop rankings, recipes, maps, NPC gifts, item locations, ranching tips, gene systems, and automation help.

Do not publish live-player or review-percentage values as fixed core facts. Release date, achievement count, playtime estimates, and developer/publisher relationships remain `Needs Verification` and are omitted from confirmed fact panels until supported.

## 8. Category and guide layouts

Each category page has breadcrumbs, an English introduction, Recommended First, all assigned guide cards, an evidence-neutral reading sequence, cross-category navigation, and the shared footer. Membership counts are 3, 6, 5, and 2 respectively.

Each guide page has breadcrumbs, H1, summary, updated date, visible `Needs Verification`, table of contents when useful, structured body, inline source references, a consolidated source list, related guides, previous/next navigation, and footer. Desktop may use a contents sidebar; mobile moves or simplifies it above the body.

MDX supports only a small shared component set: notes, warnings, verification badges, source references, steps, and accessible tables.

The 404 page links to Home and all four final categories.

## 9. Visual and responsive system

Use a light, practical Wiki design with restrained desert and mechanical accents: warm sand background, near-white reading surfaces, charcoal text, moss/plant green, rust orange, dry-grass yellow, and mechanical blue-gray. Status colors always include text.

Use fine grids, clipped corners, numbering, and subtle panel lines. Avoid heavy textures, continuous animation, parallax, excessive shadows, or decorative typography in guide prose. The first release has no dark-theme implementation or requirement.

At narrow widths use a keyboard-accessible collapsed menu, one-column cards, reduced ornament, safe wrapping, and no page-level horizontal overflow. Medium widths may use two-column cards. Wide layouts constrain the reading measure and may show a guide contents sidebar. Tables need captions, header cells, and responsive overflow handling.

## 10. SEO, citations, and accessibility

Every indexable page has a unique title/description, one H1, logical headings, `lang="en"`, crawlable internal links, Open Graph metadata, and conditional canonical data based on a real configured origin. Use `WebSite`, `BreadcrumbList`, and consistent `Article` structured data only where the visible page supports it. Do not emit ratings, invented dates, authority claims, or unsupported FAQ markup.

Important factual statements use numbered references to exact source entries. Broad Steam Community, Discussions, Guides, Reddit, and channel landing pages retain their source type and discovery purpose but do not make a claim Verified. External links use meaningful labels and safe attributes.

Accessibility requirements include semantic landmarks, skip link, visible focus, keyboard navigation, adequate contrast, textual statuses, correct image alternatives, and reduced-motion support.

## 11. Failure handling

Build validation detects missing metadata, duplicate routes, unknown categories, broken internal or related links, malformed source records, unresolved source references, and unexpected Verified status. Unknown routes show the custom 404. Missing images and unavailable video embeds render no empty frame. Unsupported factual content remains omitted or explicitly `Needs Verification`.

## 12. Five acceptance stages

### Stage 1: Homepage and shared shell

- Import/audit approved Level 1–3 inputs first.
- Implement the final four-category navigation and shared shell.
- Include every required homepage section using the approved SEO description and independent identity.
- Exclude fixed dynamic metrics, dead policy links, dark-theme UI, and unsupported confirmed facts.
- Review desktop and mobile homepage locally before continuing.

### Stage 2: Category pages

- Generate exactly Guides, Farming, Characters & Items, and Map & Quests.
- Validate memberships of 3, 6, 5, and 2 guides.
- Check breadcrumbs, reading sequence, cards, and cross-category links.

### Stage 3: Guide content

- Generate the exact sixteen final guide names and URLs.
- Preserve Level 2 priority order and source-use mappings.
- Start every guide as `Needs Verification`.
- Produce readable English content only to the depth supported by supplied evidence.

### Stage 4: SEO and citations

- Audit unique metadata, base-safe routes, conditional canonicals, sitemap behavior, breadcrumbs, and structured data.
- Resolve every inline source marker to an exact source entry.
- Ensure broad entry pages and player discussions are not presented as Verified official facts.

### Stage 5: Responsive and build verification

- Run content/type checks, tests, static build, local preview, internal-link validation, and manual page review.
- Check all 22 output pages: Home, four categories, sixteen guides, and 404.
- Verify mobile, tablet, laptop, and wide-screen layouts.
- Document installation, development, verification, content editing, source maintenance, and future static-host configuration in README.
- Stop for local acceptance before any Git or deployment operation.

## 13. Explicit exclusions

The first release excludes search, backend services, databases, CMS, accounts, comments, community contribution claims, dark mode, redemption-code content, unapproved images, copied competitor content, fixed dynamic Steam metrics, fake policy links, Git operations, GitHub connection, pushing, and deployment.

## 14. Implementation gate

Before Astro scaffolding:

1. Update and approve the research audit against this final matrix.
2. Accept that all sixteen pages begin as `Needs Verification`.
3. Separately authorize project initialization and dependency installation.
4. Confirm a working Node/npm environment.

No factual gap may be silently filled while satisfying this gate.
