import { ToolTip } from '~/components/Common/InfoToolTip'
import { classNames } from '~/utils'

export const TextArea = ({
  label,
  toolTip,
  formName,
  placeholder = 'Paste your data here...'
}: {
  label?: string
  formName?: string
  toolTip?: string
  placeholder?: string
}) => {
  const inputClassnames = classNames(
    'flex flex-1 items-center gap-1',
    toolTip ? 'relative' : ''
  )
  return (
    <div className="pt-2 flex-col">
      {label && (
        <div className={inputClassnames}>
          <label
            htmlFor={formName}
            className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            {label}
          </label>
          {toolTip && <ToolTip data={toolTip} />}
        </div>
      )}
      <div className="mt-1 flex rounded-md shadow-sm border border-gray-300 dark:border-gray-400">
        <textarea
          id={formName}
          name={formName}
          className="p-2 w-full border-0 rounded-md focus:ring-blue-500 focus:border-2 focus:border-blue-500 dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
          placeholder={placeholder}
          rows={5}
        />
      </div>
    </div>
  )
}
