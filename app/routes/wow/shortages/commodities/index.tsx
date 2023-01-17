import { useActionData, useLoaderData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import NoResults from '../../../queries/listings/NoResults'
import { PageWrapper } from '~/components/Common'
import type { WowShortageResult } from '~/requests/WoWCommodities'
import WoWCommodityShortage from '~/requests/WoWCommodities'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import {
  ItemClassSelect,
  ItemQualitySelect
} from '../../../../components/form/WoW/WoWScanForm'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import ShortageResults from '../ShortageResults'
import { useState } from 'react'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import { getUserSessionData } from '~/sessions'
import type { WoWLoaderData } from '~/requests/WoW/types'

export const validateShortageData = (
  formData: FormData
):
  | {
      desiredAvgPrice: number
      desiredSalesPerDay: number
      desiredPriceIncrease: number
      desiredSellPrice: number
      flipRiskLimit: number
      itemQuality: number
      itemClass: number
      itemSubClass: number
      homeRealmId: number
      underMarketPricePercent: number
      overMarketPricePercent: number
    }
  | { exception: string } => {
  const homeServerData = formData.get('homeRealmId')
  if (!homeServerData || typeof homeServerData !== 'string') {
    return { exception: 'Missing home server selection' }
  }

  const homeRealmId = parseFloat(homeServerData)

  const desiredAvgPriceData = formData.get('desiredAvgPrice')
  if (!desiredAvgPriceData || typeof desiredAvgPriceData !== 'string') {
    return { exception: 'Missing average price data' }
  }
  const desiredAvgPrice = parseFloat(desiredAvgPriceData)

  const desiredSalesPerDayData = formData.get('desiredSalesPerDay')
  if (!desiredSalesPerDayData || typeof desiredSalesPerDayData !== 'string') {
    return { exception: 'Missing selling price data' }
  }
  const desiredSalesPerDay = parseFloat(desiredSalesPerDayData)

  const desiredPriceIncreaseData = formData.get('desiredPriceIncrease')
  if (
    !desiredPriceIncreaseData ||
    typeof desiredPriceIncreaseData !== 'string'
  ) {
    return { exception: 'Missing price increase data' }
  }
  const desiredPriceIncrease = parseFloat(desiredPriceIncreaseData)

  const desiredSellPriceData = formData.get('desiredSellPrice')
  if (!desiredSellPriceData || typeof desiredSellPriceData !== 'string') {
    return { exception: 'Missing sell price data' }
  }
  const desiredSellPrice = parseFloat(desiredSellPriceData)

  const flipRiskLimitData = formData.get('flipRiskLimit')
  if (!flipRiskLimitData || typeof flipRiskLimitData !== 'string') {
    return { exception: 'Missing sell price data' }
  }
  const flipRiskLimit = parseFloat(flipRiskLimitData)

  const itemQualityData = formData.get('itemQuality')
  if (!itemQualityData || typeof itemQualityData !== 'string') {
    return { exception: 'Missing sell price data' }
  }
  const itemQuality = parseFloat(itemQualityData)

  const itemClassData = formData.get('itemClass')
  if (!itemClassData || typeof itemClassData !== 'string') {
    return { exception: 'Missing sell price data' }
  }
  const itemClass = parseFloat(itemClassData)

  const itemSubClassData = formData.get('itemSubClass')
  if (!itemSubClassData || typeof itemSubClassData !== 'string') {
    return { exception: 'Missing sell price data' }
  }
  const itemSubClass = parseFloat(itemSubClassData)

  const underMarketPricePercentData = formData.get('underMarketPricePercent')
  if (
    !underMarketPricePercentData ||
    typeof underMarketPricePercentData !== 'string'
  ) {
    return { exception: 'Missing under market price percentage' }
  }
  const underMarketPricePercent = parseFloat(underMarketPricePercentData)

  const overMarketPricePercentData = formData.get('overMarketPricePercent')
  if (
    !overMarketPricePercentData ||
    typeof overMarketPricePercentData !== 'string'
  ) {
    return { exception: 'Missing over market price percentage' }
  }
  const overMarketPricePercent = parseFloat(overMarketPricePercentData)

  return {
    desiredAvgPrice,
    desiredSalesPerDay,
    desiredPriceIncrease,
    desiredSellPrice,
    flipRiskLimit,
    itemQuality,
    itemClass,
    itemSubClass,
    homeRealmId,
    underMarketPricePercent,
    overMarketPricePercent
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const validInput = validateShortageData(formData)

  if ('exception' in validInput) {
    return json(validInput)
  }

  const region = formData.get('region')
  if (
    !region ||
    typeof region !== 'string' ||
    (region !== 'NA' && region !== 'EU')
  ) {
    return json({ exception: 'Missing server region' })
  }

  const res = await WoWCommodityShortage({ ...validInput, region })
  return json({
    ...(await res.json()),
    region
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

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData<WowShortageResult>()
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()

  const [serverName, setServerName] = useState<string>(wowRealm.name)

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }
  console.log(results)

  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href={`/wow/shortages/commodities`} />
    }
  }

  if (results && 'increase' in results) {
    return (
      <ShortageResults
        results={results}
        serverName={serverName}
        region={results.region}
      />
    )
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
        <RegionAndServerSelect
          region={wowRegion}
          serverSelectFormName="homeRealmId"
          defaultRealm={wowRealm}
          serverSelectTitle="Home Server"
          onServerSelectChange={(selectValue) => {
            if (selectValue) setServerName(selectValue.name)
          }}
          serverSelectTooltip="Select your home world server, type to begin selection."
        />
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index

export const WoWShortageFormFields = ({
  desiredAvgPriceDefault = 100,
  desiredSellPriceDefault = 200,
  desiredPriceIncreaseDefault = 50,
  desiredSalesPerDayDefault = 40,
  flipRiskLimitDefault = 10,
  overMarketPricePercentDefault = 0,
  underMarketPricePercentDefault = 0
}) => (
  <div className="flex flex-1 flex-col">
    <ItemClassSelect />
    <ItemQualitySelect />
    <InputWithLabel
      defaultValue={desiredAvgPriceDefault}
      type="number"
      labelTitle="Desired Avg Price"
      inputTag="Amount"
      name="desiredAvgPrice"
      min={0}
      toolTip="Find items that on average sell for this price or more."
    />
    <InputWithLabel
      defaultValue={desiredSalesPerDayDefault}
      type="number"
      labelTitle="Desired Sales per Day"
      inputTag="Sales"
      name="desiredSalesPerDay"
      min={0}
      toolTip="Finds items that have this many sales per day on your region."
    />
    <InputWithLabel
      defaultValue={desiredSellPriceDefault}
      type="number"
      labelTitle="Desired Minimum Sale Price"
      inputTag="Price"
      name="desiredSellPrice"
      min={0}
      toolTip="Finds items that you can sell for this price or higher. Ex: 200 means we want to get the price up to 200 or more."
    />
    <InputWithLabel
      defaultValue={desiredPriceIncreaseDefault}
      type="number"
      labelTitle="Desired Price Increase per Price Level"
      inputTag="Price"
      name="desiredPriceIncrease"
      min={0}
      toolTip="Only show price flip levels when the price difference is greater than this amount. Ex: 50 means that it will not show when we can increase the price from 100 to 120, but it will show when a price can be increased from 100 to 151 or more."
    />
    <InputWithLabel
      defaultValue={flipRiskLimitDefault}
      type="number"
      labelTitle="Price Risk Limit"
      inputTag="%"
      name="flipRiskLimit"
      min={0}
      toolTip="Change how risky something is by reducing the percentage amount.  The limit is the average price multiplied by your Price Risk Limit. Ex: if an item sells for 20g it will not consider any flips or resets over 2000g."
    />
    <InputWithLabel
      defaultValue={underMarketPricePercentDefault}
      type="number"
      labelTitle="Desired Discount Percent vs Average Price"
      inputTag="%"
      name="underMarketPricePercent"
      min={0}
      toolTip="Find items below the market price by choosing a desired discount vs average price. If price is usually 50g and desired discount is 50% then we look to see if its selling for 25g. Default of 0 skips checking this."
    />
    <InputWithLabel
      defaultValue={overMarketPricePercentDefault}
      type="number"
      labelTitle="Desired Increase Percenet vs Average Price"
      inputTag="%"
      name="overMarketPricePercent"
      min={0}
      toolTip="The percent over the average price you desire to sell at. EX: If an item usually sells for 100g and you choose a 100% increase, then we only show the item if you can sell at 200g. Default of 0 skips checking this."
    />
  </div>
)
