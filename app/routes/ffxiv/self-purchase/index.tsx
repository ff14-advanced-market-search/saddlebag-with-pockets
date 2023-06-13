import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useTransition } from '@remix-run/react'
import { PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import DateCell from '~/components/FFXIVResults/FullScan/DateCell'
import FullTable from '~/components/Tables/FullTable'
import MobileTable from '~/components/WoWResults/FullScan/MobileTable'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ColumnList } from '~/components/types'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import type { SelfPurchaseResults } from '~/requests/FFXIV/self-purchase'
import selfPurchaseRequest from '~/requests/FFXIV/self-purchase'
import type { SelfPurchase } from '~/requests/FFXIV/self-purchase'
import { getUserSessionData } from '~/sessions'

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBounds error={error} />
)

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const playerName = formData.get('playerName')

  if (!playerName || typeof playerName !== 'string' || !playerName.trim()) {
    return json({ exception: 'No player name provided' })
  }

  return await selfPurchaseRequest({
    server: session.getWorld(),
    playerName: playerName.trim()
  })
}

export default function Index() {
  const transition = useTransition()
  const results = useActionData<SelfPurchaseResults>()
  const loading = transition.state === 'submitting'

  console.log('results', results)

  const error =
    results && 'exception' in results ? results.exception : undefined

  if (results && !error) {
    if (!Object.keys(results).length) {
      return <NoResults href="/ffxiv/self-purchase" />
    }

    if ('data' in results) {
      return <Results data={results.data} totalSpent={results.total_spent} />
    }
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Self Purchase Items"
        error={error}
        loading={loading}
        onClick={(e) => {
          if (loading) {
            e.preventDefault()
          }
        }}>
        <div className="pt-2">
          <InputWithLabel
            type="text"
            name="playerName"
            labelTitle="Player Name"
            toolTip="The name of your player"
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

const sortByOptions: Array<string> = ['pricePerUnit', 'quantity', 'timestamp']

const columnList: Array<ColumnList<SelfPurchase>> = [
  { columnId: 'item_name', header: 'Item Name' },
  {
    columnId: 'timestamp',
    header: 'Updated At',
    accessor: ({ row }) => <DateCell date={row.timestamp * 1000} />
  },
  { columnId: 'pricePerUnit', header: 'Price Per Unit' },
  { columnId: 'quantity', header: 'Quantity' },
  {
    columnId: 'hq',
    header: 'Quality',
    accessor: ({ row }) => (row.hq ? <>High</> : <></>)
  },
  {
    columnId: 'onMannequin',
    header: 'Retailer',
    accessor: ({ row }) => (row.onMannequin ? <>Mannequin</> : <>Retainer</>)
  },
  {
    columnId: 'itemID',
    header: 'Item data',
    accessor: ({ row }) => {
      const itemID = row.itemID
      if (!itemID || typeof itemID !== 'string') return null
      return <ItemDataLink link={`/queries/item-data/${itemID}`} />
    }
  }
]

const Results = ({
  data
}: {
  data: Array<SelfPurchase>
  totalSpent: number
}) => {
  return (
    <PageWrapper>
      <Title title="Self Purchase Items" />
      <div className="hidden sm:block">
        <FullTable<SelfPurchase>
          data={data}
          sortingOrder={[{ id: 'pricePerUnit', desc: true }]}
          columnList={columnList}
        />
      </div>
      <MobileTable
        data={data}
        sortingOrder={[{ id: 'pricePerUnit', desc: true }]}
        columnList={columnList}
        rowLabels={columnList}
        columnSelectOptions={sortByOptions}
      />
    </PageWrapper>
  )
}
