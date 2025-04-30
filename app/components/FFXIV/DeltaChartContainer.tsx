import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/FFXIV/WeeklyPriceGroupDelta'

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
  const [showSettings, setShowSettings] = useState(false)

  // Prepare chart data
  const chartData = filteredTimestamps.map((timestamp) => {
    const dataPoint: any = {
      timestamp: formatTimestamp(timestamp)
    }

    if (selectedGroup === 'All') {
      // For 'All' view, show group averages
      Object.entries(data).forEach(([groupName, groupData]) => {
        if (visibleItems[groupName]) {
          dataPoint[groupName] = groupData.deltas[timestamp]
        }
      })
    } else {
      // For specific group view, show individual items
      const groupData = data[selectedGroup]
      Object.entries(groupData.item_data).forEach(([itemId, itemData]) => {
        const itemName = groupData.item_names[itemId]
        if (visibleItems[itemName]) {
          const weeklyData = itemData.weekly_data.find(
            (d) => d.t.toString() === timestamp
          )
          if (weeklyData) {
            dataPoint[itemName] = weeklyData.delta
          }
        }
      })
    }

    return dataPoint
  })

  // Generate lines for the chart
  const generateLines = () => {
    if (selectedGroup === 'All') {
      return Object.keys(data)
        .filter((groupName) => visibleItems[groupName])
        .map((groupName, index) => (
          <Line
            key={groupName}
            type="monotone"
            dataKey={groupName}
            stroke={`hsl(${
              (index * 360) / Object.keys(data).length
            }, 70%, 50%)`}
            dot={false}
          />
        ))
    }

    const groupData = data[selectedGroup]
    return Object.entries(groupData.item_data)
      .map(([itemId, _]) => groupData.item_names[itemId])
      .filter((itemName) => visibleItems[itemName])
      .map((itemName, index) => (
        <Line
          key={itemName}
          type="monotone"
          dataKey={itemName}
          stroke={`hsl(${
            (index * 360) / Object.keys(groupData.item_data).length
          }, 70%, 50%)`}
          dot={false}
        />
      ))
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Price Changes Over Time
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-blue-500 hover:text-blue-600">
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
      </div>

      {showSettings && (
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Min Y-Axis Value
              </label>
              <input
                type="number"
                value={minYAxis ?? ''}
                onChange={(e) =>
                  onMinYAxisChange(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Max Y-Axis Value
              </label>
              <input
                type="number"
                value={maxYAxis ?? ''}
                onChange={(e) =>
                  onMaxYAxisChange(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? '#374151' : '#E5E7EB'}
            />
            <XAxis
              dataKey="timestamp"
              stroke={darkMode ? '#9CA3AF' : '#4B5563'}
            />
            <YAxis
              stroke={darkMode ? '#9CA3AF' : '#4B5563'}
              domain={
                [minYAxis ?? 'auto', maxYAxis ?? 'auto'] as unknown as [
                  number,
                  number
                ]
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                borderColor: darkMode ? '#374151' : '#E5E7EB',
                color: darkMode ? '#FFFFFF' : '#000000'
              }}
            />
            <Legend />
            {generateLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
