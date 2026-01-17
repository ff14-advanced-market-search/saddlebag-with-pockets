import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import type { MetaFunction } from '@remix-run/cloudflare'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    {
      title:
        'Saddlebag Exchange: WoW World of Warcraft Auction House Prices and Gold making tools!'
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'Tools and Addons to make gold on the World of Warcraft Auction House Auctionhouse'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/wow'
    }
  ]
}

const recommendedQueries = [
  {
    name: 'Best Deals',
    description:
      'Find the best deals on your server and region wide with our Best Deals search!',
    Icon: DocumentSearchIcon,
    href: '/wow/best-deals/recommended'
  },
  {
    name: 'Ultra Fast Azeroth Auction Assassin Sniper',
    description:
      'Try our standalone Azeroth Auction Assassin Sniper, designed to snipe across all realms for the best deals seconds after the Blizzard AH API updates so you get there first!',
    Icon: DocumentSearchIcon,
    href: 'https://github.com/ff14-advanced-market-search/AzerothAuctionAssassin/blob/main/README.md',
    external: true
  },
  {
    name: 'Weekly Price Group Delta',
    description:
      'See the price and quantity changes for each item in each price group over years of data. Great for investing for patch and raid cycles!',
    Icon: DocumentSearchIcon,
    href: '/wow/weekly-price-group-delta-recommended'
  },
  {
    name: 'Upload Timers',
    description:
      'View the time each hour when the Blizzard API AH data updates. This shows which minute the Mega-Alerts will trigger on.',
    Icon: DocumentSearchIcon,
    href: '/wow/upload-timers'
  },
  {
    name: 'Shopping List',
    description: 'Search for the realms with the lowest price for an item.',
    Icon: DocumentSearchIcon,
    href: '/wow/shopping-list'
  },
  {
    name: 'Item Export Search',
    description:
      'Finds the best servers to sell your items on! This shows you where to sell the items you buy with Best Deals or Mega-Alerts.',
    Icon: DocumentSearchIcon,
    href: '/wow/export-search'
  },
  {
    name: 'Raid BOE Item Level Shopping List',
    description: 'Search for deals on raid BOE items with specific stats.',
    Icon: DocumentSearchIcon,
    href: '/wow/ilvl-shopping-list'
  },
  {
    name: 'Raid BOE Item Level Export Search',
    description:
      'Find the best servers to sell raid BOE items with specific stats and item levels.',
    Icon: DocumentSearchIcon,
    href: '/wow/ilvl-export-search'
  },
  {
    name: 'Ultra Rare',
    description:
      'Find rarest items in the game, guaranteed to have no competition on multiple realms!',
    Icon: DocumentSearchIcon,
    href: '/wow/ultrarare/recommended'
  },
  {
    name: 'Current Content Marketshare Overview',
    description:
      'Find out what items are actually selling and what are the best items to sell. Shows the top 200 items matching your search.',
    Icon: DocumentSearchIcon,
    href: '/wow/marketshare/recommended'
  },
  {
    name: 'Legacy Marketshare Overview',
    description:
      'Find out what Legacy items are actually selling and what are the best items to sell. Shows the top 200 items matching your search.',
    Icon: DocumentSearchIcon,
    href: '/wow/legacy-marketshare'
  },
  {
    name: 'Pet Marketshare Overview',
    description:
      'Find out what pets are actually selling and what are the best pets to sell.',
    Icon: DocumentSearchIcon,
    href: '/wow/pet-marketshare'
  },
  {
    name: 'Region Wide Undercut Checker',
    description:
      'Use our Addon with this search to check all of your undercuts on all your alts on one page!',
    Icon: DocumentSearchIcon,
    href: '/wow/region-undercut'
  },
  {
    name: 'Undercut Alerts Curseforge Addon',
    description: 'The addon for our Undercut Checks and Alerts!',
    Icon: DocumentSearchIcon,
    href: 'https://www.curseforge.com/wow/addons/saddlebag-exchange',
    external: true
  },
  {
    name: 'Server Transfer Trading Search',
    description:
      'Search for items that can be bought cheaply on a your home server and sold for a profit when transfering realms.',
    Icon: DocumentSearchIcon,
    href: '/wow/full-scan'
  },
  {
    name: 'Commodity Shortage Futures',
    description:
      'Find Commodity Shortages and Price Spikes BEFORE they happen and be there first!',
    Icon: DocumentSearchIcon,
    href: '/wow/shortage-predictor'
  },
  {
    name: 'Out of Stock',
    description: 'Find items that are out of stock on any realm!',
    Icon: DocumentSearchIcon,
    href: '/wow/out-of-stock'
  },
  {
    name: 'Big Goblin Tracker',
    description:
      'Find items controlled by big goblins who are oligopolists, these skyrocket in price whenever the big goblin takes a WoW break or lets their auctions expire.',
    Icon: DocumentSearchIcon,
    href: '/wow/quantity-manipulation'
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
    name: 'Price Sniper and Price Spike Alerts',
    description:
      'Alerts you when prices for items go above or below a price you pick! For one server and region wide commodities.',
    Icon: DocumentSearchIcon,
    href: '/wow/price-alert'
  },
  {
    name: 'Zygor Guides',
    description: 'Addons and Guides for WoW',
    Icon: DocumentSearchIcon,
    href: 'https://zygorguides.com/ref/indopan/',
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-transparent to-blue-900 opacity-70"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-5xl font-extrabold text-white">
              Azeroth Auction Assassin
            </h1>
            <p className="mt-4 text-xl text-gray-200">
              Lightning-fast cross-realm auction sniper - Get the best deals
              seconds after they appear!
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="https://github.com/ff14-advanced-market-search/AzerothAuctionAssassin/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-md">
                Download Now
              </a>
              <a
                href="https://github.com/ff14-advanced-market-search/AzerothAuctionAssassin/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md shadow-md">
                Learn More
              </a>
            </div>
          </div>
        </section>

        <Banner />

        {/* Tools Grid Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase">
                Tools & Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Everything You Need for Gold Making
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedQueries.map((query) => (
                <a
                  key={query.name}
                  href={query.href}
                  target={query.external ? '_blank' : '_self'}
                  rel={query.external ? 'noopener noreferrer' : undefined}
                  className="block">
                  <div className="h-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                    <div className="flex items-center mb-4">
                      <query.Icon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
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

        {/* Hidden SEO content - keep existing */}
        <p style={{ fontSize: '1px' }}>
          Google Keywords: wow classic hardcore addons, best sod addons wow, wow
          classic hardcore addon, wow sod addons, wow coordinates addon, wow
          hardcore addons, classic wow voice over addon, quest addon wow, wow
          3.3.5 addons, wow addon healer wow controller addon, wow leveling
          addon, wow quest addon, best healing addon wow, swing timer addon
          classic wow nate silver twitter, r/woweconomy, r/wow, wowhead sod,
          world of warcraft expansions in order, fyrakk assault bugged, world of
          warcraft hairstyles, wowhead dragonflight battle net login, wor craft,
          wow classic reddit, blizzard store, reddit classic wow, wow expansions
          in order, blizzard gear store, meme world of warcraft, r world, reddit
          wow classic blizzard.com link, battle.net account, lich king, wow
          expansions, wow+, wowhead wotlk, blizzard launcher, classic wow, south
          park world of warcraft, world of warcraft classic hardcore
        </p>
      </main>
    </>
  )
}
