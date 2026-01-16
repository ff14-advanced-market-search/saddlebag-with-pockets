import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect, useState, useMemo } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { UltrarareItem, UltrarareResponse } from '~/requests/WoW/Ultrarare'
import UltrarareSearch from '~/requests/WoW/Ultrarare'
import { getUserSessionData, getSession, EARLY_ACCESS_TOKEN } from '~/sessions'
import { combineWithDiscordSession } from '~/components/Common/DiscordSessionLoader'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { getHasElite } from '~/utils/premium'
import z from 'zod'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import Select from '~/components/form/select'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import {
  parseStringToNumber,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'
import Banner from '~/components/Common/Banner'
import {
  ExpansionSelect,
  ItemClassSelect
} from '~/components/form/WoW/WoWScanForm'
import { itemQuality } from '~/utils/WoWFilters/itemQuality'
import { itemClasses } from '~/utils/WoWFilters/itemClasses'
import { ToolTip } from '~/components/Common/InfoToolTip'

const PAGE_URL = '/wow/ultrarare'

const defaultFormValues = {
  populationBlizz: 0,
  rankingWP: 99,
  populationWP: 5000,
  min_quantity: 0,
  max_quantity: 30,
  item_class: -1,
  item_subclass: -1,
  min_quality: -1,
  expansion_number: -1,
  sortBy: 'tsmAvgSaleVSCurrentMin',
  min_buyoutPrice: 0,
  max_buyoutPrice: 9999999.99,
  min_tsmAvgSalePrice: 0,
  max_tsmAvgSalePrice: 9999999.99
}

const inputMap: Record<string, string> = {
  populationBlizz: 'Population Blizzard',
  rankingWP: 'Ranking',
  populationWP: 'Population',
  min_quantity: 'Minimum Quantity',
  max_quantity: 'Maximum Quantity',
  item_class: 'Item Class',
  item_subclass: 'Item Subclass',
  min_quality: 'Minimum Quality',
  expansion_number: 'Expansion',
  sortBy: 'Sort Results By',
  min_buyoutPrice: 'Minimum Buyout Price (Gold)',
  max_buyoutPrice: 'Maximum Buyout Price (Gold)',
  min_tsmAvgSalePrice: 'Minimum TSM Avg Sale Price (Gold)',
  max_tsmAvgSalePrice: 'Maximum TSM Avg Sale Price (Gold)'
}

// Helper to parse gold values (converts to number, defaults to 0 if invalid)
const parseGoldValue = z
  .string()
  .default('0')
  .transform((val) => {
    if (!val || val === '') return 0
    const num = parseFloat(val)
    return isNaN(num) ? 0 : num
  })

const validateInput = z.object({
  populationBlizz: parseStringToNumber,
  rankingWP: parseStringToNumber,
  populationWP: parseStringToNumber,
  min_quantity: parseStringToNumber,
  max_quantity: parseStringToNumber,
  item_class: parseStringToNumber,
  item_subclass: parseStringToNumber,
  min_quality: parseStringToNumber,
  expansion_number: parseStringToNumber,
  sortBy: z.string(),
  min_buyoutPrice: parseGoldValue,
  max_buyoutPrice: parseGoldValue,
  min_tsmAvgSalePrice: parseGoldValue,
  max_tsmAvgSalePrice: parseGoldValue
})

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: WoW Ultra Rare Item Search' },
    { name: 'description', content: 'Search for ultra rare items across World of Warcraft servers' },
    { tagName: 'link', rel: 'canonical', href: 'https://saddlebagexchange.com/wow/ultrarare' }
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const earlyAccessToken = session.get(EARLY_ACCESS_TOKEN) || ''

  const params = new URL(request.url).searchParams

  const values = {
    populationBlizz:
      params.get('populationBlizz') ||
      defaultFormValues.populationBlizz.toString(),
    rankingWP:
      params.get('rankingWP') || defaultFormValues.rankingWP.toString(),
    populationWP:
      params.get('populationWP') || defaultFormValues.populationWP.toString(),
    min_quantity:
      params.get('min_quantity') || defaultFormValues.min_quantity.toString(),
    max_quantity:
      params.get('max_quantity') || defaultFormValues.max_quantity.toString(),
    item_class:
      params.get('item_class') || defaultFormValues.item_class.toString(),
    item_subclass:
      params.get('item_subclass') || defaultFormValues.item_subclass.toString(),
    min_quality:
      params.get('min_quality') || defaultFormValues.min_quality.toString(),
    expansion_number:
      params.get('expansion_number') ||
      defaultFormValues.expansion_number.toString(),
    sortBy: params.get('sortBy') || defaultFormValues.sortBy.toString(),
    min_buyoutPrice:
      params.get('min_buyoutPrice') ||
      defaultFormValues.min_buyoutPrice.toString(),
    max_buyoutPrice:
      params.get('max_buyoutPrice') ||
      defaultFormValues.max_buyoutPrice.toString(),
    min_tsmAvgSalePrice:
      params.get('min_tsmAvgSalePrice') ||
      defaultFormValues.min_tsmAvgSalePrice.toString(),
    max_tsmAvgSalePrice:
      params.get('max_tsmAvgSalePrice') ||
      defaultFormValues.max_tsmAvgSalePrice.toString()
  }
  const validParams = validateInput.safeParse(values)

  const formData = validParams.success
    ? { ...validParams.data, earlyAccessToken }
    : { ...defaultFormValues, earlyAccessToken }

  return combineWithDiscordSession(request, formData)
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const earlyAccessToken = session.get(EARLY_ACCESS_TOKEN) || ''
  const discordRoles = session.get('discord_roles') || []
  const hasElite = getHasElite(discordRoles)

  // Return error if no elite role
  if (!hasElite) {
    return json({
      exception: 'Elite Discord role is required to access this feature'
    })
  }

  // Return error if no token
  if (!earlyAccessToken) {
    return json({ exception: 'Early access token is required' })
  }

  const { getWoWSessionData } = await getUserSessionData(request)
  const region = getWoWSessionData().region

  const formData = Object.fromEntries(await request.formData())

  // Map itemClass/itemSubClass from ItemClassSelect to item_class/item_subclass
  // ItemClassSelect uses camelCase internally (itemClass/itemSubClass), but API expects snake_case
  // Also map expansionNumber to expansion_number
  // Use component values (itemClass/itemSubClass/expansionNumber) as primary source since those are what user selects
  const mappedFormData = {
    ...formData,
    item_class: formData.itemClass || formData.item_class || '-1',
    item_subclass: formData.itemSubClass || formData.item_subclass || '-1',
    expansion_number:
      formData.expansionNumber || formData.expansion_number || '-1'
  }

  const validatedFormData = validateInput.safeParse(mappedFormData)
  if (!validatedFormData.success) {
    return json({
      exception: parseZodErrorsToDisplayString(
        validatedFormData.error,
        inputMap
      )
    })
  }

  // Ensure that if item_class is -1, item_subclass is also -1
  const finalItemClass = validatedFormData.data.item_class
  const finalItemSubclass =
    finalItemClass === -1 ? -1 : validatedFormData.data.item_subclass

  const result = await UltrarareSearch({
    region,
    ...validatedFormData.data,
    item_class: finalItemClass,
    item_subclass: finalItemSubclass,
    earlyAccessToken
  })

  const responseData = await result.json()

  if (!result.ok || 'exception' in responseData) {
    return json({
      exception: responseData.exception || 'Failed to fetch ultrarare data'
    })
  }

  return json({
    ...responseData,
    sortby: validatedFormData.data.sortBy
  })
}

type ActionResponseType =
  | {}
  | { exception: string }
  | (UltrarareResponse & { sortby: string })

const UltrararePage = () => {
  const loaderData = useLoaderData<
    typeof defaultFormValues & {
      earlyAccessToken: string
      isLoggedIn: boolean
      hasPremium: boolean
      hasElite: boolean
      needsRefresh: boolean
    }
  >()
  const result = useActionData<ActionResponseType>()
  const transition = useNavigation()
  const isSubmitting = transition.state === 'submitting'

  const [searchParams, setSearchParams] = useState<typeof defaultFormValues>({
    populationBlizz: loaderData.populationBlizz,
    rankingWP: loaderData.rankingWP,
    populationWP: loaderData.populationWP,
    min_quantity: loaderData.min_quantity,
    max_quantity: loaderData.max_quantity,
    item_class: loaderData.item_class,
    item_subclass: loaderData.item_subclass,
    min_quality: loaderData.min_quality,
    expansion_number: loaderData.expansion_number,
    sortBy: loaderData.sortBy,
    min_buyoutPrice:
      loaderData.min_buyoutPrice ?? defaultFormValues.min_buyoutPrice,
    max_buyoutPrice:
      loaderData.max_buyoutPrice ?? defaultFormValues.max_buyoutPrice,
    min_tsmAvgSalePrice:
      loaderData.min_tsmAvgSalePrice ?? defaultFormValues.min_tsmAvgSalePrice,
    max_tsmAvgSalePrice:
      loaderData.max_tsmAvgSalePrice ?? defaultFormValues.max_tsmAvgSalePrice
  })

  const error = result && 'exception' in result ? result.exception : undefined

  if (result && !Object.keys(result).length) {
    return <NoResults href={PAGE_URL} />
  }

  if (result && 'data' in result && !error) {
    return (
      <PremiumPaywall
        loaderData={{
          isLoggedIn: loaderData.isLoggedIn,
          hasPremium: loaderData.hasElite,
          needsRefresh: loaderData.needsRefresh
        }}
        tier="elite">
        <Results {...result} />
      </PremiumPaywall>
    )
  }

  const handleFormChange = (
    name: keyof typeof defaultFormValues,
    value: string | number
  ) => {
    const stringValue = typeof value === 'number' ? value.toString() : value
    handleSearchParamChange(name, stringValue)
    setSearchParams({ ...searchParams, [name]: value })
  }

  return (
    <PageWrapper>
      <Banner />
      <PremiumPaywall
        loaderData={{
          isLoggedIn: loaderData.isLoggedIn,
          hasPremium: loaderData.hasElite,
          needsRefresh: loaderData.needsRefresh
        }}
        tier="elite">
        <SmallFormContainer
          title="Ultra Rare Item Search"
          onClick={() => {}}
          error={error}
          loading={isSubmitting}
          disabled={false}
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
          <div className="pt-3 flex flex-col">
            {/* Sort By - at the top */}
            <div className="w-full mt-2">
              <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                  {inputMap.sortBy}
                </label>
                <ToolTip data="Choose how to sort the search results. Results will be sorted in descending order by the selected field" />
              </div>
              <Select
                id="sortBy"
                title=""
                defaultValue={loaderData.sortBy}
                name="sortBy"
                options={[
                  { label: 'Shortage', value: 'shortage' },
                  { label: 'Min Price', value: 'minPrice' },
                  { label: 'Total Quantity', value: 'total_quantity' },
                  {
                    label: 'Eligible Realm Count',
                    value: 'eligible_realm_count'
                  },
                  {
                    label: 'Realm Count With Item',
                    value: 'realm_count_with_item'
                  },
                  { label: 'Median Min Price', value: 'medianMinPrice' },
                  { label: 'Average Min Price', value: 'averageMinPrice' },
                  { label: 'TSM Market Value', value: 'tsmMarketValue' },
                  { label: 'TSM Avg Sale Price', value: 'tsmAvgSalePrice' },
                  { label: 'TSM Sale Rate', value: 'tsmSaleRate' },
                  { label: 'TSM Sold Per Day', value: 'tsmSoldPerDay' },
                  { label: 'TSM Historical', value: 'tsmHistorical' },
                  {
                    label: 'TSM Avg Sale VS Current Min',
                    value: 'tsmAvgSaleVSCurrentMin'
                  },
                  {
                    label: 'TSM Avg Sale VS Current Average',
                    value: 'tsmAvgSaleVSCurrentAverage'
                  },
                  {
                    label: 'TSM Avg Sale VS Current Median',
                    value: 'tsmAvgSaleVSCurrentMedian'
                  },
                  {
                    label: 'TSM Historic VS Current Min',
                    value: 'tsmHistoricVSCurrentMin'
                  },
                  {
                    label: 'TSM Historic VS Current Average',
                    value: 'tsmHistoricVSCurrentAverage'
                  },
                  {
                    label: 'TSM Historic VS Current Median',
                    value: 'tsmHistoricVSCurrentMedian'
                  }
                ]}
                onChange={(e) => {
                  handleFormChange('sortBy', e.currentTarget.value)
                }}
              />
            </div>
            {/* Population Blizzard, Ranking, Population WP - side by side */}
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="w-full">
                <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
                  <label
                    htmlFor="populationBlizz"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                    {inputMap.populationBlizz}
                  </label>
                  <ToolTip data="Filter servers by Blizzard's population rating (LOW = 0, MEDIUM = 1, HIGH = 2, FULL = 3)" />
                </div>
                <Select
                  id="populationBlizz"
                  title=""
                  defaultValue={loaderData.populationBlizz.toString()}
                  name="populationBlizz"
                  options={[
                    { label: 'FULL', value: '3' },
                    { label: 'HIGH', value: '2' },
                    { label: 'MEDIUM', value: '1' },
                    { label: 'LOW', value: '0' }
                  ]}
                  onChange={(e) => {
                    handleFormChange(
                      'populationBlizz',
                      parseInt(e.currentTarget.value, 10)
                    )
                  }}
                />
              </div>
              <InputWithLabel
                labelTitle={inputMap.rankingWP}
                defaultValue={loaderData.rankingWP}
                name="rankingWP"
                type="number"
                min={1}
                max={100}
                toolTip="Filter by raid clearance (1-100, based on how many guilds cleared the raid and how soon. 1 is the best raiders, 100 is the worst raiders.)"
                onChange={(e) => {
                  handleFormChange(
                    'rankingWP',
                    parseInt(e.currentTarget.value, 10)
                  )
                }}
              />
              <InputWithLabel
                labelTitle={inputMap.populationWP}
                defaultValue={loaderData.populationWP}
                name="populationWP"
                type="number"
                min={1}
                toolTip="Minimum WoWProgress server population to include in search"
                onChange={(e) => {
                  handleFormChange(
                    'populationWP',
                    parseInt(e.currentTarget.value, 10)
                  )
                }}
              />
            </div>
            {/* Item Category and Item Sub Category - side by side */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="w-full">
                <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
                  <label
                    htmlFor="itemClass"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                    Item Category
                  </label>
                  <ToolTip data="Pick an item category to search for" />
                </div>
                <select
                  id="itemClass"
                  name="itemClass"
                  value={searchParams.item_class}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-400 dark:bg-gray-600 dark:text-gray-100"
                  onChange={(e) => {
                    const itemClassValue = parseInt(e.target.value, 10)
                    const finalSubclass =
                      itemClassValue === -1 ? -1 : searchParams.item_subclass
                    handleFormChange('item_class', itemClassValue)
                    handleFormChange('item_subclass', finalSubclass)
                  }}>
                  <option value={-1}>All</option>
                  {itemClasses.map(({ name, value }) => (
                    <option key={name + value} value={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
                  <label
                    htmlFor="itemSubClass"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                    Item Sub Category
                  </label>
                  <ToolTip data="Pick an item sub category to search for, or select 'Exclude Non-Cosmetic' to filter out items not used for transmogrification." />
                </div>
                <select
                  id="itemSubClass"
                  name="itemSubClass"
                  value={searchParams.item_subclass}
                  disabled={searchParams.item_class === -1}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-400 dark:bg-gray-600 dark:text-gray-100 disabled:bg-gray-200 dark:disabled:bg-gray-700"
                  onChange={(e) => {
                    handleFormChange(
                      'item_subclass',
                      parseInt(e.target.value, 10)
                    )
                  }}>
                  <option value={-1}>All</option>
                  {itemClasses
                    .find((c) => c.value === searchParams.item_class)
                    ?.subClasses?.map(({ name, value }) => (
                      <option key={name + value} value={value}>
                        {name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* Hidden inputs to ensure correct values are submitted */}
            <input
              type="hidden"
              name="item_class"
              value={searchParams.item_class}
            />
            <input
              type="hidden"
              name="item_subclass"
              value={
                searchParams.item_class === -1 ? -1 : searchParams.item_subclass
              }
            />
            {/* Expansion and Min Quality - side by side */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <ExpansionSelect
                defaultValue={loaderData.expansion_number.toString()}
                onChange={(value) =>
                  handleFormChange('expansion_number', parseInt(value, 10))
                }
              />
              <div className="w-full">
                <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
                  <label
                    htmlFor="min_quality"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                    {inputMap.min_quality}
                  </label>
                  <ToolTip data="Filter items by minimum quality level (Poor, Common, Uncommon, Rare, Epic, Legendary, Artifact, Heirloom)" />
                </div>
                <select
                  id="min_quality"
                  name="min_quality"
                  defaultValue={loaderData.min_quality.toString()}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-400 dark:bg-gray-600 dark:text-gray-100"
                  onChange={(e) => {
                    handleFormChange(
                      'min_quality',
                      parseInt(e.currentTarget.value, 10)
                    )
                  }}>
                  <option value={-1}>All</option>
                  {itemQuality.map(({ name, value }) => (
                    <option key={name + value} value={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <input
              type="hidden"
              name="expansion_number"
              value={searchParams.expansion_number}
            />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <InputWithLabel
                labelTitle={inputMap.min_quantity}
                defaultValue={loaderData.min_quantity}
                name="min_quantity"
                type="number"
                min={0}
                toolTip="Minimum total quantity of items available across all eligible realms"
                onChange={(e) => {
                  handleFormChange(
                    'min_quantity',
                    parseInt(e.currentTarget.value, 10)
                  )
                }}
              />
              <InputWithLabel
                labelTitle={inputMap.max_quantity}
                defaultValue={loaderData.max_quantity}
                name="max_quantity"
                type="number"
                min={0}
                toolTip="Maximum total quantity of items available across all eligible realms"
                onChange={(e) => {
                  handleFormChange(
                    'max_quantity',
                    parseInt(e.currentTarget.value, 10)
                  )
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <InputWithLabel
                labelTitle={inputMap.min_buyoutPrice}
                defaultValue={searchParams.min_buyoutPrice}
                name="min_buyoutPrice"
                type="number"
                min={0}
                step="0.01"
                toolTip="Minimum buyout price in gold to filter search results."
                onChange={(e) => {
                  const numValue = parseFloat(e.currentTarget.value)
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleFormChange('min_buyoutPrice', numValue)
                  } else {
                    handleFormChange('min_buyoutPrice', 0)
                  }
                }}
              />
              <InputWithLabel
                labelTitle={inputMap.max_buyoutPrice}
                defaultValue={searchParams.max_buyoutPrice}
                name="max_buyoutPrice"
                type="number"
                min={0}
                step="0.01"
                toolTip="Maximum buyout price in gold to filter search results."
                onChange={(e) => {
                  const numValue = parseFloat(e.currentTarget.value)
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleFormChange('max_buyoutPrice', numValue)
                  } else {
                    handleFormChange('max_buyoutPrice', 0)
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <InputWithLabel
                labelTitle={inputMap.min_tsmAvgSalePrice}
                defaultValue={searchParams.min_tsmAvgSalePrice}
                name="min_tsmAvgSalePrice"
                type="number"
                min={0}
                step="0.01"
                toolTip="Minimum TSM average sale price in gold to filter search results."
                onChange={(e) => {
                  const numValue = parseFloat(e.currentTarget.value)
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleFormChange('min_tsmAvgSalePrice', numValue)
                  } else {
                    handleFormChange('min_tsmAvgSalePrice', 0)
                  }
                }}
              />
              <InputWithLabel
                labelTitle={inputMap.max_tsmAvgSalePrice}
                defaultValue={searchParams.max_tsmAvgSalePrice}
                name="max_tsmAvgSalePrice"
                type="number"
                min={0}
                step="0.01"
                toolTip="Maximum TSM average sale price in gold to filter search results."
                onChange={(e) => {
                  const numValue = parseFloat(e.currentTarget.value)
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleFormChange('max_tsmAvgSalePrice', numValue)
                  } else {
                    handleFormChange('max_tsmAvgSalePrice', 0)
                  }
                }}
              />
            </div>
          </div>
        </SmallFormContainer>
      </PremiumPaywall>
    </PageWrapper>
  )
}

export default UltrararePage

// List of numeric columns that can be filtered
const numericColumns = [
  { id: 'shortage', label: 'Shortage' },
  { id: 'minPrice', label: 'Min Price' },
  { id: 'total_quantity', label: 'Total Quantity' },
  { id: 'eligible_realm_count', label: 'Eligible Realm Count' },
  { id: 'realm_count_with_item', label: 'Realm Count With Item' },
  { id: 'medianMinPrice', label: 'Median Min Price' },
  { id: 'averageMinPrice', label: 'Average Min Price' },
  { id: 'tsmMarketValue', label: 'TSM Market Value' },
  { id: 'tsmAvgSalePrice', label: 'TSM Avg Sale Price' },
  { id: 'tsmSaleRate', label: 'TSM Sale Rate' },
  { id: 'tsmSoldPerDay', label: 'TSM Sold Per Day' },
  { id: 'tsmHistorical', label: 'TSM Historical' },
  { id: 'tsmAvgSaleVSCurrentMin', label: 'TSM Avg Sale VS Current Min' },
  {
    id: 'tsmAvgSaleVSCurrentAverage',
    label: 'TSM Avg Sale VS Current Average'
  },
  { id: 'tsmAvgSaleVSCurrentMedian', label: 'TSM Avg Sale VS Current Median' },
  { id: 'tsmHistoricVSCurrentMin', label: 'TSM Historic VS Current Min' },
  {
    id: 'tsmHistoricVSCurrentAverage',
    label: 'TSM Historic VS Current Average'
  },
  { id: 'tsmHistoricVSCurrentMedian', label: 'TSM Historic VS Current Median' }
]

interface NumericFilter {
  id: string
  column: string
  min: string
  max: string
}

const Results = ({ data, sortby }: UltrarareResponse & { sortby: string }) => {
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    () => new Set(columnList.map((col) => col.columnId))
  )
  const [showColumnControls, setShowColumnControls] = useState(false)
  const [columnPage, setColumnPage] = useState(0)
  const columnsPerPage = 20
  const [showNumericFilter, setShowNumericFilter] = useState(false)
  const [filters, setFilters] = useState<NumericFilter[]>([])

  useEffect(() => {
    if (window && document) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const filteredColumnList = useMemo(
    () => columnList.filter((col) => visibleColumns.has(col.columnId)),
    [visibleColumns]
  )

  // Filter data based on all numeric filters
  const filteredData = useMemo(() => {
    const activeFilters = filters.filter((f) => f.column && (f.min || f.max))
    if (activeFilters.length === 0) {
      return data
    }

    return data.filter((row) => {
      const rowData = row as Record<string, any>

      // All filters must pass (AND logic)
      return activeFilters.every((filter) => {
        const value = rowData[filter.column]
        if (value === null || value === undefined) return false

        // Handle string values that represent numbers (like TSM comparison ratios)
        let numValue: number
        if (typeof value === 'string') {
          const parsed = parseFloat(value)
          if (isNaN(parsed)) return false
          numValue = parsed
        } else if (typeof value === 'number') {
          numValue = value
        } else {
          return false
        }

        const min = filter.min ? parseFloat(filter.min) : -Infinity
        const max = filter.max ? parseFloat(filter.max) : Infinity

        if (isNaN(min) && isNaN(max)) return true
        if (isNaN(min)) return numValue <= max
        if (isNaN(max)) return numValue >= min

        return numValue >= min && numValue <= max
      })
    })
  }, [data, filters])

  const addFilter = () => {
    setFilters([
      ...filters,
      {
        id: Date.now().toString(),
        column: '',
        min: '',
        max: ''
      }
    ])
  }

  const removeFilter = (id: string) => {
    setFilters(filters.filter((f) => f.id !== id))
  }

  const updateFilter = (id: string, updates: Partial<NumericFilter>) => {
    setFilters(filters.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const clearAllFilters = () => {
    setFilters([])
  }

  // The column headers, left to right, from the image:
  // Item Name, Item Data, Shortage, Min Price, Total Quantity,
  // Eligible Realm Count, Realm Count With Item, TSM Avg Sale Price, TSM Sold Per Day

  const essentialColumns = [
    'itemName',
    'itemDataLink',
    'shortage',
    'minPrice',
    'total_quantity',
    'realm_count_with_item',
    'tsmAvgSalePrice',
    'tsmSoldPerDay',
    'tsmAvgSaleVSCurrentMin',
    sortby
  ]

  return (
    <PageWrapper>
      <ContentContainer>
        <div className="flex flex-col min-w-full">
          <Title title="Ultra Rare Item Results" />
        </div>
      </ContentContainer>
      <div className="my-2 flex items-center flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowColumnControls(!showColumnControls)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium text-sm">
          {showColumnControls ? 'Hide' : 'Show'} Column Controls
        </button>
        <button
          type="button"
          onClick={() => setShowNumericFilter(!showNumericFilter)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium text-sm">
          {showNumericFilter ? 'Hide' : 'Show'} Numeric Filter
        </button>
      </div>
      {showNumericFilter && (
        <div className="my-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow max-w-4xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Numeric Filter
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addFilter}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                Add Filter
              </button>
              {filters.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
                  Clear All
                </button>
              )}
            </div>
          </div>
          {filters.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              No filters added. Click "Add Filter" to create one.
            </p>
          ) : (
            <div className="space-y-3">
              {filters.map((filter) => {
                const columnLabel =
                  numericColumns.find((c) => c.id === filter.column)?.label ||
                  'Select a column...'
                const isActive = filter.column && (filter.min || filter.max)
                return (
                  <div
                    key={filter.id}
                    className={`p-3 rounded-lg border-2 ${
                      isActive
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-100 flex-1 min-w-0">
                        {isActive ? (
                          <span className="text-green-700 dark:text-green-400">
                            {columnLabel}
                            {filter.min && ` ≥ ${filter.min}`}
                            {filter.max && ` ≤ ${filter.max}`}
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            Filter {filters.indexOf(filter) + 1} (inactive)
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFilter(filter.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs ml-2 flex-shrink-0">
                        Remove
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="w-64">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                          Column
                        </label>
                        <select
                          value={filter.column}
                          onChange={(e) =>
                            updateFilter(filter.id, { column: e.target.value })
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-400 dark:bg-gray-600 dark:text-gray-100 p-2">
                          <option value="">Select a column...</option>
                          {numericColumns.map((col) => (
                            <option key={col.id} value={col.id}>
                              {col.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-40">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                          Min Value (optional)
                        </label>
                        <input
                          type="number"
                          value={filter.min}
                          onChange={(e) =>
                            updateFilter(filter.id, { min: e.target.value })
                          }
                          placeholder="Min"
                          step="0.01"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-400 dark:bg-gray-600 dark:text-gray-100 p-2"
                        />
                      </div>
                      <div className="w-40">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                          Max Value (optional)
                        </label>
                        <input
                          type="number"
                          value={filter.max}
                          onChange={(e) =>
                            updateFilter(filter.id, { max: e.target.value })
                          }
                          placeholder="Max"
                          step="0.01"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-400 dark:bg-gray-600 dark:text-gray-100 p-2"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {filters.some((f) => f.column && (f.min || f.max)) && (
            <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredData.length} of {data.length} items
              </span>
            </div>
          )}
        </div>
      )}
      {showColumnControls && (
        <div className="my-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Column Visibility
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {columnList
              .slice(
                columnPage * columnsPerPage,
                (columnPage + 1) * columnsPerPage
              )
              .map((col) => (
                <label
                  key={col.columnId}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(col.columnId)}
                    onChange={(e) => {
                      const newVisibleColumns = new Set(visibleColumns)
                      if (e.target.checked) {
                        newVisibleColumns.add(col.columnId)
                      } else {
                        newVisibleColumns.delete(col.columnId)
                      }
                      setVisibleColumns(newVisibleColumns)
                    }}
                    className="form-checkbox h-4 w-4 text-blue-500"
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {col.header}
                  </span>
                </label>
              ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setVisibleColumns(
                    new Set(columnList.map((col) => col.columnId))
                  )
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm">
                Show All
              </button>
              <button
                type="button"
                onClick={() => {
                  setVisibleColumns(new Set(essentialColumns))
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm">
                Show Essential Only
              </button>
              <button
                type="button"
                onClick={() => {
                  setVisibleColumns(new Set())
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
                Hide All
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setColumnPage(Math.max(0, columnPage - 1))}
                disabled={columnPage === 0}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
                Previous
              </button>
              <span className="text-sm text-gray-900 dark:text-gray-100">
                Page {columnPage + 1} of{' '}
                {Math.ceil(columnList.length / columnsPerPage)}
              </span>
              <button
                type="button"
                onClick={() =>
                  setColumnPage(
                    Math.min(
                      Math.ceil(columnList.length / columnsPerPage) - 1,
                      columnPage + 1
                    )
                  )
                }
                disabled={
                  columnPage >=
                  Math.ceil(columnList.length / columnsPerPage) - 1
                }
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      <SmallTable
        title="Ultra Rare Items"
        description="Items matching your search criteria"
        sortingOrder={[{ desc: true, id: sortby }]}
        columnList={filteredColumnList}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={[
          'itemDataLink',
          'shoppingListLink',
          'whereToSellLink',
          'shortage',
          'minPrice',
          'total_quantity',
          'eligible_realm_count',
          'realm_count_with_item',
          'medianMinPrice',
          'averageMinPrice',
          'tsmMarketValue',
          'tsmAvgSalePrice',
          'tsmSaleRate',
          'tsmSoldPerDay',
          'tsmHistorical',
          'tsmAvgSaleVSCurrentMin',
          'tsmAvgSaleVSCurrentAverage',
          'tsmAvgSaleVSCurrentMedian',
          'tsmHistoricVSCurrentMin',
          'tsmHistoricVSCurrentAverage',
          'tsmHistoricVSCurrentMedian'
        ]}
        data={filteredData as Array<UltrarareItem & Record<string, any>>}
        csvOptions={{
          filename: 'saddlebag-wow-ultrarare.csv',
          columns: [
            { title: 'Item ID', value: 'itemID' },
            { title: 'Item Name', value: 'itemName' },
            { title: 'Item Class', value: 'item_class' },
            { title: 'Item Subclass', value: 'item_subclass' },
            { title: 'Quality', value: 'quality' },
            { title: 'Min Price', value: 'minPrice' },
            { title: 'Total Quantity', value: 'total_quantity' },
            { title: 'Eligible Realm Count', value: 'eligible_realm_count' },
            { title: 'Shortage', value: 'shortage' },
            { title: 'Realm Count With Item', value: 'realm_count_with_item' },
            { title: 'Median Min Price', value: 'medianMinPrice' },
            { title: 'Average Min Price', value: 'averageMinPrice' },
            { title: 'TSM Market Value', value: 'tsmMarketValue' },
            { title: 'TSM Avg Sale Price', value: 'tsmAvgSalePrice' },
            { title: 'TSM Sale Rate', value: 'tsmSaleRate' },
            { title: 'TSM Sold Per Day', value: 'tsmSoldPerDay' },
            { title: 'TSM Historical', value: 'tsmHistorical' }
          ]
        }}
      />
    </PageWrapper>
  )
}

const columnList: Array<ColumnList<UltrarareItem & Record<string, any>>> = [
  {
    columnId: 'itemName',
    header: 'Item Name',
    accessor: ({ row }) => (
      <ExternalLink text={row.itemName} link={row.wowheadURL} />
    )
  },
  {
    columnId: 'itemDataLink',
    header: 'Item Data',
    accessor: ({ row }) => (
      <ItemDataLink link={`/wow/item-data/${row.itemID}`} />
    )
  },
  {
    columnId: 'shoppingListLink',
    header: 'Shopping List',
    accessor: ({ row }) => (
      <ExternalLink
        text="Shopping List"
        link={`/wow/shopping-list?itemId=${row.itemID}`}
      />
    )
  },
  {
    columnId: 'whereToSellLink',
    header: 'Where to Sell',
    accessor: ({ row }) => (
      <ExternalLink
        text="Where to Sell"
        link={`/wow/export-search?itemId=${row.itemID}`}
      />
    )
  },
  { columnId: 'shortage', header: 'Shortage' },
  { columnId: 'minPrice', header: 'Min Price' },
  { columnId: 'total_quantity', header: 'Total Quantity' },
  {
    columnId: 'eligible_realm_count',
    header: 'Eligible Realm Count'
  },
  {
    columnId: 'realm_count_with_item',
    header: 'Realm Count With Item'
  },
  { columnId: 'medianMinPrice', header: 'Median Min Price' },
  { columnId: 'averageMinPrice', header: 'Average Min Price' },
  { columnId: 'tsmMarketValue', header: 'TSM Market Value' },
  { columnId: 'tsmAvgSalePrice', header: 'TSM Avg Sale Price' },
  { columnId: 'tsmSaleRate', header: 'TSM Sale Rate' },
  { columnId: 'tsmSoldPerDay', header: 'TSM Sold Per Day' },
  { columnId: 'tsmHistorical', header: 'TSM Historical' },
  {
    columnId: 'tsmAvgSaleVSCurrentMin',
    header: 'TSM Avg Sale VS Current Min'
  },
  {
    columnId: 'tsmAvgSaleVSCurrentAverage',
    header: 'TSM Avg Sale VS Current Average'
  },
  {
    columnId: 'tsmAvgSaleVSCurrentMedian',
    header: 'TSM Avg Sale VS Current Median'
  },
  {
    columnId: 'tsmHistoricVSCurrentMin',
    header: 'TSM Historic VS Current Min'
  },
  {
    columnId: 'tsmHistoricVSCurrentAverage',
    header: 'TSM Historic VS Current Average'
  },
  {
    columnId: 'tsmHistoricVSCurrentMedian',
    header: 'TSM Historic VS Current Median'
  },
  {
    columnId: 'quality',
    header: 'Quality',
    accessor: ({ getValue }) => {
      const qualityValue = getValue() as number
      const quality = itemQuality.find((q) => q.value === qualityValue)
      return (
        <span className="px-3 py-2">
          {quality ? quality.name : qualityValue.toString()}
        </span>
      )
    }
  }
]

const mobileColumnList: Array<ColumnList<UltrarareItem & Record<string, any>>> =
  [
    {
      columnId: 'itemName',
      header: 'Item Name',
      accessor: ({ row }) => (
        <ExternalLink text={row.itemName} link={row.wowheadURL} />
      )
    },
    {
      columnId: 'itemDataLink',
      header: 'Item Data',
      accessor: ({ row }) => (
        <ItemDataLink link={`/wow/item-data/${row.itemID}`} />
      )
    },
    {
      columnId: 'shoppingListLink',
      header: 'Shopping List',
      accessor: ({ row }) => (
        <ExternalLink
          text="Shopping List"
          link={`/wow/shopping-list?itemId=${row.itemID}`}
        />
      )
    },
    {
      columnId: 'whereToSellLink',
      header: 'Where to Sell',
      accessor: ({ row }) => (
        <ExternalLink
          text="Where to Sell"
          link={`/wow/export-search?itemId=${row.itemID}`}
        />
      )
    },
    { columnId: 'shortage', header: 'Shortage' },
    { columnId: 'minPrice', header: 'Min Price' }
  ]
