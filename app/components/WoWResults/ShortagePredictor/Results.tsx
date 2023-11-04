import { useState } from 'react'
import { PageWrapper } from '~/components/Common'
import type { ColumnList } from '~/components/Tables/FullTable'
import FullTable from '~/components/Tables/FullTable'
import CSVButton from '~/components/utilities/CSVButton'
import { getOribosLink } from '~/components/utilities/getOribosLink'
import { InputGenerator } from '~/components/WoWResults/ShortagePredictor/InputGenerator'
import type {
  AlertJson,
  Prediction,
  PredictionResponse
} from '~/requests/WoW/ShortagePredictor'
import MobileTable from '../FullScan/MobileTable'
import { useChartModal } from './useChartModal'
import DebouncedInput from '~/components/Common/DebouncedInput'

const mobileColumnList = [
  { columnId: 'item_name', header: 'Item Name' },
  { columnId: 'quality', header: 'Quality' }
]

const mobileSelectOptions = [
  'quality',
  'current_quantity',
  'hours_til_shortage',
  'quantity_decline_rate_per_hour',
  'tsm_avg_sale_rate_per_hour',
  'tsm_avg_sale_rate_per_hour',
  'current_quantity_vs_avg_percent',
  'avg_quantity',
  'current_price',
  'current_avg_price',
  'tsm_avg_price',
  'current_price_vs_avg_percent'
]

const getCodeString = (alertJson: AlertJson, idsToFiler: Array<number>) => {
  return `{\n  "homeRealmName": "${alertJson.homeRealmName}",\n  "region": "${
    alertJson.region
  }",\n  "user_auctions": [${alertJson.user_auctions
    .filter((auction) => !idsToFiler.includes(auction.itemID))
    .map(({ itemID, price, desired_state }) => {
      return `\n    { "itemID": ${itemID}, "price": ${price}, "desired_state": "${desired_state}" }`
    })
    .join(',')}\n  ]\n}`
}

export const Results = ({
  results,
  pageTitle
}: {
  results: PredictionResponse
  pageTitle: string
}) => {
  const [filteredIds, setFilteredIds] = useState<Array<number>>([])

  const codeString = getCodeString(results.alert_json, filteredIds)

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
        <InputGenerator codeString={codeString} pageTitle={pageTitle} />
        <PredictionTable
          results={results}
          setFilteredIds={setFilteredIds}
          filteredIds={filteredIds}
          onRowPress={handleRowPress}
        />
        <ChartModal />
      </>
    </PageWrapper>
  )
}

const excludeCols = ['item_id_filter', 'item_id', 'chart_button']

const PredictionTable = ({
  results,
  setFilteredIds,
  filteredIds,
  onRowPress
}: {
  results: PredictionResponse
  filteredIds: Array<number>
  setFilteredIds: (ids: Array<number>) => void
  onRowPress: (
    chart: {
      p: number[]
      q: number[]
      title: string
    } | null
  ) => void
}) => {
  const [globalFilter, setGlobalFilter] = useState('')

  const homeRealmName = results.alert_json.homeRealmName

  const region = results.alert_json.region

  const OribosLink = getOribosLink(homeRealmName, 'Oribos', region)

  const columnList: Array<ColumnList<Prediction>> = [
    { columnId: 'item_name', header: 'Item Name' },
    {
      columnId: 'item_id_filter',
      header: 'Added to Alert Input',
      accessor: ({ row }) => {
        const itemId = row.item_id
        return (
          <input
            className="min-w-4 min-h-4 border-box rounded-md"
            type="checkbox"
            checked={!filteredIds.includes(itemId)}
            onChange={(e) => {
              if (filteredIds.includes(itemId)) {
                setFilteredIds(filteredIds.filter((id) => id !== itemId))
              } else {
                setFilteredIds([...filteredIds, itemId])
              }
            }}
          />
        )
      }
    },
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
      columnId: 'item_id',
      header: 'Oribos Link',
      accessor: ({ row }) => OribosLink({ row: { itemID: row.item_id } })
    },
    { columnId: 'quality', header: 'Quality' },
    {
      columnId: 'hours_til_shortage',
      header: 'Estimated Hours until Shortage'
    },
    {
      columnId: 'quantity_decline_rate_per_hour',
      header: 'Quantity Decline Rate per Hour'
    },
    {
      columnId: 'tsm_avg_sale_rate_per_hour',
      header: 'TSM Sales Per Hour'
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
      header: 'Current Quantity Amount Available'
    },
    { columnId: 'avg_quantity', header: 'Avg Quantity' },
    { columnId: 'current_price', header: 'Price' },
    { columnId: 'current_avg_price', header: 'Avg Price' },
    { columnId: 'tsm_avg_price', header: 'TSM Avg Price' },
    {
      columnId: 'current_price_vs_avg_percent',
      header: 'Price vs Avg %',
      accessor: ({ getValue }) => {
        const value = getValue()
        if (typeof value === 'string') {
          return <p>{parseFloat(value).toFixed(2)}%</p>
        }
        return <p>{(value as number).toFixed(2)}%</p>
      }
    }
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
          filename="saddlebag_wow_shortagePredictor.csv"
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
        <FullTable<Prediction>
          data={results.data}
          columnList={columnList}
          sortingOrder={[{ id: 'quality', desc: true }]}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      <MobileTable
        data={results.data}
        columnList={mobileColumnList}
        rowLabels={columnList}
        columnSelectOptions={mobileSelectOptions}
        sortingOrder={[{ id: 'quality', desc: true }]}
      />
    </>
  )
}
