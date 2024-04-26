import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

const recommendedQueries = [
  {
    name: 'TLDR: How to make gold in WoW with cross realm trading',
    description: 'test',
    Icon: DocumentSearchIcon,
    href: '/blog/wow/tldr'
  },
  // {
  //   name: 'Local Realm Shortage Finder',
  //   description:
  //     'Searches for items on your local server / realm that you can flip and take over the market!',
  //   Icon: DocumentSearchIcon,
  //   href: '/wow/shortages/single'
  // },
  // {
  //   name: 'Undercut Alerts Curseforge Addon',
  //   description: 'The addon for our Undercut Checks and Alerts!',
  //   Icon: DocumentSearchIcon,
  //   href: 'https://www.curseforge.com/wow/addons/saddlebag-exchange',
  //   external: true
  // },

  {
    name: 'How to Cross Server Trade in FFXIV',
    description: 'Watch a youtube video on how to tade between servers',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/HowtoCrossRealmTradeinFFXIV'
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
              Blog Bosts
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
