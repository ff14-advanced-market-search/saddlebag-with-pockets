import { useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import WOWScanRequest from '~/requests/WOWScan'
import NoResults from '../../queries/listings/NoResults'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import { validateWoWScanInput } from './validateWoWScanInput'
import WoWServerSelect from './WoWServerSelect'
import { useEffect, useState } from 'react'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const validInput = validateWoWScanInput(formData)

  if ('exception' in validInput) {
    return json({ ...validInput })
  }

  try {
    const request = await WOWScanRequest(validInput)

    const jsonedRespone = await request.json()
    if ('exception' in jsonedRespone) {
      return json({ ...jsonedRespone })
    }

    return json({ ...jsonedRespone, payload: validInput })
  } catch (err) {
    console.log('catch', err)
    return err
  }
}
export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error('errorBoundary', error)
  return (
    <pre>
      If you're seeing this, it'd be appreciated if you could report in our
      Discord's <span className={`font-bold`}>#bug-reporting</span> channel.
      Much thank
    </pre>
  )
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData()
  const [error, setError] = useState<string | undefined>()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }
  console.log(results)

  useEffect(() => {
    if (results && 'exception' in results) {
      setError(`Error: ${results.exception}`)
    }
  }, [results])

  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href={`/wow/full-scan`} />
    }
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="WoW Sale Search"
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        disabled={transition.state === 'submitting'}
        error={error}>
        <InputWithLabel
          defaultValue={10000}
          type="number"
          labelTitle="Minimum Historic Price"
          inputTag="Amount"
          name="minHistoricPrice"
          onChange={() => {
            setError(undefined)
          }}
        />
        <InputWithLabel
          defaultValue={50}
          type="number"
          labelTitle="Return On Investment (%)"
          inputTag="Percentage"
          name="roi"
          onChange={() => {
            setError(undefined)
          }}
        />
        <InputWithLabel
          defaultValue={0}
          type="number"
          labelTitle="Sales Per Day"
          inputTag="Min Sales"
          name="salePerDay"
          onChange={() => {
            setError(undefined)
          }}
        />
        <WoWServerSelect formName="homeRealmId" title="Home World" />
        <WoWServerSelect formName="newRealmId" title="New World" />
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
