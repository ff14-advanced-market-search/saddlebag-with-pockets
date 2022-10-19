import type { HistoryResponse } from '~/requests/GetHistory'
import { Differences } from '../listings/Differences'
import PriceHistoryChart from './PriceHistoryChart'
import SaleHistoryTable from './SaleHistoryTable'
import SalesByHourChart from './SalesByHourChart'
import SuspiciousSaleTable from './SuspiciousSalesTable'

const Results = ({ data }: { data: HistoryResponse }) => (
  <div className="max-w-4xl mx-auto px-4">
    <h2 className="text-xl font-semibold text-blue-900 py-2 ml-8">
      Region Wide Pricing and Sales
    </h2>
    <div className="flex flex-col justify-around mx-3 my-6 md:flex-row">
      <div className="flex flex-col max-w-full">
        <Differences
          diffTitle="Average Price Per Unit Sold"
          diffAmount={data.average_ppu}
          className="bg-blue-100 text-blue-900 font-semibold "
        />
        <Differences
          diffTitle="Median Price Per Unit Sold"
          diffAmount={data.median_ppu}
          className="bg-blue-100 text-blue-900 font-semibold "
        />
      </div>
      <div className="flex flex-col max-w-full">
        <Differences
          diffTitle="Average quantity sold per day"
          diffAmount={data.average_quantity_sold_per_day}
          className="bg-blue-100 text-blue-900 font-semibold "
        />
        <Differences
          diffTitle="Average amount Sold per day"
          diffAmount={data.average_sales_per_day}
          className="bg-blue-100 text-blue-900 font-semibold "
        />
        <Differences
          diffTitle="Total Sold"
          diffAmount={data.total_quantity_sold}
          className="bg-blue-100 text-blue-900 font-semibold "
        />
      </div>
    </div>

    <div className="my-6 px-3 pb-2 pt-4 sm:rounded-md bg-white shadow">
      <h2 className="text-2xl font-semibold text-blue-900 py-2 ml-8">
        Region Price History
      </h2>
      <PriceHistoryChart data={data.price_history} />
    </div>

    <SaleHistoryTable data={data.stack_chance} />

    <div className="my-6 px-3 pb-2 pt-4 sm:rounded-md bg-white shadow">
      <h2 className="text-xl font-semibold text-blue-900 py-2 ml-8">
        Home Server Sales per Hour
      </h2>
      <SalesByHourChart data={data.home_server_sales_by_hour_chart} />
    </div>

    <div className="my-6 px-3 pb-2 pt-4 sm:rounded-md bg-white shadow">
      <h2 className="text-2xl font-semibold text-blue-900 py-2 ml-8">
        Region Wide Suspicious Sales
      </h2>
      {data.dirty_sales.length ? (
        <SuspiciousSaleTable data={data.dirty_sales} />
      ) : (
        <p className="italic text-sm text-grey-500 px-3">
          No suspicious sales found
        </p>
      )}
    </div>
  </div>
)

export default Results
