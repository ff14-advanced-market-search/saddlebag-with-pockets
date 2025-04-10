import { useState } from 'react'
import { PageWrapper } from '~/components/Common'
import type { ColumnList } from '~/components/Tables/FullTable'
import FullTable from '~/components/Tables/FullTable'
import CSVButton from '~/components/utilities/CSVButton'
import { getOribosLink } from '~/components/utilities/getOribosLink'
import type {
  ManipulationItem,
  ManipulationResponse
} from '~/requests/WoW/QuantityManipulation'
import MobileTable from '../FullScan/MobileTable'
import { useChartModal } from './useChartModal'
import DebouncedInput from '~/components/Common/DebouncedInput'
import { ContentContainer, Title } from '~/components/Common'
import { useTypedSelector } from '~/redux/useTypedSelector'

const mobileColumnList = [
  { columnId: 'item_name', header: 'Item Name' },
  { columnId: 'volatility', header: 'Volatility' }
]

const mobileSelectOptions = [
  'volatility',
  'max_quantity_spike_percent',
  'max_quantity_drop_percent',
  'suspicious_quantity_change_amount',
  'avg_quantity',
  'max_quantity',
  'min_quantity',
  'current_price',
  'historic_price',
  'sales_per_day',
  'min_price',
  'max_price',
  'price_multiplier'
]

export const Results = ({
  results,
  pageTitle
}: {
  results: ManipulationResponse
  pageTitle: string
}) => {
  const { ChartModal, setChartData } = useChartModal()

  const handleRowPress = (
    chart: {
      p: number[]
      q: number[]
      title: string
    } | null
  ) => {
    setChartData(chart)
  }

  return (
    <PageWrapper>
      <>
        <ContentContainer>
          <Title title={pageTitle} />
        </ContentContainer>
        <ManipulationTable results={results} onRowPress={handleRowPress} />
        <ChartModal />
      </>
    </PageWrapper>
  )
}

const excludeCols = ['item_id', 'chart_button']

const ManipulationTable = ({
  results,
  onRowPress
}: {
  results: ManipulationResponse
  onRowPress: (
    chart: {
      p: number[]
      q: number[]
      title: string
    } | null
  ) => void
}) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const { wowRealm } = useTypedSelector((state) => state.user)

  const OribosLink = getOribosLink(wowRealm.server.name, '', wowRealm.region)

  const columnList: Array<ColumnList<ManipulationItem>> = [
    { columnId: 'item_name', header: 'Item Name' },
    {
      columnId: 'chart_button',
      header: 'Last Week',
      accessor: ({ row }) => (
        <button
          className="inline-flex items-center rounded-md bg-black px-2.5 py-2 text-sm font-medium text-white"
          onClick={() =>
            onRowPress({
              title: row.item_name,
              p: row.price_history,
              q: row.quantity_history
            })
          }>
          Price V Quantity
        </button>
      )
    },
    {
      columnId: 'item_id',
      header: 'Undermine',
      accessor: ({ row }) => OribosLink({ row: { itemID: row.item_id } })
    },
    {
      columnId: 'volatility',
      header: 'Volatility',
      accessor: ({ getValue }) => {
        const value = getValue()
        return <p>{(value as number).toFixed(2)}%</p>
      }
    },
    {
      columnId: 'max_quantity_spike_percent',
      header: 'Max Quantity Spike',
      accessor: ({ getValue }) => {
        const value = getValue()
        return <p>{(value as number).toFixed(2)}%</p>
      }
    },
    {
      columnId: 'max_quantity_drop_percent',
      header: 'Max Quantity Drop',
      accessor: ({ getValue }) => {
        const value = getValue()
        return <p>{(value as number).toFixed(2)}%</p>
      }
    },
    {
      columnId: 'suspicious_quantity_change_amount',
      header: 'Suspicious Changes'
    },
    { columnId: 'avg_quantity', header: 'Avg Quantity' },
    { columnId: 'max_quantity', header: 'Max Quantity' },
    { columnId: 'min_quantity', header: 'Min Quantity' },
    { columnId: 'current_price', header: 'Current Price' },
    { columnId: 'historic_price', header: 'Historic Price' },
    { columnId: 'sales_per_day', header: 'Sales Per Day' },
    { columnId: 'min_price', header: 'Min Price' },
    { columnId: 'max_price', header: 'Max Price' },
    {
      columnId: 'price_multiplier',
      header: 'Price Multiplier',
      accessor: ({ getValue }) => {
        const value = getValue()
        return <p>{(value as number).toFixed(2)}x</p>
      }
    }
  ]

  const csvColumns = columnList
    .filter((col) => !excludeCols.includes(col.columnId))
    .map(({ header, columnId }) => ({
      title: header,
      value: columnId as keyof ManipulationItem
    }))

  return (
    <>
      <div className="flex justify-between">
        <CSVButton
          data={results.data}
          columns={csvColumns}
          filename="saddlebag_wow_quantity_manipulation.csv"
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
        <FullTable
          data={results.data}
          columnList={columnList}
          globalFilter={globalFilter}
          sortingOrder={[{ id: 'volatility', desc: true }]}
        />
      </div>
      <div className="sm:hidden">
        <MobileTable
          data={results.data}
          columnList={mobileColumnList}
          rowLabels={columnList}
          columnSelectOptions={mobileSelectOptions}
          sortingOrder={[{ id: 'volatility', desc: true }]}
        />
      </div>
    </>
  )
} 