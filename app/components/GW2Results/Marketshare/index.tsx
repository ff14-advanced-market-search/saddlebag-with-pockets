import { ContentContainer, Title } from '~/components/Common'
import type {
  GW2MarketshareItem,
  GW2MarketshareSortBy
} from '~/requests/GW2/marketshare'
import TreemapChart from '~/components/Charts/Treemap'
import type { TreemapNode } from '~/components/Charts/Treemap'
import { useState, useMemo } from 'react'
import Label from '~/components/form/Label'
import type { ColumnList } from '~/components/Tables/FullTable'
import FullTable from '~/components/Tables/FullTable'
import CSVButton from '~/components/utilities/CSVButton'
import DebouncedInput from '~/components/Common/DebouncedInput'
import MobileTable from '~/components/WoWResults/FullScan/MobileTable'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import { RadioButtons } from '~/components/Common/RadioButtons'
import { TabbedButtons } from '~/components/Common/TabbedButtons'

export const SortBySelect = ({
  label = 'Sort Results By',
  onChange,
  defaultValue = 'value',
  value
}: {
  label?: string
  onChange?: (value: GW2MarketshareSortBy) => void
  defaultValue?: GW2MarketshareSortBy
  value?: GW2MarketshareSortBy
}) => (
  <div className="mt-2">
    <Label htmlFor="sort_by">{label}</Label>
    <select
      name="sort_by"
      value={value !== undefined ? value : defaultValue}
      onChange={(event) => {
        if (onChange) {
          const newValue = event.target.value
          const validSortByOptions = sortByOptions.map(({ value }) => value)

          const option = validSortByOptions.find((opt) => opt === newValue)

          if (option) {
            onChange(option)
          }
        }
      }}
      className="flex-1 min-w-0 block w-full px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400">
      {sortByOptions.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </div>
)

export const sortByOptions: Array<{
  label: string
  value: GW2MarketshareSortBy
}> = [
  { label: 'Value', value: 'value' },
  { label: 'Historic Value', value: 'historic_value' },
  { label: 'Sold', value: 'sold' },
  { label: 'Historic Sold', value: 'historic_sold' },
  { label: 'Price Average', value: 'price_average' },
  { label: 'Historic Price Average', value: 'historic_price_average' },
  { label: 'Price Percent Change', value: 'pricePercentChange' },
  { label: 'Sold Percent Change', value: 'soldPercentChange' },
  { label: 'Value Percent Change', value: 'valuePercentChange' },
  { label: 'Sell Quantity Percent Change', value: 'sellQuantityPercentChange' },
  { label: 'Buy Quantity Percent Change', value: 'buyQuantityPercentChange' }
]

const csvColumns: Array<{ title: string; value: keyof GW2MarketshareItem }> = [
  { title: 'Item ID', value: 'itemID' },
  { title: 'Item Name', value: 'itemName' },
  { title: 'State', value: 'state' },
  { title: 'Price Average', value: 'price_average' },
  { title: 'Historic Price Average', value: 'historic_price_average' },
  { title: 'Price Percent Change', value: 'pricePercentChange' },
  { title: 'Sold', value: 'sold' },
  { title: 'Historic Sold', value: 'historic_sold' },
  { title: 'Sold Percent Change', value: 'soldPercentChange' },
  { title: 'Value', value: 'value' },
  { title: 'Historic Value', value: 'historic_value' },
  { title: 'Value Percent Change', value: 'valuePercentChange' },
  { title: 'Current Sell Price', value: 'current_sell_price' },
  { title: 'Current Sell Quantity', value: 'current_sell_quantity' },
  { title: 'Current Buy Price', value: 'current_buy_price' },
  { title: 'Current Buy Quantity', value: 'current_buy_quantity' },
  { title: 'Type', value: 'type' },
  { title: 'Details Type', value: 'details_type' },
  { title: 'Rarity', value: 'rarity' },
  { title: 'Level', value: 'level' },
  { title: 'Sell Sold', value: 'sell_sold' },
  { title: 'Sell Price Avg', value: 'sell_price_avg' },
  { title: 'Sell Value', value: 'sell_value' },
  { title: 'Sell Delisted', value: 'sell_delisted' },
  { title: 'Sell Listed', value: 'sell_listed' },
  { title: 'Sell Price Max', value: 'sell_price_max' },
  { title: 'Sell Price Min', value: 'sell_price_min' },
  { title: 'Sell Price StDev', value: 'sell_price_stdev' },
  { title: 'Sell Quantity Avg', value: 'sell_quantity_avg' },
  { title: 'Historic Sell Quantity Avg', value: 'historic_sell_quantity_avg' },
  { title: 'Sell Quantity Percent Change', value: 'sellQuantityPercentChange' },
  { title: 'Sell Quantity Max', value: 'sell_quantity_max' },
  { title: 'Sell Quantity Min', value: 'sell_quantity_min' },
  { title: 'Sell Quantity StDev', value: 'sell_quantity_stdev' },
  { title: 'Buy Sold', value: 'buy_sold' },
  { title: 'Buy Price Avg', value: 'buy_price_avg' },
  { title: 'Buy Value', value: 'buy_value' },
  { title: 'Buy Delisted', value: 'buy_delisted' },
  { title: 'Buy Listed', value: 'buy_listed' },
  { title: 'Buy Price Max', value: 'buy_price_max' },
  { title: 'Buy Price Min', value: 'buy_price_min' },
  { title: 'Buy Price StDev', value: 'buy_price_stdev' },
  { title: 'Buy Quantity Avg', value: 'buy_quantity_avg' },
  { title: 'Historic Buy Quantity Avg', value: 'historic_buy_quantity_avg' },
  { title: 'Buy Quantity Percent Change', value: 'buyQuantityPercentChange' },
  { title: 'Buy Quantity Max', value: 'buy_quantity_max' },
  { title: 'Buy Quantity Min', value: 'buy_quantity_min' },
  { title: 'Buy Quantity StDev', value: 'buy_quantity_stdev' },
  { title: 'Count', value: 'count' },
  { title: 'Stats Date', value: 'statsDate' },
  { title: 'Historic Stats Date Cutoff', value: 'historicStatsDateCutoff' }
]

const hexMap: Record<string, string> = {
  crashing: '#b40606',
  decreasing: '#d88888',
  stable: '#ccbb00',
  increasing: '#81AC6D',
  spiking: '#24b406'
}

// Helper to check if a sortBy is a percent change type
const isPercentChangeSort = (
  sortBy: GW2MarketshareSortBy
): sortBy is
  | 'pricePercentChange'
  | 'soldPercentChange'
  | 'valuePercentChange'
  | 'sellQuantityPercentChange'
  | 'buyQuantityPercentChange' => {
  return [
    'pricePercentChange',
    'soldPercentChange',
    'valuePercentChange',
    'sellQuantityPercentChange',
    'buyQuantityPercentChange'
  ].includes(sortBy)
}

// Helper to get the percent change value for a given sortBy
const getPercentChangeValue = (
  item: GW2MarketshareItem,
  sortBy:
    | 'pricePercentChange'
    | 'soldPercentChange'
    | 'valuePercentChange'
    | 'sellQuantityPercentChange'
    | 'buyQuantityPercentChange'
): number => {
  switch (sortBy) {
    case 'pricePercentChange':
      return item.pricePercentChange
    case 'soldPercentChange':
      return item.soldPercentChange
    case 'valuePercentChange':
      return item.valuePercentChange
    case 'sellQuantityPercentChange':
      return item.sellQuantityPercentChange
    case 'buyQuantityPercentChange':
      return item.buyQuantityPercentChange
  }
}

const getChartData = (
  data: Array<GW2MarketshareItem>,
  sortBy: GW2MarketshareSortBy,
  useHistoric: boolean,
  colorBy: 'value' | 'sold' | 'price',
  filterDirection?: 'positive' | 'negative'
): Array<TreemapNode> => {
  const result: Array<TreemapNode> = []

  data.forEach((item) => {
    let value: number
    let color: string

    // For percent change sorts, filter by direction if specified
    if (isPercentChangeSort(sortBy) && filterDirection) {
      const percentChange = getPercentChangeValue(item, sortBy)
      if (filterDirection === 'positive' && percentChange <= 0) return
      if (filterDirection === 'negative' && percentChange >= 0) return
    }

    // Determine the value based on sortBy and useHistoric
    switch (sortBy) {
      case 'value':
        value = useHistoric ? item.historic_value : item.value
        break
      case 'historic_value':
        value = item.historic_value
        break
      case 'sold':
        value = useHistoric ? item.historic_sold : item.sold
        break
      case 'historic_sold':
        value = item.historic_sold
        break
      case 'price_average':
        value = useHistoric ? item.historic_price_average : item.price_average
        break
      case 'historic_price_average':
        value = item.historic_price_average
        break
      case 'pricePercentChange':
        // For negative values, use Math.abs() to make them positive for treemap
        const priceChange = item.pricePercentChange
        value = priceChange < 0 ? Math.abs(priceChange) : priceChange
        break
      case 'soldPercentChange':
        const soldChange = item.soldPercentChange
        value = soldChange < 0 ? Math.abs(soldChange) : soldChange
        break
      case 'valuePercentChange':
        const valueChange = item.valuePercentChange
        value = valueChange < 0 ? Math.abs(valueChange) : valueChange
        break
      case 'sellQuantityPercentChange':
        const sellQtyChange = item.sellQuantityPercentChange
        value = sellQtyChange < 0 ? Math.abs(sellQtyChange) : sellQtyChange
        break
      case 'buyQuantityPercentChange':
        const buyQtyChange = item.buyQuantityPercentChange
        value = buyQtyChange < 0 ? Math.abs(buyQtyChange) : buyQtyChange
        break
      default:
        value = useHistoric ? item.historic_value : item.value
    }

    // Determine color based on colorBy
    if (colorBy === 'price') {
      // Use price-based state - calculate percent change for price
      const priceChange = item.pricePercentChange
      if (priceChange > 20) {
        color = hexMap['spiking']
      } else if (priceChange > 5) {
        color = hexMap['increasing']
      } else if (priceChange > -5) {
        color = hexMap['stable']
      } else if (priceChange > -20) {
        color = hexMap['decreasing']
      } else {
        color = hexMap['crashing']
      }
    } else if (colorBy === 'sold') {
      // Use sold-based state - calculate percent change for sold
      const soldChange = item.soldPercentChange
      if (soldChange > 20) {
        color = hexMap['spiking']
      } else if (soldChange > 5) {
        color = hexMap['increasing']
      } else if (soldChange > -5) {
        color = hexMap['stable']
      } else if (soldChange > -20) {
        color = hexMap['decreasing']
      } else {
        color = hexMap['crashing']
      }
    } else {
      // Use value-based state
      color = hexMap[item.state] || hexMap['stable']
    }

    result.push({
      id: item.itemID.toString(),
      name: item.itemName,
      value,
      color,
      toolTip: `${item.itemName}: ${value.toLocaleString()}`
    })
  })

  return result
}

const getMobileColumns = (sortBy: GW2MarketshareSortBy) => {
  const sortByName = sortByOptions.find(({ value }) => value === sortBy)
  return [
    { header: 'Item Name', columnId: 'itemName' },
    { header: sortByName?.label || 'Value', columnId: sortBy }
  ]
}

const columnList: Array<ColumnList<GW2MarketshareItem>> = [
  { columnId: 'itemName', header: 'Item Name' },
  {
    columnId: 'itemID',
    header: 'Item Data',
    accessor: ({ row }) => (
      <ItemDataLink link={`/gw2/item-data/${row.itemID}`} />
    )
  },
  { columnId: 'value', header: 'Value' },
  { columnId: 'historic_value', header: 'Historic Value' },
  {
    columnId: 'valuePercentChange',
    header: 'Value Percent Change',
    accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
  },
  { columnId: 'sold', header: 'Sold' },
  { columnId: 'historic_sold', header: 'Historic Sold' },
  {
    columnId: 'soldPercentChange',
    header: 'Sold Percent Change',
    accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
  },
  { columnId: 'price_average', header: 'Price Average' },
  { columnId: 'historic_price_average', header: 'Historic Price Average' },
  {
    columnId: 'pricePercentChange',
    header: 'Price Percent Change',
    accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
  },
  {
    columnId: 'state',
    header: 'Market State'
  },
  { columnId: 'current_sell_price', header: 'Current Sell Price' },
  { columnId: 'current_sell_quantity', header: 'Current Sell Quantity' },
  { columnId: 'current_buy_price', header: 'Current Buy Price' },
  { columnId: 'current_buy_quantity', header: 'Current Buy Quantity' },
  { columnId: 'type', header: 'Type' },
  { columnId: 'details_type', header: 'Details Type' },
  { columnId: 'rarity', header: 'Rarity' },
  { columnId: 'level', header: 'Level' },
  { columnId: 'sell_sold', header: 'Sell Sold' },
  { columnId: 'sell_price_avg', header: 'Sell Price Avg' },
  { columnId: 'sell_value', header: 'Sell Value' },
  { columnId: 'sell_delisted', header: 'Sell Delisted' },
  { columnId: 'sell_listed', header: 'Sell Listed' },
  { columnId: 'sell_price_max', header: 'Sell Price Max' },
  { columnId: 'sell_price_min', header: 'Sell Price Min' },
  { columnId: 'sell_price_stdev', header: 'Sell Price StDev' },
  { columnId: 'sell_quantity_avg', header: 'Sell Quantity Avg' },
  {
    columnId: 'historic_sell_quantity_avg',
    header: 'Historic Sell Quantity Avg'
  },
  {
    columnId: 'sellQuantityPercentChange',
    header: 'Sell Quantity Percent Change',
    accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
  },
  { columnId: 'sell_quantity_max', header: 'Sell Quantity Max' },
  { columnId: 'sell_quantity_min', header: 'Sell Quantity Min' },
  { columnId: 'sell_quantity_stdev', header: 'Sell Quantity StDev' },
  { columnId: 'buy_sold', header: 'Buy Sold' },
  { columnId: 'buy_price_avg', header: 'Buy Price Avg' },
  { columnId: 'buy_value', header: 'Buy Value' },
  { columnId: 'buy_delisted', header: 'Buy Delisted' },
  { columnId: 'buy_listed', header: 'Buy Listed' },
  { columnId: 'buy_price_max', header: 'Buy Price Max' },
  { columnId: 'buy_price_min', header: 'Buy Price Min' },
  { columnId: 'buy_price_stdev', header: 'Buy Price StDev' },
  { columnId: 'buy_quantity_avg', header: 'Buy Quantity Avg' },
  {
    columnId: 'historic_buy_quantity_avg',
    header: 'Historic Buy Quantity Avg'
  },
  {
    columnId: 'buyQuantityPercentChange',
    header: 'Buy Quantity Percent Change',
    accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
  },
  { columnId: 'buy_quantity_max', header: 'Buy Quantity Max' },
  { columnId: 'buy_quantity_min', header: 'Buy Quantity Min' },
  { columnId: 'buy_quantity_stdev', header: 'Buy Quantity StDev' },
  { columnId: 'count', header: 'Count' },
  {
    columnId: 'statsDate',
    header: 'Stats Date',
    accessor: ({ getValue }) => {
      const value = getValue()
      if (typeof value === 'string') {
        return <p>{value}</p>
      }
      return <p>{String(value)}</p>
    }
  },
  {
    columnId: 'historicStatsDateCutoff',
    header: 'Historic Stats Date Cutoff',
    accessor: ({ getValue }) => {
      const value = getValue()
      if (typeof value === 'string') {
        return <p>{value}</p>
      }
      return <p>{String(value)}</p>
    }
  }
]

const assertIsSortBy = (value: string): value is GW2MarketshareSortBy => {
  return sortByOptions.some((option) => option.value === value)
}

export const Results = ({
  data,
  pageTitle,
  darkmode,
  sortByValue
}: {
  data: Array<GW2MarketshareItem>
  pageTitle?: string
  darkmode: boolean
  sortByValue: GW2MarketshareSortBy
}) => {
  const [sortBy, setSortBy] = useState<GW2MarketshareSortBy>(sortByValue)
  const [globalFilter, setGlobalFilter] = useState('')
  const [colorBy, setColorBy] = useState<'value' | 'sold' | 'price'>('price')
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    () => new Set(columnList.map((col) => col.columnId))
  )
  const [showColumnControls, setShowColumnControls] = useState(false)

  // Determine if we should use historic based on the sortBy selection
  const useHistoric =
    sortBy === 'historic_value' ||
    sortBy === 'historic_sold' ||
    sortBy === 'historic_price_average'

  // For percent change sorts, create two separate charts (increases and decreases)
  const isPercentChange = isPercentChangeSort(sortBy)

  const chartDataIncreases = useMemo(
    () =>
      isPercentChange
        ? getChartData(data, sortBy, useHistoric, colorBy, 'positive')
        : getChartData(data, sortBy, useHistoric, colorBy),
    [data, sortBy, useHistoric, colorBy, isPercentChange]
  )

  const chartDataDecreases = useMemo(
    () =>
      isPercentChange
        ? getChartData(data, sortBy, useHistoric, colorBy, 'negative')
        : [],
    [data, sortBy, useHistoric, colorBy, isPercentChange]
  )

  const sortByTitleValue = sortByOptions.find(
    ({ value }) => value === sortBy
  )?.label

  const chartTitle = sortByTitleValue
    ? `Marketshare Overview - ${sortByTitleValue}`
    : 'Marketshare Overview'

  const mobileColumnList = getMobileColumns(sortBy)

  // For sell quantity percent change, sort ascending (smallest first), otherwise descending
  const sortDesc = sortBy !== 'sellQuantityPercentChange'

  const colorOptions = [
    { label: 'Value', value: 'value' },
    { label: 'Sold', value: 'sold' },
    { label: 'Price', value: 'price' }
  ]

  return (
    <>
      {pageTitle && <Title title={pageTitle} />}
      <ContentContainer>
        <>
          <Title title={chartTitle} />
          <TabbedButtons
            currentValue={sortBy}
            onClick={(value) => {
              if (assertIsSortBy(value)) setSortBy(value)
            }}
            options={sortByOptions}
          />
          <div className="md:hidden py-2">
            <Label>Sort By</Label>
            <select
              className="w-full p-2 rounded-md"
              value={sortBy}
              onChange={(e) => {
                const value = e.target.value
                if (assertIsSortBy(value)) setSortBy(value)
              }}>
              {sortByOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {isPercentChange ? (
            <>
              <Title title={`${chartTitle} - Increases`} />
              <TreemapChart
                chartData={chartDataIncreases}
                darkMode={darkmode}
                backgroundColor={darkmode ? '#1f2937' : '#f3f4f6'}
              />
              <div className="mt-6">
                <Title title={`${chartTitle} - Decreases`} />
                <TreemapChart
                  chartData={chartDataDecreases}
                  darkMode={darkmode}
                  backgroundColor={darkmode ? '#1f2937' : '#f3f4f6'}
                />
              </div>
            </>
          ) : (
            <TreemapChart
              chartData={chartDataIncreases}
              darkMode={darkmode}
              backgroundColor={darkmode ? '#1f2937' : '#f3f4f6'}
            />
          )}

          <RadioButtons
            title="Color Visualisation"
            name="chartColor"
            radioOptions={colorOptions}
            defaultChecked={colorBy}
            onChange={(value) => {
              if (value === 'value' || value === 'sold' || value === 'price') {
                setColorBy(value)
              }
            }}
          />
        </>
      </ContentContainer>
      <div className="my-2 flex justify-between items-center flex-wrap gap-2">
        <CSVButton
          filename="saddlebag-gw2-marketshare.csv"
          data={data}
          columns={csvColumns}
        />
        <button
          type="button"
          onClick={() => setShowColumnControls(!showColumnControls)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium text-sm">
          {showColumnControls ? 'Hide' : 'Show'} Column Controls
        </button>
        <DebouncedInput
          onDebouncedChange={(value) => {
            setGlobalFilter(value)
          }}
          className={'hidden sm:block p-2 rounded-md'}
          placeholder={'Search...'}
        />
      </div>
      {showColumnControls && (
        <div className="my-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Column Visibility
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
            {columnList.map((col) => (
              <label
                key={col.columnId}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
                <input
                  type="checkbox"
                  checked={visibleColumns.has(col.columnId)}
                  onChange={(e) => {
                    const newVisibleColumns = new Set(visibleColumns)
                    if (e.target.checked) {
                      newVisibleColumns.add(col.columnId)
                    } else {
                      newVisibleColumns.delete(col.columnId)
                    }
                    setVisibleColumns(newVisibleColumns)
                  }}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {col.header}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setVisibleColumns(
                  new Set(columnList.map((col) => col.columnId))
                )
              }}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm">
              Show All
            </button>
            <button
              type="button"
              onClick={() => {
                // Keep only essential columns visible
                const essentialColumns = [
                  'itemName',
                  'itemID',
                  sortBy,
                  'value',
                  'sold',
                  'price_average',
                  'current_sell_price',
                  'current_buy_price'
                ]
                setVisibleColumns(new Set(essentialColumns))
              }}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm">
              Show Essential Only
            </button>
            <button
              type="button"
              onClick={() => {
                setVisibleColumns(new Set())
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
              Hide All
            </button>
          </div>
        </div>
      )}
      <div className="py-2 sm:py-5">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-blue-600 p-2 shadow-lg sm:p-3">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex w-0 flex-1 items-center">
                <span className="flex rounded-lg bg-blue-800 p-2">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </span>
                <p className="ml-3 truncate font-medium text-white flex flex-1 flex-col">
                  <span className="md:hidden">This is a wide table!</span>
                  <span className="hidden md:inline">
                    Heads up, this table is pretty wide. You'll probably need to
                    scroll horizontally (left & right).
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:block">
        <FullTable<GW2MarketshareItem>
          data={data}
          sortingOrder={[{ id: sortBy, desc: sortDesc }]}
          columnList={columnList.filter((col) =>
            visibleColumns.has(col.columnId)
          )}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      <MobileTable
        data={data}
        sortingOrder={[{ id: sortBy, desc: sortDesc }]}
        columnList={mobileColumnList}
        rowLabels={columnList as any}
        columnSelectOptions={columnList.map((col) => col.columnId)}
      />
    </>
  )
}
