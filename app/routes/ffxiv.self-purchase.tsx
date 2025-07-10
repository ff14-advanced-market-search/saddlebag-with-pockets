import { useState } from 'react'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate
} from '@remix-run/react'
import { PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import DateCell from '~/components/FFXIVResults/FullScan/DateCell'
import FullTable from '~/components/Tables/FullTable'
import MobileTable from '~/components/WoWResults/FullScan/MobileTable'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import SelectDCandWorld from '~/components/form/select/SelectWorld'
import type { ColumnList } from '~/components/types'
import CSVButton from '~/components/utilities/CSVButton'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import type { SelfPurchaseResults } from '~/requests/FFXIV/self-purchase'
import selfPurchaseRequest from '~/requests/FFXIV/self-purchase'
import type { SelfPurchase } from '~/requests/FFXIV/self-purchase'
import { getUserSessionData, getSession } from '~/sessions'
import DebouncedInput from '~/components/Common/DebouncedInput'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { getHasPremium, DISCORD_SERVER_URL } from '~/utils/premium'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV marketboard purchase history',
    description: 'Look up your FFXIV purchase history on the ffxiv marketboard',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/ffxiv/self-purchase'
      }
    ]
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const discordId = session.get('discord_id')
  const discordRoles = session.get('discord_roles') || []
  const rolesRefreshedAt = session.get('discord_roles_refreshed_at')
  const isLoggedIn = !!discordId
  const hasPremium = getHasPremium(discordRoles)
  const needsRefresh = needsRolesRefresh(rolesRefreshedAt)

  return json({
    world: session.getWorld(),
    data_center: session.getDataCenter(),
    isLoggedIn,
    hasPremium,
    needsRefresh
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

/**
 * Renders the FFXIV self-purchase history page, handling paywall access, form submission, and result display.
 *
 * Displays a form for entering player and world information, conditionally wrapped in a premium paywall based on user login and premium status. Shows purchase results or a no-results message after form submission.
 */
export default function Index() {
  const transition = useNavigation()
  const loaderData = useLoaderData<{
    server: string
    dataCenter: string
    isLoggedIn: boolean
    hasPremium: boolean
    needsRefresh: boolean
  }>()
  const results = useActionData<SelfPurchaseResults>()
  const loading = transition.state === 'submitting'
  const navigate = useNavigate()

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

  // Paywall logic
  const showPaywall =
    !loaderData.isLoggedIn || !loaderData.hasPremium || loaderData.needsRefresh
  const handleLogin = () => {
    navigate('/discord-login')
  }
  const handleSubscribe = () => {
    window.open(DISCORD_SERVER_URL, '_blank')
  }

  return (
    <PageWrapper>
      <PremiumPaywall
        show={showPaywall}
        isLoggedIn={loaderData.isLoggedIn}
        hasPremium={loaderData.hasPremium}
        needsRefresh={loaderData.needsRefresh}
        onLogin={handleLogin}
        onSubscribe={handleSubscribe}>
        <SmallFormContainer
          title="Self Purchase Items"
          error={error}
          loading={loading}
          onClick={(e) => {
            if (loading) {
              e.preventDefault()
            }
          }}>
          <div className="py-2">
            <SelectDCandWorld
              navigation={transition}
              sessionData={loaderData}
            />
          </div>
          <InputWithLabel
            type="text"
            name="playerName"
            labelTitle="Player Name"
            toolTip="The name of your player"
          />
        </SmallFormContainer>
      </PremiumPaywall>
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

const cvsFileList: Array<{ title: string; value: keyof SelfPurchase }> = [
  { title: 'Item Id', value: 'itemID' },
  { title: 'Item Name', value: 'item_name' },
  { title: 'Buyer Name', value: 'buyerName' },
  { title: 'Price Per Unit', value: 'pricePerUnit' },
  { title: 'Quantity', value: 'quantity' },
  { title: 'High Quality', value: 'hq' },
  { title: 'Mannequin', value: 'onMannequin' },
  { title: 'Updated At', value: 'timestamp' }
]

const Results = ({
  data,
  totalSpent
}: {
  data: Array<SelfPurchase>
  totalSpent: number
}) => {
  const [globalFilter, setGlobalFilter] = useState('')

  return (
    <PageWrapper>
      <Title title="Self Purchase Items" />
      <Title
        title={`Total spent: ${totalSpent.toLocaleString()} gil`}
        className="text-xl"
      />
      <div className="flex justify-between">
        <CSVButton
          data={data}
          columns={cvsFileList}
          filename="saddlebag-selfpurchase.csv"
        />
        <DebouncedInput
          onDebouncedChange={(value) => {
            setGlobalFilter(value)
          }}
          className={'hidden sm:block p-2 rounded-md'}
          placeholder={'Search...'}
        />
      </div>
      <div className="hidden sm:block">
        <FullTable<SelfPurchase>
          data={data}
          sortingOrder={[{ id: 'timestamp', desc: true }]}
          columnList={columnList}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      <MobileTable
        data={data}
        sortingOrder={[{ id: 'timestamp', desc: true }]}
        columnList={mobileColumnList}
        rowLabels={columnList}
        columnSelectOptions={sortByOptions}
      />
    </PageWrapper>
  )
}
