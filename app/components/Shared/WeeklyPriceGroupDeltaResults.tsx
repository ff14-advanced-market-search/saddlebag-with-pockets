import { useState, useEffect } from 'react'
import type {
  WeeklyPriceGroupDeltaResponse,
  ItemData
} from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import { PageWrapper, ContentContainer, Title } from '~/components/Common'
import type { ColumnList } from '~/components/types'
import ItemDetailsTable from '~/components/FFXIV/ItemDetailsTable'
import DeltaChartContainer from '~/components/WoW/DeltaChartContainer'
import DateRangeControls from '~/components/FFXIV/DateRangeControls'
import GroupSelector from '../WoW/GroupSelector'

interface ResultsProps {
  data: WeeklyPriceGroupDeltaResponse
  pageTitle: string
  darkMode: boolean
  backUrl: string
}

export default function WeeklyPriceGroupDeltaResults({
  data,
  pageTitle,
  darkMode,
  backUrl
}: ResultsProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('All')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [minYAxis, setMinYAxis] = useState<number | null>(null)
  const [maxYAxis, setMaxYAxis] = useState<number | null>(null)
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({})
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
    { columnId: 'itemID', header: 'Item ID' },
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
              href={backUrl}
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

          {/* Chart Container */}
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
        </div>
      </ContentContainer>
    </PageWrapper>
  )
}
