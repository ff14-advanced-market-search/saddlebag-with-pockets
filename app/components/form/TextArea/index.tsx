import { ToolTip } from '~/components/Common/InfoToolTip'
import { classNames } from '~/utils'

/**
 * Creates a text area input component with optional label and tooltip.
 * @example
 * createTextArea({ label: 'Description', toolTip: 'Enter detailed description', formName: 'desc', placeholder: 'Type here...' })
 * <div>...</div>
 * @param {Object} argument - The configuration for the text area component.
 * @param {string} [argument.label] - The label for the text area.
 * @param {string} [argument.formName] - The name for the text area form input.
 * @param {string} [argument.toolTip] - The tooltip information for additional context.
 * @param {string} [argument.placeholder='Paste your data here...'] - The placeholder text inside the text area.
 * @returns {JSX.Element} A React component representing a styled text area input with optional label and tooltip.
 * @description
 *   - If `toolTip` is provided, a corresponding ToolTip component will be rendered.
 *   - Utilizes `classNames` utility to conditionally apply styles based on existence of `toolTip`.
 *   - The component supports dark mode styling.
 *   - The `textarea` has a default row count set to 5 for optimal text visibility.
 */
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
