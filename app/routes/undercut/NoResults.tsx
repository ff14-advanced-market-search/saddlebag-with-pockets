import { ExclamationIcon } from '@heroicons/react/solid'
import type { FC } from 'react'
import ExternalLink from '~/components/utilities/ExternalLink'

const NoResults: FC<{ href: string }> = ({ href }) => {
  return (
    <div className="text-center py-6">
      <ExclamationIcon className={`h-12 w-12 text-gray-400 mx-auto`} />
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        We couldn't find the seller id.
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        A quick suggestion would be to check you entered the correct item, or
        check that your retainer name was correct.
      </p>
      <p className="text-sm text-gray-500">
        If you have tried the above and still seeing this error, search for item
        on the universalis app, to ensure that your retainer is listed on the
        item.
      </p>
      <div className="mt-6">
        <ExternalLink link={href} text="Universalis Page" />
      </div>
    </div>
  )
}

export default NoResults
