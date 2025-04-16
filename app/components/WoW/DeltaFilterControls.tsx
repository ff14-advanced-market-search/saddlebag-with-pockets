import { useState } from 'react'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/WoW/WeeklyPriceGroupDelta'

interface DeltaFilterControlsProps {
  selectedGroup: string
  startDate: string
  endDate: string
  data: WeeklyPriceGroupDeltaResponse
  onApplyFilter: (newVisibleItems: Record<string, boolean>) => void
}

export default function DeltaFilterControls({
  selectedGroup,
  startDate,
  endDate,
  data,
  onApplyFilter
}: DeltaFilterControlsProps) {
  const [isPeakDeltaFilterEnabled, setIsPeakDeltaFilterEnabled] =
    useState(false)
  const [pendingMinPeakDeltaFilter, setPendingMinPeakDeltaFilter] = useState<
    number | 'any'
  >('any')
  const [pendingMaxPeakDeltaFilter, setPendingMaxPeakDeltaFilter] = useState<
    number | 'any'
  >('any')

  if (!selectedGroup || selectedGroup === 'All') return null

  return (
    <div className="px-4 mb-2 space-y-2 border-t border-b border-gray-300 dark:border-gray-600 py-2">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isPeakDeltaFilterEnabled}
          onChange={(e) => setIsPeakDeltaFilterEnabled(e.target.checked)}
          className="form-checkbox h-4 w-4 text-blue-500"
        />
        <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
          Filter by Price Change %
        </span>
      </label>
      {isPeakDeltaFilterEnabled && (
        <div className="space-y-1 pl-5">
          <div className="flex items-center">
            <label
              htmlFor="maxPeakDeltaFilter"
              className="text-xs w-10 text-gray-900 dark:text-gray-100">
              Max:
            </label>
            <select
              id="maxPeakDeltaFilter"
              value={pendingMaxPeakDeltaFilter}
              onChange={(e) => {
                const val = e.target.value
                setPendingMaxPeakDeltaFilter(
                  val === 'any' ? 'any' : Number(val)
                )
              }}
              className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 flex-1">
              <option value="any">Any</option>
              <option value={-50}>-50%</option>
              <option value={-25}>-25%</option>
              <option value={0}>0%</option>
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
          <div className="flex items-center">
            <label
              htmlFor="minPeakDeltaFilter"
              className="text-xs w-10 text-gray-900 dark:text-gray-100">
              Min:
            </label>
            <select
              id="minPeakDeltaFilter"
              value={pendingMinPeakDeltaFilter}
              onChange={(e) => {
                const val = e.target.value
                setPendingMinPeakDeltaFilter(
                  val === 'any' ? 'any' : Number(val)
                )
              }}
              className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 flex-1">
              <option value="any">Any</option>
              <option value={-100}>-100%</option>
              <option value={-95}>-95%</option>
              <option value={-85}>-85%</option>
              <option value={-75}>-75%</option>
              <option value={-50}>-50%</option>
              <option value={-25}>-25%</option>
              <option value={0}>0%</option>
            </select>
          </div>
          <button
            onClick={() => {
              if (!selectedGroup || !data[selectedGroup]) return

              // Start with all items unselected except the average
              const newVisibleItems: Record<string, boolean> = {
                [`${selectedGroup} (Average)`]: true
              }

              // Only select items that match the filter criteria
              Object.entries(data[selectedGroup].item_data).forEach(
                ([itemId, itemData]) => {
                  const itemName = data[selectedGroup].item_names[itemId]

                  // Get all deltas for the item within the current date range
                  const deltasInRange = itemData.weekly_data
                    .filter(
                      (d) =>
                        d.t.toString() >= startDate &&
                        d.t.toString() <= endDate &&
                        d.delta !== null &&
                        d.delta !== undefined
                    )
                    .map((d) => d.delta)

                  let shouldBeVisible = deltasInRange.length > 0

                  // Check against filters
                  if (shouldBeVisible) {
                    for (const delta of deltasInRange) {
                      const minFail =
                        pendingMinPeakDeltaFilter !== 'any' &&
                        delta < pendingMinPeakDeltaFilter
                      const maxFail =
                        pendingMaxPeakDeltaFilter !== 'any' &&
                        delta > pendingMaxPeakDeltaFilter

                      if (minFail || maxFail) {
                        shouldBeVisible = false
                        break
                      }
                    }
                  }

                  newVisibleItems[itemName] = shouldBeVisible
                }
              )

              onApplyFilter(newVisibleItems)
            }}
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded transition-colors">
            Apply Filter
          </button>
        </div>
      )}
    </div>
  )
}
