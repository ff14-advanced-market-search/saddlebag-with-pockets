// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'WoW Cross Realm Trading Announcement',
    description:
      'Stay updated with the latest announcement regarding cross-realm trading in World of Warcraft.',
    customHeading: 'Breaking News: WoW Cross Realm Trading Announcement'
  }
}

const HowtoCrossServerTradeinFFXIV = () => {
  return (
    <div className={`m-12`}>
      <main className="flex-1">
        <h1 className={`text-2xl`}>
          Breaking News: WoW Cross Realm Trading Announcement
        </h1>
        <p>
          At Saddlebag Exchange we have been developing AH trading searches
          throughout dragonflight and now with the announcement that marketable
          items can be traded across server I think these searches are going to
          be very useful.
        </p>
        <p>
          <a href="https://saddlebagexchange.com/wow/full-scan">
            For example here&#39;s a search that shows you the best dragonflight
            items to buy on one server to sell on another.
          </a>
        </p>
        <p>
          <a href="https://github.com/ff14-advanced-market-search/mega-alerts">
            We also have an Ultra Fast API based sniper that can find deals to
            snipe across all realms mere seconds after the blizzard ah api data
            updates!
          </a>{' '}
          Which will be perfect now that you can instantly move gold to whatever
          realm potential snipes are in!
        </p>
        <p>
          <a href="https://temp.saddlebagexchange.com/">
            Going further we just finished developing a whole set of pet
            arbitrage trading tools for more efficient trading of pets across
            servers.
          </a>{' '}
          These same tools can also support all non-commodities after the patch
          drops!
        </p>
        <p>
          I feel the <strong>Region Wide Undercut Check</strong> is going to be
          especially useful for managing many alts!
        </p>
        <p>
          We are currently looking for some players to help me test it and get
          it ready for the new patch.
        </p>
        <p>My current set of tools include:</p>
        <ul>
          <li>
            An{' '}
            <a href="https://temp.saddlebagexchange.com/petmarketshare">
              &quot;Estimated Pet Marketshare&quot;
            </a>{' '}
            that lets you view all TSM sale rates in one page, to find fast
            selling pets to trade. We already have marketshare searches that use
            TSM sale data to find{' '}
            <a href="https://saddlebagexchange.com/wow/marketshare">
              Dragonflight Items
            </a>{' '}
            and{' '}
            <a href="https://saddlebagexchange.com/wow/legacy-marketshare">
              Legacy Items
            </a>{' '}
            to sell.
          </li>
          <li>
            A{' '}
            <a href="https://temp.saddlebagexchange.com/petshoppinglist">
              &quot;Shopping List Search&quot;
            </a>{' '}
            search for finding which servers have the best deals for buying
            pets, ordering all server listing prices and quantities of all
            realms together in one list by order of price.
          </li>
          <li>
            An{' '}
            <a href="https://temp.saddlebagexchange.com/petexport">
              &quot;Export Search&quot;
            </a>{' '}
            to finding the best servers to sell items on by highest ah price and
            highest{' '}
            <a href="https://wowprogress.com/realms/rank/">WoW Progress</a>{' '}
            population size (letting you filter out low pop realms).
          </li>
          <li>
            An{' '}
            <a href="https://temp.saddlebagexchange.com/petimport">
              &quot;Import Search&quot;
            </a>{' '}
            for finding the best items to buy on other servers and sell on your
            home server, for when you need to move gold back to your home server
            and consolidate to buy a wow token. Alternatively if you sell on
            every realm this shows you the best items to sell on each individual
            realm.
          </li>
          <li>
            A{' '}
            <a href="https://temp.saddlebagexchange.com/regionundercut">
              <strong>Region Wide Undercut Check</strong>
            </a>{' '}
            made with our own{' '}
            <a href="https://www.curseforge.com/wow/addons/saddlebag-exchange">
              addon
            </a>{' '}
            that can check undercuts on all alts across all realms in one page!
            It also lets you sort by item value if you don&#39;t want to spend
            much time undercutting, but still want to keep tabs on your most
            valuable auctions.
          </li>
          <li>
            This one looks for the best discounts anywhere{' '}
            <a href="https://temp.saddlebagexchange.com/bestdeals">
              https://temp.saddlebagexchange.com/bestdeals
            </a>
          </li>
        </ul>
        <p>
          All tools currently support pets and dragonflight items. Legacy item
          support is on its way!
        </p>
        <p>
          If you are a React JS dev and want to help us build these tools into
          our open source project check us out on github and reach out to us on
          discord, we need all the help we can get to get these ready for july
          11th!
        </p>
        <p>
          <a href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets">
            Join our open source Github projects
          </a>
        </p>
        <p>
          <a href="https://discord.gg/Pbp5xhmBJ7">
            Join our discord for more feature updates
          </a>
        </p>
        <p>
          <strong>UPDATES:</strong>
        </p>
        <ul>
          <li>Added in all dragonflight non commodities as a search option</li>
          <li>Added in market gap finders to the import / export</li>
          <li>Added links to main website statistic searches</li>
          <li>We now support legacy items</li>
        </ul>
      </main>
    </div>
  )
}

export default HowtoCrossServerTradeinFFXIV
