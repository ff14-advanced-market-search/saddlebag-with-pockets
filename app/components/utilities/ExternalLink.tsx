import type { FC } from 'react'
import { LinkIcon } from '@heroicons/react/solid'

type Props = {
  link: string
  text?: string
  tooltip?: string
}

/**
 * Renders an external link with a styled text and an icon.
 * @example
 * externalLink({ link: 'https://example.com', text: 'Visit Site', tooltip: 'Click to visit' })
 * <a href="https://example.com" target="_blank" title="Click to visit"><span className="...">Visit Site<LinkIcon /></span></a>
 * @param {Object} params - The parameters for rendering the link.
 * @param {string} params.link - The URL of the external link.
 * @param {string} params.text - The text displayed for the link.
 * @param {string} params.tooltip - The text displayed on hover as a tooltip.
 * @returns {JSX.Element} A JSX element representing the styled external link.
 * @description
 *   - The link opens in a new tab.
 *   - The link includes a hover effect that scales the text.
 *   - An icon is displayed next to the text.
 */
const ExternalLink: FC<Props> = ({ link, text, tooltip }) => {
  return (
    <a href={link} target={`_blank`} title={tooltip}>
      <span className="group inline-flex items-center rounded-md bg-black px-2.5 py-1 text-sm font-medium text-white cursor-pointer overflow-hidden">
        <span
          className={`h-[26px] flex items-center group-hover:scale-110 transition ease-in-out duration-300`}>
          {text}
          <LinkIcon className={`h-4 w-4 inline align-text-bottom ml-1`} />
        </span>
      </span>
    </a>
  )
}

export default ExternalLink
