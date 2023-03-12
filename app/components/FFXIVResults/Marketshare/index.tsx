import { ContentContainer, PageWrapper, Title } from '~/components/Common'
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

export const sortByOptions: Array<{ label: string; value: MarketshareSortBy }> =
  [
    { label: 'Average Price', value: 'avg' },
    { label: 'Market Value', value: 'marketValue' },
    { label: 'Purchase Amount', value: 'purchaseAmount' },
    { label: 'Quantity Sold', value: 'quantitySold' },
    { label: 'Median', value: 'median' },
    { label: 'Minimum Price', value: 'minPrice' }
  ]

const hexMap = {
  crashing: '#b40606',
  decreasing: '#d88888',
  stable: '#ccbb00',
  increasing: '#81AC6D',
  spiking: '#24b406',
  'out of stock': '#28C706'
}

export const SortBySelect = ({
  label = 'Sort Results By',
  onChange
}: {
  label?: string
  onChange?: (value: MarketshareSortBy) => void
}) => (
  <div className="mt-2">
    <Label htmlFor="sortBy">{label}</Label>
    <select
      name="sortBy"
      defaultValue={'avg'}
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

const TabbedButtons = ({
  currentValue,
  onClick
}: {
  currentValue: MarketshareSortBy
  onClick: (value: MarketshareSortBy) => void
}) => (
  <div className="hidden md:flex mt-2 gap-2 overflow-x-scroll">
    {sortByOptions.map(({ value, label }) => {
      const selected = value === currentValue
      return (
        <button
          key={`chartTable-${label}`}
          className={`${
            selected
              ? 'text-blue-800 bg-gray-100 dark:text-blue-200 dark:bg-gray-800'
              : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-200 shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]'
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
  { columnId: 'minPrice', header: 'Minimum Price' },
  { columnId: 'marketValue', header: 'Market Value' },
  {
    columnId: 'percentChange',
    header: 'Percent Changed',
    accessor: ({ getValue }) => {
      const value = getValue()
      if (!value || typeof value !== 'number') return null

      if (value >= 9999999) return <p>∞</p>

      return <p>{`${value}%`}</p>
    }
  },
  {
    columnId: 'state',
    header: 'Market State'
  },
  { columnId: 'avg', header: 'Average Price' },
  { columnId: 'median', header: 'Median' },
  {
    columnId: 'npc_vendor_info',
    header: 'NPC Vendor',
    accessor: ({ getValue }) => {
      const link = getValue()
      if (!link || typeof link !== 'string') return null

      return <ExternalLink text={'Vendor Link'} link={link} />
    }
  },
  { columnId: 'purchaseAmount', header: 'Purchase Amount' },

  {
    columnId: 'url',
    header: 'Oribos Link',
    accessor: ({ getValue }) => {
      const link = getValue()
      if (!link || typeof link !== 'string') return null

      return <UniversalisBadgedLink link={link} />
    }
  }
]

export const Results = ({
  data,
  pageTitle,
  darkmode,
  sortByValue
}: {
  data: MarketshareResult
  pageTitle: string
  darkmode: boolean
  sortByValue: MarketshareSortBy
}) => {
  const [sortBy, setSortBy] = useState<MarketshareSortBy>(sortByValue)
  const chartData = getChartData(data, sortBy)

  const sortByTitleValue = sortByOptions.find(
    ({ value }) => value === sortBy
  )?.label

  const chartTitle = sortByTitleValue
    ? `Marketshare Overview - ${sortByTitleValue}`
    : 'Marketshare Overview'

  console.log(data)

  return (
    <PageWrapper>
      <>
        <Title title={pageTitle} />
        <ContentContainer>
          <>
            <Title title={chartTitle} />
            <TabbedButtons currentValue={sortBy} onClick={setSortBy} />
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

        <FullTable<MarketshareItem>
          data={data}
          sortingOrder={[{ id: sortBy, desc: true }]}
          columnList={columnList}
        />
      </>
    </PageWrapper>
  )
}

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
