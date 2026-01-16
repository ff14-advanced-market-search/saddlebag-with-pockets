import {
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate
} from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { z } from 'zod'
import type {
  ShortagePredictorProps,
  PredictionResponse
} from '~/requests/FFXIV/ShortagePredictor'
import FFXIVShortagePredictor from '~/requests/FFXIV/ShortagePredictor'
import NoResults from '~/components/Common/NoResults'
import { getUserSessionData, getSession } from '~/sessions'
import { Results } from '~/components/FFXIVResults/ShortagePredictor/Results'
import { parseStringToNumber } from '~/utils/zodHelpers'
import { useState } from 'react'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'
import CheckBox from '~/components/form/CheckBox'
import ItemsFilter from '~/components/form/ffxiv/ItemsFilter'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { combineWithDiscordSession } from '~/components/Common/DiscordSessionLoader'

const PAGE_URL = '/ffxiv/shortage-predictor'

const defaultFormValues = {
  homeServer: 'Adamantoise',
  filters: [0],
  hqOnly: false,
  desiredMedianPrice: '500',
  desiredSalesPerWeek: '400',
  desiredPriceVsMedianPercent: '140',
  desiredQuantityVsAvgPercent: '50'
}

const inputMap: Record<keyof ShortagePredictorProps, string> = {
  homeServer: 'Home Server',
  filters: 'Filters',
  hqOnly: 'HQ Only',
  desiredMedianPrice: 'Minimum Desired Median Price',
  desiredSalesPerWeek: 'Minimum Desired Sales Per Week',
  desiredPriceVsMedianPercent: 'Current Price Percent Above Median',
  desiredQuantityVsAvgPercent: 'Current Market Quantity Percentage'
}

const pageTitle = 'Market Shortage Futures'
const pageDescription =
  'Find Market Shortages and Price Spikes BEFORE they happen and be there first!'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)
  formData.append('homeServer', session.getWorld())

  const formPayload = Object.fromEntries(formData)

  const validateFormData = z.object({
    homeServer: z.string().min(1),
    filters: z.preprocess(
      (val) => (Array.isArray(val) ? val : String(val).split(',').map(Number)),
      z.array(z.number())
    ),
    hqOnly: z.preprocess(
      (val) => val === 'true' || val === true || val === 'on',
      z.boolean()
    ),
    desiredMedianPrice: parseStringToNumber,
    desiredSalesPerWeek: parseStringToNumber,
    desiredPriceVsMedianPercent: parseStringToNumber,
    desiredQuantityVsAvgPercent: parseStringToNumber
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

  return FFXIVShortagePredictor(validInput.data)
}

type ActionResponse = PredictionResponse | { exception: string }

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: FFXIV Market Shortage Predictions' },
    { name: 'description', content: 'Find Market Shortages and Price Spikes BEFORE they happen and be there first!' }
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const { getAllUserSessionData } = await getUserSessionData(request)
  const { world } = getAllUserSessionData()

  const params = new URL(request.url).searchParams

  const validateFormData = z.object({
    homeServer: z.string().min(1),
    filters: z.preprocess(
      (val) => (Array.isArray(val) ? val : String(val).split(',').map(Number)),
      z.array(z.number())
    ),
    hqOnly: z.preprocess(
      (val) => val === 'true' || val === true || val === 'on',
      z.boolean()
    ),
    desiredMedianPrice: parseStringToNumber,
    desiredSalesPerWeek: parseStringToNumber,
    desiredPriceVsMedianPercent: parseStringToNumber,
    desiredQuantityVsAvgPercent: parseStringToNumber
  })

  const input = {
    homeServer: params.get('homeServer') ?? world,
    filters: params.has('filters')
      ? decodeURIComponent(params.get('filters') as string)
          .split(',')
          .map(Number)
      : defaultFormValues.filters,
    hqOnly: params.get('hqOnly') === 'true',
    desiredMedianPrice:
      params.get('desiredMedianPrice') ??
      defaultFormValues.desiredMedianPrice.toString(),
    desiredSalesPerWeek:
      params.get('desiredSalesPerWeek') ??
      defaultFormValues.desiredSalesPerWeek.toString(),
    desiredPriceVsMedianPercent:
      params.get('desiredPriceVsMedianPercent') ??
      defaultFormValues.desiredPriceVsMedianPercent.toString(),
    desiredQuantityVsAvgPercent:
      params.get('desiredQuantityVsAvgPercent') ??
      defaultFormValues.desiredQuantityVsAvgPercent.toString()
  }

  const validInput = validateFormData.safeParse(input)
  if (validInput.success) {
    return combineWithDiscordSession(request, validInput.data)
  }

  return combineWithDiscordSession(request, defaultFormValues)
}

const Index = () => {
  const transition = useNavigation()
  const loaderData = useLoaderData<
    typeof defaultFormValues & {
      isLoggedIn: boolean
      hasPremium: boolean
      needsRefresh: boolean
    }
  >()
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
    value: string | boolean | number[]
  ) => {
    handleSearchParamChange(name, value.toString())
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  if (results) {
    if (!Object.keys(results)) {
      return <NoResults href={PAGE_URL} title="No results found" />
    }

    if ('data' in results) {
      return <Results results={results} pageTitle={pageTitle} />
    }
  }

  const error =
    results && 'exception' in results ? results.exception : undefined

  return (
    <PageWrapper>
      <PremiumPaywall loaderData={loaderData}>
        <SmallFormContainer
          title={pageTitle}
          description={pageDescription}
          onClick={onSubmit}
          error={error}
          loading={loading}
          action={getActionUrl(PAGE_URL, searchParams)}>
          <div className="pt-2">
            <div className="flex justify-end mb-2">
              <SubmitButton
                title="Share this search!"
                onClick={handleCopyButton}
                type="button"
              />
            </div>
          </div>
          <div className="pt-2 md:pt-4">
            <InputWithLabel
              defaultValue={loaderData.desiredMedianPrice}
              labelTitle={inputMap.desiredMedianPrice}
              type="number"
              inputTag="Gil"
              name="desiredMedianPrice"
              min={0}
              step={1}
              toolTip="Find items that on average sell for this amount of gil or more."
              onChange={(e) =>
                handleFormChange('desiredMedianPrice', e.target.value)
              }
            />
            <InputWithLabel
              defaultValue={loaderData.desiredSalesPerWeek}
              labelTitle={inputMap.desiredSalesPerWeek}
              type="number"
              inputTag="Sales"
              name="desiredSalesPerWeek"
              min={0}
              toolTip="Finds items that have this many sales per week."
              onChange={(e) =>
                handleFormChange('desiredSalesPerWeek', e.target.value)
              }
            />
            <InputWithLabel
              defaultValue={loaderData.desiredPriceVsMedianPercent}
              type="number"
              labelTitle={inputMap.desiredPriceVsMedianPercent}
              inputTag="%"
              name="desiredPriceVsMedianPercent"
              min={0}
              toolTip="What is the maximum price spike to look for? 140% is to only find item that are at most 40% above the median price, so you get there before prices increase. After prices increase too much competition will show up preventing the price from going higher."
              onChange={(e) =>
                handleFormChange('desiredPriceVsMedianPercent', e.target.value)
              }
            />
            <InputWithLabel
              defaultValue={loaderData.desiredQuantityVsAvgPercent}
              type="number"
              labelTitle={inputMap.desiredQuantityVsAvgPercent}
              inputTag="%"
              name="desiredQuantityVsAvgPercent"
              min={0}
              toolTip="How much of the market quantity is left? For 50% we want to find items which only have 50% of their average quantity remaining in stock."
              onChange={(e) =>
                handleFormChange('desiredQuantityVsAvgPercent', e.target.value)
              }
            />
            <ItemsFilter
              defaultFilters={loaderData.filters}
              onChange={(value) => {
                if (value !== undefined) {
                  handleFormChange('filters', value)
                }
              }}
            />
            <CheckBox
              labelTitle="HQ Only"
              id="hq-only"
              name="hqOnly"
              defaultChecked={loaderData.hqOnly}
              onChange={(e) => handleFormChange('hqOnly', e.target.checked)}
            />
          </div>
        </SmallFormContainer>
      </PremiumPaywall>
    </PageWrapper>
  )
}

export default Index
