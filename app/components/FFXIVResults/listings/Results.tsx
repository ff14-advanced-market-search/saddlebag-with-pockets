import type { ListingResponseType } from '~/requests/FFXIV/GetListing'
import { Differences } from './Differences'
import ListingTable from './ListingTable'
import { format, subHours } from 'date-fns'
import type { Options } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { ContentContainer } from '~/components/Common'

const makeTimeString = ({
  date,
  hoursToDeduct,
  formatString = 'HH:00'
}: {
  date: Date
  hoursToDeduct: number
  formatString?: string
}) => {
  const newDate = new Date(date.getTime() - hoursToDeduct * 60 * 60 * 1000)
  return {
    name: newDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    fullDate: newDate.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
}

const CombinedPriceQuantityChart = ({
  darkMode,
  priceData,
  quantityData,
  chartTitle,
  xCategories
}: {
  darkMode: boolean
  priceData: number[]
  quantityData: number[]
  chartTitle: string
  xCategories: Array<{ name: string; fullDate: string }>
}) => {
  const styles = darkMode
    ? {
        backgroundColor: '#334155',
        color: 'white',
        hoverColor: '#f8f8f8'
      }
    : {}

  const options: Options = {
    chart: {
      type: 'line',
      backgroundColor: styles?.backgroundColor,
      height: 400,
      spacingBottom: 5
    },
    legend: {
      itemStyle: { color: styles?.color },
      align: 'center',
      itemHoverStyle: { color: styles?.hoverColor }
    },
    title: {
      text: chartTitle,
      style: { color: styles?.color },
      margin: 20
    },
    yAxis: [
      {
        title: {
          text: 'Price',
          style: { color: styles?.color }
        },
        labels: { style: { color: styles?.color } },
        lineColor: styles?.color,
        min: 0,
        softMax: Math.max(...priceData) * 1.1,
        startOnTick: false,
        endOnTick: false,
        tickAmount: 8
      },
      {
        title: {
          text: 'Total Quantity',
          style: { color: styles?.color }
        },
        labels: { style: { color: styles?.color } },
        lineColor: styles?.color,
        opposite: true,
        min: 0,
        softMax: Math.max(...quantityData) * 1.1,
        startOnTick: false,
        endOnTick: false,
        tickAmount: 8
      }
    ],
    xAxis: {
      categories: xCategories.map((x) => x.name),
      labels: { style: { color: styles?.color } },
      lineColor: styles?.color
    },
    tooltip: {
      formatter: function () {
        const point = this.point
        const index = point.index || 0
        return `${xCategories[index].fullDate}<br/>${point.series.name}: ${point.y}`
      }
    },
    series: [
      {
        name: 'Minimum Price',
        type: 'area',
        color: '#dae4ff',
        data: priceData,
        yAxis: 0
      },
      {
        name: 'Total Quantity',
        type: 'line',
        color: '#fbb7b2',
        data: quantityData,
        yAxis: 1
      }
    ],
    credits: {
      enabled: false
    }
  }
  return <HighchartsReact highcharts={Highcharts} options={options} />
}

/**
 * Renders price and time differences as well as a listing table based on the data provided.
 * @example
 * renderDifferences({ data: listingResponse })
 * // Returns a JSX element displaying price differences and listing table
 * @param {Object} data - An object containing listing and difference data.
 * @returns {JSX.Element} JSX to display the information.
 * @description
 *   - Displays the average and median price differences with conditional styling based on their values.
 *   - Only the 'listing_price_diff' and 'min_price' are currently rendered; time differences are commented out.
 *   - The class names used for styling are based on the price difference values.
 */
const Results = ({ data }: { data: ListingResponseType }) => {
  const { darkmode } = useTypedSelector((state) => state.user)
  const now = new Date()
  // Ensure we show exactly 168 hours (7 days) of data
  const totalHours = 168
  const xCategories = data.priceTimeData.map((_, index) => {
    const hoursToDeduct = data.priceTimeData.length - index - 1
    return makeTimeString({
      date: new Date(),
      hoursToDeduct
    })
  })

  return (
    <>
      {data.priceTimeData.length > 0 &&
        data.quantityTimeData.length > 0 &&
        data.priceTimeData.some((val) => val !== 0) &&
        data.quantityTimeData.some((val) => val !== 0) && (
          <ContentContainer>
            <CombinedPriceQuantityChart
              chartTitle="Min Price & Total Quantity"
              darkMode={darkmode}
              priceData={data.priceTimeData.slice(-totalHours)}
              quantityData={data.quantityTimeData.slice(-totalHours)}
              xCategories={xCategories}
            />
          </ContentContainer>
        )}

      {data.priceTimeDataHQ.length > 0 &&
        data.quantityTimeDataHQ.length > 0 &&
        data.priceTimeDataHQ.some((val) => val !== 0) &&
        data.quantityTimeDataHQ.some((val) => val !== 0) && (
          <ContentContainer>
            <CombinedPriceQuantityChart
              chartTitle="HQ Min Price & Total Quantity"
              darkMode={darkmode}
              priceData={data.priceTimeDataHQ.slice(-totalHours)}
              quantityData={data.quantityTimeDataHQ.slice(-totalHours)}
              xCategories={xCategories}
            />
          </ContentContainer>
        )}
      <div className="flex flex-col justify-around mx-3 my-1 sm:flex-row">
        {'listing_price_diff' in data && (
          <Differences
            diffTitle="Avg Price Difference"
            diffAmount={`${data.listing_price_diff.avg_price_diff.toLocaleString()} gil`}
            className={
              data.listing_price_diff.avg_price_diff >= 10000
                ? 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
                : 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
            }
          />
        )}
        {'listing_price_diff' in data && (
          <Differences
            diffTitle="Median Price Difference"
            diffAmount={`${data.listing_price_diff.median_price_diff.toLocaleString()} gil`}
            className={
              data.listing_price_diff.median_price_diff >= 10000
                ? 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
                : 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
            }
          />
        )}
        {/* doesnt work anymore but leave it here for reference */}
        {/* {'listing_time_diff' in data && (
          <Differences
            diffTitle="Avg Time Difference"
            diffAmount={`${data.listing_time_diff.avg_time_diff.toLocaleString()} minutes`}
            className={
              data.listing_time_diff.avg_time_diff >= 30
                ? 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
                : 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
            }
          />
        )}
        {'listing_time_diff' in data && (
          <Differences
            diffTitle="Median Time Difference"
            diffAmount={`${data.listing_time_diff.median_time_diff.toLocaleString()} minutes`}
            className={
              data.listing_time_diff.median_time_diff >= 30
                ? 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
                : 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
            }
          />
        )} */}
        {'min_price' in data && (
          <Differences
            diffTitle="Minimum Price"
            diffAmount={`${data.min_price.toLocaleString()} gil`}
            className={
              'bg-blue-100 font-semibold text-blue-600  dark:bg-blue-600 dark:text-gray-100'
            }
          />
        )}
        {data.current_price_vs_median_percent > 0 && (
          <Differences
            diffTitle="Min Price vs Median"
            diffAmount={`${data.current_price_vs_median_percent.toFixed(1)}%`}
            className={
              data.current_price_vs_median_percent < 70
                ? 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
                : data.current_price_vs_median_percent <= 130
                ? 'bg-yellow-100 font-semibold text-yellow-600 dark:bg-yellow-600 dark:text-gray-100'
                : 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
            }
          />
        )}
        {data.current_quantity_vs_median_percent > 0 && (
          <Differences
            diffTitle="Total Quantity vs Median"
            diffAmount={`${data.current_quantity_vs_median_percent.toFixed(
              1
            )}%`}
            className={
              data.current_quantity_vs_median_percent > 130
                ? 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
                : data.current_quantity_vs_median_percent >= 70
                ? 'bg-yellow-100 font-semibold text-yellow-600 dark:bg-yellow-600 dark:text-gray-100'
                : 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
            }
          />
        )}
        {data.current_hq_price_vs_median_percent > 0 && (
          <Differences
            diffTitle="HQ Min Price vs Median"
            diffAmount={`${data.current_hq_price_vs_median_percent.toFixed(
              1
            )}%`}
            className={
              data.current_hq_price_vs_median_percent < 70
                ? 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
                : data.current_hq_price_vs_median_percent <= 130
                ? 'bg-yellow-100 font-semibold text-yellow-600 dark:bg-yellow-600 dark:text-gray-100'
                : 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
            }
          />
        )}
        {data.current_hq_quantity_vs_median_percent > 0 && (
          <Differences
            diffTitle="HQ Total Quantity vs Median"
            diffAmount={`${data.current_hq_quantity_vs_median_percent.toFixed(
              1
            )}%`}
            className={
              data.current_hq_quantity_vs_median_percent > 130
                ? 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
                : data.current_hq_quantity_vs_median_percent >= 70
                ? 'bg-yellow-100 font-semibold text-yellow-600 dark:bg-yellow-600 dark:text-gray-100'
                : 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
            }
          />
        )}
      </div>

      <ListingTable data={data} />
    </>
  )
}

export default Results
