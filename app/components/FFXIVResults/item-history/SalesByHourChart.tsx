import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { HomeServerSalesByHour } from '~/requests/FFXIV/GetHistory'

const makeDateString = (timeStampInSeconds: number) => {
  const date = new Date(timeStampInSeconds * 1000)
  // Set minutes to 00 for consistent hourly display
  date.setMinutes(0)
  return {
    time: `${date.getHours().toString().padStart(2, '0')}:00`,
    fullDate: `${date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })} ${date.getHours().toString().padStart(2, '0')}:00`
  }
}

/**
 * Generates a configurable line chart representing sales by hour.
 * @example
 * SalesByHourChart({ data: salesData, darkMode: true })
 * // returns a line chart component displaying sales data per hour.
 * @param {Array<HomeServerSalesByHour>} data - Array of sales data objects with time and sale amount.
 * @param {boolean} darkMode - Flag indicating whether to use dark mode styling.
 * @returns {JSX.Element} A React component rendering a line chart configured with the provided sales data.
 * @description
 *   - The function maps the sales data to extract time information for x-axis categories.
 *   - Styles are conditionally applied based on the darkMode flag.
 *   - HighchartsReact component is used to render the chart with options defined via props.
 */
export default function SalesByHourChart({
  data,
  darkMode
}: {
  data: Array<HomeServerSalesByHour>
  darkMode: boolean
}) {
  // Sort data by time in descending order to ensure newest first
  const sortedData = [...data].sort((a, b) => b.time - a.time)

  // Group sales by hour and sum them
  const hourlyData = sortedData.reduce<
    Record<string, { time: number; sale_amt: number }>
  >((acc, curr) => {
    const dateStr = makeDateString(curr.time)
    if (!acc[dateStr.time]) {
      acc[dateStr.time] = { time: curr.time, sale_amt: 0 }
    }
    acc[dateStr.time].sale_amt += curr.sale_amt
    return acc
  }, {})

  // Convert back to array and sort by time
  const aggregatedData = Object.values(hourlyData).sort(
    (a, b) => b.time - a.time
  )

  const xAxisCategories = aggregatedData.map(
    ({ time }) => makeDateString(time).time
  )

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
      text: undefined,
      style: { color: styles?.color }
    },
    yAxis: [
      {
        title: {
          text: 'No# of Sales',
          style: { color: styles?.color, textAlign: 'center' }
        },
        labels: { style: { color: styles?.color }, align: 'center' },
        lineColor: styles.color,
        opposite: false
      },
      {
        title: {
          text: 'No# of Sales',
          style: { color: styles?.color, textAlign: 'center' }
        },
        labels: { style: { color: styles?.color }, align: 'center' },
        lineColor: styles?.color,
        opposite: true
      }
    ],

    xAxis: {
      categories: xAxisCategories,
      labels: { style: { color: styles?.color }, align: 'center' },
      lineColor: styles?.color
    },

    series: [
      {
        data: aggregatedData.map<PointOptionsObject>(({ sale_amt, time }) => {
          const dateStr = makeDateString(time)
          return {
            x: xAxisCategories.indexOf(dateStr.time),
            y: sale_amt,
            name: dateStr.fullDate
          }
        }),
        name: 'Sales per Hour',
        type: 'line'
      }
    ],
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
