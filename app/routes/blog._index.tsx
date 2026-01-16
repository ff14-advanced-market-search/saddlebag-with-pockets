import { MagnifyingGlassIcon as DocumentSearchIcon } from '@heroicons/react/24/outline'
import Banner from '~/components/Common/Banner'
import TileLink from '~/components/Common/TileLink'
import type { MetaFunction } from '@remix-run/cloudflare'
// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange Blogs, posts and random stuff' },
    { name: 'description', content: 'Saddlebag Exchange best blogs and guides are all on github' },
    { tagName: 'link', rel: 'canonical', href: 'https://saddlebagexchange.com/blog' }
  ]
}

const recommendedQueries = [
  {
    name: 'TLDR: How to make gold in WoW with cross realm trading',
    description: 'Easy 4 step method to making gold.',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/wow/tldr'
  },
  {
    name: 'Preparing for Mythic+: Key Points',
    description:
      'How to best prepare and properly complete Mythic+ dungeons in World of Warcraft, where you can get the best weapons and gear',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/wow/skycoach'
  },
  {
    name: 'Skycoach Mists of Pandaria Gold Farming Guide',
    description: '10 Ways to Farm Mists of Pandaria Gold in WoW Classic',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/wow/skycoach-mop-gold'
  },
  {
    name: 'Skycoach Delves Guide',
    description: 'How to complete Delves in WoW Classic',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/wow/skycoach-delves'
  },
  {
    name: 'FFXIV Marketboard Guide: Mastering Undercutting with Saddlebag Exchange',
    description:
      'Learn how to maximize your FFXIV gil earnings using undercutting strategies and Saddlebag Exchange alerts. Master the Marketboard with real-time notifications.',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/undercut'
  },
  {
    name: 'How to Cross Server Trade in FFXIV',
    description: 'Watch a youtube video on how to trade between servers',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/r1'
  },
  {
    name: 'How to use ffxiv marketshare',
    description: 'how to marketshare',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/r2'
  },
  {
    name: 'How to use ffxiv reselling',
    description: 'how to reselling',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/howtoresell'
  },
  {
    name: 'How to use wow commodity shortage',
    description: 'how to wow commodity shortage',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/r3'
  },
  {
    name: 'Our first wow cross realm update',
    description: 'Launch of cross realm trading tools',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/wow/crossrealm1'
  },
  {
    name: 'Advanced MMO Trading Strategies',
    description:
      'Master market timing, cross-server arbitrage, portfolio diversification, and advanced market analysis techniques for maximum profits.',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs16'
  },
  {
    name: 'MMO Economy Psychology',
    description:
      'Understanding player behavior, market manipulation ethics, community dynamics, and future trends in virtual economies.',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs17'
  },
  {
    name: 'Advanced World of Warcraft Trading Strategies',
    description:
      'Master commodity markets, cross-realm arbitrage, profession-based trading empires, and advanced market analysis tools for WoW.',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/wow/advanced-strategies'
  },
  {
    name: 'Advanced FFXIV Crafting Strategies',
    description:
      'Expert crafting rotations, market timing, supply chain management, and premium market positioning for FFXIV crafters.',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/advanced-crafting'
  },
  {
    name: 'MMO Economic Theory',
    description:
      'Fundamental economic principles, market structures, behavioral economics, and macroeconomic analysis in virtual worlds.',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/mmo/economics-theory'
  },
  {
    name: 'Trading Automation and Tools',
    description:
      'Data collection systems, automated trading strategies, analytics, decision support, and responsible automation practices.',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/trading/automation-tools'
  },
  {
    name: 'FFXIV Trading Strategies Post 1',
    description: 'Comprehensive FFXIV trading strategies and market analysis',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs1'
  },
  {
    name: 'FFXIV Trading Strategies Post 2',
    description:
      'Advanced FFXIV marketboard techniques and profit optimization',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs2'
  },
  {
    name: 'FFXIV Trading Strategies Post 3',
    description: 'Expert-level FFXIV trading tactics and market mastery',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs3'
  },
  {
    name: 'FFXIV Trading Strategies Post 4',
    description: 'Professional FFXIV trading methods and economic analysis',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs4'
  },
  {
    name: 'FFXIV Trading Strategies Post 5',
    description: 'Dual-game trading strategies for FFXIV and WoW markets',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs5'
  },
  {
    name: 'FFXIV Trading Strategies Post 6',
    description:
      'Multi-tier trading strategies from core to master-level techniques',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs6'
  },
  {
    name: 'FFXIV Trading Strategies Post 7',
    description:
      'Comprehensive trading guide with advanced strategy breakdowns',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs7'
  },
  {
    name: 'FFXIV Trading Strategies Post 8',
    description:
      'Economic principles, sustainable practices, and innovative approaches',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs8'
  },
  {
    name: 'FFXIV Trading Strategies Post 9',
    description:
      'Seasonal events, third-party tools, and data analysis techniques',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs9'
  },
  {
    name: 'FFXIV Trading Strategies Post 10',
    description:
      'Third-party tools, cross-server trading, and market intelligence',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs10'
  },
  {
    name: 'FFXIV Trading Strategies Post 11',
    description:
      'Data analysis, market trends, and statistical trading methods',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs11'
  },
  {
    name: 'FFXIV Trading Strategies Post 12',
    description: 'Innovation in MMO economies and future market trends',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs12'
  },
  {
    name: 'FFXIV Trading Strategies Post 13',
    description:
      'Alternative revenue streams and innovative trading approaches',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs13'
  },
  {
    name: 'FFXIV Trading Strategies Post 14',
    description: 'Economic policies and their impact on MMO market dynamics',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs14'
  },
  {
    name: 'FFXIV Trading Strategies Post 15',
    description:
      'Social dynamics, player-driven markets, virtual wealth psychology, and regulatory landscapes',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/bs15'
  },
  {
    name: 'FFXIV Market Mastery',
    description:
      'Advanced market timing, psychological warfare, competitive intelligence, and future trends in FFXIV trading',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/ffxiv/market-mastery'
  },
  {
    name: 'WoW Market Domination',
    description:
      'Server economics, guild trading empires, auction house mastery, and cross-realm strategies for WoW',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/wow/market-domination'
  },
  {
    name: 'The Future of MMO Economies',
    description:
      'Blockchain integration, AI-driven markets, virtual reality economics, and regulatory frameworks',
    Icon: MagnifyingGlassIcon as DocumentSearchIcon,
    href: '/blog/mmo/future-economies'
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
