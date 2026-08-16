import type { CollectionEntry } from 'astro:content';
import { categories } from '../data/categories';

export type GuideEntry = CollectionEntry<'guides'>;

export function getGuideById(entries: GuideEntry[], id: string) {
  return entries.find((entry) => entry.data.id === id);
}

export function getRelatedGuides(entries: GuideEntry[], entry: GuideEntry) {
  return entry.data.relatedGuides.map((id) => {
    if (id === entry.data.id) throw new Error(`Guide ${id} cannot relate to itself`);
    const related = getGuideById(entries, id);
    if (!related) throw new Error(`Unknown related guide: ${id}`);
    return related;
  });
}

export function getGuideNeighbors(entries: GuideEntry[], entry: GuideEntry) {
  const category = categories.find(({ id }) => id === entry.data.category);
  if (!category) throw new Error(`Unknown category: ${entry.data.category}`);
  const index = category.guides.findIndex(({ id }) => id === entry.data.id);
  if (index < 0) throw new Error(`Guide ${entry.data.id} is not assigned to ${category.id}`);
  return {
    previous: index > 0 ? getGuideById(entries, category.guides[index - 1].id) : undefined,
    next: index < category.guides.length - 1 ? getGuideById(entries, category.guides[index + 1].id) : undefined,
  };
}
