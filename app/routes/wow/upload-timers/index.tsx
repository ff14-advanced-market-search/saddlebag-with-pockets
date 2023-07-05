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
          <SmallTable
            title="Upload Timers"
            description="Shows when the WoW auction house data was last uploaded."
            columnList={columnList}
            data={results.data}
            columnSelectOptions={selectOptions}
            sortingOrder={sortingOrder}
            mobileColumnList={mobileColumnList}
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
  { columnId: 'dataSetName', header: 'Data Set Name' },
  { columnId: 'lastUploadMinute', header: 'Last Upload Minute' },
  { columnId: 'lastUploadTimeRaw', header: 'Last Upload Time Raw' },
  { columnId: 'lastUploadUnix', header: 'Last Upload Unix' },
  { columnId: 'region', header: 'Region' },
  { columnId: 'tableName', header: 'Table Name' }
]

const selectOptions = ['lastUploadMinute']

const sortingOrder = [{ id: 'lastUploadMinute', desc: true }]

const mobileColumnList: Array<ColumnList<UploadTimersItem>> = [
  { columnId: 'dataSetName', header: 'Data Set Name' },
  { columnId: 'lastUploadMinute', header: 'Last Upload Minute' }
]
