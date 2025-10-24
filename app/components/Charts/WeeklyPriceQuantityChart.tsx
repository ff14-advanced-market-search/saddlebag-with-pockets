import type { Options, TooltipFormatterContextObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

interface WeeklyDataPoint {
  p: number // price
  q: number // quantity
  t: number // timestamp
  delta: number // price change %
  tsmP?: number | null // optional TSM price
  tsmQ?: number | null // optional TSM quantity/sales
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
  weeklyData: WeeklyDataPoint[],
  isDarkMode: boolean
): string => {
  if (!points?.length || !weeklyData?.length) return ''

  try {
    const point = points[0]
    const index = point.point.index
    if (index === undefined || index < 0 || index >= weeklyData.length) {
      return ''
    }

    const labelColor = isDarkMode ? '#9ca3af' : '#666666' // gray-400 in dark mode
    const data = weeklyData[index]
    return `<div style="min-width: 150px; color: ${
      isDarkMode ? '#f3f4f6' : '#000000'
    };">
      <b>${itemName}</b><br/>
      <span style="color: ${labelColor};">Date:</span> ${formatTimestamp(
      data.t
    )}<br/>
      <span style="color: ${labelColor};">Min Price:</span> ${data.p.toLocaleString()}<br/>
      <span style="color: ${labelColor};">Quantity:</span> ${data.q.toLocaleString()}<br/>
      ${
        data.tsmP != null
          ? `<span style="color: ${labelColor};">TSM Price:</span> ${data.tsmP.toLocaleString()}<br/>`
          : ''
      }
      ${
        data.tsmQ != null
          ? `<span style="color: ${labelColor};">TSM Sales:</span> ${data.tsmQ.toLocaleString()}<br/>`
          : ''
      }
      <span style="color: ${labelColor};">Delta:</span> ${data.delta.toFixed(
      2
    )}%
    </div>`
  } catch (error) {
    console.error('Error formatting tooltip:', error)
    return ''
  }
}

/**
 * Displays a dual-axis line chart of weekly minimum price and total quantity for a given item, with dark mode support.
 *
 * @param weeklyData - Array of weekly data points containing price, quantity, timestamp, and price change percentage.
 * @param darkMode - Whether to render the chart in dark mode.
 * @param itemName - Name of the item to display in the chart title and tooltips.
 *
 * @returns A React component rendering the configured Highcharts chart.
 */
export default function WeeklyPriceQuantityChart({
  weeklyData,
  darkMode,
  itemName
}: {
  weeklyData: WeeklyDataPoint[]
  darkMode: boolean
  itemName: string
}) {
  const styles = darkMode
    ? {
        backgroundColor: '#334155',
        color: '#f3f4f6', // Light gray text for dark mode
        hoverColor: '#f8f8f8',
        gridLineColor: '#4a5568',
        labelColor: '#9ca3af' // gray-400 for secondary text
      }
    : {
        backgroundColor: '#ffffff',
        color: '#000000',
        hoverColor: '#666666',
        gridLineColor: '#e2e8f0',
        labelColor: '#666666'
      }

  const options: Options = {
    chart: {
      type: 'line',
      backgroundColor: styles.backgroundColor,
      height: 400,
      style: {
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: styles.color
      }
    },
    title: {
      text: `${itemName} Price & Quantity`,
      style: { color: styles.color }
    },
    yAxis: [
      {
        // Left y-axis for price
        title: {
          text: 'Price',
          style: { color: styles.color }
        },
        labels: {
          style: { color: styles.labelColor },
          formatter: function () {
            return (this.value as number).toLocaleString()
          }
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor
      },
      {
        // Right y-axis for quantity
        title: {
          text: 'Total Quantity',
          style: { color: styles.color }
        },
        labels: {
          style: { color: styles.labelColor },
          formatter: function () {
            return (this.value as number).toLocaleString()
          }
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        opposite: true
      }
    ],
    xAxis: {
      categories: weeklyData.map((point) => formatTimestamp(point.t)),
      labels: {
        style: { color: styles.labelColor }
      },
      lineColor: styles.labelColor,
      gridLineColor: styles.gridLineColor
    },
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      style: {
        color: darkMode ? '#f3f4f6' : '#000000'
      },
      formatter: function (this: { points?: TooltipFormatterContextObject[] }) {
        return formatTooltip(this.points || [], itemName, weeklyData, darkMode)
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
        color: darkMode ? '#93c5fd' : '#dae4ff',
        fillOpacity: 0.3,
        yAxis: 0
      },
      {
        name: 'Total Quantity',
        type: 'line',
        data: weeklyData.map((point) => point.q),
        color: darkMode ? '#fca5a5' : '#fbb7b2',
        yAxis: 1
      },
      // Optional series: TSM Price
      ...(weeklyData.some((p) => p.tsmP != null)
        ? [
            {
              name: 'TSM Price',
              type: 'line' as const,
              data: weeklyData.map((point) =>
                point.tsmP != null ? point.tsmP : null
              ),
              color: '#3b82f6',
              dashStyle: 'ShortDash',
              yAxis: 0
            }
          ]
        : []),
      // Optional series: TSM Sales
      ...(weeklyData.some((p) => p.tsmQ != null)
        ? [
            {
              name: 'TSM Sales',
              type: 'line' as const,
              data: weeklyData.map((point) =>
                point.tsmQ != null ? point.tsmQ : null
              ),
              color: '#ef4444',
              dashStyle: 'ShortDot',
              yAxis: 1
            }
          ]
        : [])
    ],
    legend: {
      itemStyle: { color: styles.color },
      align: 'center',
      itemHoverStyle: { color: styles.hoverColor }
    },
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
