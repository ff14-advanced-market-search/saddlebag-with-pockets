import { useState, useEffect } from 'react'
import type { MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange: Marketable Items WoW' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content: 'A list of all marketable items on Saddlebag Exchange for WoW'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/wow/itemlist'
    }
  ]
}

export default function Index() {
  const [wowItemLinks, setWowItemLinks] = useState<
    Array<{ href: string; text: string }>
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dynamic import - runs in browser, not bundled into Worker
    import('~/utils/items/wowItems').then(({ wowItemsMap }) => {
      const links = Object.keys(wowItemsMap).map((id) => ({
        href: `/wow/item-data/${id}`,
        text: `WoW Item ${id}`
      }))
      setWowItemLinks(links)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <main>
        <h1 style={{ textAlign: 'center' }}>Loading WoW Items...</h1>
      </main>
    )
  }

  return (
    <main>
      <h1 style={{ textAlign: 'center' }}>List of WoW Items</h1>
      <h2 style={{ textAlign: 'center' }}>Get statistics for all WoW Items</h2>
      <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <ul>
          {wowItemLinks.map((item, index) => (
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
