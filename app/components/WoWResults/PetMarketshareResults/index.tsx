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
      header: 'Estimated Region Market Value'
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
