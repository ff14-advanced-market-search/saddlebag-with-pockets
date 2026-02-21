import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
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
      itemDescription?: string
      itemId?: string
    }
  | { exception: string; itemName: string }

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (data && 'exception' in data) {
    return [
      { charset: 'utf-8' },
      { title: 'Error' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      { name: 'description', content: `Error: ${data.exception}` }
    ]
  }
  const itemName = data?.itemName || 'Unknown Item'
  const itemId = data?.itemId ?? params?.itemId ?? '4745'
  const canonicalUrl = `https://saddlebagexchange.com/queries/item-data/${itemId}`
  const description = `${itemName}: FFXIV Market Board Data`
  const title = `${itemName} – FFXIV Market Board Price Data`

  return [
    { charset: 'utf-8' },
    { title },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: canonicalUrl },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'product' },
    { property: 'og:site_name', content: 'SaddleBag Exchange' },
    { name: 'twitter:card', content: 'summary' }
  ]
}

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
    const [historyResponse, listingResponse, blogResponse] = await Promise.all([
      GetHistory(input),
      GetListing(input),
      GetBlog({ itemId: parsedItemId })
    ])

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
      itemName,
      itemId
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
  const itemId =
    data.history && 'itemID' in data.history
      ? String(data.history.itemID)
      : '4745'

  const noResults =
    (!data.history || !('price_history' in data.history)) &&
    (!listing || !('listings' in listing))

  const canonicalItemId = data.itemId ?? itemId
  const canonicalUrl = `https://saddlebagexchange.com/queries/item-data/${canonicalItemId}`
  const lowPrice =
    listing &&
    'min_price' in listing &&
    typeof listing.min_price === 'number' &&
    listing.min_price > 0
      ? listing.min_price
      : undefined
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.itemName,
    description: `${data.itemName}: FFXIV Market Board Data`,
    url: canonicalUrl
  }
  if (lowPrice != null) {
    jsonLd.offers = {
      '@type': 'AggregateOffer',
      lowPrice,
      priceCurrency: 'GIL',
      availability: 'https://schema.org/InStock'
    }
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://saddlebagexchange.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FFXIV',
        item: 'https://saddlebagexchange.com/ffxiv/itemlist'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.itemName,
        item: canonicalUrl
      }
    ]
  }
  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
  const breadcrumbString = JSON.stringify(breadcrumbSchema).replace(
    /</g,
    '\\u003c'
  )

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbString }}
      />
      <>
        <Section>
          <>
            <Title title={data.itemName} />
            {noResults && (
              <Title title="No results found" className="text-xl" />
            )}
          </>
        </Section>
        <p style={{ fontSize: '1px' }}>{data.itemDescription}</p>
        <Banner />
        <Section>
          <div className="flex flex-wrap gap-2">
            <CustomButton
              link={`https://saddlebagexchange.com/queries/`}
              buttonText="View all our tools here!"
            />
            <CustomButton
              link={`https://universalis.app/market/${itemId}`}
              buttonText="View on Universalis"
            />
            <CustomButton
              link={`https://ffxivteamcraft.com/db/en/item/${itemId}`}
              buttonText="View on FFXIV Teamcraft"
            />
            <CustomButton
              link={`https://www.garlandtools.org/db/#item/${itemId}`}
              buttonText="View on Garland Tools"
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
              {listing && 'listings' in listing ? (
                <ListingResults data={listing} />
              ) : (
                <NoResults title={`No listings data for ${data.itemName}`} />
              )}
            </>
          </ContentContainer>
        </Section>
      </>
    </PageWrapper>
  )
}

export default ItemPage
