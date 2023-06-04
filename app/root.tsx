import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import styles from './tailwind.css'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition
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
import { getSession } from '~/sessions'
import { DATA_CENTER } from '~/sessions'
import { FF14_WORLD } from '~/sessions'
import { commitSession } from '~/sessions'
import { z } from 'zod'
import { validateWorldAndDataCenter } from './utils/locations'

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

const validator = z.object({
  data_center: z.string().min(1),
  world: z.string().min(1)
  // region: z.union([z.literal('NA'), z.literal('EU')]),
  // homeRealm: z.string().min(1)
})

export const action: ActionFunction = async ({ request, context, params }) => {
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

  session.set(DATA_CENTER, data_center)
  session.set(FF14_WORLD, world)

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
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
  const { darkmode, ffxivWorld } = useTypedSelector((state) => state.user)
  const submit = useSubmit()
  const transition = useTransition()

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
   *
   * Sync server and data centers between local storage and session cookies.
   */
  useEffect(() => {
    if (
      (ffxivWorld.world !== data.world ||
        ffxivWorld.data_center !== data.data_center) &&
      transition.state !== 'submitting'
    ) {
      const formData = new FormData()
      formData.set('data_center', ffxivWorld.data_center)
      formData.set('world', ffxivWorld.world)

      submit(formData, { method: 'post' })
    }
  }, [])

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
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ezstandalone = window.ezstandalone || {};
          ezstandalone.cmd = ezstandalone.cmd || [];
          ezstandalone.cmd.push(function() {
              ezstandalone.define(118,116);
              ezstandalone.refresh();
              ezstandalone.enable();
              ezstandalone.display();
          });`
          }}
        />
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
