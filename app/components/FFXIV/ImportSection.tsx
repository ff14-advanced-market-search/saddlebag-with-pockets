import { useState } from 'react'
import type { ImportData } from '~/requests/FFXIV/types'

interface ImportSectionProps {
  onImport: (data: ImportData) => void
}

export default function ImportSection({ onImport }: ImportSectionProps) {
  const [error, setError] = useState<string | undefined>(undefined)

  const handleImport = () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result
            if (typeof content !== 'string') {
              setError('Invalid file content')
              return
            }

            const data = JSON.parse(content)
            onImport(data)
            setError(undefined)
          } catch (err) {
            setError('Failed to parse file content')
          }
        }
        reader.readAsText(file)
      }
      input.click()
    } catch (err) {
      setError('Failed to import configuration')
    }
  }

  return (
    <div className="flex justify-end mb-2">
      <button
        type="button"
        onClick={handleImport}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <svg
          className="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Import Configuration
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  )
}
