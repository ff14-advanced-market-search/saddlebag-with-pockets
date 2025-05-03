import { useState, useMemo } from 'react'
import type { ColumnList } from '~/components/types'
import type { ItemData } from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import type { Row, Getter } from '@tanstack/table-core'
import CSVButton from '~/components/utilities/CSVButton'
import JSONButton from '~/components/utilities/JSONButton'

interface ItemDetailsTableProps {
  data: ItemData[]
  columnList: Array<ColumnList<ItemData>>
  selectedDate: string
  formatTimestamp: (timestamp: string) => string
  selectedGroup: string
  setSelectedDate: (date: string) => void
  filteredTimestamps: string[]
  getDataForTimestamp: (
    itemData: ItemData,
    timestamp: string
  ) =>
    | {
        p: number
        q: number
        t: number
        delta: number
      }
    | undefined
}

export default function ItemDetailsTable({
  data,
  columnList,
  selectedDate,
  formatTimestamp,
  selectedGroup,
  setSelectedDate,
  filteredTimestamps,
  getDataForTimestamp
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
        : a[column.columnId as keyof ItemData]
      let bValue: any = column.dataAccessor
        ? column.dataAccessor(b)
        : b[column.columnId as keyof ItemData]

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
                  price: itemData?.p || 0,
                  quantity: itemData?.q || 0,
                  delta: itemData?.delta || 0,
                  historicPrice: item.historicPrice,
                  salesPerDay: item.salesPerDay,
                  marketshare: item.marketshare
                }
              })}
              columns={[
                { title: 'Item Name', value: 'itemName' },
                { title: 'Item ID', value: 'itemID' },
                {
                  title: `Price (${formatTimestamp(selectedDate)})`,
                  value: 'price'
                },
                {
                  title: `Quantity (${formatTimestamp(selectedDate)})`,
                  value: 'quantity'
                },
                {
                  title: `Delta % (${formatTimestamp(selectedDate)})`,
                  value: 'delta'
                }
              ]}
              filename={`${selectedGroup}_items_${formatTimestamp(
                selectedDate
              )}.csv`}
            />
            <JSONButton data={filteredAndSortedData} />
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {filteredTimestamps.map((timestamp) => (
                <option
                  key={timestamp}
                  value={timestamp}
                  className="dark:bg-gray-700">
                  {formatTimestamp(timestamp)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {columnList.map((column) => (
                  <th
                    key={column.columnId}
                    onClick={() => handleSort(column.columnId)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                    {column.header}
                    {sortColumn === column.columnId && (
                      <span className="ml-2">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedData.map((row, index) => (
                <tr key={index}>
                  {columnList.map((column) => (
                    <td
                      key={column.columnId}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {column.accessor
                        ? column.accessor({
                            row,
                            getValue: () => {
                              if (column.dataAccessor) {
                                return column.dataAccessor(row)
                              }
                              const value =
                                row[column.columnId as keyof ItemData]
                              if (
                                typeof value === 'string' ||
                                typeof value === 'number'
                              ) {
                                return value
                              }
                              return undefined
                            }
                          })
                        : String(row[column.columnId as keyof ItemData] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
