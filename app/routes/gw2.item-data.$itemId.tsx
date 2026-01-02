import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import type {
  ItemListingResponse,
  TimeDataPoint
} from '~/requests/GW2/ItemListingsData'
import ItemListingsData from '~/requests/GW2/ItemListingsData'
import { Differences } from '~/components/FFXIVResults/listings/Differences'
import { useTypedSelector } from '~/redux/useTypedSelector'
import Banner from '~/components/Common/Banner'
import { useState, useEffect } from 'react'
import type { ColumnList } from '~/components/types'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import { format } from 'date-fns'

// GW2 Price and Volume Chart Component
const GW2PriceVolumeChart = ({
  timeData,
  darkmode,
  itemName
}: {
  timeData: TimeDataPoint[]
  darkmode: boolean
  itemName: string
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

  if (!shouldLoadCharts || timeData.length === 0) {
    return null
  }

  const Highcharts = require('highcharts')
  const HighchartsReact = require('highcharts-react-official').default

  const styles = darkmode
    ? {
        backgroundColor: '#334155',
        color: '#f3f4f6',
        hoverColor: '#f8f8f8',
        gridLineColor: '#4a5568',
        labelColor: '#9ca3af'
      }
    : {
        backgroundColor: '#ffffff',
        color: '#000000',
        hoverColor: '#666666',
        gridLineColor: '#e2e8f0',
        labelColor: '#666666'
      }

  const xCategories = timeData.map((d) =>
    format(new Date(d.date), 'MM/dd HH:mm')
  )

  const maxPrice = Math.max(
    ...timeData.map((d) => Math.max(d.sell_price_avg, d.buy_price_avg))
  )
  const maxQuantity = Math.max(
    ...timeData.map((d) => Math.max(d.sell_quantity_avg, d.buy_quantity_avg))
  )

  const options: any = {
    chart: {
      type: 'line',
      backgroundColor: styles.backgroundColor,
      height: 400,
      zoomType: 'x'
    },
    title: {
      text: `${itemName} - Price vs Volume`,
      style: { color: styles.color }
    },
    legend: {
      itemStyle: { color: styles.color },
      align: 'center',
      itemHoverStyle: { color: styles.hoverColor },
      layout: 'horizontal',
      verticalAlign: 'bottom'
    },
    xAxis: {
      categories: xCategories,
      labels: {
        style: { color: styles.labelColor },
        rotation: -45
      },
      lineColor: styles.labelColor,
      gridLineColor: styles.gridLineColor
    },
    yAxis: [
      {
        title: {
          text: 'Price',
          style: { color: styles.color }
        },
        labels: {
          style: { color: styles.labelColor },
          formatter: function (this: { value: number }) {
            return this.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4
            })
          }
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        min: 0,
        softMax: maxPrice * 1.1 || 1
      },
      {
        title: {
          text: 'Volume',
          style: { color: styles.color }
        },
        labels: {
          style: { color: styles.labelColor },
          formatter: function (this: { value: number }) {
            return this.value.toLocaleString()
          }
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        opposite: true,
        min: 0,
        softMax: maxQuantity * 1.1 || 1
      }
    ],
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: darkmode ? '#1f2937' : '#ffffff',
      style: {
        color: darkmode ? '#f3f4f6' : '#000000'
      },
      formatter: function (this: any) {
        const points = this.points || []
        if (points.length === 0) return ''
        const point = points[0]
        const index = point.point.index || 0
        const dataPoint = timeData[index]
        const labelColor = styles.labelColor

        return `<div style="min-width: 200px; color: ${styles.color};">
          <b>${format(new Date(dataPoint.date), 'MM/dd/yyyy HH:mm')}</b><br/>
          <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
          <b style="color: ${
            darkmode ? '#10b981' : '#059669'
          };">Sell:</b> ${dataPoint.sell_price_avg.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4
        })} (${dataPoint.sell_quantity_avg.toLocaleString()})<br/>
          <b style="color: ${
            darkmode ? '#f59e0b' : '#d97706'
          };">Buy:</b> ${dataPoint.buy_price_avg.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4
        })} (${dataPoint.buy_quantity_avg.toLocaleString()})<br/>
          <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
          <b style="color: ${
            darkmode ? '#7c3aed' : '#6d28d9'
          };">Supply:</b> ${dataPoint.sell_quantity_avg.toLocaleString()}<br/>
          <b style="color: ${
            darkmode ? '#dc2626' : '#b91c1c'
          };">Demand:</b> ${dataPoint.buy_quantity_avg.toLocaleString()}
        </div>`
      }
    },
    series: [
      {
        name: 'Sell',
        type: 'line',
        data: timeData.map((d) => d.sell_price_avg),
        color: darkmode ? '#10b981' : '#059669', // Darker green
        yAxis: 0,
        lineWidth: 2,
        marker: { radius: 3 }
        // Solid line (default)
      },
      {
        name: 'Buy',
        type: 'line',
        data: timeData.map((d) => d.buy_price_avg),
        color: darkmode ? '#f59e0b' : '#d97706', // Darker orange
        yAxis: 0,
        lineWidth: 2,
        marker: { radius: 3 }
        // Solid line (removed dashStyle)
      },
      {
        name: 'Supply',
        type: 'line',
        data: timeData.map((d) => d.sell_quantity_avg),
        color: darkmode ? '#7c3aed' : '#6d28d9', // Darker purple
        yAxis: 1,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dot' // Dotted line
      },
      {
        name: 'Demand',
        type: 'line',
        data: timeData.map((d) => d.buy_quantity_avg),
        color: darkmode ? '#dc2626' : '#b91c1c', // Darker red
        yAxis: 1,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dash'
      }
    ],
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        connectNulls: true
      }
    }
  }

  return (
    <ContentContainer>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ContentContainer>
  )
}

// GW2 Value Chart Component
const GW2ValueChart = ({
  timeData,
  darkmode,
  itemName
}: {
  timeData: TimeDataPoint[]
  darkmode: boolean
  itemName: string
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
      return null // Only show button once for all charts
    }
    return null
  }

  if (!shouldLoadCharts || timeData.length === 0) {
    return null
  }

  const Highcharts = require('highcharts')
  const HighchartsReact = require('highcharts-react-official').default

  const styles = darkmode
    ? {
        backgroundColor: '#334155',
        color: '#f3f4f6',
        hoverColor: '#f8f8f8',
        gridLineColor: '#4a5568',
        labelColor: '#9ca3af'
      }
    : {
        backgroundColor: '#ffffff',
        color: '#000000',
        hoverColor: '#666666',
        gridLineColor: '#e2e8f0',
        labelColor: '#666666'
      }

  const xCategories = timeData.map((d) =>
    format(new Date(d.date), 'MM/dd HH:mm')
  )

  const maxValue = Math.max(
    ...timeData.map((d) => Math.max(d.sell_value, d.buy_value))
  )
  const maxQuantity = Math.max(
    ...timeData.map((d) => Math.max(d.sell_quantity_avg, d.buy_quantity_avg))
  )

  const options: any = {
    chart: {
      type: 'area',
      backgroundColor: styles.backgroundColor,
      height: 300,
      zoomType: 'x'
    },
    title: {
      text: `${itemName} - Buy Value and Sell Value`,
      style: { color: styles.color }
    },
    legend: {
      itemStyle: { color: styles.color },
      align: 'center',
      itemHoverStyle: { color: styles.hoverColor },
      layout: 'horizontal',
      verticalAlign: 'bottom'
    },
    xAxis: {
      categories: xCategories,
      labels: {
        style: { color: styles.labelColor },
        rotation: -45
      },
      lineColor: styles.labelColor,
      gridLineColor: styles.gridLineColor
    },
    yAxis: [
      {
        title: {
          text: 'Value',
          style: { color: styles.color }
        },
        labels: {
          style: { color: styles.labelColor },
          formatter: function (this: { value: number }) {
            return this.value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
          }
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        min: 0,
        softMax: maxValue * 1.1 || 1,
        opposite: false
      },
      {
        title: {
          text: 'Volume',
          style: { color: styles.color }
        },
        labels: {
          style: { color: styles.labelColor },
          formatter: function (this: { value: number }) {
            return this.value.toLocaleString()
          }
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        min: 0,
        softMax: maxQuantity * 1.1 || 1,
        opposite: true
      }
    ],
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: darkmode ? '#1f2937' : '#ffffff',
      style: {
        color: darkmode ? '#f3f4f6' : '#000000'
      },
      formatter: function (this: any) {
        const points = this.points || []
        if (points.length === 0) return ''
        const point = points[0]
        const index = point.point.index || 0
        const dataPoint = timeData[index]
        const labelColor = styles.labelColor

        return `<div style="min-width: 200px; color: ${styles.color};">
          <b>${format(new Date(dataPoint.date), 'MM/dd/yyyy HH:mm')}</b><br/>
          <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
          <b style="color: ${
            darkmode ? '#10b981' : '#059669'
          };">Sell Value:</b> ${dataPoint.sell_value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}<br/>
          <b style="color: ${
            darkmode ? '#f59e0b' : '#d97706'
          };">Buy Value:</b> ${dataPoint.buy_value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}<br/>
          <b style="color: ${
            darkmode ? '#7c3aed' : '#6d28d9'
          };">Supply:</b> ${dataPoint.sell_quantity_avg.toLocaleString()}<br/>
          <b style="color: ${
            darkmode ? '#dc2626' : '#b91c1c'
          };">Demand:</b> ${dataPoint.buy_quantity_avg.toLocaleString()}
        </div>`
      }
    },
    series: [
      {
        name: 'Sell Value',
        type: 'area',
        data: timeData.map((d) => d.sell_value),
        color: darkmode ? '#10b981' : '#059669', // Darker green
        fillOpacity: 0.3,
        lineWidth: 2,
        marker: { radius: 3 },
        yAxis: 0
        // Solid line (default)
      },
      {
        name: 'Buy Value',
        type: 'area',
        data: timeData.map((d) => d.buy_value),
        color: darkmode ? '#f59e0b' : '#d97706', // Darker orange
        fillOpacity: 0.3,
        lineWidth: 2,
        marker: { radius: 3 },
        yAxis: 0
        // Solid line (removed dashStyle)
      },
      {
        name: 'Supply',
        type: 'line',
        data: timeData.map((d) => d.sell_quantity_avg),
        color: darkmode ? '#7c3aed' : '#6d28d9', // Darker purple
        yAxis: 1,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dot' // Dotted line
      },
      {
        name: 'Demand',
        type: 'line',
        data: timeData.map((d) => d.buy_quantity_avg),
        color: darkmode ? '#dc2626' : '#b91c1c', // Darker red
        yAxis: 1,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dash'
      }
    ],
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        connectNulls: true
      },
      area: {
        stacking: null
      }
    }
  }

  return (
    <ContentContainer>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ContentContainer>
  )
}

// GW2 Transaction Volume Chart Component
const GW2TransactionChart = ({
  timeData,
  darkmode,
  itemName
}: {
  timeData: TimeDataPoint[]
  darkmode: boolean
  itemName: string
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
      return null // Only show button once for both charts
    }
    return null
  }

  if (!shouldLoadCharts || timeData.length === 0) {
    return null
  }

  const Highcharts = require('highcharts')
  const HighchartsReact = require('highcharts-react-official').default

  const styles = darkmode
    ? {
        backgroundColor: '#334155',
        color: '#f3f4f6',
        hoverColor: '#f8f8f8',
        gridLineColor: '#4a5568',
        labelColor: '#9ca3af'
      }
    : {
        backgroundColor: '#ffffff',
        color: '#000000',
        hoverColor: '#666666',
        gridLineColor: '#e2e8f0',
        labelColor: '#666666'
      }

  const xCategories = timeData.map((d) =>
    format(new Date(d.date), 'MM/dd HH:mm')
  )

  const maxSold = Math.max(
    ...timeData.map((d) =>
      Math.max(d.sell_sold, d.buy_sold, d.sell_listed, d.buy_listed)
    )
  )
  const maxQuantity = Math.max(
    ...timeData.map((d) => Math.max(d.sell_quantity_avg, d.buy_quantity_avg))
  )

  const options: any = {
    chart: {
      type: 'line',
      backgroundColor: styles.backgroundColor,
      height: 300,
      zoomType: 'x'
    },
    title: {
      text: `${itemName} - Transaction Volumes`,
      style: { color: styles.color }
    },
    legend: {
      itemStyle: { color: styles.color },
      align: 'center',
      itemHoverStyle: { color: styles.hoverColor },
      layout: 'horizontal',
      verticalAlign: 'bottom'
    },
    xAxis: {
      categories: xCategories,
      labels: {
        style: { color: styles.labelColor },
        rotation: -45
      },
      lineColor: styles.labelColor,
      gridLineColor: styles.gridLineColor
    },
    yAxis: [
      {
        title: {
          text: 'Volume',
          style: { color: styles.color }
        },
        labels: {
          style: { color: styles.labelColor },
          formatter: function (this: { value: number }) {
            return this.value.toLocaleString()
          }
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        min: 0,
        softMax: maxSold * 1.1 || 1,
        opposite: false
      },
      {
        title: {
          text: 'Quantity',
          style: { color: styles.color }
        },
        labels: {
          style: { color: styles.labelColor },
          formatter: function (this: { value: number }) {
            return this.value.toLocaleString()
          }
        },
        lineColor: styles.labelColor,
        gridLineColor: styles.gridLineColor,
        min: 0,
        softMax: maxQuantity * 1.1 || 1,
        opposite: true
      }
    ],
    tooltip: {
      shared: true,
      useHTML: true,
      backgroundColor: darkmode ? '#1f2937' : '#ffffff',
      style: {
        color: darkmode ? '#f3f4f6' : '#000000'
      },
      formatter: function (this: any) {
        const points = this.points || []
        if (points.length === 0) return ''
        const point = points[0]
        const index = point.point.index || 0
        const dataPoint = timeData[index]
        const labelColor = styles.labelColor

        return `<div style="min-width: 200px; color: ${styles.color};">
          <b>${format(new Date(dataPoint.date), 'MM/dd/yyyy HH:mm')}</b><br/>
          <hr style="border-color: ${labelColor}; margin: 8px 0;"/>
          <b style="color: ${
            darkmode ? '#10b981' : '#059669'
          };">Sold:</b> ${dataPoint.sell_sold.toLocaleString()}<br/>
          <b style="color: ${
            darkmode ? '#f59e0b' : '#d97706'
          };">Bought:</b> ${dataPoint.buy_sold.toLocaleString()}<br/>
          <b style="color: ${
            darkmode ? '#10b981' : '#059669'
          };">Offers:</b> ${dataPoint.sell_listed.toLocaleString()}<br/>
          <b style="color: ${
            darkmode ? '#f59e0b' : '#d97706'
          };">Bids:</b> ${dataPoint.buy_listed.toLocaleString()}<br/>
          <b style="color: ${
            darkmode ? '#7c3aed' : '#6d28d9'
          };">Supply:</b> ${dataPoint.sell_quantity_avg.toLocaleString()}<br/>
          <b style="color: ${
            darkmode ? '#dc2626' : '#b91c1c'
          };">Demand:</b> ${dataPoint.buy_quantity_avg.toLocaleString()}
        </div>`
      }
    },
    series: [
      {
        name: 'Sold',
        type: 'line',
        data: timeData.map((d) => d.sell_sold),
        color: darkmode ? '#10b981' : '#059669', // Green (matching Sell)
        yAxis: 0,
        lineWidth: 2,
        marker: { radius: 3 }
        // Solid line
      },
      {
        name: 'Bought',
        type: 'line',
        data: timeData.map((d) => d.buy_sold),
        color: darkmode ? '#f59e0b' : '#d97706', // Orange (matching Buy)
        yAxis: 0,
        lineWidth: 2,
        marker: { radius: 3 }
        // Solid line
      },
      {
        name: 'Offers',
        type: 'line',
        data: timeData.map((d) => d.sell_listed),
        color: darkmode ? '#10b981' : '#059669', // Darker green
        yAxis: 0,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dash' // Dashed line
      },
      {
        name: 'Bids',
        type: 'line',
        data: timeData.map((d) => d.buy_listed),
        color: darkmode ? '#f59e0b' : '#d97706', // Darker orange
        yAxis: 0,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dash' // Dashed line
      },
      {
        name: 'Supply',
        type: 'line',
        data: timeData.map((d) => d.sell_quantity_avg),
        color: darkmode ? '#7c3aed' : '#6d28d9', // Darker purple
        yAxis: 1,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dot' // Dotted line
      },
      {
        name: 'Demand',
        type: 'line',
        data: timeData.map((d) => d.buy_quantity_avg),
        color: darkmode ? '#dc2626' : '#b91c1c', // Darker red
        yAxis: 1,
        lineWidth: 2,
        marker: { radius: 3 },
        dashStyle: 'Dash'
      }
    ],
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        connectNulls: true
      }
    }
  }

  return (
    <ContentContainer>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ContentContainer>
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
  const [showExtraData, setShowExtraData] = useState(false)

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
              diffTitle="Total Value"
              diffAmount={listing.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
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

        {/* Extra Data Section */}
        {listing.extraData && (
          <ContentContainer>
            <div>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowExtraData(!showExtraData)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md">
                  {showExtraData ? 'Hide' : 'Show'} Extra Statistics
                </button>
              </div>
              {showExtraData && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      Sell Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Differences
                        diffTitle="Sell Delisted"
                        diffAmount={listing.extraData.sell_delisted.toLocaleString()}
                        className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Sell Listed"
                        diffAmount={listing.extraData.sell_listed.toLocaleString()}
                        className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Sell Price Max"
                        diffAmount={listing.extraData.sell_price_max.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4
                          }
                        )}
                        className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Sell Price Min"
                        diffAmount={listing.extraData.sell_price_min.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4
                          }
                        )}
                        className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Sell Price StDev"
                        diffAmount={listing.extraData.sell_price_stdev.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                        className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Sell Quantity Avg"
                        diffAmount={listing.extraData.sell_quantity_avg.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                        className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Sell Quantity Max"
                        diffAmount={listing.extraData.sell_quantity_max.toLocaleString()}
                        className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Sell Quantity Min"
                        diffAmount={listing.extraData.sell_quantity_min.toLocaleString()}
                        className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Sell Quantity StDev"
                        diffAmount={listing.extraData.sell_quantity_stdev.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                        className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      Buy Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Differences
                        diffTitle="Buy Delisted"
                        diffAmount={listing.extraData.buy_delisted.toLocaleString()}
                        className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Buy Listed"
                        diffAmount={listing.extraData.buy_listed.toLocaleString()}
                        className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Buy Price Max"
                        diffAmount={listing.extraData.buy_price_max.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4
                          }
                        )}
                        className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Buy Price Min"
                        diffAmount={listing.extraData.buy_price_min.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4
                          }
                        )}
                        className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Buy Price StDev"
                        diffAmount={listing.extraData.buy_price_stdev.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                        className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Buy Quantity Avg"
                        diffAmount={listing.extraData.buy_quantity_avg.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                        className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Buy Quantity Max"
                        diffAmount={listing.extraData.buy_quantity_max.toLocaleString()}
                        className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Buy Quantity Min"
                        diffAmount={listing.extraData.buy_quantity_min.toLocaleString()}
                        className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
                      />
                      <Differences
                        diffTitle="Buy Quantity StDev"
                        diffAmount={listing.extraData.buy_quantity_stdev.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                        className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <Differences
                      diffTitle="Data Points Count"
                      diffAmount={listing.extraData.count.toLocaleString()}
                      className="bg-gray-100 text-gray-900 font-semibold dark:bg-gray-600 dark:text-gray-100"
                    />
                  </div>
                </div>
              )}
            </div>
          </ContentContainer>
        )}

        {/* Price and Volume Chart */}
        {listing.timeData.length > 0 && (
          <GW2PriceVolumeChart
            timeData={listing.timeData}
            darkmode={darkmode}
            itemName={listing.itemName}
          />
        )}

        {/* Buy Value and Sell Value Chart */}
        {listing.timeData.length > 0 && (
          <GW2ValueChart
            timeData={listing.timeData}
            darkmode={darkmode}
            itemName={listing.itemName}
          />
        )}

        {/* Transaction Volume Chart */}
        {listing.timeData.length > 0 && (
          <GW2TransactionChart
            timeData={listing.timeData}
            darkmode={darkmode}
            itemName={listing.itemName}
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
      </PageWrapper>
    )
  }

  return <NoResults />
}
