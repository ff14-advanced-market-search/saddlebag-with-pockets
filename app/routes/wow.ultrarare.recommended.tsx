import { DocumentSearchIcon } from '@heroicons/react/outline'
import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: WoW Ultra Rare Item Search Recommendations' },
    {
      name: 'description',
      content:
        'Recommended searches for ultra rare items in World of Warcraft. Find weapons, armor, quest items, and recipes with the best profit potential.'
    },
    {
      name: 'canonical',
      content: 'https://saddlebagexchange.com/wow/ultrarare/recommended'
    }
  ]
}

// Define the base URL for the search parameters
const BASE_URL = '/wow/ultrarare'

// Search parameters for recommended queries
const searchParams = {
  weapons: `${BASE_URL}?item_class=2&max_quantity=10`,
  armor: `${BASE_URL}?item_class=4&max_quantity=10&item_subclass=-2`,
  mounts: `${BASE_URL}?item_class=15&item_subclass=5`,
  questItem: `${BASE_URL}?item_class=12&min_quality=1`,
  recipe: `${BASE_URL}?item_class=9&min_quality=1`,
  consumable: `${BASE_URL}?item_class=0&min_quality=1`,
  miscellaneous: `${BASE_URL}?item_class=15&min_quality=1`
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
    name: 'Mounts',
    description: 'Discover ultra rare mounts. All these are great!',
    Icon: DocumentSearchIcon,
    href: searchParams.mounts
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
  },
  {
    name: 'Consumables',
    description:
      'Search for ultra rare consumable items. Note: Most consumables might be worthless and not used for achievements. Double check wowhead to verify if items are still obtainable and useful.',
    Icon: DocumentSearchIcon,
    href: searchParams.consumable
  },
  {
    name: 'Miscellaneous',
    description:
      'Search for other rare miscellaneous items. Note: Double check pet items carefully - the item that makes a pet might be rare but the caged pet may not be. Verify with the shopping list or Undermine Exchange before investing.',
    Icon: DocumentSearchIcon,
    href: searchParams.miscellaneous
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
