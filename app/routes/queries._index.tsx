import {
  DocumentSearchIcon,
  ChartSquareBarIcon,
  PencilAltIcon
} from '@heroicons/react/outline'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Market Board Tools',
    description: 'Saddlebag Exchange: FFXIV MarketBoard Tools',
    links: [{ rel: 'canonical', href: 'https://saddlebagexchange.com/queries' }]
  }
}

const ffxivPages = [
  {
    name: 'Reselling Trade Searches',
    description:
      'Find items you can buy on other servers and resell on your own for a profit!',
    Icon: ChartSquareBarIcon,
    href: '/queries/recommended'
  },
  {
    name: 'Best Deals',
    href: '/ffxiv/best-deals/recommended',
    description: 'Find the best deals on items across all categories!',
    Icon: ExclamationCircleIcon
  },
  {
    name: 'Marketshare Overview',
    href: '/ffxiv/marketshare/queries',
    description:
      'Finds the best items to sell! Shows the top 200 best selling items on your home server.',
    Icon: ChartSquareBarIcon
  },
  {
    name: 'Craftsim Search',
    href: '/ffxiv/craftsim/queries',
    description: 'Finds the best items to craft!',
    Icon: ChartSquareBarIcon
  },
  {
    name: 'Shopping List Search',
    href: '/ffxiv/shopping-list',
    description:
      'Helps make a shopping list, telling you where to find crafting materials for the best prices!',
    Icon: PencilAltIcon
  },
  {
    name: 'Weekly Price Group Delta',
    href: '/ffxiv/weekly-price-group-delta',
    description: 'View weekly price changes for investment opportunities!',
    Icon: ChartSquareBarIcon
  },
  {
    name: 'Discord Undercut and Sale Alerts Generator',
    description:
      'Undercut Alerts will notify you via discord direct message when you are undercut. Sale Alerts will notify you via discord direct message when you have a sale.',
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
    name: 'Allagan Data Reports',
    href: '/allagan-data',
    description:
      'Use data from the Allagan Tools Plugin to create sale alerts and find valuable items in your bags you may have forgotten about.',
    Icon: ChartSquareBarIcon
  },
  {
    name: 'Orange and Purple Scrip to Gil',
    href: '/ffxiv/scrip-exchange',
    description:
      'Get the most Gil per Scrip! Find the best Orange or Purple Scrip to Gil conversion.',
    Icon: ChartSquareBarIcon
  },
  {
    name: 'Extended Sale History',
    description:
      'See extended sale history of last 1800 sales on any FFXIV item.',
    Icon: ChartSquareBarIcon,
    href: '/ffxiv/extended-history'
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
    name: 'Self Purchase Records',
    description:
      'See a record of your recent past purchases from our stored data. Note we only store the last 40 sales of any single item, some purchases may not appear.',
    Icon: ChartSquareBarIcon,
    href: '/ffxiv/self-purchase'
  },
  {
    name: 'Secret Sale Leads',
    href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Sale-Leads',
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
        {/* Hero Section */}
        <section className="relative bg-gray-900">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-50"
              src="/images/hero-bg.jpg"
              alt="Hero Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-transparent to-blue-900 opacity-70"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-5xl font-extrabold text-white">
              FFXIV Market Board Tools
            </h1>
            <p className="mt-4 text-xl text-gray-200">
              Maximize your gil earnings with our advanced Market Board tools
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="/queries/recommended"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-md shadow-md">
                Cross-Server Reselling
              </a>
              <a
                href="/ffxiv/marketshare/queries"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md shadow-md">
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
              <h2 className="text-base font-semibold text-purple-600 dark:text-purple-400 uppercase">
                Tools & Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Everything You Need for Gil Making
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ffxivPages.map((query) => (
                <a
                  key={query.name}
                  href={query.href}
                  target={query.external ? '_blank' : '_self'}
                  rel={query.external ? 'noopener noreferrer' : undefined}
                  className="block">
                  <div className="h-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/50">
                    <div className="flex items-center mb-4">
                      <query.Icon className="h-6 w-6 text-purple-500 dark:text-purple-400" />
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

        {/* Hidden SEO content stays the same */}
        <p style={{ fontSize: '1px' }}>
          google keywords: ffxiv glamour, reddit ffxiv, ff14 mog station, ffxiv
          classes, ffxiv modders, ffxiv modpacks, ffxiv download, ffxiv jobs,
          ffxiv mod, ffxiv mogstation, ffxiv fashion report, fashion report
          ffxiv, ffxiv forums, ffxiv housing, ffxiv maintenance, ffxiv market
          board, ffxiv patch notes, final fantasy 14 reddit, ffxiv fanfest,
          ffxiv msq list, ffxiv character search, ffxiv fafnir, universalis
          ffxiv, ffxiv maintenance jan 15, ffxiv relic weapons, r ffxiv, relic
          weapons ffxiv, character search ffxiv, FFXIVAH
        </p>
      </main>
    </>
  )
}
