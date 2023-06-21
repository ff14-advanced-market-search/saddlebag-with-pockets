import type {
  ErrorBoundaryComponent,
  LoaderFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBounds error={error} />
)

export const loader: LoaderFunction = async ({ params, request }) => {
  const itemId = params.itemId
  if (!itemId) {
    return { exception: 'No item found, please try again' }
  } else return json({ itemId })
}

export default function Index() {
  const data = useLoaderData()
  console.log(data)
  return (
    <PageWrapper>
      <h1>{data.itemId}</h1>
    </PageWrapper>
  )
}
