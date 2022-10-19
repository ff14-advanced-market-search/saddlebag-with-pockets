import type { FC } from 'react'
import { LinkIcon } from '@heroicons/react/solid'

type Props = {
  link: string
}

const ItemDataLink: FC<Props> = ({ link }) => {
  return (
    <a href={link} target={`_blank`} title={`Open link in Universalis`}>
      <span className="group inline-flex items-center rounded-md bg-black px-2.5 py-0.5 text-sm font-medium text-white cursor-pointer overflow-hidden">
        <span className={`ml-2`}>
          Item Data
          <LinkIcon className={`h-4 w-4 inline align-text-bottom`} />{' '}
        </span>
      </span>
    </a>
  )
}

export default ItemDataLink
