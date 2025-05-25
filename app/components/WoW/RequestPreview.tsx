import CodeBlock from '~/components/Common/CodeBlock'
import type { PriceGroup } from '~/requests/WoW/WeeklyPriceGroupDelta'

interface RequestPreviewProps {
  region: string
  startYear: number
  startMonth: number
  startDay: number
  endYear: number
  endMonth: number
  endDay: number
  priceGroups: PriceGroup[]
}

/**
 * Displays a formatted preview of the API request data based on the provided region, date, and price groups.
 *
 * Renders a code block showing the JSON payload that will be sent to the API upon form submission, along with a copy-to-clipboard button and explanatory text.
 *
 * @param region - The selected region for the request.
 * @param startYear - The starting year for the request data.
 * @param startMonth - The starting month for the request data.
 * @param startDay - The starting day for the request data.
 * @param endYear - The ending year for the request data.
 * @param endMonth - The ending month for the request data.
 * @param endDay - The ending day for the request data.
 * @param priceGroups - An array of price group objects to include in the request.
 */
export default function RequestPreview({
  region,
  startYear,
  startMonth,
  startDay,
  endYear,
  endMonth,
  endDay,
  priceGroups
}: RequestPreviewProps) {
  const requestData = {
    region,
    start_year: startYear,
    start_month: startMonth,
    start_day: startDay,
    end_year: endYear,
    end_month: endMonth,
    end_day: endDay,
    price_groups: priceGroups
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Request Data Preview
      </h3>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <CodeBlock
          title="Input for weekly price group delta"
          buttonTitle="Copy"
          codeString={JSON.stringify(requestData, null, 2)}
          onClick={() => {
            alert('Copied to clipboard!')
          }}>
          <p className="italic text-sm text-gray-700 dark:text-gray-300 py-2">
            This is the data that will be sent to the API when you submit the
            form.
          </p>
        </CodeBlock>
      </div>
    </div>
  )
}
