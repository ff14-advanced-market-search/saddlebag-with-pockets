import CodeBlock from '~/components/Common/CodeBlock'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/WoW/WeeklyPriceGroupDelta'

interface RequestDataSectionProps {
  data: WeeklyPriceGroupDeltaResponse
  wowRegion: string
  startDate: string
  endDate: string
  darkMode: boolean
}

/**
 * Displays a styled section containing the request data used for an analysis, formatted as a copyable JSON code block.
 *
 * Renders the region, parsed start date, and grouped item data from the provided props, allowing users to copy the data for later use.
 */
export default function RequestDataSection({
  data,
  wowRegion,
  startDate,
  endDate,
  darkMode
}: RequestDataSectionProps) {
  const requestData = {
    region: wowRegion,
    start_year: Number.parseInt(startDate.slice(0, 4)),
    start_month: Number.parseInt(startDate.slice(4, 6)),
    start_day: Number.parseInt(startDate.slice(6, 8)),
    end_year: Number.parseInt(endDate.slice(0, 4)),
    end_month: Number.parseInt(endDate.slice(4, 6)),
    end_day: Number.parseInt(endDate.slice(6, 8)),
    price_groups: Object.entries(data).map(([name, groupData]) => ({
      name,
      item_ids: Object.keys(groupData.item_data).map((id: string) =>
        Number.parseInt(id)
      ),
      categories: []
    }))
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-4">
      <h3
        className={`text-lg font-medium mb-4 ${
          darkMode ? 'text-gray-300' : 'text-gray-900'
        }`}>
        Request Data
      </h3>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg">
        <CodeBlock
          title="Request data used for this analysis"
          buttonTitle="Copy"
          codeString={JSON.stringify(requestData, null, 2)}
          onClick={() => {
            alert('Copied to clipboard!')
          }}>
          <p className="italic text-sm text-gray-700 dark:text-gray-300 py-2">
            You can copy this data to recreate the same analysis later.
          </p>
        </CodeBlock>
      </div>
    </div>
  )
}
