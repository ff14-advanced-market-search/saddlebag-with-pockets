import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import subHours from 'date-fns/subHours'
import format from 'date-fns/format'

const getHourString = (index: number, arrayLength: number) => {
  return `${format(subHours(new Date(), arrayLength - index), 'HH')}:00`
}

/**
 * Renders a line chart displaying price and quantity over the previous 24 hours.
 * @example
 * PriceQuantityLineChart({ prices: [10, 20], quantities: [5, 15], darkMode: true, itemName: 'Product A' })
 * Renders the line chart component with the specified data and styles.
 * @param {Array<number>} prices - Array representing price points over the past 24 hours.
 * @param {Array<number>} quantities - Array representing quantity points over the past 24 hours.
 * @param {boolean} darkMode - Boolean flag to determine if dark mode styling should be applied.
 * @param {string} itemName - Name of the item being represented in the chart.
 * @returns {JSX.Element} Returns a Highcharts React component.
 * @description
 *   - Automatically adjusts styling based on the darkMode flag to enhance visibility.
 *   - Constructs X-axis labels dynamically based on the 24-hour period.
 */
export default function PriceQuantityLineChart({
  prices,
  quantities,
  darkMode,
  itemName
}: {
  prices: Array<number>
  quantities: Array<number>
  darkMode: boolean
  itemName: string
}) {
  const styles = darkMode
    ? {
        backgroundColor: '#334155',
        color: 'white',
        hoverColor: '#f8f8f8'
      }
    : {}

  const xAxisCategories = prices.map((_, index, array) =>
    getHourString(index, array.length)
  )

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
      text: `${itemName} Price & Quanitity previous 24 hours`,
      style: { color: styles?.color }
    },
    yAxis: {
      title: {
        text: 'Price & Quantity',
        style: { color: styles?.color, textAlign: 'center' }
      },
      labels: { style: { color: styles?.color }, align: 'center' },
      lineColor: styles?.color
    },

    xAxis: {
      categories: xAxisCategories,
      labels: { style: { color: styles?.color }, align: 'center' },
      lineColor: styles?.color
    },

    series: [
      {
        data: prices.map<PointOptionsObject>((amount, index, array) => {
          return [getHourString(index, array.length), amount]
        }),
        name: 'Avg Price per Hour',
        type: 'area',
        color: '#dae4ff'
      },
      {
        data: quantities.map<PointOptionsObject>((amount, index, array) => {
          return [getHourString(index, array.length), amount]
        }),
        name: 'Avg Quantity per Hour',
        type: 'line',
        color: '#fbb7b2'
      }
    ],
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
