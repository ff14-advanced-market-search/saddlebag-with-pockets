import { ToolTip } from './InfoToolTip'

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
