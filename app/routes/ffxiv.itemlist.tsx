import { MetaFunction } from '@remix-run/cloudflare'
import { ffxivItemsMap } from '~/utils/items/ffxivItems'

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: Marketable Items FFXIV',
    description:
      'A list of all marketable items on Saddlebag Exchange for FFXIV',
    links: [
      { rel: 'canonical', href: 'https://saddlebagexchange.com/ffxiv/itemlist' }
    ]
  }
}

export default function Index() {
  // Generate simple anchor links for ffxiv items
  const ffxivItemLinks = Object.keys(ffxivItemsMap).map((id) => ({
    href: `/queries/item-data/${id}`,
    text: `ffxiv Item ${id}`
  }))

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
