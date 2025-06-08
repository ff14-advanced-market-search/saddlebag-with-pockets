import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@react-router/cloudflare'
import { redirect, json } from '@react-router/cloudflare'
import styles from './tailwind.css'
import overrides from './base.css'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useSubmit
} from 'react-router'
import Sidebar from '~/components/navigation/sidebar'
import {
  getUserSessionData,
  getSession,
  DATA_CENTER,
  FF14_WORLD,
  commitSession,
  WOW_REGION,
  WOW_REALM_ID,
  WOW_REALM_NAME
} from '~/sessions'
import {
  EnsureThemeApplied,
  Theme,
  ThemeProvider,
  useTheme
} from '~/utils/providers/theme-provider'
import { classNames } from '~/utils'
import { store } from '~/redux/store'
import { Provider, useDispatch } from 'react-redux'
import { useTypedSelector } from './redux/useTypedSelector'
import { useEffect } from 'react'
import type { WoWServerRegion } from './requests/WoW/types'
import { z } from 'zod'
import { validateWorldAndDataCenter } from './utils/locations'
import { validateServerAndRegion } from './utils/WoWServers'
import ErrorBounds from './components/utilities/ErrorBoundary'
import { setFFxivWorld, setWoWRealmData } from './redux/reducers/userSlice'
import {
  getFFWorldDataFromLocalStorage,
  setFFWorldDataInLocalStorage
} from './redux/localStorage/ffxivWorldDataHelpers'
import {
  getWoWRealmDataFromLocalStorage,
  setWoWRealmDataInLocalStorage
} from './redux/localStorage/wowRealmHelpers'
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
  const { getWorld, getDataCenter, getWoWSessionData } =
    await getUserSessionData(request)

  const data_center = getDataCenter()
  const world = getWorld()
  const { server, region } = getWoWSessionData()

  return json<LoaderData>({
    site_name: (context.SITE_NAME as string) ?? 'Saddlebag Exchange',
    data_center,
    world,
    wowRealm: server,
    wowRegion: region
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
    .transform((val) => parseInt(val, 10))
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
  session.set(WOW_REGION, region)
  session.set(WOW_REALM_NAME, server.name)
  session.set(WOW_REALM_ID, server.id)

  const cookies = [
    setCookie(DATA_CENTER, data_center),
    setCookie(FF14_WORLD, world),
    setCookie(WOW_REALM_ID, server.id.toString()),
    setCookie(WOW_REALM_NAME, server.name),
    setCookie(WOW_REGION, region)
  ]

  return redirect('/', {
    headers: [
      ['Set-Cookie', await commitSession(session)],
      ...cookies.map((cookie) => ['Set-Cookie', cookie] as [string, string])
    ]
  })
}

export const meta: MetaFunction = ({ data }) => {
  const { site_name } = data
  return {
    charset: 'utf-8',
    title: site_name,
    viewport: 'width=device-width,initial-scale=1',
    description:
      'SaddleBag Exchange: An MMO market data analysis engine for the WoW Auctionhouse, FFXIV Marketboard and more!'
  }
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
  const [theme, setTheme] = useTheme()
  const { darkmode, ffxivWorld, wowRealm } = useTypedSelector(
    (state) => state.user
  )
  const submit = useSubmit()
  const dispatch = useDispatch()

  /**
   * Setup theme for app
   */
  useEffect(() => {
    if (darkmode) {
      setTheme(Theme.DARK)
    } else {
      setTheme(Theme.LIGHT)
    }
  }, [setTheme, darkmode])

  /**
   * Sync ffxiv servers and wow realms between local storage and session cookies.
   */
  useEffect(() => {
    // Check local storage first
    const localFFXIVWorld = getFFWorldDataFromLocalStorage()
    const localWoWRealm = getWoWRealmDataFromLocalStorage()

    // If local data exists, use that
    if (
      localFFXIVWorld.world !== data.world ||
      localFFXIVWorld.data_center !== data.data_center ||
      localWoWRealm.region !== data.wowRegion ||
      localWoWRealm.server.id !== data.wowRealm.id ||
      localWoWRealm.server.name !== data.wowRealm.name
    ) {
      dispatch(setFFxivWorld(localFFXIVWorld))
      dispatch(setWoWRealmData(localWoWRealm))
    } else if (
      ffxivWorld.world !== data.world ||
      ffxivWorld.data_center !== data.data_center ||
      wowRealm.region !== data.wowRegion ||
      wowRealm.server.id !== data.wowRealm.id ||
      wowRealm.server.name !== data.wowRealm.name
    ) {
      // If local data doesn't exist, use session data and update local storage
      const formData = new FormData()

      formData.set(DATA_CENTER, ffxivWorld.data_center)
      formData.set(FF14_WORLD, ffxivWorld.world)
      formData.set(WOW_REGION, wowRealm.region)
      formData.set(WOW_REALM_NAME, wowRealm.server.name)
      formData.set(WOW_REALM_ID, wowRealm.server.id.toString())

      submit(formData, { method: 'post' })

      setFFWorldDataInLocalStorage(ffxivWorld.world, ffxivWorld.data_center)
      setWoWRealmDataInLocalStorage(wowRealm.server, wowRealm.region)
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
      <html lang="en" className={classNames(`h-full`, theme || '')}>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <Meta />
          <Links />
          <EnsureThemeApplied />
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
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  )
}
