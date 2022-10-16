import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import type { PriceHistory } from '~/requests/GetHistory'

export default function PriceHistoryChart({
  data
}: {
  data: Array<PriceHistory>
}) {
  const xAxisCategories = data.map(({ price_range }) => price_range)

  const options: Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Price History'
    },
    yAxis: {
      title: {
        text: 'Sale Amount'
      }
    },

    xAxis: {
      categories: xAxisCategories,
      title: { text: 'Price Ranges' }
    },

    series: [
      {
        data: data.map<PointOptionsObject>(({ sales_amount, price_range }) => {
          return [price_range, sales_amount]
        }),
        name: 'Amount sold in range',
        type: 'column'
      }
    ],
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
