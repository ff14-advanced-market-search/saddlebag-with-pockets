import { useState } from 'react'
import type { TreemapNode } from '~/components/Charts/Treemap'
import TreemapChart from '~/components/Charts/Treemap'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import type { ColumnList } from '~/components/Tables/FullTable'
import FullTable from '~/components/Tables/FullTable'
import CSVButton from '~/components/utilities/CSVButton'
import type {
  PetMarketshareItem,
  PetMarketshareSortBy
} from '~/requests/WoW/PetMarketshare'
import type { WoWServerRegion } from '~/requests/WoW/types'
import MobileTable from '../FullScan/MobileTable'
import ExternalLink from '~/components/utilities/ExternalLink'
import DebouncedInput from '~/components/Common/DebouncedInput'
import { TabbedButtons, hexMap } from '~/components/FFXIVResults/Marketshare'
import { sortByOptions } from '~/routes/wow.pet-marketshare'
import Select from '~/components/form/select'
import JSONButton from '~/components/utilities/JSONButton'
import AAAListButton from '~/components/utilities/AAAListButton'
import PBSListButton from '~/components/utilities/PBSListButton'

export interface WoWPetMarketShareActionResults {
  data: Array<PetMarketshareItem>
  serverName: string
  chartData: Array<TreemapNode>
  region: WoWServerRegion
  commodity: boolean
  sortBy: PetMarketshareSortBy
}

const assertIsSortBy = (
  sortOption: string
): sortOption is PetMarketshareSortBy => {
  return sortByOptions.some(({ value }) => value === sortOption)
}

/**
 * Renders the pet market share results page including tables, charts, and export options.
 * @example
 * renderPetMarketshareResults({
 *   results: actionResults,
 *   pageTitle: "Pet Market Share",
 *   darkMode: true
 * })
 * // Returns a React component for displaying pet market statistics.
 * @param {Object} results - Contains data and sorting options for rendering the market share information.
 * @param {string} pageTitle - Title to be displayed at the top of the page.
 * @param {boolean} darkMode - Indicates whether the dark mode theme is applied.
 * @returns {JSX.Element} The rendered pet market share page component.
 * @description
 *   - Utilizes a variety of external links for detailed item information.
 *   - Provides a toggle between desktop and mobile view components.
 *   - Implements CSV, JSON, AAA, and PBS data export functionalities.
 */
const PetMarketshareResults = ({
  results,
  pageTitle,
  darkMode
}: {
  results: WoWPetMarketShareActionResults
  pageTitle: string
  darkMode: boolean
}) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sortBy, setSortBy] = useState<PetMarketshareSortBy>(results.sortBy)

  const chartData = getChartData(results.data, sortBy)

  const itemsColumnList: Array<ColumnList<PetMarketshareItem>> = [
    { columnId: 'itemName', header: 'Item Name' },
    {
      columnId: 'estimatedRegionMarketValue',
      header: 'Gold Earned Per Day'
    },
    { columnId: 'avgTSMPrice', header: 'Average TSM Price' },
    { columnId: 'homeMinPrice', header: 'Minimum Price' },
    {
      columnId: 'percentChange',
      header: 'Percent Changed',
      accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
    },
    { columnId: 'salesPerDay', header: 'Sales Per Day' },
    {
      columnId: 'state',
      header: 'Market State'
    },
    {
      columnId: 'link',
      header: 'Item Link',
      accessor: ({ getValue }) => <ExternalLink link={getValue() as string} />
    },
    {
      columnId: 'undermineLink',
      header: 'Undermine Link',
      accessor: ({ getValue }) => (
        <ExternalLink text="Undermine" link={getValue() as string} />
      )
    },
    {
      columnId: 'warcraftPetsLink',
      header: 'Warcraft Pets Link',
      accessor: ({ getValue }) => (
        <ExternalLink text="Warcraft Pets" link={getValue() as string} />
      )
    }
  ]

  const csvColumns = itemsColumnList
    .filter((col) => col.columnId !== 'itemID')
    .map(({ header, columnId }) => ({
      title: header,
      value: columnId as keyof PetMarketshareItem
    }))

  return (
    <PageWrapper>
      <Title title={pageTitle} />
      <ContentContainer>
        <>
          <TabbedButtons
            currentValue={sortBy}
            onClick={(value) => {
              if (assertIsSortBy(value)) setSortBy(value)
            }}
            options={sortByOptions}
          />
          <div className="md:hidden py-2">
            <Select
              title="Market Values to Show"
              options={sortByOptions}
              name="sortBy"
              id="sortBy"
              onChange={(e) => {
                const value = e.target.value
                if (assertIsSortBy(value)) setSortBy(value)
              }}
            />
          </div>
          <TreemapChart
            chartData={chartData}
            darkMode={darkMode}
            backgroundColor={darkMode ? '#1f2937' : '#f3f4f6'}
          />
        </>
      </ContentContainer>
      <div className="flex justify-between">
        <CSVButton
          data={results.data}
          columns={csvColumns}
          filename="saddlebag_wow_pet_marketshare.csv"
        />
        <JSONButton data={results.data} />
        <AAAListButton data={results.data} />
        <PBSListButton data={results.data} />
        <DebouncedInput
          onDebouncedChange={(value) => {
            setGlobalFilter(value)
          }}
          className={'hidden sm:block p-2 rounded-md'}
          placeholder={'Search...'}
        />
      </div>
      <div className="hidden sm:block">
        <FullTable<PetMarketshareItem>
          data={results.data}
          columnList={itemsColumnList}
          sortingOrder={[{ id: results.sortBy, desc: true }]}
          description="This shows pet market statistics!"
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      <MobileTable
        data={results.data}
        sortingOrder={[{ id: sortBy, desc: true }]}
        columnList={getMobileColumns(sortBy, sortByOptions)}
        rowLabels={itemsColumnList}
        columnSelectOptions={sortByOptions.map(({ value }) => value)}
      />
    </PageWrapper>
  )
}

export default PetMarketshareResults

/**
 * Transforms an array of pet market share items into an array of treemap nodes suitable for visualization.
 * @example
 * dataToTreemapNodes(data, 'price')
 * Returns an array of treemap nodes with properties id, value, name, toolTip, and color.
 * @param {Array<PetMarketshareItem>} data - The input array containing market share items.
 * @param {PetMarketshareSortBy} sortByValue - The property name used to determine node values.
 * @returns {Array<TreemapNode>} An array of treemap nodes constructed from the input data.
 * @description
 *   - Constructs tooltip information by concatenating itemName with a formatted value.
 *   - Maps location identifiers to colors using a predefined hex color mapping.
 *   - Assumes data input contains necessary properties: itemID, sortByValue, itemName, and state.
 */
const getChartData = (
  data: Array<PetMarketshareItem>,
  sortByValue: PetMarketshareSortBy
): Array<TreemapNode> => {
  return data.map((current) => ({
    id: current.itemID,
    value: current[sortByValue],
    name: current.itemName,
    toolTip: `${current.itemName}: ${current[sortByValue].toLocaleString()}`,
    color: hexMap[current.state]
  }))
}

/**
 * Retrieves the column headers for sorting pet market share results by the specified criteria.
 * @example
 * getColumnHeadersBySort(PetMarketshareSortBy.NAME, optionsArray)
 * // Returns an array of objects, each containing 'columnId' and 'header' keys.
 * @param {PetMarketshareSortBy} sortBy - Criteria to sort pet market share data by.
 * @param {Array<{ label: string; value: string }>} options - Available sorting options with labels and corresponding values.
 * @returns {Array<{ columnId: string; header: string }>} Array of column header objects for displaying the results.
 * @description
 *   - If the provided sort criteria is not found within the given options, defaults to 'itemName' and 'avgTSMPrice'.
 *   - Enables dynamic generation of column headers based on sort criteria input.
 */
const getMobileColumns = (
  sortBy: PetMarketshareSortBy,
  options: Array<{ label: string; value: string }>
) => {
  const sortByName = options.find(({ value }) => sortBy === value)
  if (!sortByName) {
    return [
      { columnId: 'itemName', header: 'Item Name' },
      { columnId: 'avgTSMPrice', header: 'Average TSM Price' }
    ]
  }

  return [
    { columnId: 'itemName', header: 'Item Name' },
    { header: sortByName.label, columnId: sortByName.value }
  ]
}
