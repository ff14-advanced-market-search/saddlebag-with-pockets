import type { LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { useTypedSelector } from '~/redux/useTypedSelector'
import NoResults from '~/components/Common/NoResults'
import Results from '../components/FFXIVResults/FullScan/Results'

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  const term = url.searchParams.get('query')

  return json({ query: term })
}

const PreviousSearch = () => {
  const data = useLoaderData()

  const queries = useTypedSelector((state) => state.queries)

  if (!data || !data.query || data.query !== 'fullScan') {
    return <NoResults href='/' />
  }

  const dataToUse = queries.fullScan

  if (!dataToUse) {
    return <NoResults href='/' />
  }

  const rowData = dataToUse

  return <Results rows={rowData} />
}

export default PreviousSearch
