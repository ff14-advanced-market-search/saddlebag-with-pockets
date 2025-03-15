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
import AAAListButton from '~/components/utilities/AAAListButton'
import PBSListButton from '~/components/utilities/PBSListButton'

export interface WoWMarketShareActionResults {
  data: Array<ItemStats>
  serverName: string
  chartData: Array<TreemapNode>
  region: WoWServerRegion
  commodity: boolean
}

/**
 * Renders the market share results based on World of Warcraft market data.
 * @example
 * renderWoWMarketShare({
 *   results: { /* WoWMarketShareActionResults object * / },
 *   pageTitle: "Market Share",
 *   darkMode: true
 * });
 * // Output will be a complex component structure related to market data.
 * @param {Object} params - The parameters for rendering the component.
 * @param {WoWMarketShareActionResults} params.results - The market share results data.
 * @param {string} params.pageTitle - The title of the page.
 * @param {boolean} params.darkMode - Indicates if dark mode is enabled.
 * @returns {JSX.Element} A JSX element representing the market share results component.
 * @description
 *   - Uses React hooks for state management such as `useState`.
 *   - Displays charts with market visualization options including a treemap.
 *   - Provides download options such as CSV and JSON for market data.
 *   - Supports dynamic filtering and sorting of market data in both desktop and mobile views.
 */
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
        <div className="flex flex-wrap gap-2">
          <CSVButton
            data={results.data}
            columns={csvColumns}
            filename="saddlebag_wow_marketshare.csv"
          />
          <JSONButton data={results.data} />
          <AAAListButton data={results.data} />
          <PBSListButton data={results.data} />
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

/**
 * Transforms marketplace overview data into a structured treemap node array.
 * @example
 * formatTreemapData(marketplaceData, 'state')
 * // Returns an array of TreemapNode objects
 * @param {Array<ItemStats>} marketplaceOverviewData - Array of item statistics including market values.
 * @param {'state' | 'quantityState'} colorValue - Key to determine color mapping, defaults to 'state'.
 * @returns {Array<TreemapNode>} Array of treemap nodes representing market value data.
 * @description
 *   - Aggregates and converts item statistics into a format suitable for treemap visualization.
 *   - Each item is mapped to a treemap node with properties based on the specified colorValue.
 *   - Includes a parent node representing the total historic market value.
 *   - Tooltips are generated to provide formatted historic market values for each item.
 */
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

/**
 * Converts marketplace overview data into a format suitable for treemap visualization.
 * @example
 * transformData(marketplaceOverviewData, 'state')
 * // Returns an array of TreemapNode objects representing each item's market value, with colors based on item state.
 * @param {Array<ItemStats>} marketplaceOverviewData - Array of items containing statistics for the marketplace.
 * @param {'state' | 'quantityState'} colorValue - Determines the property from ItemStats used for color mapping.
 * @returns {Array<TreemapNode>} Array of objects representing nodes of a treemap, including item ID, name, and market value.
 * @description
 *   - Iterates over each item in marketplaceOverviewData to construct TreemapNode objects.
 *   - Uses the provided colorValue to select appropriate coloring for nodes.
 *   - Generates tooltips displaying item name and formatted market value.
 */
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
