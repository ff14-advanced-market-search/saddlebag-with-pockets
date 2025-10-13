import {
  useActionData,
  useNavigation,
  useLoaderData,
  useNavigate
} from '@remix-run/react'
import type { ActionFunction, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import NoResults from '~/components/Common/NoResults'
import { getUserSessionData, getSession } from '~/sessions'
import { useEffect, useState } from 'react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import { PageWrapper } from '~/components/Common'
import VideoGuide from '~/components/Common/VideoGuide'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '~/redux/useTypedSelector'
import Select from '~/components/form/select'
import type { ScripExchangeResults } from '~/requests/FFXIV/scrip-exchange'
import { ScripExchangeRequest } from '~/requests/FFXIV/scrip-exchange'
import type { ScripExchangeProps } from '~/requests/FFXIV/scrip-exchange'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import type { LoaderFunction } from '@remix-run/node'
import { combineWithDiscordSession } from '~/components/Common/DiscordSessionLoader'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Scrip Exchange',
    description:
      'Convert FFXIV currencies efficiently with our scrip exchange calculator. Compare exchange rates for Orange/Purple Crafters and Gatherers scrips, Grand Company seals, and Bicolor Gemstones. Find the best items to exchange for maximum value and optimize your currency conversion strategy.',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/ffxiv/scrip-exchange'
      }
    ]
  }
}

const validateInput = ({
  home_server,
  color
}: {
  home_server?: FormDataEntryValue | null
  color?: FormDataEntryValue | null
}): { home_server: string; color: string } | { exception: string } => {
  if (home_server === undefined || home_server === null) {
    return { exception: 'Server not found' }
  }

  if (color === undefined || color === null) {
    return { exception: 'Color not set' }
  }

  if (typeof home_server !== 'string') {
    return { exception: 'Invalid server' }
  }

  if (typeof color !== 'string') {
    return { exception: 'Invalid color' }
  }

  return { home_server, color }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const validInput = validateInput({
    home_server: session.getWorld(),
    color: formData.get('color')
  })

  if ('exception' in validInput) {
    return validInput
  }

  try {
    const data = await ScripExchangeRequest(validInput)
    if (!data) {
      return json({ exception: 'No data found.' })
    }

    return json({ ...data, payload: validInput })
  } catch (err) {
    console.error('Error fetching data:', err)
    return { exception: 'Error fetching data.' }
  }
}

const parseServerError = (error: string) => {
  if (error.includes('Error fetching data:')) {
    return 'Failed to receive result from external API'
  }

  return error
}

type ActionResponse =
  | { data: ScripExchangeResults; payload: ScripExchangeProps }
  | { exception: string }
  | {}

export const loader: LoaderFunction = async ({ request }) => {
  return combineWithDiscordSession(request, {})
}

const FFXIVScripExchange = () => {
  const transition = useNavigation()
  const actionData = useActionData<ActionResponse>()
  const loaderData = useLoaderData<{
    isLoggedIn: boolean
    hasPremium: boolean
    needsRefresh: boolean
  }>()
  const [formState, setFormState] = useState<{ color: string }>({
    color: 'Orange Gatherers'
  })
  const [error, setError] = useState<string | undefined>()
  const { darkmode } = useTypedSelector((state) => state.user)
  const { itemHistory } = useTypedSelector((state) => state.queries)
  const dispatch = useDispatch()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting' || !formState) {
      e.preventDefault()
      return
    }
  }

  const data = actionData && 'data' in actionData ? actionData.data : undefined

  useEffect(() => {
    const exception =
      actionData && 'exception' in actionData ? actionData.exception : undefined

    const payload =
      actionData && 'payload' in actionData ? actionData.payload : undefined

    if (data) {
      // dispatch(setItemHistory(results))
    } else if (exception) {
      const message = parseServerError(exception)
      setError(`Server Error: ${message}`)
    } else if (payload) {
      setError('No results found')
    }
  }, [actionData, dispatch])

  const handleFormChange = (name: string, value: string) => {
    if (error) {
      setError(undefined)
    }

    setFormState({ color: value })
  }

  return (
    <PageWrapper>
      <div className="py-3">
        <VideoGuide
          title="Video Guide: How to Use the FFXIV Scrip Exchange Calculator"
          description="Learn how to efficiently convert your FFXIV currencies and find the best items to exchange for maximum value!"
          videoId="wQV_ToQ6-8U"
          startTime={442}
          videoTitle="FFXIV Scrip Exchange Calculator Guide"
        />
        <PremiumPaywall loaderData={loaderData}>
          <SmallFormContainer
            title="Currency Conversion"
            onClick={onSubmit}
            error={error}
            loading={transition.state === 'submitting'}
            disabled={!formState}>
            <>
              <Select
                title="Currency Type"
                name="color"
                defaultValue="Orange"
                options={[
                  // Crafting & Gathering Scrips
                  { label: 'Purple Crafters', value: 'Purple Crafters' },
                  { label: 'Purple Gatherers', value: 'Purple Gatherers' },
                  { label: 'Orange Crafters', value: 'Orange Crafters' },
                  { label: 'Orange Gatherers', value: 'Orange Gatherers' },
                  // Grand Company Seals
                  { label: 'Flame Seals', value: 'Flame Seals' },
                  { label: 'Storm Seals', value: 'Storm Seals' },
                  { label: 'Serpent Seals', value: 'Serpent Seals' },
                  // Allagan Tomestones
                  {
                    label: 'Allagan Tomestone of Poetics',
                    value: 'Allagan Tomestone of Poetics'
                  },
                  {
                    label: 'Allagan Tomestone of Heliometry',
                    value: 'Allagan Tomestone of Heliometry'
                  },
                  {
                    label: 'Allagan Tomestone of Aesthetics',
                    value: 'Allagan Tomestone of Aesthetics'
                  },
                  // Society Currencies (A Realm Reborn)
                  { label: 'Ixali Oaknot', value: 'Ixali Oaknot' },
                  { label: 'Sylphic Goldleaf', value: 'Sylphic Goldleaf' },
                  { label: 'Titan Cobaltpiece', value: 'Titan Cobaltpiece' },
                  { label: 'Rainbowtide Psashp', value: 'Rainbowtide Psashp' },
                  { label: "Steel Amalj'ok", value: "Steel Amalj'ok" },
                  // Society Currencies (Heavensward)
                  { label: 'Black Copper Gil', value: 'Black Copper Gil' },
                  { label: 'Vanu Whitebone', value: 'Vanu Whitebone' },
                  { label: 'Carved Kupo Nut', value: 'Carved Kupo Nut' },
                  // Society Currencies (Stormblood)
                  { label: 'Kojin Sango', value: 'Kojin Sango' },
                  { label: 'Namazu Koban', value: 'Namazu Koban' },
                  { label: 'Ananta Dreamstaff', value: 'Ananta Dreamstaff' },
                  // Society Currencies (Shadowbringers)
                  { label: 'Pelu Pelplume', value: 'Pelu Pelplume' },
                  { label: 'Fae Fancy', value: 'Fae Fancy' },
                  { label: 'Qitari Compliment', value: 'Qitari Compliment' },
                  { label: 'Hammered Frogment', value: 'Hammered Frogment' },
                  // Society Currencies (Endwalker)
                  { label: 'Arkasodara Pana', value: 'Arkasodara Pana' },
                  { label: 'Omicron Omnitoken', value: 'Omicron Omnitoken' },
                  { label: 'Loporrit Carat', value: 'Loporrit Carat' },
                  // Society Currencies (Dawntrail)
                  { label: 'Yok Huy Ward', value: 'Yok Huy Ward' },
                  { label: 'Mamool Ja Nanook', value: 'Mamool Ja Nanook' },
                  // Hunt & Special Currencies
                  { label: 'Bicolor Gemstone', value: 'Bicolor Gemstone' }
                ]}
                onChange={(e) => handleFormChange('color', e.target.value)}
              />
            </>
          </SmallFormContainer>
        </PremiumPaywall>
      </div>
      {error === 'No results found' && (
        <NoResults href={`/ffxiv-scrip-exchange`} />
      )}
      {data && (
        <SmallTable
          data={data}
          columnList={columnList}
          mobileColumnList={mobileColumnList}
          columnSelectOptions={['itemName']}
          sortingOrder={[{ id: 'valuePerScrip', desc: true }]}
        />
      )}
    </PageWrapper>
  )
}

const columnList = [
  { columnId: 'itemName', header: 'Item Name' },
  { columnId: 'cost', header: 'Cost' },
  {
    columnId: 'minPrice',
    header: 'Min Price',
    accessor: ({ row }) =>
      row.minPrice === 999999999 ? 'Out of Stock' : row.minPrice
  },
  { columnId: 'valuePerScrip', header: 'Value Per Scrip' },
  { columnId: 'medianNQ', header: 'Median NQ' },
  { columnId: 'averageNQ', header: 'Average NQ' },
  { columnId: 'salesAmountNQ', header: 'Sales Amount NQ' },
  { columnId: 'quantitySoldNQ', header: 'Quantity Sold NQ' },
  {
    columnId: 'saddleLink',
    header: 'Item-Data',
    accessor: ({ row }) => <ItemDataLink link={row.saddleLink} />
  },
  {
    columnId: 'uniLink',
    header: 'Universalis',
    accessor: ({ row }) => <UniversalisBadgedLink link={row.uniLink} />
  },
  {
    columnId: 'webpage',
    header: 'wiki',
    accessor: ({ row }) => <ItemDataLink link={row.webpage} />
  }
]

const mobileColumnList = [
  { columnId: 'itemName', header: 'Item Name' },
  { columnId: 'cost', header: 'Cost' },
  {
    columnId: 'minPrice',
    header: 'Min Price',
    accessor: ({ row }) =>
      row.minPrice === 999999999 ? 'Out of Stock' : row.minPrice
  },
  { columnId: 'medianNQ', header: 'Median NQ' },
  { columnId: 'averageNQ', header: 'Average NQ' },
  { columnId: 'salesAmountNQ', header: 'Sales Amount NQ' },
  { columnId: 'quantitySoldNQ', header: 'Quantity Sold NQ' },
  { columnId: 'valuePerScrip', header: 'Value Per Scrip' },
  {
    columnId: 'saddleLink',
    header: 'Item-Data',
    accessor: ({ row }) => <ItemDataLink link={row.saddleLink} />
  },
  {
    columnId: 'uniLink',
    header: 'Universalis',
    accessor: ({ row }) => <UniversalisBadgedLink link={row.uniLink} />
  },
  {
    columnId: 'webpage',
    header: 'wiki',
    accessor: ({ row }) => <ItemDataLink link={row.webpage} />
  }
]

export default FFXIVScripExchange
