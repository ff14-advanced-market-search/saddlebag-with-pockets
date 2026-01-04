import { Link, useNavigation } from '@remix-run/react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import type { DateRangeType, DateValueType } from 'react-tailwindcss-datepicker'
import Datepicker from 'react-tailwindcss-datepicker'
import { PageWrapper } from '~/components/Common'
import ErrorPopup from '~/components/Common/ErrorPopup'
import { ToolTip } from '~/components/Common/InfoToolTip'
import PriceGroupsSection from '~/components/GW2/PriceGroupsSection'
import RequestPreview from '~/components/GW2/RequestPreview'
import ImportSection from '~/components/GW2/ImportSection'
import type { GW2ImportData } from '~/components/GW2/ImportSection'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { GW2PriceGroup } from '~/requests/GW2/WeeklyPriceGroupDelta'
import type { ActionData } from '~/routes/gw2.weekly-price-group-delta'

const startFromDate = new Date(2024, 0, 1)
const endFromDate = new Date()

type FormProps = {
  pageTitle: string
  actionError: string | undefined
  edit: boolean
  actionData: ActionData
  onSubmit: () => void
}

const defaultValues = {
  startYear: 2024,
  startMonth: 1,
  startDay: 1,
  endYear: new Date().getFullYear(),
  endMonth: new Date().getMonth() + 1,
  endDay: new Date().getDate(),
  minimumValue: 10000, // 10000 gold in UI (will be converted to coppers)
  minimumSales: 0,
  minimumAveragePrice: 0, // 0 gold in UI
  priceGroups: [] as GW2PriceGroup[]
}

export const Form = ({
  pageTitle,
  actionError,
  actionData,
  edit,
  onSubmit
}: FormProps) => {
  const transition = useNavigation()
  let initialValues = defaultValues

  if (edit && actionData.state === 'success') {
    initialValues = {
      ...defaultValues,
      startYear: actionData.request.start_year,
      startMonth: actionData.request.start_month,
      startDay: actionData.request.start_day,
      endYear: actionData.request.end_year,
      endMonth: actionData.request.end_month,
      endDay: actionData.request.end_day,
      minimumValue: actionData.request.minimum_value / 10000, // Convert coppers to gold for display
      minimumSales: actionData.request.minimum_sales,
      minimumAveragePrice: actionData.request.minimum_average_price / 10000, // Convert coppers to gold for display
      priceGroups: actionData.request.price_groups
    }
  }

  const [priceGroups, setPriceGroups] = useState<GW2PriceGroup[]>(
    initialValues.priceGroups
  )
  const [formError, setFormError] = useState<string | undefined>(undefined)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [localError, setLocalError] = useState<string | undefined>(undefined)
  const [showLocalErrorPopup, setShowLocalErrorPopup] = useState(false)
  const [startYear, setStartYear] = useState(initialValues.startYear)
  const [startMonth, setStartMonth] = useState(initialValues.startMonth)
  const [startDay, setStartDay] = useState(initialValues.startDay)
  const [endYear, setEndYear] = useState(initialValues.endYear)
  const [endMonth, setEndMonth] = useState(initialValues.endMonth)
  const [endDay, setEndDay] = useState(initialValues.endDay)
  const [minimumValue, setMinimumValue] = useState(initialValues.minimumValue)
  const [minimumSales, setMinimumSales] = useState(initialValues.minimumSales)
  const [minimumAveragePrice, setMinimumAveragePrice] = useState(
    initialValues.minimumAveragePrice
  )
  const [isAddingPriceGroup, setIsAddingPriceGroup] = useState(false)
  const [dateRange, setDateRange] = useState<DateRangeType | null>({
    startDate: new Date(
      initialValues.startYear,
      initialValues.startMonth - 1,
      initialValues.startDay
    ),
    endDate: new Date(
      initialValues.endYear,
      initialValues.endMonth - 1,
      initialValues.endDay
    )
  })

  useEffect(() => {
    if (actionError) {
      setFormError(actionError)
      setShowErrorPopup(true)
    } else {
      setFormError(undefined)
      setShowErrorPopup(false)
    }
  }, [actionError])

  // Clear errors when form is submitted
  useEffect(() => {
    if (transition.state === 'submitting') {
      setFormError(undefined)
      setShowErrorPopup(false)
      setLocalError(undefined)
      setShowLocalErrorPopup(false)
    }
  }, [transition.state])

  const updateDateRange = (range: DateValueType) => {
    setDateRange(range)
    if (range?.startDate) {
      setStartYear(range.startDate.getFullYear())
      setStartMonth(range.startDate.getMonth() + 1)
      setStartDay(range.startDate.getDate())
    }

    if (range?.endDate) {
      setEndYear(range.endDate.getFullYear())
      setEndMonth(range.endDate.getMonth() + 1)
      setEndDay(range.endDate.getDate())
    }
  }

  const handleImport = (data: GW2ImportData) => {
    if (data.start_year) setStartYear(data.start_year)
    if (data.start_month) setStartMonth(data.start_month)
    if (data.start_day) setStartDay(data.start_day)
    if (data.end_year) setEndYear(data.end_year)
    if (data.end_month) setEndMonth(data.end_month)
    if (data.end_day) setEndDay(data.end_day)
    // Convert from coppers (API) to gold (UI) when importing
    // If value is > 10000, assume it's in coppers and convert to gold
    // Otherwise, assume it's already in gold
    if (data.minimum_value !== undefined) {
      const value =
        data.minimum_value > 10000
          ? data.minimum_value / 10000
          : data.minimum_value
      setMinimumValue(value)
    }
    if (data.minimum_sales !== undefined) setMinimumSales(data.minimum_sales)
    if (data.minimum_average_price !== undefined) {
      const price =
        data.minimum_average_price > 10000
          ? data.minimum_average_price / 10000
          : data.minimum_average_price
      setMinimumAveragePrice(price)
    }
    if (data.price_groups) setPriceGroups(data.price_groups)

    // Update date range picker when importing
    if (
      data.start_year &&
      data.start_month &&
      data.start_day &&
      data.end_year &&
      data.end_month &&
      data.end_day
    ) {
      setDateRange({
        startDate: new Date(
          data.start_year,
          data.start_month - 1,
          data.start_day
        ),
        endDate: new Date(data.end_year, data.end_month - 1, data.end_day)
      })
    }
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        hideSubmitButton={true}
        title={pageTitle}
        loading={transition.state === 'submitting'}
        error={formError}
        onClick={(e) => e.preventDefault()}
        formProps={{
          onSubmit: (e) => {
            if (isAddingPriceGroup) {
              e.preventDefault()
              e.stopPropagation()
              return
            }
            onSubmit()
          }
        }}>
        <div className="space-y-4 mb-4">
          {/* Row with See Recommended Searches and Import Configuration */}
          <div className="flex justify-between items-center mb-4">
            <Link
              to="/gw2/weekly-price-group-delta-recommended"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
              ← See Recommended Searches
            </Link>
            <ImportSection onImport={handleImport} />
          </div>

          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Timeframe
          </h4>
          <Datepicker
            minDate={startFromDate}
            maxDate={endFromDate}
            value={dateRange}
            onChange={updateDateRange}
            showShortcuts
            showFooter
            configs={{
              shortcuts: {
                allTime: {
                  text: 'All time',
                  period: {
                    start: startFromDate,
                    end: endFromDate
                  }
                },
                thisYear: {
                  text: 'This year',
                  period: {
                    start: dayjs().startOf('year').toDate(),
                    end: endFromDate
                  }
                },
                last30Days: {
                  text: 'Last 30 days',
                  period: {
                    start: dayjs().subtract(30, 'day').toDate(),
                    end: endFromDate
                  }
                },
                last90Days: {
                  text: 'Last 90 days',
                  period: {
                    start: dayjs().subtract(90, 'day').toDate(),
                    end: endFromDate
                  }
                },
                last6Months: {
                  text: 'Last 6 months',
                  period: {
                    start: dayjs().subtract(6, 'month').toDate(),
                    end: endFromDate
                  }
                },
                lastYear: {
                  text: 'Last year',
                  period: {
                    start: dayjs().subtract(1, 'year').toDate(),
                    end: endFromDate
                  }
                }
              }
            }}
          />

          <input type="hidden" name="endYear" value={endYear} />
          <input type="hidden" name="endMonth" value={endMonth} />
          <input type="hidden" name="endDay" value={endDay} />
          <input type="hidden" name="startYear" value={startYear} />
          <input type="hidden" name="startMonth" value={startMonth} />
          <input type="hidden" name="startDay" value={startDay} />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative flex items-center gap-1 mb-1">
                  <label
                    htmlFor="minimumValueInput"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Minimum Gold Earned Per Day
                  </label>
                  <ToolTip data="Filters out items that where all sales revenue has never exceeded this gold amount." />
                </div>
                <input
                  id="minimumValueInput"
                  type="number"
                  step="0.0001"
                  name="minimum_value"
                  value={minimumValue}
                  onChange={(e) => setMinimumValue(Number(e.target.value))}
                  min={0}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Gold (e.g., 1.0 = 1g)
                </p>
              </div>
              <div>
                <div className="relative flex items-center gap-1 mb-1">
                  <label
                    htmlFor="minimumSalesInput"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Minimum Sales
                  </label>
                  <ToolTip data="Filters out items that never sold this much on any day in the date range." />
                </div>
                <input
                  id="minimumSalesInput"
                  type="number"
                  name="minimum_sales"
                  value={minimumSales}
                  onChange={(e) => setMinimumSales(Number(e.target.value))}
                  min={0}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <div className="relative flex items-center gap-1 mb-1">
                  <label
                    htmlFor="minimumAveragePriceInput"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Minimum Average Price
                  </label>
                  <ToolTip data="Filters out items that have never had the average price go over this limit." />
                </div>
                <input
                  id="minimumAveragePriceInput"
                  type="number"
                  step="0.0001"
                  name="minimum_average_price"
                  value={minimumAveragePrice}
                  onChange={(e) =>
                    setMinimumAveragePrice(Number(e.target.value))
                  }
                  min={0}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Gold (e.g., 2.5025 = 2g 5s 25c)
                </p>
              </div>
            </div>
          </div>

          <PriceGroupsSection
            setIsAddingPriceGroup={setIsAddingPriceGroup}
            priceGroups={priceGroups}
            onPriceGroupsChange={setPriceGroups}
            onError={(err) => {
              setLocalError(err)
              setShowLocalErrorPopup(!!err)
            }}
            isSubmitting={transition.state === 'submitting'}
          />

          <input
            type="hidden"
            name="priceGroups"
            value={JSON.stringify(priceGroups)}
          />

          <RequestPreview
            startYear={startYear}
            startMonth={startMonth}
            startDay={startDay}
            endYear={endYear}
            endMonth={endMonth}
            endDay={endDay}
            minimumValue={minimumValue}
            minimumSales={minimumSales}
            minimumAveragePrice={minimumAveragePrice}
            priceGroups={priceGroups}
          />
        </div>
      </SmallFormContainer>

      {/* Error Popup for server errors */}
      {formError && showErrorPopup && (
        <ErrorPopup
          error={formError}
          onClose={() => setShowErrorPopup(false)}
        />
      )}

      {/* Error Popup for local validation errors */}
      {localError && showLocalErrorPopup && (
        <ErrorPopup
          error={localError}
          onClose={() => setShowLocalErrorPopup(false)}
        />
      )}
    </PageWrapper>
  )
}
