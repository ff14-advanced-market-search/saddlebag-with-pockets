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
import { useTypedSelector } from '~/redux/useTypedSelector'
import { PreviousResultsLink } from '../full-scan/PreviousResultsLink'
import { convertResponseToTableRows } from '../full-scan/convertResponseToTableRows'
import { useDispatch } from 'react-redux'
import { setOutOfStockScan } from '~/redux/reducers/queriesSlice'
import FullScanForm from '../full-scan/FullScanForm'

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
  const outOfStockScan = useTypedSelector(
    (state) => state.queries.outOfStockScan
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (results && Object.keys(results).length > 0) {
      dispatch(setOutOfStockScan(results))
    }
  }, [results, dispatch])

  const onSubmit = (e: React.MouseEvent) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href={`/queries/full-scan`} />
    }
    const data = convertResponseToTableRows(results)

    return <Results rows={data} />
  }
  return (
    <main className="flex-1">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-green-900 py-6">
            Out Of Stock Search - Buy at least 5 to 10 different HQ items not
            listed on your server which cost under 5k. Sell them on your market
            board for 70k. Not all will guarenteed sell before competition shows
            up, but you only need 1 sale to gain a massive profit margin.
          </h1>
          {outOfStockScan && !results && (
            <PreviousResultsLink to="/queries/previous-search?query=outOfStockScan" />
          )}
          <FullScanForm
            loading={transition.state === 'submitting'}
            onClick={onSubmit}
            defaultHours={99}
            defaultSalesAmount={2}
            defaultROI={99}
            defaultMinimumProfitAmount={100}
            defaultPricePerUnit={100}
            defaultFilters={[1, 2, 3, 4, 7]}
            defaultHQChecked={true}
            defaultOutOfStockChecked={true}
          />
        </div>
      </div>
    </main>
  )
}

export default Index
