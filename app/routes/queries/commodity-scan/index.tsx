import { useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { getUserSessionData } from '~/sessions'
import FullScanRequest, { FormValues } from '~/requests/FullScan'

import { useEffect } from 'react'
import NoResults from '~/routes/queries/full-scan/NoResults'
import Results from '~/routes/queries/full-scan/Results'
import { setCommodoityScan } from '~/redux/reducers/queriesSlice'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { PreviousResultsLink } from '../full-scan/PreviousResultsLink'
import FullScanForm from '../full-scan/FullScanForm'
import { setFFScanOrder } from '~/redux/reducers/userSlice'

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  formData.append('world', session.getWorld())

  const typedData = new FormValues(formData)

  const data = typedData.toMap()
  console.dir(data)
  return await FullScanRequest(data).catch((err) => {
    console.log('catch', err)
    return err
  })
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

  const dispatch = useDispatch()

  const commodityScan = useTypedSelector((state) => state.queries.commodityScan)
  const sortOrder = useTypedSelector((state) => state.user.ffScanSortOrder)

  const onSubmit = (e: React.MouseEvent) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (results && results.data) {
      dispatch(setCommodoityScan(results.data))
    }
  }, [results, dispatch])

  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href={`/queries/full-scan`} />
    }

    const data = results.data

    return (
      <Results
        rows={data}
        sortOrder={sortOrder}
        onReOrder={(newOrder) => dispatch(setFFScanOrder(newOrder))}
      />
    )
  }
  return (
    <main className="flex-1">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-green-900 py-6">
            Commodity Search
          </h1>
          {commodityScan && !results && (
            <PreviousResultsLink to="/queries/previous-search?query=commodityScan" />
          )}
          <FullScanForm
            loading={transition.state === 'submitting'}
            onClick={onSubmit}
            defaultMinimumStackSize={2}
            defaultMinimumProfitAmount={1000}
            defaultPricePerUnit={1000}
          />
        </div>
      </div>
    </main>
  )
}

export default Index
