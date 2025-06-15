import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

interface GenericLineChartProps {
  darkMode: boolean
  data: Array<number>
  chartTitle?: string
  xTitle?: string
  yTitle?: string
  xLabelFormat?: string
  yLabelFormat?: string
  dataIterator?: (value: number, index: number) => PointOptionsObject
  xCategories?: Array<string>
}

const GenericLineChart = ({
  darkMode,
  data,
  chartTitle,
  xTitle,
  yTitle,
  xLabelFormat,
  yLabelFormat,
  dataIterator,
  xCategories
}: GenericLineChartProps) => {
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
      text: chartTitle,
      style: { color: styles?.color }
    },
    yAxis: {
      title: {
        text: yTitle,
        style: {
          color: styles?.color,
          textAlign: 'center'
        }
      },
      labels: {
        style: { color: styles?.color },
        align: 'center',
        format: yLabelFormat
      },
      lineColor: styles?.color
    },
    xAxis: {
      title: {
        text: xTitle,
        style: {
          color: styles?.color,
          textAlign: 'center'
        }
      },
      categories: xCategories,
      labels: {
        style: { color: styles?.color },
        align: 'right',
        format: xLabelFormat
      },
      lineColor: styles?.color
    },
    series: [
      {
        data: dataIterator ? data.map<PointOptionsObject>(dataIterator) : data,
        name: chartTitle,
        type: 'line'
      }
    ],
    credits: {
      enabled: false
    }
  }
  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default GenericLineChart
