// app/components/utilities/CustomButton.tsx
import type { FC } from 'react'
import { LinkIcon } from '@heroicons/react/solid'
import { NavLink } from '@remix-run/react'

type Props = {
  link: string
  buttonText: string
}

/**
 * Renders a button that links to an external page.
 * @example
 * renderExternalLink({ link: 'https://example.com', buttonText: 'Visit Example' })
 * // Returns JSX component with a styled link button
 * @param {Object} params - The parameters object.
 * @param {string} params.link - The URL that the button will navigate to.
 * @param {string} params.buttonText - The text displayed on the button.
 * @returns {JSX.Element} A styled button component with a link icon.
 * @description
 *   - Opens the link in a new browser tab.
 *   - Applies hover effect to the button to indicate interactivity.
 *   - Utilizes Tailwind CSS utility classes for styling.
 */
const CustomButton: FC<Props> = ({ link, buttonText }) => {
  return (
    <NavLink to={link} target="_blank" title={buttonText}>
      <span className="inline-flex items-center rounded-md bg-black px-2.5 py-1 text-sm font-medium text-white">
        {buttonText}
        <LinkIcon className="h-4 w-4 ml-1" />
      </span>
    </NavLink>
  )
}

export default CustomButton
