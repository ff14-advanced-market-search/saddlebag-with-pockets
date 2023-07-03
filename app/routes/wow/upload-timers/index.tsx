import type { LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { PageWrapper } from '~/components/Common'
import type {
  UploadTimersResponse,
  UploadTimersItem
} from '~/requests/WoW/UploadTimers'
import UploadTimersRequest from '~/requests/WoW/UploadTimers'
import { useLoaderData } from '@remix-run/react'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'

export const loader: LoaderFunction = async ({ request }) => {
  return await json(UploadTimersRequest())
}

type UploadTimersActionResponse =
  | UploadTimersResponse
  | { exception: string }
  | {}
  | undefined

const UploadTimers = () => {
  const results = useLoaderData<UploadTimersActionResponse>()

  if (results) {
    if (!Object.keys(results).length) {
      return <NoResults href="/wow/upload-timers" />
    }
  }

  return (
    <PageWrapper>
      <SmallTable
        title="Upload Timers"
        description="Shows when the WoW auction house data was last uploaded."
        columnList={columnList}
        data={[]}
        columnSelectOptions={selectOptions}
        sortingOrder={sortingOrder}
        mobileColumnList={mobileColumnList}
      />
    </PageWrapper>
  )
}

export default UploadTimers

const columnList: Array<ColumnList<UploadTimersItem>> = [
  { columnId: 'dataSetID', header: 'Data Set ID' },
  { columnId: 'dataSetName', header: 'Data Set Name' },
  { columnId: 'lastUploadMinute', header: 'Last Upload Minute' },
  { columnId: 'lastUploadTimeRaw', header: 'Last Upload Time Raw' },
  { columnId: 'lastUploadUnix', header: 'Last Upload Unix' },
  { columnId: 'region', header: 'Region' },
  { columnId: 'tableName', header: 'Table Name' }
]

const selectOptions = ['user_price', 'lowest_price', 'realmName']

const sortingOrder = [{ id: 'user_price', desc: true }]

const mobileColumnList: Array<ColumnList<UploadTimersItem>> = [
  { columnId: 'dataSetName', header: 'Data Set Name' },
  { columnId: 'lastUploadMinute', header: 'Last Upload Minute' }
]
