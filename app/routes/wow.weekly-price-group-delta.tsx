import { json } from '@remix-run/cloudflare'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  LinksFunction
} from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useState, useEffect } from 'react'
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
    href: 'data:text/css,' + encodeURIComponent(styles)
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
  const startYear = parseInt(formData.get('startYear') as string)
  const startMonth = parseInt(formData.get('startMonth') as string)
  const startDay = parseInt(formData.get('startDay') as string)
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
    return 'Price group name must be less than 64 characters'
  }

  // Validate name characters
  if (!VALID_NAME_REGEX.test(group.name)) {
    return 'Price group name can only contain alphanumeric characters, periods, commas, spaces, hyphens, and underscores'
  }

  // Check if both item_ids and categories are empty
  if (group.item_ids.length === 0 && group.categories.length === 0) {
    return 'Price group must have at least one item or category'
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
          <h3 className="text-lg font-medium">Import Configuration</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Paste your JSON configuration:
            </label>
            <textarea
              className="w-full h-64 p-2 border rounded font-mono text-sm dark:bg-gray-700 dark:border-gray-600"
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value)
                setError(undefined)
              }}
              placeholder="Paste your JSON here..."
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
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

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
      return
    }

    // Check if there are any price groups
    if (priceGroups.length === 0) {
      e.preventDefault()
      setError('Please add at least one price group')
      return
    }

    // Validate all price groups before submission
    for (const group of priceGroups) {
      const validationError = validatePriceGroup(group)
      if (validationError) {
        e.preventDefault()
        setError(validationError)
        return
      }
    }

    setError(undefined)
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
        title={pageTitle}
        loading={transition.state === 'submitting'}
        error={error}
        onClick={(e) => e.preventDefault()}>
        <form method="post" className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowImport(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
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
              onChange={(e) => setStartYear(parseInt(e.target.value))}
              min={2020}
              max={2090}
            />
            <InputWithLabel
              labelTitle="Start Month"
              name="startMonth"
              type="number"
              value={startMonth}
              onChange={(e) => setStartMonth(parseInt(e.target.value))}
              min={1}
              max={12}
            />
            <InputWithLabel
              labelTitle="Start Day"
              name="startDay"
              type="number"
              value={startDay}
              onChange={(e) => setStartDay(parseInt(e.target.value))}
              min={1}
              max={31}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Price Groups</h3>
            <div className="flex justify-center my-8">
              <button
                type="submit"
                onClick={onSubmit}
                disabled={transition.state === 'submitting'}
                className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 pulse">
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
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                priceGroups.length >= MAX_PRICE_GROUPS
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={handleAddPriceGroup}
              disabled={priceGroups.length >= MAX_PRICE_GROUPS}>
              Add Price Group
            </button>
          </div>

          <input
            type="hidden"
            name="priceGroups"
            value={JSON.stringify(priceGroups)}
          />

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Request Data Preview</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <CodeBlock
                title="Input for weekly price group delta"
                buttonTitle="Copy"
                codeString={JSON.stringify(requestData, null, 2)}
                onClick={() => alert('Copied to clipboard!')}>
                <p className="italic text-sm text-blue-900 dark:text-gray-100 py-2">
                  This is the data that will be sent to the API when you submit
                  the form.
                </p>
              </CodeBlock>
            </div>
          </div>

          <div className="flex justify-center my-8">
            <button
              type="submit"
              onClick={onSubmit}
              disabled={transition.state === 'submitting'}
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 pulse">
              {transition.state === 'submitting'
                ? 'Searching...'
                : 'Search Price Groups'}
            </button>
          </div>
        </form>
      </SmallFormContainer>
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
  const [maxThreshold, setMaxThreshold] = useState<number>(Infinity)
  const [minThreshold, setMinThreshold] = useState<number>(-Infinity)
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({})

  // Get all unique timestamps across all groups
  const allTimestamps = Array.from(
    new Set(
      Object.values(data).flatMap((groupData) => Object.keys(groupData.deltas))
    )
  ).sort()

  // Initialize selected date to latest timestamp
  useEffect(() => {
    if (allTimestamps.length > 0 && !selectedDate) {
      setSelectedDate(allTimestamps[allTimestamps.length - 1])
    }
  }, [allTimestamps])

  // Format timestamp into YYYY-MM-DD
  const formatTimestamp = (timestamp: string) => {
    const dateStr = timestamp.padStart(8, '0') // Ensure 8 digits
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    return `${year}-${month}-${day}`
  }

  // Threshold options
  const maxThresholdOptions = [
    { label: 'No limit', value: Infinity },
    { label: 'Above 4000%', value: 4000 },
    { label: 'Above 3000%', value: 3000 },
    { label: 'Above 2000%', value: 2000 },
    { label: 'Above 1000%', value: 1000 },
    { label: 'Above 500%', value: 500 },
    { label: 'Above 400%', value: 400 },
    { label: 'Above 300%', value: 300 },
    { label: 'Above 200%', value: 200 },
    { label: 'Above 100%', value: 100 },
    { label: 'Above 0%', value: 0 },
    { label: 'Below -25%', value: -25 },
    { label: 'Below -50%', value: -50 },
    { label: 'Below -75%', value: -75 },
    { label: 'Below -85%', value: -85 },
    { label: 'Below -95%', value: -95 },
    { label: 'Below -100%', value: -100 }
  ]

  const minThresholdOptions = [
    { label: 'Above 4000%', value: 4000 },
    { label: 'Above 3000%', value: 3000 },
    { label: 'Above 2000%', value: 2000 },
    { label: 'Above 1000%', value: 1000 },
    { label: 'Above 500%', value: 500 },
    { label: 'Above 400%', value: 400 },
    { label: 'Above 300%', value: 300 },
    { label: 'Above 200%', value: 200 },
    { label: 'Above 100%', value: 100 },
    { label: 'Above 0%', value: 0 },
    { label: 'Below -25%', value: -25 },
    { label: 'Below -50%', value: -50 },
    { label: 'Below -75%', value: -75 },
    { label: 'Below -85%', value: -85 },
    { label: 'Below -95%', value: -95 },
    { label: 'Below -100%', value: -100 },
    { label: 'No limit', value: -Infinity }
  ]

  // Function to check if an item's performance is within thresholds
  const isItemInRange = (itemData: ItemData) => {
    // Skip the first data point which is always 0
    const relevantData = itemData.weekly_data.slice(1)
    const deltas = relevantData.map((d) => d.delta)

    // Check if ALL points are above minThreshold and NO points are above maxThreshold
    return (
      deltas.every((delta) => delta >= minThreshold) &&
      deltas.every((delta) => delta <= maxThreshold)
    )
  }

  // Update visible items based on thresholds
  useEffect(() => {
    if (selectedGroup === 'All') {
      // For 'All' view, check group averages
      const newVisibleItems: Record<string, boolean> = {}
      Object.entries(data).forEach(([groupName, groupData]) => {
        const values = Object.values(groupData.deltas)
          .slice(1) // Skip first value
          .filter((v) => v !== undefined && v !== null)

        const isInRange =
          values.every((v) => v >= minThreshold) &&
          values.every((v) => v <= maxThreshold)
        newVisibleItems[groupName] = isInRange
      })
      setVisibleItems(newVisibleItems)
    } else {
      // For specific group view
      const groupData = data[selectedGroup]
      const newVisibleItems: Record<string, boolean> = {
        [`${selectedGroup} (Average)`]: true // Always show average line
      }

      Object.entries(groupData.item_data).forEach(([itemId, itemData]) => {
        const itemName = groupData.item_names[itemId]
        newVisibleItems[itemName] = isItemInRange(itemData)
      })
      setVisibleItems(newVisibleItems)
    }
  }, [selectedGroup, data, minThreshold, maxThreshold])

  const styles = darkMode
    ? {
        backgroundColor: '#334155',
        color: 'white',
        hoverColor: '#f8f8f8'
      }
    : {}

  // Modified generateSeriesData to use visibility state and performance threshold
  const generateSeriesData = () => {
    if (selectedGroup === 'All') {
      return Object.entries(data)
        .filter(([groupName]) => visibleItems[groupName])
        .map(([groupName, groupData]) => {
          // Calculate average performance for the group
          const values = Object.values(groupData.deltas).filter(
            (v) => v !== undefined && v !== null
          )
          const avgPerformance =
            values.length > 0
              ? values.reduce((a, b) => a + b, 0) / values.length
              : 0

          // Only include if above threshold
          if (avgPerformance >= maxThreshold) {
            return {
              name: groupName,
              data: allTimestamps.map((timestamp) => {
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
    } else {
      const groupData = data[selectedGroup]
      const series = []

      // Add average line if visible
      if (visibleItems[`${selectedGroup} (Average)`]) {
        const values = Object.values(groupData.deltas).filter(
          (v) => v !== undefined && v !== null
        )
        const avgPerformance =
          values.length > 0
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0

        if (avgPerformance >= maxThreshold) {
          series.push({
            name: `${selectedGroup} (Average)`,
            data: allTimestamps.map((timestamp) => {
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
        if (visibleItems[itemName]) {
          // Calculate average performance for the item
          const values = itemData.weekly_data
            .map((d) => d.delta)
            .filter((v) => v !== undefined && v !== null)
          const avgPerformance =
            values.length > 0
              ? values.reduce((a, b) => a + b, 0) / values.length
              : 0

          if (avgPerformance >= maxThreshold) {
            series.push({
              name: itemName,
              data: allTimestamps.map((timestamp) => {
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
        }
      })

      return series
    }
  }

  // Modified chart options
  const deltaChartOptions: Options = {
    chart: {
      type: 'line',
      backgroundColor: styles?.backgroundColor,
      style: {
        fontFamily:
          '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      },
      // Add height based on number of series when viewing a specific group
      height:
        selectedGroup !== 'All'
          ? Math.max(
              600,
              Object.keys(data[selectedGroup].item_data).length * 30 + 400
            )
          : 600
    },
    title: {
      text:
        selectedGroup === 'All'
          ? 'All Groups - Weekly Price Deltas'
          : `${selectedGroup} - Weekly Price Deltas`,
      style: { color: styles?.color }
    },
    xAxis: {
      categories: allTimestamps.map(formatTimestamp),
      labels: {
        style: { color: styles?.color },
        rotation: -45,
        formatter: function () {
          return this.value as string
        }
      },
      title: { text: 'Week', style: { color: styles?.color } }
    },
    yAxis: {
      title: {
        text: 'Price Change %',
        style: { color: styles?.color }
      },
      labels: { style: { color: styles?.color } },
      min: -100,
      softMin: -100
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<b>{point.key}</b><br/>',
      // Custom formatter to sort points by value
      formatter: function () {
        if (!this.points) return ''

        // Sort points by value (delta) in descending order
        const sortedPoints = this.points
          .filter((point) => point.y !== null && point.y !== undefined)
          .sort((a, b) => (b.y || 0) - (a.y || 0))

        let s = `<b>${this.x}</b><br/>`

        // Add each point's data
        sortedPoints.forEach((point) => {
          s += `<span style="color:${point.color}">●</span> ${
            point.series.name
          }: <b>${point.y?.toFixed(2)}%</b><br/>`
        })

        return s
      },
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      style: {
        color: darkMode ? '#ffffff' : '#000000'
      },
      padding: 8,
      // Ensure tooltip doesn't get cut off at screen edges
      followPointer: true,
      outside: true
    },
    plotOptions: {
      series: {
        connectNulls: true,
        marker: {
          enabled: true,
          radius: 3
        },
        events: {
          // Ensure all series remain visible when clicking legend items
          legendItemClick: function () {
            if (selectedGroup !== 'All') {
              return false // Prevent toggling visibility
            }
            return true // Allow toggling for All Groups view
          },
          point: {
            events: {
              click: function () {
                const timestamp = allTimestamps[this.index]
                setSelectedDate(timestamp)
              }
            }
          }
        }
      }
    },
    series: generateSeriesData(),
    legend: {
      itemStyle: { color: styles?.color },
      itemHoverStyle: { color: styles?.hoverColor },
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      maxHeight:
        selectedGroup !== 'All'
          ? Math.floor(
              Object.keys(data[selectedGroup].item_data).length * 30 + 200
            )
          : 300,
      itemMarginTop: 4,
      itemMarginBottom: 4,
      symbolRadius: 2,
      symbolHeight: 8,
      symbolWidth: 8
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
    { columnId: 'itemID', header: 'Item ID' },
    {
      columnId: 'price',
      header: `Price (${formatTimestamp(selectedDate)})`,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? data.p.toLocaleString() : 'N/A'}</span>
      },
      sortingFn: (a, b) => {
        const aData = getDataForTimestamp(a, selectedDate)
        const bData = getDataForTimestamp(b, selectedDate)
        return (aData?.p || 0) - (bData?.p || 0)
      }
    },
    {
      columnId: 'delta',
      header: `Delta % (${formatTimestamp(selectedDate)})`,
      accessor: ({ row }) => {
        const data = getDataForTimestamp(row, selectedDate)
        return <span>{data ? `${data.delta.toFixed(2)}%` : 'N/A'}</span>
      },
      sortingFn: (a, b) => {
        const aData = getDataForTimestamp(a, selectedDate)
        const bData = getDataForTimestamp(b, selectedDate)
        return (aData?.delta || 0) - (bData?.delta || 0)
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
          </div>
        )
      }
    }
  ]

  // Add new performance range controls component
  const renderPerformanceRangeControls = () => (
    <div className="flex flex-col gap-2 p-4 border-b dark:border-gray-600">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">Max %:</label>
        <select
          value={maxThreshold}
          onChange={(e) => setMaxThreshold(Number(e.target.value))}
          className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm">
          {maxThresholdOptions.map(({ label, value }) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">Min %:</label>
        <select
          value={minThreshold}
          onChange={(e) => setMinThreshold(Number(e.target.value))}
          className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm">
          {minThresholdOptions.map(({ label, value }) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <PageWrapper>
      <Title title={pageTitle} />
      <ContentContainer>
        <div className="space-y-4">
          {/* Search Again Link */}
          <div className="flex justify-between items-center">
            <a
              href="/wow/weekly-price-group-delta"
              className="text-blue-500 hover:text-blue-600 font-medium">
              ← Search Again
            </a>
          </div>

          {/* Group selector */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setSelectedGroup('All')}
              className={`w-full p-2 text-left rounded ${
                selectedGroup === 'All'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              All Groups
            </button>
            {Object.keys(data).map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`w-full p-2 text-left rounded ${
                  selectedGroup === group
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
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
              <div className="md:w-72 flex flex-col bg-gray-50 dark:bg-gray-700 rounded">
                {renderPerformanceRangeControls()}
                <h4 className="font-medium p-4 pb-2">Show/Hide Items</h4>
                <div
                  className="flex-1 overflow-auto p-4 pt-2"
                  style={{
                    maxHeight:
                      selectedGroup !== 'All'
                        ? Math.max(
                            600,
                            Object.keys(data[selectedGroup].item_data).length *
                              30 +
                              400
                          )
                        : 600
                  }}>
                  <div className="space-y-2">
                    {Object.entries(visibleItems).map(([name, isVisible]) => (
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
                        <span className="text-sm" title={name}>
                          {name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Item details table - only shown when a specific group is selected */}
          {showItemDetails && groupData && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <h3 className="text-lg font-medium">Item Details</h3>
                <div className="flex-1 min-w-[200px]">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    {allTimestamps.map((timestamp) => (
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

          {/* Request Data Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-4">
            <h3 className="text-lg font-medium mb-4">Request Data</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg">
              <CodeBlock
                title="Request data used for this analysis"
                buttonTitle="Copy"
                codeString={JSON.stringify(
                  {
                    region: wowRegion,
                    start_year: parseInt(allTimestamps[0].slice(0, 4)),
                    start_month: parseInt(allTimestamps[0].slice(4, 6)),
                    start_day: parseInt(allTimestamps[0].slice(6, 8)),
                    price_groups: Object.entries(data).map(
                      ([name, groupData]) => ({
                        name,
                        item_ids: Object.keys(groupData.item_data).map((id) =>
                          parseInt(id)
                        ),
                        categories: []
                      })
                    )
                  },
                  null,
                  2
                )}
                onClick={() => alert('Copied to clipboard!')}>
                <p className="italic text-sm text-blue-900 dark:text-gray-100 py-2">
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
