import type { LoaderFunction } from '@remix-run/cloudflare'
import { PageWrapper } from '~/components/Common'
import type {
  UploadTimersResponse,
  UploadTimersItem
} from '~/requests/WoW/UploadTimers'
import UploadTimers from '~/requests/WoW/UploadTimers'
import { useLoaderData } from '@remix-run/react'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW api data upload timers',
    description:
      'WoW: see what time blizzard updates the auctionhouse api data, this is the time when saddlebag exchange and azeroth auction assassin will update with the latest data!'
  }
}

export const loader: LoaderFunction = async () => {
  return UploadTimers()
}

const Index = () => {
  const results = useLoaderData<
    UploadTimersResponse | { exception: string } | {} | undefined
  >()

  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href="/wow/upload-timers" />
    }

    if ('data' in results) {
      return (
        <PageWrapper>
          <h1>WoW api data upload timers</h1>
          <SmallTable
            // title="Upload Timers"
            description="Shows when the WoW auction house data was last uploaded."
            columnList={columnList}
            data={results.data}
            columnSelectOptions={selectOptions}
            sortingOrder={sortingOrder}
            mobileColumnList={mobileColumnList}
            csvOptions={{
              filename: 'saddlebag-upload-timers.csv',
              columns: [
                { title: 'Dataset ID', value: 'dataSetId' },
                { title: 'Dataset Name', value: 'dataSetName' },
                { title: 'Table Name', value: 'tableName' },
                { title: 'Region', value: 'region' },
                { title: 'Last Upload Time (unix)', value: 'lastUploadUnix' },
                { title: 'Last Upload Minute', value: 'lastUploadMinute' }
              ]
            }}
          />
        </PageWrapper>
      )
    }
  }

  return <NoResults href="/wow/upload-timers" />
}

export default Index

const columnList: Array<ColumnList<UploadTimersItem>> = [
  { columnId: 'dataSetID', header: 'Data Set ID' },
  { columnId: 'lastUploadMinute', header: 'Last Upload Minute' },
  { columnId: 'lastUploadTimeRaw', header: 'Last Upload Time Raw' },
  { columnId: 'region', header: 'Region' },
  {
    columnId: 'dataSetName',
    header: 'Data Set Name',
    accessor: ({ row }) => (
      <p className="py-2 px-3 w-[200px] overflow-x-scroll">
        {row.dataSetName.join(', ')}
      </p>
    )
  }
]

const selectOptions = ['dataSetID', 'lastUploadMinute', 'region', 'dataSetName']

const sortingOrder = [{ id: 'dataSetName', desc: true }]

const mobileColumnList: Array<ColumnList<UploadTimersItem>> = [
  { columnId: 'dataSetName', header: 'Data Set Name' }
]
