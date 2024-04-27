import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

const recommendedQueries = [
  {
    name: 'TLDR: How to make gold in WoW with cross realm trading',
    description: 'Easy 4 step method to making gold.',
    Icon: DocumentSearchIcon,
    href: '/blog/wow/tldr'
  },
  {
    name: 'How to Cross Server Trade in FFXIV',
    description: 'Watch a youtube video on how to tade between servers',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/HowtoCrossRealmTradeinFFXIV'
  },
  {
    name: 'How to use ffxiv marketshare',
    description: 'how to marketshare',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/howtomarketshare'
  },
  {
    name: 'How to use ffxiv reselling',
    description: 'how to reselling',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/howtoresell'
  },
  {
    name: 'How to use wow commodity shortage',
    description: 'how to wow commodity shortage',
    Icon: DocumentSearchIcon,
    href: '/blog/wow/howtocommodityshortage'
  },
  {
    name: 'Chatgpt bs ffxiv post 1',
    description: 'Chatgpt bs ffxiv post 1',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/bs1'
  },
  {
    name: 'Our first wow cross realm update',
    description: 'Launch of cross realm trading tools',
    Icon: DocumentSearchIcon,
    href: '/blog/wow/crossrealm1'
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
              Shit blog post so google with index us, the good guides are on github
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
