import { json } from '@remix-run/cloudflare'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  LinksFunction
} from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useState } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { FFXIVLoaderData, ImportData } from '~/requests/FFXIV/types'
import { getUserSessionData } from '~/sessions'
import WeeklyPriceGroupDelta from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import { useTypedSelector } from '~/redux/useTypedSelector'
import ErrorPopup from '~/components/Common/ErrorPopup'
import DateRangeInputs from '~/components/FFXIV/DateRangeInputs'
import ImportSection from '~/components/FFXIV/ImportSection'
import PriceGroupsSection from '~/components/FFXIV/PriceGroupsSection'
import RequestPreview from '~/components/FFXIV/RequestPreview'
import DataCenters from '~/utils/locations/DataCenters'
import type { DataCentersList } from '~/utils/locations/DataCenters'

// Map data centers to their regions
const getRegionFromDataCenter = (dataCenter: string): string => {
  // Check each region in the DataCenters map
  for (const [region, dataCenters] of DataCenters.entries()) {
    const dataCenterNames = dataCenters.map((dc) => dc.name)
    if (dataCenterNames.includes(dataCenter)) {
      switch (region as keyof DataCentersList) {
        case 'NA':
          return 'North-America'
        case 'EU':
          return 'Europe'
        case 'JP':
          return 'Japan'
        case 'OCE':
          return 'Oceania'
        default:
          return 'North-America' // Default to NA if unknown
      }
    }
  }
  return 'North-America' // Default to NA if not found
}

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Weekly Price Group Delta Analysis',
    description:
      'FFXIV Price Group Analysis! View weekly price changes for investment opportunities!'
  }
}

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/ffxiv/weekly-price-group-delta'
  }
]

export const loader: LoaderFunction = async ({ request }) => {
  const { getFFXIVSessionData } = await getUserSessionData(request)
  const { world, region: dataCenter } = getFFXIVSessionData()

  if (!dataCenter || !world) {
    throw new Error(
      'Please configure your FFXIV settings in the user settings page'
    )
  }

  const region = getRegionFromDataCenter(dataCenter)

  return json<FFXIVLoaderData>({
    world,
    region
  })
}

export const action: ActionFunction = async ({ request }) => {
  const { getFFXIVSessionData } = await getUserSessionData(request)
  const { region: dataCenter } = getFFXIVSessionData()

  if (!dataCenter) {
    return json({
      exception: 'Region is required. Please configure it in your settings.'
    })
  }

  const region = getRegionFromDataCenter(dataCenter)

  const formData = await request.formData()
  const startYear = Number.parseInt(formData.get('startYear') as string)
  const startMonth = Number.parseInt(formData.get('startMonth') as string)
  const startDay = Number.parseInt(formData.get('startDay') as string)
  const endYear = Number.parseInt(formData.get('endYear') as string)
  const endMonth = Number.parseInt(formData.get('endMonth') as string)
  const endDay = Number.parseInt(formData.get('endDay') as string)
  const hqOnly = formData.get('hq_only') === 'true'
  const priceSetting = formData.get('price_setting') as string
  const quantitySetting = formData.get('quantity_setting') as string
  const priceGroups = JSON.parse(formData.get('priceGroups') as string)

  try {
    const response = await WeeklyPriceGroupDelta({
      region,
      start_year: startYear,
      start_month: startMonth,
      start_day: startDay,
      end_year: endYear,
      end_month: endMonth,
      end_day: endDay,
      hq_only: hqOnly,
      price_setting: priceSetting,
      quantity_setting: quantitySetting,
      price_groups: priceGroups
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return json(data)
  } catch (error) {
    return json({
      exception:
        error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}

const Index = () => {
  const { world, region } = useLoaderData<FFXIVLoaderData>()
  const { darkmode } = useTypedSelector((state) => state.user)
  const transition = useNavigation()
  const actionData = useActionData<WeeklyPriceGroupDeltaResponse>()
  const [priceGroups, setPriceGroups] = useState<
    NonNullable<ImportData['price_groups']>
  >([])
  const [error, setError] = useState<string | undefined>(undefined)
  const [startYear, setStartYear] = useState(2025)
  const [startMonth, setStartMonth] = useState(1)
  const [startDay, setStartDay] = useState(1)
  const [endYear, setEndYear] = useState(2025)
  const [endMonth, setEndMonth] = useState(1)
  const [endDay, setEndDay] = useState(1)
  const [hqOnly, setHqOnly] = useState(false)
  const [priceSetting, setPriceSetting] = useState('median')
  const [quantitySetting, setQuantitySetting] = useState('total')
  const [showErrorPopup, setShowErrorPopup] = useState(false)

  const pageTitle = `Weekly Price Group Delta Analysis - ${world.name} (${region})`

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
  }

  if (actionData && 'data' in actionData) {
    return (
      <Results data={actionData} pageTitle={pageTitle} darkMode={darkmode} />
    )
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        hideSubmitButton={true}
        title={pageTitle}
        loading={transition.state === 'submitting'}
        error={undefined}
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
              setError(err)
              setShowErrorPopup(!!err)
            }}
          />

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hq_only"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Price Setting
                </label>
                <select
                  name="price_setting"
                  value={priceSetting}
                  onChange={(e) => setPriceSetting(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="median">Median</option>
                  <option value="average">Average</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Quantity Setting
                </label>
                <select
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
              setError(err)
              setShowErrorPopup(!!err)
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

      {error && showErrorPopup && (
        <ErrorPopup error={error} onClose={() => setShowErrorPopup(false)} />
      )}
    </PageWrapper>
  )
}

const Results = ({
  data,
  pageTitle,
  darkMode
}: {
  data: WeeklyPriceGroupDeltaResponse
  pageTitle: string
  darkMode: boolean
}) => {
  return (
    <PageWrapper>
      <Title title={pageTitle} />
      <ContentContainer>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <a
              href="/ffxiv/weekly-price-group-delta"
              className="text-blue-500 hover:text-blue-600 font-medium">
              ← Search Again
            </a>
          </div>
          {/* Add your results display components here */}
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </ContentContainer>
    </PageWrapper>
  )
}

export default Index
