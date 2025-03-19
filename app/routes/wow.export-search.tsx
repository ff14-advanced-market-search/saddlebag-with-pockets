import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { MetaFunction } from '@remix-run/react'
import { json } from '@remix-run/cloudflare'
import { useEffect, useState } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ExportItem, WoWExportResponse } from '~/requests/WoW/ExportSearch'
import WoWExportSearch from '~/requests/WoW/ExportSearch'
import { getUserSessionData } from '~/sessions'
import { wowItems, wowItemsList } from '~/utils/items/id_to_item'
import z from 'zod'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import { getItemIDByName, getItemNameById } from '~/utils/items'
import Select from '~/components/form/select'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'
import { Differences } from '~/components/FFXIVResults/listings/Differences'
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

const PAGE_URL = '/wow/export-search'

const defaultFormValues = {
  itemId: '',
  maxQuantity: 1000,
  minPrice: 1,
  populationWP: 3000,
  populationBlizz: 1,
  rankingWP: 90,
  sortBy: 'minPrice' as const
}

// type ExtendedFormValues = typeof defaultFormValues & {
//   itemId: string
// }

const inputMap: Record<string, string> = {
  itemId: 'Item Id',
  maxQuantity: 'Maximum Quantity',
  minPrice: 'Minimum Price',
  populationWP: 'Population',
  populationBlizz: 'Population Blizzard',
  rankingWP: 'Ranking',
  sortBy: 'Sort Results By'
}

const validateInput = z.object({
  itemId: parseStringToNumber,
  maxQuantity: parseStringToNumber,
  minPrice: parseStringToNumber,
  populationWP: parseStringToNumber,
  populationBlizz: parseStringToNumber,
  rankingWP: parseStringToNumber,
  sortBy: z.string()
  //connectedRealmIDs: z.record(z.string()).default({})
})

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'WoW best selling, find the best realm to sell any item on!',
    description:
      'Find the best realm to sell any item on! Wow realm population data.'
  }
}

// Overwrite default links in the root.tsx
export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/wow/export-search' }
]

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams

  const values = {
    itemId: params.get('itemId') || '',
    maxQuantity:
      params.get('maxQuantity') || defaultFormValues.maxQuantity.toString(),
    minPrice: params.get('minPrice') || defaultFormValues.minPrice.toString(),
    populationWP:
      params.get('populationWP') || defaultFormValues.populationWP.toString(),
    populationBlizz:
      params.get('populationBlizz') ||
      defaultFormValues.populationBlizz.toString(),
    rankingWP:
      params.get('rankingWP') || defaultFormValues.rankingWP.toString(),
    sortBy: params.get('sortBy') || defaultFormValues.sortBy.toString()
  }
  const validParams = validateInput.safeParse(values)

  if (validParams.success) {
    return json(validParams.data)
  }

  return json(defaultFormValues)
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)

  const region = session.getWoWSessionData().region

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

  const result = await WoWExportSearch({
    region,
    ...validatedFormData.data,
    itemID: validatedFormData.data.itemId,
    connectedRealmIDs: {}
  })

  return json({
    ...(await result.json()),
    sortby: validatedFormData.data.sortBy
  })
}

type ActionResponseType =
  | {}
  | { exception: string }
  | (WoWExportResponse & { sortby: string })

const ExportSearch = () => {
  const loaderData = useLoaderData<typeof defaultFormValues>()
  const result = useActionData<ActionResponseType>()
  const [itemName, setItemName] = useState<{ name: string; error: string }>({
    name: getItemNameById(loaderData.itemId.toString(), wowItems) || '',
    error: ''
  })
  const itemId = getItemIDByName(itemName.name.trim(), wowItems)
  const transistion = useNavigation()
  const isSubmitting = transistion.state === 'submitting'

  const [searchParams, setSearchParams] = useState<typeof defaultFormValues>({
    ...loaderData
  })

  const handleSelect = (value: string) => {
    setItemName({ error: '', name: value })
    const itemId = getItemIDByName(value.trim(), wowItems)

    if (itemId) {
      handleSearchParamChange('itemId', itemId.toString())
      setSearchParams({ ...searchParams, itemId: itemId.toString() })
    }
  }

  const isItemValid = typeof itemId === 'string'

  const error = result && 'exception' in result ? result.exception : undefined

  if (result && !Object.keys(result).length) {
    return <NoResults href={PAGE_URL} />
  }

  if (result && 'data' in result && !error) {
    return <Results {...result} />
  }

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isSubmitting) {
      event.preventDefault()
    }
    if (!itemId) {
      setItemName({ ...itemName, error: 'Invalid item selected' })
    }
  }

  const handleFormChange = (
    name: keyof typeof defaultFormValues,
    value: string
  ) => {
    handleSearchParamChange(name, value)
    setSearchParams({ ...searchParams, [name]: value })
  }

  return (
    <PageWrapper>
      <Banner />
      <SmallFormContainer
        title="Export Search: Find the Best Place to Sell!"
        onClick={handleSubmit}
        error={error || itemName.error}
        loading={isSubmitting}
        disabled={!isItemValid}
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
          <DebouncedSelectInput
            title={'Item to search for'}
            displayValue={itemName.name}
            label="Item"
            id="export-item-select"
            selectOptions={wowItemsList}
            onSelect={handleSelect}
          />
          <input hidden name="itemId" value={itemId} />
          <InputWithLabel
            labelTitle={inputMap.maxQuantity}
            defaultValue={loaderData.maxQuantity}
            name="maxQuantity"
            type="number"
            min={0}
            onChange={(e) => {
              const value = e.currentTarget.value
              if (value !== null || value !== undefined) {
                handleFormChange('maxQuantity', value)
              }
            }}
          />
          <InputWithLabel
            labelTitle={inputMap.minPrice}
            defaultValue={loaderData.minPrice}
            name="minPrice"
            type="number"
            min={0}
            onChange={(e) => {
              const value = e.currentTarget.value
              if (value !== null || value !== undefined) {
                handleFormChange('minPrice', value)
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
                handleFormChange('populationWP', value)
              }
            }}
          />
          <Select
            title={inputMap.populationBlizz}
            defaultValue={loaderData.populationBlizz.toString()}
            name="populationBlizz"
            options={[
              { label: 'FULL', value: '3' },
              { label: 'HIGH', value: '2' },
              { label: 'MEDIUM', value: '1' },
              { label: 'LOW', value: '0' }
            ]}
            onChange={(e) => {
              const value = e.currentTarget.value
              if (value !== null || value !== undefined) {
                handleFormChange('populationBlizz', value)
              }
            }}
          />
          <InputWithLabel
            labelTitle={inputMap.rankingWP}
            defaultValue={loaderData.rankingWP}
            name="rankingWP"
            type="number"
            min={1}
            onChange={(e) => {
              const value = e.currentTarget.value
              if (value !== null || value !== undefined) {
                handleFormChange('rankingWP', value)
              }
            }}
          />
          <Select
            title={inputMap.sortBy}
            defaultValue={loaderData.sortBy}
            name="sortBy"
            options={[
              { label: 'Minimum Price', value: 'minPrice' },
              { label: 'Item Quantity', value: 'itemQuantity' },
              { label: 'Realm Population', value: 'realmPopulationReal' },
              { label: 'Realm Ranking', value: 'realmRanking' }
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
          Note: If the search button does not appear after you select your item,
          try refreshing the page.
        </p>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default ExportSearch

const differencesBlue =
  'bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100'

const Results = ({
  data,
  sortby,
  itemInfo
}: WoWExportResponse & { sortby: string }) => {
  useEffect(() => {
    if (window && document) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [])
  return (
    <PageWrapper>
      <ContentContainer>
        <div className="flex flex-col min-w-full">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Title title={itemInfo.itemName} />
            <ItemDataLink link={itemInfo.link} />
          </div>
          <div className="flex flex-col md:flex-row w-full">
            <div className="flex  flex-col md:min-w-[50%] justify-center">
              <Differences
                className={differencesBlue}
                diffTitle="Average Min Price"
                diffAmount={itemInfo.avgMinPrice}
              />
              <Differences
                className={differencesBlue}
                diffTitle="Avg TSM Price"
                diffAmount={itemInfo.avgTSMPrice}
              />
            </div>
            <div className="flex flex-col md:min-w-[50%] justify-center">
              <Differences
                className={differencesBlue}
                diffTitle="Sales per Day"
                diffAmount={itemInfo.salesPerDay}
              />
              <Differences
                className={differencesBlue}
                diffTitle="Average Server Quantity"
                diffAmount={itemInfo.avgServerQuantity}
              />
            </div>
          </div>
        </div>
      </ContentContainer>
      <SmallTable
        title="Export Results"
        description="Results for your item in different worlds"
        sortingOrder={[{ desc: true, id: sortby }]}
        columnList={columnList}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={[
          'minPrice',
          'itemQuantity',
          'realmPopulationReal',
          'realmRanking'
        ]}
        data={data}
        csvOptions={{
          filename: 'saddlebag-wow-export.csv',
          columns: [
            { title: 'Realm ID', value: 'connectedRealmID' },
            { title: 'Realm Names', value: 'connectedRealmNames' },
            { title: 'Minimum Price', value: 'minPrice' },
            { title: 'Item Quantity', value: 'itemQuantity' },
            { title: 'Realm Ranking', value: 'realmRanking' },
            { title: 'Realm Population Type', value: 'realmPopulationType' },
            { title: 'Realm Population', value: 'realmPopulationReal' }
          ]
        }}
      />
    </PageWrapper>
  )
}

const columnList: Array<ColumnList<ExportItem>> = [
  {
    columnId: 'connectedRealmNames',
    header: 'Realm Names',
    accessor: ({ row }) => (
      <p className=" px-3 py-2 max-w-[200px] overflow-x-scroll">
        {row.connectedRealmNames.join(', ')}
      </p>
    )
  },
  { columnId: 'minPrice', header: 'Minimum Price' },
  { columnId: 'itemQuantity', header: 'Item Quantity' },
  { columnId: 'realmPopulationReal', header: 'Realm Population' },
  { columnId: 'realmPopulationType', header: 'Blizzard Realm Size' },
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
  {
    columnId: 'connectedRealmNames',
    header: 'Realm Names',
    accessor: ({ row }) => (
      <p className=" px-3 py-2 max-w-[200px] overflow-x-scroll">
        {row.connectedRealmNames.join(', ')}
      </p>
    )
  },
  { columnId: 'minPrice', header: 'Minimum Price' }
]
