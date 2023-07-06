import { useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import {
  ItemClassSelect,
  ItemQualitySelect
} from '~/components/form/WoW/WoWScanForm'
import type { WoWLoaderData } from '~/requests/WoW/types'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { z } from 'zod'
import type {
  ShortagePredictorProps,
  PredictionResponse
} from '~/requests/WoW/ShortagePredictor'
import WoWShortagePredictor from '~/requests/WoW/ShortagePredictor'
import NoResults from '~/components/Common/NoResults'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import { getUserSessionData } from '~/sessions'
import { Results } from '~/components/WoWResults/ShortagePredictor/Results'

const inputMap: Record<keyof ShortagePredictorProps, string> = {
  homeRealmName: 'Home Realm Name',
  region: 'Region',
  desiredAvgPrice: 'Average Price',
  desiredSalesPerDay: 'Sales Per Day',
  itemQuality: 'Quality',
  itemClass: 'Item Class',
  itemSubClass: 'Item Sub Class',
  desiredPriceVsAvgPercent: 'Desired Current Price Percent vs Average Price',
  desiredQuantityVsAvgPercent:
    'Desired Current Quantity Percent vs Average Quantity'
}

const pageTitle = 'Commodity Shortage Futures'
const pageDescription =
  'Find Commodity Shortages and Price Spikes BEFORE they happen and be there first!'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  const validateFormData = z.object({
    homeRealmName: z
      .string()
      .min(1)
      .transform((value) => value.split('---')[1]),
    region: z.union([z.literal('NA'), z.literal('EU')]),
    desiredAvgPrice: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value) * 10000),
    desiredSalesPerDay: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    itemQuality: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemClass: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemSubClass: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    desiredPriceVsAvgPercent: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    desiredQuantityVsAvgPercent: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10))
  })

  const validInput = validateFormData.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: `Missing: ${validInput.error.issues
        .map(({ path }) =>
          path.map(
            (field) =>
              inputMap[field as keyof ShortagePredictorProps] ||
              'Unknown input error'
          )
        )
        .join(', ')}`
    })
  }

  return WoWShortagePredictor(validInput.data)
}

type ActionResponse = PredictionResponse | { exception: string } | {}

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

const Index = () => {
  const transition = useTransition()
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const results = useActionData<ActionResponse>()

  const loading = transition.state === 'submitting'

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault()
    }
  }

  if (results) {
    if (!Object.keys(results)) {
      return <NoResults href="/" title="No results found" />
    }

    if ('data' in results) {
      return <Results results={results} pageTitle={pageTitle} />
    }
  }
  const error =
    results && 'exception' in results ? results.exception : undefined
  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        description={pageDescription}
        onClick={onSubmit}
        error={error}
        loading={loading}>
        <div className="pt-2 md:pt-4">
          <InputWithLabel
            defaultValue={20}
            type="number"
            labelTitle="Minimum Desired Avg Price"
            inputTag="Gold"
            name="desiredAvgPrice"
            min={0}
            step={0.01}
            toolTip="Find items that on average sell for this amount of gold or more."
          />
          <InputWithLabel
            defaultValue={200}
            type="number"
            labelTitle="Minimum Desired Sales per Day"
            inputTag="Sales"
            name="desiredSalesPerDay"
            min={0}
            toolTip="Finds items that have this many sales per day."
          />
          <ItemQualitySelect />
          <ItemClassSelect />
          <RegionAndServerSelect
            serverSelectFormName="homeRealmName"
            region={wowRegion}
            defaultRealm={wowRealm}
          />
          <InputWithLabel
            defaultValue={120}
            type="number"
            labelTitle="Current Price Percent Above Average"
            inputTag="%"
            name="desiredPriceVsAvgPercent"
            min={0}
            toolTip="What is the maximum price spike to look for? 120% is to only find item that are at most 20% above the average price, so you get there before prices increase. After prices increase too much competition will show up preventing the price from going higher."
          />
          <InputWithLabel
            defaultValue={50}
            type="number"
            labelTitle="Current Market Quantity Percentage"
            inputTag="%"
            name="desiredQuantityVsAvgPercent"
            min={0}
            toolTip="How much of the market quantity is left? For 50% we want to find items which only have 50% of their average quantity remaining in stock."
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
