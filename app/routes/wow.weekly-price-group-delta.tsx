import { json } from '@remix-run/cloudflare'
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
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
import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PriceGroupForm, {
  PriceGroup
} from '~/components/form/WoW/PriceGroupForm'

// Types for the API request/response
interface RequestData {
  region: string
  start_year: number
  start_month: number
  start_day: number
  price_groups: PriceGroup[]
}

interface ItemData {
  itemID: number
  itemName: string
  weekly_data: Array<{
    p: number // price
    q: number // quantity
    t: number // timestamp
    delta: number // price change %
  }>
}

interface GroupData {
  deltas: Record<string, number>
  item_names: Record<string, string>
  item_data: Record<string, ItemData>
}

interface ResponseData {
  [groupName: string]: GroupData
}

// Loader function to get session data
export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

// Action function to handle form submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const region = formData.get('region') as string
  const startYear = parseInt(formData.get('startYear') as string)
  const startMonth = parseInt(formData.get('startMonth') as string)
  const startDay = parseInt(formData.get('startDay') as string)
  const priceGroups = JSON.parse(
    formData.get('priceGroups') as string
  ) as PriceGroup[]

  const requestData: RequestData = {
    region,
    start_year: startYear,
    start_month: startMonth,
    start_day: startDay,
    price_groups: priceGroups
  }

  // TODO: Make actual API call
  return json({})
}

// Main component
const Index = () => {
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const { darkmode } = useTypedSelector((state) => state.user)
  const transition = useNavigation()
  const results = useActionData<ResponseData>()
  const [priceGroups, setPriceGroups] = useState<PriceGroup[]>([])

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const pageTitle = 'Weekly Price Group Delta Analysis'

  if (results) {
    return <Results data={results} pageTitle={pageTitle} darkMode={darkmode} />
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
          <RegionAndServerSelect
            region={wowRegion}
            defaultRealm={wowRealm}
            serverSelectFormName="homeRealmId"
          />

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
  data: ResponseData
  pageTitle: string
  darkMode: boolean
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(
    Object.keys(data)[0]
  )
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
      categories: timestamps.map((t) =>
        new Date(parseInt(t)).toLocaleDateString()
      ),
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
            <HighchartsReact
              highcharts={Highcharts}
              options={deltaChartOptions}
            />
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
              data={Object.values(groupData.item_data)}
              columns={columnList.map((col) => ({
                title: col.header,
                value: col.columnId as keyof ItemData
              }))}
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
