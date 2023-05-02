import type { LoaderFunction, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import styles from './tailwind.css'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
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
import { Provider } from 'react-redux'
import { useTypedSelector } from './redux/useTypedSelector'
import { useEffect } from 'react'
import type { WoWServerRegion } from './requests/WoW/types'

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles
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
    site_name: (context.SITE_NAME as string) ?? 'Saddlebag',
    data_center,
    world,
    wowRealm: server,
    wowRegion: region
  })
}

export const meta: MetaFunction = ({ data }) => {
  const { site_name } = data
  return {
    charset: 'utf-8',
    title: site_name,
    viewport: 'width=device-width,initial-scale=1',
    description:
      'SaddleBag Exchange: An MMO market data analysis engine for the WoW, FFXIV and more!'
  }
}

function App() {
  const data = useLoaderData<LoaderData>()
  const [theme, setTheme] = useTheme()
  const { darkmode } = useTypedSelector((state) => state.user)

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

  return (
    <html lang="en" className={classNames(`h-full`, theme || '')}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-WH4KFG5');`
          }}
        />
        <Meta />
        <Links />
        <EnsureThemeApplied />
        <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
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
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
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
