import { useState, useMemo } from 'react'
import type {
  GW2ItemData,
  GW2GroupData
} from '~/requests/GW2/WeeklyPriceGroupDelta'
import CSVButton from '~/components/utilities/CSVButton'
import JSONDownloadButton from '~/components/utilities/JSONDownloadButton'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import FullTable, { type ColumnList } from '~/components/Tables/FullTable'

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
  const [searchQuery, setSearchQuery] = useState('')

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
    },
    {
      columnId: 'sell_sold',
      header: `Sell Sold (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.sell_sold,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.sell_sold.toLocaleString() : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'sell_price_avg',
      header: `Sell Price Avg (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) =>
        getDataForTimestamp(row, selectedDate)?.sell_price_avg,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return (
          <span>
            {data
              ? data.sell_price_avg.toLocaleString(undefined, {
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
      columnId: 'sell_value',
      header: `Sell Value (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.sell_value,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return (
          <span>
            {data
              ? data.sell_value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              : 'N/A'}
          </span>
        )
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'sell_delisted',
      header: `Sell Delisted (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) =>
        getDataForTimestamp(row, selectedDate)?.sell_delisted,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.sell_delisted.toLocaleString() : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'sell_listed',
      header: `Sell Listed (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) =>
        getDataForTimestamp(row, selectedDate)?.sell_listed,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.sell_listed.toLocaleString() : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'sell_quantity_avg',
      header: `Sell Quantity Avg (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) =>
        getDataForTimestamp(row, selectedDate)?.sell_quantity_avg,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return (
          <span>{data ? data.sell_quantity_avg.toLocaleString() : 'N/A'}</span>
        )
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'buy_sold',
      header: `Buy Sold (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.buy_sold,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.buy_sold.toLocaleString() : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'buy_price_avg',
      header: `Buy Price Avg (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) =>
        getDataForTimestamp(row, selectedDate)?.buy_price_avg,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return (
          <span>
            {data
              ? data.buy_price_avg.toLocaleString(undefined, {
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
      columnId: 'buy_value',
      header: `Buy Value (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.buy_value,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return (
          <span>
            {data
              ? data.buy_value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              : 'N/A'}
          </span>
        )
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'buy_delisted',
      header: `Buy Delisted (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) =>
        getDataForTimestamp(row, selectedDate)?.buy_delisted,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.buy_delisted.toLocaleString() : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'buy_listed',
      header: `Buy Listed (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.buy_listed,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.buy_listed.toLocaleString() : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'buy_quantity_avg',
      header: `Buy Quantity Avg (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) =>
        getDataForTimestamp(row, selectedDate)?.buy_quantity_avg,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return (
          <span>{data ? data.buy_quantity_avg.toLocaleString() : 'N/A'}</span>
        )
      },
      sortUndefined: 'last'
    }
  ]

  // Filter data (FullTable handles sorting internally)
  const filteredData = useMemo(() => {
    return [...data]
  }, [data])

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {selectedGroup} Details
            </h3>
            <CSVButton
              data={filteredData.map((item) => {
                const itemData = getDataForTimestamp(item, selectedDate)
                return {
                  itemName: item.itemName,
                  itemID: item.itemID,
                  delta: itemData?.delta ?? 0,
                  value: itemData?.value ?? 0,
                  price: itemData?.price_average ?? 0,
                  sold: itemData?.sold ?? 0,
                  sell_sold: itemData?.sell_sold ?? 0,
                  sell_price_avg: itemData?.sell_price_avg ?? 0,
                  sell_value: itemData?.sell_value ?? 0,
                  sell_delisted: itemData?.sell_delisted ?? 0,
                  sell_listed: itemData?.sell_listed ?? 0,
                  sell_quantity_avg: itemData?.sell_quantity_avg ?? 0,
                  buy_sold: itemData?.buy_sold ?? 0,
                  buy_price_avg: itemData?.buy_price_avg ?? 0,
                  buy_value: itemData?.buy_value ?? 0,
                  buy_delisted: itemData?.buy_delisted ?? 0,
                  buy_listed: itemData?.buy_listed ?? 0,
                  buy_quantity_avg: itemData?.buy_quantity_avg ?? 0
                }
              })}
              columns={[
                { title: 'Item Name', value: 'itemName' },
                { title: 'Item ID', value: 'itemID' },
                {
                  title: `Delta % (${formatTimestamp(selectedDate)})`,
                  value: 'delta'
                },
                {
                  title: `Value (${formatTimestamp(selectedDate)})`,
                  value: 'value'
                },
                {
                  title: `Price (${formatTimestamp(selectedDate)})`,
                  value: 'price'
                },
                {
                  title: `Sold (${formatTimestamp(selectedDate)})`,
                  value: 'sold'
                },
                {
                  title: `Sell Sold (${formatTimestamp(selectedDate)})`,
                  value: 'sell_sold'
                },
                {
                  title: `Sell Price Avg (${formatTimestamp(selectedDate)})`,
                  value: 'sell_price_avg'
                },
                {
                  title: `Sell Value (${formatTimestamp(selectedDate)})`,
                  value: 'sell_value'
                },
                {
                  title: `Sell Delisted (${formatTimestamp(selectedDate)})`,
                  value: 'sell_delisted'
                },
                {
                  title: `Sell Listed (${formatTimestamp(selectedDate)})`,
                  value: 'sell_listed'
                },
                {
                  title: `Sell Quantity Avg (${formatTimestamp(selectedDate)})`,
                  value: 'sell_quantity_avg'
                },
                {
                  title: `Buy Sold (${formatTimestamp(selectedDate)})`,
                  value: 'buy_sold'
                },
                {
                  title: `Buy Price Avg (${formatTimestamp(selectedDate)})`,
                  value: 'buy_price_avg'
                },
                {
                  title: `Buy Value (${formatTimestamp(selectedDate)})`,
                  value: 'buy_value'
                },
                {
                  title: `Buy Delisted (${formatTimestamp(selectedDate)})`,
                  value: 'buy_delisted'
                },
                {
                  title: `Buy Listed (${formatTimestamp(selectedDate)})`,
                  value: 'buy_listed'
                },
                {
                  title: `Buy Quantity Avg (${formatTimestamp(selectedDate)})`,
                  value: 'buy_quantity_avg'
                }
              ]}
              filename={`${selectedGroup}-${formatTimestamp(selectedDate)}.csv`}
            />
            <JSONDownloadButton
              data={filteredData.map((item) => {
                const itemData = getDataForTimestamp(item, selectedDate)
                return {
                  itemName: item.itemName,
                  itemID: item.itemID,
                  ...(itemData || {})
                }
              })}
              filename={`${selectedGroup}-${formatTimestamp(
                selectedDate
              )}.json`}
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
            className="w-48 p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
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
            className="w-48 p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Table */}
        <FullTable<GW2ItemData>
          data={filteredData}
          columnList={columnList}
          sortingOrder={[{ id: 'itemName' as keyof GW2ItemData, desc: false }]}
          globalFilter={searchQuery}
          setGlobalFilter={setSearchQuery}
        />
      </div>
    </div>
  )
}
