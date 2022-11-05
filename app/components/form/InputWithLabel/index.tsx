import React from 'react'
type InputWithLabelProps = {
  labelTitle: string
  inputTag?: string
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'className'
>

export const InputWithLabel = ({
  labelTitle,
  inputTag,
  ...rest
}: InputWithLabelProps) => (
  <div className="mt-2 flex-col">
    <label
      htmlFor={labelTitle}
      className="block text-sm font-medium text-gray-700 dark:text-grey-100">
      {labelTitle}
    </label>
    <div className="mt-1 flex rounded-md shadow-sm border border-gray-300">
      <input
        id={labelTitle}
        {...rest}
        className={`p-2 w-full ${
          inputTag
            ? 'rounded-l-md border-gray-300 border-0 border-r'
            : 'border-0 rounded-md'
        } focus:ring-blue-500 focus:border-2 focus:border-blue-500`}
      />
      {inputTag && (
        <span
          className={`inline-flex items-center justify-center text-center px-3 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm`}>
          {inputTag}
        </span>
      )}
    </div>
  </div>
)
