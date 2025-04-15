import { json } from '@remix-run/cloudflare'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  LinksFunction
} from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useState, useEffect, useMemo } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { WoWLoaderData } from '~/requests/WoW/types'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { getUserSessionData } from '~/sessions'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import FullTable from '~/components/Tables/FullTable'
import MobileTable from '~/components/WoWResults/FullScan/MobileTable'
import type { ColumnList } from '~/components/types'
import DebouncedInput from '~/components/Common/DebouncedInput'
import CSVButton from '~/components/utilities/CSVButton'
import JSONButton from '~/components/utilities/JSONButton'
import type { Options } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import PriceGroupForm from '~/components/form/WoW/PriceGroupForm'
import type {
  WeeklyPriceGroupDeltaResponse,
  ItemData,
  PriceGroup
} from '~/requests/WoW/WeeklyPriceGroupDelta'
import WeeklyPriceGroupDelta from '~/requests/WoW/WeeklyPriceGroupDelta'
import CodeBlock from '~/components/Common/CodeBlock'
import { getOribosLink } from '~/components/utilities/getOribosLink'
import { getSaddlebagWoWLink } from '~/components/utilities/getSaddlebagWoWLink'
import WeeklyPriceQuantityChart from '~/components/Charts/WeeklyPriceQuantityChart'
import PriceQuantityChartPopup from '~/components/Charts/PriceQuantityChartPopup'
import ErrorPopup from '~/components/Common/ErrorPopup'
import { getWowheadLink } from '~/components/utilities/getWowheadLink'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW Weekly Price Group Delta Analysis',
    description:
      'Analyze weekly price changes for groups of WoW items and categories'
  }
}

// Add keyframe animation for the pulsing effect
const styles = `
@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.pulse {
  animation: pulse-border 2s infinite;
}
`

// Overwrite default links in the root.tsx
export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/wow/weekly-price-group-delta'
  },
  {
    rel: 'stylesheet',
    href: `data:text/css,${encodeURIComponent(styles)}`
  }
]

// Loader function to get session data
export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()

  if (!region || !server) {
    throw new Error(
      'Please configure your WoW settings in the user settings page'
    )
  }

  return json<WoWLoaderData>({
    wowRealm: server,
    wowRegion: region
  })
}

// Action function to handle form submission
export const action: ActionFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { region } = getWoWSessionData()

  if (!region) {
    return json({
      exception: 'Region is required. Please configure it in your settings.'
    })
  }

  const formData = await request.formData()
  const startYear = Number.parseInt(formData.get('startYear') as string)
  const startMonth = Number.parseInt(formData.get('startMonth') as string)
  const startDay = Number.parseInt(formData.get('startDay') as string)
  const priceGroups = JSON.parse(
    formData.get('priceGroups') as string
  ) as PriceGroup[]

  try {
    const response = await WeeklyPriceGroupDelta({
      region,
      start_year: startYear,
      start_month: startMonth,
      start_day: startDay,
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

const MAX_PRICE_GROUPS = 10
const MAX_NAME_LENGTH = 64
const VALID_NAME_REGEX = /^[a-zA-Z0-9\s'.,\-_]*$/

const validatePriceGroup = (group: PriceGroup): string | null => {
  // Check for empty name
  if (!group.name.trim()) {
    return 'Price group name cannot be empty'
  }

  // Validate name length
  if (group.name.length > MAX_NAME_LENGTH) {
    return `Price group "${group.name}" name must be less than 64 characters`
  }

  // Validate name characters
  if (!VALID_NAME_REGEX.test(group.name)) {
    return `Price group "${group.name}" name can only contain alphanumeric characters, periods, commas, spaces, hyphens, and underscores`
  }

  // Check if both item_ids and categories are empty
  if (group.item_ids.length === 0 && group.categories.length === 0) {
    return `Price group "${group.name}" must have at least one item or category`
  }

  return null
}

// Add this interface for the import data structure
interface ImportData {
  region?: string
  start_year?: number
  start_month?: number
  start_day?: number
  price_groups?: PriceGroup[]
}

// Add this validation function
const validateImportData = (data: any): { valid: boolean; error?: string } => {
  try {
    // Parse if string
    const jsonData = typeof data === 'string' ? JSON.parse(data) : data

    // Check required fields and types
    if (typeof jsonData.region !== 'string') {
      return { valid: false, error: 'Region must be a string' }
    }
    if (
      typeof jsonData.start_year !== 'number' ||
      jsonData.start_year < 2020 ||
      jsonData.start_year > 2090
    ) {
      return {
        valid: false,
        error: 'Start year must be a number between 2020 and 2090'
      }
    }
    if (
      typeof jsonData.start_month !== 'number' ||
      jsonData.start_month < 1 ||
      jsonData.start_month > 12
    ) {
      return {
        valid: false,
        error: 'Start month must be a number between 1 and 12'
      }
    }
    if (
      typeof jsonData.start_day !== 'number' ||
      jsonData.start_day < 1 ||
      jsonData.start_day > 31
    ) {
      return {
        valid: false,
        error: 'Start day must be a number between 1 and 31'
      }
    }
    if (!Array.isArray(jsonData.price_groups)) {
      return { valid: false, error: 'Price groups must be an array' }
    }

    // Validate each price group
    for (const group of jsonData.price_groups) {
      if (typeof group.name !== 'string') {
        return {
          valid: false,
          error: 'Each price group must have a name string'
        }
      }
      if (!Array.isArray(group.item_ids)) {
        return { valid: false, error: 'item_ids must be an array' }
      }
      if (!Array.isArray(group.categories)) {
        return { valid: false, error: 'categories must be an array' }
      }

      // Validate each category
      for (const category of group.categories) {
        if (typeof category.item_class !== 'number') {
          return { valid: false, error: 'item_class must be a number' }
        }
        if (typeof category.item_subclass !== 'number') {
          return { valid: false, error: 'item_subclass must be a number' }
        }
        if (typeof category.expansion_number !== 'number') {
          return { valid: false, error: 'expansion_number must be a number' }
        }
        if (typeof category.min_quality !== 'number') {
          return { valid: false, error: 'min_quality must be a number' }
        }
      }
    }

    return { valid: true }
  } catch (e) {
    return { valid: false, error: 'Invalid JSON format' }
  }
}

// Add this component for the import popup
const ImportPopup = ({
  onClose,
  onImport
}: {
  onClose: () => void
  onImport: (data: ImportData) => void
}) => {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState<string | undefined>()

  const handleImport = () => {
    const validation = validateImportData(jsonInput)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    try {
      const data = JSON.parse(jsonInput)
      onImport(data)
      onClose()
    } catch (e) {
      setError('Invalid JSON format')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Import Configuration
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="jsonConfig"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Paste your JSON configuration:
            </label>
            <textarea
              id="jsonConfig"
              className="w-full h-64 p-2 border rounded font-mono text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value)
                setError(undefined)
              }}
              placeholder="Paste your JSON here..."
            />
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700">
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component
const Index = () => {
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const { darkmode } = useTypedSelector((state) => state.user)
  const transition = useNavigation()
  const actionData = useActionData<WeeklyPriceGroupDeltaResponse>()
  const [priceGroups, setPriceGroups] = useState<PriceGroup[]>([])
  const [error, setError] = useState<string | undefined>(undefined)
  const [startYear, setStartYear] = useState(2025)
  const [startMonth, setStartMonth] = useState(1)
  const [startDay, setStartDay] = useState(1)
  const [showImport, setShowImport] = useState(false)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [pendingMinPeakDeltaFilter, setPendingMinPeakDeltaFilter] = useState<
    number | 'any'
  >('any')
  const [pendingMaxPeakDeltaFilter, setPendingMaxPeakDeltaFilter] = useState<
    number | 'any'
  >('any')
  const [isPeakDeltaFilterEnabled, setIsPeakDeltaFilterEnabled] =
    useState(false)
  const [minPeakDeltaFilter, setMinPeakDeltaFilter] = useState<number | 'any'>(
    'any'
  )
  const [maxPeakDeltaFilter, setMaxPeakDeltaFilter] = useState<number | 'any'>(
    'any'
  )

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
      return
    }

    // Check if there are any price groups
    if (priceGroups.length === 0) {
      e.preventDefault()
      setError('Please add at least one price group')
      setShowErrorPopup(true)
      return
    }

    // Validate all price groups before submission
    for (const group of priceGroups) {
      const validationError = validatePriceGroup(group)
      if (validationError) {
        e.preventDefault()
        setError(validationError)
        setShowErrorPopup(true)
        return
      }
    }

    setError(undefined)
    setShowErrorPopup(false)
  }

  const handleAddPriceGroup = () => {
    if (priceGroups.length >= MAX_PRICE_GROUPS) {
      setError('Maximum of 10 price groups allowed')
      return
    }

    setPriceGroups([
      ...priceGroups,
      {
        name: '',
        item_ids: [],
        categories: []
      }
    ])
  }

  const handleImport = (data: ImportData) => {
    // First update the date values if they exist
    if (data.start_year) setStartYear(data.start_year)
    if (data.start_month) setStartMonth(data.start_month)
    if (data.start_day) setStartDay(data.start_day)

    // Immediately set price groups to empty array to clear all existing groups
    setPriceGroups([])

    // Use setTimeout to ensure the state is cleared before adding new groups
    setTimeout(() => {
      if (data.price_groups && data.price_groups.length > 0) {
        // Map and set the new price groups
        const newGroups = data.price_groups.map((group) => ({
          name: group.name,
          item_ids: group.item_ids || [],
          categories: group.categories || []
        }))
        setPriceGroups(newGroups)
      } else {
        // If no price groups in import, create a single empty one
        setPriceGroups([
          {
            name: '',
            item_ids: [],
            categories: []
          }
        ])
      }
    }, 0)
  }

  const pageTitle = `Weekly Price Group Delta Analysis - ${wowRealm.name} (${wowRegion})`

  if (actionData) {
    return (
      <Results data={actionData} pageTitle={pageTitle} darkMode={darkmode} />
    )
  }

  // Create the request data preview
  const requestData = {
    region: wowRegion,
    start_year: startYear,
    start_month: startMonth,
    start_day: startDay,
    price_groups: priceGroups
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
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowImport(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                role="img"
                aria-label="Import configuration icon">
                <title>Import configuration</title>
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Import Configuration
            </button>
          </div>

          {showImport && (
            <ImportPopup
              onClose={() => setShowImport(false)}
              onImport={handleImport}
            />
          )}

          <div className="grid grid-cols-3 gap-4">
            <InputWithLabel
              labelTitle="Start Year"
              name="startYear"
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(Number.parseInt(e.target.value))}
              min={2020}
              max={2090}
            />
            <InputWithLabel
              labelTitle="Start Month"
              name="startMonth"
              type="number"
              value={startMonth}
              onChange={(e) => setStartMonth(Number.parseInt(e.target.value))}
              min={1}
              max={12}
            />
            <InputWithLabel
              labelTitle="Start Day"
              name="startDay"
              type="number"
              value={startDay}
              onChange={(e) => setStartDay(Number.parseInt(e.target.value))}
              min={1}
              max={31}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Price Groups
            </h3>
            <div className="flex justify-center my-8">
              <button
                type="submit"
                onClick={onSubmit}
                disabled={transition.state === 'submitting'}
                className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 pulse disabled:opacity-50 disabled:cursor-not-allowed">
                {transition.state === 'submitting'
                  ? 'Searching...'
                  : 'Search Price Groups'}
              </button>
            </div>
            {priceGroups.map((group, index) => (
              <PriceGroupForm
                key={index}
                defaultValue={group}
                onChange={(updatedGroup) => {
                  const newGroups = [...priceGroups]
                  newGroups[index] = updatedGroup
                  setPriceGroups(newGroups)
                  setError(undefined)
                }}
                onRemove={
                  priceGroups.length > 1
                    ? () => {
                        setPriceGroups(
                          priceGroups.filter((_, i) => i !== index)
                        )
                        setError(undefined)
                      }
                    : undefined
                }
              />
            ))}
            <button
              type="button"
              onClick={handleAddPriceGroup}
              disabled={priceGroups.length >= MAX_PRICE_GROUPS}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
              Add Price Group
            </button>
          </div>

          <input
            type="hidden"
            name="priceGroups"
            value={JSON.stringify(priceGroups)}
          />

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Request Data Preview
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <CodeBlock
                title="Input for weekly price group delta"
                buttonTitle="Copy"
                codeString={JSON.stringify(requestData, null, 2)}
                onClick={() => alert('Copied to clipboard!')}>
                <p className="italic text-sm text-gray-700 dark:text-gray-300 py-2">
                  This is the data that will be sent to the API when you submit
                  the form.
                </p>
              </CodeBlock>
            </div>
          </div>
        </form>
      </SmallFormContainer>

      {/* Error Popup */}
      {error && showErrorPopup && (
        <ErrorPopup error={error} onClose={() => setShowErrorPopup(false)} />
      )}
    </PageWrapper>
  )
}

// Results component
const Results = ({
  data,
  pageTitle,
  darkMode
}: {
  data: WeeklyPriceGroupDeltaResponse
  pageTitle: string
  darkMode: boolean
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All')
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [performanceThreshold] = useState(-100) // Default to show all
  const [minYAxis, setMinYAxis] = useState<number | null>(null) // Default min y-axis value (null = auto)
  const [maxYAxis, setMaxYAxis] = useState<number | null>(null) // Default max y-axis value (null = auto)
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({})
  const [showPriceQuantityCharts, setShowPriceQuantityCharts] = useState(false)
  const [selectedItemForChart, setSelectedItemForChart] = useState<
    string | null
  >(null)
  const [visibilityFilter, setVisibilityFilter] = useState('')
  // State for delta filtering
  const [isPeakDeltaFilterEnabled, setIsPeakDeltaFilterEnabled] =
    useState(false)
  const [minPeakDeltaFilter, setMinPeakDeltaFilter] = useState<number | 'any'>(
    'any'
  )
  const [maxPeakDeltaFilter, setMaxPeakDeltaFilter] = useState<number | 'any'>(
    'any'
  )
  const [pendingMinPeakDeltaFilter, setPendingMinPeakDeltaFilter] = useState<
    number | 'any'
  >('any')
  const [pendingMaxPeakDeltaFilter, setPendingMaxPeakDeltaFilter] = useState<
    number | 'any'
  >('any')

  // Get all unique timestamps across all groups
  const allTimestamps = Array.from(
    new Set(
      Object.values(data).flatMap((groupData) => Object.keys(groupData.deltas))
    )
  ).sort()

  // Initialize selected dates to full range
  useEffect(() => {
    if (allTimestamps.length <= 0) {
      return
    }
    if (!selectedDate) {
      setSelectedDate(allTimestamps[allTimestamps.length - 1])
    }
    if (!startDate) {
      setStartDate(allTimestamps[0])
    }
    if (!endDate) {
      setEndDate(allTimestamps[allTimestamps.length - 1])
    }
  }, [allTimestamps])

  // Filter timestamps based on date range
  const filteredTimestamps = allTimestamps.filter(
    (timestamp) => timestamp >= startDate && timestamp <= endDate
  )

  // Format timestamp into YYYY-MM-DD
  const formatTimestamp = (timestamp: string) => {
    const dateStr = timestamp.padStart(8, '0') // Ensure 8 digits
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    return `${year}-${month}-${day}`
  }

  // Initialize visible items when group changes
  useEffect(() => {
    if (selectedGroup === 'All') {
      // For 'All' view, show all groups
      const newVisibleItems: Record<string, boolean> = {}
      Object.keys(data).forEach((groupName) => {
        newVisibleItems[groupName] = true
      })
      setVisibleItems(newVisibleItems)
      return
    }
    // For specific group view, show average and conditionally show items
    const newVisibleItems: Record<string, boolean> = {
      [`${selectedGroup} (Average)`]: true
    }
    const groupData = data[selectedGroup]
    const itemCount = Object.keys(groupData.item_data).length
    const defaultVisibility = itemCount <= 50

    Object.keys(groupData.item_data).forEach((itemId) => {
      newVisibleItems[groupData.item_names[itemId]] = defaultVisibility
    })
    setVisibleItems(newVisibleItems)
  }, [selectedGroup, data])

  const styles = darkMode
    ? {
        backgroundColor: '#1e293b', // slate-800
        color: '#f3f4f6', // gray-100
        hoverColor: '#f8f8f8',
        gridLineColor: '#334155', // slate-700
        labelColor: '#94a3b8', // slate-400
        borderColor: '#475569' // slate-600
      }
    : {
        backgroundColor: '#ffffff',
        color: '#1f2937', // gray-800
        hoverColor: '#4b5563', // gray-600
        gridLineColor: '#e2e8f0', // slate-200
        labelColor: '#64748b', // slate-500
        borderColor: '#e2e8f0' // slate-200
      }

  const seriesData = useMemo(() => {
    if (selectedGroup === 'All') {
      return Object.entries(data)
        .filter(([groupName]) => visibleItems[groupName])
        .map(([groupName, groupData]) => {
          // Calculate average performance for the group within the date range
          const values = Object.entries(groupData.deltas)
            .filter(
              ([timestamp]) => timestamp >= startDate && timestamp <= endDate
            )
            .map(([, value]) => value)
            .filter((v) => v != null)

          const avgPerformance =
            values.length > 0
              ? values.reduce((a, b) => a + b, 0) / values.length
              : 0

          // Only include if above threshold
          if (avgPerformance >= performanceThreshold) {
            return {
              name: groupName,
              data: filteredTimestamps.map((timestamp) => {
                const value = groupData.deltas[timestamp]
                return value !== undefined ? value : null
              }),
              type: 'line' as const
            }
          }
          return undefined
        })
        .filter(
          (series): series is NonNullable<typeof series> => series !== undefined
        )
    }
    const groupData = data[selectedGroup]
    const series = []

    // Add average line if visible
    if (visibleItems[`${selectedGroup} (Average)`]) {
      const values = Object.entries(groupData.deltas)
        .filter(([timestamp]) => timestamp >= startDate && timestamp <= endDate)
        .map(([, value]) => value)
        .filter((v) => v != null)

      const avgPerformance =
        values.length > 0
          ? values.reduce((a, b) => a + b, 0) / values.length
          : 0

      if (avgPerformance >= performanceThreshold) {
        series.push({
          name: `${selectedGroup} (Average)`,
          data: filteredTimestamps.map((timestamp) => {
            const value = groupData.deltas[timestamp]
            return value !== undefined ? value : null
          }),
          type: 'line' as const,
          lineWidth: 5,
          zIndex: 2
        })
      }
    }

    // Add individual items if visible and above threshold
    Object.entries(groupData.item_data).forEach(([itemId, itemData]) => {
      const itemName = groupData.item_names[itemId]
      if (!visibleItems[itemName]) {
        return
      }
      // Calculate average performance for the item within the date range
      const values = itemData.weekly_data
        .filter((d) => d.t.toString() >= startDate && d.t.toString() <= endDate)
        .map((d) => d.delta)
        .filter((v) => v != null)

      const avgPerformance =
        values.length > 0
          ? values.reduce((a, b) => a + b, 0) / values.length
          : 0

      if (avgPerformance >= performanceThreshold) {
        series.push({
          name: itemName,
          data: filteredTimestamps.map((timestamp) => {
            const weekData = itemData.weekly_data.find(
              (d) => d.t.toString() === timestamp
            )
            return weekData ? weekData.delta : null
          }),
          type: 'line' as const,
          lineWidth: 1,
          dashStyle: 'LongDash',
          opacity: 0.7,
          zIndex: 1
        })
      }
    })

    return series
  }, [
    data,
    selectedGroup,
    visibleItems,
    startDate,
    endDate,
    filteredTimestamps,
    performanceThreshold
  ])

  // Modified chart options
  const deltaChartOptions: Options = {
    chart: {
      type: 'line',
      backgroundColor: styles.backgroundColor,
      style: {
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      },
      height: 600,
      spacingBottom: 20,
      spacingTop: 20,
      spacingLeft: 20,
      spacingRight: 20
    },
    title: {
      text:
        selectedGroup === 'All'
          ? 'All Groups - Weekly Price Deltas'
          : `${selectedGroup} - Weekly Price Deltas`,
      style: { color: styles.color, fontSize: '18px' }
    },
    xAxis: {
      categories: filteredTimestamps.map(formatTimestamp),
      labels: {
        style: { color: styles.labelColor },
        rotation: -45,
        formatter() {
          return this.value as string
        }
      },
      title: { text: 'Week', style: { color: styles.color } },
      lineColor: styles.borderColor,
      gridLineColor: styles.gridLineColor,
      tickColor: styles.borderColor
    },
    yAxis: {
      title: {
        text: 'Price Change %',
        style: { color: styles.color }
      },
      labels: {
        style: { color: styles.labelColor },
        format: '{value}%'
      },
      min: minYAxis !== null ? minYAxis : undefined,
      max: maxYAxis !== null ? maxYAxis : undefined,
      softMin: minYAxis !== null ? minYAxis : undefined,
      gridLineColor: styles.gridLineColor,
      lineColor: styles.borderColor,
      tickColor: styles.borderColor
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<b>{point.key}</b><br/>',
      // Custom formatter to sort points by value
      formatter() {
        if (!this.points) return ''

        // Sort points by value (delta) in descending order
        const sortedPoints = this.points
          .filter((point) => point.y != null)
          .sort((a, b) => (b.y || 0) - (a.y || 0))

        let s = `<div style="min-width: 150px; color: ${styles.color}; font-size: 12px;">
          <b style="font-size: 14px;">${this.x}</b><br/>`

        // Add each point's data
        sortedPoints.forEach((point) => {
          s += `<div style="display: flex; justify-content: space-between; margin: 4px 0;">
            <span style="color:${point.color}">●</span>
            <span style="margin-left: 4px; flex-grow: 1;">${
              point.series.name
            }:</span>
            <b style="margin-left: 8px;">${point.y?.toFixed(2)}%</b>
          </div>`
        })

        s += '</div>'
        return s
      },
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      style: {
        color: styles.color
      },
      padding: 12,
      shadow: true,
      borderWidth: 1,
      borderColor: styles.borderColor,
      borderRadius: 8
    },
    plotOptions: {
      series: {
        connectNulls: true,
        marker: {
          enabled: true,
          radius: 3,
          lineWidth: 1,
          lineColor: styles.borderColor
        },
        states: {
          hover: {
            brightness: darkMode ? 0.3 : -0.2,
            lineWidthPlus: 0
          }
        },
        events: {
          legendItemClick() {
            if (selectedGroup !== 'All') {
              return false // Prevent toggling visibility
            }
            return true // Allow toggling for All Groups view
          }
        }
      }
    },
    series: seriesData.map((series) => ({
      ...series,
      lineWidth: series.name.includes('Average') ? 3 : 1.5,
      opacity: series.name.includes('Average') ? 1 : 0.8,
      states: {
        hover: {
          lineWidth: series.name.includes('Average') ? 3 : 1.5
        }
      }
    })),
    legend: {
      itemStyle: { color: styles.color },
      itemHoverStyle: { color: styles.hoverColor },
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      maxHeight:
        selectedGroup === 'All'
          ? 300
          : Math.floor(
              Object.keys(data[selectedGroup].item_data).length * 30 + 200
            ),
      itemMarginTop: 4,
      itemMarginBottom: 4,
      padding: 12,
      backgroundColor: styles.backgroundColor,
      borderWidth: 1,
      borderColor: styles.borderColor,
      borderRadius: 4,
      shadow: false,
      symbolRadius: 2,
      symbolHeight: 8,
      symbolWidth: 8,
      useHTML: true,
      labelFormatter: function () {
        return `<span style="display: flex; align-items: center;">
          <span style="color: ${this.color};">●</span>
          <span style="margin-left: 4px;">${this.name}</span>
        </span>`
      }
    },
    credits: { enabled: false }
  }

  // Only show item details if a specific group is selected
  const showItemDetails = selectedGroup !== 'All'
  const groupData = showItemDetails ? data[selectedGroup] : null

  // Helper function to get data for a specific timestamp
  const getDataForTimestamp = (itemData: ItemData, timestamp: string) => {
    return itemData.weekly_data.find((d) => d.t.toString() === timestamp)
  }

  // Table columns for item details
  const columnList: Array<ColumnList<ItemData>> = [
    {
      columnId: 'visibility',
      header: 'Show in Chart',
      accessor: ({ row }) => {
        if (!groupData) return null
        const itemName = groupData.item_names[row.itemID]
        return (
          <input
            type="checkbox"
            checked={visibleItems[itemName]}
            onChange={() => {
              setVisibleItems((prev) => ({
                ...prev,
                [itemName]: !prev[itemName]
              }))
            }}
            className="form-checkbox h-4 w-4 text-blue-500"
          />
        )
      }
    },
    { columnId: 'itemName', header: 'Item Name' },
    // { columnId: 'itemID', header: 'Item ID' },
    {
      columnId: 'price',
      header: `Price (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.p,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.p.toLocaleString() : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'delta',
      header: `Delta % (${formatTimestamp(selectedDate)})`,
      dataAccessor: (row) => getDataForTimestamp(row, selectedDate)?.delta,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? `${data.delta.toFixed(2)}%` : 'N/A'}</span>
      },
      sortUndefined: 'last'
    },
    {
      columnId: 'priceQuantity',
      header: 'Price V Quantity',
      accessor: ({ row }) => {
        if (!groupData) return null
        return (
          <button
            type="button"
            onClick={() => setSelectedItemForChart(row.itemID.toString())}
            className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-sm">
            Price V Quantity
          </button>
        )
      }
    },
    {
      columnId: 'links',
      header: 'Links',
      accessor: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {getSaddlebagWoWLink('Item-Data')({ row })}
            <span className="text-gray-400">|</span>
            {getOribosLink(wowRealm.name, 'TUJ', wowRegion)({ row })}
            <span className="text-gray-400">|</span>
            {getWowheadLink('WoWHead')({ row })}
          </div>
        )
      }
    },
    { columnId: 'marketshare', header: 'Marketshare' },
    { columnId: 'historicPrice', header: 'TSM Avg Price' },
    { columnId: 'salesPerDay', header: 'TSM Sales' }
  ]

  return (
    <PageWrapper>
      <Title title={pageTitle} />
      <ContentContainer>
        <div className="space-y-4">
          {/* Search Again Link and Performance Control */}
          <div className="flex justify-between items-center">
            <a
              href="/wow/weekly-price-group-delta"
              className="text-blue-500 hover:text-blue-600 font-medium">
              ← Search Again
            </a>
          </div>

          {/* Date Range Controls */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Start Date
                </label>
                <select
                  value={startDate}
                  onChange={(e) => {
                    const newStart = e.target.value
                    setStartDate(newStart)
                    if (endDate < newStart) {
                      setEndDate(newStart)
                    }
                  }}
                  className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  {allTimestamps.map((timestamp) => (
                    <option key={timestamp} value={timestamp}>
                      {formatTimestamp(timestamp)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  End Date
                </label>
                <select
                  value={endDate}
                  onChange={(e) => {
                    const newEnd = e.target.value
                    setEndDate(newEnd)
                    if (startDate > newEnd) {
                      setStartDate(newEnd)
                    }
                  }}
                  className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  {allTimestamps.map((timestamp) => (
                    <option key={timestamp} value={timestamp}>
                      {formatTimestamp(timestamp)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Reset Range
                </label>
                <button
                  onClick={() => {
                    setStartDate(allTimestamps[0])
                    setEndDate(allTimestamps[allTimestamps.length - 1])
                  }}
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Reset to Full Range
                </button>
              </div>
            </div>
          </div>

          {/* Group selector */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedGroup('All')}
              className={`p-2 rounded transition-colors duration-200 ${
                selectedGroup === 'All'
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : darkMode
                  ? 'bg-slate-800 text-gray-100 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}>
              All Groups
            </button>
            {Object.keys(data).map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedGroup(group)}
                className={`p-2 rounded transition-colors duration-200 ${
                  selectedGroup === group
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : darkMode
                    ? 'bg-slate-800 text-gray-100 hover:bg-slate-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                {group}
              </button>
            ))}
          </div>

          {/* Chart and Controls Container */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Chart */}
              <div className="flex-grow min-w-0">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    ...deltaChartOptions,
                    legend: {
                      ...deltaChartOptions.legend,
                      enabled: false
                    }
                  }}
                />
              </div>

              {/* Visibility Controls */}
              <div
                className="md:w-72 flex flex-col bg-gray-50 dark:bg-gray-700 rounded"
                style={{ height: '600px' }}>
                {/* Controls that stay visible */}
                <div className="px-4 mb-2 pt-4">
                  <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">
                    Chart Y-Axis Range:
                  </h4>

                  <div className="flex items-center">
                    <label
                      htmlFor="maxYAxis"
                      className="text-xs font-medium w-16 text-gray-900 dark:text-gray-100">
                      Max Price %:
                    </label>
                    <select
                      id="maxYAxis"
                      value={maxYAxis === null ? 'auto' : maxYAxis}
                      onChange={(e) => {
                        const val = e.target.value
                        setMaxYAxis(val === 'auto' ? null : Number(val))
                      }}
                      className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 flex-1">
                      <option value="auto">Auto</option>
                      <option value={25}>25%</option>
                      <option value={50}>50%</option>
                      <option value={100}>100%</option>
                      <option value={200}>200%</option>
                      <option value={500}>500%</option>
                      <option value={1000}>1000%</option>
                      <option value={1500}>1500%</option>
                      <option value={2000}>2000%</option>
                      <option value={3000}>3000%</option>
                      <option value={4000}>4000%</option>
                      <option value={5000}>5000%</option>
                    </select>
                  </div>
                  <div className="flex items-center mb-2">
                    <label
                      htmlFor="minYAxis"
                      className="text-xs font-medium w-16 text-gray-900 dark:text-gray-100">
                      Min Price %:
                    </label>
                    <select
                      id="minYAxis"
                      value={minYAxis === null ? 'auto' : minYAxis}
                      onChange={(e) => {
                        const val = e.target.value
                        setMinYAxis(val === 'auto' ? null : Number(val))
                      }}
                      className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 flex-1">
                      <option value="auto">Auto</option>
                      <option value={-95}>-95%</option>
                      <option value={-85}>-85%</option>
                      <option value={-75}>-75%</option>
                      <option value={-50}>-50%</option>
                      <option value={-25}>-25%</option>
                      <option value={0}>0%</option>
                    </select>
                  </div>
                </div>

                <div className="mx-4 border-t border-gray-300 dark:border-gray-600 my-2" />

                <h4 className="font-medium px-4 pb-2 text-gray-900 dark:text-gray-100">
                  Show/Hide Items
                </h4>

                <div className="px-4 mb-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={visibilityFilter}
                      onChange={(e) => setVisibilityFilter(e.target.value)}
                      className="w-full p-2 text-xs border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Delta Filter Controls */}
                {showItemDetails && (
                  <div className="px-4 mb-2 space-y-2 border-t border-b border-gray-300 dark:border-gray-600 py-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPeakDeltaFilterEnabled}
                        onChange={(e) =>
                          setIsPeakDeltaFilterEnabled(e.target.checked)
                        }
                        className="form-checkbox h-4 w-4 text-blue-500"
                      />
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        Filter by Price Change %
                      </span>
                    </label>
                    {isPeakDeltaFilterEnabled && (
                      <div className="space-y-1 pl-5">
                        <div className="flex items-center">
                          <label
                            htmlFor="maxPeakDeltaFilter"
                            className="text-xs w-10 text-gray-900 dark:text-gray-100">
                            Max:
                          </label>
                          <select
                            id="maxPeakDeltaFilter"
                            value={pendingMaxPeakDeltaFilter}
                            onChange={(e) => {
                              const val = e.target.value
                              setPendingMaxPeakDeltaFilter(
                                val === 'any' ? 'any' : Number(val)
                              )
                            }}
                            className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 flex-1">
                            <option value="any">Any</option>
                            <option value={-50}>-50%</option>
                            <option value={-25}>-25%</option>
                            <option value={0}>0%</option>
                            <option value={25}>25%</option>
                            <option value={50}>50%</option>
                            <option value={100}>100%</option>
                            <option value={200}>200%</option>
                            <option value={500}>500%</option>
                            <option value={1000}>1000%</option>
                            <option value={1500}>1500%</option>
                            <option value={2000}>2000%</option>
                            <option value={3000}>3000%</option>
                            <option value={4000}>4000%</option>
                            <option value={5000}>5000%</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <label
                            htmlFor="minPeakDeltaFilter"
                            className="text-xs w-10 text-gray-900 dark:text-gray-100">
                            Min:
                          </label>
                          <select
                            id="minPeakDeltaFilter"
                            value={pendingMinPeakDeltaFilter}
                            onChange={(e) => {
                              const val = e.target.value
                              setPendingMinPeakDeltaFilter(
                                val === 'any' ? 'any' : Number(val)
                              )
                            }}
                            className="text-xs p-1 rounded border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 flex-1">
                            <option value="any">Any</option>
                            <option value={-100}>-100%</option>
                            <option value={-95}>-95%</option>
                            <option value={-85}>-85%</option>
                            <option value={-75}>-75%</option>
                            <option value={-50}>-50%</option>
                            <option value={-25}>-25%</option>
                            <option value={0}>0%</option>
                          </select>
                        </div>
                        <button
                          onClick={() => {
                            if (!selectedGroup || !data[selectedGroup]) return

                            // Start with all items unselected except the average
                            const newVisibleItems: Record<string, boolean> = {
                              [`${selectedGroup} (Average)`]: true
                            }

                            // Only select items that match the filter criteria
                            Object.entries(
                              data[selectedGroup].item_data
                            ).forEach(([itemId, itemData]) => {
                              const itemName =
                                data[selectedGroup].item_names[itemId]

                              // Get all deltas for the item within the current date range
                              const deltasInRange = itemData.weekly_data
                                .filter(
                                  (d) =>
                                    d.t.toString() >= startDate &&
                                    d.t.toString() <= endDate &&
                                    d.delta !== null &&
                                    d.delta !== undefined
                                )
                                .map((d) => d.delta)

                              let shouldBeVisible = deltasInRange.length > 0

                              // Check against filters
                              if (shouldBeVisible) {
                                for (const delta of deltasInRange) {
                                  const minFail =
                                    pendingMinPeakDeltaFilter !== 'any' &&
                                    delta < pendingMinPeakDeltaFilter
                                  const maxFail =
                                    pendingMaxPeakDeltaFilter !== 'any' &&
                                    delta > pendingMaxPeakDeltaFilter

                                  if (minFail || maxFail) {
                                    shouldBeVisible = false
                                    break
                                  }
                                }
                              }

                              newVisibleItems[itemName] = shouldBeVisible
                            })

                            // Update the actual filter values and visible items
                            setMinPeakDeltaFilter(pendingMinPeakDeltaFilter)
                            setMaxPeakDeltaFilter(pendingMaxPeakDeltaFilter)
                            setVisibleItems(newVisibleItems)
                          }}
                          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded transition-colors">
                          Apply Filter
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Scrollable item list */}
                <div className="overflow-auto px-4 pb-4 flex-grow">
                  <div className="space-y-2">
                    {Object.entries(visibleItems)
                      .filter(([name]) =>
                        name
                          .toLowerCase()
                          .includes(visibilityFilter.toLowerCase())
                      )
                      .map(([name, isVisible]) => (
                        <label
                          key={name}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={() => {
                              setVisibleItems((prev) => ({
                                ...prev,
                                [name]: !prev[name]
                              }))
                            }}
                            className="form-checkbox h-4 w-4 text-blue-500"
                          />
                          <span
                            className="text-sm text-gray-900 dark:text-gray-100"
                            title={name}>
                            {name}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price vs Quantity Analysis Button */}
          {showItemDetails && groupData && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
              <button
                type="button"
                onClick={() =>
                  setShowPriceQuantityCharts(!showPriceQuantityCharts)
                }
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  role="img"
                  aria-label="Chart analysis icon">
                  <title>Chart analysis</title>
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                {showPriceQuantityCharts ? 'Hide' : 'Show'} Price vs Quantity
                Analysis
              </button>
            </div>
          )}

          {/* Price vs Quantity Charts */}
          {showItemDetails && showPriceQuantityCharts && groupData && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(groupData.item_data)
                  .filter(([itemId]) => {
                    const itemName = groupData.item_names[itemId]
                    return visibleItems[itemName]
                  })
                  .map(([itemId, itemData]) => (
                    <div
                      key={itemId}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <WeeklyPriceQuantityChart
                        weeklyData={itemData.weekly_data}
                        darkMode={darkMode}
                        itemName={groupData.item_names[itemId]}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Item details table - only shown when a specific group is selected */}
          {showItemDetails && groupData && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Item Details
                </h3>
                <div className="flex-1 min-w-[200px]">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    {filteredTimestamps.map((timestamp) => (
                      <option key={timestamp} value={timestamp}>
                        {formatTimestamp(timestamp)}
                      </option>
                    ))}
                  </select>
                </div>
                <DebouncedInput
                  onDebouncedChange={setGlobalFilter}
                  className="p-2 border rounded min-w-[200px]"
                  placeholder="Search items..."
                />
              </div>

              <div className="hidden md:block">
                <FullTable
                  data={Object.values(groupData.item_data)}
                  columnList={columnList}
                  globalFilter={globalFilter}
                  sortingOrder={[]}
                />
              </div>
              <div className="md:hidden">
                <MobileTable
                  data={Object.values(groupData.item_data)}
                  columnList={columnList}
                  sortingOrder={[{ id: 'itemName', desc: false }]}
                  title="Item Details"
                  rowLabels={[]}
                  columnSelectOptions={[]}
                />
              </div>

              {/* Export buttons */}
              <div className="flex gap-2 mt-4">
                <CSVButton
                  data={Object.values(groupData.item_data).map((item) => {
                    const data = getDataForTimestamp(item, selectedDate)
                    return {
                      ...item,
                      price: data?.p || 0,
                      delta: data?.delta || 0
                    }
                  })}
                  columns={[
                    { title: 'Item Name', value: 'itemName' },
                    { title: 'Item ID', value: 'itemID' },
                    {
                      title: `Price (${formatTimestamp(selectedDate)})`,
                      value: 'price'
                    },
                    {
                      title: `Delta % (${formatTimestamp(selectedDate)})`,
                      value: 'delta'
                    }
                  ]}
                  filename={`${selectedGroup}_items_${formatTimestamp(
                    selectedDate
                  )}.csv`}
                />
                <JSONButton data={Object.values(groupData.item_data)} />
              </div>
            </div>
          )}

          {/* Price vs Quantity Chart Popup */}
          {selectedItemForChart && groupData && (
            <PriceQuantityChartPopup
              onClose={() => setSelectedItemForChart(null)}
              weeklyData={groupData.item_data[selectedItemForChart].weekly_data}
              darkMode={darkMode}
              itemName={groupData.item_names[selectedItemForChart]}
            />
          )}

          {/* Request Data Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-4">
            <h3
              className={`text-lg font-medium mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>
              Request Data
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg">
              <CodeBlock
                title="Request data used for this analysis"
                buttonTitle="Copy"
                codeString={JSON.stringify(
                  {
                    region: wowRegion,
                    start_year: Number.parseInt(startDate.slice(0, 4)),
                    start_month: Number.parseInt(startDate.slice(4, 6)),
                    start_day: Number.parseInt(startDate.slice(6, 8)),
                    price_groups: Object.entries(data).map(
                      ([name, groupData]) => ({
                        name,
                        item_ids: Object.keys(groupData.item_data).map(
                          (id: string) => Number.parseInt(id)
                        ),
                        categories: []
                      })
                    )
                  },
                  null,
                  2
                )}
                onClick={() => alert('Copied to clipboard!')}>
                <p className="italic text-sm text-gray-700 dark:text-gray-300 py-2">
                  You can copy this data to recreate the same analysis later.
                </p>
              </CodeBlock>
            </div>
          </div>
        </div>
      </ContentContainer>
    </PageWrapper>
  )
}

export default Index
