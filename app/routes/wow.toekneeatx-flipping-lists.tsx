import type { MetaFunction } from '@remix-run/cloudflare'
import Banner from '~/components/Common/Banner'

type Product = {
  name: string
  url: string
  price: string
  group: 'AAA & Saddlebag' | 'PBS' | 'TSM' | 'Other Guides'
}

const products: Product[] = [
  {
    name: 'WoW Bundle - Azeroth Auction Assassin (AAA) List - Including Midnight Items! + SaddleBag Guide',
    url: 'https://toekneeatx.sellfy.store/p/wow-azeroth-auction-assassin-aaa-custom-shopping-list/?a=ce0cmDPT',
    price: '$13.50',
    group: 'AAA & Saddlebag'
  },
  {
    name: 'WoW - Azeroth Auction Assassin (AAA) Shopping List - Including Midnight Items!',
    url: 'https://toekneeatx.sellfy.store/p/wow-point-blank-sniper-pbs-custom-list-3k-items-w-housing-items-t6kuua/?a=ce0cmDPT',
    price: '$10',
    group: 'AAA & Saddlebag'
  },
  {
    name: 'WoW - Gold Making Guide - Gold Making Queries to Boost Profits – Saddlebag Exchange',
    url: 'https://toekneeatx.sellfy.store/p/wow-gold-making-queries-to-boost-profits-saddlebag-exchange/?a=ce0cmDPT',
    price: '$5',
    group: 'AAA & Saddlebag'
  },
  {
    name: 'WoW Bundle - Point Blank Sniper (PBS) Shopping List (3k+ Items) + PBS Guide',
    url: 'https://toekneeatx.sellfy.store/p/wow-point-blank-sniper-pbs-custom-shopping-list-3k-items/?a=ce0cmDPT',
    price: '$18',
    group: 'PBS'
  },
  {
    name: 'WoW - Point Blank Sniper (PBS) - How to setup and use PBS to make Millions',
    url: 'https://toekneeatx.sellfy.store/p/wow-point-blank-sniper-pbs-custom-list-3k-items-w-housing-items-ofolnh/?a=ce0cmDPT',
    price: '$10',
    group: 'PBS'
  },
  {
    name: 'WoW - Point Blank Sniper (PBS) Shopping List (3k+ Items W/O Housing) - Including Midnight Items!',
    url: 'https://toekneeatx.sellfy.store/p/wow-point-blank-sniper-pbs-custom-list-3k-items/?a=ce0cmDPT',
    price: '$10',
    group: 'PBS'
  },
  {
    name: 'WoW - Point Blank Sniper (PBS) Shopping List (3k+ Items w/ Housing) - Including Midnight Items!',
    url: 'https://toekneeatx.sellfy.store/p/wow-point-blank-sniper-pbs-custom-list-3k-items-w-housing-items/?a=ce0cmDPT',
    price: '$10',
    group: 'PBS'
  },
  {
    name: 'WoW Bundle - Trade Skill Master (TSM) Flipping 101 - TSM Strings + Guide',
    url: 'https://toekneeatx.sellfy.store/p/wow-trade-skill-master-tsm-flipping-101-operations-16k-items-w-96-groups-ogwpyc/?a=ce0cmDPT',
    price: '$18',
    group: 'TSM'
  },
  {
    name: 'WoW - Trade Skill Master (TSM) Guide - Basics 101',
    url: 'https://toekneeatx.sellfy.store/p/wow-trade-skill-master-tsm-flipping-101-operations-16k-items-w-96-groups/?a=ce0cmDPT',
    price: '$10',
    group: 'TSM'
  },
  {
    name: 'WoW - Trade Skill Master (TSM) Flipping - 25k+ Items w/ 938 Groups - Including Midnight Items!!',
    url: 'https://toekneeatx.sellfy.store/p/wow-trade-skill-master-tsm-flipping-25k-items-w-938-groups-including-midnight-items/?a=ce0cmDPT',
    price: '$10',
    group: 'TSM'
  },
  {
    name: 'WoW - Auction Flipping - Get Ready - New Expansion Launch (Or Major Patch)',
    url: 'https://toekneeatx.sellfy.store/p/wow-make-millions-at-new-expansion-launch-or-major-patch/?a=ce0cmDPT',
    price: '$5',
    group: 'Other Guides'
  },
  {
    name: 'WoW - Gold Making Guide - Beginners Guide to Auction House Flipping',
    url: 'https://toekneeatx.sellfy.store/p/wow-gold-making-guide-10-things-i-wish-i-knew-when-i-started-auction-house-flipping/?a=ce0cmDPT',
    price: '$10',
    group: 'Other Guides'
  }
]

const groupedOrder: Product['group'][] = [
  'AAA & Saddlebag',
  'PBS',
  'TSM',
  'Other Guides'
]

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    {
      title: 'WoW ToekneeATX Flipping Lists and Guides - Saddlebag Exchange'
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'Browse ToekneeATX World of Warcraft gold making lists and guides for Azeroth Auction Assassin, Saddlebag Exchange, Point Blank Sniper, and Trade Skill Master.'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/wow/toekneeatx-flipping-lists'
    }
  ]
}

export default function ToekneeATXFlippingLists() {
  return (
    <main className="flex-1 bg-slate-100 text-slate-900">
      <Banner />
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ToekneeATX WoW Lists and Guides
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Curated shopping lists and guides for AAA, Saddlebag Exchange,
              Point Blank Sniper (PBS), and Trade Skill Master (TSM).
            </p>
          </header>

          <div className="space-y-10">
            {groupedOrder.map((group) => {
              const groupItems = products.filter(
                (product) => product.group === group
              )

              if (!groupItems.length) {
                return null
              }

              return (
                <section key={group}>
                  <h2 className="text-2xl font-semibold mb-4">{group}</h2>
                  <div className="divide-y divide-slate-200 rounded-lg bg-white border border-slate-200 shadow-sm">
                    {groupItems.map((product) => (
                      <a
                        key={product.name}
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 text-sm">
                          <p className="font-medium text-slate-900">
                            {product.name}
                          </p>
                          <span className="mt-2 sm:mt-0 text-emerald-700 font-semibold">
                            {product.price}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>

          <p style={{ fontSize: '1px' }}>
            ToekneeATX WoW Flipping Lists and Guides. This page collects
            ToekneeATX&apos;s premium World of Warcraft resources in one place,
            including Azeroth Auction Assassin lists, Saddlebag Exchange query
            packs, Point Blank Sniper (PBS) shopping lists, and Trade Skill
            Master (TSM) setups. Each bundle is organized so you can quickly
            find AAA and Saddlebag tools for cross realm sniping, PBS lists for
            sniper windows and shopping operations, and TSM profiles for
            reposting, cancel scanning, and long term market control. Region
            wide market sniping, price checking, and steady gold making across
            patches and new expansions.
          </p>
        </div>
      </section>
    </main>
  )
}
