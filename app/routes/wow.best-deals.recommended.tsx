import { DocumentSearchIcon } from '@heroicons/react/outline'
import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { viewport: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: WoW Best Deals Recommendations' },
    {
      name: 'description',
      content: 'Saddlebag Exchange: WoW Amazing Auction House Deals'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/wow/best-deals/recommended'
    }
  ]
}

// Updated searchParams with WoW best deals endpoints
const searchParams = {
  defaultTWW:
    '/wow/best-deals?type=df&itemClass=-1&itemSubClass=-1&discount=50&minPrice=2000&salesPerDay=1.1&expansionNumber=11',
  highValue:
    '/wow/best-deals?type=all&itemClass=-1&itemSubClass=-1&discount=50&minPrice=100000&salesPerDay=1',
  transmogWeapons:
    '/wow/best-deals?type=legacy&itemClass=2&itemSubClass=-1&discount=50&minPrice=10000&salesPerDay=0.1',
  transmogGear:
    '/wow/best-deals?type=legacy&itemClass=4&itemSubClass=-1&discount=50&minPrice=10000&salesPerDay=0.1',
  ultraCheapDeals:
    '/wow/best-deals?type=all&itemClass=-1&itemSubClass=-1&discount=99&minPrice=100&salesPerDay=0.1',
  superFastSelling:
    '/wow/best-deals?type=all&itemClass=-1&itemSubClass=-1&discount=50&minPrice=1&salesPerDay=100',
  recipesTWW:
    '/wow/best-deals?type=df&itemClass=9&itemSubClass=-1&discount=50&minPrice=10000&salesPerDay=0.1&expansionNumber=11',
  legacyRecipes:
    '/wow/best-deals?type=legacy&itemClass=9&itemSubClass=-1&discount=50&minPrice=10000&salesPerDay=0.1',
  illusionsAndConsumables:
    '/wow/best-deals?type=df&itemClass=0&itemSubClass=-1&discount=50&minPrice=100&salesPerDay=0.1',
  housingDecor:
    '/wow/best-deals?type=all&itemClass=20&itemSubClass=0&discount=50&minPrice=1000&salesPerDay=0.1',
  highValueToys:
    '/wow/best-deals?type=all&itemClass=15&itemSubClass=199&discount=50&minPrice=10000&salesPerDay=.1',
  mounts:
    '/wow/best-deals?type=all&itemClass=15&itemSubClass=5&discount=40&minPrice=100&salesPerDay=0.1',
  questItems:
    '/wow/best-deals?type=all&itemClass=12&itemSubClass=-1&discount=40&minPrice=1000&salesPerDay=.1',
  cheapPetDeals:
    '/wow/best-deals?type=pets&itemClass=-1&itemSubClass=-1&discount=90&minPrice=100&salesPerDay=0.1',
  mediumValuePetDeals:
    '/wow/best-deals?type=pets&itemClass=-1&itemSubClass=-1&discount=50&minPrice=1000&salesPerDay=5',
  highValuePetDeals:
    '/wow/best-deals?type=pets&itemClass=-1&itemSubClass=-1&discount=50&minPrice=10000&salesPerDay=0.1',
  uncagedPetsItem:
    '/wow/best-deals?type=all&itemClass=15&itemSubClass=2&discount=40&minPrice=1000&salesPerDay=0.1',
  holidayItem:
    '/wow/best-deals?type=all&itemClass=15&itemSubClass=3&discount=50&minPrice=100&salesPerDay=0.1',
  fastSellingMiscellaneous:
    '/wow/best-deals?type=all&itemClass=15&itemSubClass=4&discount=50&minPrice=1&salesPerDay=5',
  otherMiscellaneous:
    '/wow/best-deals?type=all&itemClass=15&itemSubClass=4&discount=50&minPrice=10&salesPerDay=1'
}

// Updated recommendedQueries to reflect WoW searches
const recommendedQueries = [
  {
    name: 'Ultra Cheap Deals (Beginner Friendly / Low Risk)',
    description:
      'Scout for ultra-cheap deals across all categories with the highest discounts.',
    Icon: DocumentSearchIcon,
    href: searchParams.ultraCheapDeals
  },
  {
    name: 'Fast Selling Items (Beginner Friendly / Low Risk)',
    description:
      'Spot the fastest selling items in the market with minimal investment. (Mostly bags)',
    Icon: DocumentSearchIcon,
    href: searchParams.superFastSelling
  },
  {
    name: 'Default TWW Deals',
    description: 'Find deals on current content.',
    Icon: DocumentSearchIcon,
    href: searchParams.defaultTWW
  },
  {
    name: 'Cheap Pet Deals',
    description:
      'Find cheap battle pets. Good for cross realm trading on one wow account.',
    Icon: DocumentSearchIcon,
    href: searchParams.cheapPetDeals
  },
  // {
  //   name: 'High Value Deals',
  //   description:
  //     'Uncover high-value items across all expansions with substantial discounts.',
  //   Icon: DocumentSearchIcon,
  //   href: searchParams.highValue
  // },
  {
    name: 'Transmog Weapons',
    description: 'Find discount deals on legacy transmog weapons.',
    Icon: DocumentSearchIcon,
    href: searchParams.transmogWeapons
  },
  {
    name: 'Transmog Gear',
    description:
      'Discover great discounts on legacy transmog gear for your collection.',
    Icon: DocumentSearchIcon,
    href: searchParams.transmogGear
  },
  {
    name: 'TWW Recipes',
    description: 'Find TWW recipes at a discount for crafting advancements.',
    Icon: DocumentSearchIcon,
    href: searchParams.recipesTWW
  },
  {
    name: 'Legacy Recipes',
    description:
      'Acquire legacy recipes for your collection or crafting needs at a discount.',
    Icon: DocumentSearchIcon,
    href: searchParams.legacyRecipes
  },
  {
    name: 'Illusions and Consumables',
    description: 'Seek out deals on Weapon Illusions and consumable transmog.',
    Icon: DocumentSearchIcon,
    href: searchParams.illusionsAndConsumables
  },
  {
    name: 'Housing Decor',
    description:
      'Find discounted housing decor items to furnish your player home.',
    Icon: DocumentSearchIcon,
    href: searchParams.housingDecor
  },
  {
    name: 'High Value Toys',
    description:
      'Explore toys with high value and rarity across expansions at a discount.',
    Icon: DocumentSearchIcon,
    href: searchParams.highValueToys
  },
  {
    name: 'Mounts',
    description: 'Pursue discounts on mounts to travel Azeroth in style.',
    Icon: DocumentSearchIcon,
    href: searchParams.mounts
  },
  {
    name: 'Quest Items',
    description: 'Brawlers Passes, Darkmoon Fair Items, etc.',
    Icon: DocumentSearchIcon,
    href: searchParams.questItems
  },
  {
    name: 'Medium Value Pet Deals',
    description: 'Find pets with medium value and ok sale rate.',
    Icon: DocumentSearchIcon,
    href: searchParams.mediumValuePetDeals
  },
  {
    name: 'High Value Pet Deals',
    description:
      'Seek out high-value pets to add rare companions to your collection.',
    Icon: DocumentSearchIcon,
    href: searchParams.highValuePetDeals
  },
  {
    name: 'Uncaged Pets',
    description:
      'These are items that when consumed become a pet in your journal.  The same as getting a level 1 pet.',
    Icon: DocumentSearchIcon,
    href: searchParams.uncagedPetsItem
  },
  {
    name: 'Holiday Items',
    description: 'Discover festive holiday items to celebrate seasonal events.',
    Icon: DocumentSearchIcon,
    href: searchParams.holidayItem
  },
  {
    name: 'Fast Selling Miscellaneous',
    description:
      'Identify quickly selling miscellaneous items like Sturdy Expedition Shovel, Zapthrottle Soul Inhaler, etc.',
    Icon: DocumentSearchIcon,
    href: searchParams.fastSellingMiscellaneous
  },
  {
    name: 'Other Miscellaneous',
    description:
      'Find unique and random items, including trading post parts, books, and keys.',
    Icon: DocumentSearchIcon,
    href: searchParams.otherMiscellaneous
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
              Recommended WoW Best Deals Queries
            </h1>
            <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {recommendedQueries.map((query) => (
                <TileLink key={query.name} {...query} />
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontSize: '1px' }}>
          Title: Unveiling the Saddlebag Exchange: Your Gateway to World of
          Warcraft Auction House Riches Are you an avid World of Warcraft player
          looking to maximize your gold-making potential? Look no further than
          the Saddlebag Exchange! This revolutionary tool harnesses the power of
          TradeSkillMaster (TSM) to scout out the best auction house deals
          across all realms in your region, ensuring you never miss out on a
          lucrative opportunity again. What is the Saddlebag Exchange? The
          Saddlebag Exchange is your ultimate companion for navigating the
          bustling marketplace of Azeroth. By leveraging TSM's sale rate and
          average prices, this tool scours the auction house for the most
          tantalizing discounts, allowing you to buy low and sell high with
          ease. Whether you're a seasoned trader or a novice adventurer, the
          Saddlebag Exchange has something for everyone. Recommended WoW Best
          Deals Queries Let's take a closer look at some of the most valuable
          searches offered by the Saddlebag Exchange: Ultra Cheap Deals
          (Beginner Friendly / Low Risk): Unearth hidden gems selling at a 99%
          to 100% discount, including coveted items like pets, transmog gear,
          and more, all for just 1 silver or 0.01 gold! Fast Selling Items
          (Beginner Friendly / Low Risk): Identify the hottest-selling items on
          the market with minimal investment, perfect for stocking up on bags
          and other essentials. Default The War Within TWW Deals: Discover
          discounted deals on current content items, keeping you ahead of the
          curve in the latest adventures. Cheap Pet Deals: Find affordable
          battle pets ideal for cross-realm trading, expanding your collection
          without breaking the bank. Transmog Weapons & Gear: Build your
          transmog collection with legacy weapons and gear at unbeatable prices,
          adding style to your adventures across Azeroth. Dragonflight & Legacy
          Recipes: Unlock crafting advancements with discounted recipes, fueling
          your journey towards mastery. Illusions and Consumables: Enhance your
          weaponry with Dragonflight Weapon Illusions and other consumable
          transmog items, all at a fraction of the cost. High Value Toys &
          Mounts: Obtain rare and valuable toys and mounts to showcase your
          wealth and prestige in-game. Quest Items & Holiday Treasures: Prepare
          for seasonal events and special quests with discounted items, ensuring
          you never miss a celebration. Medium & High Value Pet Deals: Expand
          your pet collection with creatures of varying worth, from affordable
          companions to rare and valuable additions. Uncaged Pets & Fast Selling
          Miscellaneous: Snatch up pets and miscellaneous items with high sale
          rates, ensuring swift turnover and profits. Other Miscellaneous:
          Explore a treasure trove of unique and random items, from trading post
          parts to arcane keys, offering endless possibilities for profit.
          Conclusion With the Saddlebag Exchange by your side, the world of
          Warcraft auction house is yours to conquer. Whether you're seeking
          riches, rare treasures, or simply looking to expand your collection,
          this indispensable tool has everything you need to succeed. Say
          goodbye to missed opportunities and hello to a new era of wealth and
          prosperity in Azeroth! Title: Unleash Your Inner Auction House Mogul
          with the Saddlebag Exchange Are you ready to take your World of
          Warcraft trading game to the next level? Look no further than the
          Saddlebag Exchange, your gateway to untold riches and treasures from
          across Azeroth! Whether you're a seasoned veteran or a newcomer to the
          bustling auction house scene, this powerful tool is your key to
          success. Introducing the Saddlebag Exchange The Saddlebag Exchange is
          more than just a tool—it's a game-changer for WoW entrepreneurs.
          Powered by TradeSkillMaster (TSM), this innovative platform scours the
          auction houses of every realm in your region, uncovering the best
          deals and discounts with unparalleled precision. Say goodbye to
          endless scrolling and missed opportunities— with the Saddlebag
          Exchange, the best bargains are just a click away. Unlocking the Best
          Deals Let's delve into some of the most valuable features offered by
          the Saddlebag Exchange: Ultra Cheap Deals: Discover hidden treasures
          selling at jaw-dropping discounts of up to 99% to 100%. From rare pets
          to coveted transmog gear, these deals are guaranteed to turn a profit.
          Fast Selling Items: Identify the hottest-selling commodities on the
          market, from essential bags to in-demand consumables. With minimal
          investment, you can maximize your profits and keep your coffers
          overflowing. Dragonflight Delights: Stay ahead of the curve with
          discounted deals on current content items. Whether you're gearing up
          for battle or crafting the latest recipes, the Saddlebag Exchange has
          you covered. Pet Paradise: Build your collection with a menagerie of
          affordable battle pets. From common critters to rare companions,
          there's something for every pet enthusiast. Transmog Treasures:
          Transform your appearance with discounted transmog weapons and gear.
          Whether you're seeking timeless classics or unique treasures, the
          Saddlebag Exchange has the perfect piece for every adventurer. Recipe
          Roulette: Expand your crafting repertoire with discounted recipes from
          across Azeroth. From Dragonflight specialties to legacy classics,
          there's no limit to what you can create. Toys and Mounts Galore:
          Elevate your adventures with rare and valuable toys and mounts. From
          whimsical playthings to majestic steeds, these treasures are sure to
          impress. Holiday Hoard: Celebrate seasonal events in style with
          discounted holiday items. From festive decorations to special quest
          items, the Saddlebag Exchange ensures you're always prepared for the
          next celebration. Conclusion: Forge Your Path to Wealth and Glory With
          the Saddlebag Exchange at your fingertips, the auction house is your
          playground. Whether you're a savvy trader or a budding entrepreneur,
          this indispensable tool is your ticket to success in the world of
          Warcraft. So don your finest gear, sharpen your wits, and prepare to
          conquer the markets like never before. The treasures of Azeroth
          await—will you seize them? Title: Master the Auction House with the
          Saddlebag Exchange: Your Key to WoW Wealth Are you tired of trawling
          through the World of Warcraft auction house in search of the perfect
          deal? Say goodbye to endless scrolling and missed
          opportunities—introducing the Saddlebag Exchange, your ultimate
          companion for navigating the bustling markets of Azeroth. Powered by
          TradeSkillMaster (TSM), this game-changing tool puts the power of
          wealth and fortune at your fingertips. Unveiling the Saddlebag
          Exchange The Saddlebag Exchange isn't just another auction house
          addon—it's a revolution in WoW trading. By harnessing the unparalleled
          capabilities of TSM, this cutting-edge platform scours every corner of
          the auction house, uncovering the most lucrative deals and discounts
          across all realms in your region. Whether you're a seasoned trader or
          a newcomer to the world of Warcraft commerce, the Saddlebag Exchange
          is your key to success. Explore the Best Deals Let's take a closer
          look at some of the invaluable features offered by the Saddlebag
          Exchange: Ultra Cheap Deals: Discover hidden treasures selling at
          jaw-dropping discounts of up to 99% to 100%. From rare pets to coveted
          transmog gear, these deals are a goldmine waiting to be exploited.
          Fast Selling Items: Identify high-demand commodities with minimal
          investment, ensuring swift turnover and maximum profits. Stock up on
          essential bags and consumables to keep your gold flowing. Current
          Content Discounts: Stay ahead of the curve with discounted deals on
          the latest content items. Whether you're gearing up for battle or
          crafting the latest recipes, the Saddlebag Exchange has you covered.
          Pet Paradise: Build your collection with a diverse array of affordable
          battle pets. From common critters to rare companions, there's
          something for every pet enthusiast. Transmog Treasures: Transform your
          appearance with discounted transmog weapons and gear. Whether you're
          seeking timeless classics or unique treasures, the Saddlebag Exchange
          has the perfect piece for every adventurer. Recipe Roulette: Expand
          your crafting repertoire with discounted recipes from across Azeroth.
          From Dragonflight specialties to legacy classics, there's no limit to
          what you can create. Holiday Hoard: Prepare for seasonal events with
          discounted holiday items. From festive decorations to special quest
          items, the Saddlebag Exchange ensures you're always ready to celebrate
          in style. Conclusion: Seize Your Destiny With the Saddlebag Exchange
          by your side, the world of Warcraft auction house is yours to conquer.
          Whether you're a seasoned trader or a budding entrepreneur, this
          indispensable tool is your key to unlocking untold riches and
          treasures. So don your finest gear, sharpen your wits, and prepare to
          embark on a journey to wealth and glory in Azeroth. The markets
          await—will you seize your destiny? Title: Revolutionize Your WoW
          Trading Experience with the Saddlebag Exchange Are you ready to
          elevate your World of Warcraft trading game to legendary heights? Look
          no further than the Saddlebag Exchange—a game-changing tool designed
          to revolutionize your auction house experience. Powered by
          TradeSkillMaster (TSM), this innovative platform is your ticket to
          unlocking the vast potential of Azeroth's bustling markets.
          Introducing the Saddlebag Exchange The Saddlebag Exchange isn't just
          another addon—it's a complete paradigm shift in WoW trading. Gone are
          the days of manual searching and missed opportunities. With the
          Saddlebag Exchange, you have access to real-time data and unparalleled
          insights, ensuring you always stay one step ahead of the competition.
          Uncover Hidden Treasures Let's dive into some of the incredible
          features that make the Saddlebag Exchange a must-have tool for any
          serious trader: Ultra Cheap Deals: Discover unbelievable discounts of
          up to 99% to 100% on a wide range of items, from rare pets to
          sought-after transmog gear. With prices this low, the only way to go
          is up! Fast Selling Items: Identify high-demand products with
          lightning speed, allowing you to capitalize on trends and maximize
          your profits. Whether it's bags, consumables, or current content
          items, the Saddlebag Exchange has you covered. Pet Paradise: Expand
          your collection with a diverse selection of battle pets, all available
          at unbeatable prices. From common critters to rare companions, there's
          something for every pet enthusiast. Transmog Treasures: Transform your
          appearance with discounted transmog weapons and gear. With deals on
          legacy classics and unique pieces, you can create a look that's truly
          your own. Recipe Roulette: Master the art of crafting with discounted
          recipes from across Azeroth. Whether you're a seasoned chef or a
          budding alchemist, the Saddlebag Exchange has the ingredients you need
          for success. Holiday Hoard: Prepare for seasonal events with
          discounted holiday items and quest materials. From festive decorations
          to rare collectibles, the Saddlebag Exchange ensures you're always
          ready to celebrate in style. Conclusion: Forge Your Destiny in Azeroth
          With the Saddlebag Exchange by your side, the world of Warcraft
          auction house becomes your playground. Whether you're a seasoned
          trader or a newcomer to the scene, this indispensable tool empowers
          you to achieve your trading goals with confidence and ease. So don
          your best gear, sharpen your instincts, and embark on a journey to
          riches and glory in the world of Azeroth. The markets await—are you
          ready to seize your destiny?
        </p>
      </main>
    </>
  )
}
