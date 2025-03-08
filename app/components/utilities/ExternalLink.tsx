import type { FC } from 'react'
import { LinkIcon } from '@heroicons/react/solid'

type Props = {
  link: string
  text?: string
  tooltip?: string
}

const ExternalLink: FC<Props> = ({ link, text, tooltip }) => {
  return (
    <a href={link} target={`_blank`} title={tooltip}>
      <span className='group inline-flex items-center rounded-md bg-black px-2.5 py-1 text-sm font-medium text-white cursor-pointer overflow-hidden'>
        <span
          className={`h-[26px] flex items-center group-hover:scale-110 transition ease-in-out duration-300`}
        >
          {text}
          <LinkIcon className={`h-4 w-4 inline align-text-bottom ml-1`} />
        </span>
      </span>
    </a>
  )
}

export default ExternalLink
