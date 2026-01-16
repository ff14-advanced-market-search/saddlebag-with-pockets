import Banner from '~/components/Common/Banner'
import type { MetaFunction } from '@remix-run/cloudflare'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Advanced Crafting Strategies in FFXIV',
    description: 'Deep dive into crafting for maximum market profit.',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/blog/ffxiv/advanced-crafting'
      }
    ]
  }
}

const FFXIVAdvancedCrafting = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <Banner />
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Advanced Crafting Strategies in FFXIV
        </h1>
        <div className="prose prose-lg max-w-none">
          <p>Blog content coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default FFXIVAdvancedCrafting
