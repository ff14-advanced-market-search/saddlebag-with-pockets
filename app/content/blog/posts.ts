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
  r2: {
    category: '',
    slug: 'r2',
    title: 'How to Cross-Server Trade in FFXIV',
    description:
      'Discover effective methods and guidelines for cross-server trading in Final Fantasy XIV.',
    component: 'ResearchPost2'
  }
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
    name: 'TLDR: How to make gold in WoW with cross realm trading',
    description: 'Easy 4 step method to making gold.',
    Icon: documentSearchIcon,
    href: '/blog/wow/tldr'
  },
  {
    name: 'The Art of Undercutting in FFXIV',
    description: 'Strategic undercutting for competitive advantage.',
    Icon: documentSearchIcon,
    href: '/blog/ffxiv/undercut'
  }
]
