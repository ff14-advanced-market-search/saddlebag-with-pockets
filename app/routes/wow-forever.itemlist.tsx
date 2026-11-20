import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { Link, useLoaderData } from '@remix-run/react'
import { useMemo, useState } from 'react'
import { PageWrapper } from '../components/Common'
import Banner from '../components/Common/Banner'
import ForeverItemNames from '../requests/WoWForever/ItemNames'
import { foreverItemNamesToEntries } from '../utils/WoWForever/itemNames'

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange: Marketable Items WoW Forever' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'A list of all marketable WoW Forever items on Saddlebag Exchange'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/wow-forever/itemlist'
    }
  ]
}

export const loader: LoaderFunction = async () => {
  const names = await ForeverItemNames()
  return json({ items: foreverItemNamesToEntries(names) })
}

export default function Index() {
  const { items } = useLoaderData<{ items: Array<[string, string]> }>()
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (term.length < 2) return items
    return items.filter(
      ([itemId, itemName]) =>
        itemName.toLowerCase().includes(term) || itemId.includes(term)
    )
  }, [items, query])

  return (
    <PageWrapper>
      <Banner />
      <main>
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
          List of WoW Forever Items
        </h1>
        <h2 className="mt-2 text-center text-base text-gray-600 dark:text-gray-300">
          Get auction house statistics for Forever marketable items
        </h2>
        <div className="mx-auto mt-6 max-w-xl px-5">
          <label
            htmlFor="forever-itemlist-filter"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter items
          </label>
          <input
            id="forever-itemlist-filter"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or id..."
            className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredItems.length.toLocaleString()} of{' '}
            {items.length.toLocaleString()} items
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            {filteredItems.map(([itemId, itemName]) => (
              <li key={itemId}>
                <Link
                  to={`/wow-forever/item-data/${itemId}`}
                  className="text-blue-600 hover:underline dark:text-blue-400">
                  {itemName} ({itemId})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </PageWrapper>
  )
}
