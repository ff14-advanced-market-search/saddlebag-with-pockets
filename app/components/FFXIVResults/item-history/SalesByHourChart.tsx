import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { HomeServerSalesByHour } from '~/requests/FFXIV/GetHistory'

const makeDateString = (timeStampInSeconds: number) => {
  const date = new Date(timeStampInSeconds * 1000)
  const dateStringParts = date.toISOString().split('T')
  return `${dateStringParts[0]} ${dateStringParts[1].split(':')[0]}:00`
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
  const xAxisCategories = data.map(
    ({ time }) => makeDateString(time).split(' ')[1]
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
        data: data.map<PointOptionsObject>(({ sale_amt, time }) => {
          return [makeDateString(time), sale_amt]
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
