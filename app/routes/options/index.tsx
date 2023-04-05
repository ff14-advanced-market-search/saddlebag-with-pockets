import { CheckIcon } from '@heroicons/react/solid'
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition
} from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
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
import { toggleDarkMode } from '~/redux/reducers/userSlice'
import { useTypedSelector } from '~/redux/useTypedSelector'
import React from 'react'
import { validateServerAndRegion } from '~/utils/WoWServers'
import { validateWorldAndDataCenter } from '~/utils/locations'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import SelectDCandWorld from '~/components/form/Select/SelectWorld'

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

  // Set the new option, yeet back to index (but save against session data within the cookie)
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
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
    wowRegion: region
  })
}

export default function () {
  const data = useLoaderData()
  const transition = useTransition()
  const actionData = useActionData()

  const dispatch = useDispatch()
  const { darkmode } = useTypedSelector((state) => state.user)

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode())
  }

  return (
    <div>
      <main className="flex-1">
        <Form method="post">
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
            title="FFXIV World Selection"
            description="The selected server will change what marketplace your queries are run against.">
            <SelectDCandWorld
              transition={transition}
              actionData={actionData}
              sessionData={data}
            />
          </OptionSection>
          <OptionSection
            title="WoW Home Realm Selection"
            description="Your region and home realm that will be the default on WoW queries.">
            <RegionAndServerSelect
              region={data.wowRegion}
              defaultRealm={data.wowRealm}
              serverSelectFormName="homeRealm"
            />
          </OptionSection>
          <OptionSection
            title="Theme"
            description="Needs more sparkles.. ✨✨✨✨"
            hideHRule={true}>
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
      </main>
    </div>
  )
}
