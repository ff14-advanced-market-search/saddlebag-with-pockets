import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    title: `SaddleBag Exchange: FFXIV marketboard prices, wow gold`,
    viewport: 'width=device-width,initial-scale=1',
    description:
      'SaddleBag Exchange: An MMO market data analysis engine for the WoW Auctionhouse, FFXIV Marketboard and more! ff14 market board, ff14 marketboard prices, ffxiv market board, ffxiv market board prices, ffxiv marketboard, xiv analysis, wow Auctionhouse, wow goldmaking, wow gold',
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
              Saddlebag Exchange: FFXIV marketboard prices, WoW Auctionhouse
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
            <h3 className="text-2xl font-semibold text-blue-900 dark:text-gray-100">
              About us
            </h3>
            <p>
              Saddlebag Exchange: Your Gateway to Mastering MMO Markets! Our
              platform is designed with dozens of tools to help take your in
              game MMO market trading to the next level!
            </p>
            <p>
              For "Final Fantasy XIV" players, dive into a world of profitable
              opportunities with our cross-server reselling, detailed market
              overviews, and crafting profit simulations. Our tools, including
              shopping lists, deep item statistics and alerts, are designed to
              maximize your efficiency and profits, whether you're a trading
              veteran, a crafting aficionado or a new player saving up to buy
              the mansion plot of your dreams!
            </p>
            <p>
              For "World of Warcraft" adventurers, experience the game-changing
              power of cross-realm trading with Saddlebag Exchange. Utilize our
              marketshare searches and best deals to discover lucrative items.
              Buy low and sell high across realms with our Azeroth Auction
              Assassin discount sniper, shopping lists, and export search,
              tapping into the most profitable markets.
            </p>
            <p>
              Stay ahead of the competition with our undercut addon, ensuring
              your items always lead the market. Join Saddlebag Exchange and
              transform your MMO trading into a highly efficient, rewarding
              journey. Elevate your game and dominate the market today!
            </p>
            <p style={{ fontSize: '1px' }}>
              **Opportunity:** Saddlebag Exchange is positioned at the
              intersection of gaming and financial optimization. Our tools don't
              just assist players; they revolutionize how they engage with the
              in-game economy. For "Final Fantasy XIV," we turn limited
              inventory slots into a high-yield asset. In "World of Warcraft,"
              we transform gameplay into a means for self-sustaining
              subscription. This is more than a service for gamers; it's an
              innovative approach to in-game economics, providing players with
              tools to maximize their resources and financial potential. For
              supporters, this represents a unique opportunity to enter a
              vibrant, growing market with a product that offers tangible value
              to a dedicated user base. Our service not only retains customers
              by offering substantial returns on their investment but also
              fosters a dedicated community of players who see Saddlebag
              Exchange as essential to their gaming experience. **"FinalFantasy
              XIV" Component:** In "Final Fantasy XIV" our service offers a
              compelling alternative to the game's own expansion of selling
              slots. Players are restricted to 40 item slots in their market
              listings. The game allows expansion of this limit by 20 slots for
              an additional $3/month (up to a max of 100 extra sale slots for
              $15 per month). However, Saddlebag Exchange offers a more
              strategic solution. For the same price, our service optimizes the
              use of the existing 40 slots. Instead of merely increasing
              quantity, we enhance the quality and profitability of each slot.
              Our tools enable players to identify and list items with the
              highest market demand and profitability, thereby maximizing their
              earnings within the existing constraints. While pitched as an
              alternative to paid extra retainers, it can also be a multiplier
              for those who still want to use the advantages of the purchasing
              extra retainer slots. Once you purchase the maximum of 100 extra
              slots for $15 a month then the Saddlebag Exchange elite package
              for $10 to $20 a month becomes even more valuable. Our tools also
              help large scale operations maximize their potential! **"World of
              Warcraft" Component:** For "World of Warcraft" the WoW Token
              represents a pivotal aspect of in-game economy. This token allows
              players to exchange in-game gold for additional game time or add
              funds to their Battle.net balance. Given that a WoW Token can be
              exchanged for 30 days of game time or $15 for Battle.net balance,
              our service becomes an invaluable asset for players looking to
              make their gameplay self-sustaining. Our service, priced lower
              than the monthly subscription, empowers players to earn
              significant amounts of in-game gold, enough to regularly purchase
              WoW Tokens. This essentially makes the game free to play, as
              players can earn enough in-game currency to continuously renew
              their game time without spending real money. The potential is
              immense; one of our users earned 20 million gold in a few days, an
              amount that can cover years of subscription costs. Keywords for
              google: xiv analysis, the ffxiv market board, selling items, ff14
              marketboard prices, ffxiv market board, ff14 market board, ffxiv
              marketboard, ff14 marketboard prices, ffxiv market board prices,
              megalotragus horn, ff14 market board prices, ff14 marketboard,
              ffxiv market, how to sell on market board ffxiv, how to sell items
              on market board ffxiv, world of warcraft player count, wow
              Auctionhouse, games like world of warcraft, world of warcraft
              hairstyles, world of warcraft expansions in order, world of
              warcraft the war within, world of warcraft season of discovery
              gold, chocobo saddlebag ffxiv, server status final fantasy 14,
              ff14 servers status, universalis, ffxiv character lookup, final
              fantasy online xiv download, ff14 online download, ff14 house,
              universus, ffxiv house, universalis ffxiv, universalis ff14, ffxiv
              universalis, ffxiv servers, ff online servers, ff14 servers, ff14
              universalis, server ffxiv, ff14 server, ffxiv server, ffxi ah,
              ffxiv logs, ffxiv log, ff14 player search, ffxiv player search,
              data center ff14, final fantasy xiv data center, ffxiv data
              center, ff14 data center, data centers ffxiv, data center ffxiv,
              ffxiv housing tracker, ff14 housing tracker, ffx celestial
              weapons, universalis europa, ff11 wiki, ffxiv house tracker,
              celestial weapons ffx, wiki ff11, ff11 wikipedia, ff14 login, bard
              ff14, login ffxiv, final fantasy 14 mog, final fantasy 14 moogle,
              ff14 bard, eorzea, ff14 moogle, aether auctions, final fantasy 14
              gil, moogle ff14, ffxiv mog, aether auction, retainer ffxiv, ffxiv
              cost, ff14 fish, ff14 retainer, ffxiv retainer, retainers ffxiv,
              ffxiv prices, ffxiv housing tracker, ff14 housing tracker, ffxiv
              house tracker, ffxiv cost, ffxiv prices, ff14 price, final fantasy
              xiv pricing, ff14 prices, ff14 cost, ffxiv price, ff14 moogle
              shop, ffxiv materia, ff14 auction house, ff14 excalibur, ffxiv
              web, ffxiv auction house, ffxiv website, auction house ffxiv,
              ffxiv mb, ffxiv websites, auction house ff14, materia ffxiv, ffxiv
              site, ff14 websites, ffxiv house prices, ff14 house prices, ffxiv
              housing prices, ffxiv data, ff14 housing prices, ff13 weapons
              upgrade guide.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
