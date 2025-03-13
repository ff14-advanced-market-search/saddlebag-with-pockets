import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { PriceHistory } from '~/requests/FFXIV/GetHistory'

/**
* Creates a price history column chart with custom styles based on dark mode preference
* @example
* PriceHistoryChart({ data: [{ sales_amount: 10, price_range: '0-10' }], darkMode: true })
* // Returns a HighchartsReact component showing a column chart
* @param {Object} param0 - An object containing the chart options.
* @param {Array<PriceHistory>} param0.data - The price history data for generating the chart.
* @param {boolean} param0.darkMode - A boolean indicating if dark mode styling should be applied.
* @returns {JSX.Element} A HighchartsReact component configured with the provided data and styling.
* @description
*   - Applies specific styles to the chart elements based on the current dark mode setting.
*   - Constructs axis titles and chart series data using mapped values from the input data.
*   - Includes no chart credits for a cleaner look.
*/
export default function PriceHistoryChart({
  data,
  darkMode
}: {
  data: Array<PriceHistory>
  darkMode: boolean
}) {
  const xAxisCategories = data.map(({ price_range }) => price_range)

  const styles = darkMode
    ? {
        backgroundColor: '#334155',
        color: 'white',
        hoverColor: '#f8f8f8'
      }
    : {}

  const options: Options = {
    chart: {
      type: 'column',
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
    yAxis: {
      title: {
        text: 'No# of sales',
        style: { color: styles?.color, textAlign: 'center' }
      },
      labels: { style: { color: styles?.color } },
      lineColor: styles?.color
    },

    xAxis: {
      categories: xAxisCategories,
      title: {
        text: 'Price Ranges in Gil',
        style: { color: styles?.color, textAlign: 'center' }
      },
      labels: { style: { color: styles?.color } },
      lineColor: styles?.color
    },

    series: [
      {
        data: data.map<PointOptionsObject>(({ sales_amount, price_range }) => {
          return [price_range, sales_amount]
        }),
        name: 'No# of Purchases in Price Range',
        type: 'column'
      }
    ],
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
