import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { PageWrapper } from '~/components/Common'
import WoWStatLookup from '~/requests/WoW/ItemStatLookup'
import { z } from 'zod'
import { useActionData, useLoaderData, useTransition } from '@remix-run/react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { WoWLoaderData } from '~/requests/WoW/types'
import { getUserSessionData } from '~/sessions'
import type { WoWMarketShareActionResults } from '~/components/WoWResults/MarketshareResults'
import MarketshareResults from '~/components/WoWResults/MarketshareResults'
import MarketShareForm from '~/components/form/WoW/MarketshareForm'
import NoResults from '~/components/Common/NoResults'
import { useTypedSelector } from '~/redux/useTypedSelector'

const inputMap: Record<string, string> = {
  homeRealmId: 'Home Realm',
  region: 'Region',
  commodity: 'Commodity Items',
  desiredAvgPrice: 'Average Price',
  desiredSalesPerDay: 'Sales Per Day',
  itemQuality: 'Quality',
  requiredLevel: 'Required Level',
  itemClass: 'Item Class',
  itemSubclass: 'Item Sub Class',
  iLvl: 'iLevel'
}

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  formPayload.commodity = formPayload.commodity || 'off'

  const validateFormData = z.object({
    homeRealmId: z
      .string()
      .min(1)
      .transform((value) => parseInt(value.split('---')[0], 10)),
    region: z.union([z.literal('NA'), z.literal('EU')]),
    commodity: z.string().transform((value) => value === 'on'),
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
    requiredLevel: z
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
    iLvl: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10))
  })

  const validInput = validateFormData.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: `Missing: ${validInput.error.issues
        .map(({ path }) =>
          path.map((field) => inputMap[field] || 'Unknown input error')
        )
        .join(', ')}`
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
  const transition = useTransition()
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const { darkmode } = useTypedSelector((state) => state.user)

  const results = useActionData<
    WoWMarketShareActionResults | { exception: string } | {}
  >()
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const pageTitle = 'Dragonflight Auction House Marketshare Overview'

  if (results && 'data' in results) {
    if (!results.data.length) {
      return (
        <PageWrapper>
          <NoResults href="/wow/marketshare" />
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
        loading={transition.state === 'submitting'}
        error={error}>
        <MarketShareForm regionDefault={wowRegion} homeRealm={wowRealm} />
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
