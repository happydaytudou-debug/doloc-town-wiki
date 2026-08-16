import { withBase } from './paths';

export interface BreadcrumbItem { name: string; path: string }

export const buildCanonical = (site: URL, pathname: string) => new URL(withBase(pathname), site).href;

export const buildWebSiteJsonLd = (site: URL) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Doloc Town Wiki',
  url: buildCanonical(site, '/'),
});

export const buildBreadcrumbJsonLd = (site: URL, items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: buildCanonical(site, item.path),
  })),
});

export const buildCollectionJsonLd = (site: URL, pathname: string, name: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url: buildCanonical(site, pathname),
  isPartOf: { '@type': 'WebSite', name: 'Doloc Town Wiki', url: buildCanonical(site, '/') },
});

export const buildGuideJsonLd = (site: URL, pathname: string, headline: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline,
  description,
  url: buildCanonical(site, pathname),
  mainEntityOfPage: buildCanonical(site, pathname),
  isPartOf: { '@type': 'WebSite', name: 'Doloc Town Wiki', url: buildCanonical(site, '/') },
});
