import { useNavigation } from '@remix-run/react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import type { DateRangeType, DateValueType } from 'react-tailwindcss-datepicker'
import Datepicker from 'react-tailwindcss-datepicker'
import { PageWrapper } from '~/components/Common'
import ErrorPopup from '~/components/Common/ErrorPopup'
import ImportSection from '~/components/FFXIV/ImportSection'
import PriceGroupsSection from '~/components/FFXIV/PriceGroupsSection'
import RequestPreview from '~/components/FFXIV/RequestPreview'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ImportData } from '~/requests/FFXIV/types'
import type { ActionData } from '~/routes/ffxiv.weekly-price-group-delta'

const startFromDate = new Date(2023, 0, 1)
const endFromDate = new Date()

type FormProps = {
  pageTitle: string
  actionError: string | undefined
  region: string
  setRegion: (region: string) => void
  edit: boolean
  actionData: ActionData
  onSubmit: () => void
}

const defaultValues = {
  startYear: 2023,
  startMonth: 1,
  startDay: 1,
  endYear: new Date().getFullYear(),
  endMonth: new Date().getMonth() + 1,
  endDay: new Date().getDate(),
  minimumMarketshare: 10000,
  priceSetting: 'median',
  quantitySetting: 'quantitySold',
  priceGroups: []
}

export const Form = ({
  pageTitle,
  actionError,
  region,
  setRegion,
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
      minimumMarketshare: actionData.request.minimum_marketshare,
      priceSetting: actionData.request.price_setting,
      quantitySetting: actionData.request.quantity_setting,
      priceGroups: actionData.request.price_groups
    }
  }

  const [priceGroups, setPriceGroups] = useState<
    NonNullable<ImportData['price_groups']>
  >(initialValues.priceGroups)
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
  const [minimumMarketshare, setMinimumMarketshare] = useState(
    initialValues.minimumMarketshare
  )
  const [isAddingPriceGroup, setIsAddingPriceGroup] = useState(false)
  const [priceSetting, setPriceSetting] = useState(initialValues.priceSetting)
  const [quantitySetting, setQuantitySetting] = useState(
    initialValues.quantitySetting
  )
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

  const handleImport = (data: ImportData) => {
    if (data.start_year) setStartYear(data.start_year)
    if (data.start_month) setStartMonth(data.start_month)
    if (data.start_day) setStartDay(data.start_day)
    if (data.end_year) setEndYear(data.end_year)
    if (data.end_month) setEndMonth(data.end_month)
    if (data.end_day) setEndDay(data.end_day)
    if (data.minimum_marketshare !== undefined)
      setMinimumMarketshare(data.minimum_marketshare)
    if (data.price_setting) setPriceSetting(data.price_setting)
    if (data.quantity_setting) setQuantitySetting(data.quantity_setting)
    if (data.price_groups) setPriceGroups(data.price_groups)
    if (data.region) {
      // Map the region codes to match the select options
      const regionMap: Record<string, string> = {
        Oceania: 'Oceania',
        'North America': 'NA',
        NA: 'NA',
        Europe: 'Europe',
        Japan: 'Japan'
      }
      setRegion(regionMap[data.region] || data.region)
    }
  }

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
          {/* Row with Import Configuration and See Recommended Searches */}
          <div className="flex justify-between items-center mb-4">
            <ImportSection onImport={handleImport} />
            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  '/ffxiv/weekly-price-group-delta-recommended')
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
              ← See Recommended Searches
            </button>
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
          <input
            type="hidden"
            name="minimum_marketshare"
            value={minimumMarketshare}
          />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="minimumMarketshareInput"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Minimum Marketshare
                </label>
                <input
                  id="minimumMarketshareInput"
                  type="number"
                  name="minimum_marketshare"
                  value={minimumMarketshare}
                  onChange={(e) =>
                    setMinimumMarketshare(Number(e.target.value))
                  }
                  min={0}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="regionSelect"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Region
                </label>
                <select
                  id="regionSelect"
                  name="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="NA">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Japan">Japan</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="priceSettingSelect"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Price Setting
                </label>
                <select
                  id="priceSettingSelect"
                  name="price_setting"
                  value={priceSetting}
                  onChange={(e) => setPriceSetting(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="median">Median</option>
                  <option value="average">Average</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="quantitySettingSelect"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Quantity Setting
                </label>
                <select
                  id="quantitySettingSelect"
                  name="quantity_setting"
                  value={quantitySetting}
                  onChange={(e) => setQuantitySetting(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="quantitySold">Quantity Sold</option>
                  <option value="salesAmount">Sales Amount</option>
                </select>
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
            region={region}
            startYear={startYear}
            startMonth={startMonth}
            startDay={startDay}
            endYear={endYear}
            endMonth={endMonth}
            endDay={endDay}
            minimumMarketshare={minimumMarketshare}
            priceSetting={priceSetting}
            quantitySetting={quantitySetting}
            priceGroups={priceGroups}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                transition.state === 'submitting' || priceGroups.length === 0
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
              {transition.state === 'submitting'
                ? 'Loading...'
                : priceGroups.length === 0
                ? 'Add a price group to continue'
                : 'Submit'}
            </button>
          </div>
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
