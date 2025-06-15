import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon, ChartSquareBarIcon } from '@heroicons/react/outline'
import { Link } from '@remix-run/react'

export const NotificationBell = () => {
  const [hasNotification, setHasNotification] = useState(true)

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
          {hasNotification && (
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
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/wow/weekly-price-group-delta-recommended"
                className={`${
                  active ? 'bg-gray-100 dark:bg-slate-800' : ''
                } block px-4 py-3 text-sm text-gray-700 dark:text-gray-200`}
                onClick={() => setHasNotification(false)}>
                <div className="flex items-start">
                  <ChartSquareBarIcon className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Try WoW Weekly Price Delta!</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Discover price trends and opportunities across different
                      realms with our new Weekly Price Delta feature. See full
                      11.2 investment guides in our discord!
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
