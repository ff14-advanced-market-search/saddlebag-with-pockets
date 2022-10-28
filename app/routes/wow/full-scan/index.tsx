import { useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import type { WoWScanResponse } from '~/requests/WOWScan'
import WOWScanRequest from '~/requests/WOWScan'
import NoResults from '../../queries/listings/NoResults'
import { PageWrapper } from '~/components/Common'
import { validateWoWScanInput } from './validateWoWScanInput'
import { useEffect, useState } from 'react'
import WoWScanForm from './WoWScanForm'
import { Results } from './Results'

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
  const results = useActionData<WoWScanResponse | { exception: string }>()
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

  if (results && 'out_of_stock' in results) {
    return (
      <PageWrapper>
        <>
          <Results data={results} />
        </>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <WoWScanForm
        onClick={onSubmit}
        onChange={() => {
          setError(undefined)
        }}
        loading={transition.state === 'submitting'}
        error={error}
      />
    </PageWrapper>
  )
}

export default Index
