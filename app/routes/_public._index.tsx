import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

const recommendedQueries = [
  {
    name: 'Final Fantasy XIV',
    description:
      'Tools for Cross-Server reselling, Market Overviews, Crafting Profit Simulation, Shopping Lists, Alerts and More!',
    href: '/queries'
  },
  {
    name: 'World of Warcraft',
    description:
      'Tools for Cross-Realm Trading, Market Overviews, Shortage Finders, and our Best Deals Search!',
    href: '/wow'
  },
  // {
  //   name: 'Blogs',
  //   description: 'See our guides and blog posts.',
  //   href: '/blog'
  // },
  {
    name: 'Patreon',
    description:
      'Join our Patreon Supporters to access the best tools we have!',
    href: 'https://www.patreon.com/indopan',
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
              Saddlebag Exchange
            </h1>
            <p className="text-md text-slate-700 dark:text-gray-300">
              Welcome to the Saddlebag Exchange. Find helpful tools to get ahead
              in your favourite MMO's.
            </p>
            <div
              className={`not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2`}>
              {recommendedQueries.map((query) => {
                return <TileLink key={query.name} {...query} />
              })}
            </div>
            <div id="ezoic-pub-ad-placeholder-116" />
          </div>
        </div>
      </main>
    </>
  )
}
