import React from 'react'
import { CheckIcon } from '@heroicons/react/solid'

interface OptionsHeaderProps {
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}

const OptionsHeader: React.FC<OptionsHeaderProps> = ({
  onSubmit,
  isSubmitting
}) => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Options
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate dark:text-gray-300">
              Site Configuration
            </h2>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <span className="block">
              <button
                type="submit"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Save
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OptionsHeader
