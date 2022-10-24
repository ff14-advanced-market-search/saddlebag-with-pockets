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
import { convertResponseToTableRows } from '../full-scan/convertResponseToTableRows'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { useDispatch } from 'react-redux'
import { setQuestScan } from '~/redux/reducers/queriesSlice'
import { PreviousResultsLink } from '../full-scan/PreviousResultsLink'
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

  const questScan = useTypedSelector((state) => state.queries.questScan)

  const dispatch = useDispatch()

  useEffect(() => {
    if (results && Object.keys(results).length > 0) {
      dispatch(setQuestScan(results))
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
            Quest Search: These items are bought by players to turn in for
            <a
              target="_blank"
              rel="noreferrer"
              className="primary-btn"
              href="https://ffxiv.gamerescape.com/wiki/Supply_and_Provisioning_Mission">
              <u> Supply and Provisioning Missions </u>
            </a>
            or
            <a
              target="_blank"
              rel="noreferrer"
              className="primary-btn"
              href="https://ffxivgillionaire.com/crafter-class-quest-items-guide">
              <u> Crafter Class Quests.</u>
            </a>{' '}
            Look over those links, as some quests or missions require high
            quality items.
          </h1>
          {questScan && !results && (
            <PreviousResultsLink to="/queries/previous-search?query=questScan" />
          )}
          <FullScanForm
            loading={transition.state === 'submitting'}
            onClick={onSubmit}
            defaultHours={48}
            defaultSalesAmount={2}
            defaultROI={50}
            defaultMinimumStackSize={1}
            defaultMinimumProfitAmount={1000}
            defaultPricePerUnit={1000}
            defaultFilters={[-2, -3]}
            defaultIncludeVendorChecked={true}
            defaultOutOfStockChecked={true}
          />
        </div>
      </div>
    </main>
  )
}

export default Index
