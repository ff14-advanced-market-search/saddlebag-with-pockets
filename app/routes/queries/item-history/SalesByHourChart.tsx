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
  data
}: {
  data: Array<HomeServerSalesByHour>
}) {
  const xAxisCategories = data.map(
    ({ time }) => makeDateString(time).split(' ')[1]
  )

  const options: Options = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Hourly Sales'
    },
    yAxis: {
      title: {
        text: 'No# of Sales'
      }
    },

    xAxis: {
      categories: xAxisCategories
    },

    series: [
      {
        data: data.map<PointOptionsObject>(({ sale_amt, time }) => {
          return [makeDateString(time), sale_amt]
        }),
        name: 'Sales Per Hour',
        type: 'line'
      }
    ],
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
