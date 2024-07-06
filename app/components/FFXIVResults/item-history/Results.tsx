import { ContentContainer, TitleH2 } from '~/components/Common'
import type { HistoryResponse } from '~/requests/GetHistory'
import { Differences } from '../listings/Differences'
import PriceHistoryChart from './PriceHistoryChart'
import SaleHistoryTable from './SaleHistoryTable'
import SalesByHourChart from './SalesByHourChart'
import SuspiciousSaleTable from './SuspiciousSalesTable'
import ServerDistributionChart from './ServerDistributionChart'

const Results = ({
  data,
  darkMode
}: {
  data: HistoryResponse
  darkMode: boolean
}) => (
  <div className="max-w-4xl mx-auto px-4">
    <TitleH2 title="Region Wide Pricing and Sales" />
    <div className="flex flex-col justify-around mx-3 my-6 md:flex-row">
      <div className="flex flex-col max-w-full">
        <Differences
          diffTitle="Median Price Per Unit Sold"
          diffAmount={data.median_ppu}
          className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
        />
        <Differences
          diffTitle="Average Price Per Unit Sold"
          diffAmount={data.average_ppu}
          className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
        />
      </div>
      <div className="flex flex-col max-w-full">
        <Differences
          diffTitle="Average Purchases per day"
          diffAmount={data.average_sales_per_day}
          className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
        />
        <Differences
          diffTitle="Total Purchases per week"
          diffAmount={data.total_purchase_amount}
          className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
        />
      </div>
      <div className="flex flex-col max-w-full">
        <Differences
          diffTitle="Average Quantity Sold per day"
          diffAmount={data.average_quantity_sold_per_day}
          className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
        />
        <Differences
          diffTitle="Total Quantity Sold per week"
          diffAmount={data.total_quantity_sold}
          className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
        />
      </div>
    </div>

    <ContentContainer>
      <>
        <TitleH2 title="Region Price History" />
        <PriceHistoryChart data={data.price_history} darkMode={darkMode} />
      </>
    </ContentContainer>

    <ContentContainer>
      <>
        <TitleH2 title="Region Wide Server Sales Distribution" />
        {Object.keys(data.server_distribution).length ? (
          <ServerDistributionChart
            data={data.server_distribution}
            darkMode={darkMode}
          />
        ) : (
          <p className="italic text-sm text-grey-500 px-3 dark:text-gray-200">
            No sales found
          </p>
        )}
      </>
    </ContentContainer>

    <SaleHistoryTable data={data.stack_chance} />

    <ContentContainer>
      <>
        <TitleH2 title="Home Server Sales per Hour" />
        <SalesByHourChart
          data={data.home_server_sales_by_hour_chart}
          darkMode={darkMode}
        />
      </>
    </ContentContainer>

    <ContentContainer>
      <>
        <TitleH2 title="Region Wide Suspicious Sales" />
        {data.dirty_sales.length ? (
          <SuspiciousSaleTable data={data.dirty_sales} />
        ) : (
          <p className="italic text-sm text-grey-500 px-3 dark:text-gray-200">
            No suspicious sales found
          </p>
        )}
      </>
    </ContentContainer>
  </div>
)

export default Results
