import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { PriceHistory } from '~/requests/GetHistory'

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
        style: { color: styles?.color, textAlign: 'center' },
        align: 'middle'
      },
      labels: { style: { color: styles?.color }, align: 'center' },
      lineColor: styles?.color
    },

    xAxis: {
      categories: xAxisCategories,
      title: {
        text: 'Price Ranges in Gil',
        style: { color: styles?.color, textAlign: 'left' },
        align: 'middle'
      },
      labels: { style: { color: styles?.color }, align: 'left' },
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
