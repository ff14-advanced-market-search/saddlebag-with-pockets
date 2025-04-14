import type { Options, TooltipFormatterContextObject } from 'highcharts'
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

// Format tooltip content with proper error handling
const formatTooltip = (
  points: TooltipFormatterContextObject[],
  itemName: string,
  weeklyData: Array<WeeklyDataPoint>
): string => {
  if (!points?.length || !weeklyData?.length) return ''

  try {
    const point = points[0]
    const index = point.point.index
    if (index === undefined || index < 0 || index >= weeklyData.length) {
      return ''
    }

    const data = weeklyData[index]
    return `<div style="min-width: 150px;">
      <b>${itemName}</b><br/>
      <span style="color: #666;">Date:</span> ${formatTimestamp(data.t)}<br/>
      <span style="color: #666;">Price:</span> ${data.p.toLocaleString()}<br/>
      <span style="color: #666;">Quantity:</span> ${data.q.toLocaleString()}<br/>
      <span style="color: #666;">Delta:</span> ${data.delta.toFixed(2)}%
    </div>`
  } catch (error) {
    console.error('Error formatting tooltip:', error)
    return ''
  }
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
      height: 400,
      style: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }
    },
    title: {
      text: `${itemName} Price & Quantity`,
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
          formatter: function () {
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
          formatter: function () {
            return (this.value as number).toLocaleString()
          }
        },
        lineColor: styles?.color,
        gridLineColor: darkMode ? '#4a5568' : '#e2e8f0',
        opposite: true
      }
    ],
    xAxis: {
      categories: weeklyData.map((point) => formatTimestamp(point.t)),
      labels: {
        style: { color: styles?.color }
      },
      lineColor: styles?.color,
      gridLineColor: darkMode ? '#4a5568' : '#e2e8f0'
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      style: {
        color: darkMode ? '#ffffff' : '#000000'
      },
      formatter: function (this: { points?: TooltipFormatterContextObject[] }) {
        return formatTooltip(this.points || [], itemName, weeklyData)
      },
      padding: 8,
      shadow: true,
      borderWidth: 1,
      borderColor: darkMode ? '#374151' : '#e5e7eb'
    },
    series: [
      {
        name: 'Minimum Price',
        type: 'area',
        data: weeklyData.map((point) => point.p),
        color: darkMode ? '#93c5fd' : '#dae4ff', // Lighter blue in dark mode
        fillOpacity: 0.3,
        yAxis: 0
      },
      {
        name: 'Total Quantity',
        type: 'line',
        data: weeklyData.map((point) => point.q),
        color: darkMode ? '#fca5a5' : '#fbb7b2', // Lighter red in dark mode
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
