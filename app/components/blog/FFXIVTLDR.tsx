import Banner from '~/components/Common/Banner'
import type { MetaFunction } from '@remix-run/cloudflare'

const linkClass = 'text-blue-500 hover:underline'

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    {
      title: 'TLDR: How to make gil in FFXIV with cross server trading'
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content: 'Easy 4 step method to making gil with cross server trading.'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/blog/ffxiv/tldr'
    }
  ]
}

const FFXIVTLDR = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <Banner />
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          💰 How to Earn Gil with Cross Server Trading 🚀
        </h1>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Simply buy low from a different server in your region, then resell for
          a higher price on your home server!
        </p>
      </header>

      <section className="mb-8 bg-white shadow-md rounded p-6 space-y-3">
        <p>
          <a
            href="https://www.youtube.com/watch?v=jVMxw5xRlQQ"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}>
            📺 Watch this tutorial to learn how to travel to other servers or
            datacenters
          </a>
        </p>
        <p>
          <a
            href="https://youtu.be/31ey9tEPyTQ?t=160"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}>
            📺 Watch this tutorial
          </a>{' '}
          if you&apos;re new to cross server trading. It covers how to move
          items from one realm to another for trading.
        </p>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📝 TL;DR: How to Make Gil with a 4-Step Process
        </h2>

        <p className="text-gray-700 mb-6">
          Here are some of the top ways to use Saddlebag for FFXIV, made simple
          for new users:
        </p>

        <ol className="list-decimal list-outside space-y-8 pl-8">
          <li>
            <h3 className="text-xl font-semibold text-gray-800">
              1. 📚 Learn What to Sell and How Much to Sell It For 🔍
            </h3>
            <p className="text-gray-600 mt-2">
              Use the reselling, marketshare, best deals or craftsim searches to
              find good items to sell or craft (if youre an omnicrafter) and
              determine the average price you can sell them for:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-600 space-y-1">
              <li>
                🔎{' '}
                <a
                  href="https://saddlebagexchange.com/queries/recommended"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Reselling Trade Search
                </a>
              </li>
              <li>
                🔥{' '}
                <a
                  href="https://saddlebagexchange.com/ffxiv/best-deals/recommended"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Best Deals
                </a>
              </li>
              <li>
                📊{' '}
                <a
                  href="https://saddlebagexchange.com/ffxiv/marketshare/queries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Marketshare
                </a>
              </li>
              <li>
                🛠️{' '}
                <a
                  href="https://saddlebagexchange.com/ffxiv/craftsim/queries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Craftsim Search
                </a>
              </li>
              <li>
                🪙{' '}
                <a
                  href="https://saddlebagexchange.com/ffxiv/scrip-exchange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Currency Conversion Search
                </a>
              </li>
              <li>
                🤫{' '}
                <a
                  href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Sale-Leads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Secret Sale Leads
                </a>
              </li>
            </ul>
          </li>

          <li>
            <h3 className="text-xl font-semibold text-gray-800">
              2. 🛒 Buy Low
            </h3>
            <p className="text-gray-600 mt-2">
              Search for good deals on those items using the{' '}
              <a
                href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Experimental-Discount-Price-Sniper"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}>
                Experimental Discount Sniper
              </a>
              , reselling search, shopping list, or best deals, then buy them if
              not crafting. If you are crafting, use the{' '}
              <a
                href="https://saddlebagexchange.com/price-sniper"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}>
                Discord bot price-alert
              </a>{' '}
              to know when there are deals on your raw materials:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-600 space-y-1">
              <li>
                🔎{' '}
                <a
                  href="https://saddlebagexchange.com/queries/recommended"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Reselling Trade Search
                </a>
              </li>
              <li>
                🔥{' '}
                <a
                  href="https://saddlebagexchange.com/ffxiv/best-deals/recommended"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Best Deals
                </a>
              </li>
              <li>
                🔔{' '}
                <a
                  href="https://saddlebagexchange.com/wow/price-alert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Discord Bot Price-Alert
                </a>
              </li>
              <li>
                🔫{' '}
                <a
                  href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Experimental-Discount-Price-Sniper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Experimental Discount Sniper
                </a>
              </li>
              <li>
                🛍️{' '}
                <a
                  href="https://saddlebagexchange.com/ffxiv/shopping-list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Bulk Crafting Shopping List
                </a>
              </li>
            </ul>
          </li>

          <li>
            <h3 className="text-xl font-semibold text-gray-800">
              3. 📈 Sell High
            </h3>
            <p className="text-gray-600 mt-2">
              In FFXIV you don&apos;t really need to make many alts and sell on
              different servers, our tools are geared towards selling on your
              own home server. Unlike WoW where you can make a fresh alt and
              start selling in 10 seconds, FFXIV requires you level to 20 and
              that can take time to make alts on each server. Its not really
              needed unless you really want to hardcore gil grind.
            </p>
            <p className="text-gray-600 mt-2">
              However if you have many alts and 2 accounts to move items between
              them, then you can sell anywhere! Use the export search to easily
              compare prices side by side of multiple servers for multiple items
              in the same window.
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-600 space-y-1">
              <li>
                🌐{' '}
                <a
                  href="https://saddlebagexchange.com/queries/world-comparison"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Export Search
                </a>
              </li>
            </ul>
          </li>

          <li>
            <h3 className="text-xl font-semibold text-gray-800">
              4. 🔄 Check for Sales and Undercuts
            </h3>
            <p className="text-gray-600 mt-2">
              Use our alerts or allagan tool integration to help monitor your
              active listings and alert you when you should relist your items or
              when sales are made:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-600 space-y-1">
              <li>
                💾{' '}
                <a
                  href="https://saddlebagexchange.com/allagan-data"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Allagan Tools Search
                </a>
              </li>
              <li>
                🔔{' '}
                <a
                  href="https://saddlebagexchange.com/undercut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Discord Bot Undercut and Sale Alerts
                </a>
              </li>
              <li>
                🛍️{' '}
                <a
                  href="https://saddlebagexchange.com/ffxiv/self-purchase"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Self Purchase History Search
                </a>
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Cross Server Trading Flow
        </h2>
        <div className="flex flex-col items-center gap-4 text-center text-sm text-gray-700">
          <div className="rounded-full border-2 border-blue-500 px-4 py-2 font-semibold">
            Start
          </div>
          <div className="text-gray-400">↓</div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 max-w-xl">
            <p className="font-semibold">
              📚 Learn What to Sell and How Much to Sell It For 🔍
            </p>
            <p className="mt-2 text-gray-600">
              Open Reselling, Marketshare, Best Deals, Craftsim, or Scrip
              Exchange → find profitable items → note average sale price and
              demand → optionally check Secret Sale Leads
            </p>
          </div>
          <div className="text-gray-400">↓</div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 max-w-xl">
            <p className="font-semibold">🛒 Buy Low</p>
            <p className="mt-2 text-gray-600">
              Search for underpriced listings → use Experimental Discount
              Sniper, Best Deals, or Shopping List → craft with price-alerts or
              buy finished items directly
            </p>
          </div>
          <div className="text-gray-400">↓</div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 max-w-xl">
            <p className="font-semibold">📈 Sell High</p>
            <p className="mt-2 text-gray-600">
              Use Export Search → find the best world/DC or confirm your home
              server → list items on retainers at target prices
            </p>
          </div>
          <div className="text-gray-400">↓</div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 max-w-xl">
            <p className="font-semibold">🔄 Check for Sales and Undercuts</p>
            <p className="mt-2 text-gray-600">
              Use Allagan Tools data and Discord alerts → check for undercuts →
              relist or adjust prices → review Self Purchase History
            </p>
          </div>
          <div className="text-gray-400">↓</div>
          <div className="rounded-full border-2 border-green-500 px-4 py-2 font-semibold">
            Profit &amp; Repeat
          </div>
        </div>
      </section>

      <footer className="mt-12 text-center text-gray-500">
        &copy; {new Date().getFullYear()} SaddlebagExchange. All rights
        reserved.
      </footer>
    </div>
  )
}

export default FFXIVTLDR
