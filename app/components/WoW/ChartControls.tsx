interface ChartControlsProps {
  minYAxis: number | null
  maxYAxis: number | null
  onMinYAxisChange: (value: number | null) => void
  onMaxYAxisChange: (value: number | null) => void
  darkMode: boolean
}

export default function ChartControls({
  minYAxis,
  maxYAxis,
  onMinYAxisChange,
  onMaxYAxisChange,
  darkMode
}: ChartControlsProps) {
  return (
    <div className="px-4 mb-2">
      <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">
        Chart Y-Axis Range:
      </h4>

      <div className="flex items-center">
        <label
          htmlFor="maxYAxis"
          className="text-xs font-medium w-16 text-gray-900 dark:text-gray-100">
          Max Price %:
        </label>
        <select
          id="maxYAxis"
          value={maxYAxis === null ? 'auto' : maxYAxis}
          onChange={(e) => {
            const val = e.target.value
            onMaxYAxisChange(val === 'auto' ? null : Number(val))
          }}
          className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 flex-1">
          <option value="auto">Auto</option>
          <option value={25}>25%</option>
          <option value={50}>50%</option>
          <option value={100}>100%</option>
          <option value={200}>200%</option>
          <option value={500}>500%</option>
          <option value={1000}>1000%</option>
          <option value={1500}>1500%</option>
          <option value={2000}>2000%</option>
          <option value={3000}>3000%</option>
          <option value={4000}>4000%</option>
          <option value={5000}>5000%</option>
        </select>
      </div>
      <div className="flex items-center mb-2">
        <label
          htmlFor="minYAxis"
          className="text-xs font-medium w-16 text-gray-900 dark:text-gray-100">
          Min Price %:
        </label>
        <select
          id="minYAxis"
          value={minYAxis === null ? 'auto' : minYAxis}
          onChange={(e) => {
            const val = e.target.value
            onMinYAxisChange(val === 'auto' ? null : Number(val))
          }}
          className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 flex-1">
          <option value="auto">Auto</option>
          <option value={-95}>-95%</option>
          <option value={-85}>-85%</option>
          <option value={-75}>-75%</option>
          <option value={-50}>-50%</option>
          <option value={-25}>-25%</option>
          <option value={0}>0%</option>
        </select>
      </div>
    </div>
  )
}
