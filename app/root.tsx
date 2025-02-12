import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
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
} from '@remix-run/react'
import Sidebar from '~/components/navigation/sidebar'
import { getUserSessionData } from '~/sessions'
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
import {
  getSession,
  DATA_CENTER,
  FF14_WORLD,
  commitSession,
  WOW_REGION,
  WOW_REALM_ID,
  WOW_REALM_NAME
} from '~/sessions'
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
        ;(function (w, d, s, l, i) {
          w[l] = w[l] || []
          w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
          var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : ''
          j.async = true
          j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
          f.parentNode?.insertBefore(j, f)
        })(window, document, 'script', 'dataLayer', 'GTM-WH4KFG5')

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
              className={`hidden invisible`}></iframe>
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
