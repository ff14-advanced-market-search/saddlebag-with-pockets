import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'
import type { ErrorBoundaryComponent } from '@remix-run/cloudflare'

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBounds error={error} />
)

const searchParams = {
  marketView:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=1&averagePrice=10000&filters=0&sortBy=marketValue',
  percentChange:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=1&averagePrice=1000000&filters=0&sortBy=percentChange',
  megaValue:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=1&averagePrice=1000000&filters=0&sortBy=marketValue',
  lastHour:
    '/ffxiv/marketshare?timePeriod=1&salesAmount=1&averagePrice=10&filters=0&sortBy=marketValue',
  mostPurchases:
    '/ffxiv/marketshare?timePeriod=24&salesAmount=40&averagePrice=10&filters=0&sortBy=purchaseAmount',
  mostQuantity:
    '/ffxiv/marketshare?timePeriod=24&salesAmount=40&averagePrice=10&filters=0&sortBy=quantitySold',
  bestFurniture:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=2&averagePrice=10000&filters=56,65,66,67,68,69,70,71,72,81,82&sortBy=marketValue',
  bestConsumables:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=2&averagePrice=10000&filters=75,80,90&sortBy=marketValue',
  bestVendorItems:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=2&averagePrice=10000&filters=-1&sortBy=marketValue',
  bestGear:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=2&averagePrice=10000&filters=1,2,3,4&sortBy=marketValue'
}
const recommendedQueries = [
  {
    name: 'Weekly Total Market View',
    description:
      'See an general overview of your servers market by revenue earned.',
    Icon: DocumentSearchIcon,
    href: searchParams.marketView
  },
  {
    name: 'Highet Price Increases',
    description:
      'Find the best selling items that are out of stock or have had massive price increases!',
    Icon: DocumentSearchIcon,
    href: searchParams.percentChange
  },
  {
    name: 'Weekly Mega Value Marketshare',
    description:
      'Find the ultra high value items with the most revenue based on the last 7 days sales.',
    Icon: DocumentSearchIcon,
    href: searchParams.megaValue
  },
  {
    name: 'Best Selling Items (last hour)',
    description: 'See the items with the top revenue from the last hour.',
    Icon: DocumentSearchIcon,
    href: searchParams.lastHour
  },
  {
    name: 'Fastest Selling Items (daily)',
    description: 'See the fastest selling items from the last 24 hours.',
    Icon: DocumentSearchIcon,
    href: searchParams.mostPurchases
  },
  {
    name: 'Most Quantity Purchased (daily).',
    description:
      'See the items that sell in bulk with the most quantity sold in the last 24 hours.',
    Icon: DocumentSearchIcon,
    href: searchParams.mostQuantity
  },
  {
    name: 'Best selling funiture.',
    description: 'See the best selling furniture items from the last week.',
    Icon: DocumentSearchIcon,
    href: searchParams.bestFurniture
  },
  {
    name: 'Best selling consumables.',
    description: 'See the best selling consumable items from the last week.',
    Icon: DocumentSearchIcon,
    href: searchParams.bestConsumables
  },
  {
    name: 'Best selling vendor items.',
    description: 'See the best selling vendor items from the last week.',
    Icon: DocumentSearchIcon,
    href: searchParams.bestVendorItems
  },
  {
    name: 'Best selling gear, weapons, armor and glamors .',
    description:
      'See the best selling gear, weapons, armor and glamors from the last week.',
    Icon: DocumentSearchIcon,
    href: searchParams.bestGear
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
