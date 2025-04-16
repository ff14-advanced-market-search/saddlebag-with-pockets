import type { Options } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

interface DeltaChartProps {
  chartOptions: Options
  darkMode: boolean
}

export default function DeltaChart({
  chartOptions,
  darkMode
}: DeltaChartProps) {
  return (
    <div className="flex-grow min-w-0">
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          ...chartOptions,
          legend: {
            ...chartOptions.legend,
            enabled: false
          }
        }}
      />
    </div>
  )
}
