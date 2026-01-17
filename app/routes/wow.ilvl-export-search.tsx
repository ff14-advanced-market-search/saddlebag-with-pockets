import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect, useState } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type {
  ExportItem,
  IlvlExportResponse
} from '~/requests/WoW/IlvlExportSearch'
import IlvlExportSearch from '~/requests/WoW/IlvlExportSearch'
import { getUserSessionData } from '~/sessions'
import z from 'zod'
import {
  useActionData,
  useNavigation,
  useSearchParams,
  useLoaderData,
  useNavigate
} from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import { wowItems, wowItemsList } from '~/utils/items/id_to_item'
import { getItemIDByName, getItemNameById } from '~/utils/items'
import Select from '~/components/form/select'
import type { ItemStat } from '~/requests/WoW/IlvlShoppingList'
import { ToolTip } from '~/components/Common/InfoToolTip'
import {
  parseStringToNumber,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'
import { getActionUrl, handleCopyButton } from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { combineWithDiscordSession } from '~/components/Common/DiscordSessionLoader'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: WoW BOE Item Level Export Search' },
    {
      name: 'description',
      content:
        'Search for raid BOE items with specific item levels and stats across all realms, with detailed realm data and export capabilities!'
    },
    {
      name: 'canonical',
      content: 'https://saddlebagexchange.com/wow/ilvl-export-search'
    }
  ]
}

const PAGE_URL = '/wow/ilvl-export-search'

const AVAILABLE_STATS: ItemStat[] = ['Socket', 'Leech', 'Speed', 'Avoidance']

type SortByValue =
  | 'minPrice'
  | 'itemQuantity'
  | 'realmPopulationReal'
  | 'realmRanking'

const defaultFormValues = {
  itemId: '',
  ilvl: 670,
  populationWP: 3000,
  populationBlizz: 1,
  rankingWP: 90,
  sortBy: 'minPrice' as SortByValue,
  desiredStats: [] as ItemStat[]
}

const inputMap: Record<string, string> = {
  itemId: 'Item ID',
  ilvl: 'Minimum Item Level',
  populationWP: 'Population',
  populationBlizz: 'Population Blizzard',
  rankingWP: 'Ranking',
  sortBy: 'Sort Results By'
}

const validateInput = z.object({
  itemId: parseStringToNumber,
  ilvl: parseStringToNumber,
  populationWP: parseStringToNumber,
  populationBlizz: parseStringToNumber,
  rankingWP: parseStringToNumber,
  sortBy: z.string()
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

  const result = await IlvlExportSearch({
    region,
    itemID: validatedFormData.data.itemId,
    ilvl: validatedFormData.data.ilvl,
    desiredStats,
    populationWP: validatedFormData.data.populationWP,
    populationBlizz: validatedFormData.data.populationBlizz,
    rankingWP: validatedFormData.data.rankingWP,
    sortBy: validatedFormData.data.sortBy
  })

  return json({
    ...(await result.json()),
    sortby: validatedFormData.data.sortBy
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const params = url.searchParams

  const itemID = params.get('itemId')
  const ilvl = params.get('ilvl') || '662'
  const populationWP = params.get('populationWP') || '3000'
  const populationBlizz = params.get('populationBlizz') || '1'
  const rankingWP = params.get('rankingWP') || '90'
  const sortBy = params.get('sortBy') || 'minPrice'
  const desiredStats = params.getAll('desiredStats') as ItemStat[]

  if (itemID) {
    const formData = {
      itemId: itemID,
      ilvl,
      populationWP,
      populationBlizz,
      rankingWP,
      sortBy
    }
    const validatedFormData = validateInput.safeParse(formData)
    if (!validatedFormData.success) {
      return combineWithDiscordSession(request, {
        exception: parseZodErrorsToDisplayString(
          validatedFormData.error,
          inputMap
        )
      })
    }

    const session = await getUserSessionData(request)
    const region = session.getWoWSessionData().region

    const result = await IlvlExportSearch({
      region,
      itemID: validatedFormData.data.itemId,
      ilvl: validatedFormData.data.ilvl,
      desiredStats,
      populationWP: validatedFormData.data.populationWP,
      populationBlizz: validatedFormData.data.populationBlizz,
      rankingWP: validatedFormData.data.rankingWP,
      sortBy: validatedFormData.data.sortBy
    })

    return combineWithDiscordSession(request, {
      ...(await result.json()),
      sortby: validatedFormData.data.sortBy,
      formValues: { ...validatedFormData.data, desiredStats }
    })
  }

  return combineWithDiscordSession(request, {})
}

type LoaderResponseType =
  | {}
  | { exception: string }
  | (IlvlExportResponse & {
      sortby: string
      formValues: typeof defaultFormValues
    })

type ActionResponseType =
  | {}
  | { exception: string }
  | (IlvlExportResponse & { sortby: string })

const IlvlExportSearchComponent = () => {
  const actionData = useActionData<ActionResponseType>()
  const loaderData = useLoaderData<
    LoaderResponseType & {
      isLoggedIn: boolean
      hasPremium: boolean
      needsRefresh: boolean
    }
  >()
  const [searchParams, setSearchParams] = useSearchParams()
  const result = actionData ?? loaderData
  const transition = useNavigation()
  const [itemName, setItemName] = useState<string>('')
  const [itemID, setItemID] = useState<string>('')
  const [formValues, setFormValues] = useState(defaultFormValues)

  const isSubmitting = transition.state === 'submitting'
  const error =
    result && 'exception' in result ? String(result.exception) : undefined

  useEffect(() => {
    // If there's an error, reset form values but keep the error message
    if (error) {
      setItemName('')
      setItemID('')
      setFormValues(defaultFormValues)
      // Clear URL params but preserve the error state
      const currentParams = new URLSearchParams(searchParams)
      const hasException = currentParams.has('exception')
      setSearchParams(
        hasException ? { exception: currentParams.get('exception')! } : {}
      )
      return
    }

    const itemIdFromUrl = searchParams.get('itemId')
    const ilvlFromUrl = searchParams.get('ilvl') || '642'
    const populationWPFromUrl = searchParams.get('populationWP') || '3000'
    const populationBlizzFromUrl = searchParams.get('populationBlizz') || '1'
    const rankingWPFromUrl = searchParams.get('rankingWP') || '90'
    const sortByFromUrl = searchParams.get('sortBy') || 'minPrice'
    const desiredStatsFromUrl = [
      ...new Set(searchParams.getAll('desiredStats'))
    ] as ItemStat[]

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

    setFormValues({
      itemId: itemIdFromUrl || '',
      ilvl: parseInt(ilvlFromUrl),
      populationWP: parseInt(populationWPFromUrl),
      populationBlizz: parseInt(populationBlizzFromUrl),
      rankingWP: parseInt(rankingWPFromUrl),
      sortBy: (sortByFromUrl as SortByValue) || 'minPrice',
      desiredStats: desiredStatsFromUrl
    })
  }, [searchParams, error])

  const handleSelect = (value: string) => {
    setItemName(value)
    const itemId = getItemIDByName(value.trim(), wowItems)
    if (itemId) {
      setItemID(itemId.toString())
      setFormValues((prev) => ({ ...prev, itemId: itemId.toString() }))
    } else {
      setItemID('')
      setFormValues((prev) => ({ ...prev, itemId: '' }))
    }
  }

  const handleStatToggle = (stat: ItemStat) => {
    setFormValues((prev) => ({
      ...prev,
      desiredStats: prev.desiredStats.includes(stat)
        ? prev.desiredStats.filter((s) => s !== stat)
        : [...prev.desiredStats, stat]
    }))
  }

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isSubmitting) {
      event.preventDefault()
    }
  }

  const renderForm = () => (
    <PremiumPaywall loaderData={loaderData}>
      <SmallFormContainer
        title="Item Level Export Search"
        description={`
          Search for raid BOE items with specific item levels and stats across all realms, with additional realm data.
          Supports the following items:
          - Harvested Creephide Cord
          - Bone-Melted Faceplate
          - Voidhound Trainer's Boots
          - Veiled Manta Vest
          - Acolyte's Infused Leggings
          - Zadus's Liturgical Hat
          - Jak'tull's Intruder Stompers
          - Entropy
          - Technomancer's Service Sandals
        `}
        onClick={handleSubmit}
        error={error}
        loading={isSubmitting}
        disabled={!itemID}
        action={getActionUrl(PAGE_URL, {
          itemId: itemID,
          ilvl: formValues.ilvl.toString(),
          populationWP: formValues.populationWP.toString(),
          populationBlizz: formValues.populationBlizz.toString(),
          rankingWP: formValues.rankingWP.toString(),
          sortBy: formValues.sortBy,
          desiredStats: formValues.desiredStats
        })}>
        <div className="pt-3 flex flex-col gap-4">
          <DebouncedSelectInput
            title={'Item to search for'}
            tooltip="Search for a specific raid BOE item by name. Type to search and select from the dropdown."
            label="Item"
            id="export-item-select"
            selectOptions={wowItemsList}
            onSelect={handleSelect}
            displayValue={itemName}
          />
          <input hidden name="itemId" value={itemID} />
          <InputWithLabel
            labelTitle="Minimum Item Level"
            name="ilvl"
            type="number"
            value={formValues.ilvl.toString()}
            min={0}
            toolTip="Minimum item level to filter search results. Current 11.1 BOE levels are 675, 688, or 701."
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                ilvl: parseInt(e.target.value)
              }))
            }
          />
          <InputWithLabel
            labelTitle="Population"
            name="populationWP"
            type="number"
            value={formValues.populationWP.toString()}
            min={1}
            toolTip="Minimum WoWProgress server population to include in search"
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                populationWP: parseInt(e.target.value)
              }))
            }
          />
          <div className="w-full mt-2">
            <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
              <label
                htmlFor="populationBlizz"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                Population Blizzard
              </label>
              <ToolTip data="Filter servers by Blizzard's population rating (LOW = 0, MEDIUM = 1, HIGH = 2, FULL = 3)" />
            </div>
            <Select
              id="populationBlizz"
              title=""
              name="populationBlizz"
              value={formValues.populationBlizz.toString()}
              options={[
                { label: 'FULL', value: '3' },
                { label: 'HIGH', value: '2' },
                { label: 'MEDIUM', value: '1' },
                { label: 'LOW', value: '0' }
              ]}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  populationBlizz: parseInt(e.target.value)
                }))
              }
            />
          </div>
          <InputWithLabel
            labelTitle="Ranking"
            name="rankingWP"
            type="number"
            value={formValues.rankingWP.toString()}
            min={1}
            toolTip="Filter by raid clearance (1-100, based on how many guilds cleared the raid and how soon. 1 is the best raiders, 100 is the worst raiders.)"
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                rankingWP: parseInt(e.target.value)
              }))
            }
          />
          <div className="w-full mt-2">
            <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
              <label
                htmlFor="sortBy"
                className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                Sort Results By
              </label>
              <ToolTip data="Choose how to sort the search results. Results will be sorted in descending order by the selected field" />
            </div>
            <Select
              id="sortBy"
              title=""
              name="sortBy"
              value={formValues.sortBy}
              options={[
                { label: 'Minimum Price', value: 'minPrice' },
                { label: 'Item Quantity', value: 'itemQuantity' },
                { label: 'Realm Population', value: 'realmPopulationReal' },
                { label: 'Realm Ranking', value: 'realmRanking' }
              ]}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  sortBy: e.target.value as SortByValue
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-1 items-center gap-1 relative">
              <label className="text-sm font-medium dark:text-gray-200">
                Desired Stats
              </label>
              <ToolTip data="Select additional stats you want on the item (Socket, Leech, Speed, Avoidance). Leave unchecked to search for any stats." />
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_STATS.map((stat) => (
                <label key={stat} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="desiredStats"
                    value={stat}
                    checked={formValues.desiredStats.includes(stat)}
                    onChange={() => handleStatToggle(stat)}
                    className="form-checkbox h-4 w-4"
                  />
                  <span className="text-sm dark:text-gray-200">{stat}</span>
                </label>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-2">
            Note: If the search button does not appear after you select your
            item, try refreshing the page.
            <br />
            <br />
            Note: If this page reset, then no items were found. Make sure you
            search for the exact ilvls you want and current 11.1 BOE levels 675,
            688 or 701. Check the{' '}
            <a
              href="/wow/ilvl-shopping-list"
              className="underline text-blue-600 dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer">
              ilvl shopping list
            </a>{' '}
            to see what ilvls are available.
          </p>
        </div>
      </SmallFormContainer>
    </PremiumPaywall>
  )

  const hasSearched =
    actionData !== undefined || (loaderData && 'data' in loaderData)

  if (hasSearched) {
    if (error) {
      return <PageWrapper>{renderForm()}</PageWrapper>
    } else if (result && 'data' in result && Array.isArray(result.data)) {
      if (result.data.length > 0) {
        return (
          <Results
            {...(result as IlvlExportResponse & { sortby: string })}
            ilvl={formValues.ilvl}
            desiredStats={formValues.desiredStats}
            isLoggedIn={loaderData.isLoggedIn}
            hasPremium={loaderData.hasPremium}
          />
        )
      } else {
        return <NoResults href={PAGE_URL} />
      }
    } else {
      return <NoResults href={PAGE_URL} />
    }
  }

  return <PageWrapper>{renderForm()}</PageWrapper>
}

export default IlvlExportSearchComponent

const Results = ({
  data,
  sortby,
  itemInfo,
  ilvl,
  desiredStats,
  isLoggedIn,
  hasPremium
}: IlvlExportResponse & {
  sortby: string
  ilvl: number
  desiredStats: ItemStat[]
  isLoggedIn: boolean
  hasPremium: boolean
}) => {
  useEffect(() => {
    if (window && document) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <PageWrapper>
      <PremiumPaywall
        loaderData={{ isLoggedIn, hasPremium, needsRefresh: false }}>
        <ContentContainer>
          <div className="flex flex-col min-w-full">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <Title title={itemInfo.itemName} />
              <ExternalLink link={itemInfo.link} text="Item Data" />
              <ExternalLink
                link={`/wow/ilvl-shopping-list?itemId=${
                  itemInfo.itemID
                }&maxPurchasePrice=10000000&desiredMinIlvl=${ilvl}&desiredStats=${[
                  ...new Set(desiredStats)
                ]
                  .map((stat) => encodeURIComponent(stat))
                  .join('&desiredStats=')}`}
                text="Shopping List"
              />
              <ExternalLink
                link={`/wow/ilvl-export-search`}
                text="Search again"
              />
              <SubmitButton
                title="Share this search!"
                onClick={handleCopyButton}
                type="button"
              />
            </div>
            <div className="flex flex-col md:flex-row w-full">
              <div className="flex flex-col md:min-w-[50%] justify-center">
                <div className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100 p-2 m-1 rounded">
                  <span>
                    Average Min Price: {itemInfo.avgMinPrice.toLocaleString()}
                  </span>
                </div>
                <div className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100 p-2 m-1 rounded">
                  <span>
                    Median Min Price: {itemInfo.medianMinPrice.toLocaleString()}
                  </span>
                </div>
                <div className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100 p-2 m-1 rounded">
                  <span>Ilvl: {itemInfo.ilvl.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col md:min-w-[50%] justify-center">
                <div className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100 p-2 m-1 rounded">
                  <span>
                    Average Server Quantity:{' '}
                    {itemInfo.avgServerQuantity.toLocaleString()}
                  </span>
                </div>
                <div className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100 p-2 m-1 rounded">
                  <span>
                    Total Selected Server Quantity:{' '}
                    {itemInfo.totalSelectedServerQuantity.toLocaleString()}
                  </span>
                </div>
                <div className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100 p-2 m-1 rounded">
                  <span>
                    Stats:{' '}
                    {itemInfo.stats.length === 0
                      ? 'Any'
                      : itemInfo.stats.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ContentContainer>
        <SmallTable
          title="Export Results"
          description="Results for your item in different realms"
          sortingOrder={[{ desc: true, id: sortby }]}
          columnList={columnList}
          mobileColumnList={mobileColumnList}
          columnSelectOptions={[
            'minPrice',
            'itemQuantity',
            'stats',
            'realmPopulationReal',
            'realmPopulationType',
            'realmRanking'
          ]}
          data={data as any}
          csvOptions={{
            filename: 'saddlebag-wow-ilvl-export.csv',
            columns: [
              { title: 'Realm ID', value: 'connectedRealmID' },
              { title: 'Realm Names', value: 'connectedRealmNames' },
              { title: 'Minimum Price', value: 'minPrice' },
              { title: 'Item Quantity', value: 'itemQuantity' },
              { title: 'Stats', value: 'stats' },
              { title: 'Realm Population', value: 'realmPopulationReal' },
              { title: 'Population Type', value: 'realmPopulationType' },
              { title: 'Realm Ranking', value: 'realmRanking' }
            ]
          }}
        />
      </PremiumPaywall>
    </PageWrapper>
  )
}

const columnList: Array<ColumnList<ExportItem>> = [
  {
    columnId: 'connectedRealmNames',
    header: 'Realm Names',
    accessor: ({ row }) => (
      <p className="px-3 py-2 max-w-[200px] overflow-x-scroll">
        {row.connectedRealmNames.join(', ')}
      </p>
    )
  },
  { columnId: 'minPrice', header: 'Minimum Price' },
  { columnId: 'itemQuantity', header: 'Item Quantity' },
  {
    columnId: 'stats',
    header: 'Stats',
    accessor: ({ row }) => <p className="px-3 py-2">{row.stats.join(', ')}</p>
  },
  { columnId: 'realmPopulationReal', header: 'Realm Population' },
  { columnId: 'realmPopulationType', header: 'Population Type' },
  { columnId: 'realmRanking', header: 'Realm Ranking' },
  {
    columnId: 'undermineLink',
    header: 'Undermine Link',
    accessor: ({ getValue }) => (
      <ExternalLink text="Undermine" link={getValue() as string} />
    )
  }
]

const mobileColumnList: Array<ColumnList<ExportItem>> = [
  { columnId: 'minPrice', header: 'Minimum Price' },
  {
    columnId: 'connectedRealmNames',
    header: 'Realm Names',
    accessor: ({ row }) => (
      <p className="px-3 py-2 w-[200px] overflow-x-scroll">
        {row.connectedRealmNames.join(', ')}
      </p>
    )
  },
  { columnId: 'realmPopulationType', header: 'Population Type' }
]
