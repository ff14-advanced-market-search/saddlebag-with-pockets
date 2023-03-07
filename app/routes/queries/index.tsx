import {
  DocumentSearchIcon,
  ChartSquareBarIcon,
  PencilAltIcon
} from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

const ffxivPages = [
  {
    name: 'Reselling Trading Searches',
    description:
      'Find items you can buy on other servers and resell on your own for a profit!',
    Icon: ChartSquareBarIcon,
    href: '/queries/recommended'
  },
  {
    name: 'Discord Undercut Alert Generator',
    description: 'Undercut Alerts will notify you via discord direct message when you are undercut.',
    Icon: PencilAltIcon,
    href: '/undercut'
  },
  {
    name: 'Discord Price Sniper and Sale Alert Generator',
    description: 'Price Sniper and Sale Alerts will notify you via discord direct message when items go above or below prices you set.',
    Icon: PencilAltIcon,
    href: '/price-sniper'
  }
  {
    name: 'Item History Statistics and Graphs',
    description: 'Helps you find if an item is worth selling or not based on past sale history. Can tell you the best price to sell at, best time of day to sell, best stack size to sell at and more!',
    Icon: DocumentSearchIcon,
    href: '/queries/item-history'
  },
  {
    name: 'Listings Comparison and Competition Metric',
    description: 'Shows you how tough the undercutting competition is on specific items.',
    Icon: DocumentSearchIcon,
    href: '/queries/listings'
  },
  {
    name: 'Export Trading Search',
    description: 'Compare prices on items between servers to find the best server to sell your items on.',
    Icon: DocumentSearchIcon,
    href: '/queries/world-comparison'
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
              FFXIV Marketplace Tools
            </h1>
            <div
              className={`not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2`}>
              {ffxivPages.map((query) => {
                return <TileLink key={query.name} {...query} />
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
