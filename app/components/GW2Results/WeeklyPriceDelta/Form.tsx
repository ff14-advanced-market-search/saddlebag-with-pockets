import { Link, useNavigation } from '@remix-run/react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import type { DateRangeType, DateValueType } from 'react-tailwindcss-datepicker'
import Datepicker from 'react-tailwindcss-datepicker'
import { PageWrapper } from '~/components/Common'
import ErrorPopup from '~/components/Common/ErrorPopup'
import PriceGroupsSection from '~/components/GW2/PriceGroupsSection'
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
  minimumValue: 100000000,
  minimumSales: 0,
  minimumAveragePrice: 0,
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
      minimumValue: actionData.request.minimum_value,
      minimumSales: actionData.request.minimum_sales,
      minimumAveragePrice: actionData.request.minimum_average_price,
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
          {/* Row with See Recommended Searches */}
          <div className="flex justify-between items-center mb-4">
            <Link
              to="/gw2/weekly-price-group-delta-recommended"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
              ← See Recommended Searches
            </Link>
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
                <label
                  htmlFor="minimumValueInput"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Minimum Value (in coppers)
                </label>
                <input
                  id="minimumValueInput"
                  type="number"
                  name="minimum_value"
                  value={minimumValue}
                  onChange={(e) => setMinimumValue(Number(e.target.value))}
                  min={0}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="minimumSalesInput"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Minimum Sales
                </label>
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
                <label
                  htmlFor="minimumAveragePriceInput"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Minimum Average Price (in coppers)
                </label>
                <input
                  id="minimumAveragePriceInput"
                  type="number"
                  name="minimum_average_price"
                  value={minimumAveragePrice}
                  onChange={(e) =>
                    setMinimumAveragePrice(Number(e.target.value))
                  }
                  min={0}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
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
