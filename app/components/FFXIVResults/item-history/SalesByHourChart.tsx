import type { Options } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { HomeServerSalesByHour } from '~/requests/FFXIV/GetHistory'

export default function SalesByHourChart({
  data,
  darkMode
}: {
  data: Array<HomeServerSalesByHour>
  darkMode: boolean
}) {
  const now = new Date()
  // Get just the sale amounts in order
  const salesData = data.map(d => d.sale_amt)

  // Generate time categories the same way as the other chart
  const xCategories = salesData.map((_, index) => {
    const hoursToDeduct = salesData.length - index - 1
    const date = new Date(now.getTime() - hoursToDeduct * 60 * 60 * 1000)
    date.setMinutes(0)
    return {
      name: `${date.getHours().toString().padStart(2, '0')}:00`,
      fullDate: `${date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })} ${date.getHours().toString().padStart(2, '0')}:00`
    }
  })

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
      text: undefined,
      style: { color: styles?.color }
    },
    yAxis: [
      {
        title: {
          text: 'No# of Sales',
          style: { color: styles?.color }
        },
        labels: { style: { color: styles?.color } },
        lineColor: styles?.color,
        min: 0,
        softMax: Math.max(...salesData) * 1.1,
        startOnTick: false,
        endOnTick: false,
        tickAmount: 8
      }
    ],
    xAxis: {
      categories: xCategories.map(x => x.name),
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
        data: salesData,
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
