import { classNames } from '~/utils'

/**
 * Renders a content container with optional custom styling.
 * @example
 * <ContentContainer className="custom-class">
 *   <p>Your content here</p>
 * </ContentContainer>
 * @param {JSX.Element} children - The content to be displayed inside the container.
 * @param {string} [className] - Additional custom class names for styling. Defaults to an empty string.
 * @returns {JSX.Element} A styled div container with the specified children and className.
 * @description
 *   - Utilizes Tailwind CSS classes for default styling.
 *   - Supports dark mode by toggling background color.
 */
export const ContentContainer = ({
  children,
  className = ''
}: {
  children: JSX.Element
  className?: string
}) => (
  <div
    className={classNames(
      'my-6 px-3 pb-2 pt-4 sm:rounded-md bg-white shadow dark:bg-slate-700',
      className
    )}>
    {children}
  </div>
)
