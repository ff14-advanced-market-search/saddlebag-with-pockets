import Banner from '~/components/Common/Banner'
import type { MetaFunction } from '@remix-run/cloudflare'

const linkClass = 'text-blue-500 hover:underline'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'TLDR: How to make gold in WoW with cross realm trading' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { name: 'description', content: 'Easy 4 step method to making gold.' },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/blog/wow/tldr'
    }
  ]
}

const WoWTLDR = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <Banner />
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          💰 How to Earn Gold with Cross Realm Trading 🚀
        </h1>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Simply buy low in one realm, deposit an item in your warband bank,
          move it to another realm and sell high!
        </p>
      </header>

      <section className="mb-8 bg-white shadow-md rounded p-6 space-y-3">
        <p>
          <a
            href="https://youtu.be/s2ag1eQf0SQ?feature=shared"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}>
            📺 Watch this tutorial
          </a>{' '}
          if you&apos;re new to cross realm trading. It covers how to move items
          from one realm to another for trading.
        </p>
        <p>
          <a
            href="https://www.youtube.com/watch?v=TGZRfhJtomc"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}>
            📺 Gaming Hero Trading video
          </a>
        </p>
        <p>
          <a
            href="https://www.youtube.com/watch?v=_R_gL1ADDZU"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}>
            📺 Boohpie saddlebag video
          </a>
        </p>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📝 TL;DR: How to Make Gold with a 4-Step Process
        </h2>

        <p className="text-gray-700 mb-6">
          Here are some of the top ways to use Saddlebag for WoW, made simple
          for new users:
        </p>

        <ol className="list-decimal list-outside space-y-8 pl-8">
          <li>
            <h3 className="text-xl font-semibold text-gray-800">
              1. 📚 Learn What to Sell and How Much to Sell It For 🔍
            </h3>
            <p className="text-gray-600 mt-2">
              Use the marketshare searches or best deals to find good items to
              sell or craft (if you have professions) and determine the average
              historic price you can sell them for:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-600 space-y-1">
              <li>
                🔥{' '}
                <a
                  href="https://saddlebagexchange.com/wow/best-deals/recommended"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Best Deals
                </a>
              </li>
              <li>
                📊{' '}
                <a
                  href="https://saddlebagexchange.com/wow/marketshare?desiredAvgPrice=10000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Marketshare
                </a>
              </li>
              <li>
                💡{' '}
                <a
                  href="https://saddlebagexchange.com/wow/marketshare/recommended"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Marketshare Recommendations
                </a>
              </li>
              <li>
                🕰️{' '}
                <a
                  href="https://saddlebagexchange.com/wow/legacy-marketshare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Legacy Marketshare
                </a>
              </li>
              <li>
                🐾{' '}
                <a
                  href="https://saddlebagexchange.com/wow/pet-marketshare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Pet Marketshare
                </a>
              </li>
              <li>
                📈{' '}
                <a
                  href="https://saddlebagexchange.com/wow/itemlist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Raw Stats
                </a>
              </li>
              <li>
                🔎{' '}
                <a
                  href="https://saddlebagexchange.com/wow/out-of-stock"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Out of Stock
                </a>
              </li>
              <li>
                💎{' '}
                <a
                  href="https://saddlebagexchange.com/wow/ultrarare/recommended"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Ultra Rare Finder
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
                href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/TLDR:-How-to-earn-gold-with-cross-realm-trading"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}>
                Azeroth Auction Assassin
              </a>
              , shopping list, or best deals, then buy them if not crafting. If
              you are crafting, use the{' '}
              <a
                href="https://saddlebagexchange.com/wow/price-alert"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}>
                Discord bot price-alert
              </a>{' '}
              to know when there are deals on your raw materials:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-600 space-y-1">
              <li>
                🔥{' '}
                <a
                  href="https://saddlebagexchange.com/wow/best-deals/recommended"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Best Deals
                </a>
              </li>
              <li>
                🛠️{' '}
                <a
                  href="https://github.com/ff14-advanced-market-search/AzerothAuctionAssassin/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Azeroth Auction Assassin
                </a>
              </li>
              <li>
                🛠️{' '}
                <a
                  href="https://www.curseforge.com/wow/addons/aaatransformer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  AAATransformer Sniper Addon
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
                🛍️{' '}
                <a
                  href="https://saddlebagexchange.com/wow/shopping-list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Shopping List
                </a>
              </li>
              <li>
                🛍️{' '}
                <a
                  href="https://saddlebagexchange.com/wow/ilvl-shopping-list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  BOE Ilvl Shopping List
                </a>
              </li>
            </ul>
          </li>

          <li>
            <h3 className="text-xl font-semibold text-gray-800">
              3. 📈 Sell High
            </h3>
            <p className="text-gray-600 mt-2">
              Use the export search to find the best realm with the highest
              population to sell any items you buy or craft.
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-600 space-y-1">
              <li>
                🌐{' '}
                <a
                  href="https://saddlebagexchange.com/wow/export-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Export Search
                </a>
              </li>
              <li>
                🌐{' '}
                <a
                  href="https://saddlebagexchange.com/wow/ilvl-export-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  BOE Ilvl Export Search
                </a>
              </li>
            </ul>
          </li>

          <li>
            <h3 className="text-xl font-semibold text-gray-800">
              4. 🔄 Check for Sales and Undercuts
            </h3>
            <p className="text-gray-600 mt-2">
              Use the undercut addon/webpage to check on the items you have
              listed and track them on the AH (usually wait after you log back
              in or 1 hour after posting items so the API data from Blizzard
              updates):
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-600 space-y-1">
              <li>
                💾{' '}
                <a
                  href="https://www.curseforge.com/wow/addons/saddlebag-exchange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  The addon saves your auction data as you post
                </a>
              </li>
              <li>
                🖥️{' '}
                <a
                  href="https://saddlebagexchange.com/wow/region-undercut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}>
                  Then you paste the data in the webpage to see your undercuts
                  and sales, without needing to log in everywhere!
                </a>
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Cross Realm Trading Flow
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
              Use marketshare searches or best deals → find good items to sell
              or craft → determine average historic price
            </p>
          </div>
          <div className="text-gray-400">↓</div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 max-w-xl">
            <p className="font-semibold">🛒 Buy Low</p>
            <p className="mt-2 text-gray-600">
              Search for good deals → use Azeroth Auction Assassin, shopping
              list, or best deals → craft with price-alerts or buy directly
            </p>
          </div>
          <div className="text-gray-400">↓</div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 max-w-xl">
            <p className="font-semibold">📈 Sell High</p>
            <p className="mt-2 text-gray-600">
              Use export search → find best realm with highest population → sell
              your items
            </p>
          </div>
          <div className="text-gray-400">↓</div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 max-w-xl">
            <p className="font-semibold">🔄 Check for Sales and Undercuts</p>
            <p className="mt-2 text-gray-600">
              Use undercut addon/webpage → track listings on the AH → wait ~1
              hour after posting for Blizzard API data to update
            </p>
          </div>
          <div className="text-gray-400">↓</div>
          <div className="rounded-full border-2 border-green-500 px-4 py-2 font-semibold">
            End
          </div>
        </div>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Bonus Tips: Setting up alts
        </h2>
        <p className="text-gray-700 mb-4">
          Best way to setup alts is to have an{' '}
          <a
            href="https://www.wowhead.com/guide/allied-race/maghar-orc"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}>
            allied horde race like Mag&apos;har Orc unlocked
          </a>{' '}
          when you make one of these they just spawn in org.
        </p>
        <p className="text-gray-700 mb-4">
          Then go the &quot;Valley of Wisdom&quot; this is the best place for an
          AH alt as theres a bank, ah, guild bank, inn, mailbox and vendor all
          in one spot and you can mount up between them. You can do this with
          any allied race or other AH location, however you can make an alt and
          get to the &quot;Valley of Wisdom&quot; in under a minute. Other good
          AH locations like shrine or booty bay take a few min to run your alts
          out there. In org you just spawn there instantly.
        </p>
        <img
          src="https://github.com/user-attachments/assets/7f3e1677-b8b7-4552-93d8-e49b4bd98672"
          alt="Valley of Wisdom AH alt setup map"
          className="max-w-full h-auto rounded shadow mb-6"
          width={819}
          height={634}
        />
        <p className="text-gray-700 mb-4">
          If you dont have a horde allied race unlocked, just make a fresh orc
          or troll. Run to the nearest flightmaster and take the free flight to
          org. Then use your{' '}
          <a
            href="https://www.wowhead.com/item=122703/chauffeured-chopper"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}>
            Chauffeured Chopper
          </a>{' '}
          to get around.
        </p>
        <img
          src="https://github.com/user-attachments/assets/fcd1069e-d15a-43e3-843f-144a34983fde"
          alt="Chauffeured Chopper mount for getting around Orgrimmar"
          className="max-w-full h-auto rounded shadow"
          width={597}
          height={605}
        />
      </section>

      <footer className="mt-12 text-center text-gray-500">
        &copy; {new Date().getFullYear()} SaddlebagExchange. All rights
        reserved.
      </footer>
    </div>
  )
}

export default WoWTLDR
