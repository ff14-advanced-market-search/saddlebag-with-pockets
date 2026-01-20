import { useState, useEffect } from 'react'
import type { MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange: Marketable Items FFXIV' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content: 'A list of all marketable items on Saddlebag Exchange for FFXIV'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/ffxiv/itemlist'
    }
  ]
}

export default function Index() {
  const [ffxivItemLinks, setFfxivItemLinks] = useState<
    Array<{ href: string; text: string }>
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dynamic import - runs in browser, not bundled into Worker
    import('~/utils/items/ffxivItems').then(({ ffxivItemsMap }) => {
      const links = Object.keys(ffxivItemsMap).map((id) => ({
        href: `/queries/item-data/${id}`,
        text: `ffxiv Item ${id}`
      }))
      setFfxivItemLinks(links)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <main>
        <h1 style={{ textAlign: 'center' }}>Loading FFXIV Items...</h1>
      </main>
    )
  }

  return (
    <main>
      <h1 style={{ textAlign: 'center' }}>List of ffxiv Items</h1>
      <h2 style={{ textAlign: 'center' }}>
        Get statistics for all FFXIV Items
      </h2>
      <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <ul>
          {ffxivItemLinks.map((item, index) => (
            <li key={index}>
              <a href={item.href} style={{ color: 'blue' }}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
