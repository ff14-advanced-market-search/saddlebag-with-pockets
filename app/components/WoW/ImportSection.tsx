import { useState } from 'react'
import type { PriceGroup } from '~/requests/WoW/WeeklyPriceGroupDelta'

interface ImportData {
  region?: string
  start_year?: number
  start_month?: number
  start_day?: number
  price_groups?: PriceGroup[]
}

interface ImportSectionProps {
  onImport: (data: ImportData) => void
}

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

export default function ImportSection({ onImport }: ImportSectionProps) {
  const [showImport, setShowImport] = useState(false)
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
      setShowImport(false)
      setJsonInput('')
      setError(undefined)
    } catch (e) {
      setError('Invalid JSON format')
    }
  }

  return (
    <>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Import Configuration
              </h3>
              <button
                onClick={() => setShowImport(false)}
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
                  onClick={() => setShowImport(false)}
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
      )}
    </>
  )
}
