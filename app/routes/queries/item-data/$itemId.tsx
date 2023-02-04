import type {
  ErrorBoundaryComponent,
  LoaderFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import {
  ContentContainer,
  PageWrapper,
  Section,
  Title
} from '~/components/Common'
import type { HistoryResponse } from '~/requests/GetHistory'
import GetHistory from '~/requests/GetHistory'
import type { ListingResponseType } from '~/requests/GetListing'
import GetListing from '~/requests/GetListing'
import { getUserSessionData } from '~/sessions'
import { getItemNameById } from '~/utils/items'
import HistoryResults from '../item-history/Results'
import NoResults from '~/components/Common/NoResults'
import ListingResults from '../listings/Results'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'
import { useTypedSelector } from '~/redux/useTypedSelector'

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBounds error={error} />
)

type ItemPageData =
  | {
      history: HistoryResponse
      listing: ListingResponseType | {}
      itemName: string
    }
  | { exception: string }

export const loader: LoaderFunction = async ({ params, request }) => {
  const itemId = params.itemId
  if (!itemId) {
    return { exception: 'No item found, please try again' }
  }

  const parsedItemId = parseInt(itemId)
  if (isNaN(parsedItemId)) return { exception: 'Invalid item' }

  const itemName = getItemNameById(itemId)
  if (!itemName) {
    return { exception: 'No item found, please try again' }
  }

  const session = await getUserSessionData(request)

  const world = session.getWorld()
  if (!world) {
    return { exception: 'No world selected, please try again' }
  }

  const itemType = 'all' as const
  const initialDays = 14
  const endDays = 0
  const input = { itemId: parsedItemId, world, itemType, initialDays, endDays }

  try {
    const historyResponse = await GetHistory(input)
    const listingResponse = await GetListing(input)

    if (!historyResponse.ok) {
      return { exception: historyResponse.statusText }
    }

    if (!listingResponse.ok) {
      return { exception: listingResponse.statusText }
    }

    return json({
      history: await historyResponse.json(),
      listing: await listingResponse.json(),
      itemName
    })
  } catch (error) {
    if (error instanceof Error) {
      return { exception: error.message }
    } else return { exception: 'Error finding data' }
  }
}

const ItemPage = () => {
  const data = useLoaderData<ItemPageData>()
  const { darkmode } = useTypedSelector(({ user }) => user)

  if ('exception' in data) {
    return (
      <PageWrapper>
        <h2 className="text-red-800 dark:text-red-200">
          Error: {data.exception}
        </h2>
      </PageWrapper>
    )
  }

  const listing = data.listing

  return (
    <PageWrapper>
      <>
        <Section>
          <Title title={data.itemName} />
        </Section>
        <HistoryResults data={data.history} darkMode={darkmode} />
        <Section>
          <ContentContainer>
            <>
              <Title title={`${data.itemName} Listings`} />
              {listing &&
              'listings' in listing &&
              listing.listings.length > 0 ? (
                <ListingResults data={listing} />
              ) : (
                <NoResults href="/" />
              )}
            </>
          </ContentContainer>
        </Section>
      </>
    </PageWrapper>
  )
}

export default ItemPage
