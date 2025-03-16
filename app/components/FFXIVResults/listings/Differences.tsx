/**
 * Renders a styled component displaying a title and formatted amount.
 * @example
 * Differences({diffTitle: 'Price Difference', diffAmount: 300, className: 'highlight'})
 * // Returns a div element with a displayed title and amount
 * @param {string} diffTitle - The title to be displayed in the component.
 * @param {number|string} diffAmount - The amount to be displayed, formatted with commas.
 * @param {string} [className] - Optional additional class name for styling.
 * @returns {JSX.Element} A JSX element consisting of a styled div wrapping the title and formatted amount.
 * @description
 *   - Applies default styling that includes flexbox properties, max width, padding, shadow, border, and margin.
 *   - Adds any additional class names passed through the optional className parameter.
 */
export const Differences = ({
  diffTitle,
  diffAmount,
  className
}: {
  diffTitle: string
  diffAmount: number | string
  className?: string
}) => {
  return (
    <div
      className={`flex max-w-full flex-col px-2 py-1 shadow-sm border-gray-300 rounded-md items-center justify-center grow mx-1 my-1${
        className ? ` ${className}` : ''
      }`}>
      <p className="text-center">{diffTitle}</p>
      <p className="text-center">{diffAmount.toLocaleString()}</p>
    </div>
  )
}
