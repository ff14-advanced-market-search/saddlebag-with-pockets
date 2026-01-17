import type { MetaFunction } from '@remix-run/cloudflare'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'How to Cross-Server Trade in FFXIV' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'Discover effective methods and guidelines for cross-server trading in Final Fantasy XIV.'
    },
    {
      name: 'customHeading',
      content: 'Mastering Cross-Server Trading: Strategies for FFXIV'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/blog/r2'
    }
  ]
}

const ResearchPost2 = () => {
  return (
    <div className={`m-12`}>
      <main className="flex-1">
        <p>
          Our{' '}
          <a href="https://saddlebagexchange.com/ffxiv/marketshare/queries">
            Market overview
          </a>{' '}
          will show you the top 200 best items to sell on the marketboard from a
          number of different categories! Here you will see the best items to
          sell on the market board from a range of numbers to different
          categories! Here is where you can view items that earn the most gil,
          increasing in price the most, fastest selling, the most purchased,
          highest quality sold, and the highest average/median/minimum prices!
        </p>
        {/*<p><img src="https://user-images.githubusercontent.com/17516896/225352949-d52f8a1e-fd08-4f51-aa1a-8df282bb38e4.png" alt="image"></p>*/}
        <h1 id="how-to-earn-gil-with-the-market-overview">
          How to earn gil with the market overview
        </h1>
        <h2 id="tldr-">TLDR:</h2>
        <p>
          The simplest way to earn gil with this is by selling items that are{' '}
          <strong>
            <em>green</em>
          </strong>{' '}
          or{' '}
          <strong>
            <em>blue*</em>
          </strong>{' '}
          in the price overview. (These have increased in price or are out of
          stock, making them much more profitable to buy on other servers to
          sell on your own or craft/gather.)
        </p>
        <p>
          <code>
            Tip: If it&#39;s blue it means they are extremely profitable to sell
            as none are listed on your market board and you can sell for any
            price you want to.
          </code>
        </p>
        <p>
          First... pick a search. The weekly overview, price percent increase or
          fast-selling searches are great places to start. You can make your own
          search by changing the numbers, however, we have created searches with
          defaults open for public usage under the{' '}
          <a href="https://saddlebagexchange.com/ffxiv/marketshare/queries">
            main page for the market overviews.
          </a>
        </p>
        <p>Then here is how you read the chart:</p>
        <ul>
          <li>
            ✅ Big boxes with a big current market value{' '}
            <strong>earn lots of gil.</strong> They are good items to
            buy/resell, craft, or gather
          </li>
          <li>
            ❌ Little boxes with a small current market value are bad items to
            buy/resell, craft, or gather. (They don&#39;t earn much gil.)
          </li>
          <li>
            ✅ <em>When the price overview is bright green:</em> You should
            buy/resell, craft or gather and sell at{' '}
            <strong>current prices</strong> to <strong>earn lots of gil</strong>
          </li>
          <li>
            ❌ <strong>Stay far away from items that are bright red!!!</strong>:
            They are probably unprofitable, have crashed in price, or only show
            big gil earned due to gil laundering which does not show real sales.
          </li>
          <li>
            ✅{' '}
            <strong>
              <em>When the price overview is light blue:</em>
            </strong>{' '}
            <strong>These items will earn high amounts of gil.</strong> This is
            the best opportunity to buy/resell, craft, or gather!!! This lets
            you sell at any price you want to.{' '}
          </li>
          <li>
            ✅ Here&#39;s a link to find that{' '}
            <a href="https://saddlebagexchange.com/queries/item-history">
              history overview
            </a>{' '}
            search to find specific items on the <em>Region Price History</em>{' '}
            chart. Check out{' '}
            <a href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/How-to-use-Item-Data-Searches-to-help-you-find-good-items-to-trade">
              our guide on this
            </a>{' '}
            for more info on how to use our history overview.{' '}
          </li>
        </ul>
        <h2 id="how-to-search-for-items">How to search for items</h2>
        <p>
          The market overview has several options which point out the{' '}
          <em>best</em> selling item based on a number of categories{' '}
          <strong>depending</strong> on the search inputs you pick:
        </p>
        {/*<p><img src="https://user-images.githubusercontent.com/17516896/225358969-1b234617-eac9-4887-a446-6fc87d715d45.png" alt="image"></p>*/}
        <ul>
          <li>
            The <code>Sales Amount</code> divided by the{' '}
            <code>Time Period</code> gives you the sales per hour or sale rate.
            (i.e. how fast an item sells.)
          </li>
          <li>
            <code>Time Period</code> is how much time you want to search over.
            You can search from 1 to 168 hours. (24 hours is one day, and 168
            hours is one week.)
          </li>
          <li>
            The <code>Sales Amount</code> is how many sales you want to find in
            that time period, you can pick from 1 to a max of 40 sales (we only
            store 40 sales in our DB, for finding data on any items selling 40
            or more sales we make API calls to universalis.)
          </li>
          <li>
            As the most sales you can pick is 40 if you want faster-selling
            items then pick a lower <code>Time Period</code> to find faster sale
            rates.
          </li>
          <li>
            <code>Average Price</code> will find items that sell on average for
            that price or higher. The lowest amount of gil you can search for is
            10 gil.
          </li>
          <li>
            The Item Filters will let you filter specific categories of items or
            multiple categories at once. Make sure to unselect the{' '}
            <code>All</code> checkbox if you want to search for specific
            categories
          </li>
        </ul>
        <p>
          The <code>Sort Results By</code> is most important as it will change
          the results you see. To make sure our chart load correctly we only
          pick the top 200 items sorted by the value of the field you pick in
          the <code>Sort Results By</code> option:
        </p>
        <ul>
          <li>
            <strong>Market Value:</strong> * Simplest metric to use. Shows what
            items earned the most gil by adding together all sales revenue from
            all items that match search input to show the 200 top earners.
          </li>
          <li>
            <strong>Percent Changed:</strong> Highlights what is out of stock or
            has increased in price. (These are great opportunities to trade when
            buying from other servers to sell on your own.)
          </li>
          <li>
            <strong>Purchase Amount:</strong> This shows you the fastest-selling
            items. (Commonly the best items are sold within stacks of 1 or small
            stacks, but they are also the easiest to sell fast)
          </li>
          <li>
            <strong>Quantity Sold:</strong> This shows the items that sell the
            highest stacks the fastest (these are commonly fast-selling items
            that sell in stacks of 99 for common commodities or 9999 for
            crystals)
          </li>
          <li>
            <strong>Average Price:</strong> This shows the items which on
            average sell for the most gil, however, some very big sales can
            offset this.
          </li>
          <li>
            <strong>Median:</strong> This shows which items sell for the most
            gil on a regular basis and it&#39;s more consistent than the average
            price.
          </li>
        </ul>
        <h2 id="using-the-statistics-table">Using the statistics table</h2>
        {/*<p><img src="https://user-images.githubusercontent.com/17516896/225390829-18d70faa-4348-480a-9bd7-ef692052cb02.png" alt="image"></p>*/}
        <p>
          The table below the heat map has columns that can be sorted (by
          clicking on the columns) and contains all the data on items with
          helpful links such as:
        </p>
        <ul>
          <li>Item Name: Name of the item</li>
          <li>
            Market Value: The amount of gil earned in the time period selected
          </li>
          <li>Percent Changed: The change in price vs the average price</li>
          <li>
            Market State:{' '}
            <a href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/How-to-trade-using-our-FFXIV-Market-Overview#using-the-heatmap-tabs">
              See the info on this from the heatmap section
            </a>
          </li>
          <li>Average Price: Average price in the time selected</li>
          <li>Median: Median price in the time selected</li>
          <li>Minimum Price: Current minimum price</li>
          <li>
            Purchase Amount: Amount of sales (i.e. individual purchases when
            users click buy on an item)
          </li>
          <li>
            Quantity Sold: Quantity sold (only important for items sold in
            stacks of more than 1)
          </li>
          <li>
            Item data: A link to all our charts and stats that help you decide
            if an item is a good one to sell
          </li>
          <li>Universalis Link: A link to see the item on universalis</li>
          <li>
            NPC Vendor: A link to the vendor info if the item is sold by a
            vendor in-game
          </li>
        </ul>
        <h2 id="using-the-heatmap-tabs">Using the heatmap tabs</h2>
        <p>
          Clicking the different tabs on top of the heat map will show you
          different stats with boxes colored by price percent increase.
        </p>
        <p>
          The colors are assigned by the current min price vs the average price:
        </p>
        <ul>
          <li>Blue for out of stock</li>
          <li>
            Bright green for <code>spiking prices</code> over a 66% price
            increase
          </li>
          <li>
            Dark green for <code>increasing prices</code> 15% to 66% increase
          </li>
          <li>
            Yellow for <code>stable prices</code> around -15% to 15%
          </li>
          <li>
            Dark red for <code>decreasing prices</code> -15% to -66%
          </li>
          <li>
            Bright red for <code>crashing prices</code> under -66%
          </li>
        </ul>
        <p>
          Market Overview shows you the best items overall that earned the most
          gil:
        </p>
        {/*<p><img src="https://user-images.githubusercontent.com/17516896/225380594-5702336d-ab0a-4e73-ba41-652b09df21e3.png" alt="image"></p>*/}
        <p>
          A price percent increase is best for seeing which items are the best
          to trade, it favors out of stock which appears the largest
        </p>
        {/*<p><img src="https://user-images.githubusercontent.com/17516896/225384652-169a6ea1-c586-4a70-b9f8-87b3289c0165.png" alt="image"></p>*/}
        <p>
          This is most useful when using the <code>Sort Results by</code> option
          for the{' '}
          <a href="https://saddlebagexchange.com/ffxiv/marketshare?timePeriod=168&amp;salesAmount=3&amp;averagePrice=10000&amp;filters=0&amp;sortBy=percentChange">
            Highest Price Percent Increases Weekly
          </a>
          , which shows dozens of high value out of stock items or items at such
          a high price they might as well be out of stock.
        </p>
        {/*<p><img src="https://user-images.githubusercontent.com/17516896/225385163-50774980-edfb-43d3-b702-e818064225bf.png" alt="image"></p>*/}
        <p>
          Purchase amount shows you which items had the most individual sales
          (i.e. most people clicking buy on them) (top selling Materia often
          appear here)
        </p>
        {/*<p><img src="https://user-images.githubusercontent.com/17516896/225391244-03873838-3bb6-4676-bef2-471519e76b5b.png" alt="image"></p>*/}
        <p>
          Quantity sold shows the items sold the most bulk in the largest stacks
          (crystals appear here when you set a low price as they sell in stacks
          of 9999)
        </p>
        {/*<p><img src="https://user-images.githubusercontent.com/17516896/225391952-c11a99ec-62a8-4c60-8fac-13b804ee89e5.png" alt="image"></p>*/}
        <p>
          The other tabs will show the top median/average prices but you can get
          the same info from the statistics table below
        </p>
      </main>
    </div>
  )
}

export default ResearchPost2
