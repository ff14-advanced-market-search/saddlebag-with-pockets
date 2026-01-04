import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import type { MetaFunction } from '@remix-run/cloudflare'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title:
      'Saddlebag Exchange: GW2 Guild Wars 2 Trading Post Prices and Gold making tools!',
    description:
      'Tools and resources to make gold on the Guild Wars 2 Trading Post',
    links: [{ rel: 'canonical', href: 'https://saddlebagexchange.com/gw2' }]
  }
}

const recommendedQueries: Array<{
  name: string
  description: string
  Icon: typeof DocumentSearchIcon
  href: string
  external?: boolean
}> = [
  {
    name: 'Marketshare Overview',
    description:
      'Find out what items are actually selling and what are the best items to sell. Shows the top items matching your search.',
    Icon: DocumentSearchIcon,
    href: '/gw2/marketshare/recommended'
  },
  {
    name: 'Weekly Price Group Delta',
    description:
      'See the price and quantity changes for each item in each price group over years of data. Great for investing for patch and raid cycles!',
    Icon: DocumentSearchIcon,
    href: '/gw2/weekly-price-group-delta-recommended'
  }
]

export default function Index() {
  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gray-900">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-50"
              src="/images/hero-bg.jpg"
              alt="Hero Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-transparent to-green-900 opacity-70"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-5xl font-extrabold text-white">
              Guild Wars 2 Trading Post Tools
            </h1>
            <p className="mt-4 text-xl text-gray-200">
              Maximize your gold earnings with our advanced Trading Post tools
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="/gw2/marketshare/recommended"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md shadow-md">
                Marketshare Overview
              </a>
            </div>
          </div>
        </section>

        <Banner />

        {/* Tools Grid Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold text-green-600 dark:text-green-400 uppercase">
                Tools & Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Everything You Need for Trading Post Gold Making
              </p>
            </div>

            {recommendedQueries.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedQueries.map((query) => (
                  <a
                    key={query.name}
                    href={query.href}
                    target={query.external ? '_blank' : '_self'}
                    rel={query.external ? 'noopener noreferrer' : undefined}
                    className="block">
                    <div className="h-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-green-50 dark:hover:bg-green-900/50">
                      <div className="flex items-center mb-4">
                        <query.Icon className="h-6 w-6 text-green-500 dark:text-green-400" />
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
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  More tools and features coming soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Hidden SEO content */}
        <p style={{ fontSize: '1px' }}>
          Google Keywords: guild wars 2, gw2, guild wars 2 trading post, gw2
          trading post, guild wars 2 gold making, gw2 gold making, guild wars 2
          market, gw2 market, guild wars 2 economy, gw2 economy, guild wars 2
          trading, gw2 trading, guild wars 2 items, gw2 items, guild wars 2
          prices, gw2 prices, trading post guide, gw2 gold guide, guild wars 2
          flipping, gw2 flipping, guild wars 2 investment, gw2 investment
        </p>
      </main>
    </>
  )
}
