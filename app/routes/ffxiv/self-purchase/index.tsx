import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import TitleTooltip from '~/components/Common/TitleTooltip'
import DateCell from '~/components/FFXIVResults/FullScan/DateCell'
import FullTable from '~/components/Tables/FullTable'
import MobileTable from '~/components/WoWResults/FullScan/MobileTable'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { SelectWorld } from '~/components/form/select/SelectWorld/SelectWorld'
import type { ColumnList } from '~/components/types'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import type { SelfPurchaseResults } from '~/requests/FFXIV/self-purchase'
import selfPurchaseRequest from '~/requests/FFXIV/self-purchase'
import type { SelfPurchase } from '~/requests/FFXIV/self-purchase'
import { getUserSessionData } from '~/sessions'
import WorldsMap from '~/utils/locations/Worlds'

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBounds error={error} />
)

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSessionData(request)

  return json({
    server: session.getWorld(),
    dataCenter: session.getDataCenter()
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const playerName = formData.get('playerName')
  const server = formData.get('world')

  if (!playerName || typeof playerName !== 'string' || !playerName.trim()) {
    return json({ exception: 'No player name provided' })
  }

  if (!server || typeof server !== 'string' || !server.trim()) {
    return json({ exception: 'No server provided' })
  }

  return await selfPurchaseRequest({
    server: server.trim(),
    playerName: playerName.trim()
  })
}

export default function Index() {
  const transition = useTransition()
  const loaderData = useLoaderData<{ server: string; dataCenter: string }>()
  const results = useActionData<SelfPurchaseResults>()
  const loading = transition.state === 'submitting'

  const worldList = WorldsMap.get(loaderData.dataCenter)

  const worlds = worldList ? worldList : []

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
          <TitleTooltip
            title="Choose world to search"
            toolTip="Choose a world in your data center"
            relative
          />
          <SelectWorld
            dataCenter={loaderData.dataCenter}
            world={loaderData.server}
            onSelect={() => {}}
            worlds={worlds}
          />
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
  },
  {
    columnId: 'timestamp',
    header: 'Updated At',
    accessor: ({ row }) => <DateCell date={row.timestamp * 1000} />
  }
]

const mobileColumnList = [
  { columnId: 'item_name', header: 'Item name' },
  { columnId: 'pricePerUnit', header: 'Price per unit' }
]

const Results = ({
  data,
  totalSpent
}: {
  data: Array<SelfPurchase>
  totalSpent: number
}) => {
  return (
    <PageWrapper>
      <Title title="Self Purchase Items" />
      <Title
        title={`Total spent: ${totalSpent.toLocaleString()} gil`}
        className="text-xl"
      />
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
        columnList={mobileColumnList}
        rowLabels={columnList}
        columnSelectOptions={sortByOptions}
      />
    </PageWrapper>
  )
}
