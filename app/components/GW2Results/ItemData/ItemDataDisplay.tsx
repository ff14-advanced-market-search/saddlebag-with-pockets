import { useState, useEffect, useRef, useMemo } from 'react'
import { format } from 'date-fns'
import { ContentContainer, Title } from '~/components/Common'
import { Differences } from '~/components/FFXIVResults/listings/Differences'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import type {
  ItemListingData,
  BuyOrder,
  SellOrder
} from '~/requests/GW2/ItemListingsData'
import GW2SynchronizedCharts, {
  type GW2ChartsRef
} from './GW2SynchronizedCharts'
import type { TimeDataPoint } from '~/requests/GW2/ItemListingsData'

type TimeScale = 'day' | 'week' | '6week' | '3month' | 'year' | 'max'

interface ItemDataDisplayProps {
  listing: ItemListingData
  darkmode: boolean
  isDetailed?: boolean
}

const buyColumnList: Array<ColumnList<BuyOrder>> = [
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

const sellColumnList: Array<ColumnList<SellOrder>> = [
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

export default function ItemDataDisplay({
  listing,
  darkmode,
  isDetailed = false
}: ItemDataDisplayProps) {
  const [showExtraData, setShowExtraData] = useState(false)
  const [timeScale, setTimeScale] = useState<TimeScale>('max')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const chartsRef = useRef<GW2ChartsRef>(null)

  // Calculate minimum sell price and maximum buy price from arrays
  const minSellPrice =
    listing.sells.length > 0
      ? Math.min(...listing.sells.map((sell) => sell.unit_price))
      : 0
  const maxBuyPrice =
    listing.buys.length > 0
      ? Math.max(...listing.buys.map((buy) => buy.unit_price))
      : 0

  // Filter data based on selected time scale
  const timeScaleFilteredData = useMemo((): TimeDataPoint[] => {
    if (!listing) return []

    const now = new Date()
    let cutoffDate: Date
    let dataSource: TimeDataPoint[]

    switch (timeScale) {
      case 'day':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        dataSource = listing.timeData
        break
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        dataSource = listing.timeData
        break
      case '6week':
        cutoffDate = new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000)
        dataSource = listing.dailyData || []
        break
      case '3month':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        dataSource = listing.dailyData || []
        break
      case 'year':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        dataSource = listing.dailyData || []
        break
      case 'max':
        dataSource = listing.dailyData || []
        return dataSource
      default:
        dataSource = listing.timeData
        return dataSource
    }

    return dataSource.filter((point) => {
      const pointDate = new Date(point.date)
      return pointDate >= cutoffDate
    })
  }, [listing, timeScale])

  // Get unique dates from filtered data for date range picker
  const availableDates = timeScaleFilteredData
    .map((point) => point.date)
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort()

  // Get min and max dates as Date objects
  const minDate = availableDates.length > 0 ? new Date(availableDates[0]) : null
  const maxDate =
    availableDates.length > 0
      ? new Date(availableDates[availableDates.length - 1])
      : null

  // Reset date range to full range when time scale changes
  useEffect(() => {
    if (minDate && maxDate) {
      setStartDate(minDate)
      setEndDate(maxDate)
      // Also reset chart zoom when time scale changes
      chartsRef.current?.resetZoom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeScale, minDate?.getTime(), maxDate?.getTime()])

  // Initialize date range to full range when data first loads
  useEffect(() => {
    if (minDate && maxDate && (!startDate || !endDate)) {
      setStartDate(minDate)
      setEndDate(maxDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate?.getTime(), maxDate?.getTime()])

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    if (!startDate || !endDate) {
      return timeScaleFilteredData
    }
    const startDateStr = format(startDate, 'yyyy-MM-dd')
    const endDateStr = format(endDate, 'yyyy-MM-dd')
    return timeScaleFilteredData.filter((point) => {
      // Extract date part from point.date (handles both "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss" formats)
      const pointDateStr = point.date.split('T')[0]
      return pointDateStr >= startDateStr && pointDateStr <= endDateStr
    })
  }, [timeScaleFilteredData, startDate, endDate])

  return (
    <>
      <div className="flex flex-col items-center mb-2">
        <Title title={listing.itemName} />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Item ID: {listing.itemID}
        </p>
      </div>
      <p style={{ fontSize: '1px' }}>{listing.blog}</p>
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
            diffTitle="Current Sell Price"
            diffAmount={minSellPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4
            })}
            className="bg-green-100 text-green-900 font-semibold dark:bg-green-600 dark:text-gray-100"
          />
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
            diffTitle="Current Buy Price"
            diffAmount={maxBuyPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4
            })}
            className="bg-orange-100 text-orange-900 font-semibold dark:bg-orange-600 dark:text-gray-100"
          />
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
            <div className="mb-4 flex flex-row justify-center items-center gap-2 flex-wrap">
              <a
                href="https://www.datawars2.ie/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md text-sm flex items-center"
                aria-label="Visit Datawars2">
                Data provided by{' '}
                <span className="underline ml-1">datawars2.ie</span>
              </a>
              <a
                href={`https://wiki.guildwars2.com/wiki/${listing.itemName
                  .replace(/\s+/g, '_')
                  .replace(/'/g, '%27')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium"
                aria-label="View on GW2 Wiki">
                View on GW2 Wiki
              </a>
              <button
                type="button"
                onClick={() => setShowExtraData(!showExtraData)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium">
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

      {/* Synchronized Charts */}
      {(listing.timeData.length > 0 ||
        (listing.dailyData && listing.dailyData.length > 0)) && (
        <ContentContainer>
          <div>
            {/* Time Scale Buttons */}
            <div className="mb-4 flex flex-wrap gap-2 justify-center">
              {(
                ['day', 'week', '6week', '3month', 'year', 'max'] as TimeScale[]
              ).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setTimeScale(scale)}
                  className={`px-4 py-2 rounded-lg shadow-md text-sm font-medium transition-colors ${
                    timeScale === scale
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                  }`}>
                  {scale === '3month'
                    ? '3 Month'
                    : scale === '6week'
                    ? '6 Week'
                    : scale.charAt(0).toUpperCase() + scale.slice(1)}
                </button>
              ))}
            </div>
            {/* Date Range Controls */}
            {minDate && maxDate && (
              <div className="mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex flex-wrap justify-center items-end gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      min={format(minDate, 'yyyy-MM-dd')}
                      max={format(endDate || maxDate, 'yyyy-MM-dd')}
                      value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const newStart = new Date(e.target.value)
                          setStartDate(newStart)
                          // Ensure end date is not before start date
                          if (endDate && newStart > endDate) {
                            setEndDate(newStart)
                          }
                        } else {
                          setStartDate(null)
                        }
                      }}
                      className="w-48 p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      min={format(startDate || minDate, 'yyyy-MM-dd')}
                      max={format(maxDate, 'yyyy-MM-dd')}
                      value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const newEnd = new Date(e.target.value)
                          setEndDate(newEnd)
                          // Ensure start date is not after end date
                          if (startDate && newEnd < startDate) {
                            setStartDate(newEnd)
                          }
                        } else {
                          setEndDate(null)
                        }
                      }}
                      className="w-48 p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="resetZoom"
                      className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Reset Date Range
                    </label>
                    <button
                      id="resetZoom"
                      type="button"
                      onClick={() => {
                        if (minDate && maxDate) {
                          setStartDate(minDate)
                          setEndDate(maxDate)
                          // Also reset chart zoom when resetting date range
                          chartsRef.current?.resetZoom()
                        }
                      }}
                      className="w-48 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium">
                      Reset Date Range
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!isDetailed &&
            (timeScale === 'day' ||
              timeScale === 'week' ||
              timeScale === '6week') ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 my-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    Limited Data Available
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 max-w-2xl">
                    Data for{' '}
                    {timeScale === 'day'
                      ? 'daily'
                      : timeScale === 'week'
                      ? 'weekly'
                      : '6-week'}{' '}
                    views is limited on this page because bots abuse it. For
                    more full historical data, please use the detailed item
                    search page which is protected by an anti-bot search.
                  </p>
                  <a
                    href="/gw2/item-data-detailed"
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors">
                    Go to Detailed Item Search Page
                  </a>
                </div>
              </div>
            ) : (
              filteredData.length > 0 && (
                <GW2SynchronizedCharts
                  ref={chartsRef}
                  timeData={filteredData}
                  darkmode={darkmode}
                  itemName={listing.itemName}
                />
              )
            )}
          </div>
        </ContentContainer>
      )}

      {/* Orders Tables - Side by Side */}
      <div className="flex flex-col lg:flex-row gap-4 my-8">
        {/* Sell Orders Table */}
        <div className="flex-1">
          {listing.sells.length === 0 ? (
            <div className="text-center text-xl font-bold text-red-700 dark:text-red-300">
              No Sell Orders Available
            </div>
          ) : (
            <SmallTable
              title={`${listing.itemName} : Sell Orders`}
              sortingOrder={[{ desc: false, id: 'unit_price' }]}
              columnList={sellColumnList}
              mobileColumnList={sellColumnList}
              columnSelectOptions={['unit_price', 'quantity']}
              data={listing.sells as unknown as Array<Record<string, any>>}
            />
          )}
        </div>

        {/* Buy Orders Table */}
        <div className="flex-1">
          {listing.buys.length === 0 ? (
            <div className="text-center text-xl font-bold text-red-700 dark:text-red-300">
              No Buy Orders Available
            </div>
          ) : (
            <SmallTable
              title={`${listing.itemName} : Buy Orders`}
              sortingOrder={[{ desc: true, id: 'unit_price' }]}
              columnList={buyColumnList}
              mobileColumnList={buyColumnList}
              columnSelectOptions={['unit_price', 'quantity']}
              data={listing.buys as unknown as Array<Record<string, any>>}
            />
          )}
        </div>
      </div>
    </>
  )
}
