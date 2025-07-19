import {
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate
} from '@remix-run/react'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import type { WoWScanResponseWithPayload } from '~/requests/WoW/WOWScan'
import WOWScanRequest from '~/requests/WoW/WOWScan'
import NoResults from '~/components/Common/NoResults'
import { PageWrapper, VideoGuide } from '~/components/Common'
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
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { combineWithDiscordSession } from '~/components/Common/DiscordSessionLoader'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW Server Transfer Trade Search',
    description:
      'Find wow local realm auctionhouse items that can be moved from one sever to another for a profit',
    links: [
      { rel: 'canonical', href: 'https://saddlebagexchange.com/wow/full-scan' }
    ]
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { getWoWSessionData } = await getUserSessionData(request)
    const { server, region } = getWoWSessionData()

    return combineWithDiscordSession(request, {
      wowRealm: server,
      wowRegion: region
    })
  } catch (err) {
    // Fallback to safe defaults if session retrieval fails
    return combineWithDiscordSession(request, {
      wowRealm: 'Thrall',
      wowRegion: 'NA'
    })
  }
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
  const { wowRealm, wowRegion, isLoggedIn, hasPremium, needsRefresh } =
    useLoaderData<
      WoWLoaderData & {
        isLoggedIn: boolean
        hasPremium: boolean
        needsRefresh: boolean
      }
    >()
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
        <VideoGuide
          title="Video Guide: How to Use the WoW Server Transfer Trade Search"
          description="Learn how to effectively use this tool to find profitable items that can be moved between servers for gold-making opportunities!"
          videoId="85gAo9B_q7g"
          startTime={70}
          videoTitle="WoW Server Transfer Trade Search Guide"
        />
        <PremiumPaywall
          loaderData={{
            isLoggedIn: !!isLoggedIn,
            hasPremium: !!hasPremium,
            needsRefresh
          }}>
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
        </PremiumPaywall>
        {wowScan && 'out_of_stock' in wowScan && <Results data={wowScan} />}
      </>
    </PageWrapper>
  )
}

export default Index
