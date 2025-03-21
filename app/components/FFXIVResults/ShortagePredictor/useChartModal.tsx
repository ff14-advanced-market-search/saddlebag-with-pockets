import { useState } from 'react'
import { useTypedSelector } from '~/redux/useTypedSelector'
import PriceQuantityLineChart from '../../Charts/PriceQuantityLineChart'
import Modal from '../../form/Modal'

export const useChartModal = () => {
  /**
   * Chart data state type
   * @property {number[]} p - Array of prices
   * @property {number[]} q - Array of quantities
   * @property {string} title - Chart title (usually item name)
   */
  const [chartData, setChartData] = useState<{
    p: number[]
    q: number[]
    title: string
  } | null>(null)
  const { darkmode } = useTypedSelector((state) => state.user)

  const ChartModal = () => {
    return chartData ? (
      <Modal title="Price & Quantity" onClose={() => setChartData(null)}>
        <div className="min-w-72 sm:min-w-96 md:min-w-[480px]">
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

export default useChartModal
