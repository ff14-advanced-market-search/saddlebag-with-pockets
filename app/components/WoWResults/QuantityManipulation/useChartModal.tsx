import { useState } from 'react'
import { useTypedSelector } from '~/redux/useTypedSelector'
import PriceQuantityLineChart from '../../Charts/PriceQuantityLineChart'
import Modal from '../../form/Modal'

/**
 * Generates a chart modal for price and quantity visualization over a week period.
 * @example
 * const { ChartModal, setChartData } = useChartModal();
 * // Later in component:
 * setChartData({ p: [10, 20, 30], q: [5, 10, 15], title: 'Item Sales' });
 * // Render the modal:
 * <ChartModal />
 * @param {Object|null} chartData - An object with arrays of numbers for 'p' and 'q', and a string 'title', or null to reset.
 * @returns {Object} Returns an object containing the ChartModal component and a function to set chart data.
 * @description
 *   - Uses custom hook `useTypedSelector` to retrieve user settings like dark mode.
 *   - The modal will reset the chart data to null when closed.
 *   - Supports 168 data points (1 week) for both price and quantity history.
 */
export const useChartModal = () => {
  const [chartData, setChartData] = useState<{
    p: Array<number>
    q: Array<number>
    title: string
  } | null>(null)
  const { darkmode } = useTypedSelector((state) => state.user)

  /**
   * Renders a modal with a price and quantity line chart if chart data is available
   * @example
   * <ChartModal />
   * // Returns a modal with a line chart displaying price and quantity information if chartData exists
   * @returns {JSX.Element|null} A modal containing the price and quantity chart, or null if no chart data.
   * @description
   *   - Utilizes a `Modal` component to display the chart.
   *   - The chart is rendered using the `PriceQuantityLineChart` component.
   *   - The modal title is "Weekly Price & Quantity" which reflects the data contents.
   *   - Ensures responsiveness with different minimum width classes.
   *   - Uses chartData from the parent hook's state.
   */
  const ChartModal = () => {
    return chartData ? (
      <Modal title="Weekly Price & Quantity" onClose={() => setChartData(null)}>
        <div className="min-w-72 sm:min-w-96 md:min-w-[640px] lg:min-w-[800px]">
          <PriceQuantityLineChart
            itemName={chartData.title}
            prices={chartData.p}
            quantities={chartData.q}
            darkMode={darkmode}
          />
        </div>
      </Modal>
    ) : null
  }

  return { ChartModal, setChartData }
} 