// Locally authored guides stay separate from the generated GitHub wiki content.
export const marketGuides = {
  'ffxiv/patch-market-guide': {
    category: 'ffxiv',
    slug: 'patch-market-guide',
    title: 'FFXIV Patch Markets: How to Find Items Worth Selling',
    description:
      'Find FFXIV patch trading opportunities using completed sales, competition and material costs instead of launch-day listing prices.',
    markdown: `A patch changes what players buy, but a high listing price alone does not tell you what to craft or stockpile. Build a short list from observed demand, then check whether you can sell at a worthwhile margin on your home world.

## Before the patch: build a shortlist

Read the official patch notes and identify recipes, equipment or activities that actually consume tradable items. Separate confirmed changes from speculation. Use the [FFXIV market overview](/ffxiv/marketshare/queries) to investigate those markets rather than buying every material mentioned in a preview.

For each candidate, record your home world, HQ or NQ, recent completed-sale prices, quantity sold and the price you would pay for inputs. Keeping the same world and quality makes later comparisons meaningful.

## At launch: check sales before following a price spike

Open an item's price history from the [item list](/ffxiv/itemlist). Compare completed transactions with current listings. One expensive listing with no matching purchases is not evidence that buyers will pay that price.

Compare the available windows before and after launch. Ask whether more units are selling, whether the typical paid price changed, and whether competing listings increased faster than demand. Crowdsourced data can lag; check freshness before spending gil.

## Decide what is worth producing

Use [Crafting Profit Simulator](/ffxiv/craftsim/queries) for a candidate you can make. Include market fees, material costs and the value of materials you gathered yourself. Start with a small batch; increase it only if actual sales justify it.

If you are buying on another world, allow for travel and relisting time. Read the [cross-server trading guide](/blog/ffxiv/howtoresell) before treating a price gap as profit.

## After the rush

Use [weekly price changes](/ffxiv/weekly-price-group-delta) to revisit the shortlist. Falling prices can erase a margin even while sales remain strong. Reduce stock when your own sales slow instead of assuming patch-week prices will return.

This is a repeatable market-checking method, not a live ranking of the best items. For deciding whether to gather rather than craft, see [is an FFXIV item worth farming?](/blog/ffxiv/is-an-item-worth-farming).`
  },
  'wow/season-market-guide': {
    category: 'wow',
    slug: 'season-market-guide',
    title: 'WoW Season Gold Making: How to Evaluate Auction House Markets',
    description:
      'Evaluate WoW season and patch markets using your region, realm, competition and realistic sale proceeds before buying inventory.',
    markdown: `A new WoW season can change demand for gear, consumables and crafting materials. The useful question is whether a specific market has buyers at a price that covers your costs, not whether an item has an impressive asking price.

## Match the market to your region and realm

Set your US or EU region and home realm before comparing prices. Do not assume a quote from another region represents your market. Commodity and realm-specific item markets need different comparisons; check the selected market in the result before acting.

Start with the [WoW market overview](/wow/marketshare/recommended) and open candidates through the [WoW item list](/wow/itemlist). Compare the available price and competition statistics. Estimates are useful filters, not a promise that your auction will sell.

## Look for a reason people will buy

Use official patch notes to identify confirmed changes affecting a material or item. Check whether the item is tradable and relevant to the current activity. A new season does not make every old crafted item or rare drop more valuable.

Use [weekly price changes](/wow/weekly-price-group-delta) to investigate movement. A rising price can reflect demand or a shortage of listings. Look at the other available market statistics before buying a large quantity.

## Calculate a conservative margin

Compare your acquisition cost with a realistic sale price after auction cuts and expected deposit losses. Allow for unsold inventory and undercutting. A cheap listing on another realm is only a candidate; verify that you can move and sell the item before purchasing it.

For example, buying an item for 10,000 gold and listing it for 15,000 gold does not establish 5,000 gold of profit. The sale must happen, fees reduce the proceeds, and your time has a cost. These numbers are illustrative, not current market quotes.

## Test before scaling

Buy or farm a small batch and track your own completed sales. Recheck the market as the season progresses instead of carrying launch-day assumptions into quieter weeks.

Read [is a WoW item worth farming?](/blog/wow/is-an-item-worth-farming) for a time-based comparison, or the [cross-realm trading guide](/blog/wow/crossrealm1) for moving inventory between markets.`
  },
  'ffxiv/is-an-item-worth-farming': {
    category: 'ffxiv',
    slug: 'is-an-item-worth-farming',
    title: 'Is an FFXIV Item Worth Farming? Check Sales, Price and Time',
    description:
      'Estimate whether an FFXIV item is worth gathering or farming using completed sales, obtainable quantity, competition and gil per hour.',
    markdown: `An item listed for a million gil is not necessarily a good farm. A lower-priced material that sells regularly may produce more usable gil for the same play time.

## Check what buyers actually paid

Find the item in the [FFXIV item list](/ffxiv/itemlist), then compare completed-sale prices with listings on your home world. Keep HQ and NQ separate. A rare outlier transaction should not be your expected sale price.

Check both quantity sold and number of purchases. One bulk transaction is different from many independent buyers. Consider the stack sizes that sell and how much competing inventory is already listed. [The item data guide](/blog/guides/how-to-use-item-data-searches-to-help-you-find-good-items-to-trade) explains these statistics.

## Measure your own yield

Run a short timed farming session. Include travel and setup in the time, and count the tradable units you actually obtained. For rare drops, a lucky short session is not a reliable long-term drop-rate estimate.

Estimated gil per hour = units obtained per hour × realistic net sale price per unit − hourly costs.

For an illustrative example, 120 units per hour at 500 gil after fees gives 60,000 gil per hour before other costs, provided you can sell all 120. If the market can only absorb a small part of that stock, realized earnings will be lower and slower. These are example numbers, not a current recommendation.

## Compare alternatives before committing

Consider gathering, crafting with the material, selling existing inventory, or buying the item instead. Gathered materials have an opportunity cost: using them in a craft gives up the proceeds from selling them directly.

List a small batch and record the time until it sells. Revisit the calculation when patch demand or competition changes. [Patch-market checks](/blog/ffxiv/patch-market-guide) can help distinguish a temporary rush from a repeatable farm.

If the history is stale or sparse, mark the result as uncertain. Wait for better evidence rather than treating a high listing price as guaranteed income.`
  },
  'wow/is-an-item-worth-farming': {
    category: 'wow',
    slug: 'is-an-item-worth-farming',
    title: 'Is a WoW Item Worth Farming? Estimate Gold per Hour',
    description:
      'Compare WoW farming opportunities using realistic auction proceeds, your measured yield, fees and the risk of slow-selling inventory.',
    markdown: `A rare item can have a high auction price and still be a poor source of spendable gold. Evaluate how often you obtain it, what buyers might realistically pay, and how long your inventory may sit unsold.

## Start with the correct auction market

Choose your US or EU region and realm, then find the item in the [WoW item list](/wow/itemlist). Check the available price and market statistics. An asking price or estimated sale rate is not a completed sale of your item.

For a commodity, compare the market you can actually sell into. For equipment or other realm-dependent inventory, do not assume another realm's price is obtainable at home. Confirm the item is tradable before counting it as auction income.

## Separate production from sell-through

Measure units obtained during a timed session, including travel and setup. For rare drops, use a sufficiently long record or treat your yield estimate as uncertain. Getting one drop in ten minutes does not prove you will get six every hour.

Potential gold per hour = units obtained per hour × expected net sale price − hourly costs.

Illustrative example: 200 materials per hour at 40 gold after auction cuts gives 8,000 gold per hour before other costs if the entire batch sells. Ten items valued at 800 gold each are not equivalent to 8,000 gold in completed sales. These numbers explain the calculation; they are not live market prices.

## Account for the cost of waiting

Allow for auction cuts, deposits lost on unsuccessful listings, relisting time and competition. Slow-selling transmog may suit a patient seller with diverse inventory but not someone who needs gold immediately.

Test a small batch and track your own sales. Compare gold actually received against time spent farming and managing auctions, not just the total listed value.

## Recheck around new seasons

Use [weekly price changes](/wow/weekly-price-group-delta) to investigate movement and the [season-market guide](/blog/wow/season-market-guide) to review the demand behind it. A farm that worked at launch may no longer cover its costs after supply increases.`
  }
}

export const marketGuidePosts = Object.fromEntries(
  Object.entries(marketGuides).map(([key, guide]) => {
    const { markdown: _markdown, ...post } = guide
    return [
      key,
      {
        ...post,
        component: 'MarketGuide',
        canonical: `https://saddlebagexchange.com/blog/${key}`
      }
    ]
  })
)
