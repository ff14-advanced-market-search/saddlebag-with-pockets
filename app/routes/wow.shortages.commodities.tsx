import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import NoResults from '~/components/Common/NoResults'
import { PageWrapper } from '~/components/Common'
import type { WowShortageResult } from '~/requests/WoW/WoWCommodities'
import WoWCommodityShortage from '~/requests/WoW/WoWCommodities'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import {
  validateShortageData,
  WoWShortageFormFields
} from '~/components/form/WoW/WoWShortageFormFields'
import ShortageResults from '~/components/WoWResults/Shortages/ShortageResults'
import { useState } from 'react'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import { getUserSessionData } from '~/sessions.server'
import type { WoWLoaderData } from '~/requests/WoW/types'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import {
  combineWithDiscordSession,
  requireDiscordTier
} from '~/components/Common/DiscordSessionLoader.server'

export const action: ActionFunction = async ({ request, context }) => {
  await requireDiscordTier(request, context)
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

export const ErrorBoundary = () => <ErrorBounds />

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange: WoW Commodity Shortages' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'Find wow commodity auctionhouse items that can be flipped for a profit'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/wow/shortages/commodities'
    }
  ]
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()

  return combineWithDiscordSession(
    request,
    {
      wowRealm: server,
      wowRegion: region
    },
    context
  )
}

const Index = () => {
  const transition = useNavigation()
  const results = useActionData<WowShortageResult>()
  const { wowRealm, wowRegion, isLoggedIn, hasPremium, needsRefresh } =
    useLoaderData<
      WoWLoaderData & {
        isLoggedIn: boolean
        hasPremium: boolean
        needsRefresh: boolean
      }
    >()

  const [serverName, setServerName] = useState<string>(wowRealm.name)

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

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
      <PremiumPaywall loaderData={{ isLoggedIn, hasPremium, needsRefresh }}>
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
      </PremiumPaywall>
    </PageWrapper>
  )
}

export default Index
