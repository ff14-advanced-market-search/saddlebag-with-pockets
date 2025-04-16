import type { Options } from 'highcharts'
import DeltaChart from './DeltaChart'
import ChartControls from './ChartControls'
import DeltaFilterControls from './DeltaFilterControls'
import VisibleItemsList from './VisibleItemsList'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/WoW/WeeklyPriceGroupDelta'

interface ChartContainerProps {
  chartOptions: Options
  darkMode: boolean
  minYAxis: number | null
  maxYAxis: number | null
  onMinYAxisChange: (value: number | null) => void
  onMaxYAxisChange: (value: number | null) => void
  selectedGroup: string
  startDate: string
  endDate: string
  data: WeeklyPriceGroupDeltaResponse
  visibleItems: Record<string, boolean>
  visibilityFilter: string
  onVisibleItemsChange: (items: Record<string, boolean>) => void
  onVisibilityFilterChange: (filter: string) => void
}

export default function ChartContainer({
  chartOptions,
  darkMode,
  minYAxis,
  maxYAxis,
  onMinYAxisChange,
  onMaxYAxisChange,
  selectedGroup,
  startDate,
  endDate,
  data,
  visibleItems,
  visibilityFilter,
  onVisibleItemsChange,
  onVisibilityFilterChange
}: ChartContainerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <DeltaChart chartOptions={chartOptions} darkMode={darkMode} />

        <div
          className="md:w-72 flex flex-col bg-gray-50 dark:bg-gray-700 rounded"
          // CONSIDER: The container style has an inline style { height: '600px' }. Switching to a Tailwind utility class (e.g., h-[600px]) could improve consistency and maintainability
          style={{ height: '600px' }}>
          <ChartControls
            minYAxis={minYAxis}
            maxYAxis={maxYAxis}
            onMinYAxisChange={onMinYAxisChange}
            onMaxYAxisChange={onMaxYAxisChange}
            darkMode={darkMode}
          />

          <div className="mx-4 border-t border-gray-300 dark:border-gray-600 my-2" />

          <h4 className="font-medium px-4 pb-2 text-gray-900 dark:text-gray-100">
            Show/Hide Items
          </h4>

          <div className="px-4 mb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={visibilityFilter}
                onChange={(e) => {
                  onVisibilityFilterChange(e.target.value)
                }}
                className="w-full p-2 text-xs border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          <DeltaFilterControls
            selectedGroup={selectedGroup}
            startDate={startDate}
            endDate={endDate}
            data={data}
            onApplyFilter={onVisibleItemsChange}
          />

          <VisibleItemsList
            visibleItems={visibleItems}
            visibilityFilter={visibilityFilter}
            onVisibilityChange={(name, isVisible) => {
              onVisibleItemsChange({
                ...visibleItems,
                [name]: isVisible
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}
