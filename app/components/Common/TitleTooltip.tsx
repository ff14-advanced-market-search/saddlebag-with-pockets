import { ToolTip } from './InfoToolTip'

/**
 * Renders a title with an optional tooltip.
 * @example
 * TitleTooltip({
 *   title: "Username",
 *   toolTip: <span>User name must be unique.</span>,
 *   className: "customClass",
 *   relative: true
 * })
 * <div className="flex items-center my-1 gap-3 relative">
 *   <p className="text-sm font-semibold text-grey-800 dark:text-gray-200 customClass">
 *     Username
 *   </p>
 *   <ToolTip data={toolTip} />
 * </div>
 * @param {string} title - The title to display beside the tooltip.
 * @param {React.ReactNode} toolTip - The content for the tooltip.
 * @param {string} [className] - Optional additional CSS class names for styling.
 * @param {boolean} [relative] - Flag to apply relative positioning to the container.
 * @returns {JSX.Element} A JSX element containing the title and tooltip.
 * @description
 *   - Combines title text with a tooltip for enhanced information display.
 *   - Adds conditional CSS classes based on optional parameters.
 */
export default function TitleTooltip({
  title,
  toolTip,
  className,
  relative
}: {
  title: string
  toolTip: React.ReactNode
  className?: string
  relative?: boolean
}) {
  return (
    <div
      className={`flex items-center my-1 gap-3${relative ? ' relative' : ''}`}>
      <p
        className={`text-sm font-semibold text-grey-800 dark:text-gray-200${
          className ? ` ${className}` : ''
        }`}>
        {title}
      </p>
      <ToolTip data={toolTip} />
    </div>
  )
}
