import type { FC } from 'react'
import { LinkIcon } from '@heroicons/react/solid'

type Props = {
  link: string
}

const FinalFantasyBadgedLink: FC<Props> = ({ link }) => {
  return (
    <a href={link} target={`_blank`} title={`Open link to Square Enix`}>
      <span className="group inline-flex items-center justify-center rounded-md bg-black px-2.5 py-1 text-sm font-medium text-white cursor-pointer overflow-hidden">
        <img
          src={'/images/Meteor.png'}
          alt="Meteor logo"
          height="26px"
          width={'26px'}
          className="group-hover:scale-125 transition ease-in-out duration-300"
        />
        <span className={`ml-3`}>
          <LinkIcon className={`h-4 w-4 inline align-text-bottom`} />
        </span>
      </span>
    </a>
  )
}

export default FinalFantasyBadgedLink
