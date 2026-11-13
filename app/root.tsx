import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { redirect, json } from '@remix-run/cloudflare'
import styles from './tailwind.css'
import overrides from './base.css'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useSubmit
} from '@remix-run/react'
import Sidebar from '~/components/navigation/sidebar'
import {
  getUserSessionData,
  getSession,
  commitSession
} from '~/sessions.server'
import {
  DATA_CENTER,
  FF14_WORLD,
  WOW_FOREVER_FACTION,
  WOW_FOREVER_REGION,
  WOW_REGION,
  WOW_REALM_ID,
  WOW_REALM_NAME
} from '~/sessions'
import {
  EnsureThemeApplied,
  startThemeSync
} from '~/utils/providers/theme-provider'
import { store } from '~/redux/store'
import { Provider, useDispatch } from 'react-redux'
import { useTypedSelector } from './redux/useTypedSelector'
import { useEffect } from 'react'
import type { WoWServerRegion } from './requests/WoW/types'
import type { WoWForeverSettings } from './utils/WoWForever'
import { validateWoWForeverSettings } from './utils/WoWForever'
import { z } from 'zod'
import { validateWorldAndDataCenter } from './utils/locations'
import { validateServerAndRegion } from './utils/WoWServers'
import ErrorBounds from './components/utilities/ErrorBoundary'
import {
  setFFxivWorld,
  setWoWForeverSettings,
  setWoWRealmData
} from './redux/reducers/userSlice'
import {
  getFFWorldDataFromLocalStorage,
  setFFWorldDataInLocalStorage
} from './redux/localStorage/ffxivWorldDataHelpers'
import {
  getWoWRealmDataFromLocalStorage,
  setWoWRealmDataInLocalStorage
} from './redux/localStorage/wowRealmHelpers'
import {
  getSavedWoWForeverSettingsFromLocalStorage,
  setWoWForeverSettingsInLocalStorage
} from './redux/localStorage/wowForeverHelpers'
import { setCookie } from './utils/cookies'
import HelpWidget from '~/components/widgets/HelpWidget'
import { DatadogProvider } from '~/components/providers/DatadogProvider'

/**
 * Generates the basic HTML structure with linked resources and error boundaries.
 * @example
 * createHtmlStructure()
 * returns the complete HTML layout wrapped in JSX.
 * @returns {JSX.Element} The JSX representation of an HTML document with <head> and <body> sections.
 * @description
 *   - The returned HTML includes error boundaries within the <main> tag to manage rendering errors effectively.
 *   - This function encapsulates the structure within a single return statement, simplifying the JSX tree.
 */
export const ErrorBoundary = () => {
  return (
    <html>
      <head>
        <Links />
      </head>
      <body>
        <main>
          <ErrorBounds />
        </main>
      </body>
    </html>
  )
}

/**
 * Generates an array of link objects for stylesheets and favicon settings.
 * @example
 * generateLinkObjects('/path/styles.css', '/path/overrides.css')
 * // returns an array of link objects for stylesheets and icon
 * @param {string} styles - The path to the main stylesheet.
 * @param {string} overrides - The path to the override stylesheet.
 * @returns {Array<Object>} An array of link object configurations including stylesheets and a favicon.
 * @description
 *   - The function constructs link objects conforming to HTML link element attributes.
 *   - Assumes favicon is always a PNG with specified dimensions included in the links.
 *   - Preset dimensions (32x32) are used for the favicon link object, intended for browser display purposes.
 */
export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles
    },
    {
      rel: 'stylesheet',
      href: overrides
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/images/32x32_chocobo.png'
    }
  ]
}

export type LoaderData = {
  site_name: string
  data_center: string
  world: string
  wowRealm: { name: string; id: number }
  wowRegion: WoWServerRegion
  wowForever: WoWForeverSettings
}

/**
 * Retrieves user session data and constructs a response with site and session information.
 * @example
 * sync({ request, context })
 * // Returns JSON object with site_name, data_center, world, wowRealm, and wowRegion
 * @param {Object} {request, context} - Contains request data and context information.
 * @returns {Object} JSON object containing site name, data center, world, WoW realm, and region.
 * @description
 *   - Fetches user session data using the provided request object.
 *   - Defaults site name to "Saddlebag Exchange" if none is provided in the context.
 */
export const loader: LoaderFunction = async ({ request, context }) => {
  const {
    getWorld,
    getDataCenter,
    getWoWSessionData,
    getWoWForeverSessionData
  } = await getUserSessionData(request)

  const data_center = getDataCenter()
  const world = getWorld()
  const { server, region } = getWoWSessionData()
  const wowForever = getWoWForeverSessionData()

  return json<LoaderData>({
    site_name: (context.SITE_NAME as string) ?? 'Saddlebag Exchange',
    data_center,
    world,
    wowRealm: server,
    wowRegion: region,
    wowForever
  })
}

const validator = z.object({
  data_center: z.string().min(1),
  world: z.string().min(1),
  wow_region: z.union([z.literal('NA'), z.literal('EU')]),
  wow_realm_name: z.string().min(1),
  wow_realm_id: z
    .string()
    .min(1)
    .transform((val) => parseInt(val, 10)),
  wow_forever_region: z.union([z.literal('NA'), z.literal('EU')]),
  wow_forever_faction: z.enum(['alliance', 'horde'])
})

/**
 * Processes form data from a request, validates it, and updates the session before redirecting.
 * @example
 * sync({ request })
 * Redirects with updated session cookies on validation success
 * @param {Object} request - Incoming request object containing form data.
 * @returns {Object} Response object with a redirect and set-cookie headers.
 * @description
 *   - Validates form data using predefined validators for world, data center, server, and region.
 *   - Updates session with validated data and sets associated cookies.
 *   - Redirects to the root path with updated session and cookies upon successful validation.
 *   - Returns a failed JSON response if validation is unsuccessful.
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  const result = validator.safeParse(formPayload)

  if (!result.success) {
    return json({ update: 'failed' })
  }

  const session = await getSession(request.headers.get('Cookie'))

  const { data_center, world } = validateWorldAndDataCenter(
    result.data.world,
    result.data.data_center
  )

  const { server, region } = validateServerAndRegion(
    result.data.wow_region,
    result.data.wow_realm_id,
    result.data.wow_realm_name
  )

  session.set(DATA_CENTER, data_center)
  session.set(FF14_WORLD, world)
  const wowForever = validateWoWForeverSettings(
    result.data.wow_forever_region,
    result.data.wow_forever_faction
  )

  session.set(WOW_REGION, region)
  session.set(WOW_REALM_NAME, server.name)
  session.set(WOW_REALM_ID, server.id)
  session.set(WOW_FOREVER_REGION, wowForever.region)
  session.set(WOW_FOREVER_FACTION, wowForever.faction)

  const cookies = [
    setCookie(DATA_CENTER, data_center),
    setCookie(FF14_WORLD, world),
    setCookie(WOW_REALM_ID, server.id.toString()),
    setCookie(WOW_REALM_NAME, server.name),
    setCookie(WOW_REGION, region),
    setCookie(WOW_FOREVER_REGION, wowForever.region),
    setCookie(WOW_FOREVER_FACTION, wowForever.faction)
  ]

  const headers = [
    ['Set-Cookie', await commitSession(session)],
    ...cookies.map((cookie) => ['Set-Cookie', cookie] as [string, string])
  ] as Array<[string, string]>

  // Page-load sync must not redirect, or a deep link such as upload timers
  // is replaced by the homepage. Other submissions still go home.
  if (formData.get('background_sync') === '1') {
    return json({ update: 'ok' }, { headers })
  }

  return redirect('/', { headers })
}

export const meta: MetaFunction = ({ data }) => {
  const { site_name } = data
  return [
    { charset: 'utf-8' },
    { title: site_name },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'SaddleBag Exchange: An MMO market data analysis engine for the WoW Auctionhouse, FFXIV Marketboard and more!'
    },
    { property: 'og:site_name', content: 'SaddleBag Exchange' }
  ]
}

/**
 * Main application component that sets up theme, synchronizes server data, and loads external scripts.
 * @example
 * App()
 * <DatadogProvider>...</DatadogProvider>
 * @returns {JSX.Element} The main application component wrapped with providers and including necessary scripts and styles.
 * @description
 *   - Uses multiple useEffect hooks to manage various settings like theme and data synchronization.
 *   - Loads external resources such as Google Tag Manager and Next Millennium scripts upon mounting.
 *   - Provides a consistent theme by checking user preferences and applying them accordingly.
 */
function App() {
  const data = useLoaderData<LoaderData>()
  const { ffxivWorld, wowRealm, wowForever } = useTypedSelector(
    (state) => state.user
  )
  const submit = useSubmit()
  const settingsFetcher = useFetcher()
  const dispatch = useDispatch()

  useEffect(() => startThemeSync(store), [])

  /**
   * Sync ffxiv servers and wow realms between local storage and session cookies.
   */
  useEffect(() => {
    // Check local storage first
    const localFFXIVWorld = getFFWorldDataFromLocalStorage()
    const localWoWRealm = getWoWRealmDataFromLocalStorage()
    const savedForever = getSavedWoWForeverSettingsFromLocalStorage()
    const localWoWForever = savedForever ?? data.wowForever

    const localForeverDiffers =
      savedForever !== null &&
      (savedForever.region !== data.wowForever.region ||
        savedForever.faction !== data.wowForever.faction)

    if (
      savedForever === null &&
      (wowForever.region !== data.wowForever.region ||
        wowForever.faction !== data.wowForever.faction)
    ) {
      dispatch(setWoWForeverSettings(data.wowForever))
    }

    const submitHomeSettings = (
      world: { data_center: string; world: string },
      realm: typeof localWoWRealm,
      forever: typeof localWoWForever,
      background = false
    ) => {
      const formData = new FormData()

      formData.set(DATA_CENTER, world.data_center)
      formData.set(FF14_WORLD, world.world)
      formData.set(WOW_REGION, realm.region)
      formData.set(WOW_REALM_NAME, realm.server.name)
      formData.set(WOW_REALM_ID, realm.server.id.toString())
      formData.set(WOW_FOREVER_REGION, forever.region)
      formData.set(WOW_FOREVER_FACTION, forever.faction)

      if (background) {
        formData.set('background_sync', '1')
        settingsFetcher.submit(formData, { method: 'post' })
        return
      }

      submit(formData, { method: 'post' })
    }

    // If local data exists, use that
    if (
      localFFXIVWorld.world !== data.world ||
      localFFXIVWorld.data_center !== data.data_center ||
      localWoWRealm.region !== data.wowRegion ||
      localWoWRealm.server.id !== data.wowRealm.id ||
      localWoWRealm.server.name !== data.wowRealm.name ||
      localForeverDiffers
    ) {
      dispatch(setFFxivWorld(localFFXIVWorld))
      dispatch(setWoWRealmData(localWoWRealm))
      if (savedForever) {
        dispatch(setWoWForeverSettings(savedForever))
      }

      // Cookies can expire while local storage still has the saved faction.
      // Persist that choice without leaving the page the user opened.
      // FFXIV and WoW stay on the session values. Local copies of those games
      // can be fallback defaults, and this sync must not write them over a
      // valid session.
      if (localForeverDiffers && savedForever) {
        submitHomeSettings(
          { data_center: data.data_center, world: data.world },
          { server: data.wowRealm, region: data.wowRegion },
          savedForever,
          true
        )
      }
    } else if (
      ffxivWorld.world !== data.world ||
      ffxivWorld.data_center !== data.data_center ||
      wowRealm.region !== data.wowRegion ||
      wowRealm.server.id !== data.wowRealm.id ||
      wowRealm.server.name !== data.wowRealm.name ||
      (savedForever !== null &&
        (wowForever.region !== data.wowForever.region ||
          wowForever.faction !== data.wowForever.faction))
    ) {
      // If local data doesn't exist, use session data and update local storage
      const foreverForSync = savedForever ?? data.wowForever
      submitHomeSettings(ffxivWorld, wowRealm, foreverForSync)

      setFFWorldDataInLocalStorage(ffxivWorld.world, ffxivWorld.data_center)
      setWoWRealmDataInLocalStorage(wowRealm.server, wowRealm.region)
      setWoWForeverSettingsInLocalStorage(foreverForSync)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      window.requestAnimationFrame(() => {
        // Load Google Tag Manager
        {
          const w = window as Window & { dataLayer?: any[] }
          const d = document
          const i = 'GTM-WH4KFG5'
          const l = 'dataLayer'
          const s = 'script'
          w[l] = w[l] || []
          w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
          const f = d.getElementsByTagName(s)[0] as HTMLScriptElement
          const j = d.createElement(s) as HTMLScriptElement
          const dl = l == 'dataLayer' ? '' : `&l=${l}`
          j.async = true
          j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`
          if (f?.parentNode) {
            try {
              f.parentNode.insertBefore(j, f)
            } catch (e) {
              // Fallback to append if insertBefore fails
              document.body.appendChild(j)
            }
          } else {
            // Fallback if target element not found
            document.body.appendChild(j)
          }
        }

        // Load Next Millennium script
        const nextMilleniumScript = document.createElement('script')
        nextMilleniumScript.src = 'https://powerad.ai/261066107350250/script.js'
        nextMilleniumScript.async = true
        document.body.appendChild(nextMilleniumScript)

        // // Load HubSpot script
        // const hubspotScript = document.createElement('script')
        // hubspotScript.id = 'hs-script-loader'
        // hubspotScript.src = '//js-na1.hs-scripts.com/48701885.js'
        // hubspotScript.async = true
        // hubspotScript.defer = true
        // document.body.appendChild(hubspotScript)

        // // Load Ezoic script
        // const ezoicScript = document.createElement('script')
        // ezoicScript.src = '//www.ezojs.com/ezoic/sa.min.js'
        // ezoicScript.async = true
        // document.body.appendChild(ezoicScript)

        // ezoicScript.onload = function () {
        //   window.ezstandalone = window.ezstandalone || {}
        //   ezstandalone.cmd = ezstandalone.cmd || []
        //   ezstandalone.cmd.push(function () {
        //     ezstandalone.define(118, 116)
        //     ezstandalone.refresh()
        //     ezstandalone.enable()
        //     ezstandalone.display()
        //   })
        // }
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <DatadogProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <head>
          <EnsureThemeApplied />
          <Meta />
          <Links />
        </head>
        <body className={`h-full bg-gray-100 dark:bg-slate-800`}>
          <noscript>
            <iframe
              title="GtagManager"
              src="https://www.googletagmanager.com/ns.html?id=GTM-WH4KFG5"
              height="0"
              width="0"
              className={`hidden invisible`}
            />
          </noscript>
          <Sidebar data={data}>
            <Outlet />
          </Sidebar>
          <HelpWidget />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </DatadogProvider>
  )
}

export default function AppWithTheme() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}
