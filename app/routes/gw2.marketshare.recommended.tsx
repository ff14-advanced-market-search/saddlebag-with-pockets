import { DocumentSearchIcon } from '@heroicons/react/outline'
import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: GW2 Marketshare Recommendations',
    description:
      'Discover the best GW2 market opportunities with our curated collection of recommended marketshare queries. Find high-value items, fastest-selling goods, and more. Optimize your market strategy with data-driven insights for maximum profit.',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/gw2/marketshare/recommended'
      }
    ]
  }
}

const searchParams = {
  defaultView: '/gw2/marketshare?sort_by=value',
  sold: '/gw2/marketshare?sort_by=sold',
  highValue: '/gw2/marketshare?desired_avg_price=1000&sort_by=value',
  fastSales: '/gw2/marketshare?desired_sales_per_day=1000&sort_by=sold',
  priceAverage: '/gw2/marketshare?sort_by=price_average',
  pricePercentChange: '/gw2/marketshare?sort_by=pricePercentChange',
  soldPercentChange: '/gw2/marketshare?sort_by=soldPercentChange',
  valuePercentChange: '/gw2/marketshare?sort_by=valuePercentChange'
}

const recommendedQueries = [
  {
    name: 'Total Market View',
    description:
      'See a general overview of the GW2 Trading Post by revenue earned.',
    Icon: DocumentSearchIcon,
    href: searchParams.defaultView
  },
  {
    name: 'Most Sold Items',
    description: 'Find the items with the highest sales volume.',
    Icon: DocumentSearchIcon,
    href: searchParams.sold
  },
  {
    name: 'High Value Items',
    description: 'Find items with high average prices (1000+ gold).',
    Icon: DocumentSearchIcon,
    href: searchParams.highValue
  },
  {
    name: 'Fast Selling Items',
    description: 'Discover items that sell quickly (1000+ sales per day).',
    Icon: DocumentSearchIcon,
    href: searchParams.fastSales
  },
  {
    name: 'Price Average',
    description: 'View items sorted by their average price.',
    Icon: DocumentSearchIcon,
    href: searchParams.priceAverage
  },
  {
    name: 'Price Percent Change',
    description:
      'Find items with the largest price changes - great for identifying spikes!',
    Icon: DocumentSearchIcon,
    href: searchParams.pricePercentChange
  },
  {
    name: 'Sold Percent Change',
    description:
      'See items with the largest changes in sales volume over time.',
    Icon: DocumentSearchIcon,
    href: searchParams.soldPercentChange
  },
  {
    name: 'Value Percent Change',
    description:
      'Identify items with the largest value changes - perfect for investment opportunities!',
    Icon: DocumentSearchIcon,
    href: searchParams.valuePercentChange
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
