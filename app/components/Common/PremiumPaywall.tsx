import React, { useState, useEffect } from 'react'
import { useNavigate } from '@remix-run/react'
import DiscordIcon from '~/icons/DiscordIcon'
import { refreshDiscordRoles, DISCORD_SERVER_URL } from '~/utils/premium'

interface PremiumPaywallProps {
  loaderData: {
    isLoggedIn: boolean
    hasPremium: boolean
    needsRefresh?: boolean
  }
  children: React.ReactNode
}

// Main paywall overlay component
const PaywallOverlay: React.FC<{
  isLoggedIn: boolean
  hasPremium: boolean
  needsRefresh: boolean
  isRefreshing: boolean
  onLogin: () => void
  onSubscribe: () => void
  onRefresh: () => void
}> = ({
  isLoggedIn,
  hasPremium,
  needsRefresh,
  isRefreshing,
  onLogin,
  onSubscribe,
  onRefresh
}) => (
  <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full mx-2">
    {!isLoggedIn ? (
      <DiscordNeedsLogin onLogin={onLogin} />
    ) : needsRefresh ? (
      <DiscordSessionExpired />
    ) : !hasPremium ? (
      <DiscordNeedsToSubscribe
        onSubscribe={onSubscribe}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
    ) : null}
  </div>
)

// Component for when user is not logged in
const DiscordNeedsLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
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
)

// Component for when session is refreshing
const DiscordSessionExpired: React.FC = () => (
  <>
    <DiscordIcon className="w-16 h-16 text-[#5865F2] mb-4" />
    <h2 className="text-2xl font-bold mb-2 text-center">
      Refreshing Session...
    </h2>
    <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
      Your Discord session has expired. Automatically refreshing your roles...
    </p>
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865F2]" />
    </div>
  </>
)

// Component for when user needs to subscribe
const DiscordNeedsToSubscribe: React.FC<{
  onSubscribe: () => void
  onRefresh: () => void
  isRefreshing: boolean
}> = ({ onSubscribe, onRefresh, isRefreshing }) => (
  <>
    <DiscordIcon className="w-16 h-16 text-[#5865F2] mb-4" />
    <h2 className="text-2xl font-bold mb-2 text-center">
      Subscribe to Premium to use this tool
    </h2>
    <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
      This feature is available to Saddlebag Exchange Premium subscribers. Join
      the discord server to get access to a free trial.
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
        If you just subscribed to Premium and are still seeing this message, you
        may need to refresh your roles.
      </p>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md text-xs font-medium shadow hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed mt-1">
        <DiscordIcon className="w-4 h-4 mr-2" />
        {isRefreshing ? 'Refreshing, wait a few seconds...' : 'Refresh Roles'}
      </button>
    </div>
  </>
)

const PremiumPaywall: React.FC<PremiumPaywallProps> = ({
  loaderData,
  children
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const navigate = useNavigate()

  const { isLoggedIn, hasPremium, needsRefresh = false } = loaderData

  // Determine if paywall should be shown
  const showPaywall = !isLoggedIn || !hasPremium || needsRefresh

  // Automatically refresh roles when needsRefresh is true and user is logged in
  useEffect(() => {
    if (isLoggedIn && needsRefresh && !isRefreshing) {
      const refreshRoles = async () => {
        await handleRefresh()
      }
      refreshRoles()
    }
  }, [needsRefresh, isLoggedIn])

  const handleRefresh = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    try {
      await refreshDiscordRoles()
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      console.error('Failed to refresh roles:', error)
      // Fallback to page reload
      window.location.reload()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLogin = () => {
    navigate('/discord-login')
  }

  const handleSubscribe = () => {
    window.open(DISCORD_SERVER_URL, '_blank')
  }

  // If user has access, render the content directly
  if (!showPaywall) {
    return <>{children}</>
  }

  // If user doesn't have access, show the paywall instead of the content
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
      <div className="mt-8 sm:mt-16 md:mt-24" />
      <PaywallOverlay
        isLoggedIn={isLoggedIn}
        hasPremium={hasPremium}
        needsRefresh={needsRefresh}
        isRefreshing={isRefreshing}
        onLogin={handleLogin}
        onSubscribe={handleSubscribe}
        onRefresh={handleRefresh}
      />
    </div>
  )
}

export default PremiumPaywall
