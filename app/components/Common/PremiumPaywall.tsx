import React, { useState, useEffect } from 'react'
import DiscordIcon from '~/icons/DiscordIcon'
import { refreshDiscordRoles } from '~/utils/premium'

interface PremiumPaywallProps {
  show: boolean
  isLoggedIn: boolean
  hasPremium: boolean
  needsRefresh?: boolean
  onLogin: () => void
  onSubscribe: () => void
  onRefresh?: () => void
  children: React.ReactNode
}

const PremiumPaywall: React.FC<PremiumPaywallProps> = ({
  show,
  isLoggedIn,
  hasPremium,
  needsRefresh = false,
  onLogin,
  onSubscribe,
  onRefresh,
  children
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Automatically refresh roles when needsRefresh is true
  useEffect(() => {
    if (needsRefresh && !isRefreshing) {
      ;(async () => {
        await handleRefresh()
      })()
    }
  }, [needsRefresh])

  const handleRefresh = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    try {
      await refreshDiscordRoles()
    } catch (error) {
      console.error('Failed to refresh roles:', error)
      // Fallback to the original onRefresh if provided
      if (onRefresh) {
        onRefresh()
      }
    } finally {
      setIsRefreshing(false)
    }
  }
  if (!show) return <>{children}</>

  return (
    <div className="relative">
      <div className="pointer-events-none filter blur-sm select-none opacity-60">
        {children}
      </div>
      <div
        className="absolute top-0 left-0 w-full h-full z-20 flex flex-col items-center justify-center bg-black bg-opacity-60"
        style={{ pointerEvents: 'auto' }}>
        <div className="mt-8 sm:mt-16 md:mt-24" />
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sm:p-8 flex flex-col items-center max-w-md w-full mx-2">
          {!isLoggedIn ? (
            <>
              <DiscordIcon className="w-16 h-16 text-[#5865F2] mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-center">
                Log in with Discord to access this tool
              </h2>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                You must be logged in with Discord to use this feature.
              </p>
              <button
                type="button"
                onClick={onLogin}
                className="flex items-center px-6 py-3 bg-[#5865F2] text-white rounded-md text-lg font-semibold shadow hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5865F2]">
                <DiscordIcon className="w-6 h-6 mr-2" />
                Log in with Discord
              </button>
            </>
          ) : needsRefresh ? (
            <>
              <DiscordIcon className="w-16 h-16 text-[#5865F2] mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-center">
                Refreshing Session...
              </h2>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                Your Discord session has expired. Automatically refreshing your
                roles...
              </p>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865F2]"></div>
              </div>
            </>
          ) : !hasPremium ? (
            <>
              <DiscordIcon className="w-16 h-16 text-[#5865F2] mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-center">
                Subscribe to Premium to use this tool
              </h2>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                This feature is available to Saddlebag Exchange Premium
                subscribers.
              </p>
              <button
                type="button"
                onClick={onSubscribe}
                className="flex items-center px-6 py-3 bg-[#5865F2] text-white rounded-md text-lg font-semibold shadow hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5865F2] mb-6">
                <DiscordIcon className="w-6 h-6 mr-2" />
                Subscribe on Discord
              </button>
              <div className="w-full flex flex-col items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs mb-2">
                  If you just subscribed to Premium and are still seeing this
                  message, you may need to refresh your roles.
                </p>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md text-xs font-medium shadow hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed mt-1">
                  <DiscordIcon className="w-4 h-4 mr-2" />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Roles'}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default PremiumPaywall
