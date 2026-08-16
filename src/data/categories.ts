import matrix from './site-matrix.json';

export type CategoryId = 'guides' | 'farming' | 'characters-items' | 'map-quests';

const categoryCopy: Record<CategoryId, { description: string; introduction: string; recommendedFirst: string }> = {
  guides: {
    description: 'Browse Doloc Town beginner guidance, progression walkthroughs, and practical tips in one evidence-aware index.',
    introduction: 'Use this section to find general orientation, a structured progression route, and focused tips. Each guide remains marked Needs Verification until its detailed claims are checked against exact sources.',
    recommendedFirst: 'beginner-guide',
  },
  farming: {
    description: 'Explore the Doloc Town farming index for crops, genes, ranching, fishing, and automation guide routes.',
    introduction: 'This section groups the submitted farming-related topics into one clear route through crop comparisons, the gene system, ranching, fishing, and automation. It is an index only and does not make unverified gameplay claims.',
    recommendedFirst: 'most-profitable-crops',
  },
  'characters-items': {
    description: 'Find Doloc Town NPC gift, recipe, and material guide routes in the Characters & Items index.',
    introduction: 'Use this section to reach the submitted character, recipe, and item-location topics. Detailed preferences, requirements, locations, and uses remain Needs Verification until the guide content is sourced.',
    recommendedFirst: 'recipes',
  },
  'map-quests': {
    description: 'Open the Doloc Town map and Wetlands Pipes guide routes from this exploration and quest index.',
    introduction: 'This section provides direct routes to the submitted map and Wetlands Pipes topics. Route details, puzzle steps, and location claims are intentionally deferred until exact evidence is reviewed.',
    recommendedFirst: 'map',
  },
};

export const categories = matrix.categories.map((category) => {
  const id = category.id as CategoryId;
  return {
    ...category,
    ...categoryCopy[id],
    id,
    path: `/${category.slug}/`,
    guides: category.guides.map((guide) => ({ ...guide, path: `/${category.slug}/${guide.slug}/` })),
  };
});

export type Category = (typeof categories)[number];
