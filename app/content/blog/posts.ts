import type React from 'react'
import { DocumentSearchIcon } from '@heroicons/react/outline'
import { wikiBlogPosts } from './wikiPostsEntries'

type FeaturedPostIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

export interface BlogPost {
  category: string
  slug: string
  title: string
  description: string
  component: string
  canonical?: string
  customHeading?: string
  wikiSlug?: string
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
const legacyBlogPosts: Record<string, BlogPost> = {
  'ffxiv/bs2': {
    category: 'ffxiv',
    slug: 'bs2',
    title: 'Advanced FFXIV Marketboard Strategies',
    description:
      'Take your Gil earning to the next level with advanced trading techniques.',
    component: 'FFXIVBs2'
  },
  'ffxiv/bs6': {
    category: 'ffxiv',
    slug: 'bs6',
    title: 'Cross-Server Trading in FFXIV',
    description: 'Leverage server travel to find arbitrage opportunities.',
    component: 'FFXIVBs6'
  },
  'ffxiv/bs11': {
    category: 'ffxiv',
    slug: 'bs11',
    title: 'FFXIV Patch Market Preparation',
    description: 'Prepare and profit from new patch releases.',
    component: 'FFXIVBs11'
  },
  'ffxiv/howtoresell': {
    category: 'ffxiv',
    slug: 'howtoresell',
    title: 'How to Resell Items in FFXIV',
    description: 'Complete guide to buying and reselling for profit.',
    component: 'FFXIVHowToResell'
  },
  'ffxiv/tldr': {
    category: 'ffxiv',
    slug: 'tldr',
    title: 'TLDR: How to make gil in FFXIV with cross server trading',
    description: 'Easy 4 step method to making gil with cross server trading.',
    component: 'FFXIVTLDR',
    canonical: 'https://saddlebagexchange.com/blog/ffxiv/tldr'
  },
  'ffxiv/undercut': {
    category: 'ffxiv',
    slug: 'undercut',
    title: 'The Art of Undercutting in FFXIV',
    description: 'Strategic undercutting for competitive advantage.',
    component: 'FFXIVUndercut'
  },
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
  r1: {
    category: '',
    slug: 'r1',
    title: 'How to Import, Trade and Flip Items on the FFXIV Marketboard',
    description:
      'Learn cross-server trading basics: buy low on other servers and sell high on your home server using the FFXIV marketboard.',
    component: 'ResearchPost1',
    canonical: 'https://saddlebagexchange.com/blog/r1'
  },
  r2: {
    category: '',
    slug: 'r2',
    title: 'How to Earn Gil with the FFXIV Market Overview',
    description:
      'Use marketshare searches to find the best items to sell on the marketboard.',
    component: 'ResearchPost2',
    canonical: 'https://saddlebagexchange.com/blog/r2'
  },
  r3: {
    category: '',
    slug: 'r3',
    title: 'How to Trade Using Commodity Shortage Futures as a Crafter',
    description:
      'Explore effective strategies for trading using commodity shortage futures to maximize profits as a crafter.',
    component: 'ResearchPost3',
    canonical: 'https://saddlebagexchange.com/blog/r3',
    customHeading:
      'Maximizing Profits: Trading with Commodity Shortage Futures as a Crafter'
  }
}

export const blogPosts: Record<string, BlogPost> = {
  ...legacyBlogPosts,
  ...wikiBlogPosts
}

/**
 * Featured posts shown on the blog index page
 */
export const featuredPosts: FeaturedPost[] = [
  {
    name: 'How to Resell Items in FFXIV',
    description: 'Complete guide to buying and reselling for profit.',
    Icon: documentSearchIcon,
    href: '/blog/ffxiv/howtoresell'
  },
  {
    name: 'TLDR: How to make gil in FFXIV with cross server trading',
    description: 'Easy 4 step method to making gil.',
    Icon: documentSearchIcon,
    href: '/blog/ffxiv/tldr'
  },
  {
    name: 'TLDR: How to make gold in WoW with cross realm trading',
    description: 'Easy 4 step method to making gold.',
    Icon: documentSearchIcon,
    href: '/blog/wow/tldr'
  }
]
