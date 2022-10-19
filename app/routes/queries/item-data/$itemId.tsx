import type { LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import type { HistoryResponse } from '~/requests/GetHistory'
import GetHistory from '~/requests/GetHistory'
import type { ListingResponseType } from '~/requests/GetListing'
import GetListing from '~/requests/GetListing'
import { getUserSessionData } from '~/sessions'
import { getItemNameById } from '~/utils/items'
import HistoryResults from '../item-history/Results'
import NoResults from '../listings/NoResults'
import ListingResults from '../listings/Results'

export { ErrorBoundary } from '~/components/utilities/ErrorBoundary'

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
    const listingResponse = await GetListing({
      ...input,
      daysRange: [initialDays, endDays]
    })

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

const PageWrapper = ({ children }: { children: JSX.Element }) => (
  <main className="flex-1">
    <div className="py-3 px-4">{children}</div>
  </main>
)

const Title = ({ title }: { title: string }) => (
  <h1 className="text-2xl font-semibold text-blue-900 py-2">{title}</h1>
)

const Section = ({ children }: { children: JSX.Element }) => (
  <section className="max-w-4xl mx-auto px-4">{children}</section>
)

const ContentContainer = ({ children }: { children: JSX.Element }) => (
  <div className="my-6 px-3 pb-2 pt-4 sm:rounded-md bg-white shadow">
    {children}
  </div>
)

const ItemPage = () => {
  const data = useLoaderData<ItemPageData>()

  if ('exception' in data) {
    return (
      <PageWrapper>
        <h2 className="text-red-800">Error: {data.exception}</h2>
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
        <HistoryResults data={data.history} />
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
