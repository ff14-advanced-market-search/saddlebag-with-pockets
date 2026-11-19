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
import {
  encodeJsonLd,
  foreverItemErrorMeta,
  foreverItemPageMeta,
  foreverItemStructuredData
} from '~/utils/WoWForever/itemDataSeo'

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

export const meta: MetaFunction = ({ data }) => {
  if (!data || 'exception' in data) {
    return foreverItemErrorMeta(
      data && 'exception' in data ? data.exception : 'Unknown'
    )
  }
  return foreverItemPageMeta({
    itemID: data.data.itemID,
    itemName: data.data.itemName
  })
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
  const { product, crumbs } = foreverItemStructuredData({
    itemID: listing.itemID,
    itemName: listing.itemName,
    minPrice: listing.minPrice
  })

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: encodeJsonLd(product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: encodeJsonLd(crumbs) }}
      />
      <ForeverItemDataDisplay listing={listing} />
    </PageWrapper>
  )
}
