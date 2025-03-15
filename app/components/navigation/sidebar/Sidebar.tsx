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
  DocumentTextIcon,
  DocumentSearchIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilAltIcon,
  SearchIcon,
  ExclamationCircleIcon,
  ShoppingCartIcon,
  ExternalLinkIcon
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
import YoutubeIcon from '~/icons/YoutubeIcon'
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

/**
* Creates a Patreon link with a styled anchor element and an icon.
* @example
* createPatreonLink()
* // Returns a JSX element with a link to the Patreon page
* @param {None} None - This arrow function does not take any parameters.
* @returns {JSX.Element} A JSX anchor element styled for navigation with a Patreon link.
* @description
*   - Opens the link in a new tab using `target="_blank"`.
*   - Includes `rel="noreferrer"` for security reasons.
*   - Utilizes CSS classes for styling hover effects and icons.
*/
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

/**
* Creates a link to the GitHub wiki page for guides and tutorials.
* @example
* createGitHubLink()
* // Returns a JSX element representing an anchor tag linking to the wiki
* @returns {JSX.Element} A JSX element for the GitHub wiki link styled as a sidebar item.
* @description
*   - Applies specific styling for hover effects on text and background.
*   - Uses a GitHub icon with conditional class names for styling adjustments.
*   - The link opens in a new tab and is a focus element within a navigation sidebar.
*/
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

/**
 * Renders a styled anchor link component directing users to join a Discord server
 * @example
 * createDiscordLinkComponent()
 * <a>...</a>
 * @returns {JSX.Element} Styled anchor link directing the user to a Discord server.
 * @description
 *   - The link opens in a new tab and ensures security by using 'noreferrer'.
 *   - Utilizes Tailwind CSS classes for styling.
 *   - Includes a Discord icon that changes color on hover.
 */
const DiscordLink = () => (
  <a
    href={'https://discord.gg/saddlebag-exchange-973380473281724476'}
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
        href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki#ffxiv-alert-guides',
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
        icon: ShoppingCartIcon
      },
      {
        name: 'Allagan Data Reports',
        href: 'allagan-data',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Scrip Value Search',
        href: 'ffxiv/scrip-exchange',
        icon: ChartSquareBarIcon
      },
      {
        name: 'Extended Sale History',
        href: '/ffxiv/extended-history',
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
      }
    ]
  },
  {
    title: 'World of Warcraft',
    openMatch: '/wow/',
    links: [
      {
        name: 'Guides and Tutorials',
        href: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki#wow-general-guides',
        icon: DocumentSearchIcon,
        external: true
      },
      {
        name: 'Azeroth Auction Assassin Sniper',
        href: 'https://github.com/ff14-advanced-market-search/AzerothAuctionAssassin/blob/main/README.md',
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
        name: 'Raid BOE Ilvl Shopping List',
        href: '/wow/ilvl-shopping-list',
        icon: ShoppingCartIcon
      },
      {
        name: 'Raid BOE Ilvl Export Search',
        href: 'wow/ilvl-export-search',
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
      },
      {
        name: 'Out of Stock',
        href: '/wow/out-of-stock',
        icon: DocumentSearchIcon
      },
      {
        name: 'TSM to AAA converter Addon',
        href: 'https://www.curseforge.com/wow/addons/aaatransformer/latest',
        icon: DocumentSearchIcon,
        external: true
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
        name: 'Commodity Shortage Futures',
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
        name: 'API ReDocs',
        href: 'https://docs.saddlebagexchange.com/redoc',
        external: true,
        icon: GithubIcon
      },
      {
        name: 'API Swagger Docs',
        href: 'https://docs.saddlebagexchange.com/docs',
        external: true,
        icon: GithubIcon
      },
      {
        name: 'API Postman Collection',
        href: 'https://www.postman.com/restless-zodiac-865092/workspace/saddlebag-exchange-public-api',
        external: true,
        icon: GithubIcon
      },
      {
        name: 'YouTube',
        href: 'https://www.youtube.com/@saddlebagexchange',
        external: true,
        icon: YoutubeIcon
      },
      {
        name: 'Twitter / X',
        href: 'https://x.com/SaddlebagE36285',
        external: true,
        icon: YoutubeIcon
      },
      {
        name: 'blog',
        href: '/blog',
        icon: DocumentSearchIcon
      },
      {
        name: 'List of all WoW Items',
        href: '/wow/itemlist',
        icon: DocumentTextIcon
      },
      {
        name: 'List of all FFXIV Items',
        href: '/ffxiv/itemlist',
        icon: DocumentTextIcon
      },
      {
        name: 'Fandom',
        href: 'https://ffxivmarketboard.fandom.com/wiki/Ffxivmarketboard_Wiki',
        external: true,
        icon: ExternalLinkIcon
      },
      {
        name: 'Discord Webpage',
        href: 'https://discord.com/servers/saddlebag-exchange-973380473281724476',
        external: true,
        icon: DiscordIcon
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

/**
 * A collapsible sidebar component that toggles open and closed states.
 * @example
 * Sidebar({ title: 'My Title', children: <div>Content</div>, openOverride: true })
 * // Returns a sidebar component that is open due to the openOverride being true.
 * @param {string} title - The title displayed at the top of the sidebar button.
 * @param {React.ReactNode} children - The content displayed inside the sidebar when open.
 * @param {boolean} openOverride - Forces the sidebar open when true.
 * @returns {JSX.Element} The sidebar component which can be toggled open or closed.
 * @description
 *   - Uses React's useState hook to manage the sidebar's open state.
 *   - Changes sidebar appearance using conditional styling based on the open state.
 *   - Implements useEffect to synchronize sidebar's state with openOverride prop.
 *   - Includes animations for open and close actions using CSS classes.
 */
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

/**
 * Creates a responsive sidebar menu for both mobile and desktop views.
 * @example
 * SidebarComponent({ children: <Content />, data: { site_name: 'MySite' } })
 * // Returns a sidebar navigation component for different screen sizes
 * @param {Object} children - The content to be rendered inside the main layout when sidebar is closed.
 * @param {Object} data - An object containing site-specific metadata such as site_name, world, realm etc.
 * @returns {JSX.Element} A complete navigation component including sidebar and top navigation menu.
 * @description
 *   - Utilizes `useState` to manage mobile sidebar visibility.
 *   - Leverages `useMatches` to determine active navigation items based on current URL.
 *   - Incorporates animated transitions for mobile sidebar.
 *   - Contains multiple navigation links for different purposes like Patreon, Wiki, and Discord.
 */
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
              {/* <div id="ezoic-pub-ad-placeholder-118" /> */}
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

/**
 * Sidebar component for managing item search in specified games.
 * @example
 * Sidebar()
 * <div>
 *   <button type="button">...</button>
 *   <div>...</div>
 * </div>
 * @param {none} - This function does not take any parameters directly.
 * @returns {JSX.Element} The rendered sidebar component containing search functionality.
 * @description
 *   - Utilizes React hooks such as useState and useEffect for managing component state and lifecycle.
 *   - Offers item search functionality between two games: Final Fantasy XIV and World of Warcraft.
 *   - Navigates to specific item data based on search results using the `useNavigate` hook.
 *   - Toggles search input form visibility through a button click.
 */
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

  /**
  * Handles click events on a button to navigate to item data pages.
  * @example
  * handleClickEvent(event)
  * // Prevents navigation if itemName is empty or itemID is not found.
  * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event - The click event that triggers this handler.
  * @returns {void} Does not return any value.
  * @description
  *   - Prevents default action if itemName is empty or itemID cannot be retrieved.
  *   - Uses different API paths based on whether the isWoW boolean is true.
  *   - Updates navigation path with the item ID before navigating.
  *   - This function is used in the Sidebar component to fetch and display item data.
  */
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
