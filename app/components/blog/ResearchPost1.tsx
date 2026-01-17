import Banner from '~/components/Common/Banner'
import type { MetaFunction } from '@remix-run/cloudflare'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'How to Use Commodity Shortage Futures as a Crafter' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'Discover effective strategies for utilizing commodity shortage futures to maximize profits as a crafter.'
    },
    {
      name: 'customHeading',
      content:
        'Maximizing Profits: Using Commodity Shortage Futures as a Crafter'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/blog/r1'
    }
  ]
}

const ResearchPost1 = () => {
  return (
    <div className="m-12">
      <Banner />
      <main className="flex-1">
        <h1 className="text-2xl">
          How to Import, Trade and Flip items on the FFXIV Market Board
        </h1>
        <div className="prose prose-lg max-w-none">
          <h2 id="how-to-import-trade-and-flip-items-on-the-ffxiv-market-board">
            How to Import, Trade and Flip items on the FFXIV Market Board
          </h2>
          <p>
            Importing, trading, and flipping items on the FFXIV Market Board is
            by far one of the easiest methods of making gil — without the need
            to quest or invest in crafting professions. You can earn millions
            each day from as few as five minutes of game time spent trading. All
            of which can be done as early as level 20 when you gain access to
            retainers!
          </p>
          <p>
            FFXIV server-to-server travel allows you to visit any server in your
            region and purchase items off of those servers&#39; Market Boards.
            You can then sell those items on the market board of your home
            server for a profit.{' '}
          </p>
          <p>
            <code>
              TIP: For various reasons, be it convenience or just a lack of
              knowledge, most players simply will not travel to other servers
              for purchases. This advantage allows you to profit from buying low
              on other servers to sell high on your own!
            </code>
          </p>
          <p>Undercutting is a Necessity for Trade!</p>
          <p>
            The number one rule of FFXIV trading is that you need to undercut.
            That means you should always provide the lowest price for whatever
            it is you're selling.
          </p>
          <p>
            <code>
              Undercut: offer goods or services at a lower price than (a
              competitor)
            </code>
          </p>
          <p>
            Naturally, it's both a risk and an investment to purchase any item
            and resell it. If you can&#39;t sell, then you lose gil. It&#39;s no
            different from the risk in crafting when you invest in raw materials
            to create and sell a finished product.
          </p>
          <p>
            The only way to profit off a trade is to lock in a sale before the
            prices go down (which happens naturally over time as more players
            provide the same item and continue to undercut one another). You can
            sell and make a profit by undercutting any new listings in your
            auctions. If you don&#39;t undercut, the price may drop so low that
            it will cause you to lose gil in the process.
          </p>
          <p>
            However, it's not difficult to stay on top of this and undercut
            effectively with some simple tools.
          </p>
          <ol>
            <li>
              <p>
                Generally you want to update your retainer&#39;s price and
                repost one gil below the competition. There are optional add ons
                that make this process easier, but we obviously can't endorse
                them here, especially when it's so easy to update the prices by
                hand.
              </p>
            </li>
            <li>
              <p>
                A tool that will seriously improve your trading is the{' '}
                <a href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version">
                  Saddlebag Exchange Undercut Alerts
                </a>
                . These alerts are a major quality-of-life improvement!{' '}
              </p>
            </li>
          </ol>
          <p>
            Undercut Alerts send players Discord messages whenever Universalis
            finds that you have been undercut. This makes it much more feasible
            to know when you must update your listing prices on each of your
            retainers. These messages also mean you no longer need to pull your
            retainers off the Market Board to check if they&#39;ve been
            undercut. If you're someone who has dozens of retainers,{' '}
            <a href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version">
              Saddlebag Exchange Undercut Alerts
            </a>{' '}
            is a must-have for keeping tabs on all of your auctions and knowing
            when someone else is selling your stuff at a better price.
          </p>
          <p>Basic Import Trade Example:</p>
          <p>
            To start trading, let&#39;s take a basic example of buying low and
            selling high.
          </p>
          <p>
            We can see this "Greatwood Planter" is listed for 262,496 gil on
            Famfrit (my home server) and is selling consistently at around that
            price:
          </p>
          <p>
            However, it's also currently available for only 52,500 gil on
            another server in my Data Center:
          </p>
          <p>
            For this flip, I could travel to the <code>Hyperion server</code>,
            purchase the <code>Greatwood Planter</code> for 52,500 and then sell
            for 262,496 to net 209,996 gil revenue which (after in-game taxes
            and costs) comes out to about 199,500 gil profit.
          </p>
          <p>(NOTE: The Universalis listing prices include the buyer taxes).</p>
          <p>
            This is a very good trade with over a 75 percent return on
            investment (ROI). However, better profits can still be made for less
            cost and risk!
          </p>
          <p>Out-of-Stock Trade Example</p>
          <p>
            In FFXIV, there's a default limit of 40 auctions available to each
            character (without purchasing additional retainers for $2 per month
            apiece) that means there will be many market gaps with items that
            can be sold on the market board, but no one is selling them.
          </p>
          <p>
            If we look at the <code>Bronze Skillet,</code> for instance, we can
            see that absolutely none are currently listed on my server&#39;s
            market board.{' '}
          </p>
          <p>
            <code>
              TIP: This is one of the best profit opportunities when trading!
            </code>
          </p>
          <p>
            You can see that there are many options available to buy this item
            if we go beyond just that one server, however. A high quality
            version can be found on my Data Center for 4,200 gil. Meanwhile, the
            low quality version is up for only 105 gil!
          </p>
          <p>
            In the example with the Greatwood Planter, we could not sell for
            more than 262,496 gil because there were other listings preventing
            sales at higher prices. However, with the Bronze Skillet, there are
            no other listings at all. Meaning we could try to sell a Bronze
            Skillet for any price we want!{' '}
          </p>
          <p>
            You could try and sell for 900 million gil if you really, really
            wanted to and still technically have a chance to sell it. However,
            this is very unrealistic. You should consider the buying power of
            players and how much they will pay for the convenience of buying
            basic stuff from the Market Board instead of crafting it or finding
            the item themselves in-game.
          </p>
          <p>All Non-Consumables and Non-Trade Goods Can Sell for 70k!</p>
          <p>
            A general rule of thumb is that, if you're ever unsure what to price
            an item for, 70k is your go-to number. It's a very small amount of
            gil for most players, but selling many items for 70k with very
            high-profit margins will earn you millions of gil in short order
          </p>
          <ul>
            <li>
              If trading the HQ (high quality) version of an item: buying for
              4,200 and selling for 70k you can earn over 62k profit and an ROI
              of 89 percent.{' '}
            </li>
            <li>
              If trading the NQ (normal quality) version: buying for only 104
              gil and selling for 70k, you can earn over 66k and almost a 94
              percent profit for almost no risk at all!
            </li>
          </ul>
          <p>You must also consider:</p>
          <ul>
            <li>
              High quality will sell better than low quality when an HQ version
              exists in ready supply.
            </li>
            <li>
              Items with only low quality — like furniture, minions, and
              miscellaneous items — do not have this issue and are easier to
              trade.
            </li>
            <li>Selling on a mannequin removes the sales tax.</li>
          </ul>
          <p>Trading Vendor Items</p>
          <p>
            Selling vendor items is also another strategy to gain profit.
            Vendors can only sell NQ versions of items, but for many reasons,
            players will still purchase vendor items from the Market Board
            instead. Sometimes they might not realize the item is available on a
            vendor somewhere in the world. Other times they might just prefer
            the convenience of the Market Board.
          </p>
          <p>
            In FFXIV, vendors are sometimes difficult to find, their menus can
            be difficult to navigate, and (most annoying of all) the items are
            often unsorted. The vendor items are listed in alphabetical order,
            mind you... from the Japanese alphabet. This means in English and
            all non-Japanese versions of the game, you experience greater
            difficulty looking through vendors menus to find the exact thing you
            need. Even if you know who exactly to buy it from and where!
          </p>
          <p>
            The Market Board lets players search directly for the items they
            desire, making it easier to deal with than vendors. This allows you
            to profit and make players&#39; lives a bit easier without the
            hassle of dealing with NPC vendors.
          </p>
          <p>
            <a href="https://na.finalfantasyxiv.com/lodestone/playguide/db/item/928a9b10d1d">
              The bronze skillet we talked about
            </a>{' '}
            can be purchased from the vendor Syneyhil 246 gil. Instead of buying
            it off another server, you could just go buy it from a vendor to
            sell for 70k. (Often, but not always, vendor prices will be far
            lower than Market Board prices.)
          </p>
          <p>Best Vendors for Flipping</p>
          <p>The best vendors with the most stock are:</p>
          <ul>
            <li>
              <a href="https://na.finalfantasyxiv.com/lodestone/playguide/db/shop/acecca47523/?item=928a9b10d1d&type=gil">
                Syneyhil
              </a>{' '}
              for crafting gear at Limsa Lominsa Lower Decks (X: 6.3, Y:11.9)
            </li>
            <li>
              <a href="https://na.finalfantasyxiv.com/lodestone/playguide/db/shop/378e5c3a3b5/?item=ada19dd8fdd&type=gil">
                Iron Thunder
              </a>{' '}
              for leveling armor at Limsa Lominsa Lower Decks (X: 8.1, Y: 11.6)
            </li>
            <li>
              <a href="https://na.finalfantasyxiv.com/lodestone/playguide/db/shop/4416c62758c/?item=30654ce2f28&type=gil">
                Faezghim
              </a>{' '}
              for leveling weapons at Limsa Lominsa Lower Decks (X: 6.5, Y:
              11.9)
            </li>
          </ul>
          <p>
            The best vendors of all are the various{' '}
            <a href="https://na.finalfantasyxiv.com/lodestone/playguide/db/shop/8c2af97deeb/?item=c8b983e661b&type=gil">
              Housing Merchant
            </a>{' '}
            NPCs. All housing items sell en masse — making NQ and housing items
            sell very well. Housing items can often sell for more than 70k. Even
            for items bought from vendors!
          </p>
          <p>Trading with Saddlebag Exchange Import Searches</p>
          <p>
            The tricky part of trading is in figuring out what to trade. The "In
            Demand" heart icon found next to many items on the Market Board
            seems like a good way to find good items to trade, but it&#39;s
            generally a very bad metric to use. All this icon actually does is
            show items that people added to their Market Board favorites list,
            which does not reflect the actual sales performance of the item.
          </p>
          <p>
            <strong>
              <strong>
                Trading is a numbers game. You need raw statistics, not a
                mysterious icon unrelated to actual sales in order to trade
                properly.
              </strong>
            </strong>
          </p>
          <p>
            This is why{' '}
            <a href="https://saddlebagexchange.com/queries">
              Saddlebag Exchange
            </a>{' '}
            was founded!
          </p>
          <p>
            Using the historical sales data, we calculate accurate average sale
            prices and sale rates. This lets you know how much items actually
            sell for and how often they are selling to help you find the best
            items to trade! We then also take many other metrics into account
            and provide detailed lists, filters, and links with all the
            information you need to master the market board!
          </p>
          <p>
            If you are not using Saddlebag Exchange to trade, you're seriously
            limiting yourself! You can view{' '}
            <a href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/How-to-Import,-Trade-and-Flip-items-on-the-FFXIV-Marketboard-using-Saddlebag-Exchange-Import-Searches">
              a full guide on how to use our website here in this second guide
            </a>{' '}
            to importing, trading, and flipping.
          </p>
        </div>
      </main>
    </div>
  )
}

export default ResearchPost1
