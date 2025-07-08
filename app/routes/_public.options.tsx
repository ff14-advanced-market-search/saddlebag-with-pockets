import { CheckIcon } from '@heroicons/react/solid'
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation
} from '@remix-run/react'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json, redirect } from '@remix-run/cloudflare'
import { z } from 'zod'
import {
  commitSession,
  DATA_CENTER,
  FF14_WORLD,
  getSession,
  getUserSessionData,
  WOW_REALM_ID,
  WOW_REALM_NAME,
  WOW_REGION
} from '~/sessions'
import { Switch } from '@headlessui/react'
import { classNames } from '~/utils'
import { useDispatch } from 'react-redux'
import {
  setFFxivWorld,
  setWoWRealmData,
  toggleDarkMode
} from '~/redux/reducers/userSlice'
import { Form as RemixForm } from '@remix-run/react'
import { useTypedSelector } from '~/redux/useTypedSelector'
import React, { useState } from 'react'
import { validateServerAndRegion } from '~/utils/WoWServers'
import { validateWorldAndDataCenter } from '~/utils/locations'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import SelectDCandWorld from '~/components/form/select/SelectWorld'
import type { WoWServerData, WoWServerRegion } from '~/requests/WoW/types'
import { PageWrapper } from '~/components/Common'
import { setCookie } from '~/utils/cookies'
import Banner from '~/components/Common/Banner'
import DiscordIcon from '~/icons/DiscordIcon'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: Options Menu',
    description:
      'Set your FFXIV datacenter and server / Set your wow realm and region',
    customHeading:
      'Personalize Your FFXIV and WoW Experience with Saddlebag Exchange',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/options'
      }
    ]
  }
}

export const validator = z.object({
  data_center: z.string().min(1),
  world: z.string().min(1),
  region: z.union([z.literal('NA'), z.literal('EU')]),
  homeRealm: z.string().min(1)
})

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  const result = validator.safeParse(formPayload)

  if (!result.success) {
    return json(result)
  }

  const [homeRealmId, homeRealmName] = result.data.homeRealm.split('---')

  const session = await getSession(request.headers.get('Cookie'))

  const { server, region } = validateServerAndRegion(
    result.data.region,
    homeRealmId,
    homeRealmName
  )

  const { data_center, world } = validateWorldAndDataCenter(
    result.data.world,
    result.data.data_center
  )

  session.set(DATA_CENTER, data_center)
  session.set(FF14_WORLD, world)
  session.set(WOW_REALM_ID, server.id)
  session.set(WOW_REALM_NAME, server.name)
  session.set(WOW_REGION, region)

  const cookies = [
    setCookie(DATA_CENTER, data_center),
    setCookie(FF14_WORLD, world),
    setCookie(WOW_REALM_ID, server.id.toString()),
    setCookie(WOW_REALM_NAME, server.name),
    setCookie(WOW_REGION, region)
  ]

  // Set the new option, yeet back to index (but save against session data within the cookie)
  return redirect('/', {
    headers: [
      ['Set-Cookie', await commitSession(session)],
      ...cookies.map((cookie) => ['Set-Cookie', cookie] as [string, string])
    ]
  })
}

const OptionSection = ({
  title,
  description,
  children,
  hideHRule
}: {
  title: string
  description: string
  children: React.ReactNode
  hideHRule?: boolean
}) => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <>
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {description}
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white dark:bg-slate-700 space-y-6 sm:p-6">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!hideHRule && (
            <div className="hidden sm:block" aria-hidden="true">
              <div className="py-5">
                <div className="border-t border-gray-200" />
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const { getWorld, getDataCenter, getWoWSessionData } =
    await getUserSessionData(request)

  const data_center = getDataCenter()
  const world = getWorld()
  const { server, region } = getWoWSessionData()

  return json({
    ...session.data,
    data_center,
    world,
    wowRealm: server,
    wowRegion: region,
    discordId: session.get('discord_id'),
    discordUsername: session.get('discord_username'),
    discordAvatar: session.get('discord_avatar'),
    discordRoles: session.get('discord_roles') || []
  })
}

export default function Options() {
  const data = useLoaderData()
  const transition = useNavigation()
  const actionData = useActionData()

  const dispatch = useDispatch()
  const { darkmode } = useTypedSelector((state) => state.user)

  // Defensive: Only construct URL if window and location are defined
  let success = null
  let error = null
  if (
    typeof window !== 'undefined' &&
    window.location &&
    window.location.href
  ) {
    try {
      const url = new URL(window.location.href)
      success = url.searchParams.get('success')
      error = url.searchParams.get('error')
    } catch (e) {
      // If URL construction fails, leave success/error as null
      success = null
      error = null
    }
  }

  const [ffxivWorld, setFfxivWorld] = useState<{
    data_center: string
    world: string
  }>({ data_center: data.data_center, world: data.world })

  const [wowRealm, setWoWRealm] = useState<{
    server: WoWServerData
    region: WoWServerRegion
  }>({
    region: data.wowRegion,
    server: data.wowRealm
  })

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode())
  }

  return (
    <PageWrapper>
      <Banner />
      {(success || error) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
          {(success === 'discord_connected' ||
            success === 'discord_disconnected') && (
            <div className="rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-900 dark:border-green-700">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckIcon
                    className="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {success === 'discord_connected'
                      ? 'Successfully connected to Discord!'
                      : 'Successfully disconnected from Discord!'}
                  </p>
                </div>
              </div>
            </div>
          )}
          {error === 'discord_auth_failed' && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200 dark:bg-red-900 dark:border-red-700">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Failed to connect to Discord. Please try again.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <Form
        method="POST"
        onSubmit={(e) => {
          if (transition.state === 'submitting') {
            e.preventDefault()
            return
          }
          dispatch(setFFxivWorld(ffxivWorld))
          dispatch(setWoWRealmData(wowRealm))
        }}>
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
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <CheckIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    Save
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <OptionSection
          title="Discord Account"
          description="Connect your Discord account to access premium features and receive notifications."
          hideHRule={true}>
          {data.discordId ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {data.discordAvatar && (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${data.discordId}/${data.discordAvatar}.png`}
                    alt="Discord Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Connected as {data.discordUsername}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    Discord ID: {data.discordId}
                  </p>
                  <div className="flex space-x-2 mt-1">
                    {(() => {
                      const SPECIAL_ROLES = {
                        TEAM_ROLE_ID: '982062454433546291',
                        PATREON_ROLE_ID: '982028821186371624',
                        FANCY_ROLE_ID: '1043787711741431888',
                        SUPER_ROLE_ID: '1043787958412640296',
                        DISCORD_FANCY_ROLE_ID: '1210537409884848159',
                        DISCORD_SUPER_ROLE_ID: '1211135581619490956',
                        DISCORD_ELITE_ROLE_ID: '1211140468205944852'
                      } as const
                      type RoleKey = keyof typeof SPECIAL_ROLES
                      const roleIcons: Record<RoleKey, string> = {
                        TEAM_ROLE_ID: '🛡️',
                        PATREON_ROLE_ID: '🧡',
                        FANCY_ROLE_ID: '✨',
                        SUPER_ROLE_ID: '💎',
                        DISCORD_FANCY_ROLE_ID: '🌟',
                        DISCORD_SUPER_ROLE_ID: '🏆',
                        DISCORD_ELITE_ROLE_ID: '👑'
                      }
                      const roleNames: Record<RoleKey, string> = {
                        TEAM_ROLE_ID: 'Team',
                        PATREON_ROLE_ID: 'Patreon',
                        FANCY_ROLE_ID: 'Fancy',
                        SUPER_ROLE_ID: 'Super',
                        DISCORD_FANCY_ROLE_ID: 'Discord Fancy',
                        DISCORD_SUPER_ROLE_ID: 'Discord Super',
                        DISCORD_ELITE_ROLE_ID: 'Discord Elite'
                      }
                      return (
                        Object.entries(SPECIAL_ROLES) as [RoleKey, string][]
                      )
                        .filter(([key, id]) => data.discordRoles.includes(id))
                        .map(([key]) => (
                          <span
                            key={key}
                            title={roleNames[key]}
                            className="text-lg">
                            {roleIcons[key] || '🔑'}
                          </span>
                        ))
                    })()}
                  </div>
                </div>
              </div>
              <RemixForm method="post" action="/discord-disconnect">
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-slate-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-slate-500">
                  Disconnect
                </button>
              </RemixForm>
            </div>
          ) : (
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
          )}
        </OptionSection>
        <OptionSection
          title="FFXIV World Selection"
          description="The selected server will change what marketplace your queries are run against.">
          <SelectDCandWorld
            navigation={transition}
            sessionData={data}
            onChange={(newWorld) => {
              setFfxivWorld(newWorld)
            }}
          />
        </OptionSection>
        <OptionSection
          title="WoW Home Realm Selection"
          description="Your region and home realm that will be the default on WoW queries.">
          <RegionAndServerSelect
            region={data.wowRegion}
            defaultRealm={data.wowRealm}
            serverSelectFormName="homeRealm"
            onServerSelectChange={(newServer) => {
              if (newServer) {
                setWoWRealm((state) => ({ ...state, server: newServer }))
              }
            }}
            regionOnChange={(newRegion) => {
              if (newRegion) {
                setWoWRealm((state) => ({ ...state, region: newRegion }))
              }
            }}
          />
        </OptionSection>
        <OptionSection
          title="Theme"
          description="Needs more sparkles.. ✨✨✨✨">
          <Switch.Group
            as={`div`}
            className={`flex items-center justify-between`}>
            <span className={`flex-grow flex flex-col`}>
              <Switch.Label
                as={`span`}
                className={`txt-sm font-meidum text-gray-900 dark:text-gray-100`}
                passive>
                Enable Dark Mode
              </Switch.Label>
              <Switch.Description
                as={`span`}
                className={`text-sm text-gray-500 dark:text-gray-300`}>
                I confirm, I have weak eyeballs.
              </Switch.Description>
            </span>
            {typeof document !== 'undefined' && (
              <Switch
                key={darkmode.toString()}
                checked={darkmode}
                onChange={handleDarkModeToggle}
                className={classNames(
                  darkmode ? `bg-black` : `bg-gray-200`,
                  `relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`
                )}>
                <span
                  aria-hidden={true}
                  className={classNames(
                    darkmode ? `translate-x-5` : `translate-x-0`,
                    `pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`
                  )}
                />
              </Switch>
            )}
          </Switch.Group>
        </OptionSection>
      </Form>
    </PageWrapper>
  )
}
