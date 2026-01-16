import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import { PageWrapper } from '~/components/Common'
import WoWStatLookup from '~/requests/WoW/ItemStatLookup'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { getUserSessionData } from '~/sessions'
import type { WoWMarketShareActionResults } from '~/components/WoWResults/MarketshareResults'
import MarketshareResults from '~/components/WoWResults/MarketshareResults'
import MarketShareForm from '~/components/form/WoW/MarketshareForm'
import NoResults from '~/components/Common/NoResults'
import { useTypedSelector } from '~/redux/useTypedSelector'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import {
  parseCheckboxBoolean,
  parseStringToNumber,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'
import { json } from '@remix-run/cloudflare'

const PAGE_URL = '/wow/marketshare'

export const defaultFormValuesMarketShare = {
  desiredAvgPrice: '0',
  desiredSalesPerDay: '0',
  region: 'NA',
  homeRealmId: `3678---Thrall`,
  itemClass: '-1',
  itemSubClass: '-1',
  itemQuality: '1',
  iLvl: '-1',
  requiredLevel: '-1',
  commodity: 'off',
  expansionNumber: '-1'
}

const inputMap: Record<string, string> = {
  desiredAvgPrice: 'Minimum Desired Average Price',
  desiredSalesPerDay: 'Minimum Desired Sales Per Day',
  region: 'Region',
  homeRealmId: 'Home Realm',
  itemClass: 'Item Category',
  itemSubClass: 'Item Sub Category',
  itemQuality: 'Item Quality',
  iLvl: 'Minimum Item Level (iLevel)',
  requiredLevel: 'Minimum Required Level',
  commodity: 'Commodity Items',
  expansionNumber: 'WoW Expansion'
}

const searchParamsTypes = z.object({
  desiredAvgPrice: z
    .string()
    .min(1)
    .transform((value) => parseFloat(value)),
  desiredSalesPerDay: z
    .string()
    .min(1)
    .transform((value) => parseFloat(value)),
  region: z.union([z.literal('NA'), z.literal('EU')]),
  homeRealmId: z
    .string()
    .min(1)
    .transform((value) => value),
  itemClass: parseStringToNumber,
  itemSubClass: parseStringToNumber,
  itemQuality: parseStringToNumber,
  iLvl: parseStringToNumber,
  requiredLevel: parseStringToNumber,
  commodity: parseCheckboxBoolean,
  expansionNumber: parseStringToNumber
})

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { viewport: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: WoW Current Content Marketshare' },
    {
      name: 'description',
      content: 'Find what current content items make the most gold in WoW!'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: `https://saddlebagexchange.com/wow/marketshare`
    }
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)

  const { server, region } = getWoWSessionData()

  const params = new URL(request.url).searchParams

  const input = {
    desiredAvgPrice:
      params.get('desiredAvgPrice') ||
      defaultFormValuesMarketShare.desiredAvgPrice.toString(),
    desiredSalesPerDay:
      params.get('desiredSalesPerDay') ||
      defaultFormValuesMarketShare.desiredSalesPerDay.toString(),
    region: params.get('region') || region,
    homeRealmId: `${server.id}---${server.name}`,
    itemClass:
      params.get('itemClass') ||
      defaultFormValuesMarketShare.itemClass.toString(),
    itemSubClass:
      params.get('itemSubClass') ||
      defaultFormValuesMarketShare.itemSubClass.toString(),
    itemQuality:
      params.get('itemQuality') ||
      defaultFormValuesMarketShare.itemQuality.toString(),
    iLvl: params.get('iLvl') || defaultFormValuesMarketShare.iLvl.toString(),
    requiredLevel:
      params.get('requiredLevel') ||
      defaultFormValuesMarketShare.requiredLevel.toString(),
    commodity:
      params.get('commodity') || defaultFormValuesMarketShare.commodity,
    expansionNumber:
      params.get('expansionNumber') ||
      defaultFormValuesMarketShare.expansionNumber.toString()
  }

  const validInput = searchParamsTypes.safeParse(input)
  if (validInput.success) {
    const responseData = {
      ...validInput.data
    }
    return json(responseData)
  }

  return json(defaultFormValuesMarketShare)
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  formPayload.commodity = formPayload.commodity || 'off'

  const validateFormData = z.object({
    desiredAvgPrice: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value) * 10000),
    desiredSalesPerDay: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    region: z.union([z.literal('NA'), z.literal('EU')]),
    homeRealmId: z
      .string()
      .min(1)
      .transform((value) => parseInt(value.split('---')[0], 10)),
    itemClass: parseStringToNumber,
    itemSubClass: parseStringToNumber,
    itemQuality: parseStringToNumber,
    iLvl: parseStringToNumber,
    requiredLevel: parseStringToNumber,
    commodity: parseCheckboxBoolean,
    expansionNumber: parseStringToNumber
  })

  const validInput = validateFormData.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: parseZodErrorsToDisplayString(validInput.error, inputMap)
    })
  }

  const data = await (await WoWStatLookup(validInput.data)).json()

  if (data.exception !== undefined) {
    return json({ exception: data.exception })
  }

  if (!data?.data) {
    return json({ exception: 'Unknown server error' })
  }

  return json({
    ...data,
    serverName: (formPayload.homeRealmId as string).split('---')[1],
    region: validInput.data.region,
    commodity: validInput.data.commodity
  })
}

const Index = () => {
  const transition = useNavigation()
  const { darkmode } = useTypedSelector((state) => state.user)
  const loaderData = useLoaderData<typeof defaultFormValuesMarketShare>()
  const [searchParams, setSearchParams] = useState<
    typeof defaultFormValuesMarketShare
  >({
    ...loaderData
  })

  const results = useActionData<
    WoWMarketShareActionResults | { exception: string } | {}
  >()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const handleFormChange = (
    name: keyof typeof defaultFormValuesMarketShare,
    value: string
  ) => {
    handleSearchParamChange(name, value)
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const pageTitle = 'Total Auction House Marketshare Overview'

  if (results && 'data' in results) {
    if (!results.data.length) {
      return (
        <PageWrapper>
          <NoResults href={PAGE_URL} />
        </PageWrapper>
      )
    }

    return (
      <MarketshareResults
        results={results}
        pageTitle={pageTitle}
        darkMode={darkmode}
      />
    )
  }

  const error =
    results && 'exception' in results ? results.exception : undefined
  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        onClick={onSubmit}
        action={getActionUrl(PAGE_URL, searchParams)}
        loading={transition.state === 'submitting'}
        error={error}>
        <div className="pt-2">
          <div className="flex justify-end mb-2">
            <SubmitButton
              title="Share this search!"
              onClick={handleCopyButton}
              type="button"
            />
          </div>
        </div>
        <MarketShareForm
          loaderData={loaderData}
          inputMap={inputMap}
          handleFormChange={handleFormChange}
        />
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
