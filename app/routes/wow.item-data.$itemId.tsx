import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import type { ItemListingResponse } from '~/requests/WoW/ItemListingsData'
import ItemListingsData from '~/requests/WoW/ItemListingsData'
import { Differences } from '~/components/FFXIVResults/listings/Differences'
import { getUserSessionData } from '~/sessions'
import React, { Suspense, lazy } from 'react'
import type { ColumnList } from '~/components/types'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { format, subHours } from 'date-fns'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import CustomButton from '~/components/utilities/CustomButton'
import Banner from '~/components/Common/Banner'

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
  } else {
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
    const xCategories = listing.priceTimeData.map((_, hoursToDeduct, arr) =>
      makeTimeString({
        date: now,
        hoursToDeduct: arr.length - hoursToDeduct
      })
    )
    return (
      <PageWrapper>
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
              // link={`https://saddlebagexchange.com/wow/export-search`} // remove custom id as it might be slowing down the crawl
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
        {listing.priceTimeData.length > 0 && (
          <ContentContainer>
            <Suspense
              fallback={
                <div className="h-64 w-full flex items-center justify-center">
                  <span className="animate-pulse text-gray-500 dark:text-gray-300">
                    Loading chart...
                  </span>
                </div>
              }>
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
            </Suspense>
          </ContentContainer>
        )}
        {listing.quantityTimeData.length > 0 && (
          <ContentContainer>
            <Suspense
              fallback={
                <div className="h-64 w-full flex items-center justify-center">
                  <span className="animate-pulse text-gray-500 dark:text-gray-300">
                    Loading chart...
                  </span>
                </div>
              }>
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
            </Suspense>
          </ContentContainer>
        )}
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

// Dynamically import chart component (code-split)
const GenericLineChart = lazy(() => import('~/components/Charts/LazyLineChart'))

type ListItem = Record<string, any>

const columnList: Array<ColumnList<ListItem>> = [
  { columnId: 'price', header: 'Price' },
  { columnId: 'quantity', header: 'Quantity' }
]

const mobileColumnList: Array<ColumnList<ListItem>> = [
  { columnId: 'price', header: 'Price' },
  { columnId: 'quantity', header: 'Quantity' }
]
