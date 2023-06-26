import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

const recommendedQueries = [
  {
    name: 'Alpha Build Cross Server Trade Tools',
    description:
      'Check out the latest and greatest Alpha versions of our server to server trade tools just in time for 10.1.5 cross realm trading!',
    Icon: DocumentSearchIcon,
    href: 'https://temp.saddlebagexchange.com/',
    external: true
  },
  {
    name: 'Dragonflight Marketshare Overview',
    description:
      'Find out what Dragonflight items are actually selling and what are the best items to sell. Shows the top 200 items matching your search.',
    Icon: DocumentSearchIcon,
    href: '/wow/marketshare'
  },
  {
    name: 'Dragonflight Commodity Shortage Futures',
    description:
      'Find Commodity Shortages and Price Spikes BEFORE they happen and be there first!',
    Icon: DocumentSearchIcon,
    href: '/wow/shortage-predictor'
  },
  {
    name: 'Legacy Marketshare Overview',
    description:
      'Find out what Legacy items are actually selling and what are the best items to sell. Shows the top 200 items matching your search.',
    Icon: DocumentSearchIcon,
    href: '/wow/legacy-marketshare'
  },
  {
    name: 'Undercut Alerts Curseforge Addon',
    description: 'The addon for our Undercut Alerts!',
    Icon: DocumentSearchIcon,
    href: 'https://www.curseforge.com/wow/addons/saddlebag-exchange',
    external: true
  },
  {
    name: 'Price Sniper and Price Spike Alerts',
    description:
      'Alerts you when prices for items go above or below a price you pick!',
    Icon: DocumentSearchIcon,
    href: '/wow/price-alert'
  },
  {
    name: 'Local Realm Shortage Finder',
    description:
      'Searches for items on your local server / realm that you can flip and take over the market!',
    Icon: DocumentSearchIcon,
    href: '/wow/shortages/single'
  },
  {
    name: 'Commodity Shortage Finder',
    description:
      'Searches for region wide commodities that you can flip and take over the market!',
    Icon: DocumentSearchIcon,
    href: '/wow/shortages/commodities'
  },
  {
    name: 'Server Transfer Trading Search',
    description:
      'Search for items that can be bought cheaply on a your home server and sold for a profit when transfering realms.',
    Icon: DocumentSearchIcon,
    href: '/wow/full-scan'
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
              World of Warcraft Queries
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
