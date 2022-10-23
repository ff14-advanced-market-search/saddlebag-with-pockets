import type { FC } from 'react'
import UniversalisBadge from '~/components/icons/brands/UniversalisBadge'
import { LinkIcon } from '@heroicons/react/solid'

type Props = {
  link: string
}

const UniversalisBadgedLink: FC<Props> = ({ link }) => {
  const identifier = link.split('/').pop()
  return (
    <a href={link} target={`_blank`} title={`Open link in Universalis`}>
      <span className="group inline-flex items-center rounded-md bg-black px-2.5 py-0.5 text-sm font-medium text-white cursor-pointer overflow-hidden">
        <UniversalisBadge
          className={`w-6 h-6 scale-125 group-hover:scale-150 transition ease-in-out duration-300`}
        />
        <span className={`ml-2`}>
          {identifier}{' '}
          <LinkIcon className={`h-4 w-4 inline align-text-bottom`} />{' '}
        </span>
      </span>
    </a>
  )
}

export default UniversalisBadgedLink
