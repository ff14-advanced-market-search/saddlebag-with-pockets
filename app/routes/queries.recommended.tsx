import { DocumentSearchIcon } from '@heroicons/react/outline'
import {
  COMMODITY_SCAN_PATH,
  FAST_SCAN_PATH,
  MEGA_VALUE_PATH,
  NQ_OUT_OF_STOCK_PATH,
  OLIVIA_10_PATH,
  OLIVIA_11_PATH,
  OLIVIA_1_PATH,
  OLIVIA_2_PATH,
  OLIVIA_3_PATH,
  OLIVIA_4_PATH,
  OLIVIA_5_PATH,
  OLIVIA_6_PATH,
  OLIVIA_7_PATH,
  OLIVIA_8_PATH,
  OLIVIA_9_PATH,
  OUT_OF_STOCK_PATH,
  VENDOR_PATH,
  VENDOR_FURNITURE_PATH
} from '~/utils/redirectOnPath'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV reselling recommendations',
    description: 'Saddlebag Exchange: FFXIV reselling recommendations'
  }
}

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/queries/recommended'
  }
]

const recommendedQueries = [
  {
    name: 'Olivias Furnishing Items Medium Sell',
    description: 'Finds medium priced furniture to sell.',
    Icon: DocumentSearchIcon,
    href: OLIVIA_5_PATH
  },
  {
    name: 'Olivias Consumable Collectables Medium Sell',
    description: 'Medium priced Consumable Collectables to sell.',
    Icon: DocumentSearchIcon,
    href: OLIVIA_6_PATH
  },
  {
    name: 'Fast Sales Search',
    description:
      'Search for items with high rate of sales. May not return results if your server has slow sales.',
    Icon: DocumentSearchIcon,
    href: FAST_SCAN_PATH
  },
  {
    name: 'NPC Vendor Furniture Item Search',
    description:
      'Search for items sold by Housing Vendors which can be resold on the marketboard.',
    Icon: DocumentSearchIcon,
    href: VENDOR_FURNITURE_PATH
  },
  {
    name: 'Commodities Search',
    description:
      'Search for items that sell in larger stack sizes (i.e. larger quantities)',
    Icon: DocumentSearchIcon,
    href: COMMODITY_SCAN_PATH
  },
  {
    name: 'Mega Value Search',
    description:
      'Searches for the absolute highest value items on the whole marketboard with no regard to sale rates.',
    Icon: DocumentSearchIcon,
    href: MEGA_VALUE_PATH
  },
  {
    name: 'NPC Vendor Item Search',
    description:
      'Search for items sold by NPC Vendors which can be resold on the marketboard.',
    Icon: DocumentSearchIcon,
    href: VENDOR_PATH
  },
  {
    name: 'Beginner Out of Stock Search',
    description:
      'Recommended for Beginners. No level requirement, high profit margins, low risk, low cost, low effort, low competition, but slow sale rates. Ignore Average Value, everything this finds can be sold for 70k if there are no other listings on your server.',
    Icon: DocumentSearchIcon,
    href: OUT_OF_STOCK_PATH
  },
  {
    name: 'Low Quality Out of Stock Search',
    description:
      'Same rules as the out of stock search, but this one looks for Low Quality items that can sell for like furniture or dyes that can sell for much higher prices than out of stock armor or weapons.',
    Icon: DocumentSearchIcon,
    href: NQ_OUT_OF_STOCK_PATH
  },
  {
    name: 'Olivias General Flipping Quick Sell',
    description: 'Low Investment General Flipping Quick Sell.',
    Icon: DocumentSearchIcon,
    href: OLIVIA_1_PATH
  },
  {
    name: 'Olivias Class Quest Items Quick Sell',
    description: 'Low Investment Class Quest Items Quick Sell.',
    Icon: DocumentSearchIcon,
    href: OLIVIA_2_PATH
  },
  {
    name: 'Olivias Furnishing Items Quick Sell',
    description: 'Low Investment Furnishing Items Quick Sell.',
    Icon: DocumentSearchIcon,
    href: OLIVIA_3_PATH
  },
  {
    name: 'Olivias Minions, Mounts, and Collectable Items Quick Sell',
    description:
      'Low Investment Minions, Mounts, and Collectable Items Quick Sell.',
    Icon: DocumentSearchIcon,
    href: OLIVIA_4_PATH
  },
  {
    name: 'Olivias Glamor Medium Sell',
    description:
      'Medium priced glamor items, it will also find class/profession gear ignore these and go for stuff that looks nice.',
    Icon: DocumentSearchIcon,
    href: OLIVIA_7_PATH
  },
  {
    name: 'Olivias High Investment Furniture Items',
    description: 'Furnishing items with big profits but slow sales',
    Icon: DocumentSearchIcon,
    href: OLIVIA_10_PATH
  },
  {
    name: 'Olivias High Investment Collectable Items',
    description: 'Collectable items with big profits but slow sales',
    Icon: DocumentSearchIcon,
    href: OLIVIA_8_PATH
  },
  {
    name: 'Olivias High Value Glamor Items',
    description:
      'Finds expensive glamor items, it will also find class/profession gear ignore these and go for stuff that looks nice.',
    Icon: DocumentSearchIcon,
    href: OLIVIA_9_PATH
  },
  {
    name: 'Olivias High Value Materials',
    description: 'Finds expensive Materials and Trade goods.',
    Icon: DocumentSearchIcon,
    href: OLIVIA_11_PATH
  }
]

// Save these old searches for a rainy day, now we have olivias instead
// {
//   name: 'High Value Search',
//   description: 'Search for high value trades.',
//   Icon: DocumentSearchIcon,
//   href: '/queries/value-scan'
// },
// {
//   name: 'Quest Item Search',
//   description:
//     'Searches for items that are bought from the marketboard to be turned in for "Crafter Quests" or "Supply and Provisioning Missions".',
//   Icon: DocumentSearchIcon,
//   href: QUEST_SCAN_PATH
// },

export default function Index() {
  return (
    <>
      <main className="flex-1">
        <Banner />
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-blue-900 dark:text-gray-100">
              Recommended Queries
            </h1>
            <div
              className={`not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2`}>
              {recommendedQueries.map((query) => {
                return <TileLink key={query.name} {...query} />
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
