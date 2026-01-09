import { DocumentSearchIcon } from '@heroicons/react/outline'
import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW Ultra Rare Item Search Recommendations',
    description:
      'Recommended searches for ultra rare items in World of Warcraft. Find weapons, armor, quest items, and recipes with the best profit potential.',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/wow/ultrarare/recommended'
      }
    ]
  }
}

// Define the base URL for the search parameters
const BASE_URL = '/wow/ultrarare'

// Search parameters for recommended queries
const searchParams = {
  weapons: `${BASE_URL}?item_class=2`,
  armor: `${BASE_URL}?item_class=4`,
  questItem: `${BASE_URL}?item_class=12`,
  recipe: `${BASE_URL}?item_class=9&min_quality=1`
}

// Recommended queries for ultra rare item searches
const recommendedQueries = [
  {
    name: 'Weapons',
    description:
      'Search for ultra rare transmog weapons across all weapon types. Double check wowhead for other items with similar models.',
    Icon: DocumentSearchIcon,
    href: searchParams.weapons
  },
  {
    name: 'Armor',
    description:
      'Discover ultra rare transmog armor pieces. Double check wowhead for other items with similar models.',
    Icon: DocumentSearchIcon,
    href: searchParams.armor
  },
  {
    name: 'Quest Items',
    description:
      'Search for rare quest items that are hard to find. Often desired by Achievement Hunters and Collectors! Double check wowhead to make sure the quest line still exists in game and if its used for achievements.  Junk quality are often deprecated and not worth anything.',
    Icon: DocumentSearchIcon,
    href: searchParams.questItem
  },
  {
    name: 'Recipes (Common Quality and better)',
    description:
      'Find ultra rare recipes with Common quality and better. Often desired by Achievement Hunters and Collectors! Double check all these on wowhead to confirm they were not turned into trainers recipes. Junk quality are often deprecated and not worth anything.',
    Icon: DocumentSearchIcon,
    href: searchParams.recipe
  }
]

export default function Index() {
  return (
    <>
      <main className="flex-1">
        <Banner />
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-blue-900 dark:text-gray-100">
              Recommended Ultra Rare Item Searches
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Choose from our curated list of premade searches to find the most
              valuable ultra rare items in World of Warcraft.
            </p>
            <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {recommendedQueries.map((query) => (
                <TileLink key={query.name} {...query} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
