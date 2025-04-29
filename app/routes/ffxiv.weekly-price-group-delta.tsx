import { json } from '@remix-run/cloudflare'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  LinksFunction
} from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useState, useEffect } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { FFXIVLoaderData } from '~/requests/FFXIV/types'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { getUserSessionData } from '~/sessions'
import type { ColumnList } from '~/components/types'
import ItemsFilter from '~/components/form/ffxiv/ItemsFilter'
import DateRangeControls from '~/components/WoW/DateRangeControls'
import ItemDetailsTable from '~/components/WoW/ItemDetailsTable'
import GroupSelector from '~/components/WoW/GroupSelector'
import DeltaChartContainer from '~/components/WoW/DeltaChartContainer'
import PriceQuantityAnalysis from '~/components/WoW/PriceQuantityAnalysis'
import RequestDataSection from '~/components/WoW/RequestDataSection'
import DateInputs from '~/components/WoW/DateInputs'
import ImportSection from '~/components/WoW/ImportSection'
import PriceGroupsSection from '~/components/WoW/PriceGroupsSection'
import RequestPreview from '~/components/WoW/RequestPreview'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import ErrorPopup from '~/components/Common/ErrorPopup'
import WeeklyPriceGroupDelta from '~/requests/FFXIV/WeeklyPriceGroupDelta'

export interface PriceGroup {
  name: string
  item_ids: number[]
  categories: number[]
}

export interface WeeklyPriceGroupDeltaProps {
  region: string
  start_year: number
  start_month: number
  start_day: number
  end_year: number
  end_month: number
  end_day: number
  hq_only: boolean
  price_setting: string
  quantity_setting: string
  price_groups: PriceGroup[]
}

export interface ItemData {
  itemName: string
  weekly_data: Array<{
    p: number // price
    q: number // quantity
    t: number // timestamp
    delta: number // price change %
  }>
}

export interface GroupData {
  deltas: Record<string, number>
  item_names: Record<string, string>
  item_data: Record<string, ItemData>
}

export interface WeeklyPriceGroupDeltaResponse {
  [groupName: string]: GroupData
}

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Weekly Price Group Delta Analysis',
    description:
      'FFXIV Price Group Analysis! View weekly price changes for investment opportunities!'
  }
}

// Add keyframe animation for the pulsing effect
const styles = `
@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.pulse {
  animation: pulse-border 2s infinite;
}
`

// Overwrite default links in the root.tsx
export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/ffxiv/weekly-price-group-delta'
  },
  {
    rel: 'stylesheet',
    href: `data:text/css,${encodeURIComponent(styles)}`
  }
]

// Loader function to get session data
export const loader: LoaderFunction = async ({ request }) => {
  const { getFFXIVSessionData } = await getUserSessionData(request)
  const { world, region } = getFFXIVSessionData()

  if (!region || !world) {
    throw new Error(
      'Please configure your FFXIV settings in the user settings page'
    )
  }

  return json<FFXIVLoaderData>({
    world,
    region
  })
}

// Action function to handle form submission
export const action: ActionFunction = async ({ request }) => {
  const { getFFXIVSessionData } = await getUserSessionData(request)
  const { region } = getFFXIVSessionData()

  if (!region) {
    return json({
      exception: 'Region is required. Please configure it in your settings.'
    })
  }

  const formData = await request.formData()
  const startYear = Number.parseInt(formData.get('startYear') as string)
  const startMonth = Number.parseInt(formData.get('startMonth') as string)
  const startDay = Number.parseInt(formData.get('startDay') as string)
  const endYear = Number.parseInt(formData.get('endYear') as string)
  const endMonth = Number.parseInt(formData.get('endMonth') as string)
  const endDay = Number.parseInt(formData.get('endDay') as string)
  const hqOnly = formData.get('hq_only') === 'true'
  const priceSetting = formData.get('price_setting') as string
  const quantitySetting = formData.get('quantity_setting') as string
  const priceGroups = JSON.parse(
    formData.get('priceGroups') as string
  ) as PriceGroup[]

  try {
    const response = await WeeklyPriceGroupDelta({
      region,
      start_year: startYear,
      start_month: startMonth,
      start_day: startDay,
      end_year: endYear,
      end_month: endMonth,
      end_day: endDay,
      hq_only: hqOnly,
      price_setting: priceSetting,
      quantity_setting: quantitySetting,
      price_groups: priceGroups
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return json(data)
  } catch (error) {
    return json({
      exception:
        error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}

// Main component
const Index = () => {
  const { world, region } = useLoaderData<FFXIVLoaderData>()
  const { darkmode } = useTypedSelector((state) => state.user)
  const transition = useNavigation()
  const actionData = useActionData<WeeklyPriceGroupDeltaResponse>()
  const [priceGroups, setPriceGroups] = useState<PriceGroup[]>([])
  const [error, setError] = useState<string | undefined>(undefined)
  const [startYear, setStartYear] = useState(2025)
  const [startMonth, setStartMonth] = useState(1)
  const [startDay, setStartDay] = useState(1)
  const [endYear, setEndYear] = useState(2026)
  const [endMonth, setEndMonth] = useState(1)
  const [endDay, setEndDay] = useState(1)
  const [hqOnly, setHqOnly] = useState(false)
  const [priceSetting, setPriceSetting] = useState('median')
  const [quantitySetting, setQuantitySetting] = useState('quantitySold')
  const [showErrorPopup, setShowErrorPopup] = useState(false)

  const pageTitle = `Weekly Price Group Delta Analysis - ${world.name} (${region})`

  if (actionData) {
    return (
      <Results data={actionData} pageTitle={pageTitle} darkMode={darkmode} />
    )
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        hideSubmitButton={true}
        title={pageTitle}
        loading={transition.state === 'submitting'}
        error={undefined}
        onClick={(e) => e.preventDefault()}>
        <form method="post" className="space-y-4 mb-4">
          <ImportSection
            onImport={(data) => {
              if (data.start_year) setStartYear(data.start_year)
              if (data.start_month) setStartMonth(data.start_month)
              if (data.start_day) setStartDay(data.start_day)
              if (data.end_year) setEndYear(data.end_year)
              if (data.end_month) setEndMonth(data.end_month)
              if (data.end_day) setEndDay(data.end_day)
              if (data.hq_only !== undefined) setHqOnly(data.hq_only)
              if (data.price_setting) setPriceSetting(data.price_setting)
              if (data.quantity_setting)
                setQuantitySetting(data.quantity_setting)
              if (data.price_groups) setPriceGroups(data.price_groups)
            }}
          />

          <DateInputs
            startYear={startYear}
            startMonth={startMonth}
            startDay={startDay}
            onYearChange={setStartYear}
            onMonthChange={setStartMonth}
            onDayChange={setStartDay}
            onError={(err) => {
              setError(err)
              setShowErrorPopup(!!err)
            }}
          />

          <div className="grid grid-cols-1 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                HQ Only
              </label>
              <div className="mt-1">
                <input
                  type="checkbox"
                  name="hq_only"
                  checked={hqOnly}
                  onChange={(e) => setHqOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Price Setting
              </label>
              <select
                name="price_setting"
                value={priceSetting}
                onChange={(e) => setPriceSetting(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="median" className="dark:bg-gray-700">Median</option>
                <option value="mean" className="dark:bg-gray-700">Mean</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Quantity Setting
              </label>
              <select
                name="quantity_setting"
                value={quantitySetting}
                onChange={(e) => setQuantitySetting(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="quantitySold" className="dark:bg-gray-700">Quantity Sold</option>
                <option value="salesAmount" className="dark:bg-gray-700">Sales Amount</option>
              </select>
            </div>
          </div>

          <PriceGroupsSection
            priceGroups={priceGroups}
            onPriceGroupsChange={setPriceGroups}
            onError={(err) => {
              setError(err)
              setShowErrorPopup(!!err)
            }}
            isSubmitting={transition.state === 'submitting'}
          />

          <input
            type="hidden"
            name="priceGroups"
            value={JSON.stringify(priceGroups)}
          />

          <RequestPreview
            region={region}
            startYear={startYear}
            startMonth={startMonth}
            startDay={startDay}
            endYear={endYear}
            endMonth={endMonth}
            endDay={endDay}
            hqOnly={hqOnly}
            priceSetting={priceSetting}
            quantitySetting={quantitySetting}
            priceGroups={priceGroups}
          />
        </form>
      </SmallFormContainer>

      {/* Error Popup */}
      {error && showErrorPopup && (
        <ErrorPopup error={error} onClose={() => setShowErrorPopup(false)} />
      )}
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
  const [selectedGroup, setSelectedGroup] = useState<string>('All')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [minYAxis, setMinYAxis] = useState<number | null>(null)
  const [maxYAxis, setMaxYAxis] = useState<number | null>(null)
  const { world, region } = useLoaderData<FFXIVLoaderData>()
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({})
  const [showPriceQuantityCharts, setShowPriceQuantityCharts] = useState(false)
  const [selectedItemForChart, setSelectedItemForChart] = useState<
    string | null
  >(null)
  const [visibilityFilter, setVisibilityFilter] = useState('')

  // Get all unique timestamps across all groups
  const allTimestamps = Array.from(
    new Set(
      Object.values(data).flatMap((groupData) => Object.keys(groupData.deltas))
    )
  ).sort()

  // Initialize selected dates to full range
  useEffect(() => {
    if (allTimestamps.length <= 0) {
      return
    }
    if (!selectedDate) {
      setSelectedDate(allTimestamps[allTimestamps.length - 1])
    }
    if (!startDate) {
      setStartDate(allTimestamps[0])
    }
    if (!endDate) {
      setEndDate(allTimestamps[allTimestamps.length - 1])
    }
  }, [allTimestamps])

  // Filter timestamps based on date range
  const filteredTimestamps = allTimestamps.filter(
    (timestamp) => timestamp >= startDate && timestamp <= endDate
  )

  // Format timestamp into YYYY-MM-DD
  const formatTimestamp = (timestamp: string) => {
    const dateStr = timestamp.padStart(8, '0') // Ensure 8 digits
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    return `${year}-${month}-${day}`
  }

  // Initialize visible items when group changes
  useEffect(() => {
    if (selectedGroup === 'All') {
      // For 'All' view, show all groups
      const newVisibleItems: Record<string, boolean> = {}
      Object.keys(data).forEach((groupName) => {
        newVisibleItems[groupName] = true
      })
      setVisibleItems(newVisibleItems)
      return
    }
    // For specific group view, show average and conditionally show items
    const newVisibleItems: Record<string, boolean> = {
      [`${selectedGroup} (Average)`]: true
    }
    const groupData = data[selectedGroup]
    const itemCount = Object.keys(groupData.item_data).length
    const defaultVisibility = itemCount <= 50

    Object.keys(groupData.item_data).forEach((itemId) => {
      newVisibleItems[groupData.item_names[itemId]] = defaultVisibility
    })
    setVisibleItems(newVisibleItems)
  }, [selectedGroup, data])

  // Only show item details if a specific group is selected
  const showItemDetails = selectedGroup !== 'All'
  const groupData = showItemDetails ? data[selectedGroup] : null

  // Helper function to get data for a specific timestamp
  const getDataForTimestamp = (itemData: ItemData, timestamp: string) => {
    return itemData.weekly_data.find((d) => d.t.toString() === timestamp)
  }

  // Table columns for item details
  const columnList: Array<ColumnList<ItemData>> = [
    {
      columnId: 'visibility',
      header: 'Show in Chart',
      accessor: ({ row }) => {
        if (!groupData) return null
        const itemName = groupData.item_names[row.itemID]
        return (
          <input
            type="checkbox"
            checked={visibleItems[itemName]}
            onChange={() => {
              setVisibleItems((prev) => ({
                ...prev,
                [itemName]: !prev[itemName]
              }))
            }}
            className="form-checkbox h-4 w-4 text-blue-500"
          />
        )
      }
    },
    { columnId: 'itemName', header: 'Item Name' },
    {
      columnId: 'price',
      header: `Price (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.p,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.p.toLocaleString() : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'delta',
      header: `Delta % (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.delta,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? `${data.delta.toFixed(2)}%` : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'priceQuantity',
      header: 'Price V Quantity',
      accessor: ({ row }) => {
        if (!groupData) return null
        return (
          <button
            type="button"
            onClick={() => setSelectedItemForChart(row.itemID.toString())}
            className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-sm">
            Price V Quantity
          </button>
        )
      }
    },
    {
      columnId: 'links',
      header: 'Links',
      accessor: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <ItemDataLink link={`/queries/item-data/${row.itemID}`} />
            <span className="text-gray-400">|</span>
            <UniversalisBadgedLink
              link={`https://universalis.app/market/${row.itemID}`}
            />
          </div>
        )
      }
    }
  ]

  return (
    <PageWrapper>
      <Title title={pageTitle} />
      <ContentContainer>
        <div className="space-y-4">
          {/* Search Again Link */}
          <div className="flex justify-between items-center">
            <a
              href="/ffxiv/weekly-price-group-delta"
              className="text-blue-500 hover:text-blue-600 font-medium">
              ← Search Again
            </a>
          </div>

          {/* Date Range Controls */}
          <DateRangeControls
            startDate={startDate}
            endDate={endDate}
            allTimestamps={allTimestamps}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            formatTimestamp={formatTimestamp}
          />

          {/* Group selector */}
          <GroupSelector
            selectedGroup={selectedGroup}
            groups={Object.keys(data)}
            onGroupSelect={setSelectedGroup}
            darkMode={darkMode}
          />

          {/* Chart and Controls Container */}
          <DeltaChartContainer
            data={data}
            selectedGroup={selectedGroup}
            startDate={startDate}
            endDate={endDate}
            darkMode={darkMode}
            minYAxis={minYAxis}
            maxYAxis={maxYAxis}
            onMinYAxisChange={setMinYAxis}
            onMaxYAxisChange={setMaxYAxis}
            visibleItems={visibleItems}
            visibilityFilter={visibilityFilter}
            onVisibleItemsChange={setVisibleItems}
            onVisibilityFilterChange={setVisibilityFilter}
            filteredTimestamps={filteredTimestamps}
            formatTimestamp={formatTimestamp}
          />

          {/* Price vs Quantity Analysis */}
          {showItemDetails && groupData && (
            <PriceQuantityAnalysis
              showPriceQuantityCharts={showPriceQuantityCharts}
              setShowPriceQuantityCharts={setShowPriceQuantityCharts}
              groupData={groupData}
              visibleItems={visibleItems}
              darkMode={darkMode}
            />
          )}

          {/* Item details table */}
          {showItemDetails && groupData && (
            <ItemDetailsTable
              data={Object.values(groupData.item_data)}
              columnList={columnList}
              selectedDate={selectedDate}
              formatTimestamp={formatTimestamp}
              selectedGroup={selectedGroup}
              setSelectedDate={setSelectedDate}
              filteredTimestamps={filteredTimestamps}
              getDataForTimestamp={getDataForTimestamp}
            />
          )}

          {/* Price vs Quantity Chart Popup */}
          {selectedItemForChart && groupData && (
            <PriceQuantityChartPopup
              onClose={() => setSelectedItemForChart(null)}
              weeklyData={groupData.item_data[selectedItemForChart].weekly_data}
              darkMode={darkMode}
              itemName={groupData.item_names[selectedItemForChart]}
            />
          )}

          {/* Request Data Section */}
          <RequestDataSection
            data={data}
            wowRegion={region}
            startDate={startDate}
            darkMode={darkMode}
          />
        </div>
      </ContentContainer>
    </PageWrapper>
  )
}

export default Index
