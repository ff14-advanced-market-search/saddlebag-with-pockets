// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Flip items on the FFXIV Marketboard',
    description:
      'Discover effective strategies for flipping items on the FFXIV Marketboard using Saddlebag Exchange.',
    customHeading:
      'Mastering Item Flipping: FFXIV Marketboard Strategies with Saddlebag Exchange'
  }
}

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/blog/ffxiv/howtoresell'
  }
]

const HowtoCrossServerTradeinFFXIV = () => {
  return (
    <div className={`m-12`}>
      <main className="flex-1">
        <h1 id="how-to-import-trade-and-flip-items-on-the-ffxiv-marketboard-using-saddlebag-exchange-reselling-searches">
          How to Import, Trade and Flip items on the FFXIV Marketboard using
          Saddlebag Exchange Reselling Searches
        </h1>
        <p>
          Let&#39;s say you want to earn gil by flipping vendor items or trading
          items server to server.
        </p>
        <p>
          <strong>What items should you actually buy and sell?</strong>
        </p>
        <p>
          This is the difficult part of trading items or crafting in general and
          this is why Saddlebag Exchange was founded! You can find the list of
          all our trading searches here which all use the same search function
          to display different items based on the inputs you give it. Through
          our various premade searches and your own experimentation the
          Saddlebag Exchange Import Search is designed to fit any and every
          trading need!
        </p>
        <p>
          Link:{' '}
          <a href="https://saddlebagexchange.com/queries">
            https://saddlebagexchange.com/queries
          </a>
        </p>
        <h2 id="tldr">TLDR</h2>
        <ol>
          <li>
            Pick a search from the list at:{' '}
            <a href="https://saddlebagexchange.com/queries">
              https://saddlebagexchange.com/queries
            </a>
          </li>
          <li>
            Hit search and bookmark a search if you want to change the default
            values into a custom search.
          </li>
          <li>
            Look at items on the results table. Use the{' '}
            <a href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/How-to-use-Item-Data-Searches-to-help-you-find-good-items-to-trade">
              Item Data
            </a>{' '}
            link to figure out if the item is a good one to sell and find out
            just how much gil you can realistically earn from trading it!
          </li>
          <li>Decide on some items you want to trade. </li>
          <li>
            Go in game search for the price on your home server to make sure the
            website is accurate.
          </li>
          <li>
            Travel to the server with the lowest prices and buy your items.
          </li>
          <li>
            Go to your retainers and post it on your home servers marketboard.
          </li>
          <li>Undercut until it sells.</li>
          <li>$$$ Profit $$$</li>
          <li>Go back to 1 and repeat.</li>
        </ol>
        <h2 id="starter-search-recommendations-">
          Starter Search Recommendations:
        </h2>
        <ul>
          <li>
            <a href="https://saddlebagexchange.com/queries/full-scan?hours=99&amp;salesAmount=2&amp;ROI=99&amp;minimumProfitAmount=100&amp;pricePerUnit=100&amp;filters=1,2,3,4,7&amp;hQChecked=true&amp;outOfStockChecked=true">
              Beginner Out of Stock Search
            </a>{' '}
            finds really cheap high quality gear that isn&#39;t listed on your
            market board letting you sell anything that it finds for 70k or
            more!
          </li>
          <li>
            <a href="https://saddlebagexchange.com/queries/full-scan?salesAmount=2&amp;hours=99&amp;ROI=99&amp;minimumProfitAmount=100&amp;pricePerUnit=100&amp;filters=7,54&amp;includeVendorChecked=true&amp;outOfStockChecked=true">
              Low Quality Out of Stock Search
            </a>{' '}
            similar to the Beginner Search but it mostly finds furniture and
            compares marketboard prices to vendor prices.
          </li>
          <li>
            <a href="https://saddlebagexchange.com/queries/full-scan?hours=168&amp;salesAmount=2&amp;ROI=50&amp;minimumStackSize=1&amp;minimumProfitAmount=5000&amp;pricePerUnit=3000&amp;filters=-4&amp;hQChecked=false&amp;includeVendorChecked=true&amp;outOfStockChecked=true&amp;regionWideChecked=false">
              Vendor Furnishings Search
            </a>{' '}
            for minimum effort with big returns.{' '}
          </li>
          <li>
            <a href="https://saddlebagexchange.com/queries/full-scan?hours=168&amp;salesAmount=2&amp;ROI=25&amp;minimumStackSize=1&amp;minimumProfitAmount=75000&amp;pricePerUnit=30000&amp;filters=56,65,66,67,68,69,70,71,72,81,82&amp;hQChecked=false&amp;includeVendorChecked=true&amp;outOfStockChecked=true&amp;regionWideChecked=true">
              Olivias Furnishing Items Medium Sell
            </a>{' '}
            and{' '}
            <a href="https://saddlebagexchange.com/queries/full-scan?hours=168&amp;salesAmount=2&amp;ROI=25&amp;minimumStackSize=1&amp;minimumProfitAmount=75000&amp;pricePerUnit=30000&amp;filters=75,80,90&amp;hQChecked=false&amp;includeVendorChecked=true&amp;outOfStockChecked=true&amp;regionWideChecked=true">
              Olivias Consumable Collectables Medium Sell
            </a>{' '}
            these are medium investment options that may require a few thousand
            gil to start with, but have amazing results!
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=IOrntvSEdyw">
              Watch UhhOlivias tutorial on Saddlebag Exchange for more info
            </a>
          </li>
        </ul>
        <h2 id="do-not-use-the-demand-heart-icon-">
          DO NOT USE THE DEMAND HEART ICON!
        </h2>
        <p>
          If you have not used Saddlebag Exchange before you may have traded
          using the Demand heart icon that appears next to some items.
        </p>
        {/*<p><img width="352" alt="Screen Shot 2023-02-15 at 2 41 56 PM" src="https://user-images.githubusercontent.com/17516896/219135813-47befc56-998c-4f4b-99db-38db2b93bdf8.png"></p>*/}
        <p>
          <strong>This is not a good metric to use!</strong> This icon appears
          next to items people add the item to their favorites list and does not
          reflect the actual sales performance of an item.
        </p>
        <p>
          Trading is a numbers game and you need raw statistics not a mysterious
          icon unrelated to actual sales in order to trade properly.
        </p>
        <h2 id="how-saddlebag-exchange-import-search-works-">
          How Saddlebag Exchange Import Search Works!
        </h2>
        <p>
          Our search looks at sales per hour and average sale prices to find the
          best items to trade! We then add various filters to show different
          markets and provide many trading options.
        </p>
        <p>
          We take many statistics into account, the main values we look for in
          each search come from them values you provide in the search form. We
          may find items that exceed these values, but we will filter out any
          items that don&#39;t meet your minimum requirements leaving only the
          best items in the search results:
        </p>
        {/*<p><img width="985" alt="image" src="https://user-images.githubusercontent.com/17516896/219078236-17140bdf-b235-40b1-84b7-718bdf3b6585.png"></p>*/}
        <ul>
          <li>
            Sale Rate: Calculated from the values in <code>Sale Amount</code>{' '}
            divided by the <code>Scan Hours</code>
          </li>
          <li>
            Average Sale Price: Calculated directly from the{' '}
            <code>Average Price Per Unit</code>
          </li>
          <li>
            Potential Profit: Calculated by taking your home servers current
            lowest price minus the price of the lowest listing available on
            other servers. This is then filtered out using the ROI percent (i.e.{' '}
            <code>Return on Investment</code>) and the{' '}
            <code>Minimum Profit Amount</code>.
          </li>
        </ul>
        <p>
          You can change the search with any numbers you like to find a search
          that fits your needs! You can save a custom search by bookmarking it
          in your browser or clicking the <code>Share this search</code> icon to
          copy the url link to your clipboard and share with others.
        </p>
        <p>
          <a href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/How-to-Import,-Trade-and-Flip-items-on-the-FFXIV-Marketboard-using-Saddlebag-Exchange-Import-Searches#advanced-search-options">
            There are many advanced options that are described in this section
            of our guide.
          </a>
        </p>
        <h2 id="how-to-read-search-results">How to read Search Results</h2>
        <p>
          After hitting search you will be given a big table with lots of
          information. You can rearrange the table by dragging columns and you
          can sort each column by clicking on it:
        </p>
        {/*<p><img width="1439" alt="image" src="https://user-images.githubusercontent.com/17516896/219082790-ac5d59d9-edd5-47f1-a59f-34cc0fbe809d.png"></p>*/}
        <p>Going through the columns we have: </p>
        <ul>
          <li>
            <code>Item Name</code>: Showing the english name for an item
          </li>
          <li>
            <code>Item Data</code>: This essentially tells you if this is a good
            item to trade! If you are considering trading an item clicking on
            this link is the very first thing you should do. It links to the
            Saddlebag exchange searches on that single items{' '}
            <a href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/How-to-use-Item-Data-Searches-to-help-you-find-good-items-to-trade">
              <code>&#39;Listings Comparison and Competition Metrics&#39;</code>{' '}
              and <code>&#39;Item History Statistics and Graphs&#39;</code>
            </a>
            . These two searches provide a more detailed overview of the statics
            on an item, to help you learn what price you can sell this for, what
            time of day you can sell it, what stack size to use when selling
            commodities and much, more!
          </li>
          <li>
            <code>Universalis Link</code>: This will show you the universalis
            page for an item if you prefer to view it on universalis. Saddlebag
            Exchange uses data from Universais and Universalis gets its data
            from players using{' '}
            <a href="https://goatcorp.github.io/DalamudPlugins/plugins.html">
              Dalamud Plugins
            </a>{' '}
            who crowdsource the data. If the prices of anything in the search
            results are off then you simply need to search for the item in game
            while having <code>Dalamud Plugins</code> installed and running.
            This will update universalis and then update Saddlebag Exchange to
            prevent the item from showing the incorrect value.
          </li>
          <li>
            <code>NPC Vendor Info</code>: If an item is sold by a vendor in game
            this will show you the <code>Eorzea Database</code> page with all
            details on where to find the vendor and what price they sell the
            item at. If an item is not sold by a vendor then this column will be
            empty.
          </li>
          <li>
            <code>Lowest Price Server</code>: This shows you where to find the
            lowest priced item on which server and datacenter. It will say{' '}
            <code>Sold by Vendor - None</code> if the cheapest way to get an
            item is directly from an NPC vendor.
          </li>
          <li>
            <code>Home Server Price</code>: The current lowest listing price on
            your server.
          </li>
          <li>
            <code>Lowest Price Per Unit</code>: The lowest price from the{' '}
            <code>&#39;Lowest Price Server&#39;</code>
          </li>
          <li>
            <code>Profit Amount</code>: The amount of profit you can gain from
            trading if you by at the lowest price found and sell at the current
            price on your home server. If an item is not listed on your home
            server the profit amount will appear at the top and have an{' '}
            <code>∞</code> symbol instead of a number.
          </li>
          <li>
            <code>Sale Rates</code>: This is the sales per hour when looking at
            the last 40 sales. For example a sale rate of <code>0.25</code>{' '}
            sales per hour means 6 sales per day on your home server and one
            sale on average happening once every 4 hours.
          </li>
          <li>
            <code>Average Price Per Unit</code>: The average sale price on your
            home server when looking at the last 40 sales.
          </li>
          <li>
            <code>Return on Investment</code>: This is the{' '}
            <code>&#39;Profit Amount&#39;</code> minus all costs (taxes and
            purchase price) divided by the total amount of gil earned from a
            sale at your servers current lowest listing price in a percentage.
          </li>
          <li>
            <code>Profit Percentage</code>: A less useful number this is the{' '}
            <code>&#39;Profit Amount&#39;</code> divided by{' '}
            <code>&#39;Lowest Price Per Unit&#39;</code> in a percentage.
          </li>
          <li>
            <code>Lowest Price Stack Size</code>: If the item sells in stacks of
            more than 1 then this will tell you the size of the stack at the
            lowest price (sometimes you want quantity over price and don&#39;t
            want to waste time traveling for a stack of 1 lumber).
          </li>
          <li>
            <code>Lowest Price Last Update Time</code> and{' '}
            <code>Home Server Info Last Updated At</code>: These are the last
            time universalis received data from its crowdsourcing for each data
            set. If this date is really old then you may want to go search on
            the marketboard to help universalis update its data.
          </li>
        </ul>
        <h2 id="advanced-search-options">Advanced Search Options</h2>
        <p>
          If you click the <code>Advanced Search Options</code> you will see
          more options for your search.
        </p>
        {/*<p><img width="943" alt="image" src="https://user-images.githubusercontent.com/17516896/219104245-2fb9e9ca-bf85-45b4-8e85-9c9e7635a66d.png"></p>*/}
        <ul>
          <li>
            <code>Minimum Stack Size</code> will filter out stacks in low
            amounts if you want to only buy in bulk.
          </li>
          <li>
            <code>Enable HQ only</code> if you only want to see HQ items
          </li>
          <li>
            <code>Region Wide Search</code> to search all servers in your
            region, unchecking this will only show trading options within your
            datacenter.
          </li>
          <li>
            <code>Include Out of Stock</code> if unchecked will not show out of
            stock items
          </li>
          <li>
            <code>Include Vendor Prices</code> will compare vendor prices to the{' '}
            <code>Lowest Price Server</code> value in results and show the
            vendor price if the vendor is the cheapest place to buy an item.
            This will not be shown if <code>Enable HQ only</code> is selected.
          </li>
          <li>
            <code>Filters</code> will let you filter by item category. You will
            find all main and sub categories that you find on the marketboard
            and you can get{' '}
            <a href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Item-categories-ids-and-list">
              the full explanation of these values on our wiki page about this
              subject
            </a>
            . We also have 3 custom categories we created for{' '}
            <code>Items sold by vendors</code> and also items used for various
            quests like <code>Supply and Provisioning</code> Quests and{' '}
            <code>Crafter Quest Items</code>.
          </li>
        </ul>
        {/*<p><img width="324" alt="image" src="https://user-images.githubusercontent.com/17516896/219104465-699eb0e7-b85f-49e2-96a8-912938837ab9.png"></p>*/}
      </main>
    </div>
  )
}

export default HowtoCrossServerTradeinFFXIV
