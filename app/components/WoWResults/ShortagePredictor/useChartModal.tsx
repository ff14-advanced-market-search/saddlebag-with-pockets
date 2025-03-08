import { useState } from 'react'
import { useTypedSelector } from '~/redux/useTypedSelector'
import PriceQuantityLineChart from '../../Charts/PriceQuantityLineChart'
import Modal from '../../form/Modal'

export const useChartModal = () => {
  const [chartData, setChartData] = useState<{
    p: Array<number>
    q: Array<number>
    title: string
  } | null>(null)
  const { darkmode } = useTypedSelector((state) => state.user)

  const ChartModal = () => {
    return chartData ? (
      <Modal title='Price & Quantity' onClose={() => setChartData(null)}>
        <div className='min-w-72 sm:min-w-96 md:min-w-[480px]'>
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
