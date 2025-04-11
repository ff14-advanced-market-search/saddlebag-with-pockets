import type { Options } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

interface WeeklyDataPoint {
  p: number // price
  q: number // quantity
  t: number // timestamp
  delta: number // price change %
}

/**
 * Renders a scatter plot showing price vs quantity relationship from weekly data points.
 * @example
 * WeeklyPriceQuantityChart({ 
 *   weeklyData: [{p: 10, q: 5, t: 123, delta: 0}],
 *   darkMode: true, 
 *   itemName: 'Product A' 
 * })
 */
export default function WeeklyPriceQuantityChart({
  weeklyData,
  darkMode,
  itemName
}: {
  weeklyData: Array<WeeklyDataPoint>
  darkMode: boolean
  itemName: string
}) {
  const styles = darkMode
    ? {
        backgroundColor: '#334155',
        color: 'white',
        hoverColor: '#f8f8f8'
      }
    : {}

  const options: Options = {
    chart: {
      type: 'scatter',
      backgroundColor: styles?.backgroundColor,
      zooming: {
        type: 'xy'
      }
    },
    legend: {
      itemStyle: { color: styles?.color },
      align: 'center',
      itemHoverStyle: { color: styles?.hoverColor }
    },
    title: {
      text: `${itemName} Price vs Quantity Analysis`,
      style: { color: styles?.color }
    },
    yAxis: {
      title: {
        text: 'Price',
        style: { color: styles?.color }
      },
      labels: { style: { color: styles?.color } },
      lineColor: styles?.color,
      gridLineColor: darkMode ? '#4a5568' : '#e2e8f0'
    },
    xAxis: {
      title: {
        text: 'Quantity',
        style: { color: styles?.color }
      },
      labels: { style: { color: styles?.color } },
      lineColor: styles?.color,
      gridLineColor: darkMode ? '#4a5568' : '#e2e8f0'
    },
    plotOptions: {
      scatter: {
        states: {
          hover: {
            enabled: true,
            lineWidth: 1
          }
        }
      }
    },
    tooltip: {
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      style: {
        color: darkMode ? '#ffffff' : '#000000'
      },
      formatter: function() {
        if (!this.point) return ''
        const point = this.point as any
        const date = new Date(point.timestamp)
        return `<b>${itemName}</b><br/>
                Date: ${date.toLocaleDateString()}<br/>
                Price: ${point.y.toLocaleString()}<br/>
                Quantity: ${point.x.toLocaleString()}<br/>
                Delta: ${point.delta.toFixed(2)}%`
      }
    },
    series: [{
      type: 'scatter',
      name: 'Price vs Quantity',
      data: weeklyData.map((point) => ({
        x: point.q,
        y: point.p,
        timestamp: point.t,
        delta: point.delta
      })),
      color: '#34d399'
    }],
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
} 