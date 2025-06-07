import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/cloudflare'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import type { ItemListingResponse } from '~/requests/WoW/ItemListingsData'
import ItemListingsData from '~/requests/WoW/ItemListingsData'
import { Differences } from '~/components/FFXIVResults/listings/Differences'
import { getUserSessionData } from '~/sessions'
import type { Options, PointOptionsObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { format, subHours } from 'date-fns'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import CustomButton from '~/components/utilities/CustomButton'
import Banner from '~/components/Common/Banner'
import { useState, useEffect, useMemo, memo, Suspense } from 'react'
import { Transition } from '@headlessui/react'

// Loading skeleton component
const LoadingSkeleton = () => (
  <PageWrapper>
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
        ))}
      </div>
      <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
      <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
    </div>
  </PageWrapper>
)

// Chart error boundary to catch rendering issues
const ChartErrorBoundary = ({ children, fallback }) => {
  try {
    return <>{children}</>
  } catch (err) {
    console.error('Chart rendering error:', err)
    return (
      fallback || (
        <div className="h-64 bg-red-50 dark:bg-red-900/20 rounded flex items-center justify-center">
          <span className="text-red-600 dark:text-red-400">
            Chart failed to load. Please refresh the page.
          </span>
        </div>
      )
    )
  }
}

export const ErrorBoundary = () => <ErrorBounds />

const makeTimeString = ({
  date,
  hoursToDeduct,
  formatString = 'dd/MM h aaaa'
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
    return {
      charset: 'utf-8',
      viewport: 'width=device-width,initial-scale=1',
      title: 'Error',
      description: `Error: ${data.exception}`
    }
  }
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: data.data.itemName,
    description: `TSM (Trade Skill Master) statistics for ${data.data.itemName}`,
    links: [
      {
        rel: 'canonical',
        href: `https://saddlebagexchange.com/wow/item-data/${data.data.itemID}`
      }
    ]
  }
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const itemId = params.itemId
  if (!itemId) {
    return { exception: 'No item found, please try again' }
  }
  const parsedItemId = parseInt(itemId)
  if (isNaN(parsedItemId)) {
    return { exception: 'Invalid item' }
  }

  const session = await getUserSessionData(request)
  const { server, region } = session.getWoWSessionData()

  try {
    // Add cache headers for better performance
    const headers = {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
    }
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 s

    // Call ItemListingsData with abort signal
    const response = await ItemListingsData(
      { homeRealmId: server.id, region, itemID: parsedItemId },
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    const data = await response.json()
    return json(data, { headers })
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { exception: 'Request timeout - please try again' }
    }
    return { exception: 'Failed to load item data - please try again' }
  }
}

type ResponseType = ItemListingResponse | { exception: string }

export default function Index() {
  const result = useLoaderData<ResponseType>()
  const { darkmode } = useTypedSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setIsLoading(false)
    setTimeout(() => setShowContent(true), 100)
  }, [result])

  const error = result && 'exception' in result ? result.exception : undefined

  if (isLoading) {
    return <LoadingSkeleton />
  }

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
    const xCategories = useMemo(
      () =>
        listing.priceTimeData.map((_, idx, arr) =>
          makeTimeString({ date: now, hoursToDeduct: arr.length - idx })
        ),
      [listing.priceTimeData]
    )

    return (
      <Transition
        show={showContent}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <PageWrapper>
          <Banner />
          <Title title={listing.itemName} />
          <p style={{ fontSize: '1px' }}>{listing.blog}</p>
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
                  diffAmount={listing.currentVsAvgQuantityPercent.toLocaleString() + '%'}
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
                rel="noopener noreferrer nofollow"
              />
              <CustomButton
                link={`https://saddlebagexchange.com/wow/`}
                buttonText="View all our tools here!"
                rel="nofollow"
              />
              <CustomButton
                link={`https://www.wowhead.com/item=${listing.itemID}`}
                buttonText="View on WoWHead"
                rel="noopener noreferrer nofollow"
              />
              <CustomButton
                link={`${listing.link}`}
                buttonText="View on Undermine Exchange"
                rel="noopener noreferrer nofollow"
              />
            </div>
          </div>
          {listing.priceTimeData.length > 0 && (
            <ContentContainer>
              <div className="min-h-[300px]">
                <Suspense fallback={<LoadingSkeleton />}>
                  <ChartErrorBoundary>
                    <GenericLineChart
                      chartTitle="Price Over Time"
                      darkMode={darkmode}
                      data={listing.priceTimeData}
                      dataIterator={(val, ind) => [
                        makeTimeString({
                          date: now,
                          hoursToDeduct: listing.priceTimeData.length - ind
                        }),
                        val
                      ]}
                      xCategories={xCategories}
                    />
                  </ChartErrorBoundary>
                </Suspense>
              </div>
            </ContentContainer>
          )}
          {listing.quantityTimeData.length > 0 && (
            <ContentContainer>
              <div className="min-h-[300px]">
                <Suspense fallback={<LoadingSkeleton />}>
                  <ChartErrorBoundary>
                    <GenericLineChart
                      chartTitle="Quantity Over Time"
                      darkMode={darkmode}
                      data={listing.quantityTimeData}
                      dataIterator={(val, ind) => [
                        makeTimeString({
                          date: now,
                          hoursToDeduct: listing.quantityTimeData.length - ind
                        }),
                        val
                      ]}
                      xCategories={xCategories}
                    />
                  </ChartErrorBoundary>
                </Suspense>
              </div>
            </ContentContainer>
          )}
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
      </Transition>
    )
  }

  return null
}

export const GenericLineChart = memo(({
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
  dataIterator?: (value: number, index: number) => PointOptionsObject
  xCategories?: Array<string>
}) => {
  const styles = useMemo(
    () =>
      darkMode
        ? { backgroundColor: '#334155', color: 'white', hoverColor: '#f8f8f8' }
        : {},
    [darkMode]
  )
  const options: Options = useMemo(
    () => ({
      chart: { type: 'line', backgroundColor: styles.backgroundColor },
      legend: {
        itemStyle: { color: styles.color },
        align: 'center',
        itemHoverStyle: { color: styles.hoverColor }
      },
      title: { text: chartTitle, style: { color: styles.color } },
      yAxis: {
        title: { text: yTitle, style: { color: styles.color, textAlign: 'center' } },
        labels: { style: { color: styles.color }, align: 'center', format: yLabelFormat },
        lineColor: styles.color
      },
      xAxis: {
        title: { text: xTitle, style: { color: styles.color, textAlign: 'center' } },
        categories: xCategories,
        labels: { style: { color: styles.color }, align: 'right', format: xLabelFormat },
        lineColor: styles.color
      },
      series: [
        {
          data: dataIterator ? data.map<PointOptionsObject>(dataIterator) : data,
          name: chartTitle,
          type: 'line'
        }
      ],
      credits: { enabled: false }
    }),
    [styles, chartTitle, xTitle, yTitle, xLabelFormat, yLabelFormat, data, dataIterator, xCategories]
  )
  return <HighchartsReact highcharts={Highcharts} options={options} />
})

const columnList: Array<ColumnList<ListItem>> = [
  { columnId: 'price', header: 'Price' },
  { columnId: 'quantity', header: 'Quantity' }
]

const mobileColumnList: Array<ColumnList<ListItem>> = [
  { columnId: 'price', header: 'Price' },
  { columnId: 'quantity', header: 'Quantity' }
]