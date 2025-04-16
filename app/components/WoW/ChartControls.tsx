interface ChartControlsProps {
  minYAxis: number | null
  maxYAxis: number | null
  onMinYAxisChange: (value: number | null) => void
  onMaxYAxisChange: (value: number | null) => void
  darkMode: boolean
}

const DEFAULT_MAX_PRESETS = [25, 50, 100, 200, 500, 1000, 2000, 5000]
const DEFAULT_MIN_PRESETS = [-95, -75, -50, -25, 0]

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

      <div className="flex items-center mb-2">
        <label
          htmlFor="maxYAxis"
          className="text-xs font-medium w-16 text-gray-900 dark:text-gray-100">
          Max Price %:
        </label>
        <div className="flex-1 flex gap-2">
          <input
            type="number"
            id="maxYAxis"
            value={maxYAxis ?? ''}
            onChange={(e) => {
              const val = e.target.value
              const newMax = val === '' ? null : Number(val)
              if (newMax === null || minYAxis === null || newMax > minYAxis) {
                onMaxYAxisChange(newMax)
              }
            }}
            placeholder="Auto"
            className="flex-1 text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
          <select
            value=""
            onChange={(e) => {
              const val = e.target.value
              const newMax = val === 'auto' ? null : Number(val)
              if (newMax === null || minYAxis === null || newMax > minYAxis) {
                onMaxYAxisChange(newMax)
              }
            }}
            className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            <option value="">Presets</option>
            <option value="auto">Auto</option>
            {DEFAULT_MAX_PRESETS.map((value) => (
              <option key={value} value={value}>
                {value}%
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center mb-2">
        <label
          htmlFor="minYAxis"
          className="text-xs font-medium w-16 text-gray-900 dark:text-gray-100">
          Min Price %:
        </label>
        <div className="flex-1 flex gap-2">
          <input
            type="number"
            id="minYAxis"
            value={minYAxis ?? ''}
            onChange={(e) => {
              const val = e.target.value
              const newMin = val === '' ? null : Number(val)
              if (newMin === null || maxYAxis === null || newMin < maxYAxis) {
                onMinYAxisChange(newMin)
              }
            }}
            placeholder="Auto"
            className="flex-1 text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
          <select
            value=""
            onChange={(e) => {
              const val = e.target.value
              const newMin = val === 'auto' ? null : Number(val)
              if (newMin === null || maxYAxis === null || newMin < maxYAxis) {
                onMinYAxisChange(newMin)
              }
            }}
            className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            <option value="">Presets</option>
            <option value="auto">Auto</option>
            {DEFAULT_MIN_PRESETS.map((value) => (
              <option key={value} value={value}>
                {value}%
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
