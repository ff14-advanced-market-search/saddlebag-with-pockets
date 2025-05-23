import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useState } from 'react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type {
  BestDealsProps,
  BestDealsResponse
} from '~/requests/FFXIV/BestDeals'
import FFXIVBestDeals from '~/requests/FFXIV/BestDeals'
import { getUserSessionData } from '~/sessions'
import z from 'zod'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import NoResults from '~/components/Common/NoResults'
import { Results } from '~/components/FFXIVResults/BestDeals/Results'
import { parseStringToNumber } from '~/utils/zodHelpers'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'
import CheckBox from '~/components/form/CheckBox'
import ItemsFilter from '~/components/form/ffxiv/ItemsFilter'

const PAGE_URL = '/ffxiv/best-deals'

const defaultFormValues = {
  home_server: 'Adamantoise',
  filters: [0],
  hq_only: false,
  discount: '70',
  medianPrice: '50000',
  salesAmount: '20',
  maxBuyPrice: '20000'
}

const inputMap: Record<keyof BestDealsProps, string> = {
  home_server: 'Home Server',
  filters: 'Filters',
  hq_only: 'HQ Only',
  discount: 'Minimum Discount Percentage',
  medianPrice: 'Minimum Median Price',
  salesAmount: 'Minimum Sales Amount',
  maxBuyPrice: 'Maximum Buy Price'
}

const pageTitle = 'Best Deals'
const pageDescription =
  'Find the best deals on your server and region wide with our Best Deals search!'

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Best Deals',
    description: pageDescription,
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/ffxiv/best-deals'
      }
    ]
  }
}

const validateInput = z.object({
  home_server: z.string().min(1),
  filters: z.preprocess(
    (val) => (Array.isArray(val) ? val : String(val).split(',').map(Number)),
    z.array(z.number())
  ),
  hq_only: z.preprocess(
    (val) => val === 'true' || val === true || val === 'on',
    z.boolean()
  ),
  discount: parseStringToNumber,
  medianPrice: parseStringToNumber,
  salesAmount: parseStringToNumber,
  maxBuyPrice: parseStringToNumber
})

export const loader: LoaderFunction = async ({ request }) => {
  const { getAllUserSessionData } = await getUserSessionData(request)
  const { world } = getAllUserSessionData()

  const params = new URL(request.url).searchParams

  const input = {
    home_server: params.get('home_server') ?? world,
    filters: params.has('filters')
      ? decodeURIComponent(params.get('filters') as string)
          .split(',')
          .map(Number)
      : defaultFormValues.filters,
    hq_only: params.get('hq_only') === 'true',
    discount: params.get('discount') ?? defaultFormValues.discount.toString(),
    medianPrice:
      params.get('medianPrice') ?? defaultFormValues.medianPrice.toString(),
    salesAmount:
      params.get('salesAmount') ?? defaultFormValues.salesAmount.toString(),
    maxBuyPrice:
      params.get('maxBuyPrice') ?? defaultFormValues.maxBuyPrice.toString()
  }

  const validInput = validateInput.safeParse(input)
  if (validInput.success) {
    return json(validInput.data)
  }

  return json(defaultFormValues)
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)
  const formData = await request.formData()
  formData.append('home_server', session.getWorld())

  const formPayload = Object.fromEntries(formData)
  const validatedFormData = validateInput.safeParse(formPayload)

  if (!validatedFormData.success) {
    return json({
      exception: `Missing: ${validatedFormData.error.issues
        .map(({ path }) =>
          path.map(
            (field) =>
              inputMap[field as keyof BestDealsProps] || 'Unknown input error'
          )
        )
        .join(', ')}`
    })
  }

  const result = await FFXIVBestDeals(validatedFormData.data)
  return json(await result.json())
}

type ActionResponseType = {} | { exception: string } | BestDealsResponse

const BestDeals = () => {
  const loaderData = useLoaderData<typeof defaultFormValues>()
  const result = useActionData<ActionResponseType>()
  const transition = useNavigation()

  const isSubmitting = transition.state === 'submitting'

  const [searchParams, setSearchParams] = useState<typeof defaultFormValues>({
    ...loaderData
  })
  const error = result && 'exception' in result ? result.exception : undefined

  if (result && !Object.keys(result).length) {
    return <NoResults href={PAGE_URL} />
  }

  if (result && 'data' in result && !error) {
    return (
      <Results
        results={{ ...result, hq_only: loaderData.hq_only }}
        pageTitle={pageTitle}
      />
    )
  }

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isSubmitting) {
      event.preventDefault()
      return
    }
  }

  const handleFormChange = (
    name: keyof typeof defaultFormValues,
    value: string | boolean | number[]
  ) => {
    handleSearchParamChange(name, value.toString())
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        description={pageDescription}
        onClick={handleSubmit}
        error={error}
        loading={isSubmitting}
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
        <div className="pt-3 flex flex-col">
          <InputWithLabel
            labelTitle={inputMap.discount}
            name="discount"
            type="number"
            defaultValue={loaderData.discount}
            min={0}
            onChange={(e) => handleFormChange('discount', e.target.value)}
          />
          <InputWithLabel
            labelTitle={inputMap.medianPrice}
            name="medianPrice"
            type="number"
            defaultValue={loaderData.medianPrice}
            min={0}
            onChange={(e) => handleFormChange('medianPrice', e.target.value)}
          />
          <InputWithLabel
            labelTitle={inputMap.salesAmount}
            name="salesAmount"
            type="number"
            defaultValue={loaderData.salesAmount}
            min={0}
            onChange={(e) => handleFormChange('salesAmount', e.target.value)}
          />
          <InputWithLabel
            labelTitle={inputMap.maxBuyPrice}
            name="maxBuyPrice"
            type="number"
            defaultValue={loaderData.maxBuyPrice}
            min={0}
            onChange={(e) => handleFormChange('maxBuyPrice', e.target.value)}
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
            name="hq_only"
            defaultChecked={loaderData.hq_only}
            onChange={(e) => handleFormChange('hq_only', e.target.checked)}
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default BestDeals
