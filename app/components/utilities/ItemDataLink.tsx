import type { FC } from 'react'
import { LinkIcon } from '@heroicons/react/20/solid'
import { NavLink } from '@remix-run/react'

type Props = {
  link: string
  title?: string
}

/**
 * Creates a navigation link to display item listing and history data.
 * @example
 * <ItemDataLink link="/item/123" title="View item data" />
 * // Returns a NavLink component configured for the specified item.
 * @param {string} link - The URL to navigate to upon clicking the link.
 * @param {string} [title='See item listing and history data'] - The title attribute for the NavLink, providing additional information on the link's purpose.
 * @returns {JSX.Element} A NavLink component styled for item data presentation.
 * @description
 *   - Uses Tailwind CSS classes for styling the appearance and transition effects.
 *   - Incorporates a 'LinkIcon' component visually indicating a hyperlink.
 *   - Opens the link in a new browser tab using the 'target' attribute with '_blank'.
 */
const ItemDataLink: FC<Props> = ({
  link,
  title = 'See item listing and history data'
}) => {
  return (
    <NavLink to={link} target={`_blank`} title={title}>
      <span className="group inline-flex items-center rounded-md bg-black px-2.5 py-1 text-sm font-medium text-white cursor-pointer overflow-hidden">
        <span
          className={`h-[26px] flex items-center group-hover:scale-110 transition ease-in-out duration-300`}>
          Item Data{' '}
          <LinkIcon className={`h-4 w-4 inline align-text-bottom ml-1`} />
        </span>
      </span>
    </NavLink>
  )
}

export default ItemDataLink
