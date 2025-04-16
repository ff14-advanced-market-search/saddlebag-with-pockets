import { useMemo } from 'react'
import type { Options } from 'highcharts'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/WoW/WeeklyPriceGroupDelta'
import ChartContainer from './ChartContainer'

interface DeltaChartContainerProps {
  data: WeeklyPriceGroupDeltaResponse
  selectedGroup: string
  startDate: string
  endDate: string
  darkMode: boolean
  minYAxis: number | null
  maxYAxis: number | null
  onMinYAxisChange: (value: number | null) => void
  onMaxYAxisChange: (value: number | null) => void
  visibleItems: Record<string, boolean>
  visibilityFilter: string
  onVisibleItemsChange: (items: Record<string, boolean>) => void
  onVisibilityFilterChange: (filter: string) => void
  filteredTimestamps: string[]
  formatTimestamp: (timestamp: string) => string
}

/**
 * Renders a line chart visualizing weekly price delta data by group or item, with configurable appearance and filtering.
 *
 * Displays price change percentages over time for selected groups or items, supporting dark mode, Y-axis bounds, visibility controls, and custom timestamp formatting. Only visible and sufficiently performing groups/items are included in the chart.
 *
 * @param data - Weekly price delta data grouped by categories and items.
 * @param selectedGroup - The group to display, or "All" for all groups.
 * @param startDate - Start of the date range filter (inclusive).
 * @param endDate - End of the date range filter (inclusive).
 * @param darkMode - Whether to use dark theme styling.
 * @param minYAxis - Minimum Y-axis value, or null for automatic scaling.
 * @param maxYAxis - Maximum Y-axis value, or null for automatic scaling.
 * @param visibleItems - Record of which groups or items are visible in the chart.
 * @param visibilityFilter - Filter string for visible items.
 * @param filteredTimestamps - Array of timestamps to display on the X-axis.
 * @param formatTimestamp - Function to format timestamps for display on the X-axis.
 * @returns A React element rendering the configured line chart.
 */
export default function DeltaChartContainer({
  data,
  selectedGroup,
  startDate,
  endDate,
  darkMode,
  minYAxis,
  maxYAxis,
  onMinYAxisChange,
  onMaxYAxisChange,
  visibleItems,
  visibilityFilter,
  onVisibleItemsChange,
  onVisibilityFilterChange,
  filteredTimestamps,
  formatTimestamp
}: DeltaChartContainerProps) {
  const styles = darkMode
    ? {
        backgroundColor: '#1e293b', // slate-800
        color: '#f3f4f6', // gray-100
        hoverColor: '#f8f8f8',
        gridLineColor: '#334155', // slate-700
        labelColor: '#94a3b8', // slate-400
        borderColor: '#475569' // slate-600
      }
    : {
        backgroundColor: '#ffffff',
        color: '#1f2937', // gray-800
        hoverColor: '#4b5563', // gray-600
        gridLineColor: '#e2e8f0', // slate-200
        labelColor: '#64748b', // slate-500
        borderColor: '#e2e8f0' // slate-200
      }

  const performanceThreshold = -100 // Default to show all

  const seriesData = useMemo(() => {
    if (selectedGroup === 'All') {
      return Object.entries(data)
        .filter(([groupName]) => visibleItems[groupName])
        .map(([groupName, groupData]) => {
          // Calculate average performance for the group within the date range
          const values = Object.entries(groupData.deltas)
            .filter(
              ([timestamp]) => timestamp >= startDate && timestamp <= endDate
            )
            .map(([, value]) => value)
            .filter((v) => v != null)

          const avgPerformance =
            values.length > 0
              ? values.reduce((a, b) => a + b, 0) / values.length
              : 0

          // Only include if above threshold
          if (avgPerformance >= performanceThreshold) {
            return {
              name: groupName,
              data: filteredTimestamps.map((timestamp) => {
                const value = groupData.deltas[timestamp]
                return value !== undefined ? value : null
              }),
              type: 'line' as const
            }
          }
          return undefined
        })
        .filter(
          (series): series is NonNullable<typeof series> => series !== undefined
        )
    }

    const groupData = data[selectedGroup]
    const series = []

    // Add average line if visible
    if (visibleItems[`${selectedGroup} (Average)`]) {
      const values = Object.entries(groupData.deltas)
        .filter(([timestamp]) => timestamp >= startDate && timestamp <= endDate)
        .map(([, value]) => value)
        .filter((v) => v != null)

      const avgPerformance =
        values.length > 0
          ? values.reduce((a, b) => a + b, 0) / values.length
          : 0

      if (avgPerformance >= performanceThreshold) {
        series.push({
          name: `${selectedGroup} (Average)`,
          data: filteredTimestamps.map((timestamp) => {
            const value = groupData.deltas[timestamp]
            return value !== undefined ? value : null
          }),
          type: 'line' as const,
          lineWidth: 5,
          zIndex: 2
        })
      }
    }

    // Add individual items if visible and above threshold
    Object.entries(groupData.item_data).forEach(([itemId, itemData]) => {
      const itemName = groupData.item_names[itemId]
      if (!visibleItems[itemName]) {
        return
      }
      // Calculate average performance for the item within the date range
      const values = itemData.weekly_data
        .filter((d) => d.t.toString() >= startDate && d.t.toString() <= endDate)
        .map((d) => d.delta)
        .filter((v) => v != null)

      const avgPerformance =
        values.length > 0
          ? values.reduce((a, b) => a + b, 0) / values.length
          : 0

      if (avgPerformance >= performanceThreshold) {
        series.push({
          name: itemName,
          data: filteredTimestamps.map((timestamp) => {
            const weekData = itemData.weekly_data.find(
              (d) => d.t.toString() === timestamp
            )
            return weekData ? weekData.delta : null
          }),
          type: 'line' as const,
          lineWidth: 1,
          dashStyle: 'LongDash',
          opacity: 0.7,
          zIndex: 1
        })
      }
    })

    return series
  }, [
    data,
    selectedGroup,
    visibleItems,
    startDate,
    endDate,
    filteredTimestamps,
    performanceThreshold
  ])

  const chartOptions: Options = {
    chart: {
      type: 'line',
      backgroundColor: styles.backgroundColor,
      style: {
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      },
      height: 600,
      spacingBottom: 20,
      spacingTop: 20,
      spacingLeft: 20,
      spacingRight: 20
    },
    title: {
      text:
        selectedGroup === 'All'
          ? 'All Groups - Weekly Price Deltas'
          : `${selectedGroup} - Weekly Price Deltas`,
      style: { color: styles.color, fontSize: '18px' }
    },
    xAxis: {
      categories: filteredTimestamps.map(formatTimestamp),
      labels: {
        style: { color: styles.labelColor },
        rotation: -45,
        formatter() {
          return this.value as string
        }
      },
      title: { text: 'Week', style: { color: styles.color } },
      lineColor: styles.borderColor,
      gridLineColor: styles.gridLineColor,
      tickColor: styles.borderColor
    },
    yAxis: {
      title: {
        text: 'Price Change %',
        style: { color: styles.color }
      },
      labels: {
        style: { color: styles.labelColor },
        format: '{value}%'
      },
      min: minYAxis !== null ? minYAxis : undefined,
      max: maxYAxis !== null ? maxYAxis : undefined,
      softMin: minYAxis !== null ? minYAxis : undefined,
      gridLineColor: styles.gridLineColor,
      lineColor: styles.borderColor,
      tickColor: styles.borderColor
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<b>{point.key}</b><br/>',
      formatter() {
        if (!this.points) return ''

        // Sort points by value (delta) in descending order
        const sortedPoints = this.points
          .filter((point) => point.y != null)
          .sort((a, b) => (b.y || 0) - (a.y || 0))

        let s = `<div style="min-width: 150px; color: ${styles.color}; font-size: 12px;">
          <b style="font-size: 14px;">${this.x}</b><br/>`

        // Add each point's data
        sortedPoints.forEach((point) => {
          s += `<div style="display: flex; justify-content: space-between; margin: 4px 0;">
            <span style="color:${point.color}">●</span>
            <span style="margin-left: 4px; flex-grow: 1;">${
              point.series.name
            }:</span>
            <b style="margin-left: 8px;">${point.y?.toFixed(2)}%</b>
          </div>`
        })

        s += '</div>'
        return s
      },
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      style: {
        color: styles.color
      },
      padding: 12,
      shadow: true,
      borderWidth: 1,
      borderColor: styles.borderColor,
      borderRadius: 8
    },
    plotOptions: {
      series: {
        connectNulls: true,
        marker: {
          enabled: true,
          radius: 3,
          lineWidth: 1,
          lineColor: styles.borderColor
        },
        states: {
          hover: {
            brightness: darkMode ? 0.3 : -0.2,
            lineWidthPlus: 0
          }
        },
        events: {
          legendItemClick() {
            if (selectedGroup !== 'All') {
              return false // Prevent toggling visibility
            }
            return true // Allow toggling for All Groups view
          }
        }
      }
    },
    series: seriesData.map((series) => ({
      ...series,
      lineWidth: series.name.includes('Average') ? 3 : 1.5,
      opacity: series.name.includes('Average') ? 1 : 0.8,
      states: {
        hover: {
          lineWidth: series.name.includes('Average') ? 3 : 1.5
        }
      }
    })),
    legend: {
      itemStyle: { color: styles.color },
      itemHoverStyle: { color: styles.hoverColor },
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      maxHeight:
        selectedGroup === 'All'
          ? 300
          : Math.floor(
              Object.keys(data[selectedGroup].item_data).length * 30 + 200
            ),
      itemMarginTop: 4,
      itemMarginBottom: 4,
      padding: 12,
      backgroundColor: styles.backgroundColor,
      borderWidth: 1,
      borderColor: styles.borderColor,
      borderRadius: 4,
      shadow: false,
      symbolRadius: 2,
      symbolHeight: 8,
      symbolWidth: 8,
      useHTML: true,
      labelFormatter: function () {
        return `<span style="display: flex; align-items: center;">
          <span style="color: ${this.color};">●</span>
          <span style="margin-left: 4px;">${this.name}</span>
        </span>`
      }
    },
    credits: { enabled: false }
  }

  return (
    <ChartContainer
      chartOptions={chartOptions}
      darkMode={darkMode}
      minYAxis={minYAxis}
      maxYAxis={maxYAxis}
      onMinYAxisChange={onMinYAxisChange}
      onMaxYAxisChange={onMaxYAxisChange}
      selectedGroup={selectedGroup}
      startDate={startDate}
      endDate={endDate}
      data={data}
      visibleItems={visibleItems}
      visibilityFilter={visibilityFilter}
      onVisibleItemsChange={onVisibleItemsChange}
      onVisibilityFilterChange={onVisibilityFilterChange}
    />
  )
}
