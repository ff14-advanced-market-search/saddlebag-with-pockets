import CodeBlock from '~/components/Common/CodeBlock'
import type { PriceGroup } from '~/requests/FFXIV/WeeklyPriceGroupDelta'

interface RequestPreviewProps {
  region: string
  startYear: number
  startMonth: number
  startDay: number
  endYear: number
  endMonth: number
  endDay: number
  minimumMarketshare: number
  priceSetting: string
  quantitySetting: string
  priceGroups: PriceGroup[]
}

export default function RequestPreview({
  region,
  startYear,
  startMonth,
  startDay,
  endYear,
  endMonth,
  endDay,
  minimumMarketshare,
  priceSetting,
  quantitySetting,
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
    minimum_marketshare: minimumMarketshare,
    price_setting: priceSetting,
    quantity_setting: quantitySetting,
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
            navigator.clipboard.writeText(JSON.stringify(requestData, null, 2))
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
