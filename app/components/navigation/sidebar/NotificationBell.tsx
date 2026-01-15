import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  BellIcon,
  ChartSquareBarIcon,
  DocumentSearchIcon
} from '@heroicons/react/outline'
import { Link, useLocation } from '@remix-run/react'

interface Notification {
  id: string
  title: string
  description: string
  link: string
  icon: typeof ChartSquareBarIcon
  showOn: (pathname: string) => boolean
}

const notifications: Notification[] = [
  {
    id: 'wow-weekly-price-delta',
    title: 'Try WoW Weekly Price Delta!',
    description:
      'Discover price trends and investment opportunities across different realms with our new Weekly Price Delta feature.',
    link: '/wow/weekly-price-group-delta-recommended',
    icon: ChartSquareBarIcon,
    showOn: (pathname) => pathname.startsWith('/wow')
  },
  {
    id: 'wow-ultrarare-elite',
    title: 'Upgrade to Elite for Ultimate Snipe List Builder!',
    description:
      'Access the Ultra Rare search tool - the ultimate snipe list builder. Upgrade to Elite subscriber plans to find the rarest items with no competition across multiple realms.',
    link: '/wow/ultrarare/recommended',
    icon: DocumentSearchIcon,
    showOn: (pathname) => pathname.startsWith('/wow')
  },
  {
    id: 'ffxiv-weekly-price-delta',
    title: 'Try FFXIV Weekly Price Delta!',
    description:
      'Check out the new FFXIV Weekly Price Delta for market trends and investment opportunities for the next patch cycle.',
    link: '/ffxiv/weekly-price-group-delta-recommended',
    icon: ChartSquareBarIcon,
    showOn: (pathname) =>
      pathname.startsWith('/ffxiv') || pathname.startsWith('/queries')
  }
]

const STORAGE_KEY = 'viewedNotificationsV2'

export const NotificationBell = () => {
  const location = useLocation()
  const pathname = location.pathname
  const [viewed, setViewed] = useState<string[]>([])
  const [visibleNotifications, setVisibleNotifications] = useState<
    Notification[]
  >([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setViewed(JSON.parse(stored))
      } catch {
        setViewed([])
        // Remove corrupted entry so subsequent mounts don't keep failing
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    setVisibleNotifications(notifications.filter((n) => n.showOn(pathname)))
  }, [pathname])

  const hasUnviewed = visibleNotifications.some((n) => !viewed.includes(n.id))

  const handleClick = (id: string) => {
    if (!viewed.includes(id)) {
      const updated = [...viewed, id]
      setViewed(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        type="button"
        className="bg-white dark:bg-slate-900 p-1 dark:hover:bg-slate-800 rounded-full text-gray-400 dark:text-gray-200 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <span className="sr-only">View notifications</span>
        <div className="relative">
          <BellIcon
            className="h-6 w-6 hover:text-blue-500 dark:hover:text-gray-100"
            aria-hidden="true"
          />
          {hasUnviewed && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
          )}
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
          {visibleNotifications.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No notifications at this time
            </div>
          ) : (
            visibleNotifications.map((notification) => (
              <Menu.Item key={notification.id}>
                {({ active }) => (
                  <Link
                    to={notification.link}
                    className={`${
                      active ? 'bg-gray-100 dark:bg-slate-800' : ''
                    } block px-4 py-3 text-sm text-gray-700 dark:text-gray-200`}
                    onClick={() => handleClick(notification.id)}>
                    <div className="flex items-start">
                      <notification.icon className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}
              </Menu.Item>
            ))
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
