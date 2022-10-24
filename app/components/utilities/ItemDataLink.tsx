import type { FC } from 'react'
import { LinkIcon } from '@heroicons/react/solid'
import { NavLink } from '@remix-run/react'

type Props = {
  link: string
}

const ItemDataLink: FC<Props> = ({ link }) => {
  return (
    <NavLink
      to={link}
      target={`_blank`}
      title={`See item listing and history data`}>
      <span className="group inline-flex items-center rounded-md bg-black px-2.5 py-0.5 text-sm font-medium text-white cursor-pointer overflow-hidden">
        <span className={`ml-2`}>
          Item Data <LinkIcon className={`h-4 w-4 inline align-text-bottom`} />
        </span>
      </span>
    </NavLink>
  )
}

export default ItemDataLink
