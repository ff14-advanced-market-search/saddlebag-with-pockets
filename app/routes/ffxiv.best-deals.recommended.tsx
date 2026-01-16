import type { MetaFunction } from '@remix-run/cloudflare'
import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { viewport: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: FFXIV Best Deals Recommendations' },
    { name: 'description', content: 'FFXIV Amazing Market Board Deals' },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/ffxiv/best-deals/recommended'
    }
  ]
}

const searchParams = {
  ultraCheapDealsHQ:
    '/ffxiv/best-deals?filters=0&hq_only=true&discount=95&medianPrice=1000&salesAmount=25&maxBuyPrice=10000',
  ultraCheapDealsNQ:
    '/ffxiv/best-deals?filters=0&hq_only=false&discount=99&medianPrice=100&salesAmount=5&maxBuyPrice=10000',
  fastSellingItemsHQ:
    '/ffxiv/best-deals?filters=0&hq_only=true&discount=50&medianPrice=100&salesAmount=1000&maxBuyPrice=10000',
  fastSellingItemsNQ:
    '/ffxiv/best-deals?filters=0&hq_only=false&discount=50&medianPrice=100&salesAmount=1000&maxBuyPrice=10000',
  housing:
    '/ffxiv/best-deals?filters=65,66,67,68,69,70,71,72&hq_only=false&discount=50&medianPrice=10000&salesAmount=200&maxBuyPrice=50000',
  collectables:
    '/ffxiv/best-deals?filters=75,80,90&hq_only=false&discount=50&medianPrice=10000&salesAmount=200&maxBuyPrice=100000',
  foodAndPotions:
    '/ffxiv/best-deals?filters=5,43,44,45,46&hq_only=true&discount=50&medianPrice=1000&salesAmount=1000&maxBuyPrice=10000',
  gearAndWeapons:
    '/ffxiv/best-deals?filters=1,2,3,4&hq_only=true&discount=50&medianPrice=75000&salesAmount=500&maxBuyPrice=200000',
  materialsNQ:
    '/ffxiv/best-deals?filters=6&hq_only=false&discount=50&medianPrice=100&salesAmount=1000&maxBuyPrice=10000',
  materialsHQ:
    '/ffxiv/best-deals?filters=6&hq_only=true&discount=50&medianPrice=100&salesAmount=1000&maxBuyPrice=10000',
  megaValueNQ:
    '/ffxiv/best-deals?filters=6,7&hq_only=false&discount=50&medianPrice=300000&salesAmount=2&maxBuyPrice=1000000',
  megaValueHQ:
    '/ffxiv/best-deals?filters=0&hq_only=true&discount=50&medianPrice=300000&salesAmount=2&maxBuyPrice=1000000'
}

const recommendedQueries = [
  {
    name: 'HQ Ultra Cheap Deals (Beginner Friendly)',
    description:
      'Find HQ items with massive discounts (95%+) for quick profits.',
    Icon: DocumentSearchIcon,
    href: searchParams.ultraCheapDealsHQ
  },
  {
    name: 'NQ Ultra Cheap Deals (Beginner Friendly)',
    description:
      'Find NQ items with massive discounts (99%+) for quick profits.',
    Icon: DocumentSearchIcon,
    href: searchParams.ultraCheapDealsNQ
  },
  {
    name: 'HQ Fast Selling Items',
    description: 'HQ Items that sell quickly with good profit margins.',
    Icon: DocumentSearchIcon,
    href: searchParams.fastSellingItemsHQ
  },
  {
    name: 'NQ Fast Selling Items',
    description: 'NQ Items that sell quickly with good profit margins.',
    Icon: DocumentSearchIcon,
    href: searchParams.fastSellingItemsNQ
  },
  {
    name: 'Furnishing Items',
    description: 'All housing-related items at a discount.',
    Icon: DocumentSearchIcon,
    href: searchParams.housing
  },
  {
    name: 'Consumable Collectables: Mounts, Minions, etc',
    description: 'Find deals on Mounts, Minions, etc.',
    Icon: DocumentSearchIcon,
    href: searchParams.collectables
  },
  {
    name: 'Food & Potions',
    description: 'Find deals on consumables like food and potions.',
    Icon: DocumentSearchIcon,
    href: searchParams.foodAndPotions
  },
  {
    name: 'Combat Gear & Weapons',
    description: 'Find deals on combat gear and weapons.',
    Icon: DocumentSearchIcon,
    href: searchParams.gearAndWeapons
  },
  {
    name: 'NQ Crafting Materials',
    description: 'NQ Raw materials and crafting components at a discount.',
    Icon: DocumentSearchIcon,
    href: searchParams.materialsNQ
  },
  {
    name: 'HQ Crafting Materials',
    description: 'HQ Raw materials and crafting components at a discount.',
    Icon: DocumentSearchIcon,
    href: searchParams.materialsHQ
  },
  {
    name: 'Mega Value NQ',
    description: 'Find NQ items with a mega value at a discount.',
    Icon: DocumentSearchIcon,
    href: searchParams.megaValueNQ
  },
  {
    name: 'Mega Value HQ',
    description: 'Find HQ items with a mega value at a discount.',
    Icon: DocumentSearchIcon,
    href: searchParams.megaValueHQ
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
