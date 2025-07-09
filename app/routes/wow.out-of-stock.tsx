import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect, useState } from 'react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { OutOfStockItem } from '~/requests/WoW/OutOfStock'
import WoWOutOfStock from '~/requests/WoW/OutOfStock'
import { getUserSessionData } from '~/sessions'
import z from 'zod'
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate
} from '@remix-run/react'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import { parseZodErrorsToDisplayString } from '~/utils/zodHelpers'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'
import ExternalLink from '~/components/utilities/ExternalLink'
import OutOfStockForm from '~/components/form/WoW/OutOfStockForm'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { getHasPremium, DISCORD_SERVER_URL } from '~/utils/premium'
import { getSession } from '~/sessions'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW Out of Stock Items',
    description:
      'Sell without Competition! Search for items that are out of stock across various WoW Realms.',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/wow/out-of-stock'
      }
    ]
  }
}

const PAGE_URL = '/wow/out-of-stock'

const defaultFormValues = {
  salesPerDay: '0.2',
  avgPrice: '1000',
  minMarketValue: '100000',
  populationWP: '3000',
  populationBlizz: '1',
  rankingWP: '90',
  expansionNumber: '-1',
  includeCategories: '',
  excludeCategories: ''
}

const inputMap: Record<string, string> = {
  salesPerDay: 'Sales Per Day',
  avgPrice: 'Average Price',
  minMarketValue: 'Minimum Market Value',
  populationWP: 'WoWProgress Population',
  populationBlizz: 'Blizzard Population',
  rankingWP: 'WoWProgress Ranking',
  expansionNumber: 'WoW Expansion',
  includeCategories: 'Include Categories',
  excludeCategories: 'Exclude Categories'
}

const validateInput = z.object({
  salesPerDay: z.string().transform((value) => parseFloat(value)),
  avgPrice: z.string().transform((value) => parseInt(value)),
  minMarketValue: z.string().transform((value) => parseInt(value)),
  populationWP: z.string().transform((value) => parseInt(value)),
  populationBlizz: z.string().transform((value) => parseInt(value)),
  rankingWP: z.string().transform((value) => parseInt(value)),
  expansionNumber: z.string().transform((value) => parseInt(value)),
  includeCategories: z
    .string()
    .transform((value) =>
      value.trim() === ''
        ? []
        : value.split(',').map((value) => parseInt(value))
    ),
  excludeCategories: z
    .string()
    .transform((value) =>
      value.trim() === ''
        ? []
        : value.split(',').map((value) => parseInt(value))
    )
})

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const params = new URL(request.url).searchParams
    const values = Object.fromEntries(
      Object.entries(defaultFormValues).map(([key, defaultValue]) => [
        key,
        params.get(key) || defaultValue
      ])
    )

    const validParams = validateInput.safeParse(values)
    if (!validParams.success) {
      return json({
        exception: parseZodErrorsToDisplayString(validParams.error, inputMap)
      })
    }

    const session = await getUserSessionData(request)
    const { region } = session.getWoWSessionData()

    // Get Discord session info
    const discordSession = await getSession(request.headers.get('Cookie'))
    const discordId = discordSession.get('discord_id')
    const discordRoles = discordSession.get('discord_roles') || []
    const isLoggedIn = !!discordId
    const hasPremium = getHasPremium(discordRoles)

    return json({ ...validParams.data, region, isLoggedIn, hasPremium })
  } catch (error) {
    return json({
      exception: 'Invalid URL format'
    })
  }
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)
  const { region } = session.getWoWSessionData()
  if (!region) {
    return json({
      exception: 'Region is required. Please select a region in your settings.'
    })
  }

  const formData = Object.fromEntries(await request.formData())
  const validatedFormData = validateInput.safeParse(formData)

  if (!validatedFormData.success) {
    return json({
      exception: parseZodErrorsToDisplayString(
        validatedFormData.error,
        inputMap
      )
    })
  }

  try {
    const result = await WoWOutOfStock({
      ...validatedFormData.data,
      region
    })

    if (!result.ok) {
      throw new Error(`API error: ${result.status}`)
    }

    const data = await result.json()
    if (!Array.isArray(data?.data)) {
      throw new Error('Invalid API response format')
    }

    return json({
      data: data.data,
      sortby: 'popWoWProgress'
    })
  } catch (error) {
    return json({
      exception:
        error instanceof Error ? error.message : 'An unexpected error occurred'
    })
  }
}

const OutOfStock = () => {
  const loaderData = useLoaderData<
    typeof loader & { isLoggedIn: boolean; hasPremium: boolean }
  >()
  const result = useActionData<{
    data?: OutOfStockItem[]
    exception?: string
  }>()
  const transition = useNavigation()
  const isSubmitting = transition.state === 'submitting'
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(loaderData).map(([key, value]) => [
        key,
        typeof value === 'number'
          ? value.toString()
          : Array.isArray(value)
          ? value.join(',')
          : String(value)
      ])
    )
  )
  const error = result?.exception

  // Paywall logic
  const showPaywall = !loaderData.isLoggedIn || !loaderData.hasPremium
  const handleLogin = () => {
    navigate('/discord-login')
  }
  const handleSubscribe = () => {
    window.open(DISCORD_SERVER_URL, '_blank')
  }

  if (result?.data?.length === 0) {
    return <NoResults href={PAGE_URL} />
  }

  if (result?.data) {
    return <Results data={result.data} sortby="popWoWProgress" />
  }

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isSubmitting) {
      event.preventDefault()
    }
  }

  const handleFormChange = (name: string, value: string) => {
    handleSearchParamChange(name, value)
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <PageWrapper>
      <PremiumPaywall
        show={showPaywall}
        isLoggedIn={!!loaderData.isLoggedIn}
        hasPremium={!!loaderData.hasPremium}
        onLogin={handleLogin}
        onSubscribe={handleSubscribe}>
        <SmallFormContainer
          title="Out of Stock Items"
          description="Find items that are not listed on the auctionhouse of super high pop realms!"
          onClick={handleSubmit}
          error={error}
          loading={isSubmitting}
          role="search"
          aria-label="Search out of stock items"
          action={getActionUrl(PAGE_URL, searchParams)}>
          <div className="pt-2">
            <div className="flex justify-end mb-2">
              <SubmitButton
                title="Share this search!"
                onClick={handleCopyButton}
                type="button"
              />
            </div>
          </div>
          <OutOfStockForm
            defaultValues={searchParams}
            onFormChange={handleFormChange}
          />
        </SmallFormContainer>
      </PremiumPaywall>
    </PageWrapper>
  )
}

const Results = ({
  data,
  sortby
}: {
  data: OutOfStockItem[]
  sortby: string
}) => {
  const { region } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (window && document) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <PageWrapper>
      <SmallTable
        title="Out of Stock Items"
        sortingOrder={[{ desc: true, id: sortby }]}
        columnList={columnList(region)}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={[
          'marketValue',
          'salesPerDay',
          'popWoWProgress',
          'rankWoWProgress'
        ]}
        data={data}
        csvOptions={{
          filename: 'saddlebag-out-of-stock.csv',
          columns: [
            { title: 'Item ID', value: 'itemID' },
            { title: 'Item Name', value: 'itemName' },
            { title: 'Market Value', value: 'marketValue' },
            { title: 'Historic Price', value: 'historicPrice' },
            { title: 'Sales Per Day', value: 'salesPerDay' },
            { title: 'Population', value: 'popWoWProgress' },
            { title: 'Rank', value: 'rankWoWProgress' },
            { title: 'Realm', value: 'realmNames' }
          ]
        }}
      />
    </PageWrapper>
  )
}

const columnList = (region: string): Array<ColumnList<OutOfStockItem>> => [
  { columnId: 'itemName', header: 'Item Name' },
  {
    columnId: 'realmNames',
    header: 'Realm',
    accessor: ({ row }) => (
      <p className="px-3 py-2 max-w-[200px] overflow-x-scroll">
        {row.realmNames}
      </p>
    )
  },
  {
    columnId: 'saddlebagLink',
    header: 'Where to Buy',
    accessor: ({ getValue }) => <ExternalLink link={getValue() as string} />
  },
  {
    columnId: 'undermineLink',
    header: 'Undermine Link',
    accessor: ({ getValue }) => <ExternalLink link={getValue() as string} />
  },
  { columnId: 'marketValue', header: 'Market Value' },
  { columnId: 'historicPrice', header: 'Historic Price' },
  { columnId: 'salesPerDay', header: 'Sales/Day' },
  { columnId: 'popWoWProgress', header: 'Population' },
  { columnId: 'rankWoWProgress', header: 'Rank' }
]

const mobileColumnList: Array<ColumnList<OutOfStockItem>> = [
  { columnId: 'itemName', header: 'Item Name' },
  { columnId: 'realmNames', header: 'Realm' }
]

export default OutOfStock
