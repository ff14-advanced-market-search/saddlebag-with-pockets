import type { FC } from 'react'
import { LinkIcon } from '@heroicons/react/20/solid'

type Props = {
  link: string
}

/**
 * Renders a clickable badge link leading to a Square Enix page.
 * @example
 * FinalFantasyBadgedLink({ link: "https://www.example.com" })
 * // Returns a JSX anchor element with a Square Enix link
 * @param {string} link - The URL to navigate to when the badge is clicked.
 * @returns {JSX.Element} Returns an anchor element containing a link with a styled badge and icon.
 * @description
 *   - Uses an external Meteor logo image displayed within the badge.
 *   - The badge has a hover effect that scales the logo image.
 *   - Utilizes a LinkIcon next to the text to indicate a linkage behavior.
 */
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
