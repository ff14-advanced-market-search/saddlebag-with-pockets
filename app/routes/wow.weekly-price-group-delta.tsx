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
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { WoWLoaderData } from '~/requests/WoW/types'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { getUserSessionData } from '~/sessions'
import type { ColumnList } from '~/components/types'
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
import PriceQuantityChartPopup from '~/components/Charts/PriceQuantityChartPopup'
import ErrorPopup from '~/components/Common/ErrorPopup'
import { getWowheadLink } from '~/components/utilities/getWowheadLink'
import DateRangeControls from '~/components/WoW/DateRangeControls'
import ItemDetailsTable from '~/components/WoW/ItemDetailsTable'
import GroupSelector from '~/components/WoW/GroupSelector'
import DeltaChartContainer from '~/components/WoW/DeltaChartContainer'
import PriceQuantityAnalysis from '~/components/WoW/PriceQuantityAnalysis'
import RequestDataSection from '~/components/WoW/RequestDataSection'

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
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [minYAxis, setMinYAxis] = useState<number | null>(null)
  const [maxYAxis, setMaxYAxis] = useState<number | null>(null)
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({})
  const [showPriceQuantityCharts, setShowPriceQuantityCharts] = useState(false)
  const [selectedItemForChart, setSelectedItemForChart] = useState<
    string | null
  >(null)
  const [visibilityFilter, setVisibilityFilter] = useState('')

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
          {/* Search Again Link */}
          <div className="flex justify-between items-center">
            <a
              href="/wow/weekly-price-group-delta"
              className="text-blue-500 hover:text-blue-600 font-medium">
              ← Search Again
            </a>
          </div>

          {/* Date Range Controls */}
          <DateRangeControls
            startDate={startDate}
            endDate={endDate}
            allTimestamps={allTimestamps}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            formatTimestamp={formatTimestamp}
          />

          {/* Group selector */}
          <GroupSelector
            selectedGroup={selectedGroup}
            groups={Object.keys(data)}
            onGroupSelect={setSelectedGroup}
            darkMode={darkMode}
          />

          {/* Chart and Controls Container */}
          <DeltaChartContainer
            data={data}
            selectedGroup={selectedGroup}
            startDate={startDate}
            endDate={endDate}
            darkMode={darkMode}
            minYAxis={minYAxis}
            maxYAxis={maxYAxis}
            onMinYAxisChange={setMinYAxis}
            onMaxYAxisChange={setMaxYAxis}
            visibleItems={visibleItems}
            visibilityFilter={visibilityFilter}
            onVisibleItemsChange={setVisibleItems}
            onVisibilityFilterChange={setVisibilityFilter}
            filteredTimestamps={filteredTimestamps}
            formatTimestamp={formatTimestamp}
          />

          {/* Price vs Quantity Analysis */}
          {showItemDetails && groupData && (
            <PriceQuantityAnalysis
              showPriceQuantityCharts={showPriceQuantityCharts}
              setShowPriceQuantityCharts={setShowPriceQuantityCharts}
              groupData={groupData}
              visibleItems={visibleItems}
              darkMode={darkMode}
            />
          )}

          {/* Item details table */}
          {showItemDetails && groupData && (
            <ItemDetailsTable
              data={Object.values(groupData.item_data)}
              columnList={columnList}
              selectedDate={selectedDate}
              formatTimestamp={formatTimestamp}
              selectedGroup={selectedGroup}
              setSelectedDate={setSelectedDate}
              filteredTimestamps={filteredTimestamps}
              getDataForTimestamp={getDataForTimestamp}
            />
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
          <RequestDataSection
            data={data}
            wowRegion={wowRegion}
            startDate={startDate}
            darkMode={darkMode}
          />
        </div>
      </ContentContainer>
    </PageWrapper>
  )
}

export default Index
