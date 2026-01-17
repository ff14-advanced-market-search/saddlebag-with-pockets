import type { MetaFunction } from '@remix-run/cloudflare'
import { gw2ItemsMap } from '~/utils/items/gw2Items'

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
  // Generate simple anchor links for GW2 items with names
  const gw2ItemLinks = Object.entries(gw2ItemsMap).map(([id, name]) => ({
    href: `/gw2/item-data/${id}`,
    text: `${name} (${id})`
  }))

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
