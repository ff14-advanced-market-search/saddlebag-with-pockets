import CodeBlock from '~/components/Common/CodeBlock'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/WoW/WeeklyPriceGroupDelta'

interface RequestDataSectionProps {
  data: WeeklyPriceGroupDeltaResponse
  wowRegion: string
  startDate: string
  darkMode: boolean
}

export default function RequestDataSection({
  data,
  wowRegion,
  startDate,
  darkMode
}: RequestDataSectionProps) {
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
          codeString={JSON.stringify(
            {
              region: wowRegion,
              start_year: Number.parseInt(startDate.slice(0, 4)),
              start_month: Number.parseInt(startDate.slice(4, 6)),
              start_day: Number.parseInt(startDate.slice(6, 8)),
              price_groups: Object.entries(data).map(([name, groupData]) => ({
                name,
                item_ids: Object.keys(groupData.item_data).map((id: string) =>
                  Number.parseInt(id)
                ),
                categories: []
              }))
            },
            null,
            2
          )}
          onClick={() => alert('Copied to clipboard!')}>
          <p className="italic text-sm text-gray-700 dark:text-gray-300 py-2">
            You can copy this data to recreate the same analysis later.
          </p>
        </CodeBlock>
      </div>
    </div>
  )
}
