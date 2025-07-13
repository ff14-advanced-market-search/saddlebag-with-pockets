import React from 'react'
import { Form } from '@remix-run/react'
import DiscordIcon from '~/icons/DiscordIcon'
import { PREMIUM_ROLE_INFO } from '~/utils/premium'

interface DiscordAccountSectionProps {
  discordId: string | null
  discordUsername: string | null
  discordAvatar: string | null
  discordRoles: string[]
  isSubmitting: boolean
}

const DiscordAccountSection: React.FC<DiscordAccountSectionProps> = ({
  discordId,
  discordUsername,
  discordAvatar,
  discordRoles,
  isSubmitting
}) => {
  if (discordId) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {discordAvatar && (
            <img
              src={`https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.png`}
              alt="Discord Avatar"
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Connected as {discordUsername}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              Discord ID: {discordId}
            </p>
            <div className="flex space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-300">
              Roles:{' '}
              {Array.isArray(discordRoles) &&
                discordRoles
                  .filter((roleId: string) => roleId in PREMIUM_ROLE_INFO)
                  .map((roleId: string) => {
                    const roleInfo = PREMIUM_ROLE_INFO[roleId]
                    return (
                      <span
                        key={roleId}
                        title={roleInfo.name}
                        className="text-lg">
                        {roleInfo.icon}
                      </span>
                    )
                  })}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Form method="post" action="/refresh-discord-roles">
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-blue-200 dark:border-blue-500 dark:hover:bg-slate-600"
              disabled={isSubmitting}>
              {isSubmitting ? 'Refreshing...' : 'Refresh Roles'}
            </button>
          </Form>
          <Form method="post" action="/discord-disconnect">
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-slate-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-slate-500">
              Disconnect
            </button>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <DiscordIcon className="w-8 h-8 text-[#5865F2]" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Not connected to Discord
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            Connect your Discord account to access premium features
          </p>
        </div>
      </div>
      <a
        href="/discord-login"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5865F2] hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5865F2]">
        <DiscordIcon className="w-4 h-4 mr-2" />
        Connect Discord
      </a>
    </div>
  )
}

export default DiscordAccountSection
