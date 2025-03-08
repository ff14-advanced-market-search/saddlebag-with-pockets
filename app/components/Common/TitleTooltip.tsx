import { ToolTip } from './InfoToolTip'

/**
 * Renders a title with an associated tooltip.
 *
 * This component displays a styled title alongside a tooltip element. Additional CSS classes
 * can be applied to the title via the "className" prop, and a "relative" class is added to the container
 * when the "relative" prop is true.
 *
 * @param title - The text to display as the title.
 * @param toolTip - The content to be shown within the tooltip.
 * @param className - Optional CSS classes for additional styling of the title text.
 * @param relative - If true, adds a 'relative' class to the container element.
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
      className={`flex items-center my-1 gap-3${relative ? ' relative' : ''}`}
    >
      <p
        className={`text-sm font-semibold text-grey-800 dark:text-gray-200${
          className ? ` ${className}` : ''
        }`}
      >
        {title}
      </p>
      <ToolTip data={toolTip} />
    </div>
  )
}
