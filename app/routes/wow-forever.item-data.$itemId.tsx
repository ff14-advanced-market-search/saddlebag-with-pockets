import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import type { ForeverItemListingResponse } from '~/requests/WoWForever/BulkListings'
import { ForeverItemListingsData } from '~/requests/WoWForever/BulkListings'
import { Differences } from '~/components/FFXIVResults/listings/Differences'
import { getUserSessionData } from '~/sessions.server'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { format, subHours } from 'date-fns'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import CustomButton from '~/components/utilities/CustomButton'
import Banner from '~/components/Common/Banner'
import { useState, useEffect } from 'react'
import type { ColumnList } from '~/components/types'
import {
  foreverAuctionHouseLabel,
  getHomeForeverAuctionHouseId,
  isEnabledForeverAuctionHouseId,
  validateWoWForeverSettings,
  type WoWForeverRegion
} from '~/utils/WoWForever'

// Lazy load Highcharts component
const LazyCharts = ({
  listing,
  darkmode,
  now
}: {
  listing: {
    priceTimeData: Array<number>
    quantityTimeData: Array<number>
  }
  darkmode: boolean
  now: Date
}) => {
  const [chartsLoaded, setChartsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const loadCharts = () => {
    setChartsLoaded(true)
  }

  const shouldShowButton = isMobile && !chartsLoaded
  const shouldLoadCharts = !isMobile || chartsLoaded

  const makeTimeString = ({
    date,
    hoursToDeduct,
    formatString = 'MM/dd h aaaa'
  }: {
    date: Date
    hoursToDeduct: number
    formatString?: string
  }) => {
    const newDate = subHours(date, hoursToDeduct)
    return format(newDate, formatString)
  }

  const xCategories = listing.priceTimeData.map(
    (_: number, hoursToDeduct: number, arr: Array<number>) =>
      makeTimeString({
        date: now,
        hoursToDeduct: arr.length - hoursToDeduct
      })
  )

  if (shouldShowButton) {
    if (
      listing.priceTimeData.length > 0 &&
      listing.quantityTimeData.length > 0
    ) {
      return (
        <div className="text-center my-8">
          <button
            onClick={loadCharts}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Load Charts
          </button>
        </div>
      )
    }
    return null
  }

  if (!shouldLoadCharts) {
    return null
  }

  if (
    listing.priceTimeData.length === 0 &&
    listing.quantityTimeData.length === 0
  ) {
    return null
  }

  const Highcharts = require('highcharts')
  const HighchartsReact = require('highcharts-react-official').default

  const GenericLineChart = ({
    darkMode,
    data,
    chartTitle,
    xTitle,
    yTitle,
    xLabelFormat,
    yLabelFormat,
    dataIterator,
    xCategories
  }: {
    darkMode: boolean
    data: Array<number>
    chartTitle?: string
    xTitle?: string
    yTitle?: string
    xLabelFormat?: string
    yLabelFormat?: string
    dataIterator?: (value: number, index: number) => any
    xCategories?: Array<string>
  }) => {
    const styles = darkMode
      ? {
          backgroundColor: '#334155',
          color: 'white',
          hoverColor: '#f8f8f8'
        }
      : {}
    const options: any = {
      chart: {
        type: 'line',
        backgroundColor: styles?.backgroundColor
      },
      legend: {
        itemStyle: { color: styles?.color },
        align: 'center',
        itemHoverStyle: { color: styles?.hoverColor }
      },
      title: {
        text: chartTitle,
        style: { color: styles?.color }
      },
      yAxis: {
        title: {
          text: yTitle,
          style: {
            color: styles?.color,
            textAlign: 'center'
          }
        },
        labels: {
          style: { color: styles?.color },
          align: 'center',
          format: yLabelFormat
        },
        lineColor: styles?.color
      },
      xAxis: {
        title: {
          text: xTitle,
          style: {
            color: styles?.color,
            textAlign: 'center'
          }
        },
        categories: xCategories,
        labels: {
          style: { color: styles?.color },
          align: 'right',
          format: xLabelFormat
        },
        lineColor: styles?.color
      },
      series: [
        {
          data: dataIterator ? data.map(dataIterator) : data,
          name: chartTitle,
          type: 'line'
        }
      ],
      credits: {
        enabled: false
      }
    }
    return <HighchartsReact highcharts={Highcharts} options={options} />
  }

  return (
    <>
      {listing.priceTimeData.length > 0 && (
        <ContentContainer>
          <GenericLineChart
            chartTitle="Price Over Time"
            darkMode={darkmode}
            data={listing.priceTimeData}
            dataIterator={(val: number, ind: number) => [
              makeTimeString({
                date: now,
                hoursToDeduct: listing.priceTimeData.length - ind
              }),
              val
            ]}
            xCategories={xCategories}
          />
        </ContentContainer>
      )}
      {listing.quantityTimeData.length > 0 && (
        <ContentContainer>
          <GenericLineChart
            chartTitle="Quantity Over Time"
            darkMode={darkmode}
            data={listing.quantityTimeData}
            dataIterator={(val: number, ind: number) => [
              makeTimeString({
                date: now,
                hoursToDeduct: listing.quantityTimeData.length - ind
              }),
              val
            ]}
            xCategories={xCategories}
          />
        </ContentContainer>
      )}
    </>
  )
}

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

  const parsedItemId = parseInt(itemId, 10)
  if (Number.isNaN(parsedItemId)) return { exception: 'Invalid item' }

  const session = await getUserSessionData(request)
  let { region, faction, ruleset } = session.getWoWForeverSessionData()

  const url = new URL(request.url)
  const regionFromUrl = regionFromSearchParam(url.searchParams.get('region'))
  const auctionHouseIdRaw = url.searchParams.get('auctionHouseId')
  const parsedAuctionHouseId =
    auctionHouseIdRaw != null && auctionHouseIdRaw !== ''
      ? parseInt(auctionHouseIdRaw, 10)
      : NaN
  const hasAuctionHouseId = !Number.isNaN(parsedAuctionHouseId)

  if (regionFromUrl) {
    region = regionFromUrl
  }

  let auctionHouseId = hasAuctionHouseId
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

export default function Index() {
  const result = useLoaderData<ResponseType>()
  const { darkmode } = useTypedSelector((state) => state.user)

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
    const now = new Date()
    const canonicalUrl = `https://saddlebagexchange.com/wow-forever/item-data/${listing.itemID}`
    const houseLabel =
      listing.auctionHouseName ||
      foreverAuctionHouseLabel(listing.auctionHouseId)
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
        <Title title={listing.itemName} />
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-2">
          WoW Forever · {listing.faction} · {houseLabel}
        </p>
        {listing.blog ? (
          <p style={{ fontSize: '1px' }}>{listing.blog}</p>
        ) : null}
        <Banner />
        <div className="flex flex-col justify-around mx-3 my-6 md:flex-row">
          <div className="flex flex-col max-w-full">
            {listing.minPrice !== -1 && (
              <Differences
                diffTitle="Minimum Price"
                diffAmount={listing.minPrice.toLocaleString()}
                className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
              />
            )}
            {listing.historicPrice !== -1 && (
              <Differences
                diffTitle="Historic Price"
                diffAmount={listing.historicPrice.toLocaleString()}
                className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
              />
            )}
          </div>
          <div className="flex flex-col max-w-full">
            {listing.currentMarketValue !== -1 && (
              <Differences
                diffTitle="Current Market Value"
                diffAmount={listing.currentMarketValue.toLocaleString()}
                className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
              />
            )}
            {listing.historicMarketValue !== -1 && (
              <Differences
                diffTitle="Historic Market Value"
                diffAmount={listing.historicMarketValue.toLocaleString()}
                className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
              />
            )}
          </div>
          <div className="flex flex-col max-w-full">
            {listing.salesPerDay !== -1 && (
              <Differences
                diffTitle="Sales Per Day"
                diffAmount={listing.salesPerDay.toLocaleString()}
                className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
              />
            )}
            {listing.percentChange !== -1 && (
              <Differences
                diffTitle="Percent Change"
                diffAmount={listing.percentChange.toLocaleString() + '%'}
                className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
              />
            )}
          </div>
          <div className="flex flex-col max-w-full">
            {listing.currentQuantity !== 1 && (
              <Differences
                diffTitle="Current Quantity"
                diffAmount={listing.currentQuantity.toLocaleString()}
                className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
              />
            )}
            {listing.avgQuantity !== -1 && (
              <Differences
                diffTitle="Average Quantity"
                diffAmount={listing.avgQuantity.toLocaleString()}
                className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
              />
            )}
            {listing.currentVsAvgQuantityPercent !== 100 && (
              <Differences
                diffTitle="Avg v Current Quantity"
                diffAmount={
                  listing.currentVsAvgQuantityPercent.toLocaleString() + '%'
                }
                className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col justify-around mx-3 my-6 md:flex-row">
          <div className="flex flex-wrap gap-2">
            <CustomButton
              link={`https://saddlebagexchange.com/wow-forever/`}
              buttonText="View all Forever tools"
            />
            <CustomButton
              link={`https://saddlebagexchange.com/options`}
              buttonText="Change Forever home AH"
            />
            <CustomButton
              link={`https://www.wowhead.com/item=${listing.itemID}`}
              buttonText="View on WoWHead"
            />
          </div>
        </div>

        <LazyCharts listing={listing} darkmode={darkmode} now={now} />

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

  return <NoResults />
}

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
