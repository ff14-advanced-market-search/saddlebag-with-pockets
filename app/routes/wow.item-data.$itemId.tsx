import type { LoaderFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
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

export const meta: MetaFunction = ({ data }: MetaArgs) => {
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
      title: data.data.itemName, // Adjust according to your needs
      description: `TSM (Trade Skill Master) statistics for ${data.data.itemName}` // Adjust this too
    }
  }
}

// // THIS ISNT WORKING!!!
// export const links: LinksFunction = async ({ params, request }) => {
//   const itemId = request.params.itemId;
//   return [
//     { rel: 'canonical', href: `https://saddlebagexchange.com/wow/item-data/${itemId}` }
//   ];
// }

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
        <div className="flex flex-col justify-around mx-3 my-6 md:flex-row">
          <div className="flex flex-col max-w-full">
            <Differences
              diffTitle="Minimum Price"
              diffAmount={listing.minPrice.toLocaleString()}
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
            <Differences
              diffTitle="Historic Price"
              diffAmount={listing.historicPrice.toLocaleString()}
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
          </div>
          <div className="flex flex-col max-w-full">
            <Differences
              diffTitle="Current Market Value"
              diffAmount={listing.currentMarketValue.toLocaleString()}
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
            <Differences
              diffTitle="Historic Market Value"
              diffAmount={listing.historicMarketValue.toLocaleString()}
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
          </div>
          <div className="flex flex-col max-w-full">
            <Differences
              diffTitle="Sales Per Day"
              diffAmount={listing.salesPerDay.toLocaleString()}
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
            <Differences
              diffTitle="Percent Change"
              diffAmount={listing.percentChange.toLocaleString() + '%'}
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
          </div>
          <div className="flex flex-col max-w-full">
            <Differences
              diffTitle="Current Quantity"
              diffAmount={listing.currentQuantity.toLocaleString()}
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
            <Differences
              diffTitle="Average Quantity"
              diffAmount={listing.avgQuantity.toLocaleString()}
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
            <Differences
              diffTitle="Avg v Current Quantity"
              diffAmount={
                listing.currentVsAvgQuantityPercent.toLocaleString() + '%'
              }
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
          </div>
        </div>
        {listing.priceTimeData.length > 0 && (
          <ContentContainer>
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
          </ContentContainer>
        )}
        {listing.quantityTimeData.length > 0 && (
          <ContentContainer>
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
          </ContentContainer>
        )}
      </PageWrapper>
    )
  }
}

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
  dataIterator?: (value: number, index: number) => PointOptionsObject
  xCategories?: Array<string>
}) => {
  const styles = darkMode
    ? {
        backgroundColor: '#334155',
        color: 'white',
        hoverColor: '#f8f8f8'
      }
    : {}
  const options: Options = {
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
        data: dataIterator ? data.map<PointOptionsObject>(dataIterator) : data,
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
