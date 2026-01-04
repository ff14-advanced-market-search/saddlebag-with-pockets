import CodeBlock from '~/components/Common/CodeBlock'
import type { GW2WeeklyPriceGroupDeltaResponse } from '~/requests/GW2/WeeklyPriceGroupDelta'

interface RequestDataSectionProps {
  data: GW2WeeklyPriceGroupDeltaResponse
  startDate: string
  endDate: string
  darkmode: boolean
  minimumValue: number
  minimumSales: number
  minimumAveragePrice: number
}

export default function RequestDataSection({
  data,
  startDate,
  endDate,
  darkmode,
  minimumValue,
  minimumSales,
  minimumAveragePrice
}: RequestDataSectionProps) {
  // Format timestamp like 2025110300 to date parts
  const formatTimestampToDate = (timestamp: string) => {
    const dateStr = timestamp.padStart(10, '0')
    return {
      year: Number.parseInt(dateStr.slice(0, 4)),
      month: Number.parseInt(dateStr.slice(4, 6)),
      day: Number.parseInt(dateStr.slice(6, 8))
    }
  }

  const startDateParts = formatTimestampToDate(startDate)
  const endDateParts = formatTimestampToDate(endDate)

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
              start_year: startDateParts.year,
              start_month: startDateParts.month,
              start_day: startDateParts.day,
              end_year: endDateParts.year,
              end_month: endDateParts.month,
              end_day: endDateParts.day,
              minimum_value: minimumValue, // Already in coppers from API
              minimum_sales: minimumSales,
              minimum_average_price: minimumAveragePrice, // Already in coppers from API
              price_groups: Object.entries(data).map(([name, groupData]) => ({
                name,
                item_ids: Object.keys(groupData.item_data).map((id: string) =>
                  Number.parseInt(id)
                ),
                types: [] // Types are not stored in the response, so we can't reconstruct them
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
