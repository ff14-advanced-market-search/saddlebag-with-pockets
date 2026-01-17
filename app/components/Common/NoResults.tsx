import {
  ExclamationCircleIcon as ExclamationIcon,
  MagnifyingGlassIcon as SearchIcon
} from '@heroicons/react/solid'
import type { FC } from 'react'
import { Link } from '@remix-run/react'
import React from 'react'

/**
 * Displays a 'no results' message with a search button when no results are found.
 * @example
 * NoResults({ href: '/search', children: <p>No items found.</p>, title: 'No matches!', buttonTitle: 'Try Again' })
 * Returns a styled message box indicating no search results with a retry button.
 * @param {string} href - URL to redirect when the search button is clicked, optional.
 * @param {React.ReactNode} children - Child elements to display additional information, optional.
 * @param {string} title - Title to display when no results are found, defaults to "We didn't get any results!".
 * @param {string} buttonTitle - Text for the search button, defaults to 'Search again'.
 * @returns {JSX.Element} A JSX element representing the 'no results' message with possible search button.
 * @description
 *   - Applies specific styling for both light and dark modes.
 *   - Conditionally renders a search button if `href` is provided.
 *   - Utilizes Tailwind CSS for styling elements and icons.
 */
const NoResults: FC<{
  href?: string
  children?: React.ReactNode
  title?: string
  buttonTitle?: string
}> = ({
  href,
  children,
  title = "We didn't get any results!",
  buttonTitle = 'Search again'
}) => {
  return (
    <div className="text-center m-3 py-6 dark:bg-slate-700 dark:rounded-md dark:text-gray-300">
      <ExclamationIcon className={`h-12 w-12 text-blue-400 mx-auto`} />
      <h3 className="mt-2 text-sm font-medium text-blue-900 dark:text-blue-300">
        {title}
      </h3>
      <div className="my-2">{children}</div>
      {href && (
        <div className="mt-6">
          <Link
            to={href}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <SearchIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {buttonTitle}
          </Link>
        </div>
      )}
    </div>
  )
}

export default NoResults
