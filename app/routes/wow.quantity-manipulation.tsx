import {
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate
} from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import {
  ItemClassSelect,
  ItemQualitySelect,
  ExpansionSelect
} from '~/components/form/WoW/WoWScanForm'
import type { WoWServerData } from '~/requests/WoW/types'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { z } from 'zod'
import type {
  QuantityManipulationProps,
  ManipulationResponse,
  ErrorResponse
} from '~/requests/WoW/QuantityManipulation'
import WoWQuantityManipulation from '~/requests/WoW/QuantityManipulation'
import NoResults from '~/components/Common/NoResults'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import { getUserSessionData } from '~/sessions'
import { Results } from '~/components/WoWResults/QuantityManipulation/Results'
import { parseStringToNumber } from '~/utils/zodHelpers'
import { useState } from 'react'
import type { WoWServerRegion } from '~/requests/WoW/WOWScan'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'
import { getCommodityItemClasses } from '~/utils/WoWFilers/commodityClasses'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { getHasPremium, DISCORD_SERVER_URL } from '~/utils/premium'
import { getSession } from '~/sessions'

const PAGE_URL = '/wow/quantity-manipulation'

const defaultFormValues = {
  historicPrice: '100',
  salesPerDay: '150',
  minQuantityChangePercent: '70',
  minQuantitySwings: '14',
  hoursToAnalyze: '336',
  minPriceMultiplier: '5',
  itemQuality: '1',
  itemClass: '-1',
  itemSubClass: '-1',
  region: 'NA',
  homeRealmName: '3678---Thrall',
  expansionNumber: '-1'
}

const inputMap: Record<keyof QuantityManipulationProps, string> = {
  historicPrice: 'Minimum Historic Price',
  salesPerDay: 'Minimum Sales Per Day',
  minQuantityChangePercent: 'Minimum Quantity Change %',
  minQuantitySwings: 'Minimum Quantity Swings',
  hoursToAnalyze: 'Hours to Analyze',
  minPriceMultiplier: 'Minimum Price Multiplier',
  itemQuality: 'Item Quality',
  itemClass: 'Item Category',
  itemSubClass: 'Item Sub Category',
  region: 'Select your region',
  homeRealmName: 'Search for server by name',
  expansionNumber: 'Expansion Number'
}

const pageTitle = 'Big Goblin Tracker'
const pageDescription =
  'Track potential market manipulators by finding auctions with suspicious quantity changes and price spikes.'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  const validateFormData = z.object({
    historicPrice: parseStringToNumber,
    salesPerDay: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    minQuantityChangePercent: parseStringToNumber,
    minQuantitySwings: parseStringToNumber,
    hoursToAnalyze: parseStringToNumber,
    minPriceMultiplier: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    itemQuality: parseStringToNumber,
    itemClass: parseStringToNumber,
    itemSubClass: parseStringToNumber,
    region: z.union([z.literal('NA'), z.literal('EU')]),
    homeRealmName: z
      .string()
      .min(1)
      .transform((value) => value.split('---')[1]),
    expansionNumber: parseStringToNumber
  })

  const validInput = validateFormData.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: `Missing: ${validInput.error.issues
        .map(({ path }) =>
          path.map(
            (field) =>
              inputMap[field as keyof QuantityManipulationProps] ||
              'Unknown input error'
          )
        )
        .join(', ')}`
    })
  }

  const response = await WoWQuantityManipulation(validInput.data)
  const data = await response.json()

  if (!response.ok) {
    const errorData = data as ErrorResponse
    return json({ exception: JSON.stringify(errorData, null, 2) })
  }

  return json(data)
}

type ActionResponse = ManipulationResponse | { exception: string } | {}

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW Big Goblin Tracker',
    description:
      'Track potential market manipulators by finding auctions with suspicious quantity changes and price spikes.',
    links: [
      {
        rel: 'canonical',
        href: `https://saddlebagexchange.com/wow/quantity-manipulation`
      }
    ]
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()

  // Get Discord session info
  const session = await getSession(request.headers.get('Cookie'))
  const discordId = session.get('discord_id')
  const discordRoles = session.get('discord_roles') || []
  const isLoggedIn = !!discordId
  const hasPremium = getHasPremium(discordRoles)

  const params = new URL(request.url).searchParams

  const validateFormData = z.object({
    historicPrice: parseStringToNumber,
    salesPerDay: z
      .string()
      .min(0.01)
      .transform((value) => parseFloat(value)),
    minQuantityChangePercent: parseStringToNumber,
    minQuantitySwings: parseStringToNumber,
    hoursToAnalyze: parseStringToNumber,
    minPriceMultiplier: z
      .string()
      .min(0.01)
      .transform((value) => parseFloat(value)),
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
    expansionNumber: parseStringToNumber
  })

  const input = {
    historicPrice:
      params.get('historicPrice') || defaultFormValues.historicPrice.toString(),
    salesPerDay:
      params.get('salesPerDay') || defaultFormValues.salesPerDay.toString(),
    minQuantityChangePercent:
      params.get('minQuantityChangePercent') ||
      defaultFormValues.minQuantityChangePercent.toString(),
    minQuantitySwings:
      params.get('minQuantitySwings') ||
      defaultFormValues.minQuantitySwings.toString(),
    hoursToAnalyze:
      params.get('hoursToAnalyze') ||
      defaultFormValues.hoursToAnalyze.toString(),
    minPriceMultiplier:
      params.get('minPriceMultiplier') ||
      defaultFormValues.minPriceMultiplier.toString(),
    itemQuality:
      params.get('itemQuality') || defaultFormValues.itemQuality.toString(),
    itemClass:
      params.get('itemClass') || defaultFormValues.itemClass.toString(),
    itemSubClass:
      params.get('itemSubClass') || defaultFormValues.itemSubClass.toString(),
    region: params.get('region') || region,
    homeRealmName: {
      id: server.id,
      name: server.name
    },
    expansionNumber:
      params.get('expansionNumber') ||
      defaultFormValues.expansionNumber.toString()
  }

  const validInput = validateFormData.safeParse(input)
  if (validInput.success) {
    const responseData = {
      ...validInput.data,
      isLoggedIn,
      hasPremium
    }
    return json(responseData)
  }

  return json({ ...defaultFormValues, isLoggedIn, hasPremium })
}

const Index = () => {
  const transition = useNavigation()

  const loaderData = useLoaderData<
    typeof defaultFormValues & { isLoggedIn: boolean; hasPremium: boolean }
  >()
  const [searchParams, setSearchParams] = useState<typeof defaultFormValues>({
    ...loaderData
  })
  const results = useActionData<ActionResponse>()
  const navigate = useNavigate()

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
      return <NoResults href={PAGE_URL} title="No results found" />
    }

    if ('data' in results) {
      return <Results results={results} pageTitle={pageTitle} />
    }
  }

  const error =
    results && 'exception' in results ? results.exception : undefined

  // Paywall logic
  const showPaywall = !loaderData.isLoggedIn || !loaderData.hasPremium
  const handleLogin = () => {
    navigate('/discord-login')
  }
  const handleSubscribe = () => {
    window.open(DISCORD_SERVER_URL, '_blank')
  }

  return (
    <PageWrapper>
      <PremiumPaywall
        show={showPaywall}
        isLoggedIn={!!loaderData.isLoggedIn}
        hasPremium={!!loaderData.hasPremium}
        onLogin={handleLogin}
        onSubscribe={handleSubscribe}>
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
              defaultValue={loaderData.historicPrice}
              labelTitle={inputMap.historicPrice}
              type="number"
              inputTag="Gold"
              name="historicPrice"
              min={0}
              toolTip="Find items that historically sell for this amount of gold or more."
              onChange={(e) =>
                handleFormChange('historicPrice', e.target.value)
              }
            />
            <InputWithLabel
              defaultValue={loaderData.salesPerDay}
              labelTitle={inputMap.salesPerDay}
              type="number"
              inputTag="Sales"
              name="salesPerDay"
              min={0}
              step={0.01}
              toolTip="Finds items that have this many sales per day."
              onChange={(e) => handleFormChange('salesPerDay', e.target.value)}
            />
            <InputWithLabel
              defaultValue={loaderData.minQuantityChangePercent}
              type="number"
              labelTitle={inputMap.minQuantityChangePercent}
              inputTag="%"
              name="minQuantityChangePercent"
              min={0}
              toolTip="The minimum percentage change in quantity to consider suspicious."
              onChange={(e) =>
                handleFormChange('minQuantityChangePercent', e.target.value)
              }
            />
            <InputWithLabel
              defaultValue={loaderData.minQuantitySwings}
              type="number"
              labelTitle={inputMap.minQuantitySwings}
              inputTag="Swings"
              name="minQuantitySwings"
              min={0}
              toolTip="The minimum number of suspicious quantity changes required."
              onChange={(e) =>
                handleFormChange('minQuantitySwings', e.target.value)
              }
            />
            <InputWithLabel
              defaultValue={loaderData.hoursToAnalyze}
              type="number"
              labelTitle={inputMap.hoursToAnalyze}
              inputTag="Hours"
              name="hoursToAnalyze"
              min={24}
              max={336}
              toolTip="How many hours of history to analyze (max 336 hours / 2 weeks)."
              onChange={(e) =>
                handleFormChange('hoursToAnalyze', e.target.value)
              }
            />
            <InputWithLabel
              defaultValue={loaderData.minPriceMultiplier}
              type="number"
              labelTitle={inputMap.minPriceMultiplier}
              inputTag="x"
              name="minPriceMultiplier"
              min={0}
              step={0.01}
              toolTip="The minimum price multiplier between highest and lowest price."
              onChange={(e) =>
                handleFormChange('minPriceMultiplier', e.target.value)
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
              itemClassesOverride={getCommodityItemClasses()}
            />
            <RegionAndServerSelect
              serverSelectFormName="homeRealmName"
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
          </div>
        </SmallFormContainer>
      </PremiumPaywall>
    </PageWrapper>
  )
}

export default Index
