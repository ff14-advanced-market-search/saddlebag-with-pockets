import { Form } from '@remix-run/react'
import React from 'react'
import { SubmitButton } from '../SubmitButton'

const SmallFormContainer = ({
  children,
  title,
  error,
  onClick,
  loading,
  disabled,
  description,
  buttonTitle = 'Search'
}: {
  children: React.ReactNode
  title?: string
  error?: string
  loading?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
  description?: string | JSX.Element
  buttonTitle?: string
}) => {
  const descriptionForDisplay = description ? (
    typeof description === 'string' ? (
      <p className="italic text-sm text-grey-500 px-3 py-1 dark:text-gray-300 mb-1">
        {description}
      </p>
    ) : (
      description
    )
  ) : undefined
  return (
    <Form method="POST">
      <div className="max-w-4xl mx-auto px-4">
        {title && (
          <h1 className="text-2xl font-semibold text-blue-900 py-2 dark:text-gray-100">
            {title}
          </h1>
        )}
        {!!descriptionForDisplay && descriptionForDisplay}
        <div className="mt-0 md:col-span-3">
          <div className="shadow rounded-md px-4 bg-white dark:bg-slate-700">
            {children}
            <div className="px-0 sm:px-4 py-4 bg-white dark:bg-slate-700">
              <div className="flex flex-col justify-between items-start sm:flex-row">
                <p className="text-red-500 dark:text-red-300 mx-0 sm:mx-0 shrink-1">
                  {error}
                </p>
                <SubmitButton
                  title={buttonTitle}
                  onClick={onClick}
                  loading={loading}
                  disabled={disabled}
                  className="max-h-fit grow-0 ml-0 sm:ml-3 mt-2 sm:mt-0 shrink-0 self-start sm:self-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}

export default SmallFormContainer
