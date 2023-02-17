import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { HomeServerSalesByHour } from '~/requests/GetHistory'

const makeDateString = (timeStampInSeconds: number) => {
  const date = new Date(timeStampInSeconds * 1000)
  const dateStringParts = date.toISOString().split('T')
  return `${dateStringParts[0]} ${dateStringParts[1].split(':')[0]}:00`
}

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
    yAxis: {
      title: {
        text: 'No# of Sales',
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
