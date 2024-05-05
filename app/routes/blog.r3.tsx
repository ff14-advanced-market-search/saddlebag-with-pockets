// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'How to Trade Using Commodity Shortage Futures as a Crafter',
    description: 'Explore effective strategies for trading using commodity shortage futures to maximize profits as a crafter.',
    customHeading: 'Maximizing Profits: Trading with Commodity Shortage Futures as a Crafter'
  }
}


const HowtoCrossServerTradeinFFXIV = () => {
  return (
    <div className={`m-12`}>
      <main className="flex-1">
        <h1 id="how-to-trade-use-commodity-shortage-futures-as-a-crafter">
          How to trade use &quot;Commodity Shortage Futures&quot; as a crafter
        </h1>
        <p>
          As a crafter you may want to earn more gold from your crafts then the
          amount you would earn selling at the current lowest price of an
          auction. However posting at a higher price may force your auctions to
          expire before they sell if there is too much competition in a market
          keeping prices low.{' '}
        </p>
        <p>
          Our &quot;Commodity Shortage Futures&quot; exists to help you learn
          what will go up in price so you can reliably post at higher prices to
          earn the most from your crafts!
        </p>
        <h2 id="filtering-to-find-items-you-can-craft">
          Filtering to find items you can craft
        </h2>
        <p>
          You should begin by filtering the item category to items you can craft
          and editing the default average price and sales per day to match items
          you want to sell. For example if you are an enchanter who is specced
          into blue enchants you may want to view <code>Item Enhancements</code>{' '}
          with a low price and high sales:
        </p>
        {/*<p><img width="678" alt="image" src="https://user-images.githubusercontent.com/17516896/218552507-bc1e3b3e-68a6-42b8-8026-06a5919891ca.png"></p>*/}
        <p>
          Alternatively if you specced to epic weapon enchants you may want to
          change to lower sales and higher prices:
        </p>
        {/*<p><img width="669" alt="image" src="https://user-images.githubusercontent.com/17516896/218553536-03bb8af3-cc55-4797-9268-8f57a34bdb7b.png"></p>*/}
        <p>
          The search is highly customizable so I recommend trying different
          values and finding what works best for you!
        </p>
        <h2 id="choosing-a-good-market">Choosing a good market</h2>
        <p>
          This is the most difficult part of the tool as it relies mostly on
          game knowledge. You need to know your markets, know what people
          actually want to buy and know what sells reliably. The{' '}
          <code>TSM Sales Per Hour</code> value can assist with that and I
          recommend also searching on <a href="wowhead.com">wowhead.com</a> to
          gain further insight into what an item is used for if you are
          unfamiliar with it.
        </p>
        <h2 id="using-oribos-exchange">Using Oribos Exchange</h2>
        <p>
          The best tool for all of this is{' '}
          <a href="https://oribos.exchange/">Oribos Exchange</a> and this is why
          we include a link to each item in our search results. Their
          visualization of prices and quantity over time looking at past
          shortages will tell you everything you need to know about the real
          possibility of a shortage and price increase based on past
          performance.
        </p>
        <p>
          It can show you how high prices can go, what quantity levels caused
          price increases in the past, how prone an item is to manipulation by
          posible player oligopolists and much more! Both Saddlebag Exchange and
          Oribos Exchange collect and use data the same way by recording the
          minimum prices and quantities each hour from the blizzard api. They
          present the data in a visually pleasing way and we use it to search
          for interesting opportunities.
        </p>
        <h2 id="example-of-a-good-and-bad-shortage-based-on-game-knowledge">
          Example of a good and bad shortage based on game knowledge
        </h2>
        <p>
          For two examples let&#39;s look at{' '}
          <code>Enchant Weapon - Frozen Devotion --- Quality 3</code> and{' '}
          <code>Enchant Boots - Rider&#39;s Reassurance --- Quality 3</code>
        </p>
        <p>
          (Note that <code>Frozen Devotion</code> requires skill point
          investment, while <code>Rider&#39;s Reassurance</code> requires
          reputation)
        </p>
        <p>Lets first compare both oribos exchange charts:</p>
        {/*<p><img width="946" alt="image" src="https://user-images.githubusercontent.com/17516896/218556018-60bbd25c-6c18-478c-be7a-86b9b756f1b0.png">*/}
        {/*<img width="945" alt="image" src="https://user-images.githubusercontent.com/17516896/218556162-47f178d3-b478-45fd-a251-176757a6dc24.png"></p>*/}
        <p>
          You can see both are very low in quantity compared to the average
          quantity over time and are at quantity levels that had caused price
          increased in the past two weeks of data displayed. It is likely both
          would increase in price, but which item should you choose to craft if
          you have the ability to craft both?{' '}
        </p>
        <p>
          Well any experienced enchanter will tell you that people pay for
          combat stats. Full stat enchants are often required for raiding. A
          raider on a budget will often choose to forgo the extra out of combat
          stats if it saves them some gold. Especially when the quality 2
          version exists at a much lower price with close to the same amount out
          of combat stats:
        </p>
        {/*<p><img width="657" alt="image" src="https://user-images.githubusercontent.com/17516896/218559516-5622ab9b-564a-47ba-997f-1d43aaf354a9.png"></p>*/}
        <p>
          By comparison <code>Enchant Weapon - Frozen Devotion</code> is the top
          selling epic enchant and for many classes/specs is BIS and required
          for raiding.
        </p>
        <h2 id="-quantity-decline-rate-vs-tsm-sales-per-hour-">
          &quot;Quantity Decline Rate&quot; vs &quot;TSM Sales Per Hour&quot;
        </h2>
        <p>
          We can also see a reflection of this information in the Saddlebag
          Exchange. The <code>TSM Sales Per Hour</code> for{' '}
          <code>Rider&#39;s Reassurance</code> is 0 meaning on average there is
          less than 1 sale per hour vs the more respectable 9 sales per hour on{' '}
          <code>Frozen Devotion</code>.
        </p>
        {/*<p><img width="1236" alt="image" src="https://user-images.githubusercontent.com/17516896/218558076-e855ffd3-3c68-4286-8a69-cbb64ca196c8.png">*/}
        {/*<img width="1231" alt="image" src="https://user-images.githubusercontent.com/17516896/218558330-636fa9f5-c708-4df2-b722-eed17163c7d3.png"></p>*/}
        <ul>
          <li>
            <p>
              <strong>TSM Sales Per Hour</strong>: This comes from the TSM
              regional sales api data and measures the average sales per hour
              based on data from TSM users. This is the best sale rate
              available, but it does often have flaws. It relies on TSM users
              over the past 2 weeks. If very few sellers in a small market are
              actively using TSM the sale rate may be far lower than reality.
              Take it with a grain of salt and use it more of a guideline than a
              rule.
            </p>
          </li>
          <li>
            <p>
              <strong>Quantity Decline Rate</strong>: Alternatively we create
              this value by measuring the changes in quantity over the past 6
              hours. While this is accurate, it is the result of many factors:{' '}
            </p>
          </li>
          <li>The number of items selling</li>
          <li>The number of new items being crafted/gathered and posted</li>
          <li>The number of items expiring</li>
          <li>The time of day and day of the week</li>
          <li>
            Players canceling auctions and deciding not to repost their items
          </li>
          <li>
            Players canceling auctions and being prevented from reposting for
            any number of reasons (forgetting about items in your inventory,
            group finder queue&#39;s, real life interruptions, temporary or
            permanent bans, internet outages, server downtimes, etc)
          </li>
        </ul>
        <p>
          So the <code>TSM Sale Rate</code> is often a bit inaccurate but
          provides a clear picture of direct sales. The{' '}
          <code>Quantity Decline Rate</code> is very accurate, but it might just
          be auctions expiring instead of auctions selling. A good measure of
          this is to see how wide the difference is.{' '}
        </p>
        <p>
          For <code>Mark of Sargha</code> we can see the quantity decline rate
          is below the sale rate, meaning this is very naturally headed to a
          real shortage and more items are being added to the market each hour,
          but the cancellations, sales and expirations are exceeding the posting
          rate:
        </p>
        {/*<p><img width="782" alt="image" src="https://user-images.githubusercontent.com/17516896/218572971-7bb8bb41-cec6-45b8-b7d9-1482c9ace07b.png"></p>*/}
        {/*<p><img width="698" alt="image" src="https://user-images.githubusercontent.com/17516896/218573154-6c63335c-cd04-4680-b309-649f1247d5e1.png"></p>*/}
        <p>
          Alternatively when we look at the{' '}
          <code>Forceful Nozdorite --- Quality 3</code> We see over 60% of the
          market swinging up and down, this is likely due to one player with
          over 1000 of these manipulating the price and letting their auctions
          expire.{' '}
        </p>
        {/*<p><img width="799" alt="image" src="https://user-images.githubusercontent.com/17516896/218572743-6ecbdfeb-a721-45b6-a120-b3e3705ee34a.png"></p>*/}
        {/*<p><img width="712" alt="image" src="https://user-images.githubusercontent.com/17516896/218573657-5198ef4f-1bc6-41c3-b813-88cc49c7f46d.png"></p>*/}
        <p>
          A general rule is that if an items decline rate is 10 times the TSM
          sale rate its probably a shortage caused by market manipulation than a
          naturally occuring shortage.
        </p>
        <h2 id="how-to-pick-prices">How to pick prices</h2>
        <p>This is one of the most difficult issues to solve.</p>
        <ul>
          <li>What is your item really worth? </li>
          <li>How much should you craft? </li>
          <li>How to price your stacks? </li>
        </ul>
        <p>
          This all comes from prior experience and game knowledge, but I can
          make the following recommendations:
        </p>
        <ul>
          <li>
            For crafters the idea is that you need a light touch. Less is more
            at a high price, as you get more profit with less items. Craft too
            many and not all of your items will sell.
          </li>
          <li>
            Understand how much people are willing to pay and don&#39;t get too
            greedy. For a blue enchant it is not likely people will actually pay
            10k or more for the item, but 500g to 2k is very reasonable and
            profitable when this usually costs around 100 to 150g to craft.
          </li>
          <li>
            Don&#39;t post at a single price! Average out your profits by
            posting small stacks at many different prices. Small stacks at many
            different prices will sell far better than large stacks at a single
            price and will allow prices to go further up to capture even higher
            prices. The higher prices may not sell, but the lower ones will
            average out your profits to be much higher then they would otherwise
            be normally.
          </li>
          <li>
            Fill market gaps! Lets look at this snapshot of{' '}
            <code>Enchant Ring - Devotion of Haste</code> and we can see gaps in
            prices between 151 to 189 and 189 to 250g and none above 250g!
            Posting small stacks at different prices between these will make
            your items more likely to sell.
            {/*<img width="957" alt="image" src="https://user-images.githubusercontent.com/17516896/218575941-34cee051-0017-414b-88ac-9f5db7a9e885.png">*/}
          </li>
        </ul>
      </main>
    </div>
  )
}

export default HowtoCrossServerTradeinFFXIV
