import type { MetaFunction, LinksFunction } from '@remix-run/cloudflare'
import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Best Deals Recommendations',
    description: 'FFXIV Amazing Market Board Deals'
  }
}

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/ffxiv/best-deals/recommended'
  }
]

const searchParams = {
  defaultDeals:
    '/ffxiv/best-deals?filters=0&hq_only=false&discount=70&medianPrice=50000&salesAmount=20&maxBuyPrice=20000',
  ultraCheapDeals:
    '/ffxiv/best-deals?filters=0&hq_only=false&discount=99&medianPrice=100&salesAmount=1&maxBuyPrice=1000',
  fastSellingItems:
    '/ffxiv/best-deals?filters=0&hq_only=false&discount=50&medianPrice=1&salesAmount=100&maxBuyPrice=10000',
  foodAndPotions:
    '/ffxiv/best-deals?filters=5,46&hq_only=true&discount=50&medianPrice=1000&salesAmount=50&maxBuyPrice=10000',
  furnitureAndGlamour:
    '/ffxiv/best-deals?filters=56,65,66,67,68,69,70,71,72,81,82&hq_only=false&discount=50&medianPrice=50000&salesAmount=5&maxBuyPrice=100000',
  gearAndWeapons:
    '/ffxiv/best-deals?filters=1,2,3,4&hq_only=true&discount=50&medianPrice=75000&salesAmount=10&maxBuyPrice=200000',
  crafterGathererGear:
    '/ffxiv/best-deals?filters=1,2,3,4&hq_only=true&discount=50&medianPrice=50000&salesAmount=5&maxBuyPrice=100000',
  housing:
    '/ffxiv/best-deals?filters=65,66,67,68,69,70,71,72&hq_only=false&discount=50&medianPrice=10000&salesAmount=2&maxBuyPrice=50000',
  minions:
    '/ffxiv/best-deals?filters=81&hq_only=false&discount=50&medianPrice=10000&salesAmount=2&maxBuyPrice=100000',
  mounts:
    '/ffxiv/best-deals?filters=82&hq_only=false&discount=40&medianPrice=100000&salesAmount=1&maxBuyPrice=1000000',
  materials:
    '/ffxiv/best-deals?filters=6,7&hq_only=false&discount=50&medianPrice=100&salesAmount=50&maxBuyPrice=10000'
}

const recommendedQueries = [
  {
    name: 'Default Deals',
    description: 'Default search for profitable items across all categories.',
    Icon: DocumentSearchIcon,
    href: searchParams.defaultDeals
  },
  {
    name: 'Ultra Cheap Deals (Beginner Friendly)',
    description: 'Find items with massive discounts (99%+) for quick profits.',
    Icon: DocumentSearchIcon,
    href: searchParams.ultraCheapDeals
  },
  {
    name: 'Fast Selling Items',
    description: 'Items that sell quickly with good profit margins.',
    Icon: DocumentSearchIcon,
    href: searchParams.fastSellingItems
  },
  {
    name: 'Food & Potions',
    description: 'Find deals on consumables like food and potions.',
    Icon: DocumentSearchIcon,
    href: searchParams.foodAndPotions
  },
  {
    name: 'Furniture & Glamour',
    description: 'Housing items and glamour pieces at a discount.',
    Icon: DocumentSearchIcon,
    href: searchParams.furnitureAndGlamour
  },
  {
    name: 'Combat Gear & Weapons',
    description: 'Find deals on combat gear and weapons.',
    Icon: DocumentSearchIcon,
    href: searchParams.gearAndWeapons
  },
  {
    name: 'Crafter/Gatherer Gear',
    description: 'Discounted gear for crafters and gatherers.',
    Icon: DocumentSearchIcon,
    href: searchParams.crafterGathererGear
  },
  {
    name: 'Housing Items',
    description: 'All housing-related items at a discount.',
    Icon: DocumentSearchIcon,
    href: searchParams.housing
  },
  {
    name: 'Minions',
    description: 'Find deals on minions and pets.',
    Icon: DocumentSearchIcon,
    href: searchParams.minions
  },
  {
    name: 'Mounts',
    description: 'Discounted mounts of all types.',
    Icon: DocumentSearchIcon,
    href: searchParams.mounts
  },
  {
    name: 'Crafting Materials',
    description: 'Raw materials and crafting components at a discount.',
    Icon: DocumentSearchIcon,
    href: searchParams.materials
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
              Recommended FFXIV Best Deals Queries
            </h1>
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
