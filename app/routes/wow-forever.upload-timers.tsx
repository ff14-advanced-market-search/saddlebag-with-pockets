import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import Banner from '~/components/Common/Banner'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ForeverUploadTimers, {
  type ForeverUploadTimer
} from '~/requests/WoWForever/UploadTimers'
import { foreverAuctionHouseLabel, foreverFeedLabel } from '~/utils/WoWForever'
import { useState, useMemo } from 'react'

const withSearchLabels = (row: ForeverUploadTimer) => ({
  ...row,
  auctionHouseLabel: foreverAuctionHouseLabel(row.auctionHouseID),
  feedLabel: foreverFeedLabel(row.feedType)
})

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange: WoW Forever Upload Timers' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'See when Blizzard last updated every WoW Forever auction house. Alliance, Horde, and Neutral houses are all listed for North America and Europe.'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/wow-forever/upload-timers'
    }
  ]
}

export const loader: LoaderFunction = async () => {
  const results = await ForeverUploadTimers()
  return json({ data: results.data })
}

const Index = () => {
  const results = useLoaderData<
    { data: Array<ForeverUploadTimer> } | undefined
  >()

  const [regionFilter, setRegionFilter] = useState<'All' | 'EU' | 'NA'>('All')

  const filteredData = useMemo(() => {
    if (!results?.data) return []
    
    const dataWithLabels = results.data.map(withSearchLabels)
    
    if (regionFilter === 'All') {
      return dataWithLabels
    }
    
    return dataWithLabels.filter((item) => item.region === regionFilter)
  }, [results?.data, regionFilter])

  if (!results?.data?.length) {
    return <NoResults href="/wow-forever/upload-timers" />
  }

  return (
    <PageWrapper>
      <h1 className="text-white text-2xl font-semibold mb-2">
        WoW Forever Upload Timers
      </h1>
      <Banner />
      
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={() => setRegionFilter('All')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            regionFilter === 'All'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setRegionFilter('EU')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            regionFilter === 'EU'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          EU
        </button>
        <button
          onClick={() => setRegionFilter('NA')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            regionFilter === 'NA'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          NA
        </button>
      </div>

      <SmallTable
        description="Shows when every WoW Forever auction house was last updated, for both regions and every faction. Item listings and commodities update separately."
        columnList={columnList}
        data={
          filteredData as Array<
            Record<string, string | number>
          >
        }
        columnSelectOptions={selectOptions}
        sortingOrder={sortingOrder}
        mobileSortingOrder={mobileSortingOrder}
        mobileColumnList={mobileColumnList}
        csvOptions={{
          filename: 'saddlebag-wow-forever-upload-timers.csv',
          columns: [
            { title: 'Region', value: 'region' },
            { title: 'Auction House', value: 'auctionHouseLabel' },
            { title: 'Feed', value: 'feedLabel' },
            { title: 'Last Upload Time Raw', value: 'lastUploadTimeRaw' },
            { title: 'Last Upload Time (unix)', value: 'lastUploadUnix' },
            { title: 'Auction Count', value: 'auctionCount' }
          ]
        }}
      />
    </PageWrapper>
  )
}

export default Index

const columnList: Array<ColumnList<ForeverUploadTimer>> = [
  { columnId: 'region', header: 'Region' },
  { columnId: 'auctionHouseLabel', header: 'Auction House' },
  { columnId: 'feedLabel', header: 'Feed' },
  {
    columnId: 'lastUploadUnix',
    header: 'Last Upload Time Raw',
    accessor: ({ row }) => <span>{row.lastUploadTimeRaw}</span>
  },
  { columnId: 'auctionCount', header: 'Auctions' }
]

const selectOptions = ['region', 'lastUploadUnix', 'auctionCount']

const sortingOrder = [{ id: 'auctionHouseLabel', desc: false }]

const mobileSortingOrder = [{ id: 'lastUploadUnix', desc: true }]

const mobileColumnList: Array<ColumnList<ForeverUploadTimer>> = [
  { columnId: 'region', header: 'Region' },
  { columnId: 'feedLabel', header: 'Feed' },
  { columnId: 'auctionCount', header: 'Auctions' },
  { columnId: 'lastUploadUnix', header: 'Last Upload Time Raw' }
]
