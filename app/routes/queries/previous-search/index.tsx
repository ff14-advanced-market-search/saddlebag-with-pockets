import type { LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import type { QueriesState } from '~/redux/reducers/queriesSlice'
import { useTypedSelector } from '~/redux/useTypedSelector'
import NoResults from './NoResults'
import Results from '../full-scan/Results'

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  const term = url.searchParams.get('query')

  return json({ query: term })
}

const PreviousSearch = () => {
  const data = useLoaderData()

  const queries = useTypedSelector((state) => state.queries)

  if (!data || !data.query) {
    return <NoResults href="/" />
  }

  const dataToUse = queries[data.query as keyof QueriesState]

  if (!dataToUse || 'listings' in dataToUse || 'dirty_sales' in dataToUse) {
    return <NoResults href="/" />
  }

  const rowData = dataToUse

  return <Results rows={rowData} />
}

export default PreviousSearch
