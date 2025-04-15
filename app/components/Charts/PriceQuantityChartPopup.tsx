import WeeklyPriceQuantityChart from './WeeklyPriceQuantityChart'

interface PriceQuantityChartPopupProps {
  onClose: () => void
  weeklyData: Array<{
    p: number
    q: number
    t: number
    delta: number
  }>
  darkMode: boolean
  itemName: string
}

/**
 * Displays a modal popup overlay containing a price and quantity analysis chart for a specified item.
 *
 * Renders a centered, theme-aware popup with a header and close button, presenting the {@link WeeklyPriceQuantityChart} visualization using the provided data.
 */
export default function PriceQuantityChartPopup({
  onClose,
  weeklyData,
  darkMode,
  itemName
}: PriceQuantityChartPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Price & Quantity Analysis</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close price and quantity analysis"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="mt-4">
          <WeeklyPriceQuantityChart
            weeklyData={weeklyData}
            darkMode={darkMode}
            itemName={itemName}
          />
        </div>
      </div>
    </div>
  )
}
