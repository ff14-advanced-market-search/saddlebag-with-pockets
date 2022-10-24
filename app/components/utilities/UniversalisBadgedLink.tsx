import type { FC } from 'react'
import UniversalisBadge from '~/components/icons/brands/UniversalisBadge'
import { LinkIcon } from '@heroicons/react/solid'

type Props = {
  link: string
}

const UniversalisBadgedLink: FC<Props> = ({ link }) => {
  return (
    <a href={link} target={`_blank`} title={`Open link in Universalis`}>
      <span className="group inline-flex items-center rounded-md bg-black px-2.5 py-1 text-sm font-medium text-white cursor-pointer overflow-hidden">
        <UniversalisBadge
          className={`w-[26px] h-[26px]  group-hover:scale-125 transition ease-in-out duration-300`}
        />
        <span className={`ml-2`}>
          <LinkIcon className={`h-4 w-4 inline align-text-bottom`} />
        </span>
      </span>
    </a>
  )
}

export default UniversalisBadgedLink
