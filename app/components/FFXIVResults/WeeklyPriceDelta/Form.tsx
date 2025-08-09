import { useLoaderData, useNavigation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { PageWrapper } from '~/components/Common'
import ErrorPopup from '~/components/Common/ErrorPopup'
import DateRangeInputs from '~/components/FFXIV/DateRangeInputs'
import ImportSection from '~/components/FFXIV/ImportSection'
import PriceGroupsSection from '~/components/FFXIV/PriceGroupsSection'
import RequestPreview from '~/components/FFXIV/RequestPreview'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { useTypedSelector } from '~/redux/useTypedSelector'
import type { ImportData } from '~/requests/FFXIV/types';
import { FFXIVLoaderData } from '~/requests/FFXIV/types'

type FormProps = {
  pageTitle: string
  actionError: string | undefined
  region: string
  setRegion: (region: string) => void
}

export const Form = ({
  pageTitle,
  actionError,
  region,
  setRegion
}: FormProps) => {
  const transition = useNavigation()

  const [priceGroups, setPriceGroups] = useState<
    NonNullable<ImportData['price_groups']>
  >([])
  const [formError, setFormError] = useState<string | undefined>(undefined)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [localError, setLocalError] = useState<string | undefined>(undefined)
  const [showLocalErrorPopup, setShowLocalErrorPopup] = useState(false)
  const [startYear, setStartYear] = useState(2023)
  const [startMonth, setStartMonth] = useState(1)
  const [startDay, setStartDay] = useState(1)
  const [endYear, setEndYear] = useState(new Date().getFullYear())
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1)
  const [endDay, setEndDay] = useState(new Date().getDate())
  const [hqOnly, setHqOnly] = useState(false)
  const [priceSetting, setPriceSetting] = useState('median')
  const [quantitySetting, setQuantitySetting] = useState('quantitySold')

  const handleImport = (data: ImportData) => {
    if (data.start_year) setStartYear(data.start_year)
    if (data.start_month) setStartMonth(data.start_month)
    if (data.start_day) setStartDay(data.start_day)
    if (data.end_year) setEndYear(data.end_year)
    if (data.end_month) setEndMonth(data.end_month)
    if (data.end_day) setEndDay(data.end_day)
    if (data.hq_only !== undefined) setHqOnly(data.hq_only)
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

  return (
    <PageWrapper>
      <SmallFormContainer
        hideSubmitButton={true}
        title={pageTitle}
        loading={transition.state === 'submitting'}
        error={formError}
        onClick={(e) => e.preventDefault()}>
        <form method="post" className="space-y-4 mb-4">
          <ImportSection onImport={handleImport} />

          <DateRangeInputs
            startYear={startYear}
            startMonth={startMonth}
            startDay={startDay}
            endYear={endYear}
            endMonth={endMonth}
            endDay={endDay}
            onStartYearChange={setStartYear}
            onStartMonthChange={setStartMonth}
            onStartDayChange={setStartDay}
            onEndYearChange={setEndYear}
            onEndMonthChange={setEndMonth}
            onEndDayChange={setEndDay}
            onError={(err) => {
              setLocalError(err)
              setShowLocalErrorPopup(!!err)
            }}
          />

          <input type="hidden" name="endYear" value={endYear} />
          <input type="hidden" name="endMonth" value={endMonth} />
          <input type="hidden" name="endDay" value={endDay} />

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hq_only"
                  value="true"
                  checked={hqOnly}
                  onChange={(e) => setHqOnly(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-200">
                  HQ Only
                </span>
              </label>
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
            hqOnly={hqOnly}
            priceSetting={priceSetting}
            quantitySetting={quantitySetting}
            priceGroups={priceGroups}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={transition.state === 'submitting'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
              {transition.state === 'submitting' ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </form>
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
