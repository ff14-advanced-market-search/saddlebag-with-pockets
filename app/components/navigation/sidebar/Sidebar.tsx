import type { FC, PropsWithChildren } from 'react'
import React, { Fragment, useState } from 'react'
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
  ChevronDownIcon
} from '@heroicons/react/outline'
import { Link, NavLink } from '@remix-run/react'
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

const navGroups: Array<{
  title: string
  links: Array<NavbarLinkProps>
}> = [
  {
    title: 'Final Fantasy XIV',
    links: [
      {
        name: 'Queries',
        href: 'queries',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Listings',
        href: 'queries/listings',
        icon: DocumentSearchIcon
      },
      {
        name: 'Item History',
        href: 'queries/item-history',
        icon: DocumentSearchIcon
      }
    ]
  },
  {
    title: 'World of Warcraft',
    links: [
      { name: 'Scan', href: '/wow/full-scan', icon: DocumentSearchIcon },

      {
        name: 'Single Shortages',
        href: '/wow/shortages/single',
        icon: DocumentSearchIcon
      },
      {
        name: 'Commodity Shortages',
        href: 'wow/shortages/commodities',
        icon: DocumentSearchIcon
      }
    ]
  },
  {
    title: 'Other',
    links: [
      {
        name: 'Legacy Site',
        href: 'https://saddlebag.exchange',
        icon: HomeIcon,
        external: true
      },
      {
        name: 'Patreon',
        href: 'https://www.patreon.com/indopan',
        icon: PatreonIcon,
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

const advertisements: Array<{ name: string; href: string }> = [
  // {
  //   name: 'Best Sellers in Video Games',
  //   href: 'https://www.amazon.com/best-sellers-video-games/zgbs/videogames?_encoding=UTF8&linkCode=ib1&tag=ff14advancedm-20&linkId=e9fc3b6346a319e96288b98cbf3e688d&ref_=ihub_curatedcontent_c0e2eb7b-31db-4cc7-a427-b5f5f75b09db'
  // },
  // {
  //   name: 'Best Sellers in Electronics',
  //   href: 'https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics?_encoding=UTF8&linkCode=ib1&tag=ff14advancedm-20&linkId=2d456819badb061450b7200abf42b1cf&ref_=ihub_curatedcontent_c71c4a67-0a56-4af2-a5a5-78ab26623653'
  // },
  // {
  //   name: 'Best Sellers in Computers & Accessories',
  //   href: 'https://www.amazon.com/Best-Sellers-Computers-Accessories/zgbs/pc?_encoding=UTF8&linkCode=ib1&tag=ff14advancedm-20&linkId=d5510f37e5ba06b34988212672d6e470&ref_=ihub_curatedcontent_cc03e16d-0d64-46fc-ba03-79623230ca5e'
  // }
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
  children
}: {
  title: string
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const id = title.replace(' ', '-')
  return (
    <div className={`flex flex-col my-1 p-0 bg-gray-700 rounded`}>
      <button
        className={`flex justify-between items-center cursor-pointer border-0 p-2 ${
          isOpen ? 'text-white' : 'text-gray-300'
        } hover:bg-gray-500 hover:text-white rounded font-semibold`}
        onClick={() => setIsOpen((state) => !state)}>
        <span id={id}>{title}</span>
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
                      <ButtonAccordian key={group.title} title={group.title}>
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
                              target={`_blank`}
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
                  </nav>
                  <nav className="px-2 space-y-1">
                    <span className={`text-gray-300 text-base p-2`}>.</span>
                    {advertisements.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        target={`_blank`}
                        className={`text-gray-300 hover:bg-gray-500 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md`}>
                        {item.name}
                      </a>
                    ))}
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
                <ButtonAccordian key={group.title} title={group.title}>
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
            </nav>
            <nav className="flex-1 px-2 py-4 space-y-1">
              <NavLink
                className={`text-gray-300 text-base p-2 hover:bg-gray-500 hover:text-white `}
                to={`/why/advertisements`}>
                .
              </NavLink>
              {advertisements.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-gray-300 hover:bg-gray-500 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                  {item.name}
                </a>
              ))}
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
