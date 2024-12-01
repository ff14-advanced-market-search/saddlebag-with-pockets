import type { LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import Banner from '~/components/Common/Banner'
import {
  ContentContainer,
  PageWrapper,
  Section,
  Title,
  TitleH2
} from '~/components/Common'
import type { HistoryResponse } from '~/requests/FFXIV/GetHistory'
import GetHistory from '~/requests/FFXIV/GetHistory'
import type { ListingResponseType } from '~/requests/FFXIV/GetListing'
import GetListing from '~/requests/FFXIV/GetListing'
import type { BlogResponseType } from '~/requests/FFXIV/GetBlog'
import GetBlog from '~/requests/FFXIV/GetBlog'
import { getUserSessionData } from '~/sessions'
import { getItemNameById } from '~/utils/items'
import HistoryResults from '~/components/FFXIVResults/item-history/Results'
import NoResults from '~/components/Common/NoResults'
import ListingResults from '~/components/FFXIVResults/listings/Results'
import { useTypedSelector } from '~/redux/useTypedSelector'
import CustomButton from '~/components/utilities/CustomButton'

type ItemPageData =
  | {
      history?: HistoryResponse | {}
      listing?: ListingResponseType | {}
      itemName: string
    }
  | { exception: string }

// Overwrite default meta in the root.tsx
// Change your MetaFunction arguments
type MetaArgs = {
  context: any
  data: ItemPageData
}
export const meta: MetaFunction = ({ data }: MetaArgs) => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: data.itemName,
    description: `${data.itemName}: FFXIV Market data`
  }
}

// // THIS ISNT WORKING!!!
// export const links: LinksFunction = ({ request }) => {
//   const itemId = request.params.itemId;
//   return [
//     { rel: 'canonical', href: `https://saddlebagexchange.com/queries/item-data/${itemId}` }
//   ];
// }

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
  const initialDays = 7
  const endDays = 0
  const input = { itemId: parsedItemId, world, itemType, initialDays, endDays }

  try {
    const historyResponse = await GetHistory(input)
    const listingResponse = await GetListing(input)
    const blogResponse = await GetBlog({ itemId: parsedItemId })

    if (!historyResponse.ok) {
      return { exception: historyResponse.statusText }
    }

    if (!listingResponse.ok) {
      return { exception: listingResponse.statusText }
    }

    if (!blogResponse.ok) {
      return { exception: blogResponse.statusText }
    }

    return json({
      'Cache-Control': 'public, max-age=31536000, immutable',
      history: await historyResponse.json(),
      listing: await listingResponse.json(),
      itemDescription: (await blogResponse.json()).itemDescription,
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

  const listing = data?.listing
  // itemID uses caps on ID from api response values
  // default to 4745 so we dont have dead links on pages without history data
  const itemId = data.history?.itemID || '4745'

  const noResults =
    (!data.history || !('price_history' in data.history)) &&
    (!listing || !('listings' in listing))

  return (
    <PageWrapper>
      <>
        <Banner />
        <Section>
          <>
            <Title title={data.itemName} />
            {noResults && (
              <Title title="No results found" className="text-xl" />
            )}
          </>
        </Section>

        <Section>
          <div className="flex flex-wrap gap-2">
            <CustomButton
              link={`https://universalis.app/market/${itemId}`}
              buttonText="View on Universalis"
              rel="nofollow" // not working need to fix
            />
            <CustomButton
              link={`https://ffxivteamcraft.com/db/en/item/${itemId}`}
              buttonText="View on FFXIV Teamcraft"
              rel="nofollow" // not working need to fix
            />
            <CustomButton
              link={`https://www.garlandtools.org/db/#item/${itemId}`}
              buttonText="View on Garland Tools"
              rel="nofollow" // not working need to fix
            />
          </div>
        </Section>

        <Section>
          <>
            <TitleH2 title={`${data.itemName} Sale History`} />
            {noResults && (
              <TitleH2 title="No results found" className="text-xl" />
            )}
          </>
        </Section>

        {data.history && 'price_history' in data.history ? (
          <HistoryResults data={data.history} darkMode={darkmode} />
        ) : (
          <NoResults title={`No historical data for ${data.itemName}`} />
        )}
        <Section>
          <ContentContainer>
            <>
              <TitleH2 title={`${data.itemName} Current Listings`} />
              {listing &&
              'listings' in listing &&
              listing.listings.length > 0 ? (
                <ListingResults data={listing} />
              ) : (
                <NoResults title={`No listings data for ${data.itemName}`} />
              )}
            </>
          </ContentContainer>
        </Section>
        <Section>
          <ContentContainer>
            <>
              <div dangerouslySetInnerHTML={{ __html: data.itemDescription }} />
            </>
          </ContentContainer>
        </Section>
      </>
    </PageWrapper>
  )
}

export default ItemPage
