import { json } from '@remix-run/cloudflare'
import type { ActionFunction, LoaderFunction, MetaFunction, LinksFunction } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useState } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { WoWLoaderData } from '~/requests/WoW/types'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { getUserSessionData } from '~/sessions'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import FullTable from '~/components/Tables/FullTable'
import MobileTable from '~/components/WoWResults/FullScan/MobileTable'
import type { ColumnList } from '~/components/types'
import DebouncedInput from '~/components/Common/DebouncedInput'
import CSVButton from '~/components/utilities/CSVButton'
import JSONButton from '~/components/utilities/JSONButton'
import type { Options } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PriceGroupForm from '~/components/form/WoW/PriceGroupForm'
import type { 
  WeeklyPriceGroupDeltaResponse,
  ItemData,
  PriceGroup
} from '~/requests/WoW/WeeklyPriceGroupDelta'
import WeeklyPriceGroupDelta from '~/requests/WoW/WeeklyPriceGroupDelta'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW Weekly Price Group Delta Analysis',
    description: 'Analyze weekly price changes for groups of WoW items and categories'
  }
}

// Overwrite default links in the root.tsx
export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/wow/weekly-price-group-delta'
  }
]

// Loader function to get session data
export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  
  if (!region || !server) {
    throw new Error('Please configure your WoW settings in the user settings page')
  }

  return json<WoWLoaderData>({
    wowRealm: server,
    wowRegion: region
  })
}

// Action function to handle form submission
export const action: ActionFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { region } = getWoWSessionData()

  if (!region) {
    return json({
      exception: 'Region is required. Please configure it in your settings.'
    })
  }

  const formData = await request.formData()
  const startYear = parseInt(formData.get('startYear') as string)
  const startMonth = parseInt(formData.get('startMonth') as string)
  const startDay = parseInt(formData.get('startDay') as string)
  const priceGroups = JSON.parse(formData.get('priceGroups') as string) as PriceGroup[]

  try {
    const response = await WeeklyPriceGroupDelta({
      region,
      start_year: startYear,
      start_month: startMonth,
      start_day: startDay,
      price_groups: priceGroups
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return json(data)
  } catch (error) {
    return json({
      exception: error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}

// Main component
const Index = () => {
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const { darkmode } = useTypedSelector((state) => state.user)
  const transition = useNavigation()
  const actionData = useActionData<WeeklyPriceGroupDeltaResponse>()
  const [priceGroups, setPriceGroups] = useState<PriceGroup[]>([])

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const pageTitle = `Weekly Price Group Delta Analysis - ${wowRealm} (${wowRegion})`

  if (actionData) {
    return <Results data={actionData} pageTitle={pageTitle} darkMode={darkmode} />
  }

  const error = undefined // TODO: Implement error handling

  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        error={error}>
        <form method="post" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <InputWithLabel
              labelTitle="Start Year"
              name="startYear"
              type="number"
              defaultValue={new Date().getFullYear()}
              min={2020}
              max={2030}
            />
            <InputWithLabel
              labelTitle="Start Month"
              name="startMonth"
              type="number"
              defaultValue={new Date().getMonth() + 1}
              min={1}
              max={12}
            />
            <InputWithLabel
              labelTitle="Start Day"
              name="startDay"
              type="number"
              defaultValue={new Date().getDate()}
              min={1}
              max={31}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Price Groups</h3>
            {priceGroups.map((group, index) => (
              <PriceGroupForm
                key={index}
                defaultValue={group}
                onChange={(updatedGroup) => {
                  const newGroups = [...priceGroups]
                  newGroups[index] = updatedGroup
                  setPriceGroups(newGroups)
                }}
                onRemove={() => {
                  setPriceGroups(priceGroups.filter((_, i) => i !== index))
                }}
              />
            ))}
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                setPriceGroups([
                  ...priceGroups,
                  {
                    name: '',
                    item_ids: [],
                    categories: []
                  }
                ])
              }}>
              Add Price Group
            </button>
          </div>

          <input
            type="hidden"
            name="priceGroups"
            value={JSON.stringify(priceGroups)}
          />
        </form>
      </SmallFormContainer>
    </PageWrapper>
  )
}

// Results component
const Results = ({
  data,
  pageTitle,
  darkMode
}: {
  data: WeeklyPriceGroupDeltaResponse
  pageTitle: string
  darkMode: boolean
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(Object.keys(data)[0])
  const [globalFilter, setGlobalFilter] = useState('')

  const styles = darkMode
    ? {
        backgroundColor: '#334155',
        color: 'white',
        hoverColor: '#f8f8f8'
      }
    : {}

  const groupData = data[selectedGroup]
  const timestamps = Object.keys(groupData.deltas).sort()

  // Chart options for group deltas
  const deltaChartOptions: Options = {
    chart: {
      type: 'line',
      backgroundColor: styles?.backgroundColor
    },
    title: {
      text: `${selectedGroup} - Weekly Price Deltas`,
      style: { color: styles?.color }
    },
    xAxis: {
      categories: timestamps.map((t) => new Date(parseInt(t)).toLocaleDateString()),
      labels: { style: { color: styles?.color } },
      title: { text: 'Week', style: { color: styles?.color } }
    },
    yAxis: {
      title: {
        text: 'Price Change %',
        style: { color: styles?.color }
      },
      labels: { style: { color: styles?.color } }
    },
    series: [
      {
        name: 'Price Delta %',
        data: timestamps.map((t) => groupData.deltas[t]),
        type: 'line'
      }
    ],
    legend: {
      itemStyle: { color: styles?.color },
      itemHoverStyle: { color: styles?.hoverColor }
    },
    credits: { enabled: false }
  }

  // Table columns for item details
  const columnList: Array<ColumnList<ItemData>> = [
    { columnId: 'itemName', header: 'Item Name' },
    { columnId: 'itemID', header: 'Item ID' },
    {
      columnId: 'currentPrice',
      header: 'Current Price',
      accessor: ({ row }) => {
        const lastData = row.weekly_data[row.weekly_data.length - 1]
        return <span>{lastData ? lastData.p.toLocaleString() : 'N/A'}</span>
      }
    },
    {
      columnId: 'currentDelta',
      header: 'Current Delta %',
      accessor: ({ row }) => {
        const lastData = row.weekly_data[row.weekly_data.length - 1]
        return <span>{lastData ? `${lastData.delta.toFixed(2)}%` : 'N/A'}</span>
      }
    }
  ]

  // Define the type for our transformed data
  type CSVDataType = ItemData & {
    currentPrice: number
    currentDelta: number
  }

  // Transform the data to include computed fields
  const csvData = Object.values(groupData.item_data).map(item => ({
    ...item,
    currentPrice: item.weekly_data[item.weekly_data.length - 1]?.p || 0,
    currentDelta: item.weekly_data[item.weekly_data.length - 1]?.delta || 0
  }))

  const csvColumns: Array<{ title: string; value: keyof CSVDataType }> = [
    { title: 'Item Name', value: 'itemName' },
    { title: 'Item ID', value: 'itemID' },
    { title: 'Current Price', value: 'currentPrice' },
    { title: 'Current Delta %', value: 'currentDelta' }
  ]

  return (
    <PageWrapper>
      <Title title={pageTitle} />
      <ContentContainer>
        <div className="space-y-4">
          {/* Group selector */}
          <select
            className="w-full p-2 border rounded"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}>
            {Object.keys(data).map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          {/* Delta chart */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <HighchartsReact highcharts={Highcharts} options={deltaChartOptions} />
          </div>

          {/* Item details table */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Item Details</h3>
              <DebouncedInput
                onDebouncedChange={setGlobalFilter}
                className="p-2 border rounded"
                placeholder="Search items..."
              />
            </div>

            <div className="hidden md:block">
              <FullTable
                data={Object.values(groupData.item_data)}
                columnList={columnList}
                globalFilter={globalFilter}
                sortingOrder={[]}
              />
            </div>
            <div className="md:hidden">
              <MobileTable
                data={Object.values(groupData.item_data)}
                columnList={columnList}
                sortingOrder={[{ id: 'itemName', desc: false }]}
                title="Item Details"
                rowLabels={[]}
                columnSelectOptions={[]}
              />
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2">
            <CSVButton
              data={csvData}
              columns={csvColumns}
              filename={`${selectedGroup}_items.csv`}
            />
            <JSONButton data={Object.values(groupData.item_data)} />
          </div>
        </div>
      </ContentContainer>
    </PageWrapper>
  )
}

export default Index
