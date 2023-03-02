import { useState } from 'react'
import type { TreemapNode } from '~/components/Charts/Treemap'
import TreemapChart from '~/components/Charts/Treemap'
import { ContentContainer, Title } from '~/components/Common'
import { RadioButtons } from '~/components/Common/RadioButtons'
import type { ColumnList } from '~/components/Tables/FullTable'
import FullTable from '~/components/Tables/FullTable'
import { getOribosLink } from '~/components/utilities/getOribosLink'
import type { ItemStats } from '~/components/WoWResults/ShortagePredictor/ItemStatLookup'
import type { WoWServerRegion } from '~/requests/WoW/types'
import MobileTable from '../FullScan/MobileTable'

export interface WoWMarketShareActionResults {
  data: Array<ItemStats>
  serverName: string
  chartData: Array<TreemapNode>
  region: WoWServerRegion
  commodity: boolean
}

const MarketshareResults = ({
  results,
  pageTitle,
  darkMode
}: {
  results: WoWMarketShareActionResults
  pageTitle: string
  darkMode: boolean
}) => {
  const [colorValue, setColorValue] = useState<'state' | 'quantityState'>(
    'state'
  )

  const [currentMarketValue, setCurrentMarketValue] = useState(true)

  const OribosLink = getOribosLink(results.serverName, 'Oribos', results.region)
  const chartData = currentMarketValue
    ? getChartData(results.data, colorValue)
    : getHistoryChartData(results.data, colorValue)

  const currentMarketOptions = [
    {
      label: 'Current Market Value',
      value: 'currentMarketValue'
    },
    {
      label: 'Historic Market Value',
      value: 'historicMarketValue'
    }
  ]

  const currentColorOptions = results.commodity
    ? [
        { label: 'Market Value', value: 'state' },
        { label: 'Market Quantity', value: 'quantityState' }
      ]
    : [{ label: 'Market Value', value: 'state' }]

  const itemsColumnList: Array<ColumnList<ItemStats>> = [
    { columnId: 'itemName', header: 'Item Name' },
    { columnId: 'minPrice', header: 'Minimum Price' },
    { columnId: 'currentMarketValue', header: 'Current Market Value' },
    { columnId: 'historicMarketValue', header: 'Historic Market Value' },
    {
      columnId: 'percentChange',
      header: 'Percent Changed',
      accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
    },
    {
      columnId: 'state',
      header: 'Market State'
    },
    { columnId: 'historicPrice', header: 'Historic Price' },
    { columnId: 'item_class', header: 'Item Class' },
    { columnId: 'item_subclass', header: 'Item Sub Class' },
    { columnId: 'itemID', header: 'Oribos Link', accessor: OribosLink },
    { columnId: 'salesPerDay', header: 'Sales Per Day' },
    {
      columnId: 'avgQuantity',
      header: 'Average Quantity'
    },
    {
      columnId: 'currentQuantity',
      header: 'Current Quantity'
    },
    {
      columnId: 'currentVsAvgQuantityPercent',
      header: 'Quantity Percent Remaining',
      accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
    }
  ]

  const mobileColumnList = [
    { columnId: 'itemName', header: 'Item Name' },
    { columnId: 'currentMarketValue', header: 'Current Market Value' }
  ]

  const mobileSelectOptions = [
    'currentMarketValue',
    'minPrice',
    'historicMarketValue',
    'percentChange',
    'historicPrice',
    'item_class',
    'item_subclass',
    'salesPerDay',
    'avgQuantity',
    'currentQuantity',
    'currentVsAvgQuantityPercent'
  ]

  return (
    <div>
      <Title title={pageTitle} />
      <div className="px-2 sm:px-4 my-2 sm:my-4">
        <ContentContainer>
          <>
            <TreemapChart
              chartData={chartData}
              title="Marketshare Visualisation"
              darkMode={darkMode}
            />
            <RadioButtons
              title={'Market values to show'}
              name="valuesToShow"
              radioOptions={currentMarketOptions}
              defaultChecked={
                currentMarketValue
                  ? 'currentMarketValue'
                  : 'historicMarketValue'
              }
              onChange={() => {
                setCurrentMarketValue((state) => !state)
              }}
            />
            <RadioButtons
              title="Color Visualisation"
              name="chartColor"
              radioOptions={currentColorOptions}
              defaultChecked={!results.commodity ? colorValue : 'state'}
              onChange={(value) => {
                if (value === 'state' || value === 'quantityState') {
                  setColorValue(value)
                }
              }}
            />
          </>
        </ContentContainer>
      </div>
      <div className="hidden sm:block">
        <FullTable<ItemStats>
          data={results.data}
          columnList={itemsColumnList}
          sortingOrder={[{ id: 'currentMarketValue', desc: true }]}
          description="This shows items market statistics!"
          order={tableSortOrder}
        />
      </div>
      <MobileTable
        data={results.data}
        sortingOrder={[{ id: 'currentMarketValue', desc: true }]}
        columnList={mobileColumnList}
        rowLabels={itemsColumnList}
        columnSelectOptions={mobileSelectOptions}
      />
    </div>
  )
}

export default MarketshareResults

const hexMap = {
  crashing: '#b40606',
  decreasing: '#d88888',
  stable: '#ccbb00',
  increasing: '#81AC6D',
  spiking: '#24b406'
}

const getHistoryChartData = (
  marketplaceOverviewData: Array<ItemStats>,
  colorValue: 'state' | 'quantityState' = 'state'
): Array<TreemapNode> => {
  const result: Array<TreemapNode> = [
    {
      id: 'historicMarketValue',
      name: 'Historic Market Value',
      toolTip: `Historic Market: ${marketplaceOverviewData
        .reduce((total, curr) => total + curr.historicMarketValue, 0)
        .toLocaleString()}`
    }
  ]

  marketplaceOverviewData.forEach((current) => {
    const base = {
      id: current.itemID.toString(),
      name: current.itemName,
      color: hexMap[current[colorValue]]
    }

    const historicMarketValue = {
      ...base,
      parent: 'historicMarketValue',
      value: current.historicMarketValue,
      toolTip: `${base.name}: ${current.historicMarketValue.toLocaleString()}`
    }
    result.push(historicMarketValue)
  })

  return result
}

const getChartData = (
  marketplaceOverviewData: Array<ItemStats>,
  colorValue: 'state' | 'quantityState' = 'state'
): Array<TreemapNode> => {
  const result: Array<TreemapNode> = [
    {
      id: 'historicMarketValue',
      name: 'Historic Market Value',
      toolTip: `Historic Market: ${marketplaceOverviewData
        .reduce((total, curr) => total + curr.historicMarketValue, 0)
        .toLocaleString()}`,
      value: 1
    }
  ]

  marketplaceOverviewData.forEach((current) => {
    const base = {
      id: current.itemID.toString(),
      name: current.itemName,
      color: hexMap[current[colorValue]]
    }

    const currentMarketValue = {
      ...base,
      parent: 'currentMarketValue',
      value: current.currentMarketValue,
      toolTip: `${base.name}: ${current.currentMarketValue.toLocaleString()}`
    }
    result.push(currentMarketValue)
  })

  return result
}

const tableSortOrder = [
  'itemName',
  'currentMarketValue',
  'historicMarketValue',
  'percentChange',
  'state',
  'salesPerDay',
  'minPrice',
  'historicPrice',
  'avgQuantity',
  'currentQuantity',
  'currentVsAvgQuantityPercent',
  'itemID',
  'item_subclass',
  'item_class'
]
