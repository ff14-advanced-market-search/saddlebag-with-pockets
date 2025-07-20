import { useLoaderData, useNavigation, useFetcher } from '@remix-run/react'
import type {
  LoaderFunction,
  MetaFunction,
  ActionFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { z } from 'zod'
import {
  getSession,
  getUserSessionData,
  commitSession,
  DATA_CENTER,
  FF14_WORLD,
  WOW_REALM_ID,
  WOW_REALM_NAME,
  WOW_REGION
} from '~/sessions'
import { useDispatch } from 'react-redux'
import { setCookie } from '~/utils/cookies'
import {
  setFFxivWorld,
  setWoWRealmData,
  toggleDarkMode
} from '~/redux/reducers/userSlice'
import { useTypedSelector } from '~/redux/useTypedSelector'
import React from 'react'
import { validateServerAndRegion } from '~/utils/WoWServers'
import { validateWorldAndDataCenter } from '~/utils/locations'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import SelectDCandWorld from '~/components/form/select/SelectWorld'
import type { WoWServerData, WoWServerRegion } from '~/requests/WoW/types'
import { PageWrapper, Banner } from '~/components/Common'
import {
  DiscordAccountSection,
  StatusBanner,
  ThemeSection,
  OptionsHeader
} from '~/components/Options'
import { getWindowUrlParams } from '~/utils/urlHelpers'

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

  // Save the session and cookies without redirecting
  return json(
    { success: true },
    {
      headers: [
        ['Set-Cookie', await commitSession(session)],
        ...cookies.map((cookie) => ['Set-Cookie', cookie] as [string, string])
      ]
    }
  )
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

/**
 * Renders the options page, allowing users to configure Discord integration, FFXIV world, WoW home realm, and theme preferences.
 *
 * Displays current connection status, premium Discord roles, and provides forms for updating user settings. Handles form submission, state management, and displays feedback banners for Discord-related actions.
 *
 * @returns The options page React element.
 */
export default function Options() {
  const data = useLoaderData()
  const transition = useNavigation()
  const fetcher = useFetcher()

  const dispatch = useDispatch()
  const { darkmode, wowRealm } = useTypedSelector((state) => state.user)

  // Extract URL parameters for success/error messages
  const { success, error } = getWindowUrlParams()

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode())
  }

  const handleFFXIVWorldChange = (newWorld: {
    data_center: string
    world: string
  }) => {
    dispatch(setFFxivWorld(newWorld))
    // Also save to session
    const formData = new FormData()
    formData.append('data_center', newWorld.data_center)
    formData.append('world', newWorld.world)
    formData.append('region', data.wowRegion)
    formData.append('homeRealm', `${data.wowRealm.id}---${data.wowRealm.name}`)
    fetcher.submit(formData, { method: 'POST' })
  }

  const handleWoWRealmChange = (newRealm: {
    server: WoWServerData
    region: WoWServerRegion
  }) => {
    dispatch(setWoWRealmData(newRealm))
    // Also save to session
    const formData = new FormData()
    formData.append('data_center', data.data_center)
    formData.append('world', data.world)
    formData.append('region', newRealm.region)
    formData.append(
      'homeRealm',
      `${newRealm.server.id}---${newRealm.server.name}`
    )
    fetcher.submit(formData, { method: 'POST' })
  }

  // Show success message when fetcher completes successfully
  const showSaveSuccess =
    fetcher.state === 'idle' && fetcher.data?.success ? 'settings_saved' : null

  return (
    <PageWrapper>
      <Banner />
      {(success || error || showSaveSuccess) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
          <StatusBanner success={success || showSaveSuccess} error={error} />
        </div>
      )}
      <div>
        <OptionsHeader isSubmitting={fetcher.state === 'submitting'} />
        <OptionSection
          title="Discord Account"
          description="Connect your Discord account to access premium features and receive notifications."
          hideHRule={true}>
          <DiscordAccountSection
            discordId={data.discordId}
            discordUsername={data.discordUsername}
            discordAvatar={data.discordAvatar}
            discordRoles={data.discordRoles}
            isSubmitting={transition.state === 'submitting'}
          />
        </OptionSection>
        <OptionSection
          title="Theme"
          description="Needs more sparkles.. ✨✨✨✨">
          <ThemeSection
            darkMode={darkmode}
            onDarkModeToggle={handleDarkModeToggle}
          />
        </OptionSection>
        <OptionSection
          title="FFXIV World Selection"
          description="The selected server will change what marketplace your queries are run against.">
          <SelectDCandWorld
            navigation={transition}
            sessionData={data}
            onChange={handleFFXIVWorldChange}
          />
        </OptionSection>
        <OptionSection
          title="WoW Home Realm Selection"
          description="Your region and home realm that will be the default on WoW queries.">
          <RegionAndServerSelect
            region={wowRealm.region}
            defaultRealm={wowRealm.server}
            serverSelectFormName="homeRealm"
            onServerSelectChange={(newServer) => {
              if (newServer) {
                handleWoWRealmChange({ ...wowRealm, server: newServer })
              }
            }}
            regionOnChange={(newRegion) => {
              if (newRegion) {
                // When region changes, we need to find a valid server in the new region
                // Try to find the same server name in the new region, or use a default
                const { server, region } = validateServerAndRegion(
                  newRegion,
                  wowRealm.server.id,
                  wowRealm.server.name
                )
                handleWoWRealmChange({ server, region })
              }
            }}
          />
        </OptionSection>
      </div>
    </PageWrapper>
  )
}
