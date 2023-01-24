import { ToolTip } from './InfoToolTip'

export default function TitleTooltip({
  title,
  toolTip,
  className,
  relative,
  children
}: {
  title: string
  toolTip: string
  className?: string
  relative?: boolean
  children?: React.ReactNode
}) {
  return (
    <div
      className={`flex items-center my-1 gap-3${relative ? ' relative' : ''}`}>
      <p
        className={`text-sm font-semibold text-grey-800${
          className ? ` ${className}` : ''
        }`}>
        {title}
      </p>
      <ToolTip data={children ? children : toolTip} />
    </div>
  )
}
