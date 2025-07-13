import React from 'react'
import { CheckIcon } from '@heroicons/react/solid'

interface StatusBannerProps {
  success?: string | null
  error?: string | null
}

const StatusBanner: React.FC<StatusBannerProps> = ({ success, error }) => {
  if (!success && !error) return null

  const isDiscordSuccess =
    success === 'discord_connected' ||
    success === 'discord_disconnected' ||
    success === 'discord_roles_refreshed'

  const isDiscordError =
    error === 'discord_auth_failed' || error === 'discord_roles_refresh_failed'

  if (success && isDiscordSuccess) {
    return (
      <div className="rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-900 dark:border-green-700">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {success === 'discord_connected'
                ? 'Successfully connected to Discord!'
                : success === 'discord_disconnected'
                ? 'Successfully disconnected from Discord!'
                : 'Successfully refreshed Discord roles!'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error && isDiscordError) {
    return (
      <div className="rounded-md bg-red-50 p-4 border border-red-200 dark:bg-red-900 dark:border-red-700">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              role="img">
              <title>Error icon</title>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {error === 'discord_auth_failed'
                ? 'Failed to connect to Discord. Please try again.'
                : 'Failed to refresh Discord roles. Please try again.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default StatusBanner
