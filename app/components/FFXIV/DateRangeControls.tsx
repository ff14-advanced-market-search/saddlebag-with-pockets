interface DateRangeControlsProps {
  startDate: string
  endDate: string
  allTimestamps: string[]
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  formatTimestamp: (timestamp: string) => string
}

export default function DateRangeControls({
  startDate,
  endDate,
  allTimestamps,
  onStartDateChange,
  onEndDateChange,
  formatTimestamp
}: DateRangeControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Date Range
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Start Date
          </label>
          <select
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {allTimestamps.map((timestamp) => (
              <option
                key={timestamp}
                value={timestamp}
                className="dark:bg-gray-700">
                {formatTimestamp(timestamp)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            End Date
          </label>
          <select
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {allTimestamps.map((timestamp) => (
              <option
                key={timestamp}
                value={timestamp}
                className="dark:bg-gray-700">
                {formatTimestamp(timestamp)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
