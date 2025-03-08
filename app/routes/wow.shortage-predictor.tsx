import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import {
  ItemClassSelect,
  ItemQualitySelect,
  ExpansionSelect
} from '~/components/form/WoW/WoWScanForm'
import type { WoWServerData } from '~/requests/WoW/types'
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
import { parseStringToNumber } from '~/utils/zodHelpers'
import { useState } from 'react'
import type { WoWServerRegion } from '~/requests/WoW/WOWScan'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'

const PAGE_URL = '/wow/shortage-predictor'

const defaultFormValues = {
  desiredAvgPrice: '20',
  desiredSalesPerDay: '200',
  itemQuality: '1',
  itemClass: '-1',
  itemSubClass: '-1',
  region: 'NA',
  homeRealmName: '3678---Thrall',
  desiredPriceVsAvgPercent: '120',
  desiredQuantityVsAvgPercent: '50',
  expansionNumber: '-1'
}

const inputMap: Record<keyof ShortagePredictorProps, string> = {
  desiredAvgPrice: 'Minimum Desired Average Price',
  desiredSalesPerDay: 'Minimum Desired Sales Per Day',
  itemQuality: 'Item Quality',
  itemClass: 'Item Category',
  itemSubClass: 'Item Sub Category',
  region: 'Select your region',
  homeRealmName: 'Search for server by name',
  desiredPriceVsAvgPercent: 'Current Price Percent Above Average',
  desiredQuantityVsAvgPercent: 'Current Market Quantity Percentage',
  expansionNumber: 'Expansion Number'
}

const pageTitle = 'Commodity Shortage Futures'
const pageDescription =
  'Find Commodity Shortages and Price Spikes BEFORE they happen and be there first!'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  const validateFormData = z.object({
    desiredAvgPrice: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value) * 10000),
    desiredSalesPerDay: parseStringToNumber,
    itemQuality: parseStringToNumber,
    itemClass: parseStringToNumber,
    itemSubClass: parseStringToNumber,
    region: z.union([z.literal('NA'), z.literal('EU')]),
    homeRealmName: z
      .string()
      .min(1)
      .transform((value) => value.split('---')[1]),
    desiredPriceVsAvgPercent: parseStringToNumber,
    desiredQuantityVsAvgPercent: parseStringToNumber,
    expansionNumber: parseStringToNumber
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

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW commodity shortage predictions',
    description:
      'Find Commodity Shortages and Price Spikes BEFORE they happen and be there first!',
    links: [
      {
        rel: 'canonical',
        href: `https://saddlebagexchange.com/wow/shortage-predictor`
      }
    ]
  }
}

// Overwrite default links in the root.tsx
export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/wow/shortage-predictor'
  }
]

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()

  const params = new URL(request.url).searchParams

  const validateFormData = z.object({
    desiredAvgPrice: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value) * 10000),
    desiredSalesPerDay: parseStringToNumber,
    itemQuality: parseStringToNumber,
    itemClass: parseStringToNumber,
    itemSubClass: parseStringToNumber,
    region: z.union([z.literal('NA'), z.literal('EU')]),
    homeRealmName: z
      .object({
        id: z.number(),
        name: z.string()
      })
      .transform((value) => `${value.id}---${value.name}`),
    desiredPriceVsAvgPercent: parseStringToNumber,
    desiredQuantityVsAvgPercent: parseStringToNumber,
    expansionNumber: parseStringToNumber
  })

  const input = {
    desiredAvgPrice:
      params.get('desiredAvgPrice') ||
      defaultFormValues.desiredAvgPrice.toString(),
    desiredSalesPerDay:
      params.get('desiredSalesPerDay') ||
      defaultFormValues.desiredSalesPerDay.toString(),
    itemQuality:
      params.get('itemQuality') || defaultFormValues.itemQuality.toString(),
    itemClass:
      params.get('itemClass') || defaultFormValues.itemClass.toString(),
    itemSubClass:
      params.get('itemSubClass') || defaultFormValues.itemSubClass.toString(),
    region: params.get('region') || region,
    homeRealmName: `${server.id}---${server.name}`,
    desiredPriceVsAvgPercent:
      params.get('desiredPriceVsAvgPercent') ||
      defaultFormValues.desiredPriceVsAvgPercent.toString(),
    desiredQuantityVsAvgPercent:
      params.get('desiredQuantityVsAvgPercent') ||
      defaultFormValues.desiredQuantityVsAvgPercent.toString(),
    expansionNumber:
      params.get('expansionNumber') ||
      defaultFormValues.expansionNumber.toString()
  }

  const validInput = validateFormData.safeParse(input)
  if (validInput.success) {
    const responseData = {
      ...validInput.data
    }
    return json(responseData)
  }

  return json(defaultFormValues)
}

const Index = () => {
  const transition = useNavigation()

  const loaderData = useLoaderData<typeof defaultFormValues>()
  const [searchParams, setSearchParams] = useState<typeof defaultFormValues>({
    ...loaderData
  })
  const results = useActionData<ActionResponse>()

  const loading = transition.state === 'submitting'

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault()
    }
  }

  const handleFormChange = (
    name: keyof typeof defaultFormValues,
    value: string
  ) => {
    handleSearchParamChange(name, value)
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  if (results) {
    if (!Object.keys(results)) {
      return <NoResults href={PAGE_URL} title='No results found' />
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
        loading={loading}
        action={getActionUrl(PAGE_URL, searchParams)}
      >
        <div className='pt-2'>
          <div className='flex justify-end mb-2'>
            <SubmitButton
              title='Share this search!'
              onClick={handleCopyButton}
              type='button'
            />
          </div>
        </div>
        <div className='pt-2 md:pt-4'>
          <InputWithLabel
            defaultValue={loaderData.desiredAvgPrice}
            labelTitle={inputMap.desiredAvgPrice}
            type='number'
            inputTag='Gold'
            name='desiredAvgPrice'
            min={0}
            step={0.01}
            toolTip='Find items that on average sell for this amount of gold or more.'
            onChange={(e) =>
              handleFormChange('desiredAvgPrice', e.target.value)
            }
          />
          <InputWithLabel
            defaultValue={loaderData.desiredSalesPerDay}
            labelTitle={inputMap.desiredSalesPerDay}
            type='number'
            inputTag='Sales'
            name='desiredSalesPerDay'
            min={0}
            toolTip='Finds items that have this many sales per day.'
            onChange={(e) =>
              handleFormChange('desiredSalesPerDay', e.target.value)
            }
          />
          <ItemQualitySelect
            defaultValue={loaderData.itemQuality}
            onChange={(value) => handleFormChange('itemQuality', value)}
          />
          <ExpansionSelect
            defaultValue={loaderData.expansionNumber}
            onChange={(value) => handleFormChange('expansionNumber', value)}
          />
          <ItemClassSelect
            itemClass={parseInt(loaderData.itemClass)}
            itemSubClass={parseInt(loaderData.itemSubClass)}
            onChange={(itemClassValue, itemSubClassValue) => {
              handleFormChange('itemClass', itemClassValue.toString())
              handleFormChange('itemSubClass', itemSubClassValue.toString())
            }}
          />
          <RegionAndServerSelect
            serverSelectFormName='homeRealmName'
            region={loaderData.region as WoWServerRegion}
            defaultRealm={
              {
                id: parseInt(loaderData.homeRealmName.split('---')[0], 10),
                name: loaderData.homeRealmName.split('---')[1]
              } as WoWServerData
            }
            regionOnChange={(region) => handleFormChange('region', region)}
            onServerSelectChange={(realm) =>
              handleFormChange(
                'homeRealmName',
                realm ? `${realm.id}---${realm.name}` : ''
              )
            }
          />
          <InputWithLabel
            defaultValue={loaderData.desiredPriceVsAvgPercent}
            type='number'
            labelTitle={inputMap.desiredPriceVsAvgPercent}
            inputTag='%'
            name='desiredPriceVsAvgPercent'
            min={0}
            toolTip='What is the maximum price spike to look for? 120% is to only find item that are at most 20% above the average price, so you get there before prices increase. After prices increase too much competition will show up preventing the price from going higher.'
            onChange={(e) =>
              handleFormChange('desiredPriceVsAvgPercent', e.target.value)
            }
          />
          <InputWithLabel
            defaultValue={loaderData.desiredQuantityVsAvgPercent}
            type='number'
            labelTitle={inputMap.desiredQuantityVsAvgPercent}
            inputTag='%'
            name='desiredQuantityVsAvgPercent'
            min={0}
            toolTip='How much of the market quantity is left? For 50% we want to find items which only have 50% of their average quantity remaining in stock.'
            onChange={(e) =>
              handleFormChange('desiredQuantityVsAvgPercent', e.target.value)
            }
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
