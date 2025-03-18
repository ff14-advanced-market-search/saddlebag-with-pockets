import type { ListingResponseType } from '~/requests/FFXIV/GetListing'
import { Differences } from './Differences'
import ListingTable from './ListingTable'
import { format, subHours } from 'date-fns'
import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { ContentContainer } from '~/components/Common'

const makeTimeString = ({
  date,
  hoursToDeduct,
  formatString = 'dd/MM h aaaa'
}: {
  date: Date
  hoursToDeduct: number
  formatString?: string
}) => {
  const newDate = subHours(date, hoursToDeduct)
  return format(newDate, formatString)
}

const GenericLineChart = ({
  darkMode,
  data,
  chartTitle,
  xTitle,
  yTitle,
  xLabelFormat,
  yLabelFormat,
  dataIterator,
  xCategories
}: {
  darkMode: boolean
  data: number[]
  chartTitle?: string
  xTitle?: string
  yTitle?: string
  xLabelFormat?: string
  yLabelFormat?: string
  dataIterator?: (value: number, index: number) => PointOptionsObject
  xCategories?: Array<string>
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
      backgroundColor: styles?.backgroundColor
    },
    legend: {
      itemStyle: { color: styles?.color },
      align: 'center',
      itemHoverStyle: { color: styles?.hoverColor }
    },
    title: {
      text: chartTitle,
      style: { color: styles?.color }
    },
    yAxis: {
      title: {
        text: yTitle,
        style: {
          color: styles?.color,
          textAlign: 'center'
        }
      },
      labels: {
        style: { color: styles?.color },
        align: 'center',
        format: yLabelFormat
      },
      lineColor: styles?.color
    },
    xAxis: {
      title: {
        text: xTitle,
        style: {
          color: styles?.color,
          textAlign: 'center'
        }
      },
      categories: xCategories,
      labels: {
        style: { color: styles?.color },
        align: 'right',
        format: xLabelFormat
      },
      lineColor: styles?.color
    },
    series: [
      {
        data: dataIterator ? data.map<PointOptionsObject>(dataIterator) : data,
        name: chartTitle,
        type: 'line'
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
  const xCategories = data.priceTimeData.map((_, hoursToDeduct, arr) =>
    makeTimeString({
      date: now,
      hoursToDeduct: arr.length - hoursToDeduct
    })
  )

  return (
    <>
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
      </div>

      <ListingTable data={data} />

      {data.priceTimeData.length > 0 &&
        data.priceTimeData.some((val) => val !== 0) && (
          <ContentContainer>
            <GenericLineChart
              chartTitle="Minimum Price Over Time"
              darkMode={darkmode}
              data={data.priceTimeData}
              dataIterator={(val, ind) => [
                makeTimeString({
                  date: now,
                  hoursToDeduct: data.priceTimeData.length - ind
                }),
                val
              ]}
              xCategories={xCategories}
            />
          </ContentContainer>
        )}

      {data.priceTimeDataHQ.length > 0 &&
        data.priceTimeDataHQ.some((val) => val !== 0) && (
          <ContentContainer>
            <GenericLineChart
              chartTitle="HQ Minimum Price Over Time"
              darkMode={darkmode}
              data={data.priceTimeDataHQ}
              dataIterator={(val, ind) => [
                makeTimeString({
                  date: now,
                  hoursToDeduct: data.priceTimeDataHQ.length - ind
                }),
                val
              ]}
              xCategories={xCategories}
            />
          </ContentContainer>
        )}

      {data.quantityTimeData.length > 0 &&
        data.quantityTimeData.some((val) => val !== 0) && (
          <ContentContainer>
            <GenericLineChart
              chartTitle="Total Quantity Over Time"
              darkMode={darkmode}
              data={data.quantityTimeData}
              dataIterator={(val, ind) => [
                makeTimeString({
                  date: now,
                  hoursToDeduct: data.quantityTimeData.length - ind
                }),
                val
              ]}
              xCategories={xCategories}
            />
          </ContentContainer>
        )}

      {data.quantityTimeDataHQ.length > 0 &&
        data.quantityTimeDataHQ.some((val) => val !== 0) && (
          <ContentContainer>
            <GenericLineChart
              chartTitle="HQ Quantity Over Time"
              darkMode={darkmode}
              data={data.quantityTimeDataHQ}
              dataIterator={(val, ind) => [
                makeTimeString({
                  date: now,
                  hoursToDeduct: data.quantityTimeDataHQ.length - ind
                }),
                val
              ]}
              xCategories={xCategories}
            />
          </ContentContainer>
        )}
    </>
  )
}

export default Results
