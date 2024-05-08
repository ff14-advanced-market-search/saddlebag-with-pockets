import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { z } from 'zod'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { TextArea } from '~/components/form/TextArea'
import { getUserSessionData } from '~/sessions'
import type {
  RegionUndercutResponse,
  UndercutItems
} from '~/requests/WoW/RegionUndercut'
import RegionUndercutRequest from '~/requests/WoW/RegionUndercut'
import { useActionData, useNavigation } from '@remix-run/react'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'

const formName = 'region-undercut'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: region wide undercut search',
    description: 'Look up your wow undercuts across all realms at once!'
  }
}

// Overwrite default links in the root.tsx
export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/wow/region-undercut'
  }
]

const petAuction = z.object({
  petID: z.number(),
  price: z.number(),
  auctionID: z.number()
})
const itemAuction = z.object({
  itemID: z.number(),
  price: z.number(),
  auctionID: z.number()
})

const validateInput = z.array(
  z.object({
    homeRealmName: z.string(),
    region: z.string(),
    user_auctions: z.array(z.union([petAuction, itemAuction]))
  })
)

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const input = formData.has(formName) ? formData.get(formName) : null

  if (!input || typeof input !== 'string') {
    return json({ exception: 'Missing input' })
  }

  try {
    const parsedInput = JSON.parse(input)
    const validInput = validateInput.safeParse(parsedInput)

    if (!validInput.success) {
      throw new Error('Invalid input')
    }

    const { region, server } = session.getWoWSessionData()

    return await RegionUndercutRequest({
      region,
      homeRealmId: server.id,
      addonData: validInput.data
    })
  } catch (error) {
    if (error instanceof Error) {
      return json({ exception: error.message })
    } else {
      return json({ exception: 'Unknown Error' })
    }
  }
}

type RegionActionResponse =
  | RegionUndercutResponse
  | { exception: string }
  | {}
  | undefined

const undercutColumns: Array<{ value: keyof UndercutItems; title: string }> = [
  {
    title: 'Item ID',
    value: 'item_id'
  },
  {
    title: 'Item Name',
    value: 'item_name'
  },
  {
    title: 'User Price',
    value: 'user_price'
  },
  {
    title: 'Lowest Price',
    value: 'lowest_price'
  },
  {
    title: 'Realm Name',
    value: 'realmName'
  },
  {
    title: 'Connected Realm Id',
    value: 'connectedRealmId'
  }
]

const RegionUndercut = () => {
  const transition = useNavigation()
  const results = useActionData<RegionActionResponse>()
  const isLoading = transition.state === 'submitting'

  const error =
    results && 'exception' in results ? results.exception : undefined

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) {
      event.preventDefault()
    }
  }

  if (results) {
    if (!Object.keys(results).length) {
      return <NoResults href="/wow/region-undercut" />
    }

    if ('not_found_list' in results) {
      return (
        <PageWrapper>
          <SmallTable
            title="Undercut Items"
            description="Shows items that are undercut."
            columnList={columnList}
            data={results.undercut_list}
            columnSelectOptions={selectOptions}
            sortingOrder={sortingOrder}
            mobileColumnList={mobileColumnList}
            csvOptions={{
              filename: 'saddlebag-undercut-items.csv',
              columns: undercutColumns
            }}
          />
          <SmallTable
            title="Not Found Items"
            description="Shows items that were sold, expired or not found."
            columnList={columnList}
            data={results.not_found_list}
            columnSelectOptions={selectOptions}
            sortingOrder={sortingOrder}
            mobileColumnList={mobileColumnList}
            csvOptions={{
              filename: 'saddlebag-undercut-not-found.csv',
              columns: undercutColumns
            }}
          />
        </PageWrapper>
      )
    }
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Region Undercuts"
        onClick={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        error={error}>
        <div className="p-3">
          <TextArea
            label="Region undercut data"
            toolTip="Paste the data from our ingame tool here"
            formName={formName}
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default RegionUndercut

const columnList: Array<ColumnList<UndercutItems>> = [
  { columnId: 'item_name', header: 'Item Name' },
  { columnId: 'user_price', header: 'User Price' },
  { columnId: 'lowest_price', header: 'Lowest Price' },
  { columnId: 'realmName', header: 'Realm' },
  {
    columnId: 'link',
    header: 'Undermine Link',
    accessor: ({ getValue }) => (
      <ExternalLink text="Undermine" link={getValue() as string} />
    )
  }
]

const selectOptions = ['user_price', 'lowest_price', 'realmName']

const sortingOrder = [{ id: 'user_price', desc: true }]

const mobileColumnList: Array<ColumnList<UndercutItems>> = [
  { columnId: 'item_name', header: 'Item Name' },
  { columnId: 'user_price', header: 'User Price' }
]
