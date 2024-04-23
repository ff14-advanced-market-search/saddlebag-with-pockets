import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Updated searchParams with WoW best deals endpoints
const searchParams = {
  defaultDragonflight:
    '/wow/best-deals?type=df&itemClass=-1&itemSubClass=-1&discount=50&minPrice=2000&salesPerDay=1.1',
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
  dragonflightRecipes:
    '/wow/best-deals?type=df&itemClass=9&itemSubClass=-1&discount=50&minPrice=10000&salesPerDay=0.1',
  legacyRecipes:
    '/wow/best-deals?type=legacy&itemClass=9&itemSubClass=-1&discount=50&minPrice=10000&salesPerDay=0.1',
  illusionsAndConsumables:
    '/wow/best-deals?type=df&itemClass=0&itemSubClass=-1&discount=50&minPrice=100&salesPerDay=0.1',
  highValueToys:
    '/wow/best-deals?type=all&itemClass=15&itemSubClass=199&discount=50&minPrice=10000&salesPerDay=.1',
  mounts:
    '/wow/best-deals?type=all&itemClass=15&itemSubClass=5&discount=40&minPrice=100&salesPerDay=0.1',
  questItems:
    '/wow/best-deals?type=all&itemClass=12&itemSubClass=-1&discount=40&minPrice=1000&salesPerDay=.1',
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
    name: 'Default Dragonflight Deals',
    description: 'Find deals on current content.',
    Icon: DocumentSearchIcon,
    href: searchParams.defaultDragonflight
  },
  {
    name: 'High Value Deals',
    description:
      'Uncover high-value items across all expansions with substantial discounts.',
    Icon: DocumentSearchIcon,
    href: searchParams.highValue
  },
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
    name: 'Dragonflight Recipes',
    description:
      'Find Dragonflight recipes at a discount for crafting advancements.',
    Icon: DocumentSearchIcon,
    href: searchParams.dragonflightRecipes
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
    description:
      'Seek out deals on Dragonflight Weapon Illusions and consumable transmog.',
    Icon: DocumentSearchIcon,
    href: searchParams.illusionsAndConsumables
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
      </main>
    </>
  )
}
