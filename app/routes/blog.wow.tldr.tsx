// root.tsx

import { MetaFunction, LinksFunction } from '@remix-run/node'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1',
  title: 'WoW TL;DR: How to Earn Gold with Cross-Realm Trading',
  description:
    'Learn quick and effective methods for earning gold through cross-realm trading in World of Warcraft.',
  customHeading: 'Quick Guide: Earning Gold with Cross-Realm Trading in WoW'
})

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/blog/wow/tldr'
  }
]

const HowToCrossServerTradeInWoW = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          How to Earn Gold with Cross-Realm Trading
        </h1>
        <p className="mt-2 text-gray-600">
          A comprehensive guide to maximize your gold in World of Warcraft
        </p>
      </header>

      <section className="mb-8">
        <div className="flex justify-center">
          <a
            href="https://www.youtube.com/watch?v=ZVcOFHonH10"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15l-5-5h10l-5 5z" />
            </svg>
            Watch Tutorial
          </a>
        </div>
      </section>

      <section className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          TL;DR: How to Make Gold with SaddlebagExchange.com Step by Step
        </h2>

        <p className="text-gray-700 mb-6">
          Here are some of the top ways to use Saddlebag for WoW, made simple
          for new users:
        </p>

        <ol className="list-decimal list-outside space-y-6 pl-8">
          {/* Step 1 */}
          <li>
            <h3 className="text-xl font-semibold text-gray-800">
              Find What to Buy
            </h3>
            <p className="text-gray-600">
              Use the marketshare searches or best deals to find good items to
              buy or craft (if you have professions):
            </p>
            <ul className="list-disc list-inside mt-2 ml-6 text-gray-600">
              <li>
                <a
                  href="https://saddlebagexchange.com/wow/best-deals/recommended"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Best Deals
                </a>
              </li>
              <li>
                <a
                  href="https://saddlebagexchange.com/wow/marketshare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Marketshare
                </a>
              </li>
              <li>
                <a
                  href="https://saddlebagexchange.com/wow/legacy-marketshare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Legacy Marketshare
                </a>
              </li>
              <li>
                <a
                  href="https://temp.saddlebagexchange.com/megaitemnames"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Mega Item Names
                </a>
              </li>
            </ul>
          </li>

          {/* Step 2 */}
          <li>
            <h3 className="text-xl font-semibold text-gray-800">Buy Low</h3>
            <p className="text-gray-600">
              Search for good deals on those items using the Azeroth Auction
              Assassin, shopping list, or best deals, then buy them (if not
              crafting):
            </p>
            <ul className="list-disc list-inside mt-2 ml-6 text-gray-600">
              <li>
                <a
                  href="https://saddlebagexchange.com/wow/best-deals/recommended"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Best Deals Recommended
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ff14-advanced-market-search/AzerothAuctionAssassin/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Azeroth Auction Assassin
                </a>
              </li>
              <li>
                <a
                  href="https://saddlebagexchange.com/wow/shopping-list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Shopping List
                </a>
              </li>
            </ul>
          </li>

          {/* Step 3 */}
          <li>
            <h3 className="text-xl font-semibold text-gray-800">Sell High</h3>
            <p className="text-gray-600">
              Use the export search to find the best realm with the highest
              population to sell any items you buy or craft.
            </p>
            <ul className="list-disc list-inside mt-2 ml-6 text-gray-600">
              <li>
                <a
                  href="https://saddlebagexchange.com/wow/export-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Export Search
                </a>
              </li>
            </ul>
          </li>

          {/* Step 4 */}
          <li>
            <h3 className="text-xl font-semibold text-gray-800">
              Check for Sales and Undercuts
            </h3>
            <p className="text-gray-600">
              Use the undercut addon/webpage to check on the items you have
              listed and track them on the Auction House (usually wait after you
              log back in or 1 hour after posting items so the API data from
              Blizzard updates):
            </p>
            <ul className="list-disc list-inside mt-2 ml-6 text-gray-600">
              <li>
                <a
                  href="https://www.curseforge.com/wow/addons/saddlebag-exchange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Saddlebag Exchange Addon
                </a>
              </li>
              <li>
                <a
                  href="https://saddlebagexchange.com/wow/region-undercut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Region Undercut
                </a>
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <footer className="mt-12 text-center text-gray-500">
        &copy; {new Date().getFullYear()} SaddlebagExchange. All rights
        reserved.
      </footer>
    </div>
  )
}

export default HowToCrossServerTradeInWoW
