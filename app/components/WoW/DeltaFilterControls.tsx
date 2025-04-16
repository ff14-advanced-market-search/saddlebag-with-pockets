import { useState } from 'react'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/WoW/WeeklyPriceGroupDelta'

interface DeltaFilterControlsProps {
  selectedGroup: string
  startDate: string
  endDate: string
  data: WeeklyPriceGroupDeltaResponse
  onApplyFilter: (newVisibleItems: Record<string, boolean>) => void
}

const DEFAULT_MAX_PRESETS = [25, 50, 100, 200, 500, 1000, 2000, 5000]
const DEFAULT_MIN_PRESETS = [-100, -95, -85, -75, -50, -25, 0]

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
    number | null
  >(null)
  const [pendingMaxPeakDeltaFilter, setPendingMaxPeakDeltaFilter] = useState<
    number | null
  >(null)

  if (!selectedGroup || selectedGroup === 'All') return null

  const handleApplyFilter = () => {
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
              pendingMinPeakDeltaFilter !== null &&
              delta < pendingMinPeakDeltaFilter
            const maxFail =
              pendingMaxPeakDeltaFilter !== null &&
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
  }

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
          Exclude Items by Price Change %
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
            <div className="flex-1 flex gap-2">
              <input
                type="number"
                id="maxPeakDeltaFilter"
                value={pendingMaxPeakDeltaFilter ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  const newMax = val === '' ? null : Number(val)
                  if (
                    newMax === null ||
                    pendingMinPeakDeltaFilter === null ||
                    newMax > pendingMinPeakDeltaFilter
                  ) {
                    setPendingMaxPeakDeltaFilter(newMax)
                  }
                }}
                placeholder="Any"
                className="flex-1 text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
              <select
                value=""
                onChange={(e) => {
                  const val = e.target.value
                  const newMax = val === 'any' ? null : Number(val)
                  if (
                    newMax === null ||
                    pendingMinPeakDeltaFilter === null ||
                    newMax > pendingMinPeakDeltaFilter
                  ) {
                    setPendingMaxPeakDeltaFilter(newMax)
                  }
                }}
                className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <option value="">Presets</option>
                <option value="any">Any</option>
                {DEFAULT_MAX_PRESETS.map((value) => (
                  <option key={value} value={value}>
                    {value}%
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <label
              htmlFor="minPeakDeltaFilter"
              className="text-xs w-10 text-gray-900 dark:text-gray-100">
              Min:
            </label>
            <div className="flex-1 flex gap-2">
              <input
                type="number"
                id="minPeakDeltaFilter"
                value={pendingMinPeakDeltaFilter ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  const newMin = val === '' ? null : Number(val)
                  if (
                    newMin === null ||
                    pendingMaxPeakDeltaFilter === null ||
                    newMin < pendingMaxPeakDeltaFilter
                  ) {
                    setPendingMinPeakDeltaFilter(newMin)
                  }
                }}
                placeholder="Any"
                className="flex-1 text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
              <select
                value=""
                onChange={(e) => {
                  const val = e.target.value
                  const newMin = val === 'any' ? null : Number(val)
                  if (
                    newMin === null ||
                    pendingMaxPeakDeltaFilter === null ||
                    newMin < pendingMaxPeakDeltaFilter
                  ) {
                    setPendingMinPeakDeltaFilter(newMin)
                  }
                }}
                className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <option value="">Presets</option>
                <option value="any">Any</option>
                {DEFAULT_MIN_PRESETS.map((value) => (
                  <option key={value} value={value}>
                    {value}%
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleApplyFilter}
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded transition-colors">
            Apply Filter
          </button>
        </div>
      )}
    </div>
  )
}
