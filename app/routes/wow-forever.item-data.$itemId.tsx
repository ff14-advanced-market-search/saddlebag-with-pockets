import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import type {
  ForeverItemListing,
  ForeverItemListingResponse
} from '~/requests/WoWForever/BulkListings'
import { ForeverItemListingsData } from '~/requests/WoWForever/BulkListings'
import { Differences } from '~/components/FFXIVResults/listings/Differences'
import { getUserSessionData } from '~/sessions.server'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import CustomButton from '~/components/utilities/CustomButton'
import Banner from '~/components/Common/Banner'
import type { ColumnList } from '~/components/types'
import {
  foreverAuctionHouseLabel,
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

const diffClass =
  'bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100'

const StatBlock = ({
  items
}: {
  items: Array<{ title: string; amount: string } | null>
}) => {
  const visible = items.filter(Boolean) as Array<{
    title: string
    amount: string
  }>
  if (!visible.length) return null
  return (
    <div className="flex flex-col max-w-full">
      {visible.map((item) => (
        <Differences
          key={item.title}
          diffTitle={item.title}
          diffAmount={item.amount}
          className={diffClass}
        />
      ))}
    </div>
  )
}

const listingStatGroups = (listing: ForeverItemListing) => [
  [
    listing.minPrice !== -1
      ? { title: 'Minimum Price', amount: listing.minPrice.toLocaleString() }
      : null,
    listing.historicPrice !== -1
      ? {
          title: 'Historic Price',
          amount: listing.historicPrice.toLocaleString()
        }
      : null
  ],
  [
    listing.currentMarketValue !== -1
      ? {
          title: 'Current Market Value',
          amount: listing.currentMarketValue.toLocaleString()
        }
      : null,
    listing.historicMarketValue !== -1
      ? {
          title: 'Historic Market Value',
          amount: listing.historicMarketValue.toLocaleString()
        }
      : null
  ],
  [
    listing.salesPerDay !== -1
      ? {
          title: 'Sales Per Day',
          amount: listing.salesPerDay.toLocaleString()
        }
      : null,
    listing.percentChange !== -1
      ? {
          title: 'Percent Change',
          amount: `${listing.percentChange.toLocaleString()}%`
        }
      : null
  ],
  [
    listing.currentQuantity !== 1
      ? {
          title: 'Current Quantity',
          amount: listing.currentQuantity.toLocaleString()
        }
      : null,
    listing.avgQuantity !== -1
      ? {
          title: 'Average Quantity',
          amount: listing.avgQuantity.toLocaleString()
        }
      : null,
    listing.currentVsAvgQuantityPercent !== 100
      ? {
          title: 'Avg v Current Quantity',
          amount: `${listing.currentVsAvgQuantityPercent.toLocaleString()}%`
        }
      : null
  ]
]

export const meta: MetaFunction = ({ data }) => {
  if (!data || 'exception' in data) {
    return [
      { charset: 'utf-8' },
      { title: 'Error' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      {
        name: 'description',
        content: `Error: ${
          data && 'exception' in data ? data.exception : 'Unknown'
        }`
      }
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

  const validated = validateWoWForeverSettings(region, faction, ruleset)
  region = validated.region

  try {
    return await ForeverItemListingsData({
      auctionHouseId,
      region,
      itemID: parsedItemId
    })
  } catch {
    return {
      exception:
        'Failed to load Forever item data. POST /api/wow/forever/bulk-listings may not be deployed yet (Aetheryte PR #426).'
    }
  }
}

type ResponseType = ForeverItemListingResponse

type ListItem = {
  price: number
  quantity: number
}

const columnList: Array<ColumnList<ListItem>> = [
  { columnId: 'price', header: 'Price' },
  { columnId: 'quantity', header: 'Quantity' }
]

const mobileColumnList: Array<ColumnList<ListItem>> = [
  { columnId: 'price', header: 'Price' },
  { columnId: 'quantity', header: 'Quantity' }
]

export default function Index() {
  const result = useLoaderData<ResponseType>()

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
  if (!listing) {
    return <NoResults />
  }

  const canonicalUrl = `https://saddlebagexchange.com/wow-forever/item-data/${listing.itemID}`
  const houseLabel =
    listing.auctionHouseName || foreverAuctionHouseLabel(listing.auctionHouseId)
  const lowPrice =
    typeof listing.minPrice === 'number' && listing.minPrice !== -1
      ? listing.minPrice
      : undefined

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.itemName,
    description: `${listing.itemName} WoW Forever auction house price and listing data`,
    url: canonicalUrl
  }
  if (lowPrice != null) {
    jsonLd.offers = {
      '@type': 'AggregateOffer',
      lowPrice,
      priceCurrency: 'USD',
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <Title title={listing.itemName} />
      <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-2">
        WoW Forever · {listing.faction} · {houseLabel}
      </p>
      {listing.blog ? <p style={{ fontSize: '1px' }}>{listing.blog}</p> : null}
      <Banner />
      <div className="flex flex-col justify-around mx-3 my-6 md:flex-row">
        {listingStatGroups(listing).map((group, index) => (
          <StatBlock key={index} items={group} />
        ))}
      </div>
      <div className="flex flex-col justify-around mx-3 my-6 md:flex-row">
        <div className="flex flex-wrap gap-2">
          <CustomButton
            link="https://saddlebagexchange.com/wow-forever/"
            buttonText="View all Forever tools"
          />
          <CustomButton
            link="https://saddlebagexchange.com/options"
            buttonText="Change Forever home AH"
          />
          <CustomButton
            link={`https://www.wowhead.com/item=${listing.itemID}`}
            buttonText="View on WoWHead"
          />
        </div>
      </div>

      {listing.listingData.length === 0 ? (
        <div className="my-8 text-center text-xl font-bold text-red-700 dark:text-red-300">
          Out of Stock on Selected Auction House
        </div>
      ) : (
        <SmallTable
          title={`${listing.itemName} : ${houseLabel} Listings`}
          sortingOrder={[{ desc: false, id: 'price' }]}
          columnList={columnList}
          mobileColumnList={mobileColumnList}
          columnSelectOptions={['price', 'quantity']}
          data={listing.listingData}
        />
      )}
    </PageWrapper>
  )
}
