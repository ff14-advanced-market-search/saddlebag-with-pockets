import type { FC, PropsWithChildren } from 'react'
import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  BellIcon,
  ChartSquareBarIcon,
  CogIcon,
  HomeIcon,
  MenuAlt2Icon,
  XIcon,
  DocumentSearchIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilAltIcon
} from '@heroicons/react/outline'
import { Link, NavLink, useMatches } from '@remix-run/react'
import { classNames } from '~/utils'
import PatreonIcon from '~/icons/PatreonIcon'
import KofiIcon from '~/icons/KofiIcon'
import EarthIcon from '~/icons/EarthIcon'
import GithubIcon from '~/icons/GithubIcon'
import { LocationMarkerIcon } from '@heroicons/react/solid'
import DiscordIcon from '~/icons/DiscordIcon'

type Props = PropsWithChildren<any> & {
  data: any
}

interface NavbarLinkProps {
  name: string
  href: string
  icon: (props: any) => JSX.Element | null
  external?: boolean
}

const PatreonLink = () => (
  <a
    href={'https://www.patreon.com/indopan'}
    target="_blank"
    rel="noreferrer"
    className={`text-gray-300 hover:bg-gray-500 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md`}>
    <PatreonIcon
      className={classNames(
        'text-gray-400 group-hover:text-gray-300',
        'mr-4 flex-shrink-0 h-6 w-6'
      )}
      aria-hidden="true"
    />
    Patreon
  </a>
)

const navGroups: Array<{
  title: string
  openMatch?: string
  links: Array<NavbarLinkProps>
}> = [
  {
    title: 'Final Fantasy XIV',
    openMatch: '/queries/',
    links: [
      {
        name: 'Import Trading Searches',
        href: 'queries',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Listings Comparison and Competition Metrics',
        href: 'queries/listings',
        icon: DocumentSearchIcon
      },
      {
        name: 'Item History Statistics and Graphs',
        href: 'queries/item-history',
        icon: DocumentSearchIcon
      },
      {
        name: 'Export Trading Search',
        href: 'queries/world-comparison',
        icon: DocumentSearchIcon
      },
      {
        name: 'Undercut Alert Input',
        href: 'undercut',
        icon: PencilAltIcon
      },
      {
        name: 'Price Sniper Alert Input',
        href: 'price-sniper',
        icon: PencilAltIcon
      },
      {
        name: 'Undercut Discord Alerts',
        href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version',
        icon: DocumentSearchIcon,
        external: true
      },
      {
        name: 'Qualified Sale Alerts',
        href: 'https://www.patreon.com/indopan',
        icon: DocumentSearchIcon,
        external: true
      },
      {
        name: 'Discount Price Sniper',
        href: 'https://www.patreon.com/indopan',
        icon: DocumentSearchIcon,
        external: true
      }
    ]
  },
  {
    title: 'World of Warcraft',
    openMatch: '/wow/',
    links: [
      {
        name: 'Local Market Shortage Finder',
        href: '/wow/shortages/single',
        icon: DocumentSearchIcon
      },
      {
        name: 'Commodity Shortage Finder',
        href: 'wow/shortages/commodities',
        icon: DocumentSearchIcon
      },
      {
        name: 'Server Transfer Trading Search',
        href: '/wow/full-scan',
        icon: DocumentSearchIcon
      },
      {
        name: 'Undercut Alerts Curseforge Addon',
        icon: DocumentSearchIcon,
        href: 'https://www.curseforge.com/wow/addons/saddlebag-exchange',
        external: true
      }
    ]
  },
  {
    title: 'Other',
    links: [
      {
        name: 'Legacy FFXIV Site',
        href: 'https://saddlebag.exchange',
        icon: HomeIcon,
        external: true
      },

      {
        name: 'Ko-fi',
        href: 'https://ko-fi.com/indopan',
        icon: KofiIcon,
        external: true
      },
      {
        name: 'Discord',
        href: 'https://discord.gg/836C8wDVNq',
        external: true,
        icon: DiscordIcon
      },
      {
        name: 'Github',
        href: 'https://github.com/ff14-advanced-market-search',
        external: true,
        icon: GithubIcon
      }
    ]
  }
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _userNavigation = [
  {
    name: 'Your Profile',
    href: '#'
  },
  {
    name: 'Settings',
    href: '#'
  },
  {
    name: 'Sign out',
    href: '#'
  }
]

const ButtonAccordian = ({
  title,
  children,
  openOverride
}: {
  title: string
  children: React.ReactNode
  openOverride: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen && openOverride) {
      setIsOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openOverride])

  return (
    <div className={`flex flex-col my-1 p-0 bg-gray-700 rounded`}>
      <button
        className={`flex justify-between items-center cursor-pointer border-0 p-2 ${
          isOpen ? 'text-white' : 'text-gray-300'
        } hover:bg-gray-500 hover:text-white rounded font-semibold`}
        onClick={() => setIsOpen((current) => !current)}>
        <span>{title}</span>
        {isOpen ? (
          <ChevronUpIcon className={`h-4 w-4`} />
        ) : (
          <ChevronDownIcon className={`h-4 w-4`} />
        )}
      </button>
      <div
        className={`${
          isOpen ? 'animate-grow' : 'animate-shrink'
        } flex flex-col`}>
        {children}
      </div>
    </div>
  )
}

export const Sidebar: FC<Props> = ({ children, data }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const matches = useMatches()

  const lastMatch = matches[matches.length - 1]?.pathname

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full">
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <Link to={`/`}>
                    <img
                      className="h-8 w-auto"
                      src="/images/tiny-chocobo.png"
                      alt={data.site_name}
                    />
                  </Link>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navGroups.map((group) => (
                      <ButtonAccordian
                        key={group.title}
                        title={group.title}
                        openOverride={group.openMatch === lastMatch}>
                        {group.links.map((item) =>
                          !item.external ? (
                            <NavLink
                              key={item.name}
                              to={item.href}
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-500 hover:text-white',
                                  'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                )
                              }>
                              {({ isActive }) => (
                                <>
                                  <item.icon
                                    className={classNames(
                                      isActive
                                        ? 'text-gray-300'
                                        : 'text-gray-400 group-hover:text-gray-300',
                                      'mr-4 flex-shrink-0 h-6 w-6'
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </>
                              )}
                            </NavLink>
                          ) : (
                            <a
                              key={item.name}
                              href={item.href}
                              target="_blank"
                              rel="noreferrer"
                              className={`text-gray-300 hover:bg-gray-500 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md`}>
                              <item.icon
                                className={classNames(
                                  'text-gray-400 group-hover:text-gray-300',
                                  'mr-4 flex-shrink-0 h-6 w-6'
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          )
                        )}
                      </ButtonAccordian>
                    ))}
                    <PatreonLink />
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex items-center h-24 flex-shrink-0 px-4 bg-gray-900">
            <Link to={`/`}>
              <img
                className="h-24 w-auto"
                src="/images/tiny-chocobo.png"
                alt={data.site_name}
              />
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-0 px-2 py-4 space-y-1">
              {navGroups.map((group) => (
                <ButtonAccordian
                  key={group.title}
                  title={group.title}
                  openOverride={group.openMatch === lastMatch}>
                  {group.links.map((item) =>
                    !item.external ? (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? 'bg-gray-900 text-white hover:bg-gray-500'
                              : 'text-gray-300 hover:bg-gray-500 hover:text-white',
                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                          )
                        }>
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={classNames(
                                isActive
                                  ? 'text-gray-300'
                                  : 'text-gray-400 group-hover:text-gray-300',
                                'mr-3 flex-shrink-0 h-6 w-6'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </>
                        )}
                      </NavLink>
                    ) : (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-gray-300 hover:bg-gray-500 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                        <item.icon
                          className={classNames(
                            'text-gray-400 group-hover:text-gray-300',
                            'mr-4 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    )
                  )}
                </ButtonAccordian>
              ))}
              <PatreonLink />
            </nav>
          </div>
        </div>
      </div>
      <div className="md:pl-64 flex flex-col">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-slate-900 shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-end">
            <div className={`ml-4 flex md:ml-6 basis-52`}>
              <NavLink
                to={'/options'}
                type="button"
                className={classNames(
                  `group content-between flex flex-1`,
                  'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500'
                )}>
                <div className={`flex flex-wrap pl-1.5 flex-1`}>
                  <div className="flex items-center text-sm text-gray-500 basis-full">
                    <EarthIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    {data.data_center}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 basis-full">
                    <LocationMarkerIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    {data.world}
                  </div>
                </div>
                <div className={`flex items-center pr-1.5`}>
                  <CogIcon
                    className="h-5 w-5 text-gray-400 basis-full group-hover:text-blue-500"
                    aria-hidden="true"
                  />
                </div>
              </NavLink>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="/images/tiny-chocobo.png"
                      alt=""
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95">
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <p className={`text-gray-700 text-sm py-2 px-4`}>
                      <strong>Welcome to Saddlebag!</strong> We're super
                      freaking hyped to see where this journey together goes.
                      Hoping you make it big! Join our Discord for spicy news!
                    </p>
                    {/*{userNavigation.map((item) => (<Menu.Item key={item.name}>
                                        {({active}) => (<a
                                            href={item.href}
                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                        >
                                            {item.name}
                                        </a>)}
                                    </Menu.Item>))}*/}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  )
}
