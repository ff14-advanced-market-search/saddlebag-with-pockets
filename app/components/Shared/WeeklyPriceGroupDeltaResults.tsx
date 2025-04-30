import { useState } from 'react'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import { PageWrapper } from '~/components/Common'

interface ResultsProps {
  data: WeeklyPriceGroupDeltaResponse
  pageTitle: string
  darkMode: boolean
  backUrl: string
}

export default function WeeklyPriceGroupDeltaResults({
  data,
  pageTitle,
  darkMode,
  backUrl
}: ResultsProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('All')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Get all unique timestamps across all groups
  const allTimestamps = Array.from(
    new Set(
      Object.values(data).flatMap((groupData) => Object.keys(groupData.deltas))
    )
  ).sort()

  // Initialize selected dates to full range
  if (allTimestamps.length > 0 && !startDate && !endDate) {
    setStartDate(allTimestamps[0])
    setEndDate(allTimestamps[allTimestamps.length - 1])
  }

  // Filter timestamps based on date range
  const filteredTimestamps = allTimestamps.filter(
    (timestamp) => timestamp >= startDate && timestamp <= endDate
  )

  // Format timestamp into YYYY-MM-DD
  const formatTimestamp = (timestamp: string) => {
    const dateStr = timestamp.padStart(8, '0') // Ensure 8 digits
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    return `${year}-${month}-${day}`
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {pageTitle}
      </h1>

      <div className="space-y-4">
        {/* Back Button */}
        <div className="mb-4">
          <a
            href={backUrl}
            className="text-blue-500 hover:text-blue-600 font-medium">
            ← Search Again
          </a>
        </div>

        {/* Date Range */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Date Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Start Date
              </label>
              <select
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                {allTimestamps.map((timestamp) => (
                  <option
                    key={timestamp}
                    value={timestamp}
                    className="bg-gray-700">
                    {formatTimestamp(timestamp)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">
                End Date
              </label>
              <select
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                {allTimestamps.map((timestamp) => (
                  <option
                    key={timestamp}
                    value={timestamp}
                    className="bg-gray-700">
                    {formatTimestamp(timestamp)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Group Selector */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Select Group</h3>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="All">All Groups</option>
            {Object.keys(data).map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Results</h3>
          {selectedGroup === 'All' ? (
            // Display overview of all groups
            <div className="space-y-4">
              {Object.entries(data).map(([groupName, groupData]) => (
                <div key={groupName} className="space-y-2">
                  <h4 className="text-lg font-medium text-gray-100">
                    {groupName}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(groupData.deltas)
                      .filter(([timestamp]) =>
                        filteredTimestamps.includes(timestamp)
                      )
                      .map(([timestamp, delta]) => (
                        <div
                          key={timestamp}
                          className="bg-gray-900 p-3 rounded-lg">
                          <div className="text-sm text-gray-400">
                            {formatTimestamp(timestamp)}
                          </div>
                          <div
                            className={`text-lg font-semibold ${
                              delta > 0
                                ? 'text-green-500'
                                : delta < 0
                                ? 'text-red-500'
                                : 'text-gray-500'
                            }`}>
                            {delta > 0 ? '+' : ''}
                            {delta.toFixed(2)}%
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Display detailed view of selected group
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(data[selectedGroup].deltas)
                  .filter(([timestamp]) => filteredTimestamps.includes(timestamp))
                  .map(([timestamp, delta]) => (
                    <div
                      key={timestamp}
                      className="bg-gray-900 p-3 rounded-lg">
                      <div className="text-sm text-gray-400">
                        {formatTimestamp(timestamp)}
                      </div>
                      <div
                        className={`text-lg font-semibold ${
                          delta > 0
                            ? 'text-green-500'
                            : delta < 0
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}>
                        {delta > 0 ? '+' : ''}
                        {delta.toFixed(2)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
} 