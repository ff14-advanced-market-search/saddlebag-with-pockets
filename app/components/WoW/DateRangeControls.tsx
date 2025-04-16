interface DateRangeControlsProps {
  startDate: string
  endDate: string
  allTimestamps: string[]
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  formatTimestamp: (timestamp: string) => string
}

/**
 * Renders UI controls for selecting and managing a date range from a list of timestamps.
 *
 * Provides dropdown selectors for start and end dates, ensuring the selected range is always valid by automatically adjusting the opposing date if an invalid range is chosen. Includes a button to reset the range to the earliest and latest available timestamps.
 *
 * @param startDate - The currently selected start date.
 * @param endDate - The currently selected end date.
 * @param allTimestamps - Array of all available timestamp strings for selection.
 * @param onStartDateChange - Callback invoked with the new start date when changed.
 * @param onEndDateChange - Callback invoked with the new end date when changed.
 * @param formatTimestamp - Function to format a timestamp string for display in the dropdowns.
 */
export default function DateRangeControls({
  startDate,
  endDate,
  allTimestamps,
  onStartDateChange,
  onEndDateChange,
  formatTimestamp
}: DateRangeControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            Start Date
          </label>
          <select
            id="startDate"
            value={startDate}
            onChange={(e) => {
              const newStart = e.target.value
              onStartDateChange(newStart)
              if (endDate < newStart) {
                onEndDateChange(newStart)
              }
            }}
            className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            {allTimestamps.map((timestamp) => (
              <option key={timestamp} value={timestamp}>
                {formatTimestamp(timestamp)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            End Date
          </label>
          <select
            id="endDate"
            value={endDate}
            onChange={(e) => {
              const newEnd = e.target.value
              onEndDateChange(newEnd)
              if (startDate > newEnd) {
                onStartDateChange(newEnd)
              }
            }}
            className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            {allTimestamps.map((timestamp) => (
              <option key={timestamp} value={timestamp}>
                {formatTimestamp(timestamp)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="resetRange"
            className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            Reset Range
          </label>
          <button
            id="resetRange"
            type="button"
            onClick={() => {
              onStartDateChange(allTimestamps[0])
              onEndDateChange(allTimestamps[allTimestamps.length - 1])
            }}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Reset to Full Range
          </button>
        </div>
      </div>
    </div>
  )
}
