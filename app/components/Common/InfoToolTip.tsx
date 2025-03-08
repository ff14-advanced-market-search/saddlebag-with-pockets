import { InformationCircleIcon } from '@heroicons/react/solid'
import React from 'react'

/**
 * This ToolTip component will position itself above it's first parent with a position 'absolute' or 'relative' css property.
 * At this moment in time it's max width will be the same as that same parent.
 */
export const ToolTip = ({ data }: { data: React.ReactNode }) => (
  <>
    <span className='peer shrink-0 max-w-5 max-h-5 text-sm'>
      <InformationCircleIcon className='w-5 h-5 dark:text-gray-300' />
    </span>
    <span className='absolute -left-1 peer-hover:bottom-6 hover:bottom-6 hidden peer-hover:block hover:block bg-black opacity-90 text-sm text-white rounded px-3 py-1 z-50'>
      {data}
    </span>
  </>
)
