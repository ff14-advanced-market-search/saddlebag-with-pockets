import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'WoW Cross Realm Trading Announcement',
    description:
      'Stay updated with the latest announcement regarding cross-realm trading in World of Warcraft.',
    customHeading: 'Breaking News: WoW Cross Realm Trading Announcement',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/blog/wow/crossrealm1'
      }
    ]
  }
}

const HowtoCrossServerTradeinFFXIV = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <Banner />

      <main className="bg-white shadow-md rounded-lg p-8">
        <div className="prose prose-lg max-w-none">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              Breaking News: WoW Cross Realm Trading Announcement
            </h1>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-red-800 font-medium">
                🚨 Major Update: Cross-realm trading is now available in World
                of Warcraft!
              </p>
            </div>
          </header>

          <section className="mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-lg leading-relaxed">
                At Saddlebag Exchange we have been developing AH trading
                searches throughout dragonflight and now with the announcement
                that marketable items can be traded across server I think these
                searches are going to be very useful.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Featured Trading Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold mb-3 text-green-800">
                  Cross-Server Trading Search
                </h3>
                <p className="text-green-700 mb-3">
                  <a
                    href="https://saddlebagexchange.com/wow/full-scan"
                    className="text-blue-600 hover:text-blue-800 underline">
                    For example here's a search that shows you the best
                    dragonflight items to buy on one server to sell on another.
                  </a>
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold mb-3 text-purple-800">
                  Ultra Fast API Sniper
                </h3>
                <p className="text-purple-700">
                  <a
                    href="https://github.com/ff14-advanced-market-search/mega-alerts"
                    className="text-blue-600 hover:text-blue-800 underline">
                    We also have an Ultra Fast API based sniper that can find
                    deals to snipe across all realms mere seconds after the
                    blizzard ah api data updates!
                  </a>{' '}
                  Which will be perfect now that you can instantly move gold to
                  whatever realm potential snipes are in!
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
              <p className="text-yellow-800 mb-4">
                I feel the <strong>Region Wide Undercut Check</strong> is going
                to be especially useful for managing many alts!
              </p>
              <p className="text-yellow-800">
                We are currently looking for some players to help me test it and
                get it ready for the new patch.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Complete Tool Suite
            </h2>
            <p className="text-lg mb-6">My current set of tools include:</p>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  📊 Market Analysis Tools
                </h3>
                <p className="mb-3">
                  An{' '}
                  <a
                    href="https://saddlebagexchange.com/wow/pet-marketshare"
                    className="text-blue-600 hover:text-blue-800 underline">
                    "Estimated Pet Marketshare"
                  </a>{' '}
                  that lets you view all TSM sale rates in one page, to find
                  fast selling pets to trade. We already have marketshare
                  searches that use TSM sale data to find{' '}
                  <a
                    href="https://saddlebagexchange.com/wow/marketshare"
                    className="text-blue-600 hover:text-blue-800 underline">
                    Dragonflight Items
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://saddlebagexchange.com/wow/legacy-marketshare"
                    className="text-blue-600 hover:text-blue-800 underline">
                    Legacy Items
                  </a>{' '}
                  to sell.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-green-800">
                  🛒 Shopping & Buying Tools
                </h3>
                <p>
                  A{' '}
                  <a
                    href="https://saddlebagexchange.com/wow/shopping-list"
                    className="text-blue-600 hover:text-blue-800 underline">
                    "Shopping List Search"
                  </a>{' '}
                  search for finding which servers have the best deals for
                  buying pets, ordering all server listing prices and quantities
                  of all realms together in one list by order of price.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-purple-800">
                  📤 Export & Selling Tools
                </h3>
                <p>
                  An{' '}
                  <a
                    href="https://saddlebagexchange.com/wow/export"
                    className="text-blue-600 hover:text-blue-800 underline">
                    "Export Search"
                  </a>{' '}
                  to finding the best servers to sell items on by highest ah
                  price and highest{' '}
                  <a
                    href="https://wowprogress.com/realms/rank/"
                    className="text-blue-600 hover:text-blue-800 underline">
                    WoW Progress
                  </a>{' '}
                  population size (letting you filter out low pop realms).
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-orange-800">
                  📥 Import & Consolidation Tools
                </h3>
                <p>
                  An{' '}
                  <a
                    href="https://saddlebagexchange.com/wow/export"
                    className="text-blue-600 hover:text-blue-800 underline">
                    "Import Search"
                  </a>{' '}
                  for finding the best items to buy on other servers and sell on
                  your home server, for when you need to move gold back to your
                  home server and consolidate to buy a wow token. Alternatively
                  if you sell on every realm this shows you the best items to
                  sell on each individual realm.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-red-800">
                  ⚡ Region Wide Undercut Check
                </h3>
                <p>
                  A{' '}
                  <a
                    href="https://saddlebagexchange.com/wow/region-undercut"
                    className="text-blue-600 hover:text-blue-800 underline">
                    <strong>Region Wide Undercut Check</strong>
                  </a>{' '}
                  made with our own{' '}
                  <a
                    href="https://www.curseforge.com/wow/addons/saddlebag-exchange"
                    className="text-blue-600 hover:text-blue-800 underline">
                    addon
                  </a>{' '}
                  that can check undercuts on all alts across all realms in one
                  page! It also lets you sort by item value if you don't want to
                  spend much time undercutting, but still want to keep tabs on
                  your most valuable auctions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-teal-800">
                  💰 Best Deals Finder
                </h3>
                <p>
                  This one looks for the best discounts anywhere{' '}
                  <a
                    href="https://saddlebagexchange.com/wow/best-deals"
                    className="text-blue-600 hover:text-blue-800 underline">
                    https://saddlebagexchange.com/wow/best-deals
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-blue-800 font-medium">
                All tools currently support pets and dragonflight items. Legacy
                item support is on its way!
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Join Our Development Community
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">
                If you are a React JS dev and want to help us build these tools
                into our open source project check us out on github and reach
                out to us on discord, we need all the help we can get to get
                these ready for july 11th!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets"
                  className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 text-center">
                  Join our open source Github projects
                </a>
                <a
                  href="https://discord.gg/Pbp5xhmBJ7"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center">
                  Join our discord for more feature updates
                </a>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Recent Updates
            </h2>
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <p className="text-green-800 font-semibold mb-4">UPDATES:</p>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>
                    Added in all dragonflight non commodities as a search option
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>
                    Added in market gap finders to the import / export
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>Added links to main website statistic searches</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>We now support legacy items</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default HowtoCrossServerTradeinFFXIV
