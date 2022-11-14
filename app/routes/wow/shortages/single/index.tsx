import { useActionData, useTransition } from '@remix-run/react'
import { useState } from 'react'
import { PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { WowShortageResult } from '~/requests/WoWCommodities'
import NoResults from '~/routes/queries/listings/NoResults'
import WoWServerSelect from '../../full-scan/WoWServerSelect'
import { validateShortageData, WoWShortageFormFields } from '../commodities'
import ShortageResults from '../ShortageResults'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import type { WOWSingleItemShortageProps } from '~/requests/WoWSingleItemShortage'
import WoWSingleItemShortage from '~/requests/WoWSingleItemShortage'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const validInput = validateShortageData(formData)

  if ('exception' in validInput) {
    return json(validInput)
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

  return await WoWSingleItemShortage(props)
}

const DEFAULT_SERVER_NAME = 'Search here...'

const Index = () => {
  const transition = useTransition()
  const results = useActionData<WowShortageResult>()
  const [serverName, setServerName] = useState<string | undefined>(
    DEFAULT_SERVER_NAME
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
    return <ShortageResults results={results} serverName={serverName} />
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
          desiredSalesPerDayDefault={2}
          flipRiskLimitDefault={30}
        />
        <WoWServerSelect
          formName="homeRealmId"
          title="Home Server"
          onSelectChange={(selectValue) => {
            if (selectValue) setServerName(selectValue.name)
          }}
          toolTip="Select your home world server, type to begin selection."
          defaultServerId="9"
          defaultServerName={DEFAULT_SERVER_NAME}
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
