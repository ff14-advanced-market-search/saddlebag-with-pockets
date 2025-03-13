import { classNames } from '~/utils'

/**
* Renders a styled title element as an <h1> header.
* @example
* renderTitle({ title: "Welcome", className: "custom-class" })
* // Returns: <h1 class="text-2xl font-semibold text-blue-900 py-2 dark:text-gray-100 custom-class">Welcome</h1>
* @param {Object} param0 - Contains properties for rendering the title.
* @param {string} param0.title - The text content for the <h1> element.
* @param {string} [param0.className] - Additional CSS class for styling the <h1> element.
* @returns {JSX.Element} A JSX <h1> element with specified styling and content.
* @description
*   - Combines default styles with optional external classes using `classNames`.
*   - Applies different text colors for light and dark themes.
*/
export const Title = ({
  title,
  className = ''
}: {
  title: string
  className?: string
}) => (
  <h1
    className={classNames(
      `text-2xl font-semibold text-blue-900 py-2 dark:text-gray-100`,
      className
    )}>
    {title}
  </h1>
)
