import {
  DocumentSearchIcon,
  ChartSquareBarIcon,
  PencilAltIcon
} from '@heroicons/react/outline'
import type { MetaFunction, LinksFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Market Board Tools',
    description: 'Saddlebag Exchange: FFXIV MarketBoard Tools'
  }
}

export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/ffxiv' }
]

const ffxivPages = [
  {
    name: 'Reselling Trade Searches',
    description:
      'Find items you can buy on other servers and resell on your own for a profit!',
    Icon: ChartSquareBarIcon,
    href: '/queries/recommended'
  },
  {
    name: 'Marketshare Overview',
    href: '/ffxiv/marketshare/queries',
    description:
      'Finds the best items to sell! Shows the top 200 best selling items on your home server.',
    Icon: ChartSquareBarIcon
  },
  {
    name: 'Craftsim Search',
    href: '/ffxiv/craftsim/queries',
    description: 'Finds the best items to craft!',
    Icon: ChartSquareBarIcon
  },
  {
    name: 'Shopping List Search',
    href: '/ffxiv/shopping-list',
    description:
      'Helps make a shopping list, telling you where to find crafting materials for the best prices!',
    Icon: PencilAltIcon
  },
  {
    name: 'Discord Undercut and Sale Alerts Generator',
    description:
      'Undercut Alerts will notify you via discord direct message when you are undercut. Sale Alerts will notify you via discord direct message when you have a sale.',
    Icon: PencilAltIcon,
    href: '/undercut'
  },
  {
    name: 'Undercut Alerts Guide',
    href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version',
    description: 'A guide on how to setup and use Undercut Alerts.',
    Icon: DocumentSearchIcon,
    external: true
  },
  {
    name: 'Discord Price Discount Sniper and Price Spike Alert Generator',
    description:
      'Price Discount Sniper and Price Spike Alerts will notify you via discord direct message when items go above or below prices you set.',
    Icon: PencilAltIcon,
    href: '/price-sniper'
  },
  {
    name: 'Price Discount Sniper and Price Spike Alerts Guide',
    href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Price-Sniper-and-Item-Price-Alerts',
    description:
      'A guide on how to setup and use Price Discount Sniper and Price Spike Alerts.',
    Icon: DocumentSearchIcon,
    external: true
  },
  {
    name: 'Allagan Data Reports',
    href: '/allagan-data',
    description:
      'Use data from the Allagan Tools Plugin to create sale alerts and find valuable items in your bags you may have forgotten about.',
    Icon: ChartSquareBarIcon
  },
  {
    name: 'Orange and Purple Scrip to Gil',
    href: '/ffxiv/scrip-exchange',
    description:
      'Get the most Gil per Scrip! Find the best Orange or Purple Scrip to Gil conversion.',
    Icon: ChartSquareBarIcon
  },
  {
    name: 'Extended Sale History',
    description:
      'See extended sale history of last 1800 sales on any FFXIV item.',
    Icon: ChartSquareBarIcon,
    href: '/ffxiv/extended-history'
  },
  {
    name: 'Item History Statistics and Graphs',
    description:
      'Helps you find if an item is worth selling or not based on past sale history. Can tell you the best price to sell at, best time of day to sell, best stack size to sell at and more!',
    Icon: ChartSquareBarIcon,
    href: '/queries/item-history'
  },
  {
    name: 'Listings Comparison and Competition Metric',
    description:
      'Shows you how tough the undercutting competition is on specific items.',
    Icon: ChartSquareBarIcon,
    href: '/queries/listings'
  },
  {
    name: 'Export Trading Search',
    description:
      'Compare prices on items between servers to find the best server to sell your items on.',
    Icon: ChartSquareBarIcon,
    href: '/queries/world-comparison'
  },
  {
    name: 'Self Purchase Records',
    description:
      'See a record of your recent past purchases from our stored data. Note we only store the last 40 sales of any single item, some purchases may not appear.',
    Icon: ChartSquareBarIcon,
    href: '/ffxiv/self-purchase'
  },
  {
    name: 'Secret Sale Leads',
    href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Sale-Leads',
    description:
      'Our ultimate secret sale leads (for patreons) that can earn you tens of millions of gil each day!',
    Icon: DocumentSearchIcon,
    external: true
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
              FFXIV Market Board Tools for Gil Earning
            </h1>
            <div
              className={`not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2`}>
              {ffxivPages.map((query) => {
                return <TileLink key={query.name} {...query} />
              })}
            </div>
          </div>
        </div>
        <p style={{ fontSize: '1px' }}>
          google keywords: ffxiv glamour, reddit ffxiv, ff14 mog station, ffxiv
          classes, ffxiv modders, ffxiv modpacks, ffxiv download, ffxiv jobs,
          ffxiv mod, ffxiv mogstation, ffxiv fashion report, fashion report
          ffxiv, ffxiv forums, ffxiv housing, ffxiv maintenance, ffxiv market
          board, ffxiv patch notes, final fantasy 14 reddit, ffxiv fanfest,
          ffxiv msq list, ffxiv character search, ffxiv fafnir, universalis
          ffxiv, ffxiv maintenance jan 15, ffxiv relic weapons, r ffxiv, relic
          weapons ffxiv, character search ffxiv, FFXIVAH
        </p>
      </main>
    </>
  )
}
