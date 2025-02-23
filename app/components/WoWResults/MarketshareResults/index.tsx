import { useState } from 'react'
import type { TreemapNode } from '~/components/Charts/Treemap'
import TreemapChart from '~/components/Charts/Treemap'
import { ContentContainer, Title } from '~/components/Common'
import { RadioButtons } from '~/components/Common/RadioButtons'
import type { ColumnList } from '~/components/Tables/FullTable'
import FullTable from '~/components/Tables/FullTable'
import CSVButton from '~/components/utilities/CSVButton'
import { getOribosLink } from '~/components/utilities/getOribosLink'
import { getSaddlebagWoWLink } from '~/components/utilities/getSaddlebagWoWLink'
import type { ItemStats } from '~/requests/WoW/ItemStatLookup'
import type { WoWServerRegion } from '~/requests/WoW/types'
import MobileTable from '../FullScan/MobileTable'
import DebouncedInput from '~/components/Common/DebouncedInput'
import JSONButton from '~/components/utilities/JSONButton'

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
  const [globalFilter, setGlobalFilter] = useState('')

  // // get oribos links
  // const itemDataLink = getOribosLink(results.serverName, 'Link', results.region)
  const itemDataLink = getSaddlebagWoWLink('Link')
  const chartData = currentMarketValue
    ? getChartData(results.data, colorValue)
    : getHistoryChartData(results.data, colorValue)

  const currentMarketOptions = [
    {
      label: 'Current Daily Gold Earned',
      value: 'currentMarketValue'
    },
    {
      label: 'Historic Daily Gold Earned',
      value: 'historicMarketValue'
    }
  ]

  const currentColorOptions = results.commodity
    ? [
        { label: 'Daily Gold Earned', value: 'state' },
        { label: 'Market Quantity', value: 'quantityState' }
      ]
    : [{ label: 'Daily Gold Earned', value: 'state' }]

  const itemsColumnList: Array<ColumnList<ItemStats>> = [
    { columnId: 'itemName', header: 'Item Name' },
    { columnId: 'itemID', header: 'Item Data', accessor: itemDataLink },
    { columnId: 'minPrice', header: 'Minimum Price' },
    { columnId: 'currentMarketValue', header: 'Current Daily Gold Earned' },
    { columnId: 'historicMarketValue', header: 'Historic Daily Gold Earned' },
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
    { columnId: 'currentMarketValue', header: 'Current Daily Gold Earned' }
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

  const csvColumns = itemsColumnList
    .filter((col) => col.columnId !== 'itemID')
    .map(({ header, columnId }) => ({
      title: header,
      value: columnId as keyof ItemStats
    }))

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
      <div className="flex justify-between">
        <div className="flex gap-2">
          <CSVButton
            data={results.data}
            columns={csvColumns}
            filename="saddlebag_wow_marketshare.csv"
          />
          <JSONButton data={results.data} />
        </div>
        
        <DebouncedInput
          onDebouncedChange={(value) => {
            setGlobalFilter(value)
          }}
          className={'hidden sm:block p-2 rounded-md'}
          placeholder={'Search...'}
        />
      </div>
      <div className="hidden sm:block">
        <FullTable<ItemStats>
          data={results.data}
          columnList={itemsColumnList}
          sortingOrder={[{ id: 'currentMarketValue', desc: true }]}
          description="This shows items market statistics!"
          order={tableSortOrder}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
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
      name: 'Historic Daily Gold Earned',
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
  const result: Array<TreemapNode> = []

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
  'itemID',
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
  'item_subclass',
  'item_class'
]
