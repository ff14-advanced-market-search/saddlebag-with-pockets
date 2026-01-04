import { useState, useMemo } from 'react'
import type { ColumnList } from '~/components/types'
import type {
  GW2ItemData,
  GW2GroupData
} from '~/requests/GW2/WeeklyPriceGroupDelta'
import CSVButton from '~/components/utilities/CSVButton'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import FullTable from '~/components/Tables/FullTable'

interface ItemDetailsTableProps {
  data: GW2ItemData[]
  columnList: Array<ColumnList<GW2ItemData>>
  selectedDate: string
  formatTimestamp: (timestamp: string) => string
  selectedGroup: string
  setSelectedDate: (date: string) => void
  filteredTimestamps: string[]
  getDataForTimestamp: (
    itemData: GW2ItemData,
    timestamp: string
  ) => GW2ItemData['weekly_data'][0] | undefined
  groupData: GW2GroupData
  onItemSelect: (itemId: string) => void
}

export default function ItemDetailsTable({
  data,
  selectedDate,
  formatTimestamp,
  selectedGroup,
  setSelectedDate,
  filteredTimestamps,
  getDataForTimestamp,
  groupData,
  onItemSelect
}: ItemDetailsTableProps) {
  const [sortColumn, setSortColumn] = useState<string>('itemName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }

  // Table columns for item details
  const columnList: Array<ColumnList<GW2ItemData>> = [
    {
      columnId: 'itemName',
      header: 'Item Name',
      accessor: ({ row }) => {
        return (
          <div
            className="max-w-[200px] whitespace-normal break-words"
            title={row.itemName}>
            {row.itemName}
          </div>
        )
      }
    },
    {
      columnId: 'priceQuantity',
      header: 'Price vs Quantity',
      accessor: ({ row }) => {
        return (
          <button
            type="button"
            onClick={() => onItemSelect(row.itemID.toString())}
            className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-sm">
            Price vs Quantity
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
            <ItemDataLink link={`/gw2/item-data/${row.itemID}`} />
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
      columnId: 'value',
      header: `Value (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.value,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.value.toLocaleString() : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'price',
      header: `Price (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) =>
        getDataForTimestamp(row, selectedDate)?.price_average,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return (
          <span>
            {data
              ? data.price_average.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })
              : 'N/A'}
          </span>
        )
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'sold',
      header: `Sold (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.sold,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.sold.toLocaleString() : 'N/A'}</span>
      },
      sortUndefined: 'last'
    }
  ]

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const itemName = item.itemName.toLowerCase()
        return itemName.includes(query)
      })
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const column = columnList.find((col) => col.columnId === sortColumn)
      if (!column) return 0

      let aValue: any = column.dataAccessor
        ? column.dataAccessor(a)
        : a[column.columnId as keyof GW2ItemData]
      let bValue: any = column.dataAccessor
        ? column.dataAccessor(b)
        : b[column.columnId as keyof GW2ItemData]

      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return column.sortUndefined === 'first' ? -1 : 1
      if (bValue === undefined) return column.sortUndefined === 'first' ? 1 : -1

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, searchQuery, sortColumn, sortDirection, columnList])

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {selectedGroup} Details
            </h3>
            <CSVButton
              data={filteredAndSortedData.map((item) => {
                const itemData = getDataForTimestamp(item, selectedDate)
                return {
                  itemName: item.itemName,
                  itemID: item.itemID,
                  delta: itemData?.delta ?? 'N/A',
                  value: itemData?.value ?? 'N/A',
                  price: itemData?.price_average ?? 'N/A',
                  sold: itemData?.sold ?? 'N/A'
                }
              })}
              filename={`${selectedGroup}-${formatTimestamp(selectedDate)}.csv`}
            />
          </div>
        </div>

        {/* Date selector */}
        <div className="mb-4">
          <label
            htmlFor="dateSelect"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Select Date
          </label>
          <select
            id="dateSelect"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            {filteredTimestamps.map((timestamp) => (
              <option key={timestamp} value={timestamp}>
                {formatTimestamp(timestamp)}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Table */}
        <FullTable
          data={filteredAndSortedData}
          columnList={columnList}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </div>
  )
}
