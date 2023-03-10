import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import type {
  MarketshareResult,
  MarketshareSortBy
} from '~/requests/FFXIV/marketshare'
import TreemapChart from '~/components/Charts/Treemap'
import type { TreemapNode } from '~/components/Charts/Treemap'

export const sortByOptions = [
  { label: 'Average Price', value: 'avg' },
  { label: 'Market Value', value: 'marketValue' },
  { label: 'Purchase Amount', value: 'purchaseAmount' },
  { label: 'Quantity Sold', value: 'quantitySold' },
  { label: 'Median', value: 'median' }
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
  const chartData = getChartData(data, sortByValue)
  const sortByTitleValue = sortByOptions.find(
    ({ value }) => value === sortByValue
  )?.label

  return (
    <PageWrapper>
      <>
        <Title title={pageTitle} />
        <ContentContainer>
          <TreemapChart
            chartData={chartData}
            title={
              sortByTitleValue
                ? `Marketshare Overview - ${sortByTitleValue}`
                : 'Marketshare Overview'
            }
            darkMode={darkmode}
          />
        </ContentContainer>
      </>
    </PageWrapper>
  )
}

const getChartData = (
  data: MarketshareResult,
  sortByValue: MarketshareSortBy
): Array<TreemapNode> => {
  const base = { color: '#24b406' }

  return data.map((current) => ({
    ...base,
    id: current.itemID,
    value: current[sortByValue],
    name: current.name,
    toolTip: `${current.name}: ${current[sortByValue].toLocaleString()}`
  }))
}
