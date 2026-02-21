import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import type { ItemListingResponse } from '~/requests/WoW/ItemListingsData'
import ItemListingsData from '~/requests/WoW/ItemListingsData'
import { Differences } from '~/components/FFXIVResults/listings/Differences'
import { getUserSessionData } from '~/sessions'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { format, subHours } from 'date-fns'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import CustomButton from '~/components/utilities/CustomButton'
import Banner from '~/components/Common/Banner'
import { useState, useEffect } from 'react'
import type { ColumnList } from '~/components/types'

// Lazy load Highcharts component
const LazyCharts = ({
  listing,
  darkmode,
  now
}: {
  listing: any
  darkmode: boolean
  now: Date
}) => {
  const [chartsLoaded, setChartsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is typical mobile breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const loadCharts = () => {
    setChartsLoaded(true)
  }

  // Auto-load charts on desktop, require button click on mobile
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
    (_: any, hoursToDeduct: number, arr: any[]) =>
      makeTimeString({
        date: now,
        hoursToDeduct: arr.length - hoursToDeduct
      })
  )

  if (shouldShowButton) {
    // Only show button if there's chart data to display
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
    // If no chart data, don't show anything
    return null
  }

  if (!shouldLoadCharts) {
    return null
  }

  // Only import Highcharts when charts are requested
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

export const meta: MetaFunction = ({ data }) => {
  if ('exception' in data) {
    return [
      { charset: 'utf-8' },
      { title: 'Error' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      { name: 'description', content: `Error: ${data.exception}` }
    ]
  } else {
    const canonicalUrl = `https://saddlebagexchange.com/wow/item-data/${data.data.itemID}`
    const description = `${data.data.itemName} World of Warcraft Auctionhouse TSM (Trade Skill Master) Gold Statistics`
    const title = `${data.data.itemName} – WoW Auction House Price & Market Data`
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
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }
}

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
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: listing.itemName,
      description: `${listing.itemName} World of Warcraft Auctionhouse TSM (Trade Skill Master) Gold Statistics`,
      url: `https://saddlebagexchange.com/wow/item-data/${listing.itemID}`
    }
    const jsonLdString = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    return (
      <PageWrapper>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
        <Title title={listing.itemName} />
        <p style={{ fontSize: '1px' }}>{listing.blog}</p>
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
              link={`https://saddlebagexchange.com/wow/export-search?itemId=${listing.itemID}&minPrice=1`}
              buttonText="Best Place to Sell!"
            />
            <CustomButton
              link={`https://saddlebagexchange.com/wow/`}
              buttonText="View all our tools here!"
            />
            <CustomButton
              link={`https://www.wowhead.com/item=${listing.itemID}`}
              buttonText="View on WoWHead"
            />
            <CustomButton
              link={`${listing.link}`}
              buttonText="View on Undermine Exchange"
            />
          </div>
        </div>

        {/* Lazy loaded charts */}
        <LazyCharts listing={listing} darkmode={darkmode} now={now} />

        {/* Auctionhouse Listings Table or Out of Stock */}
        {listing.listingData.length === 0 ? (
          <div className="my-8 text-center text-xl font-bold text-red-700 dark:text-red-300">
            Out of Stock on Selected Realm
          </div>
        ) : (
          <SmallTable
            title={`${listing.itemName} : Auctionhouse Listings`}
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
}

// Define the ListItem type for the table
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
