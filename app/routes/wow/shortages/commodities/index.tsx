import { useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import NoResults from '../../../queries/listings/NoResults'
import { PageWrapper } from '~/components/Common'
import type { WowShortageResult } from '~/requests/WoWCommodities'
import WoWCommodityShortage from '~/requests/WoWCommodities'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { ItemClassSelect, ItemQualitySelect } from '../../full-scan/WoWScanForm'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import CommoditiesResults from './CommoditiesResults'
import WoWServerSelect from '../../full-scan/WoWServerSelect'
import { useState } from 'react'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const homeServerData = formData.get('homeServer')
  if (!homeServerData || typeof homeServerData !== 'string') {
    return json({ exception: 'Missing home server selection' })
  }

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
  const [serverName, setServerName] = useState<string | undefined>()
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

  if (results && 'increase' in results) {
    return <CommoditiesResults results={results} serverName={serverName} />
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Commodity Shortage finder"
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        disabled={transition.state === 'submitting'}
        error={
          results && 'exception' in results ? results.exception : undefined
        }>
        <WoWShortageFormFields />
        <WoWServerSelect
          formName="homeServer"
          title="Home Server"
          onSelectChange={(selectValue) => {
            if (selectValue) setServerName(selectValue.name)
          }}
          toolTip="Select your home world server, type to begin selection."
        />
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index

export const WoWShortageFormFields = ({
  desiredAvgPriceDefault = 30,
  desiredSellPriceDefault = 200,
  desiredPriceIncreaseDefault = 50,
  desiredSalesPerDayDefault = 40,
  flipRiskLimitDefault = 100
}) => (
  <div className="flex flex-1 flex-col mt-7">
    <ItemClassSelect />
    <ItemQualitySelect />
    <InputWithLabel
      defaultValue={desiredAvgPriceDefault}
      type="number"
      labelTitle="Desired Avg Price"
      inputTag="Amount"
      name="desiredAvgPrice"
      min={0}
      toolTip="Give an average price you're looking to spend"
    />
    <InputWithLabel
      defaultValue={desiredSellPriceDefault}
      type="number"
      labelTitle="Desired Sale Increase"
      inputTag="Price"
      name="desiredSellPrice"
      min={0}
      toolTip="Give a price you're looking to sell at"
    />

    <InputWithLabel
      defaultValue={desiredPriceIncreaseDefault}
      type="number"
      labelTitle="Desired Price Increase"
      inputTag="Price"
      name="desiredPriceIncrease"
      min={0}
      toolTip="Give an amount you're looking to increae by"
    />
    <InputWithLabel
      defaultValue={desiredSalesPerDayDefault}
      type="number"
      labelTitle="Desired Sales per Day"
      inputTag="Sales"
      name="desiredSalesPerDay"
      min={0}
      toolTip="Sets popularity of item"
    />
    <InputWithLabel
      defaultValue={flipRiskLimitDefault}
      type="number"
      labelTitle="Risk Limit"
      inputTag="%"
      name="flipRiskLimit"
      min={0}
      toolTip="Change how risky something is by reducing the percentage amount"
    />
  </div>
)
