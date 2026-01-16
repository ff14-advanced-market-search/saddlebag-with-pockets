import { MagnifyingGlassIcon as DocumentSearchIcon } from '@heroicons/react/24/outline'
import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'
import { itemTypes } from '~/utils/GW2Filters/itemTypes'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: GW2 Marketshare Recommendations' },
    { name: 'description', content: 'Discover the best GW2 market opportunities with our curated collection of recommended marketshare queries. Find high-value items, fastest-selling goods, and more. Optimize your market strategy with data-driven insights for maximum profit.' },
    { tagName: 'link', rel: 'canonical', href: 'https://saddlebagexchange.com/gw2/marketshare/recommended' }
  ]
}

const searchParams = {
  value: '/gw2/marketshare?sort_by=value&desired_value=1000',
  sold: '/gw2/marketshare?sort_by=sold&desired_sales_per_day=5000',
  sellQuantityPercentChange:
    '/gw2/marketshare?sort_by=sellQuantityPercentChange&desired_sales_per_day=100',
  buyQuantityPercentChange:
    '/gw2/marketshare?sort_by=buyQuantityPercentChange&desired_sales_per_day=100',
  priceAverage: '/gw2/marketshare?sort_by=price_average&desired_avg_price=1000',
  pricePercentChange: '/gw2/marketshare?sort_by=pricePercentChange',
  soldPercentChange: '/gw2/marketshare?sort_by=soldPercentChange',
  valuePercentChange: '/gw2/marketshare?sort_by=valuePercentChange'
}

const recommendedQueries = [
  {
    name: 'Total Market View',
    description:
      'See a general overview of the biggest gold earners in the GW2 Trading Post by most revenue earned.',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: searchParams.value
  },
  {
    name: 'Fast Selling Items',
    description: 'Discover items that sell quickly (5000+ sales per day).',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: searchParams.sold
  },
  {
    name: 'Price Percent Change',
    description:
      'Find items with the largest price changes - great for identifying price spikes!',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: searchParams.pricePercentChange
  },
  {
    name: 'Expensive Items',
    description: 'Find items with high average prices (1000+ gold).',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: searchParams.priceAverage
  },
  {
    name: 'Sell Quantity Percent Change',
    description:
      'Find items with the largest changes in sell quantity - identify potential shortages!',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: searchParams.sellQuantityPercentChange
  },
  {
    name: 'Buy Quantity Percent Change',
    description:
      'See items with the largest changes in buy quantity - track demand shifts!',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: searchParams.buyQuantityPercentChange
  },
  {
    name: 'Sold Percent Change',
    description:
      'See items with the largest changes in sales volume over time.',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: searchParams.soldPercentChange
  },
  {
    name: 'Value Percent Change',
    description:
      'Identify items with the largest value changes - perfect for investment opportunities!',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: searchParams.valuePercentChange
  },
  ...itemTypes.map((itemType) => ({
    name: `${itemType.name} Items`,
    description: `Browse The most valuable ${itemType.name.toLowerCase()} items in the market.`,
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: `/gw2/marketshare?type=${itemType.value}&sort_by=value`
  }))
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
