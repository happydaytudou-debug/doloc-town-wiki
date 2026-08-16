import matrix from './site-matrix.json';
import { categories } from './categories';

export { categories };

export const popularIds = ['beginner-guide', 'tips-and-tricks', 'most-profitable-crops', 'gene-system', 'map', 'walkthrough'];
export const allGuides = matrix.categories.flatMap((category) => category.guides.map((guide) => ({ ...guide, category: category.id, path: `/${category.slug}/${guide.slug}/` })));
export const popularGuides = popularIds.map((id) => allGuides.find((guide) => guide.id === id)!);
