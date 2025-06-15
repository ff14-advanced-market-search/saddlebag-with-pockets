import React, { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'
import type { Options, PointOptionsObject } from 'highcharts'

export interface LazyLineChartProps {
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

const LazyLineChart: React.FC<LazyLineChartProps> = ({
  darkMode,
  data,
  chartTitle,
  xTitle,
  yTitle,
  xLabelFormat,
  yLabelFormat,
  dataIterator,
  xCategories
}) => {
  // Local state that will hold the dynamically imported libs
  const [Highcharts, setHighcharts] = useState<any | null>(null)

  useEffect(() => {
    let isMounted = true
    import('highcharts').then((highchartsModule) => {
      if (!isMounted) return
      setHighcharts(highchartsModule.default ?? highchartsModule)
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (!Highcharts) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <span className="animate-pulse text-gray-500 dark:text-gray-300">
          Loading chart...
        </span>
      </div>
    )
  }

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
      backgroundColor: (styles as any).backgroundColor
    },
    legend: {
      itemStyle: { color: (styles as any).color },
      align: 'center',
      itemHoverStyle: { color: (styles as any).hoverColor }
    },
    title: {
      text: chartTitle,
      style: { color: (styles as any).color }
    },
    yAxis: {
      title: {
        text: yTitle,
        style: {
          color: (styles as any).color,
          textAlign: 'center'
        }
      },
      labels: {
        style: { color: (styles as any).color },
        align: 'center',
        format: yLabelFormat
      },
      lineColor: (styles as any).color
    },
    xAxis: {
      title: {
        text: xTitle,
        style: {
          color: (styles as any).color,
          textAlign: 'center'
        }
      },
      categories: xCategories,
      labels: {
        style: { color: (styles as any).color },
        align: 'right',
        format: xLabelFormat
      },
      lineColor: (styles as any).color
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

export default LazyLineChart
