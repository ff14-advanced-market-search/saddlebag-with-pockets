import { useEffect, useMemo, useState } from 'react'
import PriceQuantityChartPopup from '~/components/Charts/PriceQuantityChartPopup'
import { PageWrapper, Title, ContentContainer } from '~/components/Common'
import ItemDetailsTable from '~/components/FFXIV/ItemDetailsTable'
import RequestDataSection from '~/components/FFXIV/RequestDataSection'
import type { ColumnList } from '~/components/types'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import DateRangeControls from '~/components/WoW/DateRangeControls'
import DeltaChartContainer from '~/components/WoW/DeltaChartContainer'
import GroupSelector from '~/components/WoW/GroupSelector'
import { useTypedSelector } from '~/redux/useTypedSelector'
import type { ItemData } from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import type { SuccessActionData } from '~/routes/ffxiv.weekly-price-group-delta'

type ResultsProps = {
  actionData: SuccessActionData
  pageTitle: string
  region: string
  backWithQuery: () => void
}

export const Results = ({
  actionData,
  pageTitle,
  region,
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
    const dateStr = timestamp.padStart(8, '0') // Ensure 8 digits
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
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
          {/* Back Buttons */}
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() =>
                (window.location.href = '/ffxiv/weekly-price-group-delta')
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
              ← Search Again
            </button>
            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  '/ffxiv/weekly-price-group-delta-recommended')
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
              ← See Recommended Searches
            </button>
            {/* TODO FIX: this search again is bugged and doesnt always trigger the search with the new values */}
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
              weeklyData={groupData.item_data[selectedItemForChart].weekly_data}
              darkMode={darkmode}
              itemName={groupData.item_names[selectedItemForChart]}
            />
          )}

          {/* Request Data Section */}
          <RequestDataSection
            data={actionData.data}
            region={actionData.request?.region ?? region}
            startDate={startDate}
            endDate={endDate}
            darkmode={darkmode}
            hqOnly={actionData.request?.hq_only ?? false}
            priceSetting={actionData.request?.price_setting ?? 'median'}
            quantitySetting={
              actionData.request?.quantity_setting ?? 'quantitySold'
            }
          />
        </div>
      </ContentContainer>
    </PageWrapper>
  )
}
