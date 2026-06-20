import { DocumentSearchIcon } from '@heroicons/react/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'
import type { MetaFunction } from '@remix-run/cloudflare'
// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange Blogs, posts and random stuff' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content: 'Saddlebag Exchange best blogs and guides are all on github'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/blog'
    }
  ]
}

const recommendedQueries = [
  {
    name: 'How to Resell Items in FFXIV',
    description: 'Complete guide to buying and reselling for profit.',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/howtoresell'
  },
  {
    name: 'FFXIV Trading Strategies Post 2',
    description:
      'Advanced FFXIV marketboard techniques and profit optimization',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/bs2'
  },
  {
    name: 'FFXIV Marketboard Guide: Mastering Undercutting with Saddlebag Exchange',
    description:
      'Learn how to maximize your FFXIV gil earnings using undercutting strategies and Saddlebag Exchange alerts.',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/undercut'
  },
  {
    name: 'How to Cross Server Trade in FFXIV',
    description: 'Watch a youtube video on how to trade between servers',
    Icon: DocumentSearchIcon,
    href: '/blog/r1'
  },
  {
    name: 'How to use ffxiv marketshare',
    description: 'how to marketshare',
    Icon: DocumentSearchIcon,
    href: '/blog/r2'
  },
  {
    name: 'How to use wow commodity shortage',
    description: 'how to wow commodity shortage',
    Icon: DocumentSearchIcon,
    href: '/blog/r3'
  },
  {
    name: 'FFXIV Trading Strategies Post 11',
    description:
      'Data analysis, market trends, and statistical trading methods',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/bs11'
  },
  {
    name: 'Our first wow cross realm update',
    description: 'Launch of cross realm trading tools',
    Icon: DocumentSearchIcon,
    href: '/blog/wow/crossrealm1'
  },
  {
    name: 'FFXIV Trading Strategies Post 6',
    description:
      'Multi-tier trading strategies from core to master-level techniques',
    Icon: DocumentSearchIcon,
    href: '/blog/ffxiv/bs6'
  },
  {
    name: 'TLDR: How to make gold in WoW with cross realm trading',
    description: 'Easy 4 step method to making gold.',
    Icon: DocumentSearchIcon,
    href: '/blog/wow/tldr'
  },
  {
    name: 'Advanced World of Warcraft Trading Strategies',
    description:
      'Master commodity markets, cross-realm arbitrage, profession-based trading empires, and advanced market analysis tools for WoW.',
    Icon: DocumentSearchIcon,
    href: '/blog/wow/advanced-strategies'
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
              Blogs - WIP
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
