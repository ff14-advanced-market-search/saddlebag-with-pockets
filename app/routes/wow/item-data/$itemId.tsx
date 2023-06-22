import type {
  ErrorBoundaryComponent,
  LoaderFunction
} from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'
import type { ItemListingResponse } from '~/requests/WoW/ItemListingsData'
import ItemListingsData from '~/requests/WoW/ItemListingsData'
import { getUserSessionData } from '~/sessions'

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBounds error={error} />
)

export const loader: LoaderFunction = async ({ params, request }) => {
  const itemId = params.itemId
  if (!itemId) {
    return { exception: 'No item found, please try again' }
  }

  const parsedItemId = parseInt(itemId)
  if (isNaN(parsedItemId)) return { exception: 'Invalid item' }

  const session = await getUserSessionData(request)

  const { server, region } = session.getWoWSessionData()

  return await ItemListingsData({
    homeRealmId: server.id,
    region,
    itemID: parsedItemId
  })
}

type ResponseType = ItemListingResponse | { exception: string }

export default function Index() {
  const result = useLoaderData<ResponseType>()
  console.log(result)

  const error = result && 'exception' in result ? result.exception : undefined

  if (error) {
    return (
      <PageWrapper>
        <h2 className="text-red-800 dark:text-red-200">Error: {error}</h2>
      </PageWrapper>
    )
  }

  if (!Object.keys(result).length) {
    return <NoResults />
  }

  const listing = 'data' in result ? result.data : undefined

  if (listing) {
    return (
      <PageWrapper>
        <Title title={listing.itemName} />
      </PageWrapper>
    )
  }
}
