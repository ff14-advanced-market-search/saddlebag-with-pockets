import React from 'react'
import { ToolTip } from '~/components/Common/InfoToolTip'

type InputWithLabelProps = {
  labelTitle: string
  inputTag?: string
  toolTip?: string
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'className'
>

/**
 * Renders an input field with an associated label and optional tooltip and input tag.
 * @example
 * renderInputWithLabel({ labelTitle: "Name", inputTag: "$", toolTip: "Enter your name", type: "text" })
 * <div>...</div> // Returns a JSX div containing the labeled input
 * @param {Object} InputWithLabelProps - Object containing properties for rendering input with label.
 * @returns {JSX.Element} Returns a JSX element representing the labeled input with optional components.
 * @description
 *   - The input's max attribute defaults to 1000000000 if the type is 'number' and no max is provided.
 *   - Conditional rendering is used for the tooltip and input tag based on their presence.
 *   - Uses a predefined style set for consistent theming across light and dark modes.
 */
export const InputWithLabel = ({
  labelTitle,
  inputTag,
  toolTip,
  ...rest
}: InputWithLabelProps) => {
  const { type, max } = { ...rest }
  return (
    <div className="mt-2 flex-col">
      <div className="relative flex flex-1 items-center gap-1">
        <label
          htmlFor={labelTitle}
          className="block text-sm font-medium text-gray-700 dark:text-gray-100">
          {labelTitle}
        </label>
        {toolTip && <ToolTip data={toolTip} />}
      </div>
      <div className="mt-1 flex rounded-md shadow-sm border border-gray-300 dark:border-gray-400">
        <input
          id={labelTitle}
          {...rest}
          max={type === 'number' ? max ?? 1000000000 : undefined}
          className={`p-2 w-full ${
            inputTag
              ? 'rounded-l-md border-gray-300 border-0 border-r'
              : 'border-0 rounded-md'
          } focus:ring-blue-500 focus:border-2 focus:border-blue-500 dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600`}
        />
        {inputTag && (
          <span
            className={`inline-flex items-center justify-center text-center px-3 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm dark:text-gray-300 dark:bg-gray-700`}>
            {inputTag}
          </span>
        )}
      </div>
    </div>
  )
}
