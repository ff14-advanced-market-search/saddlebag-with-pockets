import { InformationCircleIcon } from '@heroicons/react/solid'

/**
 * This ToolTip component will position itself above it's first parent with a position 'absolute' or 'relative' css property.
 * At this moment in time it's max width will be the same as that same parent.
 */
export const ToolTip = ({ data }: { data: string }) => (
  <>
    <span className="peer shrink-0 max-w-5 max-h-5 text-sm">
      <InformationCircleIcon className="w-5 h-5" />
    </span>
    <span className="absolute -left-1 peer-hover:bottom-6 hover:bottom-6 hidden peer-hover:flex hover:flex bg-black opacity-80 text-sm text-white rounded px-3 py-1 z-50">
      {data}
    </span>
  </>
)
