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
import type { FFXIVLoaderData, ImportData } from '~/requests/FFXIV/types'
import { useTypedSelector } from '~/redux/useTypedSelector'
import WeeklyPriceGroupDelta from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import type {
  WeeklyPriceGroupDeltaResponse,
  ItemData
} from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import ErrorPopup from '~/components/Common/ErrorPopup'
import DateRangeInputs from '~/components/FFXIV/DateRangeInputs'
import ImportSection from '~/components/FFXIV/ImportSection'
import PriceGroupsSection from '~/components/FFXIV/PriceGroupsSection'
import RequestPreview from '~/components/FFXIV/RequestPreview'
import type { ColumnList } from '~/components/types'
import ItemDetailsTable from '~/components/FFXIV/ItemDetailsTable'
import DeltaChartContainer from '~/components/WoW/DeltaChartContainer'
import DateRangeControls from '~/components/WoW/DateRangeControls'
import GroupSelector from '~/components/WoW/GroupSelector'
import PriceQuantityChartPopup from '~/components/Charts/PriceQuantityChartPopup'
import RequestDataSection from '~/components/FFXIV/RequestDataSection'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import ItemDataLink from '~/components/utilities/ItemDataLink'

// Define action data type
type ActionData =
  | { exception: string }
  | { data: WeeklyPriceGroupDeltaResponse }

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Weekly Price Group Delta Analysis',
    description:
      'FFXIV Price Group Analysis! View weekly price changes for investment opportunities!'
  }
}

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/ffxiv/weekly-price-group-delta'
  }
]

export const loader: LoaderFunction = () => {
  return json<FFXIVLoaderData>({
    region: 'NA'
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const region = formData.get('region') as string

  if (!region) {
    return json<ActionData>({
      exception: 'Region is required.'
    })
  }

  const startYear = Number.parseInt(formData.get('startYear') as string)
  const startMonth = Number.parseInt(formData.get('startMonth') as string)
  const startDay = Number.parseInt(formData.get('startDay') as string)
  const endYear = Number.parseInt(formData.get('endYear') as string)
  const endMonth = Number.parseInt(formData.get('endMonth') as string)
  const endDay = Number.parseInt(formData.get('endDay') as string)
  const hqOnly = formData.get('hq_only') === 'true'
  const priceSetting = formData.get('price_setting') as string
  const quantitySetting = formData.get('quantity_setting') as string
  const priceGroups = JSON.parse(formData.get('priceGroups') as string)

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
      const errorData = await response
        .json()
        .catch(() => ({ message: `Server responded with ${response}` }))
      throw new Error(
        errorData.message ||
          errorData.exception ||
          `Server responded with ${response}`
      )
    }

    const data = await response.json()
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from server')
    }

    if ('exception' in data) {
      return json<ActionData>({ exception: data.exception })
    }

    return json<ActionData>({ data })
  } catch (error) {
    return json<ActionData>({
      exception:
        error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}

const Index = () => {
  const { region: defaultRegion } = useLoaderData<FFXIVLoaderData>()
  const { darkmode } = useTypedSelector((state) => state.user)
  const transition = useNavigation()
  const actionData = useActionData<ActionData>()
  const [priceGroups, setPriceGroups] = useState<
    NonNullable<ImportData['price_groups']>
  >([])
  const [formError, setFormError] = useState<string | undefined>(undefined)
  const [startYear, setStartYear] = useState(2023)
  const [startMonth, setStartMonth] = useState(1)
  const [startDay, setStartDay] = useState(1)
  const [endYear, setEndYear] = useState(new Date().getFullYear())
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1)
  const [endDay, setEndDay] = useState(new Date().getDate())
  const [hqOnly, setHqOnly] = useState(false)
  const [priceSetting, setPriceSetting] = useState('median')
  const [quantitySetting, setQuantitySetting] = useState('quantitySold')
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [region, setRegion] = useState(defaultRegion)

  // Results state
  const [selectedGroup, setSelectedGroup] = useState<string>('All')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [minYAxis, setMinYAxis] = useState<number | null>(null)
  const [maxYAxis, setMaxYAxis] = useState<number | null>(null)
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({})
  const [visibilityFilter, setVisibilityFilter] = useState('')
  const [selectedItemForChart, setSelectedItemForChart] = useState<
    string | null
  >(null)

  const pageTitle = `Weekly Price Group Delta Analysis - ${region}`

  const handleImport = (data: ImportData) => {
    if (data.start_year) setStartYear(data.start_year)
    if (data.start_month) setStartMonth(data.start_month)
    if (data.start_day) setStartDay(data.start_day)
    if (data.end_year) setEndYear(data.end_year)
    if (data.end_month) setEndMonth(data.end_month)
    if (data.end_day) setEndDay(data.end_day)
    if (data.hq_only !== undefined) setHqOnly(data.hq_only)
    if (data.price_setting) setPriceSetting(data.price_setting)
    if (data.quantity_setting) setQuantitySetting(data.quantity_setting)
    if (data.price_groups) setPriceGroups(data.price_groups)
    if (data.region) {
      // Map the region codes to match the select options
      const regionMap: Record<string, string> = {
        Oceania: 'Oceania',
        'North America': 'NA',
        NA: 'NA',
        Europe: 'Europe',
        Japan: 'Japan'
      }
      setRegion(regionMap[data.region] || data.region)
    }
  }

  // Show error from action data
  const actionError =
    actionData && 'exception' in actionData ? actionData.exception : undefined

  useEffect(() => {
    if (actionError) {
      setFormError(actionError)
      setShowErrorPopup(true)
    }
  }, [actionError])

  // Show results if we have data and no errors
  if (actionData && 'data' in actionData) {
    // Get all unique timestamps across all groups
    const allTimestamps = Array.from(
      new Set(
        Object.values(actionData.data).flatMap((groupData) =>
          Object.keys(groupData.deltas)
        )
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
        Object.keys(actionData.data).forEach((groupName) => {
          newVisibleItems[groupName] = true
        })
        setVisibleItems(newVisibleItems)
        return
      }
      // For specific group view, show average and conditionally show items
      const newVisibleItems: Record<string, boolean> = {
        [`${selectedGroup} (Average)`]: true
      }
      const groupData = actionData.data[selectedGroup]
      const itemCount = Object.keys(groupData.item_data).length
      const defaultVisibility = itemCount <= 50

      Object.keys(groupData.item_data).forEach((itemId) => {
        newVisibleItems[groupData.item_names[itemId]] = defaultVisibility
      })
      setVisibleItems(newVisibleItems)
    }, [selectedGroup, actionData.data])

    // Only show item details if a specific group is selected
    const showItemDetails = selectedGroup !== 'All'
    const groupData = showItemDetails ? actionData.data[selectedGroup] : null

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
      {
        columnId: 'itemName',
        header: 'Item Name',
        accessor: ({ row }) => {
          if (!groupData) return null
          const itemName = groupData.item_names[row.itemID]
          return (
            <div
              className="max-w-[200px] whitespace-normal break-words"
              title={itemName}>
              {itemName}
            </div>
          )
        }
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
              <UniversalisBadgedLink
                link={`https://universalis.app/market/${row.itemID}`}
              />
              <span className="text-gray-400">|</span>
              <ItemDataLink link={`/queries/item-data/${row.itemID}`} />
            </div>
          )
        }
      },
      {
        columnId: 'delta',
        header: `Delta % (${formatTimestamp(selectedDate)})`,
        dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.delta,
        accessor: ({ row }) => {
          const data = getDataForTimestamp(row, selectedDate)
          return (
            <span
              className={
                data && data.delta > 0
                  ? 'text-green-500'
                  : data && data.delta < 0
                  ? 'text-red-500'
                  : ''
              }>
              {data ? `${data.delta.toFixed(2)}%` : 'N/A'}
            </span>
          )
        },
        sortUndefined: 'last'
      },
      {
        columnId: 'marketshare',
        header: `Market Share (${formatTimestamp(selectedDate)})`,
        dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.mrk,
        accessor: ({ row }) => {
          const data = getDataForTimestamp(row, selectedDate)
          return <span>{data ? data.mrk.toLocaleString() : 'N/A'}</span>
        },
        sortUndefined: 'last'
      },
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
        columnId: 'quantity',
        header: `Quantity (${formatTimestamp(selectedDate)})`,
        dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.q,
        accessor: ({ row }) => {
          const data = getDataForTimestamp(row, selectedDate)
          return <span>{data ? data.q.toLocaleString() : 'N/A'}</span>
        },
        sortUndefined: 'last'
      }
    ]

    return (
      <PageWrapper>
        <Title title={pageTitle} />
        <ContentContainer>
          <div className="space-y-4">
            {/* Back Button */}
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
              groups={Object.keys(actionData.data)}
              onGroupSelect={setSelectedGroup}
              darkMode={darkmode}
            />

            {/* Chart Container */}
            <DeltaChartContainer
              data={actionData.data}
              selectedGroup={selectedGroup}
              startDate={startDate}
              endDate={endDate}
              darkMode={darkmode}
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
                weeklyData={
                  groupData.item_data[selectedItemForChart].weekly_data
                }
                darkMode={darkmode}
                itemName={groupData.item_names[selectedItemForChart]}
              />
            )}

            {/* Request Data Section */}
            <RequestDataSection
              data={actionData.data}
              region={region}
              startDate={startDate}
              endDate={endDate}
              darkmode={darkmode}
              hqOnly={hqOnly}
              priceSetting={priceSetting}
              quantitySetting={quantitySetting}
            />
          </div>
        </ContentContainer>
      </PageWrapper>
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
          <ImportSection onImport={handleImport} />

          <DateRangeInputs
            startYear={startYear}
            startMonth={startMonth}
            startDay={startDay}
            endYear={endYear}
            endMonth={endMonth}
            endDay={endDay}
            onStartYearChange={setStartYear}
            onStartMonthChange={setStartMonth}
            onStartDayChange={setStartDay}
            onEndYearChange={setEndYear}
            onEndMonthChange={setEndMonth}
            onEndDayChange={setEndDay}
            onError={(err) => {
              setFormError(err)
              setShowErrorPopup(!!err)
            }}
          />

          <input type="hidden" name="endYear" value={endYear} />
          <input type="hidden" name="endMonth" value={endMonth} />
          <input type="hidden" name="endDay" value={endDay} />

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hq_only"
                  value="true"
                  checked={hqOnly}
                  onChange={(e) => setHqOnly(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-200">
                  HQ Only
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="regionSelect"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Region
                </label>
                <select
                  id="regionSelect"
                  name="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="NA">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Japan">Japan</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="priceSettingSelect"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Price Setting
                </label>
                <select
                  id="priceSettingSelect"
                  name="price_setting"
                  value={priceSetting}
                  onChange={(e) => setPriceSetting(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="median">Median</option>
                  <option value="average">Average</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="quantitySettingSelect"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Quantity Setting
                </label>
                <select
                  id="quantitySettingSelect"
                  name="quantity_setting"
                  value={quantitySetting}
                  onChange={(e) => setQuantitySetting(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="quantitySold">Quantity Sold</option>
                  <option value="salesAmount">Sales Amount</option>
                </select>
              </div>
            </div>
          </div>

          <PriceGroupsSection
            priceGroups={priceGroups}
            onPriceGroupsChange={setPriceGroups}
            onError={(err) => {
              setFormError(err)
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={transition.state === 'submitting'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
              {transition.state === 'submitting' ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </form>
      </SmallFormContainer>

      {formError && showErrorPopup && (
        <ErrorPopup
          error={formError}
          onClose={() => setShowErrorPopup(false)}
        />
      )}
    </PageWrapper>
  )
}

export default Index
