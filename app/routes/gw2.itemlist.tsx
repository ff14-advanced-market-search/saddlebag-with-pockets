import { useState, useEffect } from 'react'
import type { MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange: Marketable Items GW2' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content: 'A list of all marketable items on Saddlebag Exchange for GW2'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/gw2/itemlist'
    }
  ]
}

export default function Index() {
  const [gw2ItemLinks, setGw2ItemLinks] = useState<
    Array<{ href: string; text: string }>
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dynamic import - runs in browser, not bundled into Worker
    import('~/utils/items/gw2Items').then(({ gw2ItemsMap }) => {
      const links = Object.entries(gw2ItemsMap).map(([id, name]) => ({
        href: `/gw2/item-data/${id}`,
        text: `${name} (${id})`
      }))
      setGw2ItemLinks(links)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <main>
        <h1 className="text-center">Loading GW2 Items...</h1>
      </main>
    )
  }

  return (
    <main>
      <h1 className="text-center">List of GW2 Items</h1>
      <h2 className="text-center">Get statistics for all GW2 Items</h2>
      <div className="p-5 max-w-md mx-auto">
        <ul className="list-disc pl-5 space-y-2">
          {gw2ItemLinks.map((item, index) => (
            <li key={index}>
              <a href={item.href} className="text-blue-500 hover:underline">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
