import { ExclamationIcon, SearchIcon } from '@heroicons/react/solid'
import type { FC } from 'react'
import { Link } from '@remix-run/react'
import React from 'react'

const NoResults: FC<{
  href: string
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
      <div className="mt-6">
        <Link
          to={href}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <SearchIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {buttonTitle}
        </Link>
      </div>
    </div>
  )
}

export default NoResults
