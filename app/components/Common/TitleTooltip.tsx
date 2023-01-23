import { ToolTip } from './InfoToolTip'

export default function TitleTooltip({
  title,
  toolTip,
  className,
  relative,
  parseTooltipTags
}: {
  title: string
  toolTip: string
  className?: string
  relative?: boolean
  parseTooltipTags?: boolean
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
      <ToolTip data={toolTip} parseTags={parseTooltipTags} />
    </div>
  )
}
