import { useMemo, useCallback } from 'react'
import Highcharts from 'highcharts'
import addHighchartsMore from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official'
import { format } from 'date-fns'
import type { GW2ItemData } from '~/requests/GW2/WeeklyPriceGroupDelta'

const canUseDOM =
  typeof window !== 'undefined' && typeof document !== 'undefined'

// Initialize the highcharts-more module at the module level only in the browser
let highchartsMoreLoaded = false
if (canUseDOM) {
  try {
    addHighchartsMore(Highcharts)
    highchartsMoreLoaded = true
  } catch (error) {
    console.error(
      'Failed to initialize Highcharts more module:',
      error instanceof Error ? error.message : String(error)
    )
    highchartsMoreLoaded = false
  }
}

interface GW2PriceQuantityChartsProps {
  weeklyData: GW2ItemData['weekly_data']
  darkMode: boolean
}

// Format timestamp like 2025110300 to Date
const formatTimestamp = (timestamp: number): Date => {
  const timestampStr = timestamp.toString().padStart(10, '0')
  const year = Number.parseInt(timestampStr.slice(0, 4))
  const month = Number.parseInt(timestampStr.slice(4, 6)) - 1 // Month is 0-indexed
  const day = Number.parseInt(timestampStr.slice(6, 8))
  return new Date(year, month, day)
}

export default function GW2PriceQuantityCharts({
  weeklyData,
  darkMode
}: GW2PriceQuantityChartsProps) {
  // Memoize styles to prevent recreation on every render
  const styles = useMemo(
    () =>
      darkMode
        ? {
            backgroundColor: '#1e293b',
            color: '#f3f4f6',
            hoverColor: '#f8f8f8',
            gridLineColor: '#334155',
            labelColor: '#94a3b8',
            borderColor: '#475569'
          }
        : {
            backgroundColor: '#ffffff',
            color: '#1f2937',
            hoverColor: '#4b5563',
            gridLineColor: '#e2e8f0',
            labelColor: '#64748b',
            borderColor: '#e2e8f0'
          },
    [darkMode]
  )

  // Calculate derived values - use empty arrays as fallback for empty data
  const xCategories = useMemo(
    () =>
      weeklyData.length > 0
        ? weeklyData.map((d) => format(formatTimestamp(d.time), 'MM/dd/yyyy'))
        : [],
    [weeklyData]
  )

  const maxPrice = useMemo(
    () =>
      weeklyData.length > 0
        ? Math.max(
            ...weeklyData.map((d) =>
              Math.max(d.sell_price_avg, d.buy_price_avg)
            )
          )
        : 0,
    [weeklyData]
  )

  const maxQuantity = useMemo(
    () =>
      weeklyData.length > 0
        ? Math.max(
            ...weeklyData.map((d) =>
              Math.max(d.sell_quantity_avg, d.buy_quantity_avg)
            )
          )
        : 0,
    [weeklyData]
  )

  const maxValue = useMemo(
    () =>
      weeklyData.length > 0
        ? Math.max(
            ...weeklyData.map((d) => Math.max(d.sell_value, d.buy_value))
          )
        : 0,
    [weeklyData]
  )

  const maxSold = useMemo(
    () =>
      weeklyData.length > 0
        ? Math.max(
            ...weeklyData.map((d) =>
              Math.max(d.sell_sold, d.buy_sold, d.sell_listed, d.buy_listed)
            )
          )
        : 0,
    [weeklyData]
  )

  // Shared tooltip formatter - memoized with useCallback
  const sharedTooltipFormatter = useCallback(
    function (this: any) {
      const points = this.points || []
      if (points.length === 0) return ''
      const point = points[0]
      if (!point || !point.point) return ''

      // Safely get and validate index
      const rawIndex = point.point.index
      if (rawIndex === undefined || rawIndex === null) return ''

      const index = Number.parseInt(String(rawIndex), 10)
      if (Number.isNaN(index) || index < 0 || index >= weeklyData.length) {
        return ''
      }

      const dataPoint = weeklyData[index]
      if (!dataPoint) return ''

      const labelColor = styles.labelColor

      return `<div style="min-width: 200px; color: ${styles.color};">
      <b>${format(formatTimestamp(dataPoint.time), 'MM/dd/yyyy')}</b><br/>
      <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
      <b style="color: ${
        darkMode ? '#10b981' : '#059669'
      };">Sell Price:</b> ${dataPoint.sell_price_avg.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      })}<br/>
      <b style="color: ${
        darkMode ? '#f59e0b' : '#d97706'
      };">Buy Price:</b> ${dataPoint.buy_price_avg.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      })}<br/>
      <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
      <b style="color: ${
        darkMode ? '#10b981' : '#059669'
      };">Sell Value:</b> ${dataPoint.sell_value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}<br/>
      <b style="color: ${
        darkMode ? '#f59e0b' : '#d97706'
      };">Buy Value:</b> ${dataPoint.buy_value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}<br/>
      <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
      <b style="color: ${
        darkMode ? '#10b981' : '#059669'
      };">Sold:</b> ${dataPoint.sell_sold.toLocaleString()}<br/>
      <b style="color: ${
        darkMode ? '#f59e0b' : '#d97706'
      };">Bought:</b> ${dataPoint.buy_sold.toLocaleString()}<br/>
      <b style="color: ${
        darkMode ? '#10b981' : '#059669'
      };">New Sells Listed:</b> ${dataPoint.sell_listed.toLocaleString()}<br/>
      <b style="color: ${
        darkMode ? '#f59e0b' : '#d97706'
      };">New Buys Listed:</b> ${dataPoint.buy_listed.toLocaleString()}<br/>
      <b style="color: ${
        darkMode ? '#10b981' : '#059669'
      };">Sells Delisted:</b> ${dataPoint.sell_delisted.toLocaleString()}<br/>
      <b style="color: ${
        darkMode ? '#f59e0b' : '#d97706'
      };">Buys Delisted:</b> ${dataPoint.buy_delisted.toLocaleString()}<br/>
      <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
      <b style="color: ${
        darkMode ? '#7c3aed' : '#6d28d9'
      };">Supply:</b> ${dataPoint.sell_quantity_avg.toLocaleString()}<br/>
      <b style="color: ${
        darkMode ? '#dc2626' : '#b91c1c'
      };">Demand:</b> ${dataPoint.buy_quantity_avg.toLocaleString()}
    </div>`
    },
    [weeklyData, darkMode, styles]
  )

  // Chart 1: Price vs Volume
  const priceVolumeOptions: any = useMemo(
    () => ({
      chart: {
        type: 'line',
        backgroundColor: styles.backgroundColor,
        height: 550,
        spacingTop: 20,
        spacingBottom: 80,
        zoomType: 'x',
        marginTop: 20,
        marginBottom: 150
      },
      title: {
        text: 'Price vs Volume',
        style: { color: styles.color },
        margin: 20
      },
      legend: {
        itemStyle: { color: styles.color },
        align: 'center',
        itemHoverStyle: { color: styles.hoverColor },
        layout: 'horizontal',
        verticalAlign: 'bottom',
        enabled: true,
        y: -20,
        margin: 20
      },
      xAxis: {
        categories: xCategories,
        labels: {
          style: { color: styles.labelColor },
          rotation: -45,
          y: 35,
          reserveSpace: true,
          distance: 10
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        tickLength: 5,
        offset: 30,
        lineWidth: 0
      },
      yAxis: [
        {
          title: {
            text: 'Price',
            style: { color: styles.color }
          },
          labels: {
            style: { color: styles.labelColor },
            formatter: function (this: { value: number }) {
              return this.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })
            }
          },
          lineColor: styles.labelColor,
          gridLineColor: styles.gridLineColor,
          min: 0,
          softMax: maxPrice * 1.1 || 1,
          opposite: false
        },
        {
          title: {
            text: 'Quantity',
            style: { color: styles.color }
          },
          labels: {
            style: { color: styles.labelColor },
            formatter: function (this: { value: number }) {
              return this.value.toLocaleString()
            }
          },
          lineColor: styles.labelColor,
          gridLineColor: styles.gridLineColor,
          min: 0,
          softMax: maxQuantity * 1.1 || 1,
          opposite: true
        }
      ],
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        style: {
          color: darkMode ? '#f3f4f6' : '#000000'
        },
        formatter: sharedTooltipFormatter
      },
      series: [
        {
          name: 'Sell Price',
          type: 'line',
          data: weeklyData.map((d) => d.sell_price_avg),
          color: darkMode ? '#10b981' : '#059669',
          yAxis: 0,
          lineWidth: 2,
          marker: { radius: 3 }
        },
        {
          name: 'Buy Price',
          type: 'line',
          data: weeklyData.map((d) => d.buy_price_avg),
          color: darkMode ? '#f59e0b' : '#d97706',
          yAxis: 0,
          lineWidth: 2,
          marker: { radius: 3 },
          dashStyle: 'Dash'
        },
        // Colored area between Supply and Demand lines using arearange
        // Only include if highcharts-more module loaded successfully
        ...(highchartsMoreLoaded
          ? [
              // Red area when Supply > Demand
              {
                name: 'Supply Above Demand',
                type: 'arearange',
                data: weeklyData.map((d) => {
                  const supply = d.sell_quantity_avg
                  const demand = d.buy_quantity_avg
                  // Only show when supply is strictly greater than demand
                  // Use epsilon to prevent floating point equality issues
                  return supply > demand + Number.EPSILON
                    ? [demand, supply]
                    : null
                }),
                color: darkMode ? '#dc2626' : '#b91c1c', // Red
                yAxis: 1,
                fillOpacity: 0.3,
                lineWidth: 0,
                enableMouseTracking: false,
                zIndex: 0,
                showInLegend: false
              },
              // Green area when Demand > Supply
              {
                name: 'Demand Above Supply',
                type: 'arearange',
                data: weeklyData.map((d) => {
                  const supply = d.sell_quantity_avg
                  const demand = d.buy_quantity_avg
                  // Only show when demand is strictly greater than supply
                  // Use epsilon to prevent floating point equality issues
                  // This ensures mutual exclusivity - only one shows at a time
                  return demand > supply + Number.EPSILON
                    ? [supply, demand]
                    : null
                }),
                color: darkMode ? '#10b981' : '#059669', // Green
                yAxis: 1,
                fillOpacity: 0.3,
                lineWidth: 0,
                enableMouseTracking: false,
                zIndex: 0,
                showInLegend: false
              }
            ]
          : []),
        {
          name: 'Supply',
          type: 'line',
          data: weeklyData.map((d) => d.sell_quantity_avg),
          color: darkMode ? '#7c3aed' : '#6d28d9',
          yAxis: 1,
          lineWidth: 2,
          marker: { radius: 3 },
          dashStyle: 'Dot'
        },
        {
          name: 'Demand',
          type: 'line',
          data: weeklyData.map((d) => d.buy_quantity_avg),
          color: darkMode ? '#dc2626' : '#b91c1c',
          yAxis: 1,
          lineWidth: 2,
          marker: { radius: 3 },
          dashStyle: 'Dash'
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          connectNulls: true
        },
        ...(highchartsMoreLoaded && {
          arearange: {
            connectNulls: false
          }
        })
      }
    }),
    [
      weeklyData,
      darkMode,
      styles,
      xCategories,
      maxPrice,
      maxQuantity,
      sharedTooltipFormatter
    ]
  )

  // Chart 2: Value
  const valueOptions: any = useMemo(
    () => ({
      chart: {
        type: 'area',
        backgroundColor: styles.backgroundColor,
        height: 550,
        spacingTop: 20,
        spacingBottom: 80,
        zoomType: 'x',
        marginTop: 20,
        marginBottom: 150
      },
      title: {
        text: 'Value',
        style: { color: styles.color },
        margin: 20
      },
      legend: {
        itemStyle: { color: styles.color },
        align: 'center',
        itemHoverStyle: { color: styles.hoverColor },
        layout: 'horizontal',
        verticalAlign: 'bottom',
        enabled: true,
        y: -20,
        margin: 20
      },
      xAxis: {
        categories: xCategories,
        labels: {
          style: { color: styles.labelColor },
          rotation: -45,
          y: 35,
          reserveSpace: true,
          distance: 10
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        tickLength: 5,
        offset: 30,
        lineWidth: 0
      },
      yAxis: {
        title: {
          text: 'Value',
          style: { color: styles.color }
        },
        labels: {
          style: { color: styles.labelColor },
          formatter: function (this: { value: number }) {
            return this.value.toLocaleString()
          }
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        min: 0,
        softMax: maxValue * 1.1 || 1
      },
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        style: {
          color: darkMode ? '#f3f4f6' : '#000000'
        },
        formatter: sharedTooltipFormatter
      },
      series: [
        {
          name: 'Sell Value',
          type: 'area',
          data: weeklyData.map((d) => d.sell_value),
          color: darkMode ? '#10b981' : '#059669',
          fillOpacity: 0.3,
          lineWidth: 2,
          marker: { radius: 3 },
          stack: 'value'
        },
        {
          name: 'Buy Value',
          type: 'area',
          data: weeklyData.map((d) => d.buy_value),
          color: darkMode ? '#f59e0b' : '#d97706',
          fillOpacity: 0.3,
          lineWidth: 2,
          marker: { radius: 3 },
          stack: 'value'
        }
      ],
      credits: {
        enabled: false
      },
      plotOptions: {
        area: {
          stacking: 'normal'
        }
      }
    }),
    [
      weeklyData,
      darkMode,
      styles,
      xCategories,
      maxValue,
      sharedTooltipFormatter
    ]
  )

  // Chart 3: Transaction Volumes
  const transactionOptions: any = useMemo(
    () => ({
      chart: {
        type: 'line',
        backgroundColor: styles.backgroundColor,
        height: 550,
        spacingTop: 20,
        spacingBottom: 80,
        zoomType: 'x',
        marginTop: 20,
        marginBottom: 150
      },
      title: {
        text: 'Transaction Volumes',
        style: { color: styles.color },
        margin: 20
      },
      legend: {
        itemStyle: { color: styles.color },
        align: 'center',
        itemHoverStyle: { color: styles.hoverColor },
        layout: 'horizontal',
        verticalAlign: 'bottom',
        enabled: true,
        y: -20,
        margin: 20
      },
      xAxis: {
        categories: xCategories,
        labels: {
          style: { color: styles.labelColor },
          rotation: -45,
          y: 35,
          reserveSpace: true,
          distance: 10
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        tickLength: 5,
        offset: 30,
        lineWidth: 0
      },
      yAxis: [
        {
          title: {
            text: 'Volume',
            style: { color: styles.color }
          },
          labels: {
            style: { color: styles.labelColor },
            formatter: function (this: { value: number }) {
              return this.value.toLocaleString()
            }
          },
          lineColor: styles.labelColor,
          gridLineColor: styles.gridLineColor,
          min: 0,
          softMax: maxSold * 1.1 || 1,
          opposite: false
        },
        {
          title: {
            text: 'Quantity',
            style: { color: styles.color }
          },
          labels: {
            style: { color: styles.labelColor },
            formatter: function (this: { value: number }) {
              return this.value.toLocaleString()
            }
          },
          lineColor: styles.labelColor,
          gridLineColor: styles.gridLineColor,
          min: 0,
          softMax: maxQuantity * 1.1 || 1,
          opposite: true
        }
      ],
      tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        style: {
          color: darkMode ? '#f3f4f6' : '#000000'
        },
        formatter: sharedTooltipFormatter
      },
      series: [
        {
          name: 'Sold',
          type: 'column',
          data: weeklyData.map((d) => d.sell_sold),
          color: darkMode ? '#10b981' : '#059669',
          yAxis: 0,
          pointPadding: 0.1,
          groupPadding: 0.1
        },
        {
          name: 'Bought',
          type: 'column',
          data: weeklyData.map((d) => d.buy_sold),
          color: darkMode ? '#f59e0b' : '#d97706',
          yAxis: 0,
          pointPadding: 0.1,
          groupPadding: 0.1
        },
        {
          name: 'New Sells Listed',
          type: 'column',
          data: weeklyData.map((d) => d.sell_listed),
          color: darkMode ? '#10b981' : '#059669',
          yAxis: 0,
          pointPadding: 0.1,
          groupPadding: 0.1
        },
        {
          name: 'New Buys Listed',
          type: 'column',
          data: weeklyData.map((d) => d.buy_listed),
          color: darkMode ? '#f59e0b' : '#d97706',
          yAxis: 0,
          pointPadding: 0.1,
          groupPadding: 0.1
        },
        {
          name: 'Sells Delisted',
          type: 'column',
          data: weeklyData.map((d) => d.sell_delisted),
          color: darkMode ? '#34d399' : '#10b981',
          yAxis: 0,
          pointPadding: 0.1,
          groupPadding: 0.1
        },
        {
          name: 'Buys Delisted',
          type: 'column',
          data: weeklyData.map((d) => d.buy_delisted),
          color: darkMode ? '#fbbf24' : '#f59e0b',
          yAxis: 0,
          pointPadding: 0.1,
          groupPadding: 0.1
        },
        {
          name: 'Supply',
          type: 'line',
          data: weeklyData.map((d) => d.sell_quantity_avg),
          color: darkMode ? '#7c3aed' : '#6d28d9',
          yAxis: 1,
          lineWidth: 2,
          marker: { radius: 3 },
          dashStyle: 'Dot'
        },
        {
          name: 'Demand',
          type: 'line',
          data: weeklyData.map((d) => d.buy_quantity_avg),
          color: darkMode ? '#dc2626' : '#b91c1c',
          yAxis: 1,
          lineWidth: 2,
          marker: { radius: 3 },
          dashStyle: 'Dash'
        }
      ],
      credits: {
        enabled: false
      }
    }),
    [
      weeklyData,
      darkMode,
      styles,
      xCategories,
      maxSold,
      maxQuantity,
      sharedTooltipFormatter
    ]
  )

  // Early return for empty data - after all hooks
  if (weeklyData.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No weekly data available to display charts.
      </div>
    )
  }

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={priceVolumeOptions} />
      <HighchartsReact highcharts={Highcharts} options={valueOptions} />
      <HighchartsReact highcharts={Highcharts} options={transactionOptions} />
    </div>
  )
}
