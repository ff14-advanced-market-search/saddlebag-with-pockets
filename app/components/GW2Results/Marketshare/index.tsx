import { ContentContainer, Title } from '~/components/Common'
import type {
  GW2MarketshareItem,
  GW2MarketshareSortBy
} from '~/requests/GW2/marketshare'
import TreemapChart from '~/components/Charts/Treemap'
import type { TreemapNode } from '~/components/Charts/Treemap'
import { useState } from 'react'
import Label from '~/components/form/Label'
import type { ColumnList } from '~/components/Tables/FullTable'
import FullTable from '~/components/Tables/FullTable'
import CSVButton from '~/components/utilities/CSVButton'
import DebouncedInput from '~/components/Common/DebouncedInput'
import MobileTable from '~/components/WoWResults/FullScan/MobileTable'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import { RadioButtons } from '~/components/Common/RadioButtons'
import { TabbedButtons } from '~/components/FFXIVResults/Marketshare'

export const SortBySelect = ({
  label = 'Sort Results By',
  onChange,
  defaultValue = 'value'
}: {
  label?: string
  onChange?: (value: GW2MarketshareSortBy) => void
  defaultValue?: GW2MarketshareSortBy
}) => (
  <div className="mt-2">
    <Label htmlFor="sort_by">{label}</Label>
    <select
      name="sort_by"
      defaultValue={defaultValue}
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
      className="flex-1 min-w-0 block w-full px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400">
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
  { label: 'Value Percent Change', value: 'valuePercentChange' }
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
  { title: 'Level', value: 'level' }
]

const hexMap: Record<string, string> = {
  crashing: '#b40606',
  decreasing: '#d88888',
  stable: '#ccbb00',
  increasing: '#81AC6D',
  spiking: '#24b406'
}

const getChartData = (
  data: Array<GW2MarketshareItem>,
  sortBy: GW2MarketshareSortBy,
  useHistoric: boolean,
  colorBy: 'value' | 'sold' | 'price'
): Array<TreemapNode> => {
  const result: Array<TreemapNode> = []

  data.forEach((item) => {
    let value: number
    let color: string

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
        value = Math.abs(item.pricePercentChange)
        break
      case 'soldPercentChange':
        value = Math.abs(item.soldPercentChange)
        break
      case 'valuePercentChange':
        value = Math.abs(item.valuePercentChange)
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
      value: value,
      color: color,
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
  { columnId: 'level', header: 'Level' }
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
  const [colorBy, setColorBy] = useState<'value' | 'sold' | 'price'>('value')

  // Determine if we should use historic based on the sortBy selection
  const useHistoric =
    sortBy === 'historic_value' ||
    sortBy === 'historic_sold' ||
    sortBy === 'historic_price_average'

  const chartData = getChartData(data, sortBy, useHistoric, colorBy)

  const sortByTitleValue = sortByOptions.find(
    ({ value }) => value === sortBy
  )?.label

  const chartTitle = sortByTitleValue
    ? `Marketshare Overview - ${sortByTitleValue}`
    : 'Marketshare Overview'

  const mobileColumnList = getMobileColumns(sortBy)

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

          <TreemapChart
            chartData={chartData}
            darkMode={darkmode}
            backgroundColor={darkmode ? '#1f2937' : '#f3f4f6'}
          />

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
      <div className="my-2 flex justify-between">
        <CSVButton
          filename="saddlebag-gw2-marketshare.csv"
          data={data}
          columns={csvColumns}
        />
        <DebouncedInput
          onDebouncedChange={(value) => {
            setGlobalFilter(value)
          }}
          className={'hidden sm:block p-2 rounded-md'}
          placeholder={'Search...'}
        />
      </div>
      <div className="hidden sm:block">
        <FullTable<GW2MarketshareItem>
          data={data}
          sortingOrder={[{ id: sortBy, desc: true }]}
          columnList={columnList}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      <MobileTable
        data={data}
        sortingOrder={[{ id: sortBy, desc: true }]}
        columnList={mobileColumnList}
        rowLabels={columnList as any}
        columnSelectOptions={columnList.map((col) => col.columnId)}
      />
    </>
  )
}
