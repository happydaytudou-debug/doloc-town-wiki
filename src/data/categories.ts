import matrix from './site-matrix.json';

export type CategoryId = 'guides' | 'farming' | 'characters-items' | 'map-quests';

const categoryCopy: Record<CategoryId, { description: string; introduction: string; recommendedFirst: string }> = {
  guides: {
    description: 'Browse Doloc Town beginner guidance, progression walkthroughs, and practical tips in one evidence-aware index.',
    introduction: 'Use this section to find general orientation, a structured progression route, and focused tips. Source notes on each page explain where version-specific details may differ.',
    recommendedFirst: 'beginner-guide',
  },
  farming: {
    description: 'Explore the Doloc Town farming index for crops, genes, ranching, fishing, and automation guide routes.',
    introduction: 'This section brings crop comparisons, the gene system, ranching, fishing, and automation into one clear route. Check each guide’s source notes alongside the information shown in your game version.',
    recommendedFirst: 'most-profitable-crops',
  },
  'characters-items': {
    description: 'Find Doloc Town NPC gift, recipe, and material guide routes in the Characters & Items index.',
    introduction: 'Use this section to reach character, recipe, and item-location topics. Source notes make clear where exact preferences, requirements, locations, or uses are not stated.',
    recommendedFirst: 'recipes',
  },
  'map-quests': {
    description: 'Open the Doloc Town map and Wetlands Pipes guide routes from this exploration and quest index.',
    introduction: 'This section provides direct routes to the map and Wetlands Pipes topics, with version notes for route details, puzzle steps, and locations that should be checked in game.',
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
