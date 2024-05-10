import { DocumentSearchIcon } from '@heroicons/react/outline';
import Banner from '~/components/Common/Banner';
import TileLink from '~/components/Common/TileLink';
import { wowItemsMap } from '~/utils/items/wowItems';

export const meta = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: Marketable Items WoW',
    description: 'A list of all marketable items on Saddlebag Exchange for WoW'
  }
}

export const links = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/wow/itemlist' }
]

export default function Index() {
  // Generate links for WoW items
  const wowQueries = Object.keys(wowItemsMap).map((id) => {
    return {
      name: `WoW Item ${id}`,
      description: 'View details for this item',
      Icon: DocumentSearchIcon,
      href: `/wow/item-data/${id}`
    };
  });

  // Combine all item queries into one list
  const allQueries = [...wowQueries];

  return (
    <>
      <main className="flex-1">
        <Banner />
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-blue-900 dark:text-gray-100">
              A comprehensive list of all WoW Items on Saddlebag Exchange
            </h1>
            <div className={`not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2`}>
              {allQueries.map((query) => {
                return <TileLink key={query.name} {...query} />
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
