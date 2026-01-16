import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: WoW Marketshare Recommendations' },
    { name: 'description', content: 'Maximizing Gold in WoW with Saddlebag Exchanges Market Overview. Master crafting, gathering, and flipping items for profit.' },
    { tagName: 'link', rel: 'canonical', href: 'https://saddlebagexchange.com/wow/marketshare/recommended' }
  ]
}

// Define the base URL for the search parameters
const BASE_URL = '/wow/marketshare'

// Updated searchParams
const searchParams = {
  // TWW
  // default
  defaultTWWSingle: `${BASE_URL}?expansionNumber=11`,
  defaultTWWCommodity: `${BASE_URL}?commodity=on&expansionNumber=11`,
  // $$$
  ultraFast: `${BASE_URL}?desiredSalesPerDay=1000000&commodity=on`,
  legacy: '/wow/legacy-marketshare',
  // default
  defaultSingleRealm: `${BASE_URL}`,
  defaultCommodity: `${BASE_URL}?commodity=on`,
  // custom
  fastSalesSingleRealm: `${BASE_URL}?desiredSalesPerDay=10`,
  fastCommodities: `${BASE_URL}?commodity=on&desiredSalesPerDay=1000`,
  valueSalesSingleRealm: `${BASE_URL}?desiredAvgPrice=30000`,
  valueCommodities: `${BASE_URL}?commodity=on&desiredAvgPrice=1000`,
  // misc
  toys: `${BASE_URL}?itemClass=15&itemSubClass=199`,
  recipes: `${BASE_URL}?itemClass=9`,
  misc: `${BASE_URL}?itemClass=15`,
  miscCommodities: `${BASE_URL}?itemClass=15&commodity=on`,
  // gear
  weapons: `${BASE_URL}?itemClass=2`,
  armor: `${BASE_URL}?itemClass=4`,
  cloth: `${BASE_URL}?itemClass=4&itemSubClass=1`,
  leather: `${BASE_URL}?itemClass=4&itemSubClass=2`,
  mail: `${BASE_URL}?itemClass=4&itemSubClass=3`,
  plate: `${BASE_URL}?itemClass=4&itemSubClass=4`,
  armorMiscellaneous: `${BASE_URL}?itemClass=4&itemSubClass=0`,
  bags: `${BASE_URL}?itemClass=1`,
  // finished goods
  itemEnhancement: `${BASE_URL}?itemClass=8&commodity=on`,
  gems: `${BASE_URL}?itemClass=3&commodity=on`,
  consumable: `${BASE_URL}?itemClass=0&commodity=on`,
  // trade goods
  tradegoods: `${BASE_URL}?itemClass=7&commodity=on`,
  partsTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=1`,
  jcTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=4`,
  clothTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=5`,
  leatherTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=6`,
  metalStoneTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=7`,
  cookingTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=8`,
  herbTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=9`,
  elementalTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=10`,
  otherTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=11`,
  enchantingTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=12`,
  inscriptionTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=16`,
  optionalReagentsTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=18`,
  finishingReagentsTradegoods: `${BASE_URL}?itemClass=7&commodity=on&itemSubClass=19`,
  // housing
  housingDecor: `${BASE_URL}?itemClass=20&itemSubClass=0`,
  housingDye: `${BASE_URL}?itemClass=20&commodity=on&itemSubClass=1`
}

// Updated recommendedQueries to reflect WoW searches
const recommendedQueries = [
  {
    name: 'TWW Single Realm',
    description:
      'See what "The War Within" items make the most gold on your realm.',
    iconType: 'magnify',
    href: searchParams.defaultTWWSingle
  },
  {
    name: 'TWW Commodity Realm',
    description:
      'See what "The War Within" items make the most gold on your region wide commodity market.',
    iconType: 'magnify',
    href: searchParams.defaultTWWCommodity
  },
  {
    name: '1 MILLION SOLD A DAY!!!',
    description: 'See what items sell over 1 million a day on your region.',
    iconType: 'magnify',
    href: searchParams.ultraFast
  },
  {
    name: 'Legacy Marketshare',
    description:
      'Find out what Legacy items are actually selling and what are the best items to sell. Shows the top 200 items matching your search.',
    iconType: 'magnify',
    href: searchParams.legacy
  },
  {
    name: 'High Value Sales Single Realm',
    description: 'Find items that have a high sales price on your realm.',
    iconType: 'magnify',
    href: searchParams.valueSalesSingleRealm
  },
  {
    name: 'High Value Commodities',
    description:
      'Identify commodities that have a high sales price on the region-wide market.',
    iconType: 'magnify',
    href: searchParams.valueCommodities
  },
  {
    name: 'Fast Sales Single Realm',
    description: 'Find items that have a high sales rate on your realm.',
    iconType: 'magnify',
    href: searchParams.fastSalesSingleRealm
  },
  {
    name: 'Fast Commodities',
    description:
      'Identify commodities that sell quickly on the region-wide market.',
    iconType: 'magnify',
    href: searchParams.fastCommodities
  },
  {
    name: 'Default Single Realm',
    description: 'See what items make the most gold on your realm.',
    iconType: 'magnify',
    href: searchParams.defaultSingleRealm
  },
  {
    name: 'Default Commodity Realm',
    description:
      'See what items make the most gold on your region wide commodity market.',
    iconType: 'magnify',
    href: searchParams.defaultCommodity
  },
  {
    name: 'Housing Decor',
    description: 'Explore housing decor items that are in demand.',
    iconType: 'magnify',
    href: searchParams.housingDecor
  },
  {
    name: 'Housing Dye Pigments',
    description: 'Find housing dye pigments on the commodity market.',
    iconType: 'magnify',
    href: searchParams.housingDye
  },
  {
    name: 'Toys',
    description: 'Discover toys that can be sold for profit.',
    iconType: 'magnify',
    href: searchParams.toys
  },
  {
    name: 'Recipes',
    description: 'Look up recipes that have high market value.',
    iconType: 'magnify',
    href: searchParams.recipes
  },
  {
    name: 'Miscellaneous',
    description: 'Explore various miscellaneous items for sale.',
    iconType: 'magnify',
    href: searchParams.misc
  },
  {
    name: 'Miscellaneous Commodities',
    description: 'Check out miscellaneous commodities that sell well.',
    iconType: 'magnify',
    href: searchParams.miscCommodities
  },
  {
    name: 'Weapons',
    description: 'Find profitable weapons on the market.',
    iconType: 'magnify',
    href: searchParams.weapons
  },
  {
    name: 'Armor',
    description: 'Explore armor pieces that are in demand.',
    iconType: 'magnify',
    href: searchParams.armor
  },
  {
    name: 'Cloth Armor',
    description: 'Discover cloth armor that can be sold.',
    iconType: 'magnify',
    href: searchParams.cloth
  },
  {
    name: 'Leather Armor',
    description: 'Check out leather armor for sale.',
    iconType: 'magnify',
    href: searchParams.leather
  },
  {
    name: 'Mail Armor',
    description: 'Check out mail armor for sale.',
    iconType: 'magnify',
    href: searchParams.mail
  },
  {
    name: 'Plate Armor',
    description: 'Identify valuable plate armor items.',
    iconType: 'magnify',
    href: searchParams.plate
  },
  {
    name: 'Miscellaneous Armor',
    description:
      'Miscellaneous: Trinkets, Rings, Necks, Spellstones, Firestones, etc.',
    iconType: 'magnify',
    href: searchParams.armorMiscellaneous
  },
  {
    name: 'Bags',
    description: 'Look up bags that are in high demand.',
    iconType: 'magnify',
    href: searchParams.bags
  },
  {
    name: 'Item Enhancements',
    description: 'Identify item enhancements that sell well.',
    iconType: 'magnify',
    href: searchParams.itemEnhancement
  },
  {
    name: 'Gems',
    description: 'Explore gems that are profitable.',
    iconType: 'magnify',
    href: searchParams.gems
  },
  {
    name: 'Consumables',
    description: 'Find consumable items that have high sales rates.',
    iconType: 'magnify',
    href: searchParams.consumable
  },
  {
    name: 'Trade Goods',
    description: 'Look up various trade goods on the market.',
    iconType: 'magnify',
    href: searchParams.tradegoods
  },
  {
    name: 'Parts Trade Goods',
    description: 'Explore parts trade goods.',
    iconType: 'magnify',
    href: searchParams.partsTradegoods
  },
  {
    name: 'Jewelcrafting Trade Goods',
    description: 'Find jewelcrafting materials on the market.',
    iconType: 'magnify',
    href: searchParams.jcTradegoods
  },
  {
    name: 'Cloth Trade Goods',
    description: 'Look up cloth materials that are in demand.',
    iconType: 'magnify',
    href: searchParams.clothTradegoods
  },
  {
    name: 'Leather Trade Goods',
    description: 'Check out leather materials for sale.',
    iconType: 'magnify',
    href: searchParams.leatherTradegoods
  },
  {
    name: 'Metal & Stone Trade Goods',
    description: 'Identify valuable metal and stone materials.',
    iconType: 'magnify',
    href: searchParams.metalStoneTradegoods
  },
  {
    name: 'Cooking Trade Goods',
    description: 'Discover cooking materials that sell well.',
    iconType: 'magnify',
    href: searchParams.cookingTradegoods
  },
  {
    name: 'Herb Trade Goods',
    description: 'Find herbs on the market.',
    iconType: 'magnify',
    href: searchParams.herbTradegoods
  },
  {
    name: 'Elemental Trade Goods',
    description: 'Explore elemental materials that are profitable.',
    iconType: 'magnify',
    href: searchParams.elementalTradegoods
  },
  {
    name: 'Other Trade Goods',
    description: 'Look up other various trade goods.',
    iconType: 'magnify',
    href: searchParams.otherTradegoods
  },
  {
    name: 'Enchanting Trade Goods',
    description: 'Find enchanting materials on the market.',
    iconType: 'magnify',
    href: searchParams.enchantingTradegoods
  },
  {
    name: 'Inscription Trade Goods',
    description: 'Discover inscription materials that sell well.',
    iconType: 'magnify',
    href: searchParams.inscriptionTradegoods
  },
  {
    name: 'Optional Reagents Trade Goods',
    description: 'Identify optional reagents for sale.',
    iconType: 'magnify',
    href: searchParams.optionalReagentsTradegoods
  },
  {
    name: 'Finishing Reagents Trade Goods',
    description: 'Explore finishing reagents that are in demand.',
    iconType: 'magnify',
    href: searchParams.finishingReagentsTradegoods
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
              Recommended Marketshare Gold Earning Queries
            </h1>
            <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {recommendedQueries.map((query) => (
                <TileLink key={query.name} {...query} />
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontSize: '1px' }}>
          Title: Maximizing Gold in WoW with Saddlebag Exchange's Market
          Overview World of Warcraft (WoW) offers endless opportunities for
          players to amass gold, but navigating the complex market can be
          daunting. Enter Saddlebag Exchange with its unique WoW Market Overview
          and WoW Commodity Shortage Predictions. These tools provide invaluable
          insights to help you make informed decisions about crafting,
          gathering, and trading items for maximum profit. In this blog, we'll
          explore how to use these features to optimize your gold-making
          strategies, whether you're a seasoned trader or a newbie looking to
          get rich in Azeroth. Understanding the Market Overview The Market
          Overview on Saddlebag Exchange is your gateway to understanding which
          items are worth your time and effort. Here's a quick guide: Bright
          Green Boxes: Indicates high current market value. These items are
          prime candidates for crafting or gathering. Bright Red Boxes: Steer
          clear of these; they’re usually unprofitable. Key Strategies: Sell
          When Green: Items with a green price overview have surged in price,
          signaling a profitable opportunity. Monitor Quantities: Items low in
          quantity may soon see a price spike. Use the Commodity Shortage
          Predictions to stay ahead of these trends. Saving Gold and Profession
          Knowledge Points Investing in your profession wisely can save you tons
          of gold and maximize your profits. Here’s how to decide where to spend
          your skill points: Avoid Small Markets: If an item is rarely sold,
          like Illusory Adornment: Order, it's not worth your points. Focus on
          High-Value Items: Invest in lucrative crafts like Enchant Bracer -
          Devotion of Speed which brings in millions daily. Flipping and
          Investing in Non-Commodities For items that aren't commodities and
          only available on your realm, adjust your approach: Lower Default Sale
          Rate: Focus on slow-selling, high-value items such as epic BOAs or
          rare recipes. Watch for Spikes: Local items often see price spikes,
          making them ideal for flipping. Use the WoW Discord Price Sniper and
          Price Spike Alerts to catch these items at low prices and sell high.
          Utilizing the Dragonflight Auction House Marketshare Overview The
          Dragonflight Auction House Marketshare Overview offers a comprehensive
          view of valuable items in the market. Here’s how to make the most of
          it: Select Your Items: Begin by choosing items you're interested in.
          Default settings highlight the most valuable markets. Adjust Sale
          Rates and Prices: Customize the average sale rate and price to filter
          items that meet your trading criteria. Category Filters: Tailor the
          view to your profession – whether you're an enchanter, tailor,
          alchemist, or gatherer. Key Metrics to Watch: Current vs. Historic
          Market Value: Understand market trends by comparing current prices to
          historical averages. Market State Colors: Bright green indicates a
          spike, dark green means increasing, yellow is stable, dark red is
          decreasing, and bright red is crashing. Sales and Prices: Check sales
          per day and minimum prices to gauge demand and profitability.
          Conclusion: Master the Market with Saddlebag Exchange By leveraging
          the tools and strategies outlined above, you can dominate the WoW
          market, making gold hand over fist. Saddlebag Exchange's Market
          Overview and Commodity Shortage Predictions are indispensable
          resources for any serious trader. Ready to turn your WoW market savvy
          into gold? Dive into the WoW Market Overview today and start crafting,
          gathering, and flipping like a pro! 1. Overview of Saddlebag Exchange
          Navigating the complex and ever-changing world of World of Warcraft
          can be a daunting task, especially when it comes to maximizing your
          gold. That's why we're here to provide a comprehensive market overview
          of the Saddlebag Exchange and delve into the strategies you can use to
          squeeze every last drop of gold out of your WoW experience. From the
          best hardcore addons to the top sod addons, we've got you covered. So
          gear up, sharpen your skills, and get ready to dominate the gold
          market in WoW! 2. Understanding the WoW gold market Understanding the
          WoW gold market is essential for any player looking to optimize their
          earning potential. By closely monitoring market trends, evaluating
          supply and demand dynamics, and staying informed on popular item
          prices, you can make informed decisions to maximize your gold
          accumulation. Leveraging your knowledge of the market can give you a
          competitive edge and help you identify lucrative opportunities for
          investment and profit. Stay tuned as we dive deeper into specific
          strategies and techniques to navigate the intricate world of the WoW
          gold market effectively. Remember, knowledge is power in the quest for
          gold supremacy in World of Warcraft! 3. Targeting high-demand items To
          further boost your gold accumulation in WoW, it's crucial to target
          high-demand items within the market. Identify sought-after items that
          players frequently seek and are willing to pay a premium for. Whether
          it's rare crafting materials, popular transmog items, or in-demand
          gear, focusing on these items can lead to significant profits. Keep a
          close eye on the market trends and adjust your inventory accordingly
          to capitalize on the fluctuations in demand. By strategically stocking
          up on high-demand items, you can ensure a steady flow of gold into
          your coffers and stay ahead in the competitive realm of World of
          Warcraft. Stay tuned for more insights on maximizing your gold through
          smart trading strategies. 4. Capitalizing on market trends
          Capitalizing on market trends is essential for maximizing your gold in
          WoW. Monitoring the market regularly allows you to identify when
          prices fluctuate, creating opportunities for substantial profits. Stay
          informed about popular items and their demand levels, adjusting your
          inventory to meet the current trends. Take advantage of special events
          or updates that may impact the market, such as new content releases or
          changes in gameplay mechanics. By staying ahead of the curve and
          adapting your trading strategies accordingly, you can effectively
          leverage market trends to boost your gold accumulation and achieve
          success in the competitive landscape of World of Warcraft. Stay
          proactive and informed to make the most of your trading endeavors. 5.
          Utilizing auction house strategies Utilizing auction house strategies
          is a fundamental aspect of optimizing your gold in WoW. Take advantage
          of the auction house to sell your items at competitive prices and
          efficiently reach potential buyers. Pricing your goods strategically,
          considering market demand and competition, can help you secure
          profitable sales. Additionally, consider diversifying your offerings
          to appeal to a wider range of customers. Keep a keen eye on the
          auction house trends, adjusting your listings accordingly to stay
          ahead of the competition. By mastering auction house strategies, you
          can enhance your gold-making potential and establish a strong foothold
          in WoW's dynamic marketplace. Make informed decisions and track your
          progress to continuously refine your auction house approach. 6.
          Diversifying your investments Diversifying your investments is a key
          strategy to further capitalize on your gold-making potential in WoW.
          Expand your portfolio by investing in a variety of items across
          different categories to mitigate risks and optimize profits. Consider
          spreading your investments across high-demand items, transmog pieces,
          crafting materials, and other niche markets to cater to a wide
          customer base. By diversifying your offerings, you can tap into
          various gold-making opportunities and adapt to shifting market
          dynamics. Stay proactive in monitoring market trends and adjusting
          your investment strategy accordingly to maintain a lucrative balance
          in your WoW financial operations. Embrace diversification as a
          powerful tool in your quest for gold abundance in the Saddlebag
          Exchange's market. 7. Staying ahead of the competition Staying ahead
          of the competition is crucial for maximizing your gold in WoW.
          Continuously research the market to identify emerging trends and
          popular items. By staying informed, you can anticipate market shifts
          and make strategic decisions to maintain a competitive edge. Engage
          with the WoW community, network with other players, and participate in
          trade groups to gather valuable insights and stay updated on the
          latest happenings in the Saddlebag Exchange. Additionally, establish a
          reputation for reliability and customer satisfaction to attract and
          retain a loyal customer base. Stay proactive and adaptable in your
          approach to ensure long-term success in the dynamic world of
          gold-making in WoW. 8. Conclusion: Driving success with strategic gold
          maximizing efforts Expanding your wealth in WoW's Saddlebag Exchange
          requires a proactive and strategic approach. By dedicating time to
          market research, networking, and reputation-building, you can position
          yourself for success in the competitive gold-making landscape. Embrace
          a mindset of continuous learning and adaptation to capitalize on
          emerging trends and opportunities. By staying engaged with the WoW
          community and setting high standards for customer service, you can
          build a strong foundation for your gold-making ventures. Remember,
          consistency and dedication are key to long-term success in the dynamic
          world of WoW economy. Implement these strategies diligently and watch
          your gold reserves grow exponentially. final fantasy xiv pricing, ff14
          prices, ff14 cost, ff14 moogle shop, ffxiv materia, ff14 auction
          house, ff14 excalibur, ffxiv web, ffxiv auction house, ffxiv website,
          auction house ffxiv, ffxiv mb, ffxiv websites, auction house ff14,
          materia ffxiv, ffxiv site, ff14 websites, ffxiv house prices, ff14
          house prices, ffxiv housing prices, ffxiv data, ff14 housing prices,
          ff13 weapons upgrade guide, ffxiv character search, final fantasy xiv
          sale, universalis ffxiv, choco bo, xiv server status, final fantasy 14
          online server status, marketboard ffxiv, final fantasy 14 market
          board, ff14 maintenance, ffxiv server status.
        </p>
      </main>
    </>
  )
}
