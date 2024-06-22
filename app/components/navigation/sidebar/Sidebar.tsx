import type { FC, PropsWithChildren } from 'react'
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  BellIcon,
  ChartSquareBarIcon,
  ClockIcon,
  CogIcon,
  MenuAlt2Icon,
  XIcon,
  DocumentSearchIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilAltIcon,
  SearchIcon,
  ExclamationCircleIcon,
  ShoppingCartIcon
} from '@heroicons/react/outline'
import {
  Form,
  Link,
  NavLink,
  useMatches,
  useNavigate,
  useNavigation
} from '@remix-run/react'
import { classNames } from '~/utils'
import PatreonIcon from '~/icons/PatreonIcon'
import KofiIcon from '~/icons/KofiIcon'
import GithubIcon from '~/icons/GithubIcon'
import FlatWoWIcon from '~/icons/FlatWowIcon'
import FlatFFXIVIcon from '~/icons/FlatFFXIVIcon'
import DiscordIcon from '~/icons/DiscordIcon'
import type { LoaderData } from '~/root'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import {
  ffxivItemsList,
  wowItems,
  wowItemsList
} from '~/utils/items/id_to_item'
import { SubmitButton } from '~/components/form/SubmitButton'
import { getItemIDByName } from '~/utils/items'

export const ITEM_DATA_FORM_NAME = 'item-data-from'

type Props = PropsWithChildren<any> & {
  data: LoaderData
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

const WikiLink = () => (
  <a
    href={
      'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki'
    }
    target="_blank"
    rel="noreferrer"
    className={`text-gray-300 hover:bg-gray-500 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md`}>
    <GithubIcon
      className={classNames(
        'text-gray-400 group-hover:text-gray-300',
        'mr-4 flex-shrink-0 h-6 w-6'
      )}
      aria-hidden="true"
    />
    Guides and Tutorials
  </a>
)

const DiscordLink = () => (
  <a
    href={'https://discord.gg/836C8wDVNq'}
    target="_blank"
    rel="noreferrer"
    className={`text-gray-300 hover:bg-gray-500 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md`}>
    <DiscordIcon
      className={classNames(
        'text-gray-400 group-hover:text-gray-300',
        'mr-4 flex-shrink-0 h-6 w-6'
      )}
      aria-hidden="true"
    />
    Join our Discord
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
        name: 'Guides and Tutorials',
        href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki#game-guides#ffxiv',
        icon: DocumentSearchIcon,
        external: true
      },
      {
        name: 'Reselling Trading Searches',
        href: 'queries/recommended',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Marketshare Overview',
        href: 'ffxiv/marketshare/queries',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Craftsim Search',
        href: 'ffxiv/craftsim/queries',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Shopping List',
        href: 'ffxiv/shopping-list',
        icon: PencilAltIcon
      },
      {
        name: 'Listings Comparison and Competition Metrics',
        href: 'queries/listings',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Item History Statistics and Graphs',
        href: 'queries/item-history',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Self Purchase Records',
        href: 'ffxiv/self-purchase',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Export Trading Search',
        href: 'queries/world-comparison',
        icon: ChartSquareBarIcon
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
        name: 'Allagan Data Reports',
        href: 'allagan-data',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Secret Sale Leads',
        href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Sale-Leads',
        icon: DocumentSearchIcon,
        external: true
      },
      {
        name: 'Experimental Discount Price Sniper',
        href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/FFXIV-Experimental-Discount-Price-Sniper',
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
        name: 'Guides and Tutorials',
        href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki#wow',
        icon: DocumentSearchIcon,
        external: true
      },
      {
        name: 'Azeroth Auction Assassin Sniper',
        href: 'https://github.com/ff14-advanced-market-search/AzerothAuctionAssassin/releases/latest',
        icon: DocumentSearchIcon,
        external: true
      },
      {
        name: 'Best Deals',
        href: '/wow/best-deals/recommended',
        icon: ExclamationCircleIcon
      },
      {
        name: 'Shopping List',
        href: '/wow/shopping-list',
        icon: ShoppingCartIcon
      },
      {
        name: 'Item Export Search',
        href: 'wow/export-search',
        icon: DocumentSearchIcon
      },
      {
        name: 'Price Alert Input Generator',
        href: 'wow/price-alert',
        icon: PencilAltIcon
      },
      {
        name: 'Upload Timers',
        href: '/wow/upload-timers',
        icon: ClockIcon
      },
      {
        name: 'Region Wide Undercut Checker',
        href: 'wow/region-undercut',
        icon: DocumentSearchIcon
      },
      {
        name: 'Undercut Alerts Curseforge Addon',
        icon: DocumentSearchIcon,
        href: 'https://www.curseforge.com/wow/addons/saddlebag-exchange',
        external: true
      },
      {
        name: 'TSM to AAA converter Addon',
        href: 'https://www.curseforge.com/wow/addons/aaatransformer/latest',
        icon: DocumentSearchIcon,
        external: true
      },
      {
        name: 'Current Content Marketshare Overview',
        href: '/wow/marketshare/recommended',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Legacy Marketshare Overview',
        href: '/wow/legacy-marketshare',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Pet Marketshare Overview',
        href: '/wow/pet-marketshare',
        icon: ChartSquareBarIcon
      }
    ]
  },
  {
    title: 'WoW Experimental Tools',
    links: [
      {
        name: 'Server Transfer Trading Search',
        href: '/wow/full-scan',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Dragonflight Commodity Shortage Futures',
        href: 'wow/shortage-predictor',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Commodity Shortage Finder',
        href: 'wow/shortages/commodities',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Local Market Shortage Finder',
        href: '/wow/shortages/single',
        icon: ChartSquareBarIcon
      }
    ]
  },
  {
    title: 'Other',
    links: [
      {
        name: 'Alpha Build Early Access Site',
        href: 'https://temp.saddlebagexchange.com',
        icon: GithubIcon,
        external: true
      },
      {
        name: 'Ko-fi',
        href: 'https://ko-fi.com/indopan',
        icon: KofiIcon,
        external: true
      },
      {
        name: 'PayPal',
        href: 'https://www.paypal.me/alexcohen1',
        external: true,
        icon: KofiIcon
      },
      {
        name: 'Github',
        href: 'https://github.com/ff14-advanced-market-search',
        external: true,
        icon: GithubIcon
      },
      {
        name: 'Join Our Team - Help Wanted!',
        href: 'https://drive.google.com/file/d/1R9J51hNuwMfPuLi0u1snaLvQnJiZ2jRo/view?usp=sharing',
        external: true,
        icon: GithubIcon
      },
      {
        name: 'blog',
        href: '/blog',
        icon: DocumentSearchIcon
      },
      {
        name: 'List of all WoW Items',
        href: '/wow/itemlist',
        icon: DocumentSearchIcon
      },
      {
        name: 'List of all FFXIV Items',
        href: '/ffxiv/itemlist',
        icon: DocumentSearchIcon
      },
      {
        name: 'Fandom',
        href: 'https://ffxivmarketboard.fandom.com/wiki/Ffxivmarketboard_Wiki',
        external: true,
        icon: DocumentSearchIcon
      },
      {
        name: 'Discord Webpage',
        href: 'https://discord.com/servers/saddlebag-exchange-973380473281724476',
        external: true,
        icon: DocumentSearchIcon
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
          isOpen ? 'animate-open' : 'animate-close'
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
      {/* Mobile View and toggle */}
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
                      className="h-10 w-auto"
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
                                  'group flex items-center px-2 py-2 text-base font-medium rounded-md animate-child'
                                )
                              }>
                              {({ isActive }) => (
                                <>
                                  <item.icon
                                    className={classNames(
                                      isActive
                                        ? 'text-gray-300'
                                        : 'text-gray-400 group-hover:text-gray-300',
                                      'mr-4 flex-shrink-0 h-6 w-6 animate-child'
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
                    <WikiLink />
                    <DiscordLink />
                    <p className="text-gray-400 text-xs mt-4">
                      FINAL FANTASY is a registered trademark of Square Enix
                      Holdings Co., Ltd.
                      <br />© SQUARE ENIX CO., LTD. All Rights Reserved.
                      <br />
                      WORLD OF WARCRAFT is a registered trademark of Blizzard
                      Entertainment, Inc.
                      <br />© BLIZZARD ENTERTAINMENT, INC. All Rights Reserved.
                    </p>
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
        <div className="flex-1 flex flex-col min-h-0 bg-gray-900 dark:bg-slate-950 border-r border-gray-100 dark:border-slate-800">
          <div className="flex items-center h-12 flex-shrink-0 px-4 bg-gray-900 dark:bg-slate-950 group">
            <Link to={`/`}>
              <img
                className="h-10 w-auto rounded-md hover:bg-gray-800"
                src="/images/tiny-chocobo.png"
                alt={data.site_name}
              />
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pb-24 no-scroll">
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
                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md animate-child'
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
                        className={`text-gray-300 hover:bg-gray-500 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md animate-child`}>
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
              <WikiLink />
              <DiscordLink />
              <p className="text-gray-400 text-xs mt-4">
                FINAL FANTASY is a registered trademark of Square Enix Holdings
                Co., Ltd.
                <br />© SQUARE ENIX CO., LTD. All Rights Reserved.
                <br />
                WORLD OF WARCRAFT is a registered trademark of Blizzard
                Entertainment, Inc.
                <br />© BLIZZARD ENTERTAINMENT, INC. All Rights Reserved.
              </p>
              <div id="ezoic-pub-ad-placeholder-118" />
            </nav>
          </div>
        </div>
      </div>
      {/* Nav bar */}
      <div className="md:pl-64 flex flex-col">
        <nav className="sticky top-0 z-40 flex-shrink-0 flex h-12 bg-white dark:bg-slate-900 shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex-1 px-4 flex justify-end">
            <ItemSearch />
            <div className={`ml-4 flex md:ml-6 basis-52 max-w-fit`}>
              <NavLink
                to={'/options'}
                type="button"
                className={classNames(
                  `group content-between flex flex-1`,
                  'hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500'
                )}>
                <div className={`flex flex-wrap pl-1.5 flex-1`}>
                  <div className="hidden md:flex gap-2 divide-x divide-gray-200 dark:divide-gray-700">
                    <div className="flex w-fit min-w-[150px]">
                      <div className="gap-1.5 flex items-center text-sm text-gray-500 dark:text-gray-200 basis-full dark:group-hover:text-gray-100">
                        <FlatFFXIVIcon
                          className="flex shrink-0 h-5 w-5 text-gray-400 dark:text-gray-200 group-hover:text-blue-500 dark:group-hover:text-gray-100"
                          aria-hidden="true"
                        />
                        <div className="flex flex-col">
                          <p className="text-xs">{data.data_center}</p>
                          <p className="text-sm font-medium">{data.world}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-fit min-w-[150px]">
                      <div className="pl-2 gap-1.5 flex items-center text-sm text-gray-500 dark:text-gray-200 basis-full dark:group-hover:text-gray-100">
                        <FlatWoWIcon
                          className="flex shrink-0 h-5 w-5 text-gray-400 dark:text-gray-200 group-hover:text-blue-500 dark:group-hover:text-gray-100"
                          aria-hidden="true"
                        />
                        <div className="flex flex-col">
                          <p className="text-xs">
                            {data.wowRegion === 'NA'
                              ? 'North America'
                              : 'Europe'}
                          </p>
                          <p className="text-sm font-medium">
                            {data.wowRealm.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:hidden items-center text-sm font-medium text-gray-500 dark:text-gray-200 basis-full mr-1.5 dark:group-hover:text-gray-100">
                    Settings
                  </div>
                </div>
                <div className={`flex md:hidden items-center pr-1.5`}>
                  <CogIcon
                    className="h-5 w-5 text-gray-400 dark:text-gray-200 basis-full group-hover:text-blue-500 dark:group-hover:text-gray-100"
                    aria-hidden="true"
                  />
                </div>
              </NavLink>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="bg-white dark:bg-slate-900 p-1 dark:hover:bg-slate-800 rounded-full text-gray-400 dark:text-gray-200 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <BellIcon
                  className="h-6 w-6 hover:text-blue-500 dark:hover:text-gray-100"
                  aria-hidden="true"
                />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="max-w-xs shrink-0 w-fit bg-white dark:bg-slate-900 dark:hover:bg-slate-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full shrink-0"
                      src="/images/tiny-chocobo.png"
                      alt="tiny-chocobo"
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
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <p
                      className={`text-gray-700 dark:text-gray-200 text-sm py-2 px-4`}>
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
        </nav>
        {children}
      </div>
    </>
  )
}

const ItemSearch = () => {
  const transition = useNavigation()
  const [itemName, setItemName] = useState('')
  const [game, setGame] = useState<'ffxiv' | 'wow'>('ffxiv')
  const [searchError, setSearchError] = useState<string | undefined>(undefined)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const isWoW = game === 'wow'

  const dataFormItemList = isWoW ? wowItemsList : ffxivItemsList

  const handleSearchSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!itemName.length) {
      event.preventDefault()
      return
    }

    const itemId = getItemIDByName(
      itemName.trim(),
      isWoW ? wowItems : undefined
    )

    if (!itemId) {
      event.preventDefault()
      setSearchError(`Item ${itemName} found`)
      return
    }

    const path = isWoW ? 'wow/item-data/' : '/queries/item-data/'
    navigate(path + itemId)
    setIsOpen(false)
  }

  const handleFormChange = (event: React.SyntheticEvent<EventTarget>) => {
    const value = (event.target as HTMLInputElement).value
    if (value === 'ffxiv' || value === 'wow') setGame(value)
  }

  const handleSelect = (debounced: string) => {
    setItemName(debounced)
    setSearchError(undefined)
  }

  const handleFormToggle = () => {
    setIsOpen((state) => !state)
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const isLoading = transition.state === 'loading'
  return (
    <div>
      <button
        type="button"
        onClick={handleFormToggle}
        className="h-full p-2 flex gap-2 px-1.5 group items-center justify-center md:hover:bg-gray-50 md:dark:hover:bg-slate-800">
        <SearchIcon className="h-6 w-6 text-gray-500 dark:text-gray-200 group-hover:text-blue-500 dark:group-hover:text-gray-100" />
        <p className="hidden md:block font-medium shrink-0 text-sm text-gray-500 dark:text-gray-200">
          Item Search
        </p>
      </button>
      {isOpen && (
        <div className="absolute w-full flex items-center h-28 md:h-16 px-4 left-0 shadow-lg py-1 bg-white dark:bg-slate-900 border-t border-black/5 dark:border-white/5 focus:outline-none">
          <Form
            method="POST"
            className="flex flex-col md:flex-row items-center my-2 gap-1 md:gap-2 h-full w-full">
            <div
              className="flex w-full md:w-fit p-1 rounded-md bg-gray-50 dark:bg-slate-700 items-center"
              onChange={handleFormChange}>
              <label
                htmlFor={`radio-ffxiv`}
                className="cursor-pointer w-full md:w-fit">
                <input
                  id={`radio-ffxiv`}
                  type="radio"
                  value={'ffxiv'}
                  name="game-items"
                  defaultChecked={game === 'ffxiv'}
                  className="peer hidden"
                />
                <span className="w-full md:w-fit inline-block text-center peer-checked:text-blue-500 peer-checked:bg-white dark:peer-checked:bg-slate-800 peer-checked:border-gray-200 dark:peer-checked:border-slate-700 text-gray-500 dark:text-gray-400 border border-transparent rounded-md hover:bg-gray-100 dark:hover:bg-slate-600 font-medium h-full px-3 py-1.5">
                  FFXIV
                </span>
              </label>
              <label
                htmlFor={`radio-wow`}
                className="cursor-pointer w-full md:w-fit">
                <input
                  id={`radio-wow`}
                  type="radio"
                  value={'wow'}
                  name="game-items"
                  defaultChecked={game === 'wow'}
                  className="peer hidden"
                />
                <span className="w-full md:w-fit inline-block text-center peer-checked:text-blue-500 peer-checked:bg-white dark:peer-checked:bg-slate-800 peer-checked:border-gray-200 dark:peer-checked:border-slate-700 text-gray-500 dark:text-gray-400 border border-transparent rounded-md hover:bg-gray-100 dark:hover:bg-slate-600 font-medium h-full px-3 py-1.5">
                  WoW
                </span>
              </label>
            </div>

            <div className="flex items-center w-full">
              <DebouncedSelectInput
                ref={inputRef}
                id="nav-search"
                selectOptions={dataFormItemList}
                formName={ITEM_DATA_FORM_NAME}
                onSelect={handleSelect}
                error={searchError}
                placeholder="Search items..."
                containerClassNames="w-full"
                useDebounce={true}
              />

              <SubmitButton
                title="Search"
                type="button"
                onClick={handleSearchSubmit}
                loading={isLoading}
                className=""
              />
            </div>
          </Form>
        </div>
      )}
    </div>
  )
}
