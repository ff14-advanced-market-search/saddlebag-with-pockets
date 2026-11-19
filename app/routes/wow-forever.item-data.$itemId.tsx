import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import ForeverItemDataDisplay from '~/components/WoWForever/ItemDataDisplay'
import type { ForeverItemListingResponse } from '~/requests/WoWForever/Listings'
import ForeverListings from '~/requests/WoWForever/Listings'
import { getUserSessionData } from '~/sessions.server'
import {
  getHomeForeverAuctionHouseId,
  isEnabledForeverAuctionHouseId,
  validateWoWForeverSettings,
  type WoWForeverRegion
} from '~/utils/WoWForever'

export const ErrorBoundary = () => <ErrorBounds />

const regionFromSearchParam = (
  value: string | null
): WoWForeverRegion | undefined => {
  if (!value) return undefined
  const upper = value.toUpperCase()
  if (upper === 'NA' || upper === 'EU' || upper === 'US') {
    return upper === 'US' ? 'NA' : upper
  }
  return undefined
}

const safeJsonLd = (value: unknown) =>
  JSON.stringify(value).replaceAll('<', '\u003c')

export const meta: MetaFunction = ({ data }) => {
  if (!data || 'exception' in data) {
    const message = data && 'exception' in data ? data.exception : 'Unknown'
    return [
      { charset: 'utf-8' },
      { title: 'Error' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      { name: 'description', content: `Error: ${message}` }
    ]
  }

  const listing = data.data
  const canonicalUrl = `https://saddlebagexchange.com/wow-forever/item-data/${listing.itemID}`
  const description = `${listing.itemName} WoW Forever auction house price and listing data`
  const title = `${listing.itemName} – WoW Forever Auction House Data`
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

  const parsedItemId = Number.parseInt(itemId, 10)
  if (Number.isNaN(parsedItemId)) return { exception: 'Invalid item' }

  const session = await getUserSessionData(request)
  let { region, faction, ruleset } = session.getWoWForeverSessionData()

  const url = new URL(request.url)
  const regionFromUrl = regionFromSearchParam(url.searchParams.get('region'))
  const auctionHouseIdRaw = url.searchParams.get('auctionHouseId')
  const parsedAuctionHouseId =
    auctionHouseIdRaw != null && auctionHouseIdRaw !== ''
      ? Number.parseInt(auctionHouseIdRaw, 10)
      : Number.NaN
  const hasAuctionHouseId = !Number.isNaN(parsedAuctionHouseId)

  if (regionFromUrl) {
    region = regionFromUrl
  }

  const auctionHouseId = hasAuctionHouseId
    ? parsedAuctionHouseId
    : getHomeForeverAuctionHouseId(faction, ruleset)

  if (hasAuctionHouseId && !isEnabledForeverAuctionHouseId(auctionHouseId)) {
    return {
      exception: `${auctionHouseId} is not a valid Forever auction house id`
    }
  }

  region = validateWoWForeverSettings(region, faction, ruleset).region

  try {
    return await ForeverListings({
      auctionHouseId,
      region,
      itemID: parsedItemId
    })
  } catch {
    return {
      exception:
        'Failed to load Forever item data. POST /api/wow/forever/listings may not be deployed yet (Aetheryte PR #426).'
    }
  }
}

export default function Index() {
  const result = useLoaderData<ForeverItemListingResponse>()

  if (result && 'exception' in result) {
    return (
      <PageWrapper>
        <h2 className="text-red-800 dark:text-red-200">
          Error: {result.exception}
        </h2>
      </PageWrapper>
    )
  }

  if (!result || !('data' in result) || !result.data) {
    return <NoResults />
  }

  const listing = result.data
  const canonicalUrl = `https://saddlebagexchange.com/wow-forever/item-data/${listing.itemID}`
  const productSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.itemName,
    description: `${listing.itemName} WoW Forever auction house price and listing data`,
    url: canonicalUrl
  }
  if (typeof listing.minPrice === 'number' && listing.minPrice !== -1) {
    productSchema.offers = {
      '@type': 'AggregateOffer',
      lowPrice: listing.minPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  }
  const crumbs = {
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
        name: 'WoW Forever',
        item: 'https://saddlebagexchange.com/wow-forever'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: listing.itemName,
        item: canonicalUrl
      }
    ]
  }

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />
      <ForeverItemDataDisplay listing={listing} />
    </PageWrapper>
  )
}
