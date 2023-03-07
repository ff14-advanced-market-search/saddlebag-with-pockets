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
    name: 'Guides on how to use Saddlebag Exchange!',
    href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki',
    description: 'A link to all of our wiki guides on how to use the website.',
    Icon: DocumentSearchIcon,
    external: true
  },
  {
    name: 'Discord Undercut Alert Generator',
    description:
      'Undercut Alerts will notify you via discord direct message when you are undercut.',
    Icon: PencilAltIcon,
    href: '/undercut'
  },
  {
    name: 'Undercut Alerts Guide',
    href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version',
    description: 'A guide on how to setup and use Undercut Alerts.',
    Icon: DocumentSearchIcon,
    external: true
  },
  {
    name: 'Discord Price Discount Sniper and Price Spike Alert Generator',
    description:
      'Price Discount Sniper and Price Spike Alerts will notify you via discord direct message when items go above or below prices you set.',
    Icon: PencilAltIcon,
    href: '/price-sniper'
  },
  {
    name: 'Price Discount Sniper and Price Spike Alerts Guide',
    href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Price-Sniper-and-Item-Price-Alerts',
    description:
      'A guide on how to setup and use Price Discount Sniper and Price Spike Alerts.',
    Icon: DocumentSearchIcon,
    external: true
  },
  {
    name: 'Item History Statistics and Graphs',
    description:
      'Helps you find if an item is worth selling or not based on past sale history. Can tell you the best price to sell at, best time of day to sell, best stack size to sell at and more!',
    Icon: ChartSquareBarIcon,
    href: '/queries/item-history'
  },
  {
    name: 'Listings Comparison and Competition Metric',
    description:
      'Shows you how tough the undercutting competition is on specific items.',
    Icon: ChartSquareBarIcon,
    href: '/queries/listings'
  },
  {
    name: 'Export Trading Search',
    description:
      'Compare prices on items between servers to find the best server to sell your items on.',
    Icon: ChartSquareBarIcon,
    href: '/queries/world-comparison'
  },
  {
    name: 'Qualified Sale Leads',
    href: 'https://www.patreon.com/indopan',
    description:
      'Our ultimate secret sale leads (for patreons) that can earn you tens of millions of gil each day!',
    Icon: DocumentSearchIcon,
    external: true
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
