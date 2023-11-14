import type { Options } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { ServerDistribution } from '~/requests/GetHistory'

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
