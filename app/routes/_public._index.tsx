import React from 'react'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    title: 'SaddleBag Exchange: FFXIV Market Board Prices, WoW Gold',
    viewport: 'width=device-width,initial-scale=1',
    description:
      'SaddleBag Exchange: An MMO market data analysis engine for the WoW Auction House, FFXIV Market Board, and more! ff14 market board, ff14 marketboard prices, ffxiv market board, ffxiv market board prices, ffxiv marketboard, xiv analysis, wow Auctionhouse, wow goldmaking, wow gold',
    customHeading: 'Explore MMO Market Data with SaddleBag Exchange'
  }
}

export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com' }
]

const recommendedQueries = [
  {
    name: 'Final Fantasy XIV',
    description:
      'Tools for Cross-Server reselling, FFXIV Market Board Overviews, Crafting Profit Simulation, Shopping Lists, Alerts and More!',
    href: '/queries'
  },
  {
    name: 'World of Warcraft',
    description:
      'Tools for Cross-Realm Trading, Market Overviews, Shortage Finders, and our Best Deals Search!',
    href: '/wow'
  },
  {
    name: 'Patreon',
    description:
      'Join our Patreon Supporters to access the best tools we have!',
    href: 'https://www.patreon.com/indopan',
    external: true
  },
  {
    name: 'Discord Webpage',
    description:
      'Or join our Discord Subscribers to access the best tools we have!',
    href: 'https://discord.com/servers/saddlebag-exchange-973380473281724476',
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
              src="/images/hero-bg.jpg" // Placeholder image path
              alt="Hero Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-transparent to-blue-900 opacity-70"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-5xl font-extrabold text-white">
              Saddlebag Exchange
            </h1>
            <p className="mt-4 text-xl text-gray-200">
              Explore MMO Market Data for FFXIV and WoW
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="/queries"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-md shadow-md mr-4">
                Final Fantasy XIV
              </a>
              <a
                href="/wow"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-md">
                World of Warcraft
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-purple-600 uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                What We Offer
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Powerful tools and analytics to enhance your MMO trading
                experience.
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {recommendedQueries.map((feature) => (
                  <a
                    key={feature.name}
                    href={feature.href}
                    target={feature.external ? '_blank' : '_self'}
                    {...(feature.external && { rel: 'noopener noreferrer' })}
                    className="block">
                    <div className="p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition duration-200">
                      <h3 className="text-lg leading-6 font-medium">
                        {feature.name}
                      </h3>
                      <p className="mt-2 text-base">{feature.description}</p>
                    </div>
                  </a>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-purple-600 uppercase">
                About Us
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Your Gateway to Mastering MMO Markets
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Saddlebag Exchange provides tools to revolutionize how you
                engage with in-game economies.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* FFXIV Section */}
              <div className="flex flex-col bg-purple-50 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-purple-800 mb-4">
                  For Final Fantasy XIV Players
                </h3>
                <ul className="list-disc list-inside text-purple-700 space-y-2">
                  <li>
                    Get real-time FFXIV Discord alerts for{' '}
                    <a
                      href="https://saddlebagexchange.com/price-sniper"
                      className="text-purple-600 underline">
                      Prices
                    </a>
                    ,{' '}
                    <a
                      href="https://saddlebagexchange.com/undercut"
                      className="text-purple-600 underline">
                      Undercuts, Sales
                    </a>
                    , and more!
                  </li>
                  <li>
                    Unlock the best deals with our{' '}
                    <a
                      href="https://saddlebagexchange.com/queries/recommended"
                      className="text-purple-600 underline">
                      Cross-Server Reselling Tool
                    </a>
                    .
                  </li>
                  <li>
                    Discover high-demand items with our{' '}
                    <a
                      href="https://saddlebagexchange.com/ffxiv/marketshare/queries"
                      className="text-purple-600 underline">
                      Marketshare Overview Tool
                    </a>
                    .
                  </li>
                  <li>
                    Explore crafting opportunities with our{' '}
                    <a
                      href="https://saddlebagexchange.com/ffxiv/craftsim/queries"
                      className="text-purple-600 underline">
                      Crafting Profit Simulations
                    </a>
                    .
                  </li>
                  <li>
                    Optimize material costs with our{' '}
                    <a
                      href="https://saddlebagexchange.com/ffxiv/shopping-list"
                      className="text-purple-600 underline">
                      Shopping List Search
                    </a>
                    .
                  </li>
                </ul>
              </div>

              {/* WoW Section */}
              <div className="flex flex-col bg-blue-50 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                  For World of Warcraft Adventurers
                </h3>
                <ul className="list-disc list-inside text-blue-700 space-y-2">
                  <li>
                    Get real-time WoW AH Discord{' '}
                    <a
                      href="https://saddlebagexchange.com/wow/price-alert"
                      className="text-blue-600 underline">
                      Price Alerts
                    </a>
                    ,{' '}
                    <a
                      href="https://www.curseforge.com/wow/addons/saddlebag-exchange"
                      className="text-blue-600 underline">
                      Undercut Alerts
                    </a>
                    , and more!
                  </li>
                  <li>
                    Discover ultra-cheap deals with our{' '}
                    <a
                      href="https://saddlebagexchange.com/wow/best-deals?discount=99&minPrice=100&salesPerDay=0.1"
                      className="text-blue-600 underline">
                      Ultra Cheap Deals
                    </a>{' '}
                    search.
                  </li>
                  <li>
                    Experience cross-realm trading with{' '}
                    <a
                      href="https://github.com/ff14-advanced-market-search/AzerothAuctionAssassin/releases/latest"
                      className="text-blue-600 underline">
                      Azeroth Auction Assassin
                    </a>
                    .
                  </li>
                  <li>
                    Find lucrative items with our{' '}
                    <a
                      href="https://saddlebagexchange.com/wow/marketshare"
                      className="text-blue-600 underline">
                      Marketshare Gold Earning Searches
                    </a>
                    .
                  </li>
                  <li>
                    Utilize our{' '}
                    <a
                      href="https://saddlebagexchange.com/wow/shopping-list"
                      className="text-blue-600 underline">
                      Shopping List
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://saddlebagexchange.com/wow/export-search"
                      className="text-blue-600 underline">
                      Export Search
                    </a>{' '}
                    tools.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold">
              Join Saddlebag Exchange Today
            </h2>
            <p className="mt-4 text-lg">
              Transform your MMO trading into a highly efficient, rewarding
              journey.
            </p>
            <div className="mt-8">
              <a
                // href="/signup"
                href="/blog"
                className="inline-block bg-white text-purple-600 font-semibold py-3 px-6 rounded-md shadow-md hover:bg-gray-100">
                Get Started
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Saddlebag Exchange. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Hidden SEO Content */}
      <div
        style={{ fontSize: '1px', opacity: 0, height: 0, overflow: 'hidden' }}>
        <p>
          Join <strong>Saddlebag Exchange</strong> today and transform your MMO
          trading into a highly efficient, rewarding journey. Let us help you
          elevate your game and dominate the market!
        </p>
        <p>
          Welcome to the Saddlebag Exchange. Our platform offers a comprehensive
          suite of tools designed to elevate your game trading strategy. Your
          Gateway to Mastering MMO Markets! Saddlebag Exchange is positioned at
          the intersection of gaming and financial optimization. Our tools don't
          just assist players; they revolutionize how they engage with the
          in-game economy. For "Final Fantasy XIV," we turn limited inventory
          slots into a high-yield asset. In "World of Warcraft," we transform
          gameplay into a means for self-sustaining subscription. This is more
          than a service for gamers; it's an innovative approach to in-game
          economics, providing players with tools to maximize their resources
          and financial potential. For supporters, this represents a unique
          opportunity to enter a vibrant, growing market with a product that
          offers tangible value to a dedicated user base. Our service not only
          retains customers by offering substantial returns on their investment
          but also fosters a dedicated community of players who see Saddlebag
          Exchange as essential to their gaming experience. **"FinalFantasy XIV"
          Component:** In "Final Fantasy XIV" our service offers a compelling
          alternative to the game's own expansion of selling slots. Players are
          restricted to 40 item slots in their market listings. The game allows
          expansion of this limit by 20 slots for an additional $3/month (up to
          a max of 100 extra sale slots for $15 per month). However, Saddlebag
          Exchange offers a more strategic solution. For the same price, our
          service optimizes the use of the existing 40 slots. Instead of merely
          increasing quantity, we enhance the quality and profitability of each
          slot. Our tools enable players to identify and list items with the
          highest market demand and profitability, thereby maximizing their
          earnings within the existing constraints. While pitched as an
          alternative to paid extra retainers, it can also be a multiplier for
          those who still want to use the advantages of the purchasing extra
          retainer slots. Once you purchase the maximum of 100 extra slots for
          $15 a month then the Saddlebag Exchange elite package for $10 to $20 a
          month becomes even more valuable. Our tools also help large scale
          operations maximize their potential! **"World of Warcraft"
          Component:** For "World of Warcraft" the WoW Token represents a
          pivotal aspect of in-game economy. This token allows players to
          exchange in-game gold for additional game time or add funds to their
          Battle.net balance. Given that a WoW Token can be exchanged for 30
          days of game time or $15 for Battle.net balance, our service becomes
          an invaluable asset for players looking to make their gameplay
          self-sustaining. Our service, priced lower than the monthly
          subscription, empowers players to earn significant amounts of in-game
          gold, enough to regularly purchase WoW Tokens. This essentially makes
          the game free to play, as players can earn enough in-game currency to
          continuously renew their game time without spending real money. The
          potential is immense; one of our users earned 20 million gold in a few
          days, an amount that can cover years of subscription costs. Keywords
          for google: xiv analysis, the ffxiv market board, selling items, ff14
          marketboard prices, ffxiv market board, ff14 market board, ffxiv
          marketboard, ff14 marketboard prices, ffxiv market board prices,
          megalotragus horn, ff14 market board prices, ff14 marketboard, ffxiv
          market, how to sell on market board ffxiv, how to sell items on market
          board ffxiv, world of warcraft player count, wow Auctionhouse, games
          like world of warcraft, world of warcraft hairstyles, world of
          warcraft expansions in order, world of warcraft the war within, world
          of warcraft season of discovery gold, chocobo saddlebag ffxiv, server
          status final fantasy 14, ff14 servers status, universalis, ffxiv
          character lookup, final fantasy online xiv download, ff14 online
          download, ff14 house, universus, ffxiv house, universalis ffxiv,
          universalis ff14, ffxiv universalis, ffxiv servers, ff online servers,
          ff14 servers, ff14 universalis, server ffxiv, ff14 server, ffxiv
          server, ffxi ah, ffxiv logs, ffxiv log, ff14 player search, ffxiv
          player search, data center ff14, final fantasy xiv data center, ffxiv
          data center, ff14 data center, data centers ffxiv, data center ffxiv,
          ffxiv housing tracker, ff14 housing tracker, ffx celestial weapons,
          universalis europa, ff11 wiki, ffxiv house tracker, celestial weapons
          ffx, wiki ff11, ff11 wikipedia, ff14 login, bard ff14, login ffxiv,
          final fantasy 14 mog, final fantasy 14 moogle, ff14 bard, eorzea, ff14
          moogle, aether auctions, final fantasy 14 gil, moogle ff14, ffxiv mog,
          aether auction, retainer ffxiv, ffxiv cost, ff14 fish, ff14 retainer,
          ffxiv retainer, retainers ffxiv, ffxiv prices, ffxiv cost, ff14 price,
          final fantasy xiv pricing, ff14 prices, ff14 cost, ff14 moogle shop,
          ffxiv materia, ff14 auction house, ff14 excalibur, ffxiv web, ffxiv
          auction house, ffxiv website, auction house ffxiv, ffxiv mb, ffxiv
          websites, auction house ff14, materia ffxiv, ffxiv site, ff14
          websites, ffxiv house prices, ff14 house prices, ffxiv housing prices,
          ffxiv data, ff14 housing prices, ff13 weapons upgrade guide, ffxiv
          character search, final fantasy xiv sale, universalis ffxiv, choco bo,
          xiv server status, final fantasy 14 online server status, marketboard
          ffxiv, final fantasy 14 market board, ff14 maintenance, ffxiv server
          status, ffxiah, green hills of stranglethorn, ff14 hairstyles,
          loque'nahak, housing lottery, ffxiv auction house tracker.
        </p>
      </div>
    </>
  )
}
