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

const formatUnix = (unix: number) => {
  if (!unix) return ''
  return new Date(unix * 1000).toLocaleString()
}

const Index = () => {
  const results = useLoaderData<
    { data: Array<ForeverUploadTimer> } | undefined
  >()

  if (!results?.data?.length) {
    return <NoResults href="/wow-forever/upload-timers" />
  }

  return (
    <PageWrapper>
      <h1 className="text-white text-2xl font-semibold mb-2">
        WoW Forever Upload Timers
      </h1>
      <Banner />
      <SmallTable
        description="Shows when every WoW Forever auction house was last updated, for both regions and every faction. Item listings and commodities update separately."
        columnList={columnList}
        data={
          results.data.map(withSearchLabels) as Array<
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
            { title: 'Last Checked Unix', value: 'lastCheckedUnix' },
            { title: 'Last Published Unix', value: 'lastPublishedUnix' },
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
    header: 'Last Upload',
    hidden: true,
    accessor: ({ row }) => <span>{row.lastUploadTimeRaw}</span>
  },
  {
    columnId: 'lastCheckedUnix',
    header: 'Last Checked',
    accessor: ({ row }) => <span>{formatUnix(row.lastCheckedUnix)}</span>
  },
  {
    columnId: 'lastPublishedUnix',
    header: 'Last Published',
    accessor: ({ row }) => <span>{formatUnix(row.lastPublishedUnix)}</span>
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
  { columnId: 'lastUploadUnix', header: 'Last Upload' }
]
