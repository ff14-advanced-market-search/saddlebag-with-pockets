/**
 * Returns an SVG component representing an "X" mark icon.
 * @example
 * XMarkIcon({ className: 'icon-custom' })
 * <svg xmlns="http://www.w3.org/2000/svg" ...></svg>
 * @param {Object} {className} - An optional CSS class name to apply additional styling.
 * @returns {JSX.Element} SVG element for displaying an "X" mark icon.
 * @description
 *   - The SVG is designed with defined height and width properties: w-6 h-6.
 *   - Stroke and fill properties are configured to allow flexible styling.
 *   - Uses 'currentColor' for stroke to integrate with surrounding text color.
 */
const XMarkIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`w-6 h-6${className ? ` ${className}` : ''}`}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

export default XMarkIcon
