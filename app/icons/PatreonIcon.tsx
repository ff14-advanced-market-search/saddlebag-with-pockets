import type { FC, PropsWithChildren } from 'react'

type SVGProps = PropsWithChildren<{ className: string }>

/**
 * Renders a Patreon SVG icon with customizable className
 * @example
 * renderPatreonIcon({ className: "icon-large" })
 * // Returns JSX for a Patreon SVG icon with "icon-large" class applied
 * @param {Object} props - The properties object.
 * @param {string} props.className - An optional className for styling the SVG element.
 * @returns {JSX.Element} A JSX element representing a Patreon icon.
 * @description
 *   - The SVG icon includes a circle and a rectangle path using specific dimensions.
 *   - The SVG uses currentColor for stroke and fill, allowing it to adapt to surrounding text color.
 *   - The component uses non-zero fill rule for the icon's path to determine the "insideness" of a point in the path.
 */
const PatreonIcon: FC<SVGProps> = (props) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="1"
      viewBox="0 0 22 26"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}>
      <g>
        <path
          fillRule="nonzero"
          d="M15 17a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm0-2a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM2 2h5v20H2V2zm2 2v16h1V4H4z"></path>
      </g>
    </svg>
  )
}

export default PatreonIcon
