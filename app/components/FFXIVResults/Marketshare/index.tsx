import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import type {
  MarketshareResult,
  MarketshareSortBy
} from '~/requests/FFXIV/marketshare'
import TreemapChart from '~/components/Charts/Treemap'
import type { TreemapNode } from '~/components/Charts/Treemap'
import { useState } from 'react'

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
  'out of stock': '#2dfa02'
}

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

  console.log(data)

  const chartData = getChartData(data, sortBy)

  const sortByTitleValue = sortByOptions.find(
    ({ value }) => value === sortBy
  )?.label

  const chartTitle = sortByTitleValue
    ? `Marketshare Overview - ${sortByTitleValue}`
    : 'Marketshare Overview'

  return (
    <PageWrapper>
      <>
        <Title title={pageTitle} />
        <ContentContainer>
          <>
            <Title title={chartTitle} />
            <div className="flex my-2 gap-2 overflow-x-scroll">
              {sortByOptions.map(({ value, label }) => {
                const selected = value === sortBy
                return (
                  <button
                    key={`chartTable-${label}`}
                    className={`${
                      selected
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-200'
                    } underline grow w-1/3`}
                    disabled={value === sortBy}
                    type="button"
                    onClick={() => setSortBy(value)}>
                    {label}
                  </button>
                )
              })}
            </div>
            <TreemapChart chartData={chartData} darkMode={darkmode} />
          </>
        </ContentContainer>
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
