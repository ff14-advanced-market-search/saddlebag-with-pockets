import { useState } from 'react'
import { PageWrapper } from '~/components/Common'
import type { ColumnList } from '~/components/Tables/FullTable'
import FullTable from '~/components/Tables/FullTable'
import CSVButton from '~/components/utilities/CSVButton'
import type {
  Prediction,
  PredictionResponse
} from '~/requests/FFXIV/ShortagePredictor'
import { useChartModal } from '../../WoWResults/ShortagePredictor/useChartModal'
import DebouncedInput from '~/components/Common/DebouncedInput'
import { ContentContainer, Title } from '~/components/Common'
import { useTypedSelector } from '~/redux/useTypedSelector'
import MobileTable from '../../WoWResults/FullScan/MobileTable'

const mobileColumnList = [
  { columnId: 'item_name', header: 'Item Name' },
  { columnId: 'current_price', header: 'Current Price' }
]

const mobileSelectOptions = [
  'current_price',
  'current_quantity',
  'hours_til_shortage',
  'quantity_decline_rate_per_hour',
  'avg_sale_rate_per_hour',
  'current_quantity_vs_avg_percent',
  'avg_quantity',
  'median_nq',
  'median_hq',
  'current_avg_price',
  'current_price_vs_median_percent'
]

export const Results = ({
  results,
  pageTitle
}: {
  results: PredictionResponse
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
        <PredictionTable results={results} onRowPress={handleRowPress} />
        <ChartModal />
      </>
    </PageWrapper>
  )
}

const excludeCols = [
  'item_id',
  'chart_button',
  'npc_vendor_uid',
  'npc_vendor_price'
]

const PredictionTable = ({
  results,
  onRowPress
}: {
  results: PredictionResponse
  onRowPress: (
    chart: {
      p: number[]
      q: number[]
      title: string
    } | null
  ) => void
}) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const { darkmode } = useTypedSelector((state) => state.user)

  const columnList: Array<ColumnList<Prediction>> = [
    { columnId: 'item_name', header: 'Item Name' },
    {
      columnId: 'chart_button',
      header: 'Last 24 Hours',
      accessor: ({ row }) => (
        <button
          className="inline-flex items-center rounded-md bg-black px-2.5 py-2 text-sm font-medium text-white"
          onClick={() =>
            onRowPress({
              title: row.item_name,
              p: row.chart_p,
              q: row.chart_q
            })
          }>
          Price V Quantity
        </button>
      )
    },
    {
      columnId: 'current_price_vs_median_percent',
      header: 'Price vs Median %',
      accessor: ({ getValue }) => {
        const value = getValue()
        if (typeof value === 'string') {
          return <p>{Number.parseFloat(value).toFixed(2)}%</p>
        }
        return <p>{(value as number).toFixed(2)}%</p>
      }
    },
    { columnId: 'current_price', header: 'Current Price' },
    { columnId: 'median_nq', header: 'NQ Median' },
    { columnId: 'median_hq', header: 'HQ Median' },
    {
      columnId: 'hours_til_shortage',
      header: 'Estimated Hours until Shortage'
    },
    {
      columnId: 'quantity_decline_rate_per_hour',
      header: 'Quantity Decline Rate per Hour'
    },
    {
      columnId: 'avg_sale_rate_per_hour',
      header: 'Sales Per Hour'
    },
    {
      columnId: 'current_quantity_vs_avg_percent',
      header: 'Quantity Percent Available',
      accessor: ({ getValue }) => {
        const value = getValue()
        if (typeof value === 'string') {
          return <p>{parseFloat(value).toFixed(2)}%</p>
        }
        return <p>{(value as number).toFixed(2)}%</p>
      }
    },
    {
      columnId: 'current_quantity',
      header: 'Current Quantity Available'
    },
    { columnId: 'avg_quantity', header: 'Avg Quantity' },
    { columnId: 'current_avg_price', header: 'Current Avg Price' },
    { columnId: 'sales_amount_nq', header: 'NQ Sales' },
    { columnId: 'sales_amount_hq', header: 'HQ Sales' }
  ]

  const csvColumns = columnList
    .filter((col) => !excludeCols.includes(col.columnId))
    .map(({ header, columnId }) => ({
      title: header,
      value: columnId as keyof Prediction
    }))

  return (
    <>
      <div className="flex justify-between">
        <CSVButton
          data={results.data}
          columns={csvColumns}
          filename="saddlebag_ffxiv_shortagePredictor.csv"
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
          sortingOrder={[{ id: 'hours_til_shortage', desc: false }]}
        />
      </div>
      <div className="sm:hidden">
        <MobileTable
          data={results.data}
          columnList={mobileColumnList}
          rowLabels={columnList}
          columnSelectOptions={mobileSelectOptions}
          sortingOrder={[{ id: 'hours_til_shortage', desc: false }]}
        />
      </div>
    </>
  )
}
