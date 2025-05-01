import CodeBlock from '~/components/Common/CodeBlock'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/FFXIV/WeeklyPriceGroupDelta'

interface RequestDataSectionProps {
  data: WeeklyPriceGroupDeltaResponse
  region: string
  startDate: string
  endDate: string
  darkmode: boolean
  hqOnly: boolean
  priceSetting: string
  quantitySetting: string
}

export default function RequestDataSection({
  data,
  region,
  startDate,
  endDate,
  darkmode,
  hqOnly,
  priceSetting,
  quantitySetting
}: RequestDataSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-4">
      <h3
        className={`text-lg font-medium mb-4 ${
          darkmode ? 'text-gray-300' : 'text-gray-900'
        }`}>
        Request Data
      </h3>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg">
        <CodeBlock
          title="Request data used for this analysis"
          buttonTitle="Copy"
          codeString={JSON.stringify(
            {
              region,
              start_year: Number.parseInt(startDate.slice(0, 4)),
              start_month: Number.parseInt(startDate.slice(4, 6)),
              start_day: Number.parseInt(startDate.slice(6, 8)),
              end_year: Number.parseInt(endDate.slice(0, 4)),
              end_month: Number.parseInt(endDate.slice(4, 6)),
              end_day: Number.parseInt(endDate.slice(6, 8)),
              hq_only: hqOnly,
              price_setting: priceSetting,
              quantity_setting: quantitySetting,
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