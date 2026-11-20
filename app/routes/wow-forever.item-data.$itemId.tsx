import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { PageWrapper } from '../components/Common'
import NoResults from '../components/Common/NoResults'
import ErrorBounds from '../components/utilities/ErrorBoundary'
import ForeverItemDataDisplay from '../components/WoWForever/ItemDataDisplay'
import type {
  ForeverItemListing,
  ForeverItemListingResponse
} from '../requests/WoWForever/Listings'
import ForeverListings from '../requests/WoWForever/Listings'
import { getUserSessionData } from '../sessions.server'
import {
  getHomeForeverAuctionHouseId,
  isEnabledForeverAuctionHouseId,
  validateWoWForeverSettings,
  type WoWForeverRegion
} from '../utils/WoWForever'
import {
  encodeJsonLd,
  foreverItemErrorMeta,
  foreverItemPageMeta,
  foreverItemStructuredData
} from '../utils/WoWForever/itemDataSeo'

export const ErrorBoundary = () => <ErrorBounds />

type LoaderResult =
  | { data: ForeverItemListing; region: WoWForeverRegion }
  | { exception: string }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const readParam = (params: unknown, key: string): string | undefined => {
  if (!isRecord(params)) return undefined
  const value = params[key]
  return typeof value === 'string' ? value : undefined
}

const isForeverListing = (value: unknown): value is ForeverItemListing => {
  if (!isRecord(value)) return false
  return (
    typeof value.itemID === 'number' &&
    typeof value.itemName === 'string' &&
    typeof value.minPrice === 'number' &&
    Array.isArray(value.listingData)
  )
}

const regionFromSearchParam = (
  value: string | null
): WoWForeverRegion | undefined => {
  if (value == null || value === '') return undefined
  const upper = value.toUpperCase()
  if (upper === 'US' || upper === 'NA') return 'NA'
  if (upper === 'EU') return 'EU'
  return undefined
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!isRecord(data) || 'exception' in data) {
    const message =
      isRecord(data) && typeof data.exception === 'string'
        ? data.exception
        : 'Unknown'
    return foreverItemErrorMeta(message)
  }

  const listing = isRecord(data.data) ? data.data : null
  const itemID = typeof listing?.itemID === 'number' ? listing.itemID : 0
  const itemName =
    typeof listing?.itemName === 'string' ? listing.itemName : 'Unknown item'

  return foreverItemPageMeta({ itemID, itemName })
}

export const loader: LoaderFunction = async (args): Promise<LoaderResult> => {
  const itemId = readParam(args.params, 'itemId')
  if (!itemId) {
    return { exception: 'No item found, please try again' }
  }

  const parsedItemId = Number.parseInt(itemId, 10)
  if (Number.isNaN(parsedItemId)) return { exception: 'Invalid item' }

  const request = args.request
  if (!(request instanceof Request)) {
    return { exception: 'Invalid request' }
  }

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
    const result: ForeverItemListingResponse = await ForeverListings({
      auctionHouseId,
      region,
      itemID: parsedItemId
    })
    if ('exception' in result) {
      return result
    }
    return { data: result.data, region }
  } catch {
    return {
      exception:
        'Failed to load Forever item data. POST /api/wow/forever/listings may not be available yet.'
    }
  }
}

export default function Index() {
  const result: unknown = useLoaderData()

  if (isRecord(result) && typeof result.exception === 'string') {
    return (
      <PageWrapper>
        <h2 className="text-red-800 dark:text-red-200">
          Error: {result.exception}
        </h2>
      </PageWrapper>
    )
  }

  const listing =
    isRecord(result) && isForeverListing(result.data) ? result.data : null
  if (!listing) {
    return <NoResults />
  }

  const region: WoWForeverRegion =
    isRecord(result) && result.region === 'EU' ? 'EU' : 'NA'

  const { product, crumbs } = foreverItemStructuredData({
    itemID: listing.itemID,
    itemName: listing.itemName,
    minPrice: listing.minPrice
  })
  const productJsonLd = encodeJsonLd(product)
  const crumbsJsonLd = encodeJsonLd(crumbs)

  return (
    <PageWrapper>
      {/* JSON-LD is escaped by encodeJsonLd (`<` → `\u003c`); matches retail item-data. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- encodeJsonLd escapes script breakouts
        dangerouslySetInnerHTML={{ __html: productJsonLd }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- encodeJsonLd escapes script breakouts
        dangerouslySetInnerHTML={{ __html: crumbsJsonLd }}
      />
      <ForeverItemDataDisplay listing={listing} region={region} />
    </PageWrapper>
  )
}
