import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect, useState } from 'react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ListItem, IlvlWoWListResponse, ItemStat } from '~/requests/WoW/IlvlShoppingList'
import IlvlShoppingList from '~/requests/WoW/IlvlShoppingList'
import { getUserSessionData } from '~/sessions'
import z from 'zod'
import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  useActionData,
  useNavigation,
  useSearchParams,
  useLoaderData
} from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import { wowItems, wowItemsList } from '~/utils/items/id_to_item'
import { getItemIDByName, getItemNameById } from '~/utils/items'
import {
  parseStringToNumber,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW BOE Item Level Shopping List',
    description:
      'Search for raid BOE items with specific item levels and stats across all realms with our WoW Item Level Shopping List!'
  }
}

export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/wow/ilvl-shopping-list' }
]

const PAGE_URL = '/wow/ilvl-shopping-list'

const AVAILABLE_STATS: ItemStat[] = [
  'Socket',
  'Leech',
  'Speed',
  'Avoidance',
  // 'Haste',
  // 'Crit',
  // 'Mastery',
  // 'Versatility'
]

const inputMap: Record<string, string> = {
  itemID: 'Item ID',
  maxPurchasePrice: 'Maximum Purchase Price',
  desiredMinIlvl: 'Minimum Item Level'
}

const validateInput = z.object({
  itemID: parseStringToNumber,
  maxPurchasePrice: parseStringToNumber,
  desiredMinIlvl: parseStringToNumber
})

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)
  const formData = await request.formData()
  const formDataObj = Object.fromEntries(formData)

  const validatedFormData = validateInput.safeParse(formDataObj)
  if (!validatedFormData.success) {
    return json({
      exception: parseZodErrorsToDisplayString(
        validatedFormData.error,
        inputMap
      )
    })
  }

  const region = session.getWoWSessionData().region
  const desiredStats = formData.getAll('desiredStats') as ItemStat[]

  const result = await IlvlShoppingList({
    region,
    ...validatedFormData.data,
    desiredStats
  })

  return json({
    ...(await result.json()),
    sortby: 'price'
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const params = url.searchParams

  const itemID = params.get('itemId')
  const maxPurchasePrice = params.get('maxPurchasePrice') || '10000000'
  const desiredMinIlvl = params.get('desiredMinIlvl') || '610'
  const desiredStats = params.getAll('desiredStats') as ItemStat[]

  if (itemID) {
    const validateInput = z.object({
      itemID: parseStringToNumber,
      maxPurchasePrice: parseStringToNumber,
      desiredMinIlvl: parseStringToNumber
    })

    const formData = { itemID, maxPurchasePrice, desiredMinIlvl }
    const validatedFormData = validateInput.safeParse(formData)
    if (!validatedFormData.success) {
      return json({
        exception: parseZodErrorsToDisplayString(
          validatedFormData.error,
          inputMap
        )
      })
    }

    const session = await getUserSessionData(request)
    const region = session.getWoWSessionData().region

    const result = await IlvlShoppingList({
      region,
      ...validatedFormData.data,
      desiredStats
    })

    return json({
      ...(await result.json()),
      sortby: 'price',
      formValues: { ...validatedFormData.data, desiredStats }
    })
  }

  return json({})
}

type LoaderResponseType =
  | {}
  | { exception: string }
  | (IlvlWoWListResponse & {
      sortby: string
      formValues: { itemID: number; maxPurchasePrice: number; desiredMinIlvl: number; desiredStats: ItemStat[] }
    })

type ActionResponseType =
  | {}
  | { exception: string }
  | (IlvlWoWListResponse & { sortby: string })

const IlvlShoppingListComponent = () => {
  const actionData = useActionData<ActionResponseType>()
  const loaderData = useLoaderData<LoaderResponseType>()
  const [searchParams] = useSearchParams()
  const result = actionData ?? loaderData
  const transition = useNavigation()
  const [itemName, setItemName] = useState<string>('')
  const [maxPurchasePrice, setMaxPurchasePrice] = useState<string>('10000000')
  const [desiredMinIlvl, setDesiredMinIlvl] = useState<string>('610')
  const [itemID, setItemID] = useState<string>('')
  const [selectedStats, setSelectedStats] = useState<ItemStat[]>([])

  const isSubmitting = transition.state === 'submitting'

  const error = result && 'exception' in result ? result.exception as string : undefined

  useEffect(() => {
    const itemIdFromUrl = searchParams.get('itemId')
    const maxPurchasePriceFromUrl = searchParams.get('maxPurchasePrice') || '10000000'
    const desiredMinIlvlFromUrl = searchParams.get('desiredMinIlvl') || '610'
    const desiredStatsFromUrl = searchParams.getAll('desiredStats') as ItemStat[]

    if (itemIdFromUrl) {
      const itemNameFromId = getItemNameById(itemIdFromUrl, wowItems)
      if (itemNameFromId) {
        setItemName(itemNameFromId)
        setItemID(itemIdFromUrl)
      }
    } else {
      setItemName('')
      setItemID('')
    }
    setMaxPurchasePrice(maxPurchasePriceFromUrl)
    setDesiredMinIlvl(desiredMinIlvlFromUrl)
    setSelectedStats(desiredStatsFromUrl)
  }, [searchParams])

  const handleSelect = (value: string) => {
    setItemName(value)
    const itemId = getItemIDByName(value.trim(), wowItems)
    if (itemId) {
      setItemID(itemId.toString())
    } else {
      setItemID('')
    }
  }

  const handleStatToggle = (stat: ItemStat) => {
    setSelectedStats(prev => 
      prev.includes(stat) 
        ? prev.filter(s => s !== stat)
        : [...prev, stat]
    )
  }

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isSubmitting) {
      event.preventDefault()
    }
  }

  const renderForm = () => (
    <SmallFormContainer
      title="Item Level Shopping List"
      description={`
        Search for raid BOE items with specific item levels and stats across all realms, with additional realm data.
        Supports the following items:
        - Undermine Merc's Dog Tags
        - Psychopath's Ravemantle 
        - Vatwork Janitor's Wasteband
        - Mechgineer's Blowtorch Cover
        - Firebug's Anklegear
        - Loyalist's Holdout Hood
        - Midnight Lounge Cummerbund
        - Bootleg Wrynn Shoulderplates
        - Globlin-Fused Greatbelt
      `}
      onClick={handleSubmit}
      error={error}
      loading={isSubmitting}
      hideSubmitButton={!itemID}
      action={getActionUrl(PAGE_URL, {
        itemId: itemID,
        maxPurchasePrice,
        desiredMinIlvl,
        desiredStats: selectedStats
      })}>
      <div className="pt-3 flex flex-col gap-4">
        <DebouncedSelectInput
          title={'Item to search for'}
          label="Item"
          id="export-item-select"
          selectOptions={wowItemsList}
          onSelect={handleSelect}
          displayValue={itemName}
        />
        <input hidden name="itemID" value={itemID} />
        <InputWithLabel
          labelTitle="Maximum Purchase Price"
          name="maxPurchasePrice"
          type="number"
          value={maxPurchasePrice}
          min={0}
          onChange={(e) => setMaxPurchasePrice(e.currentTarget.value)}
        />
        <InputWithLabel
          labelTitle="Minimum Item Level"
          name="desiredMinIlvl"
          type="number"
          value={desiredMinIlvl}
          min={0}
          onChange={(e) => setDesiredMinIlvl(e.currentTarget.value)}
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium dark:text-gray-200">Desired Stats</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_STATS.map(stat => (
              <label key={stat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="desiredStats"
                  value={stat}
                  checked={selectedStats.includes(stat)}
                  onChange={() => handleStatToggle(stat)}
                  className="form-checkbox h-4 w-4"
                />
                <span className="text-sm dark:text-gray-200">{stat}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </SmallFormContainer>
  )

  const hasSearched = actionData !== undefined || (loaderData && 'data' in loaderData)

  if (hasSearched) {
    if (error) {
      return (
        <PageWrapper>
          {renderForm()}
        </PageWrapper>
      )
    } else if (result && 'data' in result && Array.isArray(result.data)) {
      if (result.data.length > 0) {
        return <Results {...(result as IlvlWoWListResponse & { sortby: string })} />
      } else {
        return <NoResults href={PAGE_URL} />
      }
    } else {
      return <NoResults href={PAGE_URL} />
    }
  }

  return (
    <PageWrapper>
      {renderForm()}
    </PageWrapper>
  )
}

export default IlvlShoppingListComponent

const Results = ({
  data,
  sortby,
  name
}: IlvlWoWListResponse & { sortby: string }) => {
  useEffect(() => {
    if (window && document) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <PageWrapper>
      <SmallTable
        title={'Best Deals for ' + name}
        sortingOrder={[{ desc: true, id: sortby }]}
        columnList={columnList}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={['price', 'quantity', 'realmNames', 'ilvl', 'stats', 'link']}
        data={data as any}
      />
    </PageWrapper>
  )
}

const columnList: Array<ColumnList<ListItem>> = [
  { columnId: 'price', header: 'Price' },
  { columnId: 'quantity', header: 'Quantity' },
  { columnId: 'ilvl', header: 'Item Level' },
  {
    columnId: 'stats',
    header: 'Stats',
    accessor: ({ getValue }) => (
      <p className="py-2 px-3">{(getValue() as string[]).join(', ')}</p>
    )
  },
  {
    columnId: 'realmNames',
    header: 'Realm Names',
    accessor: ({ getValue }) => (
      <p className="py-2 px-3 max-w-[200px] mx-auto overflow-x-scroll">
        {getValue() as string}
      </p>
    )
  },
  {
    columnId: 'link',
    header: 'Item Link',
    accessor: ({ getValue }) => (
      <ExternalLink link={getValue() as string} text="" />
    )
  }
]

const mobileColumnList: Array<ColumnList<ListItem>> = [
  { columnId: 'price', header: 'Price' },
  { columnId: 'ilvl', header: 'Item Level' },
  {
    columnId: 'realmNames',
    header: 'Realm Names',
    accessor: ({ getValue }) => (
      <p className="py-2 px-3 w-[200px] overflow-x-scroll">
        {getValue() as string}
      </p>
    )
  }
] 