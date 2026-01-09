import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json, redirect } from '@remix-run/cloudflare'
import { useEffect, useState } from 'react'
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
import { itemQuality } from '~/utils/WoWFilers/itemQuality'

const PAGE_URL = '/wow/ultrarare'

const defaultFormValues = {
  populationBlizz: 0,
  rankingWP: 99,
  populationWP: 5000,
  min_quantity: 0,
  max_quantity: 10,
  item_class: -1,
  item_subclass: -1,
  min_quality: -1,
  expansion_number: -1,
  sortBy: 'tsmAvgSaleVSCurrentMin'
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
  sortBy: 'Sort Results By'
}

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
  sortBy: z.string()
})

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW Ultra Rare Item Search',
    description: 'Search for ultra rare items across World of Warcraft servers',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/wow/ultrarare'
      }
    ]
  }
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
    sortBy: params.get('sortBy') || defaultFormValues.sortBy.toString()
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
    sortBy: loaderData.sortBy
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
        }}>
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
        }}>
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
            <InputWithLabel
              labelTitle={inputMap.populationBlizz}
              defaultValue={loaderData.populationBlizz}
              name="populationBlizz"
              type="number"
              min={0}
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleFormChange('populationBlizz', parseInt(value, 10))
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.rankingWP}
              defaultValue={loaderData.rankingWP}
              name="rankingWP"
              type="number"
              min={1}
              max={100}
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleFormChange('rankingWP', parseInt(value, 10))
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.populationWP}
              defaultValue={loaderData.populationWP}
              name="populationWP"
              type="number"
              min={1}
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleFormChange('populationWP', parseInt(value, 10))
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.min_quantity}
              defaultValue={loaderData.min_quantity}
              name="min_quantity"
              type="number"
              min={0}
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleFormChange('min_quantity', parseInt(value, 10))
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.max_quantity}
              defaultValue={loaderData.max_quantity}
              name="max_quantity"
              type="number"
              min={0}
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleFormChange('max_quantity', parseInt(value, 10))
                }
              }}
            />
            <ExpansionSelect
              defaultValue={loaderData.expansion_number.toString()}
              onChange={(value) =>
                handleFormChange('expansion_number', parseInt(value, 10))
              }
            />
            <input
              type="hidden"
              name="expansion_number"
              value={searchParams.expansion_number}
            />
            <ItemClassSelect
              itemClass={searchParams.item_class}
              itemSubClass={searchParams.item_subclass}
              onChange={(itemClassValue, itemSubClassValue) => {
                // If item_class is -1 (All), ensure item_subclass is also -1
                const finalSubclass =
                  itemClassValue === -1 ? -1 : itemSubClassValue
                handleFormChange('item_class', itemClassValue)
                handleFormChange('item_subclass', finalSubclass)
              }}
            />
            {/* Hidden inputs to ensure correct values are submitted (ItemClassSelect uses itemClass/itemSubClass internally) */}
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
            <div className="w-full mt-2">
              <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
                <label
                  htmlFor="min_quality"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                  {inputMap.min_quality}
                </label>
              </div>
              <select
                id="min_quality"
                name="min_quality"
                defaultValue={loaderData.min_quality.toString()}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-400 dark:bg-gray-600 dark:text-gray-100"
                onChange={(e) => {
                  const value = e.currentTarget.value
                  if (value !== null || value !== undefined) {
                    handleFormChange('min_quality', parseInt(value, 10))
                  }
                }}>
                <option value={-1}>All</option>
                {itemQuality.map(({ name, value }) => (
                  <option key={name + value} value={value}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <Select
              title={inputMap.sortBy}
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
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleFormChange('sortBy', value)
                }
              }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-2">
            Note: Results may vary based on server population and availability.
          </p>
        </SmallFormContainer>
      </PremiumPaywall>
    </PageWrapper>
  )
}

export default UltrararePage

const Results = ({ data, sortby }: UltrarareResponse & { sortby: string }) => {
  useEffect(() => {
    if (window && document) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <PageWrapper>
      <ContentContainer>
        <div className="flex flex-col min-w-full">
          <Title title="Ultra Rare Item Results" />
        </div>
      </ContentContainer>
      <SmallTable
        title="Ultra Rare Items"
        description="Items matching your search criteria"
        sortingOrder={[{ desc: true, id: sortby }]}
        columnList={columnList}
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
        data={data as Array<UltrarareItem & Record<string, any>>}
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
