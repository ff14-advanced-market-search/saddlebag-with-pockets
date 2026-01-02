import type { MetaFunction } from '@remix-run/cloudflare'
import { gw2ItemsMap } from '~/utils/items/gw2Items'

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: Marketable Items GW2',
    description: 'A list of all marketable items on Saddlebag Exchange for GW2',
    links: [
      { rel: 'canonical', href: 'https://saddlebagexchange.com/gw2/itemlist' }
    ]
  }
}

export default function Index() {
  // Generate simple anchor links for GW2 items with names
  const gw2ItemLinks = Object.entries(gw2ItemsMap).map(([id, name]) => ({
    href: `/gw2/item-data/${id}`,
    text: `${name} (${id})`
  }))

  return (
    <main>
      <h1 style={{ textAlign: 'center' }}>List of GW2 Items</h1>
      <h2 style={{ textAlign: 'center' }}>Get statistics for all GW2 Items</h2>
      <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <ul>
          {gw2ItemLinks.map((item, index) => (
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
