import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'
import type { ErrorBoundaryComponent } from '@remix-run/cloudflare'

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBounds error={error} />
)

const searchParams = {
  megaValue:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=1&averagePrice=1000000&filters=0&sortBy=marketValue',
  marketView:
    '/ffxiv/marketshare?timePeriod=168&salesAmount=1&averagePrice=10000&filters=0&sortBy=marketValue',
  fastestSelling:
    '/ffxiv/marketshare?timePeriod=24&salesAmount=40&averagePrice=10&filters=0&sortBy=purchaseAmount',
  lastHour:
    '/ffxiv/marketshare?timePeriod=1&salesAmount=1&averagePrice=10&filters=0&sortBy=marketValue',
  mostSold:
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
    name: 'Weekly mega value marketshare',
    description: 'Find the best value items based on the last 7 days sales.',
    Icon: DocumentSearchIcon,
    href: searchParams.megaValue
  },
  {
    name: 'Weekly total market view',
    description: 'See an overview of the market.',
    Icon: DocumentSearchIcon,
    href: searchParams.megaValue
  },
  {
    name: 'Fastest Selling items (daily)',
    description: 'See the fastest selling items from the last 24 hours.',
    Icon: DocumentSearchIcon,
    href: searchParams.fastestSelling
  },
  {
    name: 'Best form last hour',
    description: 'See the best items sold in the last hour.',
    Icon: DocumentSearchIcon,
    href: searchParams.lastHour
  },
  {
    name: 'Most sold in last day.',
    description: 'See the items that have sold the most in the last day.',
    Icon: DocumentSearchIcon,
    href: searchParams.mostSold
  },
  {
    name: 'Best selling funiture.',
    description:
      'See the furniture items that are selling the most in the last week.',
    Icon: DocumentSearchIcon,
    href: searchParams.bestFurniture
  },
  {
    name: 'Best selling consumables.',
    description:
      'See the consumable items that are selling the most in the last week.',
    Icon: DocumentSearchIcon,
    href: searchParams.bestConsumables
  },
  {
    name: 'Best selling vendor items.',
    description:
      'See the vendor items that are selling the most in the last week.',
    Icon: DocumentSearchIcon,
    href: searchParams.bestConsumables
  },
  {
    name: 'Best selling gear, weapons, armor and glamors.',
    description:
      'See the gear, weapons, armor and glamors items that are selling the most in the last week.',
    Icon: DocumentSearchIcon,
    href: searchParams.bestConsumables
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
