import type React from 'react'
import { DocumentSearchIcon } from '@heroicons/react/outline'

type FeaturedPostIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

export interface BlogPost {
  category: string
  slug: string
  title: string
  description: string
  component: string
  canonical?: string
  customHeading?: string
}

export interface FeaturedPost {
  name: string
  description: string
  Icon: FeaturedPostIcon
  href: string
}

const documentSearchIcon = DocumentSearchIcon as FeaturedPostIcon

/**
 * Central configuration for all blog posts
 * Key format: 'category/slug' for categorized posts, or just 'slug' for research posts
 */
export const blogPosts: Record<string, BlogPost> = {
  // FFXIV Blog Series (BS = Blog Series)
  'ffxiv/bs1': {
    category: 'ffxiv',
    slug: 'bs1',
    title: 'Mastering Gil Earning on the FFXIV Marketboard',
    description:
      'Explore strategies to maximize your Gil earnings on the FFXIV Marketboard.',
    component: 'FFXIVBs1',
    canonical: 'https://saddlebagexchange.com/blog/ffxiv/bs1',
    customHeading: 'Unlock the Secrets to Gil Mastery on the FFXIV Marketboard'
  },
  'ffxiv/bs2': {
    category: 'ffxiv',
    slug: 'bs2',
    title: 'Advanced FFXIV Marketboard Strategies',
    description:
      'Take your Gil earning to the next level with advanced trading techniques.',
    component: 'FFXIVBs2'
  },
  'ffxiv/bs3': {
    category: 'ffxiv',
    slug: 'bs3',
    title: 'FFXIV Marketboard Flipping Guide',
    description:
      'Master the art of flipping items for profit on the FFXIV Marketboard.',
    component: 'FFXIVBs3'
  },
  'ffxiv/bs4': {
    category: 'ffxiv',
    slug: 'bs4',
    title: 'Crafting Profits in FFXIV',
    description:
      'Learn how to maximize profits through crafting and marketboard sales.',
    component: 'FFXIVBs4'
  },
  'ffxiv/bs5': {
    category: 'ffxiv',
    slug: 'bs5',
    title: 'FFXIV Market Analysis Techniques',
    description:
      'Understand market trends and data analysis for profitable trading.',
    component: 'FFXIVBs5'
  },
  'ffxiv/bs6': {
    category: 'ffxiv',
    slug: 'bs6',
    title: 'Cross-Server Trading in FFXIV',
    description: 'Leverage server travel to find arbitrage opportunities.',
    component: 'FFXIVBs6'
  },
  'ffxiv/bs7': {
    category: 'ffxiv',
    slug: 'bs7',
    title: 'FFXIV Materia Market Guide',
    description: 'Profit from materia trading and crafting.',
    component: 'FFXIVBs7'
  },
  'ffxiv/bs8': {
    category: 'ffxiv',
    slug: 'bs8',
    title: 'Weekly Market Cycles in FFXIV',
    description: 'Time your trades with weekly market patterns.',
    component: 'FFXIVBs8'
  },
  'ffxiv/bs9': {
    category: 'ffxiv',
    slug: 'bs9',
    title: 'FFXIV Housing Market Strategies',
    description: 'Strategies for the housing and furnishing market.',
    component: 'FFXIVBs9'
  },
  'ffxiv/bs10': {
    category: 'ffxiv',
    slug: 'bs10',
    title: 'Retainer Economics in FFXIV',
    description: 'Maximize retainer efficiency and profit potential.',
    component: 'FFXIVBs10'
  },
  'ffxiv/bs11': {
    category: 'ffxiv',
    slug: 'bs11',
    title: 'FFXIV Patch Market Preparation',
    description: 'Prepare and profit from new patch releases.',
    component: 'FFXIVBs11'
  },
  'ffxiv/bs12': {
    category: 'ffxiv',
    slug: 'bs12',
    title: 'Expert FFXIV Flipping Tactics',
    description: 'Advanced tactics for experienced market participants.',
    component: 'FFXIVBs12'
  },
  'ffxiv/bs13': {
    category: 'ffxiv',
    slug: 'bs13',
    title: 'FFXIV Market Saturation Analysis',
    description: 'Identify and navigate oversaturated markets.',
    component: 'FFXIVBs13'
  },
  'ffxiv/bs14': {
    category: 'ffxiv',
    slug: 'bs14',
    title: 'FFXIV Supply and Demand Trading',
    description: 'Use supply and demand dynamics for profitable trading.',
    component: 'FFXIVBs14'
  },
  'ffxiv/bs15': {
    category: 'ffxiv',
    slug: 'bs15',
    title: 'FFXIV Economic Forecasting',
    description: 'Predict market trends and get ahead of competition.',
    component: 'FFXIVBs15'
  },
  'ffxiv/bs16': {
    category: 'ffxiv',
    slug: 'bs16',
    title: 'FFXIV Risk Management in Trading',
    description: 'Minimize losses and protect your market investments.',
    component: 'FFXIVBs16'
  },
  'ffxiv/bs17': {
    category: 'ffxiv',
    slug: 'bs17',
    title: 'FFXIV Trading Psychology',
    description: 'Master the mental game of profitable market participation.',
    component: 'FFXIVBs17'
  },
  'ffxiv/advanced-crafting': {
    category: 'ffxiv',
    slug: 'advanced-crafting',
    title: 'Advanced Crafting Strategies in FFXIV',
    description: 'Deep dive into crafting for maximum market profit.',
    component: 'FFXIVAdvancedCrafting'
  },
  'ffxiv/howtoresell': {
    category: 'ffxiv',
    slug: 'howtoresell',
    title: 'How to Resell Items in FFXIV',
    description: 'Complete guide to buying and reselling for profit.',
    component: 'FFXIVHowToResell'
  },
  'ffxiv/market-mastery': {
    category: 'ffxiv',
    slug: 'market-mastery',
    title: 'Market Mastery: Complete FFXIV Guide',
    description: 'Master all aspects of the FFXIV Marketboard.',
    component: 'FFXIVMarketMastery'
  },
  'ffxiv/undercut': {
    category: 'ffxiv',
    slug: 'undercut',
    title: 'The Art of Undercutting in FFXIV',
    description: 'Strategic undercutting for competitive advantage.',
    component: 'FFXIVUndercut'
  },

  // WoW Blog Posts
  'wow/tldr': {
    category: 'wow',
    slug: 'tldr',
    title: 'TLDR: How to make gold in WoW with cross realm trading',
    description: 'Easy 4 step method to making gold.',
    component: 'WoWTLDR',
    canonical: 'https://saddlebagexchange.com/blog/wow/tldr'
  },
  'wow/crossrealm1': {
    category: 'wow',
    slug: 'crossrealm1',
    title: 'WoW Cross-Realm Trading Guide',
    description: 'Complete guide to cross-realm gold making strategies.',
    component: 'WoWCrossRealm1'
  },
  'wow/advanced-strategies': {
    category: 'wow',
    slug: 'advanced-strategies',
    title: 'Advanced WoW Gold Making Strategies',
    description: 'Expert strategies for maximizing World of Warcraft gold.',
    component: 'WoWAdvancedStrategies'
  },
  'wow/market-domination': {
    category: 'wow',
    slug: 'market-domination',
    title: 'Market Domination in World of Warcraft',
    description: 'Strategies to control and dominate WoW markets.',
    component: 'WoWMarketDomination'
  },
  'wow/skycoach': {
    category: 'wow',
    slug: 'skycoach',
    title: 'SkyCoach Gold Making Methods',
    description: 'Proven methods for making gold in WoW.',
    component: 'WoWSkyCoach'
  },
  'wow/skycoach-mop-gold': {
    category: 'wow',
    slug: 'skycoach-mop-gold',
    title: 'MoP Gold Making with SkyCoach',
    description: 'Mists of Pandaria era gold making techniques.',
    component: 'WoWSkyCoachMoPGold'
  },
  'wow/skycoach-delves': {
    category: 'wow',
    slug: 'skycoach-delves',
    title: 'Delves Gold Making Guide',
    description: 'Maximize profits from WoW Delves.',
    component: 'WoWSkyCoachDelves'
  },

  // MMO Economics
  'mmo/economics-theory': {
    category: 'mmo',
    slug: 'economics-theory',
    title: 'MMO Economics Theory',
    description: 'Fundamental economic principles applied to MMOs.',
    component: 'MMOEconomicsTheory'
  },
  'mmo/future-economies': {
    category: 'mmo',
    slug: 'future-economies',
    title: 'The Future of MMO Economies',
    description: 'Emerging trends and future directions in virtual economies.',
    component: 'MMOFutureEconomies'
  },

  // Trading & Automation
  'trading/automation-tools': {
    category: 'trading',
    slug: 'automation-tools',
    title: 'Trading Automation Tools and Strategies',
    description: 'Tools and techniques for automating market trading.',
    component: 'TradingAutomationTools'
  },

  // Research Posts (no category)
  r1: {
    category: '',
    slug: 'r1',
    title: 'How to Use Commodity Shortage Futures as a Crafter',
    description:
      'Discover effective strategies for utilizing commodity shortage futures to maximize profits as a crafter.',
    component: 'ResearchPost1',
    canonical: 'https://saddlebagexchange.com/blog/r1',
    customHeading:
      'Maximizing Profits: Using Commodity Shortage Futures as a Crafter'
  },
  r2: {
    category: '',
    slug: 'r2',
    title: 'Research Post 2',
    description: 'Second research post on market analysis.',
    component: 'ResearchPost2'
  },
  r3: {
    category: '',
    slug: 'r3',
    title: 'Research Post 3',
    description: 'Third research post on economic systems.',
    component: 'ResearchPost3'
  }
}

/**
 * Featured posts shown on the blog index page
 */
export const featuredPosts: FeaturedPost[] = [
  {
    name: 'FFXIV Gil Mastery',
    description: 'Master the FFXIV Marketboard and maximize your gil earnings.',
    Icon: documentSearchIcon,
    href: '/blog/ffxiv/bs1'
  },
  {
    name: 'WoW Gold Making',
    description:
      'Learn proven strategies for making gold in World of Warcraft.',
    Icon: documentSearchIcon,
    href: '/blog/wow/tldr'
  },
  {
    name: 'MMO Economics',
    description:
      'Understand the economic principles that govern virtual worlds.',
    Icon: documentSearchIcon,
    href: '/blog/mmo/economics-theory'
  }
]
