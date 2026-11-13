import { ClockIcon } from '@heroicons/react/24/outline'
import Banner from '~/components/Common/Banner'
import type { MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    {
      title:
        'Saddlebag Exchange: WoW Forever Auction House Prices and Gold making tools'
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'Tools for the WoW Forever auction house. Upload timers list every Alliance, Horde, and Neutral house. Your saved faction is used by later tools.'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/wow-forever'
    }
  ]
}

const recommendedQueries = [
  {
    name: 'Upload Timers',
    description:
      'See when Blizzard last updated each WoW Forever auction house, including single listings and commodities.',
    Icon: ClockIcon,
    href: '/wow-forever/upload-timers'
  }
]

export default function Index() {
  return (
    <>
      <main className="flex-1">
        <section className="relative bg-gray-900">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-50"
              src="/images/hero-bg.jpg"
              alt="Hero Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900 via-transparent to-amber-900 opacity-70"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-5xl font-extrabold text-white">
              WoW Forever Auction House Tools
            </h1>
            <p className="mt-4 text-xl text-gray-200">
              Markets for World of Warcraft: Forever. Pick your region and
              faction. Neutral auction houses are handled by each tool.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="/wow-forever/upload-timers"
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-md shadow-md">
                Upload Timers
              </a>
            </div>
          </div>
        </section>

        <Banner />

        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold text-amber-600 dark:text-amber-400 uppercase">
                Tools & Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                WoW Forever market data
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedQueries.map((query) => (
                <a key={query.name} href={query.href} className="block">
                  <div className="h-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-amber-50 dark:hover:bg-amber-900/50">
                    <div className="flex items-center mb-4">
                      <query.Icon className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                      <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                        {query.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {query.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <p style={{ fontSize: '1px' }}>
          World of Warcraft Forever auction house, wow forever gold making, wow
          forever upload timers, wow forever ruleset, alliance horde neutral
          auction house
        </p>
      </main>
    </>
  )
}
