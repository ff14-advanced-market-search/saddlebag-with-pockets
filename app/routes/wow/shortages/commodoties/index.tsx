import { useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import NoResults from '../../../queries/listings/NoResults'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import type { WowShortageResult } from '~/requests/WoWCommodities'
import WoWCommodityShortage from '~/requests/WoWCommodities'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { ItemClassSelect, ItemQualitySelect } from '../../full-scan/WoWScanForm'
import { InputWithLabel } from '~/components/form/InputWithLabel'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const desiredAvgPriceData = formData.get('desiredAvgPrice')
  if (!desiredAvgPriceData || typeof desiredAvgPriceData !== 'string') {
    return json({ exception: 'Missing average price data' })
  }
  const desiredAvgPrice = parseFloat(desiredAvgPriceData)

  const desiredSalesPerDayData = formData.get('desiredSalesPerDay')
  if (!desiredSalesPerDayData || typeof desiredSalesPerDayData !== 'string') {
    return json({ exception: 'Missing selling price data' })
  }
  const desiredSalesPerDay = parseFloat(desiredSalesPerDayData)

  const desiredPriceIncreaseData = formData.get('desiredPriceIncrease')
  if (
    !desiredPriceIncreaseData ||
    typeof desiredPriceIncreaseData !== 'string'
  ) {
    return json({ exception: 'Missing price increase data' })
  }
  const desiredPriceIncrease = parseFloat(desiredPriceIncreaseData)

  const desiredSellPriceData = formData.get('desiredSellPrice')
  if (!desiredSellPriceData || typeof desiredSellPriceData !== 'string') {
    return json({ exception: 'Missing sell price data' })
  }
  const desiredSellPrice = parseFloat(desiredSellPriceData)

  const flipRiskLimitData = formData.get('flipRiskLimit')
  if (!flipRiskLimitData || typeof flipRiskLimitData !== 'string') {
    return json({ exception: 'Missing sell price data' })
  }
  const flipRiskLimit = parseFloat(flipRiskLimitData)

  const itemQualityData = formData.get('itemQuality')
  if (!itemQualityData || typeof itemQualityData !== 'string') {
    return json({ exception: 'Missing sell price data' })
  }
  const itemQuality = parseFloat(itemQualityData)

  const itemClassData = formData.get('itemClass')
  if (!itemClassData || typeof itemClassData !== 'string') {
    return json({ exception: 'Missing sell price data' })
  }
  const itemClass = parseFloat(itemClassData)

  const itemSubClassData = formData.get('itemSubClass')
  if (!itemSubClassData || typeof itemSubClassData !== 'string') {
    return json({ exception: 'Missing sell price data' })
  }
  const itemSubClass = parseFloat(itemSubClassData)

  return await WoWCommodityShortage({
    desiredAvgPrice,
    desiredSalesPerDay,
    desiredPriceIncrease,
    desiredSellPrice,
    flipRiskLimit,
    itemQuality,
    itemClass,
    itemSubClass
  })
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error('errorBoundary', error)
  return (
    <pre>
      If you're seeing this, it'd be appreciated if you could report in our
      Discord's <span className={`font-bold`}>#bug-reporting</span> channel.
      Much thank
    </pre>
  )
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData<WowShortageResult>()
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href={`/wow/shorts`} />
    }
  }

  console.log(results)

  if (results && 'increase' in results) {
    return (
      <PageWrapper>
        <ContentContainer>
          <>
            <Title title="Increase these items" />
            <div className="flex w-full overflow-x-scroll">
              {results.increase.map((item) => (
                <div
                  key={item.item_id + '-increase'}
                  className="my-0.5 mx-1 w-1/2 shrink-0">
                  <p>{item.name}</p>
                  <p>Average price: {item.avg_price}</p>
                  <p>Sales per day: {item.sales_per_day}</p>
                  <p>Sales per hour: {item.sales_per_hour}</p>
                </div>
              ))}
            </div>
          </>
        </ContentContainer>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Commodoty Shortage finder"
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        disabled={transition.state === 'submitting'}
        error={
          results && 'exception' in results ? results.exception : undefined
        }>
        <ItemClassSelect />
        <ItemQualitySelect />
        <InputWithLabel
          defaultValue={30}
          type="number"
          labelTitle="Desired Avg Price"
          inputTag="Amount"
          name="desiredAvgPrice"
          min={0}
        />
        <InputWithLabel
          defaultValue={200}
          type="number"
          labelTitle="Desired Sale Increase"
          inputTag="Price"
          name="desiredSellPrice"
          min={0}
        />

        <InputWithLabel
          defaultValue={50}
          type="number"
          labelTitle="Desired Price Increase"
          inputTag="Price"
          name="desiredPriceIncrease"
          min={0}
        />
        <InputWithLabel
          defaultValue={40}
          type="number"
          labelTitle="Desired Sales per Day"
          inputTag="Sales"
          name="desiredSalesPerDay"
          min={0}
        />
        <InputWithLabel
          defaultValue={100}
          type="number"
          labelTitle="Risk Limit"
          inputTag="%"
          name="flipRiskLimit"
          min={0}
        />
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
