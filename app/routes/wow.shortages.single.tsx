import {
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate
} from '@remix-run/react'
import { useState } from 'react'
import { PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { WowShortageResult } from '~/requests/WoW/WoWCommodities'
import NoResults from '~/components/Common/NoResults'
import {
  validateShortageData,
  WoWShortageFormFields
} from './wow.shortages.commodities'
import ShortageResults from '~/components/WoWResults/Shortages/ShortageResults'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import type { WOWSingleItemShortageProps } from '~/requests/WoW/WoWSingleItemShortage'
import WoWSingleItemShortage from '~/requests/WoW/WoWSingleItemShortage'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import { getUserSessionData } from '~/sessions'
import type { WoWLoaderData } from '~/requests/WoW/types'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import {
  getHasPremium,
  needsRolesRefresh,
  DISCORD_SERVER_URL
} from '~/utils/premium'
import { getSession } from '~/sessions'

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

  const requiredLevelData = formData.get('requiredLevel')
  if (!requiredLevelData || typeof requiredLevelData !== 'string') {
    return { exception: 'Missing required level' }
  }
  const requiredLevel = parseFloat(requiredLevelData)

  const iLvlData = formData.get('iLvl')
  if (!iLvlData || typeof iLvlData !== 'string') {
    return { exception: 'Missing item level' }
  }
  const iLvl = parseFloat(iLvlData)

  const props: WOWSingleItemShortageProps = {
    ...validInput,
    requiredLevel,
    iLvl
  }
  const res = await WoWSingleItemShortage(props)
  return json({ ...(await res.json()), region })
}

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW realm shortages',
    description:
      'Find wow local realm auctionhouse items that can be flipped for a profit',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/wow/shortages/single'
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
  const rolesRefreshedAt = session.get('discord_roles_refreshed_at')
  const isLoggedIn = !!discordId
  const hasPremium = getHasPremium(discordRoles)
  const needsRefresh = needsRolesRefresh(rolesRefreshedAt)

  return json({
    wowRealm: server,
    wowRegion: region,
    isLoggedIn,
    hasPremium,
    needsRefresh
  })
}

const Index = () => {
  const transition = useNavigation()
  const { wowRealm, wowRegion, isLoggedIn, hasPremium, needsRefresh } =
    useLoaderData<
      WoWLoaderData & {
        isLoggedIn: boolean
        hasPremium: boolean
        needsRefresh: boolean
      }
    >()
  const results = useActionData<WowShortageResult>()
  const navigate = useNavigate()

  const [serverName, setServerName] = useState<string | undefined>(
    wowRealm.name
  )
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const handleSubscribe = () => {
    window.open(DISCORD_SERVER_URL, '_blank')
  }

  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href={`/wow/shortages/single`} />
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
      <PremiumPaywall loaderData={loaderData}>
        <SmallFormContainer
          title="Single Item Shortage finder"
          onClick={onSubmit}
          loading={transition.state === 'submitting'}
          disabled={transition.state === 'submitting'}
          error={
            results && 'exception' in results ? results.exception : undefined
          }>
          <WoWShortageFormFields
            desiredAvgPriceDefault={20}
            desiredSellPriceDefault={20}
            desiredPriceIncreaseDefault={10}
            desiredSalesPerDayDefault={10}
            flipRiskLimitDefault={3}
          />
          <RegionAndServerSelect
            defaultRealm={wowRealm}
            region={wowRegion}
            serverSelectFormName="homeRealmId"
            serverSelectTitle="Home Server"
            onServerSelectChange={(selectValue) => {
              if (selectValue) setServerName(selectValue.name)
            }}
            serverSelectTooltip="Select your home world server, type to begin selection."
          />
          <InputWithLabel
            defaultValue={-1}
            type="number"
            labelTitle="Minimum Required Level"
            inputTag="Level"
            name="requiredLevel"
            min={-1}
            max={70}
            toolTip="Search for the minimum required level. (-1 is for all levels)"
          />
          <InputWithLabel
            defaultValue={-1}
            type="number"
            labelTitle="Minimum Item Level (ilvl)"
            inputTag="Level"
            name="iLvl"
            min={-1}
            max={1000}
            toolTip="Search for the minimum item level (ilvl) that will be returned. (-1 is for all levels)"
          />
        </SmallFormContainer>
      </PremiumPaywall>
    </PageWrapper>
  )
}

export default Index
