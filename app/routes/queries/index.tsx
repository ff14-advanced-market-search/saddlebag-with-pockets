import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

const ffxivPages = [
  {
    name: 'Recommended Queries',
    description:
      'Find some useful marketplace searches to find items to sell on your world.',
    Icon: DocumentSearchIcon,
    href: '/queries/recommended'
  },
  {
    name: 'Item listing details search',
    description: 'Find recent listings for specific items.',
    Icon: DocumentSearchIcon,
    href: '/queries/listings'
  },
  {
    name: 'Item history search',
    description: 'Find historical data for specific items.',
    Icon: DocumentSearchIcon,
    href: '/queries/item-history'
  },
  {
    name: 'Item world comparison',
    description: 'Compare marketplace information for items between worlds.',
    Icon: DocumentSearchIcon,
    href: '/queries/world-comparison'
  },
  {
    name: 'Discord undercut alerts',
    description: 'Generate the input for our patreon undercut alerts.',
    Icon: DocumentSearchIcon,
    href: '/undercut'
  },
  {
    name: 'Discord price sniper alerts',
    description: 'Generate the input for our patreon price sniper alerts.',
    Icon: DocumentSearchIcon,
    href: '/price-sniper'
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
