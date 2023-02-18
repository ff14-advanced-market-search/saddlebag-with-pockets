import { useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { useState } from 'react'
import { PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { WowShortageResult } from '~/requests/WoWCommodities'
import NoResults from '~/components/Common/NoResults'
import { validateShortageData, WoWShortageFormFields } from '../commodities'
import ShortageResults from '../ShortageResults'
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import type { WOWSingleItemShortageProps } from '~/requests/WoWSingleItemShortage'
import WoWSingleItemShortage from '~/requests/WoWSingleItemShortage'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import { getUserSessionData } from '~/sessions'
import type { WoWLoaderData } from '~/requests/WoW/types'

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

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

const Index = () => {
  const transition = useTransition()
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const results = useActionData<WowShortageResult>()

  const [serverName, setServerName] = useState<string | undefined>(
    wowRealm.name
  )
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
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
    </PageWrapper>
  )
}

export default Index
