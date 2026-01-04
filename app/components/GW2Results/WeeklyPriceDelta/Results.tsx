import { Link } from '@remix-run/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PageWrapper, Title, ContentContainer } from '~/components/Common'
import DateRangeControls from '~/components/WoW/DateRangeControls'
import DeltaChartContainer from '~/components/WoW/DeltaChartContainer'
import GroupSelector from '~/components/WoW/GroupSelector'
import { useTypedSelector } from '~/redux/useTypedSelector'
import type { GW2ItemData } from '~/requests/GW2/WeeklyPriceGroupDelta'
import type { SuccessActionData } from '~/routes/gw2.weekly-price-group-delta'
import GW2PriceQuantityCharts from './GW2PriceQuantityCharts'
import ItemDetailsTable from './ItemDetailsTable'
import RequestDataSection from './RequestDataSection'

type ResultsProps = {
  actionData: SuccessActionData
  pageTitle: string
  backWithQuery: () => void
}

export const Results = ({
  actionData,
  pageTitle,
  backWithQuery
}: ResultsProps) => {
  const { darkmode } = useTypedSelector((state) => state.user)
  const [minYAxis, setMinYAxis] = useState<number | null>(null)
  const [maxYAxis, setMaxYAxis] = useState<number | null>(null)
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({})
  const [visibilityFilter, setVisibilityFilter] = useState('')
  const [selectedItemForChart, setSelectedItemForChart] = useState<
    string | null
  >(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string>('All')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // allTimestamps is derived from actionData using useMemo
  const allTimestamps = useMemo(() => {
    if (!(actionData && 'data' in actionData)) return []
    return Array.from(
      new Set(
        Object.values(actionData.data).flatMap((groupData) =>
          Object.keys(groupData.deltas)
        )
      )
    ).sort()
  }, [actionData])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTimestamps, selectedDate, startDate, endDate])

  const filteredTimestamps = allTimestamps.filter(
    (timestamp) => timestamp >= startDate && timestamp <= endDate
  )

  // Format timestamp into YYYY-MM-DD
  const formatTimestamp = (timestamp: string) => {
    // Validate input: must be non-empty string of digits
    if (
      !timestamp ||
      typeof timestamp !== 'string' ||
      !/^\d+$/.test(timestamp)
    ) {
      return ''
    }

    // Ensure at least 8 digits (YYYYMMDD)
    const dateStr = timestamp.padStart(8, '0')
    if (dateStr.length < 8) {
      return ''
    }

    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)

    // Validate date components are valid
    const yearNum = Number.parseInt(year, 10)
    const monthNum = Number.parseInt(month, 10)
    const dayNum = Number.parseInt(day, 10)

    if (
      Number.isNaN(yearNum) ||
      Number.isNaN(monthNum) ||
      Number.isNaN(dayNum) ||
      monthNum < 1 ||
      monthNum > 12 ||
      dayNum < 1 ||
      dayNum > 31
    ) {
      return ''
    }

    return `${year}-${month}-${day}`
  }

  // Update visibleItems when selectedGroup or actionData changes
  useEffect(() => {
    if (!(actionData && 'data' in actionData)) return
    if (selectedGroup === 'All') {
      const newVisibleItems: Record<string, boolean> = {}
      Object.keys(actionData.data).forEach((groupName) => {
        newVisibleItems[groupName] = true
      })
      setVisibleItems(newVisibleItems)
      return
    }
    const newVisibleItems: Record<string, boolean> = {
      [`${selectedGroup} (Average)`]: true
    }
    const groupData = actionData.data[selectedGroup]
    if (!groupData) return
    const itemCount = Object.keys(groupData.item_data).length
    const defaultVisibility = itemCount <= 50
    Object.keys(groupData.item_data).forEach((itemId) => {
      newVisibleItems[groupData.item_names[itemId]] = defaultVisibility
    })
    setVisibleItems(newVisibleItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData, selectedGroup])

  // Only show item details if a specific group is selected
  const showItemDetails = selectedGroup !== 'All'
  const groupData = showItemDetails ? actionData.data[selectedGroup] : null

  // Helper function to get data for a specific timestamp
  const getDataForTimestamp = (itemData: GW2ItemData, timestamp: string) => {
    return itemData.weekly_data.find((d) => d.time.toString() === timestamp)
  }

  // Close modal on Escape key and manage focus
  useEffect(() => {
    if (!selectedItemForChart) {
      // Restore focus when modal closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
        previousFocusRef.current = null
      }
      return
    }

    // Store the previously focused element
    previousFocusRef.current = (document.activeElement as HTMLElement) || null

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItemForChart(null)
      }
    }

    document.addEventListener('keydown', handleEscape)

    // Focus the modal container when it opens
    if (modalRef.current) {
      modalRef.current.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [selectedItemForChart])

  // Convert GW2 data to format expected by DeltaChartContainer
  const convertedData = useMemo(() => {
    const result: Record<
      string,
      {
        deltas: Record<string, number>
        item_names: Record<string, string>
        item_data: Record<
          string,
          {
            itemID: number
            weekly_data: Array<{
              p: number
              q: number
              t: number
              mrk: number
              delta: number
            }>
          }
        >
      }
    > = {}

    Object.entries(actionData.data).forEach(([groupName, groupData]) => {
      const convertedItemData: Record<
        string,
        {
          itemID: number
          weekly_data: Array<{
            p: number
            q: number
            t: number
            mrk: number
            delta: number
          }>
        }
      > = {}

      Object.entries(groupData.item_data).forEach(([itemId, itemData]) => {
        convertedItemData[itemId] = {
          itemID: itemData.itemID,
          weekly_data: itemData.weekly_data.map((d) => ({
            p: d.price_average,
            q: d.sold,
            t: d.time,
            mrk: d.value,
            delta: d.delta
          }))
        }
      })

      result[groupName] = {
        deltas: groupData.deltas,
        item_names: groupData.item_names,
        item_data: convertedItemData
      }
    })

    return result
  }, [actionData.data])

  return (
    <PageWrapper>
      <Title title={pageTitle} />
      <ContentContainer>
        <div className="space-y-4">
          {/* Back Buttons */}
          <div className="flex gap-2 mb-2">
            <Link
              to="/gw2/weekly-price-group-delta"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
              ← Search Again
            </Link>
            <Link
              to="/gw2/weekly-price-group-delta-recommended"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
              ← See Recommended Searches
            </Link>
            <button
              type="button"
              onClick={backWithQuery}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
              ← Search Again with this query
            </button>
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
            data={convertedData}
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
              selectedDate={selectedDate}
              formatTimestamp={formatTimestamp}
              selectedGroup={selectedGroup}
              setSelectedDate={setSelectedDate}
              filteredTimestamps={filteredTimestamps}
              getDataForTimestamp={getDataForTimestamp}
              groupData={groupData}
              onItemSelect={setSelectedItemForChart}
            />
          )}

          {/* Price vs Quantity Chart Popup */}
          {selectedItemForChart && groupData && (
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              tabIndex={-1}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3
                    id="modal-title"
                    className={`text-lg font-medium ${
                      darkmode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                    Price & Quantity Analysis -{' '}
                    {groupData.item_names[selectedItemForChart]}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedItemForChart(null)}
                    aria-label="Close price and quantity analysis"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    ✕
                  </button>
                </div>

                <div className="mt-4">
                  <GW2PriceQuantityCharts
                    weeklyData={
                      groupData.item_data[selectedItemForChart].weekly_data
                    }
                    darkMode={darkmode}
                    itemName={groupData.item_names[selectedItemForChart]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Request Data Section */}
          <RequestDataSection
            data={actionData.data}
            startDate={startDate}
            endDate={endDate}
            darkmode={darkmode}
            minimumValue={actionData.request?.minimum_value ?? 100000000}
            minimumSales={actionData.request?.minimum_sales ?? 0}
            minimumAveragePrice={actionData.request?.minimum_average_price ?? 0}
          />
        </div>
      </ContentContainer>
    </PageWrapper>
  )
}
