import type { GroupData } from '~/requests/WoW/WeeklyPriceGroupDelta'
import WeeklyPriceQuantityChart from '~/components/Charts/WeeklyPriceQuantityChart'

interface PriceQuantityAnalysisProps {
  showPriceQuantityCharts: boolean
  setShowPriceQuantityCharts: (show: boolean) => void
  groupData: GroupData
  visibleItems: Record<string, boolean>
  darkMode: boolean
}

export default function PriceQuantityAnalysis({
  showPriceQuantityCharts,
  setShowPriceQuantityCharts,
  groupData,
  visibleItems,
  darkMode
}: PriceQuantityAnalysisProps) {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <button
          type="button"
          onClick={() => setShowPriceQuantityCharts(!showPriceQuantityCharts)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            role="img"
            aria-label="Chart analysis icon">
            <title>Chart analysis</title>
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          {showPriceQuantityCharts ? 'Hide' : 'Show'} Price vs Quantity Analysis
        </button>
      </div>

      {showPriceQuantityCharts && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(groupData.item_data)
              .filter(([itemId]) => {
                const itemName = groupData.item_names[itemId]
                return visibleItems[itemName]
              })
              .map(([itemId, itemData]) => (
                <div
                  key={itemId}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <WeeklyPriceQuantityChart
                    weeklyData={itemData.weekly_data}
                    darkMode={darkMode}
                    itemName={groupData.item_names[itemId]}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  )
}
