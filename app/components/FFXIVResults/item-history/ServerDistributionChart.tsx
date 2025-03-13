import type { Options } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { ServerDistribution } from '~/requests/FFXIV/GetHistory'

/**
 * Renders a server distribution chart with customizable styles based on dark mode preference.
 * @example
 * ServerDistributionChart({ data: { 'Server1': 10, 'Server2': 20 }, darkMode: true })
 * // Renders a chart with servers' sales distribution, styled for dark mode.
 * @param {Object} data - The server distribution data where keys are server names and values are the number of sales.
 * @param {boolean} darkMode - A flag indicating whether the chart should be styled for dark mode.
 * @returns {JSX.Element} A HighchartsReact component configured to display the server data in a column chart format.
 * @description
 *   - Utilizes HighchartsReact for rendering the chart.
 *   - Adapts chart styles dynamically based on the darkMode flag.
 *   - Disables chart credits in the output.
 */
export default function ServerDistributionChart({
  data,
  darkMode
}: {
  data: ServerDistribution
  darkMode: boolean
}) {
  const seriesData = Object.entries(data).sort()
  const xAxisCategories = seriesData.map(([server]) => server)

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
        text: 'Server',
        style: { color: styles?.color, textAlign: 'center' }
      },
      labels: { style: { color: styles?.color } },
      lineColor: styles?.color
    },

    series: [
      {
        data: seriesData,
        name: 'No# of Sales per Server',
        type: 'column'
      }
    ],
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
