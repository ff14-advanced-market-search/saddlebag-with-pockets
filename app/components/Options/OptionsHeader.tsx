import React from 'react'

interface OptionsHeaderProps {
  isSubmitting: boolean
}

const OptionsHeader: React.FC<OptionsHeaderProps> = ({ isSubmitting }) => {
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
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isSubmitting ? 'Saving...' : 'Changes are saved automatically'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OptionsHeader
