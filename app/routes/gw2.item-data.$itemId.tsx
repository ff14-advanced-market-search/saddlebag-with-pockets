import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import type { ItemListingResponse } from '~/requests/GW2/ItemListingsData'
import ItemListingsData from '~/requests/GW2/ItemListingsData'
import { Differences } from '~/components/FFXIVResults/listings/Differences'
import { useTypedSelector } from '~/redux/useTypedSelector'
import Banner from '~/components/Common/Banner'
import { useState, useEffect } from 'react'
import type { ColumnList } from '~/components/types'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import { format } from 'date-fns'

// Lazy load Highcharts component
const LazyCharts = ({
  timeData,
  darkmode
}: {
  timeData: any[]
  darkmode: boolean
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

  if (shouldShowButton) {
    if (timeData.length > 0) {
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

  const Highcharts = require('highcharts')
  const HighchartsReact = require('highcharts-react-official').default

  const PriceQuantityChart = ({
    darkMode,
    timeData,
    chartTitle,
    priceKey,
    quantityKey
  }: {
    darkMode: boolean
    timeData: any[]
    chartTitle: string
    priceKey: 'buy_price_avg' | 'sell_price_avg'
    quantityKey: 'buy_quantity_avg' | 'sell_quantity_avg'
  }) => {
    const styles = darkMode
      ? {
          backgroundColor: '#334155',
          color: 'white',
          hoverColor: '#f8f8f8'
        }
      : {}

    const priceData = timeData.map((d) => d[priceKey])
    const quantityData = timeData.map((d) => d[quantityKey])
    const xCategories = timeData.map((d) =>
      format(new Date(d.date), 'MM/dd HH:mm')
    )

    const options: any = {
      chart: {
        type: 'line',
        backgroundColor: styles?.backgroundColor,
        height: 400
      },
      legend: {
        itemStyle: { color: styles?.color },
        align: 'center',
        itemHoverStyle: { color: styles?.hoverColor }
      },
      title: {
        text: chartTitle,
        style: { color: styles?.color },
        margin: 20
      },
      yAxis: [
        {
          title: {
            text: 'Price',
            style: { color: styles?.color }
          },
          labels: { style: { color: styles?.color } },
          lineColor: styles?.color,
          min: 0,
          softMax: Math.max(...priceData.filter((v) => v > 0)) * 1.1,
          startOnTick: false,
          endOnTick: false
        },
        {
          title: {
            text: 'Quantity',
            style: { color: styles?.color }
          },
          labels: { style: { color: styles?.color } },
          lineColor: styles?.color,
          opposite: true,
          min: 0,
          softMax: Math.max(...quantityData.filter((v) => v > 0)) * 1.1,
          startOnTick: false,
          endOnTick: false
        }
      ],
      xAxis: {
        categories: xCategories,
        labels: {
          style: { color: styles?.color },
          rotation: -45
        },
        lineColor: styles?.color
      },
      tooltip: {
        formatter: function () {
          const point = this.point
          const index = point.index || 0
          const dataPoint = timeData[index]
          return `${format(new Date(dataPoint.date), 'MM/dd/yyyy HH:mm')}<br/>${
            point.series.name
          }: ${point.y?.toLocaleString()}`
        }
      },
      series: [
        {
          name: 'Price',
          type: 'area',
          data: priceData,
          color: darkMode ? '#93c5fd' : '#dae4ff',
          fillOpacity: 0.3,
          yAxis: 0,
          connectNulls: true
        },
        {
          name: 'Quantity',
          type: 'line',
          data: quantityData,
          color: darkMode ? '#fca5a5' : '#fbb7b2',
          yAxis: 1,
          connectNulls: true
        }
      ],
      credits: {
        enabled: false
      }
    }

    return <HighchartsReact highcharts={Highcharts} options={options} />
  }

  if (timeData.length === 0) {
    return null
  }

  return (
    <>
      <ContentContainer>
        <PriceQuantityChart
          chartTitle="Buy Orders - Price vs Quantity"
          darkMode={darkmode}
          timeData={timeData}
          priceKey="buy_price_avg"
          quantityKey="buy_quantity_avg"
        />
      </ContentContainer>
      <ContentContainer>
        <PriceQuantityChart
          chartTitle="Sell Orders - Price vs Quantity"
          darkMode={darkmode}
          timeData={timeData}
          priceKey="sell_price_avg"
          quantityKey="sell_quantity_avg"
        />
      </ContentContainer>
    </>
  )
}

export const ErrorBoundary = () => <ErrorBounds />

export const meta: MetaFunction<typeof loader> = ({ data }) => {
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
      description: `Guild Wars 2 trading post data for ${data.data.itemName}`,
      links: [
        {
          rel: 'canonical',
          href: `https://saddlebagexchange.com/gw2/item-data/${data.data.itemID}`
        }
      ]
    }
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const itemId = params.itemId
  if (!itemId) {
    return json({ exception: 'No item found, please try again' })
  }

  const parsedItemId = parseInt(itemId)
  if (isNaN(parsedItemId)) {
    return json({ exception: 'Invalid item' })
  }

  try {
    const response = await ItemListingsData({
      itemID: parsedItemId
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    if ('exception' in data) {
      return json({ exception: data.exception })
    }
    return json(data)
  } catch (error) {
    return json({
      exception:
        error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}

type ResponseType = ItemListingResponse | { exception: string }

type BuyOrderItem = {
  unit_price: number
  quantity: number
}

type SellOrderItem = {
  unit_price: number
  quantity: number
}

const buyColumnList: Array<ColumnList<BuyOrderItem>> = [
  {
    columnId: 'unit_price',
    header: 'Price',
    accessor: ({ row }) => (
      <span>
        {row.unit_price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4
        })}
      </span>
    )
  },
  { columnId: 'quantity', header: 'Quantity' }
]

const sellColumnList: Array<ColumnList<SellOrderItem>> = [
  {
    columnId: 'unit_price',
    header: 'Price',
    accessor: ({ row }) => (
      <span>
        {row.unit_price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4
        })}
      </span>
    )
  },
  { columnId: 'quantity', header: 'Quantity' }
]

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
    return (
      <PageWrapper>
        <Title title={listing.itemName} />
        <p style={{ fontSize: '1px' }}>{listing.blog}</p>
        <Banner />
        <div className="flex flex-col justify-around mx-3 my-6 md:flex-row">
          <div className="flex flex-col max-w-full">
            <Differences
              diffTitle="Average Price"
              diffAmount={listing.price_average.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })}
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
            <Differences
              diffTitle="Total Sold"
              diffAmount={listing.sold.toLocaleString()}
              className="bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100"
            />
          </div>
          <div className="flex flex-col max-w-full">
            <Differences
              diffTitle="Sell Price Avg"
              diffAmount={listing.sell_price_avg.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })}
              className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
            />
            <Differences
              diffTitle="Sell Orders Sold"
              diffAmount={listing.sell_sold.toLocaleString()}
              className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
            />
            <Differences
              diffTitle="Sell Value"
              diffAmount={listing.sell_value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
            />
          </div>
          <div className="flex flex-col max-w-full">
            <Differences
              diffTitle="Buy Price Avg"
              diffAmount={listing.buy_price_avg.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })}
              className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
            />
            <Differences
              diffTitle="Buy Orders Sold"
              diffAmount={listing.buy_sold.toLocaleString()}
              className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
            />
            <Differences
              diffTitle="Buy Value"
              diffAmount={listing.buy_value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Lazy loaded charts */}
        <LazyCharts timeData={listing.timeData} darkmode={darkmode} />

        {/* Buy Orders Table */}
        {listing.buys.length === 0 ? (
          <div className="my-8 text-center text-xl font-bold text-red-700 dark:text-red-300">
            No Buy Orders Available
          </div>
        ) : (
          <SmallTable
            title={`${listing.itemName} : Buy Orders`}
            sortingOrder={[{ desc: true, id: 'unit_price' }]}
            columnList={buyColumnList}
            mobileColumnList={buyColumnList}
            columnSelectOptions={['unit_price', 'quantity']}
            data={listing.buys}
          />
        )}

        {/* Sell Orders Table */}
        {listing.sells.length === 0 ? (
          <div className="my-8 text-center text-xl font-bold text-red-700 dark:text-red-300">
            No Sell Orders Available
          </div>
        ) : (
          <SmallTable
            title={`${listing.itemName} : Sell Orders`}
            sortingOrder={[{ desc: false, id: 'unit_price' }]}
            columnList={sellColumnList}
            mobileColumnList={sellColumnList}
            columnSelectOptions={['unit_price', 'quantity']}
            data={listing.sells}
          />
        )}
      </PageWrapper>
    )
  }

  return <NoResults />
}
