import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import type { WoWScanResponseWithPayload } from '~/requests/WoW/WOWScan'
import WOWScanRequest from '~/requests/WoW/WOWScan'
import NoResults from '~/components/Common/NoResults'
import { PageWrapper } from '~/components/Common'
import { validateWoWScanInput } from '~/utils/validateWoWScanInput'
import { useEffect, useState } from 'react'
import WoWScanForm from '~/components/form/WoW/WoWScanForm'
import { Results } from '~/components/WoWResults/FullScan/Results'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { setWoWScan } from '~/redux/reducers/wowSlice'
import { getUserSessionData } from '~/sessions'
import type { WoWLoaderData } from '~/requests/WoW/types'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import Banner from '~/components/Common/Banner'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW server transfer trade search',
    description:
      'Find wow local realm auctionhouse items that can be moved from one sever to another for a profit'
  }
}

// Overwrite default links in the root.tsx
export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/wow/full-scan' }
]

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

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
export const ErrorBoundary = () => <ErrorBounds />

const Index = () => {
  const transition = useNavigation()
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const results = useActionData<
    WoWScanResponseWithPayload | { exception: string }
  >()
  const [error, setError] = useState<string | undefined>()
  const dispatch = useDispatch()
  const wowScan = useTypedSelector((state) => state.wowQueries.scan)

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (results && 'exception' in results) {
      setError(`Error: ${results.exception}`)
    } else if (results && Object.keys(results).length > 0) {
      dispatch(setWoWScan(results))
    }
  }, [results, dispatch])

  if (wowScan) {
    if (Object.keys(wowScan).length === 0) {
      return <NoResults href={`/wow/full-scan`} />
    }
  }

  return (
    <PageWrapper>
      <>
        <Banner />
        <WoWScanForm
          onClick={onSubmit}
          onChange={() => {
            setError(undefined)
          }}
          loading={transition.state === 'submitting'}
          error={error}
          clearErrors={() => setError(undefined)}
          defaultRegion={wowRegion}
          defaultServer={wowRealm}
        />
        {wowScan && 'out_of_stock' in wowScan && <Results data={wowScan} />}
      </>
    </PageWrapper>
  )
}

export default Index
