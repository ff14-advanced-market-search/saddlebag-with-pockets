import { classNames } from '~/utils'

/**
 * Renders a styled H2 component with a given title and optional additional class names.
 * @example
 * <TitleH2 title="Sample Title" className="custom-class" />
 * // Returns: <h2> element with "Sample Title" text and specified classes
 * @param {Object} params - Object containing parameters for function.
 * @param {string} params.title - The title text to be displayed within the H2 element.
 * @param {string} [params.className] - Additional class names to be applied to the H2 element.
 * @returns {JSX.Element} A styled H2 JSX element with the specified title and classes.
 * @description
 *   - Combines additional class names with default styling for H2.
 *   - Supports dark mode styling for text color.
 */
export const TitleH2 = ({
  title,
  className = ''
}: {
  title: string
  className?: string
}) => (
  <h2
    className={classNames(
      `text-2xl font-semibold text-blue-900 py-2 dark:text-gray-100`,
      className
    )}>
    {title}
  </h2>
)
