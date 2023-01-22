import { DocumentSearchIcon } from '@heroicons/react/outline'
import { Link } from '@remix-run/react'
import { InformationCircleIcon } from '@heroicons/react/solid'
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
  VENDOR_PATH
} from '~/utils/redirectOnPath'

const recommendedQueries = [
  {
    name: 'Beginner Out of Stock Search',
    description:
      'Recommended for Beginners. No level requirement, high profit margins, low risk, low cost, low effort, low competition, but slow sale rates. Ignore Average Value, everything this finds can be sold for 70k if there are no other listings on your server.',
    icon: DocumentSearchIcon,
    href: OUT_OF_STOCK_PATH
  },
  {
    name: 'Low Quality Out of Stock Search',
    description:
      'Same rules as the out of stock search, but this one looks for Low Quality items that can sell for like furniture or dyes that can sell for much higher prices than out of stock armor or weapons.',
    icon: DocumentSearchIcon,
    href: NQ_OUT_OF_STOCK_PATH
  },
  {
    name: 'Fast Sales Search',
    description: 'Search for items with high rate of sales.',
    icon: DocumentSearchIcon,
    href: FAST_SCAN_PATH
  },
  {
    name: 'Commodities Search',
    description:
      'Search for items that sell in larger stack sizes (i.e. larger quantities)',
    icon: DocumentSearchIcon,
    href: COMMODITY_SCAN_PATH
  },
  {
    name: 'Mega Value Search',
    description:
      'Searches for the absolute highest value items on the whole marketboard with no regard to sale rates.',
    icon: DocumentSearchIcon,
    href: MEGA_VALUE_PATH
  },
  {
    name: 'NPC Vendor Item Search',
    description:
      'Search for items sold by NPC Vendors which can be resold on the marketboard.',
    icon: DocumentSearchIcon,
    href: VENDOR_PATH
  },
  {
    name: 'Olivias General Flipping Quick Sell',
    description: 'Low Investment General Flipping Quick Sell.',
    icon: DocumentSearchIcon,
    href: OLIVIA_1_PATH
  },
  {
    name: 'Olivias Class Quest Items Quick Sell',
    description: 'Low Investment Class Quest Items Quick Sell.',
    icon: DocumentSearchIcon,
    href: OLIVIA_2_PATH
  },
  {
    name: 'Olivias Furnishing Items Quick Sell',
    description: 'Low Investment Furnishing Items Quick Sell.',
    icon: DocumentSearchIcon,
    href: OLIVIA_3_PATH
  },
  {
    name: 'Olivias Minions, Mounts, and Collectable Items Quick Sell',
    description:
      'Low Investment Minions, Mounts, and Collectable Items Quick Sell.',
    icon: DocumentSearchIcon,
    href: OLIVIA_4_PATH
  },
  {
    name: 'Olivias Furnishing Items Medium Sell',
    description: 'Finds medium priced furniture to sell.',
    icon: DocumentSearchIcon,
    href: OLIVIA_5_PATH
  },
  {
    name: 'Olivias Consumable Collectables Medium Sell',
    description: 'Medium priced Consumable Collectables to sell.',
    icon: DocumentSearchIcon,
    href: OLIVIA_6_PATH
  },
  {
    name: 'Olivias Glamor Medium Sell',
    description:
      'Medium priced glamor items, it will also find class/profession gear ignore these and go for stuff that looks nice.',
    icon: DocumentSearchIcon,
    href: OLIVIA_7_PATH
  },
  {
    name: 'Olivias High Investment Furniture Items',
    description: 'Furnishing items with big profits but slow sales',
    icon: DocumentSearchIcon,
    href: OLIVIA_10_PATH
  },
  {
    name: 'Olivias High Investment Collectable Items',
    description: 'Collectable items with big profits but slow sales',
    icon: DocumentSearchIcon,
    href: OLIVIA_8_PATH
  },
  {
    name: 'Olivias High Value Glamor Items',
    description:
      'Finds expensive glamor items, it will also find class/profession gear ignore these and go for stuff that looks nice.',
    icon: DocumentSearchIcon,
    href: OLIVIA_9_PATH
  },
  {
    name: 'Olivias High Value Materials',
    description: 'Finds expensive Materials and Trade goods.',
    icon: DocumentSearchIcon,
    href: OLIVIA_11_PATH
  }
]

// Save these old searches for a rainy day, now we have olivias instead
// {
//   name: 'High Value Search',
//   description: 'Search for high value trades.',
//   icon: DocumentSearchIcon,
//   href: '/queries/value-scan'
// },
// {
//   name: 'Quest Item Search',
//   description:
//     'Searches for items that are bought from the marketboard to be turned in for "Crafter Quests" or "Supply and Provisioning Missions".',
//   icon: DocumentSearchIcon,
//   href: QUEST_SCAN_PATH
// },

export default function Index() {
  return (
    <>
      <main className="flex-1">
        <div className="rounded-md bg-blue-50 p-4 m-4 border-2 border-blue-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon
                className="h-5 w-5 text-blue-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                Welcome to the new Saddlebag Exchange!{' '}
              </p>
              <p className="mt-3 text-sm md:mt-0 md:ml-6">
                <a
                  href="https://discord.gg/836C8wDVNq"
                  className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                  Discord
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-blue-900">
              Recommended Queries
            </h1>
            <div
              className={`not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2`}>
              {recommendedQueries.map((query) => {
                return (
                  <div
                    key={query.name}
                    className={`group relative rounded-xl border border-slate-200 dark:border-slate-800`}>
                    <div
                      className={`absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.blue.50)),var(--quick-links-hover-bg,theme(colors.blue.50)))_padding-box,linear-gradient(to_top,theme(colors.yellow.400),theme(colors.yellow.400),theme(colors.blue.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]`}
                    />
                    <div className={`relative overflow-hidden rounded-xl p-6`}>
                      <query.icon className={`w-8 h-8 dark:text-white`} />
                      <h2
                        className={`mt-4 font-display text-base text-slate-900 dark:text-white`}>
                        <Link to={query.href}>
                          <span className={`absolute -inset-px rounded-xl`} />
                          {query.name}
                        </Link>
                      </h2>
                      <p
                        className={`mt-1 text-sm text-slate-700 dark:text-slate-400`}>
                        {query.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
