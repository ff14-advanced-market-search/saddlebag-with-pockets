import React, { useState } from 'react'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'
import { ToolTip } from '~/components/Common/InfoToolTip'

interface EarlyAccessTokenSectionProps {
  earlyAccessToken: string
  onTokenChange: (token: string) => void
  isSubmitting?: boolean
}

const EarlyAccessTokenSection: React.FC<EarlyAccessTokenSectionProps> = ({
  earlyAccessToken,
  onTokenChange,
  isSubmitting = false
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow alphanumeric characters
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '')
    onTokenChange(alphanumericValue)
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Enter your early access token to unlock premium features. This is
          givent to you by the Saddlebag Exchange team if you win an Elite
          Auction. See the discord for more details.
        </p>
      </div>
      <div className="mt-2 flex-col">
        <div className="relative flex flex-1 items-center gap-1">
          <label
            htmlFor="earlyAccessToken"
            className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Early Access Token
          </label>
          <ToolTip data="An alphanumeric string that grants early access to premium features" />
        </div>
        <div className="mt-1 flex rounded-md shadow-sm border border-gray-300 dark:border-gray-400">
          <input
            id="earlyAccessToken"
            type={isVisible ? 'text' : 'password'}
            value={earlyAccessToken}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter your token"
            maxLength={255}
            className="p-2 w-full border-0 rounded-l-md focus:ring-blue-500 focus:border-2 focus:border-blue-500 dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
          />
          <button
            type="button"
            onClick={toggleVisibility}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-3 rounded-r-md bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={isVisible ? 'Hide token' : 'Show token'}>
            {isVisible ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EarlyAccessTokenSection
