import { Link } from '@remix-run/react'

interface Props {
  name: string
  href: string
  description: string
  Icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  external?: boolean
}

/**
* Renders a styled tile link component, which includes an icon, title, and description, with support for both external and internal links.
* @example
* TileLink({ name: 'Home', description: 'Go to homepage', href: '/', Icon: HomeIcon, external: false })
* // Returns a JSX.Element with link pointing to homepage
* @param {Object} props - The properties object.
* @param {string} props.name - The name to be displayed on the tile.
* @param {string} props.description - A brief description to be shown on the tile.
* @param {string} props.href - The URL or path that the tile links to.
* @param {React.ComponentType} [props.Icon] - An optional icon component to be displayed on the tile.
* @param {boolean} props.external - Flag indicating whether the link is external or internal.
* @returns {JSX.Element} A JSX element representing the tile link.
* @description
*   - The component uses conditional rendering to differentiate between external and internal links.
*   - Applies a gradient border effect on hover for visual feedback.
*   - Utilizes Tailwind CSS classes for styling and theme adaptation.
*/
export default function TileLink({
  name,
  description,
  href,
  Icon,
  external
}: Props) {
  return (
    <div
      key={name}
      className={`group relative rounded-xl border border-slate-200 dark:border-0 dark:bg-slate-700`}>
      <div
        className={`absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.blue.50)),var(--quick-links-hover-bg,theme(colors.blue.50)))_padding-box,linear-gradient(to_top,theme(colors.yellow.400),theme(colors.yellow.400),theme(colors.blue.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]`}
      />
      <div className={`relative overflow-hidden rounded-xl p-6`}>
        {Icon && <Icon className={`w-8 h-8 dark:text-white`} />}
        <h2
          className={`mt-4 font-display text-base text-slate-900 dark:text-white`}>
          {external ? (
            <a href={href} target="_blank" rel="noreferrer">
              <span className={`absolute -inset-px rounded-xl`} />
              {name}
            </a>
          ) : (
            <Link to={href}>
              <span className={`absolute -inset-px rounded-xl`} />
              {name}
            </Link>
          )}
        </h2>
        <p className={`mt-1 text-sm text-slate-700 dark:text-slate-400`}>
          {description}
        </p>
      </div>
    </div>
  )
}
