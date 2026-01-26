import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react'
import { format } from 'date-fns'
import Highcharts from 'highcharts'
import addHighchartsMore from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official'
import type { TimeDataPoint } from '~/requests/GW2/ItemListingsData'

const canUseDOM =
  typeof window !== 'undefined' && typeof document !== 'undefined'

// Initialize the highcharts-more module at the module level
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

// Shared tooltip formatter for all charts
const createSharedTooltipFormatter = (
  timeData: TimeDataPoint[],
  darkmode: boolean,
  styles: any
) => {
  return function (this: any) {
    const points = this.points || []
    if (points.length === 0) return ''
    const point = points[0]
    const index = point.point.index || 0
    const dataPoint = timeData[index]
    const labelColor = styles.labelColor

    return `<div style="min-width: 200px; color: ${styles.color};">
      <b>${format(new Date(dataPoint.date), 'MM/dd/yyyy HH:mm')}</b><br/>
      <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
      <b style="color: ${
        darkmode ? '#10b981' : '#059669'
      };">Sell:</b> ${dataPoint.sell_price_avg.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })}<br/>
      <b style="color: ${
        darkmode ? '#f59e0b' : '#d97706'
      };">Buy:</b> ${dataPoint.buy_price_avg.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })}<br/>
      <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
      <b style="color: ${
        darkmode ? '#10b981' : '#059669'
      };">Sell Value:</b> ${dataPoint.sell_value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}<br/>
      <b style="color: ${
        darkmode ? '#f59e0b' : '#d97706'
      };">Buy Value:</b> ${dataPoint.buy_value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}<br/>
      <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
      <b style="color: ${
        darkmode ? '#10b981' : '#059669'
      };">Sold:</b> ${dataPoint.sell_sold.toLocaleString()}<br/>
      <b style="color: ${
        darkmode ? '#f59e0b' : '#d97706'
      };">Bought:</b> ${dataPoint.buy_sold.toLocaleString()}<br/>
      <b style="color: ${
        darkmode ? '#10b981' : '#059669'
      };">New Sells Listed:</b> ${dataPoint.sell_listed.toLocaleString()}<br/>
      <b style="color: ${
        darkmode ? '#f59e0b' : '#d97706'
      };">New Buys Listed:</b> ${dataPoint.buy_listed.toLocaleString()}<br/>
      <b style="color: ${
        darkmode ? '#10b981' : '#059669'
      };">Sells Delisted:</b> ${dataPoint.sell_delisted.toLocaleString()}<br/>
      <b style="color: ${
        darkmode ? '#f59e0b' : '#d97706'
      };">Buys Delisted:</b> ${dataPoint.buy_delisted.toLocaleString()}<br/>
      <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
      <b style="color: ${
        darkmode ? '#7c3aed' : '#6d28d9'
      };">Supply:</b> ${dataPoint.sell_quantity_avg.toLocaleString()}<br/>
      <b style="color: ${
        darkmode ? '#dc2626' : '#b91c1c'
      };">Demand:</b> ${dataPoint.buy_quantity_avg.toLocaleString()}
    </div>`
  }
}

// GW2 Synchronized Charts Component
export interface GW2ChartsRef {
  resetZoom: () => void
}

interface GW2SynchronizedChartsProps {
  timeData: TimeDataPoint[]
  darkmode: boolean
  itemName: string
}

const GW2SynchronizedCharts = forwardRef<
  GW2ChartsRef,
  GW2SynchronizedChartsProps
>(({ timeData, darkmode, itemName }, ref) => {
  const [chartsLoaded, setChartsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const chartRefs = useRef<any[]>([])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const loadCharts = () => {
    setChartsLoaded(true)
  }

  // Expose resetZoom function to parent component
  // Must be called before any early returns to follow React hooks rules
  useImperativeHandle(ref, () => ({
    resetZoom: () => {
      chartRefs.current.forEach((chartRef) => {
        if (chartRef) {
          // Reset Date Range by setting extremes to null
          chartRef.xAxis[0].setExtremes(null, null)
        }
      })
    }
  }))

  const shouldShowButton = isMobile && !chartsLoaded
  const shouldLoadCharts = !isMobile || chartsLoaded

  if (shouldShowButton) {
    if (timeData.length > 0) {
      return (
        <div className="text-center my-8">
          <button
            type="button"
            onClick={loadCharts}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Load Charts
          </button>
        </div>
      )
    }
    return null
  }

  if (!shouldLoadCharts || timeData.length === 0) {
    return null
  }

  const styles = darkmode
    ? {
        backgroundColor: '#334155',
        color: '#f3f4f6',
        hoverColor: '#f8f8f8',
        gridLineColor: '#4a5568',
        labelColor: '#9ca3af'
      }
    : {
        backgroundColor: '#ffffff',
        color: '#000000',
        hoverColor: '#666666',
        gridLineColor: '#e2e8f0',
        labelColor: '#666666'
      }

  const xCategories = timeData.map((d) =>
    format(new Date(d.date), 'MM/dd HH:mm')
  )

  const maxPrice = Math.max(
    ...timeData.map((d) => Math.max(d.sell_price_avg, d.buy_price_avg))
  )
  const maxQuantity = Math.max(
    ...timeData.map((d) => Math.max(d.sell_quantity_avg, d.buy_quantity_avg))
  )
  const maxValue = Math.max(
    ...timeData.map((d) => Math.max(d.sell_value, d.buy_value))
  )
  const maxSold = Math.max(
    ...timeData.map((d) =>
      Math.max(d.sell_sold, d.buy_sold, d.sell_listed, d.buy_listed)
    )
  )

  const sharedTooltipFormatter = createSharedTooltipFormatter(
    timeData,
    darkmode,
    styles
  )

  // Synchronize hover across all charts
  const syncCharts = (chartIndex: number, pointIndex: number) => {
    chartRefs.current.forEach((chart, idx) => {
      if (chart && idx !== chartIndex) {
        // Trigger hover on all series in the other charts
        chart.series.forEach((series: any) => {
          const point = series.data[pointIndex]
          if (point && point.setState) {
            point.setState('hover')
          }
        })
        // Update tooltip position
        if (chart.tooltip) {
          chart.tooltip.refresh(
            chart.series.map((s: any) => s.data[pointIndex]).filter(Boolean)
          )
        }
      }
    })
  }

  // Chart 1: Price vs Volume
  const priceVolumeOptions: any = {
    chart: {
      type: 'line',
      backgroundColor: styles.backgroundColor,
      height: 500,
      spacingBottom: 20,
      marginBottom: 40,
      zoomType: 'x',
      events: {
        load: function (this: any) {
          chartRefs.current[0] = this
        }
      },
      resetZoomButton: {
        theme: {
          fill: darkmode ? '#3b82f6' : '#2563eb',
          stroke: darkmode ? '#1e40af' : '#1e3a8a',
          style: {
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '14px'
          },
          r: 4,
          states: {
            hover: {
              fill: darkmode ? '#2563eb' : '#1d4ed8'
            }
          }
        },
        position: {
          align: 'right',
          verticalAlign: 'top',
          x: -10,
          y: 10
        }
      }
    },
    title: {
      text: `${itemName} - Price vs Volume`,
      style: { color: styles.color },
      margin: 20
    },
    legend: {
      itemStyle: { color: styles.color },
      align: 'center',
      itemHoverStyle: { color: styles.hoverColor },
      layout: 'horizontal',
      verticalAlign: 'bottom',
      enabled: true
    },
    xAxis: {
      categories: xCategories,
      labels: {
        style: { color: styles.labelColor },
        rotation: -45,
        enabled: false // Hide x-axis labels on first two charts
      },
      lineColor: styles.labelColor,
      gridLineColor: styles.gridLineColor,
      lineWidth: 0,
      tickLength: 0
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
        softMax: maxPrice * 1.1 || 1
      },
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
        opposite: true,
        min: 0,
        softMax: maxQuantity * 1.1 || 1
      }
    ],
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: darkmode ? '#1f2937' : '#ffffff',
      style: {
        color: darkmode ? '#f3f4f6' : '#000000'
      },
      formatter: sharedTooltipFormatter,
      positioner: function (
        this: any,
        labelWidth: number,
        labelHeight: number,
        point: any
      ) {
        // Position tooltip to the side of cursor so it doesn't cover the point
        const chart = this.chart
        const plotLeft = chart.plotLeft
        const plotTop = chart.plotTop
        const plotHeight = chart.plotHeight
        const chartWidth = chart.chartWidth

        // Get mouse position relative to chart
        const mouseX = point.plotX + plotLeft
        const mouseY = point.plotY + plotTop

        // Try positioning to the right first
        let x = mouseX + 15 // Offset to the right of cursor
        let y = mouseY - labelHeight / 2 // Center vertically on cursor

        // If tooltip would go off the right edge, position to the left
        if (x + labelWidth > chartWidth - 10) {
          x = mouseX - labelWidth - 15 // Offset to the left of cursor
        }

        // Ensure tooltip doesn't go off the left edge
        if (x < 10) {
          x = 10
        }

        // Keep tooltip vertically within chart bounds
        if (y < plotTop + 10) {
          y = plotTop + 10
        } else if (y + labelHeight > plotTop + plotHeight - 10) {
          y = plotTop + plotHeight - labelHeight - 10
        }

        return { x, y }
      }
    },
    series: [
      {
        name: 'Sell',
        type: 'line',
        data: timeData.map((d) => d.sell_price_avg),
        color: darkmode ? '#10b981' : '#059669',
        yAxis: 0,
        lineWidth: 2,
        marker: { radius: 3 }
      },
      {
        name: 'Buy',
        type: 'line',
        data: timeData.map((d) => d.buy_price_avg),
        color: darkmode ? '#f59e0b' : '#d97706',
        yAxis: 0,
        lineWidth: 2,
        marker: { radius: 3 }
      },
      // Colored area between Supply and Demand lines using arearange
      // Only include if highcharts-more module loaded successfully
      ...(highchartsMoreLoaded
        ? [
            // Red area when Supply > Demand
            {
              name: 'Supply Above Demand',
              type: 'arearange',
              data: timeData.map((d) => {
                const supply = d.sell_quantity_avg
                const demand = d.buy_quantity_avg
                // Only show when supply is strictly greater than demand
                // Use epsilon to prevent floating point equality issues
                return supply > demand + Number.EPSILON
                  ? [demand, supply]
                  : null
              }),
              color: darkmode ? '#dc2626' : '#b91c1c', // Red
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
              data: timeData.map((d) => {
                const supply = d.sell_quantity_avg
                const demand = d.buy_quantity_avg
                // Only show when demand is strictly greater than supply
                // Use epsilon to prevent floating point equality issues
                // This ensures mutual exclusivity - only one shows at a time
                return demand > supply + Number.EPSILON
                  ? [supply, demand]
                  : null
              }),
              color: darkmode ? '#10b981' : '#059669', // Green
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
        data: timeData.map((d) => d.sell_quantity_avg),
        color: darkmode ? '#7c3aed' : '#6d28d9',
        yAxis: 1,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dot'
      },
      {
        name: 'Demand',
        type: 'line',
        data: timeData.map((d) => d.buy_quantity_avg),
        color: darkmode ? '#dc2626' : '#b91c1c',
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
        connectNulls: true,
        point: {
          events: {
            mouseOver: function (this: any) {
              syncCharts(0, this.index)
            }
          }
        }
      },
      ...(highchartsMoreLoaded && {
        arearange: {
          connectNulls: false
        }
      })
    }
  }

  // Chart 2: Buy Value and Sell Value
  const valueOptions: any = {
    chart: {
      type: 'area',
      backgroundColor: styles.backgroundColor,
      height: 500,
      spacingTop: 20,
      spacingBottom: 20,
      marginTop: 20,
      marginBottom: 40,
      zoomType: 'x',
      events: {
        load: function (this: any) {
          chartRefs.current[1] = this
        }
      },
      resetZoomButton: {
        theme: {
          fill: darkmode ? '#3b82f6' : '#2563eb',
          stroke: darkmode ? '#1e40af' : '#1e3a8a',
          style: {
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '14px'
          },
          r: 4,
          states: {
            hover: {
              fill: darkmode ? '#2563eb' : '#1d4ed8'
            }
          }
        },
        position: {
          align: 'right',
          verticalAlign: 'top',
          x: -10,
          y: 10
        }
      }
    },
    title: {
      text: `${itemName} - Buy Value and Sell Value`,
      style: { color: styles.color },
      margin: 20
    },
    legend: {
      itemStyle: { color: styles.color },
      align: 'center',
      itemHoverStyle: { color: styles.hoverColor },
      layout: 'horizontal',
      verticalAlign: 'bottom',
      enabled: true
    },
    xAxis: {
      categories: xCategories,
      labels: {
        style: { color: styles.labelColor },
        rotation: -45,
        enabled: false // Hide x-axis labels on first two charts
      },
      lineColor: styles.labelColor,
      gridLineColor: styles.gridLineColor,
      lineWidth: 0,
      tickLength: 0
    },
    yAxis: [
      {
        title: {
          text: 'Value',
          style: { color: styles.color }
        },
        labels: {
          style: { color: styles.labelColor },
          formatter: function (this: { value: number }) {
            return this.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
          }
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        min: 0,
        softMax: maxValue * 1.1 || 1,
        opposite: false
      },
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
        softMax: maxQuantity * 1.1 || 1,
        opposite: true
      }
    ],
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: darkmode ? '#1f2937' : '#ffffff',
      style: {
        color: darkmode ? '#f3f4f6' : '#000000'
      },
      formatter: sharedTooltipFormatter,
      positioner: function (
        this: any,
        labelWidth: number,
        labelHeight: number,
        point: any
      ) {
        // Position tooltip to the side of cursor so it doesn't cover the point
        const chart = this.chart
        const plotLeft = chart.plotLeft
        const plotTop = chart.plotTop
        const plotHeight = chart.plotHeight
        const chartWidth = chart.chartWidth

        // Get mouse position relative to chart
        const mouseX = point.plotX + plotLeft
        const mouseY = point.plotY + plotTop

        // Try positioning to the right first
        let x = mouseX + 15 // Offset to the right of cursor
        let y = mouseY - labelHeight / 2 // Center vertically on cursor

        // If tooltip would go off the right edge, position to the left
        if (x + labelWidth > chartWidth - 10) {
          x = mouseX - labelWidth - 15 // Offset to the left of cursor
        }

        // Ensure tooltip doesn't go off the left edge
        if (x < 10) {
          x = 10
        }

        // Keep tooltip vertically within chart bounds
        if (y < plotTop + 10) {
          y = plotTop + 10
        } else if (y + labelHeight > plotTop + plotHeight - 10) {
          y = plotTop + plotHeight - labelHeight - 10
        }

        return { x, y }
      }
    },
    series: [
      {
        name: 'Sell Value',
        type: 'area',
        data: timeData.map((d) => d.sell_value),
        color: darkmode ? '#10b981' : '#059669',
        fillOpacity: 0.3,
        lineWidth: 2,
        marker: { radius: 3 },
        yAxis: 0,
        stack: 'value'
      },
      {
        name: 'Buy Value',
        type: 'area',
        data: timeData.map((d) => d.buy_value),
        color: darkmode ? '#f59e0b' : '#d97706',
        fillOpacity: 0.3,
        lineWidth: 2,
        marker: { radius: 3 },
        yAxis: 0,
        stack: 'value'
      },
      {
        name: 'Supply',
        type: 'line',
        data: timeData.map((d) => d.sell_quantity_avg),
        color: darkmode ? '#7c3aed' : '#6d28d9',
        yAxis: 1,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dot'
      },
      {
        name: 'Demand',
        type: 'line',
        data: timeData.map((d) => d.buy_quantity_avg),
        color: darkmode ? '#dc2626' : '#b91c1c',
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
        connectNulls: true,
        point: {
          events: {
            mouseOver: function (this: any) {
              if (chartRefs.current.length === 3) {
                syncCharts(1, this.index)
              }
            }
          }
        }
      },
      area: {
        stacking: 'normal'
      }
    }
  }

  // Chart 3: Transaction Volumes
  const transactionOptions: any = {
    chart: {
      type: 'line',
      backgroundColor: styles.backgroundColor,
      height: 550,
      spacingTop: 20,
      spacingBottom: 80,
      zoomType: 'x',
      marginTop: 20,
      marginBottom: 150,
      events: {
        load: function (this: any) {
          chartRefs.current[2] = this
        }
      },
      resetZoomButton: {
        theme: {
          fill: darkmode ? '#3b82f6' : '#2563eb',
          stroke: darkmode ? '#1e40af' : '#1e3a8a',
          style: {
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '14px'
          },
          r: 4,
          states: {
            hover: {
              fill: darkmode ? '#2563eb' : '#1d4ed8'
            }
          }
        },
        position: {
          align: 'right',
          verticalAlign: 'top',
          x: -10,
          y: 10
        }
      }
    },
    title: {
      text: `${itemName} - Transaction Volumes`,
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
      backgroundColor: darkmode ? '#1f2937' : '#ffffff',
      style: {
        color: darkmode ? '#f3f4f6' : '#000000'
      },
      formatter: sharedTooltipFormatter,
      positioner: function (
        this: any,
        labelWidth: number,
        labelHeight: number,
        point: any
      ) {
        // Position tooltip to the side of cursor so it doesn't cover the point
        const chart = this.chart
        const plotLeft = chart.plotLeft
        const plotTop = chart.plotTop
        const plotHeight = chart.plotHeight
        const chartWidth = chart.chartWidth

        // Get mouse position relative to chart
        const mouseX = point.plotX + plotLeft
        const mouseY = point.plotY + plotTop

        // Try positioning to the right first
        let x = mouseX + 15 // Offset to the right of cursor
        let y = mouseY - labelHeight / 2 // Center vertically on cursor

        // If tooltip would go off the right edge, position to the left
        if (x + labelWidth > chartWidth - 10) {
          x = mouseX - labelWidth - 15 // Offset to the left of cursor
        }

        // Ensure tooltip doesn't go off the left edge
        if (x < 10) {
          x = 10
        }

        // Keep tooltip vertically within chart bounds
        if (y < plotTop + 10) {
          y = plotTop + 10
        } else if (y + labelHeight > plotTop + plotHeight - 10) {
          y = plotTop + plotHeight - labelHeight - 10
        }

        return { x, y }
      }
    },
    series: [
      {
        name: 'Sold',
        type: 'column',
        data: timeData.map((d) => d.sell_sold),
        color: darkmode ? '#10b981' : '#059669',
        yAxis: 0,
        pointPadding: 0.1,
        groupPadding: 0.1
      },
      {
        name: 'Bought',
        type: 'column',
        data: timeData.map((d) => d.buy_sold),
        color: darkmode ? '#f59e0b' : '#d97706',
        yAxis: 0,
        pointPadding: 0.1,
        groupPadding: 0.1
      },
      {
        name: 'New Sells Listed',
        type: 'column',
        data: timeData.map((d) => d.sell_listed),
        color: darkmode ? '#10b981' : '#059669',
        yAxis: 0,
        pointPadding: 0.1,
        groupPadding: 0.1
      },
      {
        name: 'New Buys Listed',
        type: 'column',
        data: timeData.map((d) => d.buy_listed),
        color: darkmode ? '#f59e0b' : '#d97706',
        yAxis: 0,
        pointPadding: 0.1,
        groupPadding: 0.1
      },
      {
        name: 'Sells Delisted',
        type: 'column',
        data: timeData.map((d) => d.sell_delisted),
        color: darkmode ? '#34d399' : '#10b981',
        yAxis: 0,
        pointPadding: 0.1,
        groupPadding: 0.1
      },
      {
        name: 'Buys Delisted',
        type: 'column',
        data: timeData.map((d) => d.buy_delisted),
        color: darkmode ? '#fbbf24' : '#f59e0b',
        yAxis: 0,
        pointPadding: 0.1,
        groupPadding: 0.1
      },
      {
        name: 'Supply',
        type: 'line',
        data: timeData.map((d) => d.sell_quantity_avg),
        color: darkmode ? '#7c3aed' : '#6d28d9',
        yAxis: 1,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dot'
      },
      {
        name: 'Demand',
        type: 'line',
        data: timeData.map((d) => d.buy_quantity_avg),
        color: darkmode ? '#dc2626' : '#b91c1c',
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
        connectNulls: true,
        point: {
          events: {
            mouseOver: function (this: any) {
              if (chartRefs.current.length === 3) {
                syncCharts(2, this.index)
              }
            }
          }
        }
      }
    }
  }

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={priceVolumeOptions} />
      <HighchartsReact highcharts={Highcharts} options={valueOptions} />
      <HighchartsReact highcharts={Highcharts} options={transactionOptions} />
    </div>
  )
})

GW2SynchronizedCharts.displayName = 'GW2SynchronizedCharts'

export default GW2SynchronizedCharts
