/**
 * Renders a button component with additional styling and attributes.
 * @example
 * renderModalToggleButton({ className: 'extra-class', onClick: handleClick })
 * // Returns: A styled button within a div.
 * @param {Object} props - Properties for button customization.
 * @param {string} props.className - Additional class names for styling.
 * @param {Object} props.rest - Remaining props to be spread onto the button element.
 * @returns {JSX.Element} A JSX element of a div containing a button.
 * @description
 *   - Merges additional class names with default button styling.
 *   - Spreads additional HTML button attributes onto the button.
 *   - Supports theming with light and dark mode class toggling.
 */
export const ModalToggleButton = ({
  className,
  ...rest
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <div className={`mt-1 flex rounded-md shadow-sm max-w-fit`}>
      <button
        className={`w-full py-2 px-4 text-sm bg-gray-100 border-gray-300 rounded text-left dark:bg-gray-500 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-400${
          className ? ' ' + className : ''
        }`}
        {...rest}>
        {rest?.children}
      </button>
    </div>
  )
}
