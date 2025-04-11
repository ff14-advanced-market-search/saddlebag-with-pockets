import type { Options } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

interface WeeklyDataPoint {
  p: number // price
  q: number // quantity
  t: number // timestamp
  delta: number // price change %
}

// Format timestamp into YYYY-MM-DD
const formatTimestamp = (timestamp: number) => {
  const dateStr = timestamp.toString().padStart(8, '0') // Ensure 8 digits
  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)
  return `${year}-${month}-${day}`
}

/**
 * Renders a line chart showing price and quantity over time.
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
      type: 'line',
      backgroundColor: styles?.backgroundColor,
      height: 400
    },
    title: {
      text: `${itemName} Price & Quantity previous 24 hours`,
      style: { color: styles?.color }
    },
    yAxis: [
      {
        // Left y-axis for price
        title: {
          text: 'Price',
          style: { color: styles?.color }
        },
        labels: {
          style: { color: styles?.color },
          formatter: function() {
            return (this.value as number).toLocaleString()
          }
        },
        lineColor: styles?.color,
        gridLineColor: darkMode ? '#4a5568' : '#e2e8f0'
      },
      {
        // Right y-axis for quantity
        title: {
          text: 'Total Quantity',
          style: { color: styles?.color }
        },
        labels: {
          style: { color: styles?.color },
          formatter: function() {
            return (this.value as number).toLocaleString()
          }
        },
        lineColor: styles?.color,
        gridLineColor: darkMode ? '#4a5568' : '#e2e8f0',
        opposite: true
      }
    ],
    xAxis: {
      categories: weeklyData.map(point => formatTimestamp(point.t)),
      labels: { 
        style: { color: styles?.color }
      },
      lineColor: styles?.color,
      gridLineColor: darkMode ? '#4a5568' : '#e2e8f0'
    },
    tooltip: {
      shared: true,
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      style: {
        color: darkMode ? '#ffffff' : '#000000'
      },
      formatter: function() {
        if (!this.points) return ''
        const point = this.points[0]
        const data = weeklyData[point.point.index]
        return `<b>${itemName}</b><br/>
                Date: ${formatTimestamp(data.t)}<br/>
                Price: ${data.p.toLocaleString()}<br/>
                Quantity: ${data.q.toLocaleString()}<br/>
                Delta: ${data.delta.toFixed(2)}%`
      }
    },
    series: [
      {
        name: 'Minimum Price',
        type: 'area',
        data: weeklyData.map(point => point.p),
        color: '#dae4ff',
        yAxis: 0
      },
      {
        name: 'Total Quantity',
        type: 'line',
        data: weeklyData.map(point => point.q),
        color: '#fbb7b2',
        yAxis: 1
      }
    ],
    legend: {
      itemStyle: { color: styles?.color },
      align: 'center',
      itemHoverStyle: { color: styles?.hoverColor }
    },
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
} 