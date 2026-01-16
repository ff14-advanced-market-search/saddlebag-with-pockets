import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: FFXIV Market Overview Recommendations' },
    { name: 'description', content: 'Discover the best FFXIV market opportunities with our curated collection of recommended marketshare queries. Find high-value items, fastest-selling goods, best raw materials, furniture, collectibles, and more. Optimize your market strategy with data-driven insights for maximum profit.' },
    { tagName: 'link', rel: 'canonical', href: 'https://saddlebagexchange.com/ffxiv/marketshare/queries' }
  ]
}

const searchParams = {
  marketView:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=3&averagePrice=10000&filters=0&sortBy=marketValue',
  percentChange:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=3&averagePrice=10000&filters=0&sortBy=percentChange',
  megaValue:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=1&averagePrice=1000000&filters=0&sortBy=marketValue',
  lastHour:
    '/ffxiv/marketshare?timePeriod=1&salesAmount=1&averagePrice=10&filters=0&sortBy=marketValue',
  mostPurchases:
    '/ffxiv/marketshare?timePeriod=24&salesAmount=35&averagePrice=10&filters=0&sortBy=purchaseAmount',
  mostQuantity:
    '/ffxiv/marketshare?timePeriod=24&salesAmount=35&averagePrice=10&filters=0&sortBy=quantitySold',
  bestFurniture:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=3&averagePrice=10000&filters=56,65,66,67,68,69,70,71,72,81,82&sortBy=marketValue',
  bestCollectible:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=3&averagePrice=10000&filters=75,80,90&sortBy=marketValue',
  bestConsumables:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=10&averagePrice=100&filters=5&sortBy=marketValue',
  bestVendorItems:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=3&averagePrice=10000&filters=-1&sortBy=marketValue',
  bestGear:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=3&averagePrice=10000&filters=1,2,3,4,-5&sortBy=marketValue',
  bestRawMats:
    '/ffxiv/marketshare?timePeriod=24&salesAmount=10&averagePrice=10&sortBy=marketValue&filters=6',
  bestGathering:
    '/ffxiv/marketshare?timePeriod=24&salesAmount=30&averagePrice=500&sortBy=marketValue&filters=47%2C48%2C49%2C50'
}
const recommendedQueries = [
  {
    name: 'Total Market View (Weekly)',
    description:
      'See an general overview of your servers market by revenue earned.',
    iconType: 'magnify',
    href: searchParams.marketView
  },
  {
    name: 'Highest Price Increases (Weekly)',
    description:
      'Find the best selling items that are out of stock or have had massive price increases!',
    iconType: 'magnify',
    href: searchParams.percentChange
  },
  {
    name: 'Eaving Tidemoores Best Raw Materials to Gather.',
    description:
      'See the best earning and fastest selling raw materials to gather. Made by Eaving Tidemoore.',
    iconType: 'magnify',
    href: searchParams.bestGathering
  },
  {
    name: 'Mega Value Marketshare (Weekly)',
    description:
      'Find the ultra high value items with the most revenue based on the last 7 days sales.',
    iconType: 'magnify',
    href: searchParams.megaValue
  },
  {
    name: 'Best Selling Items (Last Hour)',
    description: 'See the items with the top revenue from the last hour.',
    iconType: 'magnify',
    href: searchParams.lastHour
  },
  {
    name: 'Fastest Selling Items (Daily)',
    description: 'See the fastest selling items from the last 24 hours.',
    iconType: 'magnify',
    href: searchParams.mostPurchases
  },
  {
    name: 'Most Quantity Purchased (Daily).',
    description:
      'See the items that sell in bulk with the most quantity sold in the last 24 hours.',
    iconType: 'magnify',
    href: searchParams.mostQuantity
  },
  {
    name: 'Best Selling Furniture (Weekly).',
    description: 'See the best selling furniture items from the last week.',
    iconType: 'magnify',
    href: searchParams.bestFurniture
  },
  {
    name: 'Best Selling Collectible Items (Weekly).',
    description: 'See the best selling collectible items from the last week.',
    iconType: 'magnify',
    href: searchParams.bestCollectible
  },
  {
    name: 'Best Selling Consumable Items (Weekly).',
    description:
      'See the best selling food, seafood, tincture items from the last week.',
    iconType: 'magnify',
    href: searchParams.bestCollectible
  },
  {
    name: 'Best Selling Vendor Items (Weekly).',
    description:
      'See the best selling items you can buy from vendors from the last week.',
    iconType: 'magnify',
    href: searchParams.bestVendorItems
  },
  {
    name: 'Best Selling Gear, Weapons, Armor and Glamors (Weekly).',
    description:
      'See the best selling gear, weapons, armor and glamors from the last week. Excluding crafted raid gear.',
    iconType: 'magnify',
    href: searchParams.bestGear
  },
  {
    name: 'Best Raw Materials to Sell.',
    description:
      'See the best earning and fastest selling raw materials to sell.',
    iconType: 'magnify',
    href: searchParams.bestRawMats
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
              Recommended Marketshare Queries
            </h1>
            <div
              className={`not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2`}>
              {recommendedQueries.map((query) => {
                return <TileLink key={query.name} {...query} />
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
