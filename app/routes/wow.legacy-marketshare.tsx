import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  LinksFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import type { TreemapNode } from '~/components/Charts/Treemap'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import { TabbedButtons, hexMap } from '~/components/FFXIVResults/Marketshare'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import Select from '~/components/form/select'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import {
  ItemClassSelect,
  ItemQualitySelect
} from '~/components/form/WoW/WoWScanForm'
import type {
  LegacyMarketshareResponse,
  LegacyMarketshareItem,
  LegacyMarketshareSortBy
} from '~/requests/WoW/LegacyMarketshare'
import LegacyMarketshare from '~/requests/WoW/LegacyMarketshare'
import type { WoWLoaderData, WoWServerRegion } from '~/requests/WoW/types'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { getUserSessionData } from '~/sessions'
import TreemapChart from '~/components/Charts/Treemap'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import FullTable from '~/components/Tables/FullTable'
import MobileTable from '~/components/WoWResults/FullScan/MobileTable'
import type { ColumnList } from '~/components/types'
import { getOribosLink } from '~/components/utilities/getOribosLink'
import { getSaddlebagWoWLink } from '~/components/utilities/getSaddlebagWoWLink'
import DebouncedInput from '~/components/Common/DebouncedInput'
import CSVButton from '~/components/utilities/CSVButton'
import JSONButton from '~/components/utilities/JSONButton'
import PBSListButton from '~/components/utilities/PBSListButton'
import AAAListButton from '~/components/utilities/AAAListButton'

const inputMap: Record<string, string> = {
  homeRealmId: 'Home Realm',
  region: 'Region',
  desiredAvgPrice: 'Average Price',
  desiredSalesPerDay: 'Sales Per Day',
  itemClass: 'Item Class',
  itemSubclass: 'Item Sub Class',
  sortBy: 'Sort By'
}

const sortByOptions: Array<{ label: string; value: LegacyMarketshareSortBy }> =
  [
    { value: 'currentMarketValue', label: 'Current Daily Gold Earned' },
    { value: 'historicMarketValue', label: 'Historic Daily Gold Earned' },
    { value: 'historicPrice', label: 'Historic Price' },
    { value: 'minPrice', label: 'Minimum Price' },
    { value: 'percentChange', label: 'Percent Change' },
    { value: 'salesPerDay', label: 'Sales Per Day' }
  ]

const assertIsSortBy = (
  sortOption: string
): sortOption is LegacyMarketshareSortBy => {
  return sortByOptions.some(({ value }) => value === sortOption)
}

const validateFormData = z.object({
  homeRealmId: z
    .string()
    .min(1)
    .transform((value) => parseInt(value.split('---')[0], 10)),
  desiredAvgPrice: z
    .string()
    .min(1)
    .transform((value) => parseFloat(value) * 10000),
  desiredSalesPerDay: z
    .string()
    .min(1)
    .transform((value) => parseFloat(value)),
  itemClass: z
    .string()
    .min(1)
    .transform((value) => parseInt(value, 10)),
  itemSubClass: z
    .string()
    .min(1)
    .transform((value) => parseInt(value, 10)),
  sortBy: z.union([
    z.literal('currentMarketValue'),
    z.literal('historicMarketValue'),
    z.literal('historicPrice'),
    z.literal('minPrice'),
    z.literal('percentChange'),
    z.literal('salesPerDay')
  ])
})

const pageTitle = 'Legacy Item Marketshare'

export const ErrorBoundary = () => <ErrorBounds />

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW Legacy most gold',
    description:
      'Find what legacy content items make the most gold in WoW, sell the most in WoW, sell the fastest in in WoW and have the best market gaps!'
  }
}

// Overwrite default links in the root.tsx
export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/wow/legacy-marketshare'
  }
]

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  formPayload.commodity = formPayload.commodity || 'off'

  const validInput = validateFormData.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: `Missing: ${validInput.error.issues
        .map(({ path }) =>
          path.map((field) => inputMap[field] || 'Unknown input error')
        )
        .join(', ')}`
    })
  }

  const response = await (await LegacyMarketshare(validInput.data)).json()

  if (response.exception !== undefined) {
    return json({ exception: response.exception })
  }

  if (!response?.data) {
    return json({ exception: 'Unknown server error' })
  }

  return json({ data: response.data, sortBy: validInput.data.sortBy })
}

const Index = () => {
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  //   const { darkmode } = useTypedSelector(({ user }) => user)
  const transition = useNavigation()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const results = useActionData<
    | (LegacyMarketshareResponse & { sortBy: LegacyMarketshareSortBy })
    | { exception: string }
    | {}
  >()

  if (results) {
    if (Object.keys(results).length === 0) {
      return (
        <PageWrapper>
          <NoResults href="/wow/legacy-marketshare" />
        </PageWrapper>
      )
    }

    if ('data' in results) {
      return (
        <Results
          data={results.data}
          sortByValue={results.sortBy}
          server={wowRealm.name}
          region={wowRegion}
        />
      )
    }
  }

  const error =
    results && 'exception' in results ? results.exception : undefined

  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        error={error}>
        <div className="pt-4">
          <InputWithLabel
            defaultValue={1000}
            type="number"
            labelTitle="Minimum Desired average price"
            inputTag="Gold"
            name="desiredAvgPrice"
            min={0.0}
            step={0.01}
          />
          <InputWithLabel
            defaultValue={0.01}
            type="number"
            labelTitle="Minimum Desired sales per day"
            inputTag="Sales"
            name="desiredSalesPerDay"
            min={0}
            step={0.01}
          />
          <ItemClassSelect />
          <ItemQualitySelect />
          <Select
            title="Sort Results By"
            options={sortByOptions}
            name="sortBy"
            id="sortBy"
          />
          <RegionAndServerSelect
            region={wowRegion}
            defaultRealm={wowRealm}
            serverSelectFormName="homeRealmId"
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index

const getColumnList = (
  region: WoWServerRegion,
  server: string
): Array<ColumnList<LegacyMarketshareItem>> => {
  return [
    { columnId: 'itemName', header: 'Item Name' },
    { columnId: 'currentMarketValue', header: 'Current Daily Gold Earned' },
    { columnId: 'minPrice', header: 'Minimum Price' },
    { columnId: 'salesPerDay', header: 'Sales Per Day' },
    { columnId: 'historicMarketValue', header: 'Historic Daily Gold Earned' },
    { columnId: 'historicPrice', header: 'Historic Price' },
    {
      columnId: 'percentChange',
      header: 'Percent Changed',
      accessor: ({ row }) => {
        const value = row.percentChange
        if (!value) return null

        if (value >= 9999999) return <p>∞</p>

        return <p>{`${value.toLocaleString()}%`}</p>
      }
    },
    { columnId: 'state', header: 'State in Market' },
    {
      columnId: 'itemID',
      header: 'Link',
      accessor: ({ row }) => {
        const link = getSaddlebagWoWLink('')
        return link({ row })
      }
    },
    {
      columnId: 'itemID',
      header: 'Undermine',
      accessor: ({ row }) => {
        const link = getOribosLink(server, '', region)
        return link({ row })
      }
    }
  ]
}

const getMobileColumns = (
  sortBy: LegacyMarketshareSortBy,
  options: Array<{ label: string; value: string }>
) => {
  const sortByName = options.find(({ value }) => sortBy === value)
  if (!sortByName) {
    return [
      { columnId: 'itemName', header: 'Item Name' },
      { header: 'Current Daily Gold Earned', columnId: 'currentMarketValue' }
    ]
  }

  return [
    { columnId: 'itemName', header: 'Item Name' },
    { header: sortByName.label, columnId: sortByName.value }
  ]
}

const Results = ({
  data,
  sortByValue,
  server,
  region
}: {
  data: Array<LegacyMarketshareItem>
  sortByValue: LegacyMarketshareSortBy
  server: string
  region: WoWServerRegion
}) => {
  const { darkmode } = useTypedSelector(({ user }) => user)
  const [sortBy, setSortBy] = useState<LegacyMarketshareSortBy>(sortByValue)
  const [globalFilter, setGlobalFilter] = useState('')

  const chartData = getChartData(data, sortBy)

  const columnList = getColumnList(region, server)

  // Define the columns for the CSV
  const csvColumns = columnList.map(({ columnId, header }) => ({
    title: header,
    value: columnId
  }))

  return (
    <PageWrapper>
      <Title title={pageTitle} />
      <ContentContainer>
        <>
          <TabbedButtons
            currentValue={sortBy}
            onClick={(value) => {
              if (assertIsSortBy(value)) setSortBy(value)
            }}
            options={sortByOptions}
          />
          <div className="md:hidden py-2">
            <Select
              title="Sort Results By"
              options={sortByOptions}
              name="sortBy"
              id="sortBy"
              onChange={(e) => {
                const value = e.target.value
                if (assertIsSortBy(value)) setSortBy(value)
              }}
            />
          </div>
          <TreemapChart
            chartData={chartData}
            darkMode={darkmode}
            backgroundColor={darkmode ? '#1f2937' : '#f3f4f6'}
          />
        </>
      </ContentContainer>

      <div className="flex justify-between">
        <CSVButton
          filename="legacy_marketshare.csv"
          data={data}
          columns={csvColumns}
        />
        <JSONButton data={data} />
        <AAAListButton data={data} />
        <PBSListButton data={data} />
        <DebouncedInput
          onDebouncedChange={(value) => {
            setGlobalFilter(value)
          }}
          className={'hidden sm:block p-2 rounded-md'}
          placeholder={'Search...'}
        />
      </div>

      <div className="hidden sm:block">
        <FullTable<LegacyMarketshareItem>
          data={data}
          sortingOrder={[{ id: sortBy, desc: true }]}
          columnList={columnList}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      <MobileTable
        data={data}
        sortingOrder={[{ id: sortBy, desc: true }]}
        columnList={getMobileColumns(sortBy, sortByOptions)}
        rowLabels={columnList}
        columnSelectOptions={sortByOptions.map(({ value }) => value)}
      />
    </PageWrapper>
  )
}

const getChartData = (
  data: Array<LegacyMarketshareItem>,
  sortByValue: LegacyMarketshareSortBy
): Array<TreemapNode> => {
  return data.map((current) => ({
    id: current.itemID,
    value: current[sortByValue],
    name: current.itemName,
    toolTip: `${current.itemName}: ${current[sortByValue].toLocaleString()}`,
    color: hexMap[current.state]
  }))
}
