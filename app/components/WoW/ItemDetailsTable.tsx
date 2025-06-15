import { useState } from 'react'
import type { ColumnList } from '~/components/types'
import type { ItemData } from '~/requests/WoW/WeeklyPriceGroupDelta'
import FullTable from '~/components/Tables/FullTable'
import MobileDeltaTable from '~/components/WoWResults/FullScan/MobileDeltaTable'
import DebouncedInput from '~/components/Common/DebouncedInput'
import CSVButton from '~/components/utilities/CSVButton'
import JSONDownloadButton from '~/components/utilities/JSONDownloadButton'

interface ItemDetailsTableProps {
  data: ItemData[]
  columnList: Array<ColumnList<ItemData>>
  selectedDate: string
  formatTimestamp: (timestamp: string) => string
  selectedGroup: string
  setSelectedDate: (date: string) => void
  filteredTimestamps: string[]
  getDataForTimestamp: (
    item: ItemData,
    timestamp: string
  ) => { p?: number; delta?: number } | undefined
}

/**
 * Displays a responsive, filterable, and exportable table of item details with date selection.
 *
 * Renders item data in a table format with options to filter by search term, select a date, and export the displayed data as CSV or JSON. The table adapts for desktop and mobile screens and includes dynamic columns for price and delta based on the selected date.
 *
 * @param data - Array of item data objects to display.
 * @param columnList - Configuration for table columns.
 * @param selectedDate - Currently selected date string for filtering and export.
 * @param formatTimestamp - Function to format timestamp strings for display.
 * @param selectedGroup - Name of the currently selected group, used in export filenames.
 * @param setSelectedDate - Callback to update the selected date.
 * @param filteredTimestamps - List of available timestamps for selection.
 * @param getDataForTimestamp - Function to retrieve price and delta for a given item and timestamp.
 */
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
  const [globalFilter, setGlobalFilter] = useState('')

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Item Details
        </h3>
        {/* Export buttons */}
        <div className="flex gap-2 mt-4">
          <CSVButton
            data={data.map((item) => {
              const itemData = getDataForTimestamp(item, selectedDate)
              return {
                ...item,
                price: itemData?.p || 0,
                delta: itemData?.delta || 0
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
                title: `Delta % (${formatTimestamp(selectedDate)})`,
                value: 'delta'
              }
            ]}
            filename={`${selectedGroup}_items_${formatTimestamp(
              selectedDate
            )}.csv`}
          />
          <JSONDownloadButton
            data={data}
            filename={`${selectedGroup}_items.json`}
          />
        </div>
        <DebouncedInput
          onDebouncedChange={setGlobalFilter}
          className="p-2 border rounded min-w-[200px]"
          placeholder="Search items..."
        />
        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
            {filteredTimestamps.map((timestamp) => (
              <option key={timestamp} value={timestamp}>
                {formatTimestamp(timestamp)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="hidden md:block">
        <FullTable
          data={data}
          columnList={columnList}
          globalFilter={globalFilter}
          sortingOrder={[]}
        />
      </div>
      <div className="md:hidden">
        <MobileDeltaTable
          data={data}
          columnList={columnList}
          sortingOrder={[{ id: 'itemName', desc: false }]}
          title="Item Details"
          columnSelectOptions={columnList.map((col) => col.columnId)}
        />
      </div>
    </div>
  )
}
