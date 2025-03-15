import { ContentContainer, Title } from '~/components/Common'
import type {
  MarketshareItem,
  MarketshareResult,
  MarketshareSortBy
} from '~/requests/FFXIV/marketshare'
import TreemapChart from '~/components/Charts/Treemap'
import type { TreemapNode } from '~/components/Charts/Treemap'
import { useState } from 'react'
import Label from '~/components/form/Label'
import type { ColumnList } from '~/components/Tables/FullTable'
import FullTable from '~/components/Tables/FullTable'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import ExternalLink from '~/components/utilities/ExternalLink'
import MobileTable from '~/components/WoWResults/FullScan/MobileTable'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import CSVButton from '~/components/utilities/CSVButton'
import DebouncedInput from '~/components/Common/DebouncedInput'

export const sortByOptions: Array<{ label: string; value: MarketshareSortBy }> =
  [
    { label: 'Weekly Gil Earned', value: 'marketValue' },
    { label: 'Price Increase Percent', value: 'percentChange' },
    { label: 'Purchase Amount', value: 'purchaseAmount' },
    { label: 'Quantity Sold', value: 'quantitySold' },
    { label: 'Average Price', value: 'avg' },
    { label: 'Median', value: 'median' }
  ]

const csvColumns: Array<{ title: string; value: keyof MarketshareItem }> = [
  { title: 'Item ID', value: 'itemID' },
  { title: 'Item Name', value: 'name' },
  { title: 'Weekly Gil Earned', value: 'marketValue' },
  { title: '% Change', value: 'percentChange' },
  { title: 'Market State', value: 'state' },
  { title: 'Minimum Price', value: 'minPrice' },
  { title: 'Average', value: 'avg' },
  { title: 'Median', value: 'median' },
  { title: 'Purchase Amount', value: 'purchaseAmount' },
  { title: 'Quantity Sold', value: 'quantitySold' },
  { title: 'Universalis Link', value: 'url' },
  { title: 'NPC Vendor Info', value: 'npc_vendor_info' }
]

export const hexMap = {
  crashing: '#b40606',
  decreasing: '#d88888',
  stable: '#ccbb00',
  increasing: '#81AC6D',
  spiking: '#24b406',
  'out of stock': '#87ceeb'
}
const assertIsSortBy = (
  sortOption: string
): sortOption is MarketshareSortBy => {
  return sortByOptions.some(({ value }) => value === sortOption)
}

/**
 * Renders a dropdown selection input for sorting results by specified criteria.
 * @example
 * renderSortResultsDropdown({ label: 'Filter By', onChange: handleSortChange, defaultValue: 'name' })
 * <div>...</div>
 * @param {Object} config - Configuration object for dropdown.
 * @param {string} [config.label='Sort Results By'] - Label for the dropdown.
 * @param {function} [config.onChange] - Callback function when the dropdown value changes.
 * @param {MarketshareSortBy} [config.defaultValue='avg'] - The default selected value for the dropdown.
 * @returns {JSX.Element} Rendered dropdown component allowing users to select how to sort results.
 * @description
 *   - If `onChange` is provided, it will be called with the selected option value when the dropdown value changes.
 *   - The dropdown options are derived from a predefined list of valid sorting criteria.
 *   - The component styles adapt for both light and dark themes.
 */
export const SortBySelect = ({
  label = 'Sort Results By',
  onChange,
  defaultValue = 'avg'
}: {
  label?: string
  onChange?: (value: MarketshareSortBy) => void
  defaultValue?: MarketshareSortBy
}) => (
  <div className="mt-2">
    <Label htmlFor="sortBy">{label}</Label>
    <select
      name="sortBy"
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

/**
 * Renders a set of toggle buttons based on the provided options.
 * @example
 * createToggleButtonGroup({ currentValue: 'option1', onClick: handleClick, options: [{ value: 'option1', label: 'Option 1' }, { value: 'option2', label: 'Option 2' }] })
 * // A button group is rendered, where clicking on a button changes its selected state.
 * @param {Object} props - The properties object.
 * @param {string} props.currentValue - The current selected value.
 * @param {Function} props.onClick - Callback function to handle button click with the value as parameter.
 * @param {Array<Object>} props.options - Array of options with a value and a label for each.
 * @returns {JSX.Element} Returns a JSX element that represents a group of buttons.
 * @description
 *   - Buttons are styled differently when selected.
 *   - Each button is disabled if it represents the current selected value.
 *   - Layout is responsive with hidden elements for non-md screens.
 */
export const TabbedButtons = ({
  currentValue,
  onClick,
  options
}: {
  currentValue: string
  onClick: (value: string) => void
  options: Array<{ value: string; label: string }>
}) => (
  <div className="hidden md:flex mt-2 gap-2 overflow-x-auto">
    {options.map(({ value, label }) => {
      const selected = value === currentValue
      return (
        <button
          key={`chartTable-${label}`}
          className={`${
            selected
              ? 'text-blue-800 bg-gray-100 dark:text-blue-200 dark:bg-gray-800'
              : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-200 shadow-[inset_0_-3px_3px_rgba(0,0,0,0.2)]'
          } px-2 py-1 grow w-1/3 rounded-t-md`}
          disabled={value === currentValue}
          type="button"
          onClick={() => onClick(value)}>
          {label}
        </button>
      )
    })}
  </div>
)

const columnList: Array<ColumnList<MarketshareItem>> = [
  { columnId: 'name', header: 'Item Name' },
  { columnId: 'marketValue', header: 'Weekly Gil Earned' },
  {
    columnId: 'percentChange',
    header: 'Percent Changed',
    accessor: ({ row }) => {
      const value = row.percentChange
      if (value === undefined || value === null) return null

      if (value >= 9999999) return <p>∞</p>

      return <p>{`${value.toLocaleString()}%`}</p>
    }
  },
  {
    columnId: 'state',
    header: 'Market State'
  },
  { columnId: 'avg', header: 'Average Price' },
  { columnId: 'median', header: 'Median' },
  { columnId: 'minPrice', header: 'Minimum Price' },
  { columnId: 'purchaseAmount', header: 'Purchase Amount' },
  { columnId: 'quantitySold', header: 'Quantity Sold' },
  {
    columnId: 'itemID',
    header: 'Item data',

    accessor: ({ row }) => {
      const itemID = row.itemID
      if (itemID === undefined || typeof itemID !== 'string') return null

      return <ItemDataLink link={`/queries/item-data/${itemID}`} />
    }
  },
  {
    columnId: 'url',
    header: 'Universalis Link',
    accessor: ({ getValue }) => {
      const link = getValue()
      if (!link || typeof link !== 'string') return null

      return <UniversalisBadgedLink link={link} />
    }
  },
  {
    columnId: 'npc_vendor_info',
    header: 'NPC Vendor',

    accessor: ({ getValue }) => {
      const link = getValue()
      if (!link || typeof link !== 'string') return null

      return <ExternalLink text={'Vendor Link'} link={link} />
    }
  }
]

/**
 * Retrieves sorting options for marketshare based on provided criteria.
 * @example
 * sortBy('price')
 * // Returns columns configured for sorting by 'price'
 * @param {MarketshareSortBy} sortBy - A string indicating the sorting criteria.
 * @returns {Array<Object>} Returns an array of column header objects based on the sort criteria.
 * @description
 *   - If the specified sortBy value does not match any available options, defaults to showing 'Average Price'.
 *   - Looks for a corresponding option label from the sortByOptions list to set the second column.
 */
const getMobileColumns = (sortBy: MarketshareSortBy) => {
  const sortByName = sortByOptions.find(({ value }) => sortBy === value)
  if (!sortByName) {
    return [
      { columnId: 'name', header: 'Item Name' },
      { header: 'Average Price', columnId: 'avg' }
    ]
  }

  return [
    { columnId: 'name', header: 'Item Name' },
    { header: sortByName.label, columnId: sortByName.value }
  ]
}

/**
 * Renders a market share overview page with a chart and data tables.
 * @example
 * MarketshareComponent({
 *   data: sampleData,
 *   pageTitle: "Market Share",
 *   darkmode: true,
 *   sortByValue: "category"
 * })
 * returns a JSX element containing title, chart, and tables.
 * @param {MarketshareResult} data - The market share data to display.
 * @param {string} pageTitle - Optional title for the page.
 * @param {boolean} darkmode - Indicates if dark mode is enabled.
 * @param {MarketshareSortBy} sortByValue - Value by which data is sorted.
 * @returns {JSX.Element} The complete market share overview component.
 * @description
 *   - Uses state to manage sorting and filtering.
 *   - Renders different UI elements based on screen size.
 *   - Allows exporting data to CSV format.
 */
export const Results = ({
  data,
  pageTitle,
  darkmode,
  sortByValue
}: {
  data: MarketshareResult
  pageTitle?: string
  darkmode: boolean
  sortByValue: MarketshareSortBy
}) => {
  const [sortBy, setSortBy] = useState<MarketshareSortBy>(sortByValue)
  const [globalFilter, setGlobalFilter] = useState('')
  const chartData = getChartData(data, sortBy)

  const sortByTitleValue = sortByOptions.find(
    ({ value }) => value === sortBy
  )?.label

  const chartTitle = sortByTitleValue
    ? `Marketshare Overview - ${sortByTitleValue}`
    : 'Marketshare Overview'

  const mobileColumnList = getMobileColumns(sortBy)

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
            <SortBySelect onChange={setSortBy} label="Sort By" />
          </div>

          <TreemapChart
            chartData={chartData}
            darkMode={darkmode}
            backgroundColor={darkmode ? '#1f2937' : '#f3f4f6'}
          />
        </>
      </ContentContainer>
      <div className="my-2 flex justify-between">
        <CSVButton
          filename="saddlebag-marketshare.csv"
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
        <FullTable<MarketshareItem>
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
        rowLabels={columnList}
        columnSelectOptions={sortByOptions.map(({ value }) => value)}
      />
    </>
  )
}

/**
 * Transforms market share data into a treemap node structure based on the specified sorting value.
 * @example
 * transformMarketshareData(data, 'sales')
 * // Returns an array of TreemapNode objects
 * @param {MarketshareResult} data - An array of market share data objects to transform.
 * @param {MarketshareSortBy} sortByValue - The property key to sort the market share data by.
 * @returns {Array<TreemapNode>} An array of formatted treemap node objects.
 * @description
 *   - Maps each market share item to a treemap node with attributes like id, value, name, toolTip, and color.
 *   - toolTip provides a string representation of the name and the value, formatted with locale-specific settings.
 *   - Uses a color map (hexMap) based on the item state to assign colors.
 */
const getChartData = (
  data: MarketshareResult,
  sortByValue: MarketshareSortBy
): Array<TreemapNode> => {
  return data.map((current) => ({
    id: current.itemID,
    value: current[sortByValue],
    name: current.name,
    toolTip: `${current.name}: ${current[sortByValue].toLocaleString()}`,
    color: hexMap[current.state]
  }))
}
