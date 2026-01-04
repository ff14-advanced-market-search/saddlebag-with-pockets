import CodeBlock from '~/components/Common/CodeBlock'
import type { GW2PriceGroup } from '~/requests/GW2/WeeklyPriceGroupDelta'

interface RequestPreviewProps {
  startYear: number
  startMonth: number
  startDay: number
  endYear: number
  endMonth: number
  endDay: number
  minimumValue: number
  minimumSales: number
  minimumAveragePrice: number
  priceGroups: GW2PriceGroup[]
}

export default function RequestPreview({
  startYear,
  startMonth,
  startDay,
  endYear,
  endMonth,
  endDay,
  minimumValue,
  minimumSales,
  minimumAveragePrice,
  priceGroups
}: RequestPreviewProps) {
  // Convert from gold (UI) to coppers (API) for the preview
  const requestData = {
    start_year: startYear,
    start_month: startMonth,
    start_day: startDay,
    end_year: endYear,
    end_month: endMonth,
    end_day: endDay,
    minimum_value: Math.round(minimumValue * 10000), // Convert gold to coppers
    minimum_sales: minimumSales,
    minimum_average_price: Math.round(minimumAveragePrice * 10000), // Convert gold to coppers
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
          onClick={async () => {
            try {
              const textToCopy = JSON.stringify(requestData, null, 2)
              await navigator.clipboard.writeText(textToCopy)
              alert('Copied to clipboard!')
            } catch (error) {
              console.error('Failed to copy to clipboard:', error)
              alert('Failed to copy to clipboard. Please try again.')
            }
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
